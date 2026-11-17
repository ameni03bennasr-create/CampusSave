// Logique partagée commandes / paiements (pas d'endpoint ici).
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { STATUT_COMMANDE } = require("../constants/statuts");

// Annule une commande NON PAYÉE et remet le stock réservé, dans UNE transaction.
// Idempotent : si la commande n'est plus "en_attente", ne fait rien (retourne false).
async function annulerCommandeEtRestaurerStock(commandeId, motif) {
  const cmdRef = db.doc(`commandes/${commandeId}`);
  return db.runTransaction(async (tx) => {
    const cmdSnap = await tx.get(cmdRef);
    if (!cmdSnap.exists) return false;
    const cmd = cmdSnap.data();
    if (cmd.statut !== STATUT_COMMANDE.EN_ATTENTE) return false;

    const offreRefs = cmd.lignes.map((l) => db.doc(`offres/${l.offreId}`));
    const offreSnaps = offreRefs.length ? await tx.getAll(...offreRefs) : [];

    offreSnaps.forEach((snap, i) => {
      // Offre supprimée entre-temps : rien à restaurer.
      if (snap.exists) {
        tx.update(snap.ref, { quantiteDisponible: FieldValue.increment(cmd.lignes[i].quantiteDemandee) });
      }
    });
    tx.update(cmdRef, {
      statut: STATUT_COMMANDE.ANNULEE,
      motifAnnulation: motif,
      dateAnnulation: FieldValue.serverTimestamp(),
    });
    return true;
  });
}

module.exports = { annulerCommandeEtRestaurerStock };
