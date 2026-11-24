const admin = require("firebase-admin");
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";
admin.initializeApp({ projectId: "campussave-815dd" });
const db = admin.firestore();

const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const FN = "http://127.0.0.1:5001/campussave-815dd/europe-west1";

async function signIn(email) {
  const r = await fetch(`${AUTH}/accounts:signInWithPassword?key=fake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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

  const offre = await call("creerOffre", com.idToken, {
    titre: "Box Konnect Virtuel",
    description: "Test paiement virtuel",
    prixInitial: 12,
    prixReduit: 4,
    quantiteDisponible: 4,
    estSurpriseBasket: true,
    horaireRecuperation: "17h-19h",
  });
  const offreId = offre.result.offreId;

  // 1) Paiement Konnect virtuel rÃ©ussi
  const cmdOk = await call("creerCommande", etu.idToken, {
    lignes: [{ offreId, quantite: 1 }],
  });
  const cmdOkId = cmdOk.result.commandeId;

  const initOk = await call("initierPaiement", etu.idToken, { commandeId: cmdOkId });
  console.log("1) initierPaiement (succÃ¨s) :", JSON.stringify(initOk.result));

  const whOk = await fetch(initOk.result.payUrl);
  console.log("   Webhook HTTP status :", whOk.status);

  const cmdOkSnap = (await db.doc(`commandes/${cmdOkId}`).get()).data();
  const qrOkSnap = await db.doc(`qrcodes/${cmdOkId}`).get();
  console.log("   Commande :", cmdOkSnap.statut, "(attendu : payee) | QR crÃ©Ã© :", qrOkSnap.exists);

  // 2) Paiement Konnect virtuel Ã©chouÃ© (stock restaurÃ©)
  const cmdFail = await call("creerCommande", etu.idToken, {
    lignes: [{ offreId, quantite: 2 }],
  });
  const cmdFailId = cmdFail.result.commandeId;
  console.log("   Stock avant Ã©chec :", (await db.doc(`offres/${offreId}`).get()).data().quantiteDisponible, "(attendu : 1)");

  const initFail = await call("initierPaiement", etu.idToken, { commandeId: cmdFailId });
  const failUrl = initFail.result.payUrl.replace("virtualStatus=completed", "virtualStatus=failed");
  await fetch(failUrl);

  const cmdFailSnap = (await db.doc(`commandes/${cmdFailId}`).get()).data();
  const stockApresEchec = (await db.doc(`offres/${offreId}`).get()).data().quantiteDisponible;
  console.log("2) AprÃ¨s Ã©chec :", cmdFailSnap.statut, "(attendu : annulee) | Stock restaurÃ© :", stockApresEchec, "(attendu : 3)");

  // 3) Anomalie montant
  const cmdAnom = await call("creerCommande", etu.idToken, {
    lignes: [{ offreId, quantite: 1 }],
  });
  const initAnom = await call("initierPaiement", etu.idToken, { commandeId: cmdAnom.result.commandeId });
  const anomUrl = initAnom.result.payUrl.replace("virtualStatus=completed", "virtualStatus=anomaly_amount");
  await fetch(anomUrl);

  const payAnomSnap = (await db.doc(`paiements/${initAnom.result.paymentRef}`).get()).data();
  console.log("3) Anomalie :", payAnomSnap.statutPaiement, "| Raison :", payAnomSnap.raisonAnomalie);
})();
