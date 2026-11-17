// SOURCE UNIQUE des rôles. Conventions françaises (celles du diagramme UML).
// Le frontend (React / Flutter) doit utiliser exactement ces valeurs.
const ROLES = Object.freeze({
  ETUDIANT: "etudiant",
  COMMERCANT: "commercant", // commerçant VALIDÉ par l'admin
  COMMERCANT_EN_ATTENTE: "commercant_en_attente", // inscrit, pas encore validé
  ASSOCIATION: "association",
  ADMIN: "admin",
});

// Rôles qu'un visiteur peut demander à l'inscription. "admin" n'y figure JAMAIS.
// Demander "commercant" donne en réalité "commercant_en_attente".
const SELF_REGISTRATION_ROLES = [ROLES.ETUDIANT, ROLES.ASSOCIATION, ROLES.COMMERCANT];

// Rôles qui peuvent acheter (l'association achète comme un étudiant).
const BUYER_ROLES = [ROLES.ETUDIANT, ROLES.ASSOCIATION];

function roleAtSignup(requestedRole) {
  return requestedRole === ROLES.COMMERCANT ? ROLES.COMMERCANT_EN_ATTENTE : requestedRole;
}

module.exports = { ROLES, SELF_REGISTRATION_ROLES, BUYER_ROLES, roleAtSignup };
