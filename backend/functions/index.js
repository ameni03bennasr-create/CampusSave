// Point d'entrée : ne contient AUCUNE logique, il assemble les modules.
// Architecture retenue : Firebase Cloud Functions (callable onCall + 1 webhook HTTP),
// voir CONTRAT-API.md à la racine du projet.
const { setGlobalOptions } = require("firebase-functions/v2");

// Doit être appelé AVANT de charger les modules (la région s'applique à chaque fonction).
setGlobalOptions({ region: "europe-west1" });

Object.assign(
  exports,
  require("./src/auth/completeRegistration"), // inscription (unique)
  require("./src/admin/commercants"), // valider / refuser / lister les commerçants
  require("./src/offres/offres"), // CRUD + filtrage des offres
  require("./src/commandes/commandes"), // creerCommande + annulation des réservations expirées
  require("./src/paiements/paiements"), // initierPaiement, konnectWebhook, simulerPaiement
  require("./src/retrait/retrait"), // validerRetrait (QR)
  require("./src/feedbacks/feedbacks"), // feedbacks + Agent IA
  require("./src/groupees/groupees") // commandes groupées (association -> commerçant)
);
