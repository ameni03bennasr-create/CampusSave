const { HttpsError } = require("firebase-functions/v2/https");
const { db } = require("../config/firebase");
const { ROLES } = require("../constants/roles");
const { STATUT_VALIDATION } = require("../constants/statuts");

function requireAuth(request) {
  if (!request.auth) throw new HttpsError("unauthenticated", "Connexion requise.");
  return request.auth.uid;
}

function requireRole(request, ...rolesAutorises) {
  const uid = requireAuth(request);
  if (!rolesAutorises.includes(request.auth.token.role)) {
    throw new HttpsError("permission-denied", "Action non autorisée pour votre rôle.");
  }
  return uid;
}

// Commerçant VALIDÉ uniquement. Double contrôle :
//  1. le claim du token doit être "commercant" (pas "commercant_en_attente") ;
//  2. le statut réel en base doit être "approuve" (un vieux token ne suffit pas).
async function requireApprovedMerchant(request) {
  const uid = requireAuth(request);
  const role = request.auth.token.role;
  if (role === ROLES.COMMERCANT_EN_ATTENTE) {
    throw new HttpsError(
      "permission-denied",
      "Votre compte commerçant est en attente de validation par l'administrateur."
    );
  }
  if (role !== ROLES.COMMERCANT) {
    throw new HttpsError("permission-denied", "Commerçant requis.");
  }
  const snap = await db.doc(`commercants/${uid}`).get();
  if (!snap.exists || snap.data().statutValidation !== STATUT_VALIDATION.APPROUVE) {
    throw new HttpsError("permission-denied", "Compte commerçant non validé.");
  }
  return { uid, profil: snap.data() };
}

module.exports = { requireAuth, requireRole, requireApprovedMerchant };
