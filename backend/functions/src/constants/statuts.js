// Statuts partagés avec le frontend (voir CONTRAT-API.md).
const STATUT_VALIDATION = Object.freeze({
  EN_ATTENTE: "en_attente",
  APPROUVE: "approuve",
  REFUSE: "refuse",
});

const STATUT_COMMANDE = Object.freeze({
  EN_ATTENTE: "en_attente", // stock réservé, paiement non confirmé
  PAYEE: "payee", // paiement confirmé, QR code généré
  RETIREE: "retiree", // QR scanné par le commerçant
  ANNULEE: "annulee", // paiement échoué / expiré, stock restauré
});

const STATUT_PAIEMENT = Object.freeze({
  INITIE: "initie",
  REUSSI: "reussi",
  ECHOUE: "echoue",
  ANOMALIE: "anomalie", // montant / commande incohérents : à vérifier par l'admin
  A_REMBOURSER: "a_rembourser", // payé alors que la commande était déjà annulée
});

const STATUT_OFFRE = Object.freeze({ ACTIVE: "active", INACTIVE: "inactive" });

// Durée pendant laquelle le stock reste réservé pour une commande non payée.
const DUREE_RESERVATION_MIN = 30;

module.exports = {
  STATUT_VALIDATION, STATUT_COMMANDE, STATUT_PAIEMENT, STATUT_OFFRE, DUREE_RESERVATION_MIN,
};
