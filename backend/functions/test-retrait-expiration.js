process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8085";

const admin = require("firebase-admin");
const assert = require("assert");

const PROJECT_ID = "campussave-815dd";
const FUNCTIONS_BASE = `http://127.0.0.1:5001/${PROJECT_ID}/europe-west1`;

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();
const auth = admin.auth();

async function getIdTokenForUser(uid, claims = {}) {
  await auth.setCustomUserClaims(uid, claims);
  const customToken = await auth.createCustomToken(uid);
  const res = await fetch(
    "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=fake-api-key",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  );
  const data = await res.json();
  if (!data.idToken) throw new Error("Impossible d'obtenir idToken: " + JSON.stringify(data));
  return data.idToken;
}

async function callFunction(name, data, idToken) {
  const headers = { "Content-Type": "application/json" };
  if (idToken) headers.Authorization = `Bearer ${idToken}`;
  const res = await fetch(`${FUNCTIONS_BASE}/${name}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data }),
  });
  return { status: res.status, body: await res.json() };
}

async function runTests() {
  console.log("=== DÉBUT DES TESTS : RETRAIT QR CODE & EXPIRATION COMMANDES ===\n");

  const commercantId = "merch_test_retrait_1";
  const autreCommercantId = "merch_test_retrait_2";
  const etudiantId = "etud_test_retrait_1";

  for (const uid of [commercantId, autreCommercantId, etudiantId]) {
    try { await auth.deleteUser(uid); } catch (_) {}
    await auth.createUser({ uid, email: `${uid}@test.tn`, password: "Password123!" });
  }

  await db.doc(`commercants/${commercantId}`).set({
    nomCommerce: "Boulangerie Campus",
    statutValidation: "approuve",
  });
  await db.doc(`commercants/${autreCommercantId}`).set({
    nomCommerce: "Autre Boutique",
    statutValidation: "approuve",
  });
  await db.doc(`users/${etudiantId}`).set({
    role: "etudiant",
    soldeEcoPoints: 5,
  });

  const tokenCommercant = await getIdTokenForUser(commercantId, { role: "commercant" });
  const tokenAutreCommercant = await getIdTokenForUser(autreCommercantId, { role: "commercant" });

  // ------------------------------------------------------------------
  // TEST 1 : Validation du retrait QR code (nominal + sécurité)
  // ------------------------------------------------------------------
  console.log("--- Test 1 : Validation du retrait QR code ---");
  const commandeId = "cmd_retrait_ok_1";
  const codeUnique = "QR-TEST-UNIQUE-2026";

  await db.doc(`commandes/${commandeId}`).set({
    etudiantId,
    commercantId,
    statut: "payee",
    total: 10,
    lignes: [{ offreId: "offre_1", quantiteDemandee: 2, prixUnitaire: 5 }],
  });
  await db.doc(`qrcodes/${commandeId}`).set({
    commandeId,
    codeUnique,
    estScanne: false,
  });

  const resMauvais = await callFunction("validerRetrait", { codeUnique }, tokenAutreCommercant);
  assert.strictEqual(resMauvais.status, 403, "Un autre commerçant ne doit pas pouvoir valider le retrait");
  console.log("  [OK] Rejet mauvais commerçant :", resMauvais.body.error?.message);

  const resOk = await callFunction("validerRetrait", { codeUnique }, tokenCommercant);
  assert.strictEqual(resOk.status, 200, "validerRetrait doit réussir: " + JSON.stringify(resOk.body));
  assert.strictEqual(resOk.body.result?.ok, true);

  const qrAfter = (await db.doc(`qrcodes/${commandeId}`).get()).data();
  const cmdAfter = (await db.doc(`commandes/${commandeId}`).get()).data();
  const etudAfter = (await db.doc(`users/${etudiantId}`).get()).data();

  assert.strictEqual(qrAfter.estScanne, true, "estScanne doit passer à true");
  assert.strictEqual(cmdAfter.statut, "retiree", "statut commande doit passer à retiree");
  assert.strictEqual(etudAfter.soldeEcoPoints, 25, "soldeEcoPoints doit passer de 5 à 25 (2 articles * 10 pts)");
  console.log("  [OK] Retrait validé : commande=retiree, estScanne=true, soldeEcoPoints=25");

  const resDouble = await callFunction("validerRetrait", { codeUnique }, tokenCommercant);
  assert.notStrictEqual(resDouble.status, 200, "Un QR code déjà scanné doit être rejeté");
  console.log("  [OK] Rejet double scan :", resDouble.body.error?.message);

  // ------------------------------------------------------------------
  // TEST 2 : Gestion des commandes expirées (annulerCommandesExpirees)
  // ------------------------------------------------------------------
  console.log("\n--- Test 2 : Gestion des commandes expirées ---");
  const offreExpId = "offre_exp_test_1";
  const cmdExpId = "cmd_exp_test_1";

  await db.doc(`offres/${offreExpId}`).set({
    titre: "Panier Anti-Gaspi",
    commercantId,
    quantiteDisponible: 3,
    statut: "epuisee",
  });

  await db.doc(`commandes/${cmdExpId}`).set({
    etudiantId,
    commercantId,
    statut: "en_attente",
    total: 8,
    lignes: [{ offreId: offreExpId, quantiteDemandee: 2, prixUnitaire: 4 }],
    dateExpirationReservation: admin.firestore.Timestamp.fromMillis(Date.now() - 60 * 1000),
  });

  const schedRes = await fetch(`${FUNCTIONS_BASE}/annulerCommandesExpirees-0`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: {} }),
  });
  const schedText = await schedRes.text();
  console.log("  Déclenchement scheduler HTTP:", schedRes.status, schedText);

  const cmdExpAfter = (await db.doc(`commandes/${cmdExpId}`).get()).data();
  const offreExpAfter = (await db.doc(`offres/${offreExpId}`).get()).data();

  console.log("  Statut commande expirée après exécution :", cmdExpAfter.statut, "| motif:", cmdExpAfter.motifAnnulation);
  console.log("  Stock offre restauré :", offreExpAfter.quantiteDisponible);

  assert.strictEqual(cmdExpAfter.statut, "annulee", "La commande expirée doit passer à annulee");
  assert.strictEqual(cmdExpAfter.motifAnnulation, "reservation_expiree");
  assert.strictEqual(offreExpAfter.quantiteDisponible, 5, "Le stock doit passer de 3 à 5 (+2 restaurés)");
  console.log("  [OK] Commande expirée annulée et stock restauré !");

  console.log("\n=== TOUS LES TESTS ONT RÉUSSI ===");
}

runTests().catch((err) => {
  console.error("\n[ÉCHEC DU TEST]", err);
  process.exit(1);
});

