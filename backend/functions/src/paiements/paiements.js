const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { BUYER_ROLES } = require("../constants/roles");
const { STATUT_COMMANDE, STATUT_PAIEMENT } = require("../constants/statuts");
const { requireRole } = require("../auth/guards");
const { handle } = require("../utils/handler");
const { verifierPaiementKonnect } = require("./verification");
const { confirmerPaiement, traiterEchecPaiement, signalerAnomalie } = require("./service");

const KONNECT_KEY = defineSecret("KONNECT_API_KEY");
const KONNECT_WALLET = defineSecret("KONNECT_WALLET_ID");
// URL publique de konnectWebhook (à renseigner dans functions/.env, voir .env.example)
const KONNECT_WEBHOOK_URL = defineString("KONNECT_WEBHOOK_URL", { default: "" });
const KONNECT_API = "https://api.preprod.konnect.network/api/v2";

// ---- Initier le paiement (étudiant / association) ----
exports.initierPaiement = onCall({ secrets: [KONNECT_KEY, KONNECT_WALLET] },
  handle("initierPaiement", async (req) => {
    const acheteurId = requireRole(req, ...BUYER_ROLES);
    const webhook = KONNECT_WEBHOOK_URL.value();
    if (!webhook) throw new HttpsError("failed-precondition", "KONNECT_WEBHOOK_URL non configuré.");

    const cmdSnap = await db.doc(`commandes/${req.data?.commandeId}`).get();
    const cmd = cmdSnap.data();
    if (!cmd || cmd.etudiantId !== acheteurId) throw new HttpsError("permission-denied", "Commande invalide");
    if (cmd.statut !== STATUT_COMMANDE.EN_ATTENTE) throw new HttpsError("failed-precondition", "Commande déjà traitée");

    const res = await fetch(`${KONNECT_API}/payments/init-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": KONNECT_KEY.value() },
      body: JSON.stringify({
        receiverWalletId: KONNECT_WALLET.value(),
        amount: Math.round(cmd.total * 1000), // millimes
        token: "TND",
        orderId: cmdSnap.id,
        webhook,
      }),
    });
    const data = await res.json();
    if (!data.paymentRef) throw new HttpsError("internal", "Konnect a refusé la requête");

    await db.collection("paiements").doc(data.paymentRef).set({
      commandeId: cmdSnap.id,
      etudiantId: acheteurId,
      montant: cmd.total,
      modePaiement: "Konnect",
      statutPaiement: STATUT_PAIEMENT.INITIE,
      konnectRef: data.paymentRef,
      datePaiement: FieldValue.serverTimestamp(),
    });
    return { payUrl: data.payUrl };
  }));

// ---- Webhook Konnect ----
// On ne croit JAMAIS le corps de la requête : on reprend la référence, on
// interroge Konnect, puis on contrôle commande ET montant avant de confirmer.
exports.konnectWebhook = onRequest({ secrets: [KONNECT_KEY] }, async (req, res) => {
  try {
    const ref = typeof req.query.payment_ref === "string" ? req.query.payment_ref : "";
    if (!ref) return void res.sendStatus(400);

    const paySnap = await db.doc(`paiements/${ref}`).get();
    if (!paySnap.exists) return void res.sendStatus(404); // référence inconnue de nous
    const pay = paySnap.data();
    if (pay.modePaiement !== "Konnect") return void res.sendStatus(400);

    const r = await fetch(`${KONNECT_API}/payments/${encodeURIComponent(ref)}`, {
      headers: { "x-api-key": KONNECT_KEY.value() },
    });
    if (!r.ok) throw new Error(`Konnect HTTP ${r.status}`); // 500 -> Konnect réessaiera
    const { payment } = await r.json();

    const verdict = verifierPaiementKonnect(pay, payment);
    switch (verdict.etat) {
      case "reussi":
        await confirmerPaiement(ref);
        break;
      case "echec":
        await traiterEchecPaiement(ref, verdict.raison); // restaure le stock
        break;
      case "anomalie":
        console.error("ANOMALIE paiement", ref, JSON.stringify(verdict));
        await signalerAnomalie(ref, verdict.raison); // pas de QR, vérification manuelle
        break;
      default: // "attente" : rien à faire
        break;
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("ERREUR webhook :", err);
    res.sendStatus(500);
  }
});

// ---- SIMULATION LOCALE (émulateur uniquement ; à supprimer avant la production) ----
// data : { commandeId, succes?: boolean }  (succes = true par défaut ; false simule un échec)
exports.simulerPaiement = onCall(handle("simulerPaiement", async (req) => {
  if (process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new HttpsError("permission-denied", "Disponible uniquement en local");
  }
  const acheteurId = requireRole(req, ...BUYER_ROLES);

  const cmdSnap = await db.doc(`commandes/${req.data?.commandeId}`).get();
  const cmd = cmdSnap.data();
  if (!cmd || cmd.etudiantId !== acheteurId) throw new HttpsError("permission-denied", "Commande invalide");

  const payRef = db.collection("paiements").doc();
  await payRef.set({
    commandeId: cmdSnap.id, etudiantId: acheteurId, montant: cmd.total,
    modePaiement: "Simulation", statutPaiement: STATUT_PAIEMENT.INITIE, konnectRef: payRef.id,
    datePaiement: FieldValue.serverTimestamp(),
  });
  if (req.data?.succes === false) await traiterEchecPaiement(payRef.id, "simulation");
  else await confirmerPaiement(payRef.id);
  return { ok: true };
}));
