const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { BUYER_ROLES } = require("../constants/roles");
const { STATUT_COMMANDE, STATUT_OFFRE, DUREE_RESERVATION_MIN } = require("../constants/statuts");
const { requireRole } = require("../auth/guards");
const { handle } = require("../utils/handler");
const { annulerCommandeEtRestaurerStock } = require("./service");

// Étudiant OU association (l'association achète comme un étudiant).
exports.creerCommande = onCall(handle("creerCommande", async (req) => {
  const acheteurId = requireRole(req, ...BUYER_ROLES);

  const brutes = req.data?.lignes; // [{ offreId, quantite }]
  if (!Array.isArray(brutes) || brutes.length === 0) {
    throw new HttpsError("invalid-argument", "Panier vide");
  }

  // Fusionne les lignes qui visent la même offre (évite de dépasser le stock
  // en répétant une offre sur deux lignes).
  const quantites = new Map();
  for (const l of brutes) {
    if (!l || typeof l.offreId !== "string" || !l.offreId) {
      throw new HttpsError("invalid-argument", "offreId manquant");
    }
    if (!Number.isInteger(l.quantite) || l.quantite < 1) {
      throw new HttpsError("invalid-argument", "Quantité invalide");
    }
    quantites.set(l.offreId, (quantites.get(l.offreId) || 0) + l.quantite);
  }

  return db.runTransaction(async (tx) => {
    let total = 0;
    let commercantId = null;
    const lignesFinales = [];
    const maj = [];

    // Toutes les lectures AVANT les écritures (règle des transactions Firestore)
    for (const [offreId, quantite] of quantites) {
      const ref = db.doc(`offres/${offreId}`);
      const snap = await tx.get(ref);
      if (!snap.exists) throw new HttpsError("not-found", "Offre introuvable");

      const o = snap.data();
      if (o.statut === STATUT_OFFRE.INACTIVE) {
        throw new HttpsError("failed-precondition", `Offre indisponible : ${o.titre}`);
      }
      if (o.quantiteDisponible < quantite) {
        throw new HttpsError("failed-precondition", `Stock insuffisant : ${o.titre}`);
      }
      if (commercantId && commercantId !== o.commercantId) {
        throw new HttpsError("invalid-argument", "Une commande ne peut contenir que les offres d'un seul commerçant");
      }
      commercantId = o.commercantId;
      total += o.prixReduit * quantite;
      lignesFinales.push({ offreId, quantiteDemandee: quantite, prixUnitaire: o.prixReduit });
      maj.push({ ref, nouveauStock: o.quantiteDisponible - quantite });
    }
    total = Math.round(total * 1000) / 1000;

    // Écritures
    maj.forEach((m) => tx.update(m.ref, { quantiteDisponible: m.nouveauStock }));
    const cmdRef = db.collection("commandes").doc();
    tx.set(cmdRef, {
      etudiantId: acheteurId,
      commercantId,
      statut: STATUT_COMMANDE.EN_ATTENTE,
      total,
      lignes: lignesFinales,
      offreIds: lignesFinales.map((l) => l.offreId),
      dateCommande: FieldValue.serverTimestamp(),
      dateExpirationReservation: Timestamp.fromMillis(Date.now() + DUREE_RESERVATION_MIN * 60 * 1000),
    });
    return { commandeId: cmdRef.id, total };
  });
}));

// Filet de sécurité : une commande jamais payée libère son stock après
// DUREE_RESERVATION_MIN minutes. (Nécessite l'index de firestore.indexes.json.)
exports.annulerCommandesExpirees = onSchedule(
  { schedule: "every 5 minutes", timeZone: "Africa/Tunis" },
  async () => {
    const snap = await db.collection("commandes")
      .where("statut", "==", STATUT_COMMANDE.EN_ATTENTE)
      .where("dateExpirationReservation", "<", Timestamp.now())
      .limit(100).get();
    for (const doc of snap.docs) {
      try {
        await annulerCommandeEtRestaurerStock(doc.id, "reservation_expiree");
      } catch (err) {
        console.error("ERREUR annulerCommandesExpirees :", doc.id, err);
      }
    }
    console.log(`annulerCommandesExpirees : ${snap.size} commande(s) examinée(s)`);
  }
);
