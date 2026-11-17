// Usage : node scripts/testPhase2.js (les émulateurs doivent tourner)
const PROJECT = "campussave-815dd";
const AUTH_URL = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1";
const FN_URL = `http://127.0.0.1:5001/${PROJECT}/europe-west1/completeRegistration`;
const KEY = "fake-api-key";
const run = Date.now();

async function post(url, body, token) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return { status: res.status, body: await res.json() };
}

const signUp = (email) =>
  post(`${AUTH_URL}/accounts:signUp?key=${KEY}`, {
    email, password: "Test12345!", returnSecureToken: true,
  });
const signIn = (email) =>
  post(`${AUTH_URL}/accounts:signInWithPassword?key=${KEY}`, {
    email, password: "Test12345!", returnSecureToken: true,
  });
const claimsOf = (idToken) =>
  JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString());
const register = (token, data) => post(FN_URL, { data }, token);

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name} ${ok ? "" : detail}`);
  if (!ok) failures++;
}

async function newUser(label) {
  const email = `${label}.${run}@test.local`;
  const res = await signUp(email);
  return { email, token: res.body.idToken };
}

(async () => {
  // 1. Appel sans connexion
  let r = await register(null, { role: "student", nom: "Anonyme" });
  check("Appel sans connexion refusé", r.body.error?.status === "UNAUTHENTICATED", JSON.stringify(r.body));

  // 2. Étudiant
  let u = await newUser("etudiant");
  r = await register(u.token, { role: "student", nom: "Sami Ben Ali", telephone: "20123456" });
  check("Inscription étudiant", r.body.result?.role === "student", JSON.stringify(r.body));
  let fresh = (await signIn(u.email)).body.idToken;
  check("Claim role = student", claimsOf(fresh).role === "student");

  // 3. Commerçant (en attente)
  u = await newUser("commercant");
  r = await register(u.token, {
    role: "merchant", nom: "Leila Trabelsi", nomCommerce: "Boulangerie Lac",
    adresse: "12 rue du Lac, Tunis", specialite: "Boulangerie",
  });
  check("Inscription commerçant", r.body.result?.role === "pending_merchant", JSON.stringify(r.body));
  fresh = (await signIn(u.email)).body.idToken;
  check("Claim role = pending_merchant", claimsOf(fresh).role === "pending_merchant");

  // 4. Association
  u = await newUser("association");
  r = await register(u.token, {
    role: "association", nom: "Yassine Gharbi", nomClub: "EcoFinTech", universite: "ESSECT",
  });
  check("Inscription association", r.body.result?.role === "association", JSON.stringify(r.body));

  // 5. Tentative de se déclarer administrateur
  u = await newUser("pirate");
  r = await register(u.token, { role: "admin", nom: "Pirate Test" });
  check("Rôle admin refusé", r.body.error?.status === "INVALID_ARGUMENT", JSON.stringify(r.body));
  fresh = (await signIn(u.email)).body.idToken;
  check("Aucun claim posé après la tentative", claimsOf(fresh).role === undefined);

  // 6. Double inscription
  u = await newUser("double");
  await register(u.token, { role: "student", nom: "Double Test" });
  r = await register(u.token, { role: "merchant", nom: "Double Test" });
  check("Double inscription sans changement de rôle",
    r.body.result?.alreadyRegistered === true && r.body.result?.role === "student",
    JSON.stringify(r.body));

  console.log(failures === 0 ? "\nTous les tests passent." : `\n${failures} test(s) en échec.`);
  process.exit(failures === 0 ? 0 : 1);
})();