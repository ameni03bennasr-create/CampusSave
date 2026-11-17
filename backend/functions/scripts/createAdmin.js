// Usage (émulateur uniquement) :
//   node scripts/createAdmin.js email motdepasse "Nom"
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

// Garde-fou : refuse de tourner contre la vraie base.
if (!process.env.FIREBASE_AUTH_EMULATOR_HOST || !process.env.FIRESTORE_EMULATOR_HOST) {
  console.error("Refusé : ce script ne tourne qu'avec les émulateurs.");
  process.exit(1);
}

initializeApp({ projectId: "campussave-815dd" });
const auth = getAuth();
const db = getFirestore();

const [email, password, nom] = process.argv.slice(2);
if (!email || !password || !nom) {
  console.error('Usage : node scripts/createAdmin.js email motdepasse "Nom"');
  process.exit(1);
}

(async () => {
  let user;
  try {
    user = await auth.getUserByEmail(email);
  } catch (err) {
    if (err.code !== "auth/user-not-found") throw err;
    user = await auth.createUser({ email, password, displayName: nom, emailVerified: true });
  }

  await auth.setCustomUserClaims(user.uid, { role: "admin" });
  await db.collection("users").doc(user.uid).set(
    {
      uid: user.uid,
      nom,
      email,
      telephone: null,
      role: "admin",
      dateCreation: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`Administrateur prêt : ${email} (uid ${user.uid})`);
})();