// Logique partagée du paiement (pas d'endpoint ici).
const crypto = require("crypto");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { STATUT_COMMANDE, STATUT_PAIEMENT } = require("../constants/statuts");
const { annulerCommandeEtRestaurerStock } = require("../commandes/service");

// Paiement réussi : commande payée + QR code, en UNE transaction.
// Revérifie ici que la commande est encore payable et que le montant correspond.
async function confirmerPaiement(paymentId) {
  const payRef = db.doc(`paiements/${paymentId}`);
  return db.runTransaction(async (tx) => {
    const paySnap = await tx.get(payRef);
    if (!paySnap.exists) throw new Error("Paiement introuvable");
    const pay = paySnap.data();
    if (pay.statutPaiement === STATUT_PAIEMENT.REUSSI) return { deja: true }; // idempotent

    const cmdRef = db.doc(`commandes/${pay.commandeId}`);
    const cmdSnap = await tx.get(cmdRef);
    if (!cmdSnap.exists) throw new Error("Commande introuvable");
    const cmd = cmdSnap.data();

    // Argent reçu mais commande déjà annulée (stock rendu) : à rembourser, pas de QR.
    if (cmd.statut === STATUT_COMMANDE.ANNULEE) {
      tx.update(payRef, { statutPaiement: STATUT_PAIEMENT.A_REMBOURSER });
      return { anomalie: "commande_annulee" };
    }
    if (cmd.statut !== STATUT_COMMANDE.EN_ATTENTE) return { deja: true };

    if (Math.round(cmd.total * 1000) !== Math.round(pay.montant * 1000)) {
      tx.update(payRef, { statutPaiement: STATUT_PAIEMENT.ANOMALIE, raisonAnomalie: "montant_commande" });
      return { anomalie: "montant_commande" };
    }

    tx.update(payRef, { statutPaiement: STATUT_PAIEMENT.REUSSI, dateConfirmation: FieldValue.serverTimestamp() });
    tx.update(cmdRef, { statut: STATUT_COMMANDE.PAYEE });
    tx.set(db.doc(`qrcodes/${pay.commandeId}`), { // 1 QR par commande (id = commandeId)
      commandeId: pay.commandeId,
      etudiantId: pay.etudiantId,
      codeUnique: crypto.randomUUID(),
      estScanne: false,
      dateGeneration: FieldValue.serverTimestamp(),
    });
    return { ok: true };
  });
}

// Paiement échoué : paiement -> echoue, commande -> annulee, stock restauré.
async function traiterEchecPaiement(paymentId, raison) {
  const payRef = db.doc(`paiements/${paymentId}`);
  const snap = await payRef.get();
  if (!snap.exists) throw new Error("Paiement introuvable");
  const pay = snap.data();
  if (pay.statutPaiement === STATUT_PAIEMENT.REUSSI) return false; // jamais écraser un succès

  await payRef.update({ statutPaiement: STATUT_PAIEMENT.ECHOUE, raisonEchec: raison || null });
  return annulerCommandeEtRestaurerStock(pay.commandeId, "paiement_echoue");
}

async function signalerAnomalie(paymentId, raison) {
  await db.doc(`paiements/${paymentId}`).update({
    statutPaiement: STATUT_PAIEMENT.ANOMALIE,
    raisonAnomalie: raison,
  });
}

module.exports = { confirmerPaiement, traiterEchecPaiement, signalerAnomalie };
