const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { auth, db } = require("../config/firebase");
const { ROLES, roleAtSignup } = require("./roles");
const { validateRegistrationData } = require("../validators/registration");

exports.completeRegistration = onCall(async (request) => {
  // 1. Il faut être connecté (compte Authentication déjà créé par le frontend).
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Vous devez être connecté.");
  }
  const uid = request.auth.uid;
  const email = request.auth.token.email;
  if (!email) {
    throw new HttpsError("failed-precondition", "Le compte n'a pas d'adresse e-mail.");
  }

  const userRef = db.collection("users").doc(uid);

  // 2. Déjà inscrit ? On ne recrée rien, on réapplique seulement le claim
  //    (utile si un premier appel a échoué entre l'écriture et le claim).
  const existing = await userRef.get();
  if (existing.exists) {
    await auth.setCustomUserClaims(uid, { role: existing.data().role });
    return { alreadyRegistered: true, role: existing.data().role };
  }

  // 3. Validation des données reçues.
  const input = validateRegistrationData(request.data);
  const role = roleAtSignup(input.role);

  // 4. Écriture des profils en une seule opération atomique.

  const batch = db.batch();
  batch.create(userRef, {
    uid,
    nom: input.nom,
    email,
    telephone: input.telephone,
    role,
    dateCreation: FieldValue.serverTimestamp(),
    // Étudiant et association (qui achète comme un étudiant) :
    ...(role === ROLES.STUDENT || role === ROLES.ASSOCIATION
      ? { soldeEcoPoints: 0 }
      : {}),
  });

  if (input.role === ROLES.MERCHANT) {
    batch.create(db.collection("merchants").doc(uid), {
      idCommerce: uid,
      nomCommerce: input.nomCommerce,
      logo: null,
      description: input.description,
      specialite: input.specialite,
      adresse: input.adresse,
      statutValidation: "en_attente",
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

  // 5. Le rôle est posé côté serveur uniquement.
  await auth.setCustomUserClaims(uid, { role });

  return { alreadyRegistered: false, role };
});