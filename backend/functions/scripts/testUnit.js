// Tests SANS émulateur (logique pure) : node scripts/testUnit.js
const { verifierPaiementKonnect } = require("../src/paiements/verification");
const { validerCreation, validerModification } = require("../src/validators/offres");
const { validateRegistrationData } = require("../src/validators/registration");
const { ROLES, roleAtSignup, SELF_REGISTRATION_ROLES } = require("../src/constants/roles");

let echecs = 0;
const check = (nom, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${nom} ${ok ? "" : detail}`);
  if (!ok) echecs++;
};
const leve = (fn) => { try { fn(); return null; } catch (e) { return e.code || e.message; } };

// --- Rôles ---
check("Rôles unifiés (français)", JSON.stringify(Object.values(ROLES).sort()) ===
  JSON.stringify(["admin", "association", "commercant", "commercant_en_attente", "etudiant"]));
check("admin jamais auto-inscriptible", !SELF_REGISTRATION_ROLES.includes("admin"));
check("commercant -> commercant_en_attente à l'inscription", roleAtSignup("commercant") === "commercant_en_attente");
check("etudiant reste etudiant", roleAtSignup("etudiant") === "etudiant");

// --- Inscription : anciens noms refusés ---
check("Ancien rôle 'student' refusé", leve(() => validateRegistrationData({ role: "student", nom: "Test" })) === "invalid-argument");
check("Ancien rôle 'merchant' refusé", leve(() => validateRegistrationData({ role: "merchant", nom: "Test" })) === "invalid-argument");
check("Rôle 'admin' refusé", leve(() => validateRegistrationData({ role: "admin", nom: "Test" })) === "invalid-argument");
check("Étudiant valide", validateRegistrationData({ role: "etudiant", nom: "Sami Ben Ali", telephone: "20123456" }).role === "etudiant");

// --- Paiement Konnect : vérification montant + commande ---
const pay = { commandeId: "CMD1", montant: 7 };
let v = verifierPaiementKonnect(pay, { status: "completed", amount: 7000, orderId: "CMD1", token: "TND" });
check("Paiement correct accepté", v.etat === "reussi", JSON.stringify(v));
v = verifierPaiementKonnect(pay, { status: "completed", amount: 1000, orderId: "CMD1" });
check("Montant différent -> anomalie", v.etat === "anomalie" && v.raison === "montant_different", JSON.stringify(v));
v = verifierPaiementKonnect(pay, { status: "completed", amount: 7000, orderId: "AUTRE" });
check("Autre commande -> anomalie", v.etat === "anomalie" && v.raison === "commande_differente", JSON.stringify(v));
v = verifierPaiementKonnect(pay, { status: "completed", amount: 7000, orderId: "CMD1", token: "EUR" });
check("Autre devise -> anomalie", v.etat === "anomalie", JSON.stringify(v));
v = verifierPaiementKonnect(pay, { status: "pending" });
check("pending -> on attend (pas d'échec)", v.etat === "attente", JSON.stringify(v));
v = verifierPaiementKonnect(pay, { status: "expired" });
check("expired -> échec (stock restauré)", v.etat === "echec", JSON.stringify(v));
v = verifierPaiementKonnect(pay, undefined);
check("Réponse vide -> anomalie", v.etat === "anomalie", JSON.stringify(v));

// --- Offres ---
const ok = { titre: "Panier surprise", prixInitial: 10, prixReduit: 3.5, quantiteDisponible: 5 };
const o = validerCreation(ok);
check("Offre valide + valeurs par défaut", o.statut === "active" && o.estSurpriseBasket === false && o.description === "");
check("Prix réduit > prix initial refusé", leve(() => validerCreation({ ...ok, prixReduit: 12 })) === "invalid-argument");
check("Stock 0 refusé à la création", leve(() => validerCreation({ ...ok, quantiteDisponible: 0 })) === "invalid-argument");
check("Titre manquant refusé", leve(() => validerCreation({ ...ok, titre: "" })) === "invalid-argument");
const m = validerModification({ prixReduit: 2, commercantId: "pirate", dateCreation: "x" });
check("Modification : champs interdits ignorés", Object.keys(m).join() === "prixReduit", JSON.stringify(m));
check("Modification vide refusée", leve(() => validerModification({ commercantId: "x" })) === "invalid-argument");

console.log(echecs === 0 ? "\nTous les tests unitaires passent." : `\n${echecs} test(s) en échec.`);
process.exit(echecs === 0 ? 0 : 1);
