// Fonction PURE (sans Firebase) : décide quoi faire d'une réponse Konnect.
// Testable seule : voir scripts/testUnit.js
//
// pay     = notre document paiements/{ref}   (montant en TND, commandeId)
// payment = objet "payment" renvoyé par GET /payments/{ref} chez Konnect
//
// ATTENTION : on suppose que payment.amount est en millimes, comme à l'envoi
// (amount = total * 1000). À confirmer sur le sandbox Konnect.
function verifierPaiementKonnect(pay, payment) {
  if (!payment || typeof payment !== "object") {
    return { etat: "anomalie", raison: "reponse_konnect_invalide" };
  }

  // La commande annoncée par Konnect doit être celle de notre paiement.
  if (payment.orderId !== undefined && payment.orderId !== null
      && String(payment.orderId) !== pay.commandeId) {
    return { etat: "anomalie", raison: "commande_differente" };
  }

  const status = String(payment.status || "").toLowerCase();

  if (status === "completed") {
    const attendu = Math.round(pay.montant * 1000);
    const recu = Number(payment.amount);
    if (!Number.isFinite(recu) || recu !== attendu) {
      return { etat: "anomalie", raison: "montant_different", attendu, recu };
    }
    if (payment.token && String(payment.token).toUpperCase() !== "TND") {
      return { etat: "anomalie", raison: "devise_differente" };
    }
    return { etat: "reussi" };
  }

  if (status === "pending") return { etat: "attente" }; // pas encore payé : on ne touche à rien
  return { etat: "echec", raison: status || "statut_inconnu" };
}

module.exports = { verifierPaiementKonnect };
