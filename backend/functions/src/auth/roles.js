const ROLES = Object.freeze({
  STUDENT: "student",
  ASSOCIATION: "association",
  MERCHANT: "merchant",
  PENDING_MERCHANT: "pending_merchant",
  ADMIN: "admin",
});

// Rôles qu'un visiteur a le droit de demander. "admin" n'y figure JAMAIS.
const SELF_REGISTRATION_ROLES = [
  ROLES.STUDENT,
  ROLES.ASSOCIATION,
  ROLES.MERCHANT,
];

// Un commerçant n'obtient son rôle qu'après validation par l'admin.
function roleAtSignup(requestedRole) {
  return requestedRole === ROLES.MERCHANT ? ROLES.PENDING_MERCHANT : requestedRole;
}

module.exports = { ROLES, SELF_REGISTRATION_ROLES, roleAtSignup };