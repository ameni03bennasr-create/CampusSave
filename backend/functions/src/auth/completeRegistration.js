// SEULE méthode d'inscription du backend (l'ancienne "inscrire" a été supprimée).
// Le frontend crée d'abord le compte Firebase Auth (email + mot de passe),
// puis appelle cette fonction avec les informations du profil.
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { auth, db } = require("../config/firebase");
const { ROLES, roleAtSignup } = require("../constants/roles");
const { STATUT_VALIDATION } = require("../constants/statuts");
const { validateRegistrationData } = require("../validators/registration");
const { handle } = require("../utils/handler");

exports.completeRegistration = onCall(handle("completeRegistration", async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  const uid = request.auth.uid;
  const email = request.auth.token.email;
  if (!email) throw new HttpsError("failed-precondition", "Le compte n'a pas d'adresse e-mail.");

  const userRef = db.collection("users").doc(uid);

  // Déjà inscrit : on ne recrée rien, on réapplique seulement le claim
  // (utile si un premier appel a échoué entre l'écriture et le claim).
  const existing = await userRef.get();
  if (existing.exists) {
    await auth.setCustomUserClaims(uid, { role: existing.data().role });
    return { alreadyRegistered: true, role: existing.data().role };
  }

  const input = validateRegistrationData(request.data);
  const role = roleAtSignup(input.role);
  const estCommercant = input.role === ROLES.COMMERCANT;

  const batch = db.batch();
  batch.create(userRef, {
    uid,
    nom: input.nom,
    email,
    telephone: input.telephone,
    role,
    dateCreation: FieldValue.serverTimestamp(),
    // Étudiant et association (qui achète comme un étudiant) :
    ...(role === ROLES.ETUDIANT || role === ROLES.ASSOCIATION
      ? { soldeEcoPoints: 0, niveauFidelite: "Bronze" }
      : {}),
    ...(estCommercant ? { statutValidation: STATUT_VALIDATION.EN_ATTENTE } : {}),
  });

  if (estCommercant) {
    batch.create(db.collection("commercants").doc(uid), {
      idCommerce: uid,
      nomCommerce: input.nomCommerce,
      logo: null,
      description: input.description,
      specialite: input.specialite,
      adresse: input.adresse,
      statutValidation: STATUT_VALIDATION.EN_ATTENTE,
      dateDemande: FieldValue.serverTimestamp(),
    });
  }

  if (input.role === ROLES.ASSOCIATION) {
    batch.create(db.collection("associations").doc(uid), {
      idAssociation: uid,
      nomClub: input.nomClub,
      universite: input.universite,
    });
  }

  await batch.commit();
  await auth.setCustomUserClaims(uid, { role }); // rôle posé côté serveur uniquement
  return { alreadyRegistered: false, role };
}));
