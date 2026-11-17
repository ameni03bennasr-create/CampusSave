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
  if (!etu.idToken || !com.idToken) {
    console.error("Lancez d'abord test-inscription.js");
    process.exit(1);
  }

  // 1) Le commerçant (déjà validé par test-inscription.js) publie une offre via creerOffre
  const cree = await call("creerOffre", com.idToken, {
    titre: "Panier surprise",
    description: "Invendus du jour",
    prixInitial: 10,
    prixReduit: 3.5,
    quantiteDisponible: 5,
    estSurpriseBasket: true,
    horaireRecuperation: "18h-19h",
  });
  console.log("creerOffre :", JSON.stringify(cree));
  if (!cree.result?.offreId) process.exit(1);
  const offreRef = db.doc(`offres/${cree.result.offreId}`);
  console.log("Offre créée :", offreRef.id, "(stock = 5)");

  // 2) L'étudiant commande 2 paniers
  const res = await call("creerCommande", etu.idToken, {
    lignes: [{ offreId: offreRef.id, quantite: 2 }],
  });
  console.log("creerCommande :", JSON.stringify(res));

  // 3) Vérification du stock : 5 - 2 = 3
  const offre = (await offreRef.get()).data();
  console.log("Stock après commande :", offre.quantiteDisponible, "(attendu : 3)");

  // 4) Test du refus : on demande plus que le stock
  const trop = await call("creerCommande", etu.idToken, {
    lignes: [{ offreId: offreRef.id, quantite: 99 }],
  });
  console.log("Commande trop grande :", JSON.stringify(trop));
})();
