const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const crypto = require("crypto");

setGlobalOptions({ region: "europe-west1" });
initializeApp();
const db = getFirestore();
const auth = getAuth();

// ========== ÉTAPE 1 : INSCRIPTION ==========
exports.inscrire = onCall(async (req) => {
  try {
    if (!req.auth) throw new HttpsError("unauthenticated", "Connexion requise");

    const { nom, telephone, role, extra = {} } = req.data;
    if (!["etudiant", "commercant", "association"].includes(role))
      throw new HttpsError("invalid-argument", "Rôle invalide");

    const uid = req.auth.uid;
    const base = {
      uid, nom, telephone, role,
      email: req.auth.token.email || null,
      dateCreation: FieldValue.serverTimestamp(),
    };
    if (role === "etudiant") Object.assign(base, { soldeEcoPoints: 0, niveauFidelite: "Bronze" });
    if (role === "commercant") Object.assign(base, { ...extra, valideParAdmin: false });
    if (role === "association") Object.assign(base, extra);

    await db.doc(`users/${uid}`).set(base);
    await auth.setCustomUserClaims(uid, { role });
    return { ok: true };
  } catch (err) {
    console.error("ERREUR inscrire :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});

// ========== ADMIN : VALIDER UN COMMERÇANT ==========
exports.validerCommercant = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "admin")
      throw new HttpsError("permission-denied", "Admin requis");

    await db.doc(`users/${req.data.commercantId}`).update({ valideParAdmin: true });
    return { ok: true };
  } catch (err) {
    console.error("ERREUR validerCommercant :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});
// ========== ÉTAPE 2 : CRÉER UNE COMMANDE ==========
exports.creerCommande = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "etudiant")
      throw new HttpsError("permission-denied", "Étudiant requis");

    const { lignes } = req.data; // [{ offreId, quantite }]
    if (!Array.isArray(lignes) || lignes.length === 0)
      throw new HttpsError("invalid-argument", "Panier vide");

    return await db.runTransaction(async (tx) => {
      let total = 0;
      let commercantId = null;
      const lignesFinales = [];
      const maj = [];

      // Toutes les lectures AVANT les écritures (règle des transactions Firestore)
      for (const l of lignes) {
        if (!Number.isInteger(l.quantite) || l.quantite < 1)
          throw new HttpsError("invalid-argument", "Quantité invalide");

        const ref = db.doc(`offres/${l.offreId}`);
        const snap = await tx.get(ref);
        if (!snap.exists) throw new HttpsError("not-found", "Offre introuvable");

        const o = snap.data();
        if (o.quantiteDisponible < l.quantite)
          throw new HttpsError("failed-precondition", `Stock insuffisant : ${o.titre}`);
        if (commercantId && commercantId !== o.commercantId)
          throw new HttpsError("invalid-argument", "Une commande ne peut contenir que les offres d'un seul commerçant");

        commercantId = o.commercantId;
        total += o.prixReduit * l.quantite;
        lignesFinales.push({ offreId: l.offreId, quantiteDemandee: l.quantite, prixUnitaire: o.prixReduit });
        maj.push({ ref, nouveauStock: o.quantiteDisponible - l.quantite });
      }

      // Écritures
      maj.forEach((m) => tx.update(m.ref, { quantiteDisponible: m.nouveauStock }));
      const cmdRef = db.collection("commandes").doc();
      tx.set(cmdRef, {
        etudiantId: req.auth.uid,
        commercantId,
        statut: "en_attente",
        total,
        lignes: lignesFinales,
        dateCommande: FieldValue.serverTimestamp(),
      });
      return { commandeId: cmdRef.id, total };
    });
  } catch (err) {
    console.error("ERREUR creerCommande :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});
// ========== ÉTAPE 3 : PAIEMENT ==========
const { defineSecret } = require("firebase-functions/params");
const KONNECT_KEY = defineSecret("KONNECT_API_KEY");
const KONNECT_WALLET = defineSecret("KONNECT_WALLET_ID");

// Logique commune : paiement réussi -> commande payée + QR code
async function confirmerPaiement(paymentId) {
  const payRef = db.doc(`paiements/${paymentId}`);
  const paySnap = await payRef.get();
  if (!paySnap.exists) throw new Error("Paiement introuvable");
  const pay = paySnap.data();
  if (pay.statutPaiement === "reussi") return; // idempotent : pas de double QR

  const batch = db.batch();
  batch.update(payRef, { statutPaiement: "reussi" });
  batch.update(db.doc(`commandes/${pay.commandeId}`), { statut: "payee" });
  batch.set(db.collection("qrcodes").doc(), {
    commandeId: pay.commandeId,
    etudiantId: pay.etudiantId,
    codeUnique: crypto.randomUUID(),
    estScanne: false,
    dateGeneration: FieldValue.serverTimestamp(),
  });
  await batch.commit();
}

// Initier le paiement
exports.initierPaiement = onCall({ secrets: [KONNECT_KEY, KONNECT_WALLET] }, async (req) => {
  try {
    if (req.auth?.token.role !== "etudiant")
      throw new HttpsError("permission-denied", "Étudiant requis");

    const cmdSnap = await db.doc(`commandes/${req.data.commandeId}`).get();
    const cmd = cmdSnap.data();
    if (!cmd || cmd.etudiantId !== req.auth.uid)
      throw new HttpsError("permission-denied", "Commande invalide");
    if (cmd.statut !== "en_attente")
      throw new HttpsError("failed-precondition", "Commande déjà traitée");

    const res = await fetch("https://api.preprod.konnect.network/api/v2/payments/init-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": KONNECT_KEY.value() },
      body: JSON.stringify({
        receiverWalletId: KONNECT_WALLET.value(),
        amount: Math.round(cmd.total * 1000), // millimes
        token: "TND",
        orderId: cmdSnap.id,
        webhook: "https://VOTRE_URL/konnectWebhook",
      }),
    });
    const data = await res.json();
    if (!data.paymentRef) throw new HttpsError("internal", "Konnect a refusé la requête");

    await db.collection("paiements").doc(data.paymentRef).set({
      commandeId: cmdSnap.id,
      etudiantId: req.auth.uid,
      montant: cmd.total,
      modePaiement: "Konnect",
      statutPaiement: "initie",
      konnectRef: data.paymentRef,
      datePaiement: FieldValue.serverTimestamp(),
    });
    return { payUrl: data.payUrl };
  } catch (err) {
    console.error("ERREUR initierPaiement :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});

// Webhook appelé par Konnect (revérifie toujours auprès de Konnect)
exports.konnectWebhook = onRequest({ secrets: [KONNECT_KEY] }, async (req, res) => {
  try {
    const ref = req.query.payment_ref;
    const r = await fetch(`https://api.preprod.konnect.network/api/v2/payments/${ref}`, {
      headers: { "x-api-key": KONNECT_KEY.value() },
    });
    const { payment } = await r.json();
    if (payment.status === "completed") await confirmerPaiement(ref);
    else await db.doc(`paiements/${ref}`).update({ statutPaiement: "echoue" });
    res.sendStatus(200);
  } catch (err) {
    console.error("ERREUR webhook :", err);
    res.sendStatus(500);
  }
});

// SIMULATION LOCALE (à supprimer avant la production)
exports.simulerPaiement = onCall(async (req) => {
  if (process.env.FUNCTIONS_EMULATOR !== "true")
    throw new HttpsError("permission-denied", "Disponible uniquement en local");
  if (req.auth?.token.role !== "etudiant")
    throw new HttpsError("permission-denied", "Étudiant requis");

  const cmdSnap = await db.doc(`commandes/${req.data.commandeId}`).get();
  const cmd = cmdSnap.data();
  if (!cmd || cmd.etudiantId !== req.auth.uid)
    throw new HttpsError("permission-denied", "Commande invalide");

  const payRef = db.collection("paiements").doc();
  await payRef.set({
    commandeId: cmdSnap.id, etudiantId: req.auth.uid, montant: cmd.total,
    modePaiement: "Simulation", statutPaiement: "initie", konnectRef: payRef.id,
    datePaiement: FieldValue.serverTimestamp(),
  });
  await confirmerPaiement(payRef.id);
  return { ok: true };
});
// ========== ÉTAPE 4 : RETRAIT PAR QR CODE ==========
exports.validerRetrait = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "commercant")
      throw new HttpsError("permission-denied", "Commerçant requis");

    const q = await db.collection("qrcodes")
      .where("codeUnique", "==", req.data.codeUnique).limit(1).get();
    if (q.empty) throw new HttpsError("not-found", "QR invalide");

    const qrDoc = q.docs[0];
    const qr = qrDoc.data();
    if (qr.estScanne) throw new HttpsError("failed-precondition", "QR déjà utilisé");

    const cmdRef = db.doc(`commandes/${qr.commandeId}`);
    const cmd = (await cmdRef.get()).data();
    if (cmd.commercantId !== req.auth.uid)
      throw new HttpsError("permission-denied", "Ce n'est pas votre commande");

    const nbArticles = cmd.lignes.reduce((s, l) => s + l.quantiteDemandee, 0);
    const batch = db.batch();
    batch.update(qrDoc.ref, { estScanne: true });
    batch.update(cmdRef, { statut: "retiree" });
    batch.update(db.doc(`users/${cmd.etudiantId}`), {
      soldeEcoPoints: FieldValue.increment(nbArticles * 10),
    });
    batch.set(db.doc("stats/impactEco"), {
      totalCommandes: FieldValue.increment(1),
      totalNourritureSauveeKg: FieldValue.increment(nbArticles * 0.5), // estimation
    }, { merge: true });
    await batch.commit();
    return { ok: true };
  } catch (err) {
    console.error("ERREUR validerRetrait :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});
// ==========================================
// ========== 5. AGENT IA & FEEDBACKS =======
// ==========================================

// Soumettre un feedback (Étudiant)
exports.soumettreFeedback = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "etudiant")
      throw new HttpsError("permission-denied", "Étudiant requis");

    const { note, commentaire } = req.data;
    if (!Number.isInteger(note) || note < 1 || note > 5)
      throw new HttpsError("invalid-argument", "Note invalide (1 à 5)");

    const feedbackRef = db.collection("feedbacks").doc();
    await feedbackRef.set({
      etudiantId: req.auth.uid,
      note,
      commentaire: commentaire || "",
      dateSoumission: FieldValue.serverTimestamp(),
    });

    return { ok: true, feedbackId: feedbackRef.id };
  } catch (err) {
    console.error("ERREUR soumettreFeedback :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});

// Analyse par l'Agent IA et génération de suggestions (Admin / Agent IA)
exports.analyserFeedbacksIA = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "admin")
      throw new HttpsError("permission-denied", "Admin requis");

    // Récupérer les derniers feedbacks
    const snapshot = await db.collection("feedbacks").orderBy("dateSoumission", "desc").limit(50).get();
    if (snapshot.empty)
      return { ok: true, message: "Aucun feedback à analyser" };

    let sommeNotes = 0;
    let total = 0;
    snapshot.forEach((doc) => {
      sommeNotes += doc.data().note;
      total++;
    });
    const moyenne = sommeNotes / total;

    // Simulation de l'analyse IA (génération de suggestion basée sur la moyenne)
    const suggestionTexte = moyenne < 3 
      ? `Attention : La note moyenne récente est de ${moyenne.toFixed(1)}/5. Il est recommandé de revoir la qualité des offres ou les horaires de récupération.`
      : `Satisfaction élevée (${moyenne.toFixed(1)}/5). Les étudiants apprécient globalement les offres actuelles. Continuer sur cette lancée.`;

    const suggestionRef = db.collection("suggestionsIA").doc();
    await suggestionRef.set({
      idAgent: "AgentIA-01",
      analyseMoyenne: moyenne,
      totalFeedbacksAnalyses: total,
      suggestion: suggestionTexte,
      dateGeneration: FieldValue.serverTimestamp(),
    });

    return { ok: true, suggestionId: suggestionRef.id, moyenne };
  } catch (err) {
    console.error("ERREUR analyserFeedbacksIA :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});


// ==========================================
// ====== 6. COMMANDES GROUPÉES (ASSOCIATION) =
// ==========================================

// Initier une commande groupée (Association)
exports.envoyerDemandeGroupee = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "association")
      throw new HttpsError("permission-denied", "Association requise");

    const { nomEvenement, dateEvenement } = req.data;
    if (!nomEvenement || !dateEvenement)
      throw new HttpsError("invalid-argument", "Nom et date de l'événement requis");

    const cmdGroupeeRef = db.collection("commandesGroupees").doc();
    await cmdGroupeeRef.set({
      associationId: req.auth.uid,
      nomEvenement,
      dateEvenement: new Date(dateEvenement),
      statutDemande: "en_attente",
      dateCreation: FieldValue.serverTimestamp(),
    });

    return { ok: true, commandeGroupeeId: cmdGroupeeRef.id };
  } catch (err) {
    console.error("ERREUR envoyerDemandeGroupee :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});

// Traiter / Répondre à une commande groupée (Commerçant)
exports.accepterOuRefuserProposition = onCall(async (req) => {
  try {
    if (req.auth?.token.role !== "commercant")
      throw new HttpsError("permission-denied", "Commerçant requis");

    const { commandeGroupeeId, action } = req.data; // action: 'accepte' ou 'refuse'
    if (!["accepte", "refuse"].includes(action))
      throw new HttpsError("invalid-argument", "Action invalide");

    const ref = db.doc(`commandesGroupees/${commandeGroupeeId}`);
    const snap = await ref.get();
    if (!snap.exists) throw new HttpsError("not-found", "Commande groupée introuvable");

    await ref.update({
      statutDemande: action === "accepte" ? "acceptee" : "refusee",
      commercantId: req.auth.uid,
    });

    return { ok: true };
  } catch (err) {
    console.error("ERREUR accepterOuRefuserProposition :", err);
    if (err instanceof HttpsError) throw err;
    throw new HttpsError("internal", String(err && err.message ? err.message : err));
  }
});
