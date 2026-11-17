const admin = require("firebase-admin");
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";
admin.initializeApp({ projectId: "campussave-815dd" });
const db = admin.firestore();

const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const FN = "http://127.0.0.1:5001/campussave-815dd/europe-west1";

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
  const etu = await signIn("etudiant@test.com");
  const com = await signIn("commercant@test.com");

  // Dernière commande en attente de l'étudiant
  const q = await db.collection("commandes")
    .where("etudiantId", "==", etu.localId).where("statut", "==", "en_attente").limit(1).get();
  if (q.empty) { console.error("Aucune commande en attente : lancez test-commande.js"); process.exit(1); }
  const commandeId = q.docs[0].id;
  console.log("Commande :", commandeId);

  // 1) Paiement simulé
  console.log("simulerPaiement :", JSON.stringify(await call("simulerPaiement", etu.idToken, { commandeId })));
  const cmd1 = (await db.doc(`commandes/${commandeId}`).get()).data();
  console.log("Statut commande :", cmd1.statut, "(attendu : payee)");

  // 2) QR code généré ?
  const qr = await db.collection("qrcodes").where("commandeId", "==", commandeId).get();
  console.log("QR codes générés :", qr.size, "(attendu : 1)");
  const codeUnique = qr.docs[0].data().codeUnique;

  // 3) Le commerçant scanne
  console.log("validerRetrait :", JSON.stringify(await call("validerRetrait", com.idToken, { codeUnique })));
  const cmd2 = (await db.doc(`commandes/${commandeId}`).get()).data();
  console.log("Statut commande :", cmd2.statut, "(attendu : retiree)");
  const user = (await db.doc(`users/${etu.localId}`).get()).data();
  console.log("EcoPoints étudiant :", user.soldeEcoPoints, "(attendu : 20)");
  console.log("Stats :", JSON.stringify((await db.doc("stats/impactEco").get()).data()));

  // 4) Double scan refusé
  console.log("Double scan :", JSON.stringify(await call("validerRetrait", com.idToken, { codeUnique })));
})();