// Test d'intégration : validation des commerçants, CRUD offres, commandes,
// échec de paiement (stock restauré), retrait QR.
// Usage : node scripts/testBackend.js   (les émulateurs auth + firestore + functions doivent tourner)
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";
const admin = require("firebase-admin");
const PROJECT = "campussave-815dd";
admin.initializeApp({ projectId: PROJECT });
const db = admin.firestore();

const AUTH = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const FN = `http://127.0.0.1:5001/${PROJECT}/europe-west1`;
const run = Date.now();
const PWD = "Test12345!";

async function post(url, body, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return res.json();
}
const call = async (name, token, data) => {
  const r = await post(`${FN}/${name}`, { data }, token);
  return { result: r.result, erreur: r.error?.status, brut: JSON.stringify(r) };
};
const signIn = async (email) =>
  (await post(`${AUTH}/accounts:signInWithPassword?key=fake`, { email, password: PWD, returnSecureToken: true })).idToken;

async function nouvelUtilisateur(label, donnees) {
  const email = `${label}.${run}@test.local`;
  const r = await post(`${AUTH}/accounts:signUp?key=fake`, { email, password: PWD, returnSecureToken: true });
  const reg = donnees ? await call("completeRegistration", r.idToken, donnees) : null;
  return { email, uid: r.localId, token: await signIn(email), reg };
}

