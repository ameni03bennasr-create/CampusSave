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
  console.log("=== DÉBUT DES TESTS : COMMANDES GROUPÉES & ANALYSE FEEDBACKS IA ===\n");

  const assoId = "asso_test_1";
  const etudId = "etud_test_1";
  const adminId = "admin_test_1";
  const merchId = "merch_test_1";

  for (const uid of [assoId, etudId, adminId, merchId]) {
    try { await auth.deleteUser(uid); } catch (_) {}
    await auth.createUser({ uid, email: `${uid}@test.tn`, password: "Password123!" });
  }

  await db.doc(`commercants/${merchId}`).set({
    nomCommerce: "Snack Campus",
    statutValidation: "approuve",
  });

  const tokenAsso = await getIdTokenForUser(assoId, { role: "association" });
  const tokenEtud = await getIdTokenForUser(etudId, { role: "etudiant" });
  const tokenAdmin = await getIdTokenForUser(adminId, { role: "admin" });
  const tokenMerch = await getIdTokenForUser(merchId, { role: "commercant" });

  // ------------------------------------------------------------------
  // TEST 1 : envoyerDemandeGroupee (et réponse commerçant)
  // ------------------------------------------------------------------
  console.log("--- Test 1 : envoyerDemandeGroupee ---");

  const resNonAsso = await callFunction(
    "envoyerDemandeGroupee",
    { nomEvenement: "Forum Étudiant", dateEvenement: "2026-12-10T10:00:00Z" },
    tokenEtud
  );
  assert.strictEqual(resNonAsso.status, 403, "Un étudiant ne doit pas pouvoir créer une demande groupée");
  console.log("  [OK] Rejet non-association :", resNonAsso.body.error?.message);

  const resInvalidDate = await callFunction(
    "envoyerDemandeGroupee",
    { nomEvenement: "Forum Étudiant", dateEvenement: "date-invalide" },
    tokenAsso
  );
  assert.strictEqual(resInvalidDate.status, 400, "Une date invalide doit être rejetée (invalid-argument)");
  console.log("  [OK] Rejet date invalide :", resInvalidDate.body.error?.message);

  const resGroupeeOk = await callFunction(
    "envoyerDemandeGroupee",
    { nomEvenement: "  Gala Campus  ", dateEvenement: "2026-12-15T18:00:00Z" },
    tokenAsso
  );
  assert.strictEqual(resGroupeeOk.status, 200, "envoyerDemandeGroupee doit réussir: " + JSON.stringify(resGroupeeOk.body));
  const cmdGroupeeId = resGroupeeOk.body.result?.commandeGroupeeId;
  assert.ok(cmdGroupeeId, "commandeGroupeeId doit être retourné");

  const cmdSnap = await db.doc(`commandesGroupees/${cmdGroupeeId}`).get();
  assert.ok(cmdSnap.exists, "Le document commandesGroupees doit exister");
  const cmdData = cmdSnap.data();
  assert.strictEqual(cmdData.associationId, assoId);
  assert.strictEqual(cmdData.nomEvenement, "Gala Campus");
  assert.strictEqual(cmdData.statutDemande, "en_attente");
  console.log("  [OK] Demande groupée créée :", cmdGroupeeId, "| statut:", cmdData.statutDemande);

  const resProp = await callFunction(
    "accepterOuRefuserProposition",
    { commandeGroupeeId: cmdGroupeeId, action: "accepte" },
    tokenMerch
  );
  assert.strictEqual(resProp.status, 200, "accepterOuRefuserProposition doit réussir: " + JSON.stringify(resProp.body));
  const cmdAfterProp = (await db.doc(`commandesGroupees/${cmdGroupeeId}`).get()).data();
  assert.strictEqual(cmdAfterProp.statutDemande, "acceptee");
  assert.strictEqual(cmdAfterProp.commercantId, merchId);
  console.log("  [OK] Proposition acceptée par le commerçant :", cmdAfterProp.statutDemande);

  // ------------------------------------------------------------------
  // TEST 2 : analyserFeedbacksIA
  // ------------------------------------------------------------------
  console.log("\n--- Test 2 : analyserFeedbacksIA ---");

  const resNonAdmin = await callFunction("analyserFeedbacksIA", {}, tokenAsso);
  assert.strictEqual(resNonAdmin.status, 403, "Un non-admin ne doit pas pouvoir lancer analyserFeedbacksIA");
  console.log("  [OK] Rejet non-admin :", resNonAdmin.body.error?.message);

  const oldFeedbacks = await db.collection("feedbacks").get();
  for (const doc of oldFeedbacks.docs) {
    await doc.ref.delete();
  }

  const resVide = await callFunction("analyserFeedbacksIA", {}, tokenAdmin);
  assert.strictEqual(resVide.status, 200);
  assert.strictEqual(resVide.body.result?.message, "Aucun feedback à analyser");
  console.log("  [OK] Cas sans feedback :", resVide.body.result?.message);

  const nowMs = Date.now();
  await db.collection("feedbacks").add({
    etudiantId: etudId,
    note: 2,
    commentaire: "Stock épuisé tôt",
    dateSoumission: admin.firestore.Timestamp.fromMillis(nowMs - 2000),
  });
  await db.collection("feedbacks").add({
    etudiantId: etudId,
    note: 2,
    commentaire: "Horaire serré",
    dateSoumission: admin.firestore.Timestamp.fromMillis(nowMs - 1000),
  });

  const resAnalyse = await callFunction("analyserFeedbacksIA", {}, tokenAdmin);
  assert.strictEqual(resAnalyse.status, 200, "analyserFeedbacksIA doit réussir: " + JSON.stringify(resAnalyse.body));
  assert.strictEqual(resAnalyse.body.result?.moyenne, 2);

  const suggId = resAnalyse.body.result?.suggestionId;
  assert.ok(suggId, "suggestionId doit être retourné");
  const suggData = (await db.doc(`suggestionsIA/${suggId}`).get()).data();
  assert.strictEqual(suggData.idAgent, "AgentIA-01");
  assert.strictEqual(suggData.analyseMoyenne, 2);
  assert.strictEqual(suggData.totalFeedbacksAnalyses, 2);
  assert.ok(suggData.suggestion.includes("2.0/5"), "La suggestion doit mentionner la moyenne 2.0/5");
  console.log("  [OK] Suggestion IA enregistrée :", suggId, "| moyenne:", suggData.analyseMoyenne);

  console.log("\n=== TOUS LES TESTS ONT RÉUSSI ===");
}

runTests().catch((err) => {
  console.error("\n[ÉCHEC DU TEST]", err);
  process.exit(1);
});
