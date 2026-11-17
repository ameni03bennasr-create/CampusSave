const admin = require("firebase-admin");
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";
admin.initializeApp({ projectId: "campussave-815dd" });

const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const FN = "http://127.0.0.1:5001/campussave-815dd/europe-west1";

async function signUp(email) {
  let r = await fetch(`${AUTH}/accounts:signUp?key=fake`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "123456", returnSecureToken: true }),
  });
  let d = await r.json();
  if (d.error?.message === "EMAIL_EXISTS") d = await signIn(email); // compte déjà créé
  if (!d.localId || !d.idToken) {
    console.error("Échec auth pour", email, JSON.stringify(d));
    process.exit(1);
  }
  return d;
}
async function signIn(email) {
  const r = await fetch(`${AUTH}/accounts:signInWithPassword?key=fake`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "123456", returnSecureToken: true }),
  });
  return r.json();
}
async function call(name, token, data) {
  const r = await fetch(`${FN}/${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data }),
  });
  return r.json();
}

(async () => {
  // 1) Un étudiant
  const e = await signUp("etudiant@test.com");
  console.log("inscription étudiant :", JSON.stringify(await call("completeRegistration", e.idToken, {
    nom: "Ali Ben Salah", telephone: "20111222", role: "etudiant",
  })));

  // 2) Un commerçant
  const c = await signUp("commercant@test.com");
  console.log("inscription commerçant (attendu : commercant_en_attente) :", JSON.stringify(await call("completeRegistration", c.idToken, {
    nom: "Sami", telephone: "20333444", role: "commercant",
    nomCommerce: "Boulangerie Salam", specialite: "Pain", adresse: "12 rue de Tunis", description: "Pain frais",
  })));

  // 3) Un admin (rôle donné à la main)
  const a = await signUp("admin@test.com");
  await admin.auth().setCustomUserClaims(a.localId, { role: "admin" });
  await admin.firestore().doc(`users/${a.localId}`).set({ uid: a.localId, nom: "Admin", role: "admin", email: "admin@test.com" });

  // 4) L'admin valide le commerçant (il faut un nouveau token pour avoir le rôle)
  const aTok = (await signIn("admin@test.com")).idToken;
  console.log("valider commerçant :", JSON.stringify(await call("validerCommercant", aTok, { commercantId: c.localId })));
})();