let echecs = 0;
function check(nom, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${nom} ${ok ? "" : detail}`);
  if (!ok) echecs++;
}
const stock = async (id) => (await db.doc(`offres/${id}`).get()).data()?.quantiteDisponible;
const commerce = (nom) => ({
  role: "commercant", nom, telephone: "20111222", nomCommerce: `Commerce ${nom}`,
  adresse: "12 rue du Lac, Tunis", specialite: "Boulangerie",
});
const OFFRE = { titre: "Panier surprise", description: "Invendus du jour", prixInitial: 10,
  prixReduit: 3.5, quantiteDisponible: 5, estSurpriseBasket: true, horaireRecuperation: "18h-19h" };

(async () => {
  // --- Administrateur (créé à la main, comme le script createAdmin) ---
  const a = await post(`${AUTH}/accounts:signUp?key=fake`, { email: `admin.${run}@test.local`, password: PWD, returnSecureToken: true });
  await admin.auth().setCustomUserClaims(a.localId, { role: "admin" });
  await db.doc(`users/${a.localId}`).set({ uid: a.localId, nom: "Admin", role: "admin" });
  const adminTok = await signIn(`admin.${run}@test.local`);

  // =============== POINT 3 : validation des commerçants ===============
  console.log("\n--- Validation des commerçants ---");
  const A = await nouvelUtilisateur("comA", commerce("A"));
  check("Inscription commerçant -> commercant_en_attente", A.reg.result?.role === "commercant_en_attente", A.reg.brut);

  let r = await call("creerOffre", A.token, OFFRE);
  check("Commerçant en attente : creerOffre REFUSÉ", r.erreur === "PERMISSION_DENIED", r.brut);
  r = await call("listerMesOffres", A.token, {});
  check("Commerçant en attente : listerMesOffres REFUSÉ", r.erreur === "PERMISSION_DENIED", r.brut);
  r = await call("validerCommercant", A.token, { commercantId: A.uid });
  check("Un commerçant ne peut pas se valider lui-même", r.erreur === "PERMISSION_DENIED", r.brut);

  r = await call("validerCommercant", adminTok, { commercantId: A.uid });
  check("Admin valide le commerçant", r.result?.role === "commercant", r.brut);
  const userA = (await db.doc(`users/${A.uid}`).get()).data();
  const comA = (await db.doc(`commercants/${A.uid}`).get()).data();
  check("users.role = commercant et statutValidation = approuve", userA.role === "commercant" && userA.statutValidation === "approuve", JSON.stringify(userA));
  check("commercants.statutValidation = approuve", comA.statutValidation === "approuve", JSON.stringify(comA));
  r = await call("creerOffre", A.token, OFFRE);
  check("Ancien token (avant refresh) : toujours refusé", r.erreur === "PERMISSION_DENIED", r.brut);
  A.token = await signIn(A.email); // nouveau token = nouveau rôle
  r = await call("creerOffre", A.token, OFFRE);
  check("Après validation + nouveau token : creerOffre OK", !!r.result?.offreId, r.brut);
  const offreId = r.result?.offreId;

  const B = await nouvelUtilisateur("comB", commerce("B"));
  await call("validerCommercant", adminTok, { commercantId: B.uid });
  B.token = await signIn(B.email);
  const C = await nouvelUtilisateur("comC", commerce("C"));
  r = await call("refuserCommercant", adminTok, { commercantId: C.uid, motif: "Dossier incomplet" });
  check("Admin refuse un commerçant", r.result?.statutValidation === "refuse", r.brut);
  C.token = await signIn(C.email);
  r = await call("creerOffre", C.token, OFFRE);
  check("Commerçant refusé : creerOffre REFUSÉ", r.erreur === "PERMISSION_DENIED", r.brut);
  r = await call("listerCommercantsEnAttente", adminTok, {});
  check("listerCommercantsEnAttente (admin) fonctionne", Array.isArray(r.result?.commercants), r.brut);

  // =============== POINT 5 : CRUD des offres ===============
  console.log("\n--- Offres ---");
  r = await call("modifierOffre", A.token, { offreId, prixReduit: 2 });
  check("modifierOffre par le propriétaire", r.result?.ok === true, r.brut);
  r = await call("modifierOffre", A.token, { offreId, prixReduit: 20 });
  check("prixReduit > prixInitial refusé", r.erreur === "INVALID_ARGUMENT", r.brut);
  r = await call("modifierOffre", B.token, { offreId, titre: "Piratée" });
  check("Autre commerçant ne peut pas modifier", r.erreur === "PERMISSION_DENIED", r.brut);
  r = await call("supprimerOffre", B.token, { offreId });
  check("Autre commerçant ne peut pas supprimer", r.erreur === "PERMISSION_DENIED", r.brut);

  const E = await nouvelUtilisateur("etu", { role: "etudiant", nom: "Sami Ben Ali", telephone: "20123456" });
  r = await call("creerOffre", E.token, OFFRE);
  check("Étudiant ne peut pas créer d'offre", r.erreur === "PERMISSION_DENIED", r.brut);
  r = await call("getOffre", E.token, { offreId });
  check("getOffre", r.result?.offre?.titre === "Panier surprise" && r.result.offre.prixReduit === 2, r.brut);
  const ids = async (f) => ((await call("listerOffres", E.token, f)).result?.offres || []).map((o) => o.id);
  check("listerOffres sans filtre contient l'offre", (await ids({})).includes(offreId));
  check("Filtre prixMax=1 l'exclut", !(await ids({ prixMax: 1 })).includes(offreId));
  check("Filtre recherche='panier' l'inclut", (await ids({ recherche: "panier" })).includes(offreId));
  check("Filtre estSurpriseBasket=false l'exclut", !(await ids({ estSurpriseBasket: false })).includes(offreId));
  check("Filtre commercantId=B l'exclut", !(await ids({ commercantId: B.uid })).includes(offreId));

  // =============== POINT 6 : commandes et paiement ===============
  console.log("\n--- Commandes et paiement ---");
  r = await call("creerCommande", E.token, { lignes: [{ offreId, quantite: 2 }] });
  const cmd1 = r.result?.commandeId;
  check("creerCommande (stock 5 -> 3)", !!cmd1 && (await stock(offreId)) === 3, r.brut);
  r = await call("creerCommande", E.token, { lignes: [{ offreId, quantite: 2 }, { offreId, quantite: 2 }] });
  check("Lignes en double fusionnées : 4 > stock 3 refusé", r.erreur === "FAILED_PRECONDITION" && (await stock(offreId)) === 3, r.brut);

  r = await call("simulerPaiement", E.token, { commandeId: cmd1, succes: false });
  const c1 = (await db.doc(`commandes/${cmd1}`).get()).data();
  const pays = await db.collection("paiements").where("commandeId", "==", cmd1).get();
  check("Paiement ÉCHOUÉ : stock restauré (3 -> 5)", (await stock(offreId)) === 5, `stock=${await stock(offreId)}`);
  check("Paiement échoué : commande annulée", c1.statut === "annulee", JSON.stringify(c1));
  check("Paiement échoué : paiement = echoue", pays.docs[0]?.data().statutPaiement === "echoue");
  check("Paiement échoué : aucun QR code", !(await db.doc(`qrcodes/${cmd1}`).get()).exists);

  r = await call("creerCommande", E.token, { lignes: [{ offreId, quantite: 2 }] });
  const cmd2 = r.result?.commandeId;
  await call("simulerPaiement", E.token, { commandeId: cmd2 });
  const c2 = (await db.doc(`commandes/${cmd2}`).get()).data();
  const qr = (await db.doc(`qrcodes/${cmd2}`).get()).data();
  check("Paiement réussi : commande payee + QR généré", c2.statut === "payee" && !!qr?.codeUnique, JSON.stringify(c2));
  check("Paiement réussi : stock définitivement décompté (3)", (await stock(offreId)) === 3);

  r = await call("validerRetrait", B.token, { codeUnique: qr.codeUnique });
  check("Retrait par un autre commerçant refusé", r.erreur === "PERMISSION_DENIED", r.brut);
  r = await call("validerRetrait", A.token, { codeUnique: qr.codeUnique });
  check("Retrait par le bon commerçant", r.result?.ok === true, r.brut);
  r = await call("validerRetrait", A.token, { codeUnique: qr.codeUnique });
  check("Double scan refusé", r.erreur === "FAILED_PRECONDITION", r.brut);
  check("EcoPoints crédités (2 articles x 10 = 20)", (await db.doc(`users/${E.uid}`).get()).data().soldeEcoPoints === 20);

  // Suppression d'offre avec commande en cours
  r = await call("creerCommande", E.token, { lignes: [{ offreId, quantite: 1 }] });
  const cmd3 = r.result?.commandeId;
  r = await call("supprimerOffre", A.token, { offreId });
  check("supprimerOffre refusée si commande en cours", r.erreur === "FAILED_PRECONDITION", r.brut);
  await call("simulerPaiement", E.token, { commandeId: cmd3, succes: false });
  r = await call("supprimerOffre", A.token, { offreId });
  check("supprimerOffre OK sans commande en cours", r.result?.ok === true && !(await db.doc(`offres/${offreId}`).get()).exists, r.brut);

  // Association : achète comme un étudiant
  const S = await nouvelUtilisateur("asso", { role: "association", nom: "Yassine Gharbi", nomClub: "EcoFinTech", universite: "ESSECT" });
  r = await call("creerOffre", A.token, OFFRE);
  r = await call("creerCommande", S.token, { lignes: [{ offreId: r.result?.offreId, quantite: 1 }] });
  check("Une association peut commander", !!r.result?.commandeId, r.brut);

  console.log(echecs === 0 ? "\nTous les tests passent." : `\n${echecs} test(s) en échec.`);
  process.exit(echecs === 0 ? 0 : 1);
})().catch((e) => { console.error(e); process.exit(1); });
