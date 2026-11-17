// CRUD des offres. Toutes les écritures passent par ces fonctions
// (les règles Firestore interdisent l'écriture directe depuis le client).
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { requireAuth, requireApprovedMerchant } = require("../auth/guards");
const { handle } = require("../utils/handler");
const { serialiser } = require("../utils/serialize");
const { STATUT_OFFRE, STATUT_COMMANDE } = require("../constants/statuts");
const { validerCreation, validerModification, verifierPrix } = require("../validators/offres");

const idOffre = (v) => {
  if (typeof v !== "string" || !v) throw new HttpsError("invalid-argument", 'Le champ "offreId" est obligatoire.');
  return v;
};

// ---- CREATE (commerçant validé uniquement) ----
exports.creerOffre = onCall(handle("creerOffre", async (req) => {
  const { uid, profil } = await requireApprovedMerchant(req);
  const offre = validerCreation(req.data);
  const ref = db.collection("offres").doc();
  await ref.set({
    ...offre,
    commercantId: uid,
    nomCommerce: profil.nomCommerce,
    dateCreation: FieldValue.serverTimestamp(),
    dateModification: FieldValue.serverTimestamp(),
  });
  return { ok: true, offreId: ref.id };
}));

// ---- UPDATE (propriétaire uniquement) ----
exports.modifierOffre = onCall(handle("modifierOffre", async (req) => {
  const { uid } = await requireApprovedMerchant(req);
  const offreId = idOffre(req.data?.offreId);
  const changes = validerModification(req.data);
  const ref = db.doc(`offres/${offreId}`);

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Offre introuvable.");
    const actuelle = snap.data();
    if (actuelle.commercantId !== uid) {
      throw new HttpsError("permission-denied", "Cette offre ne vous appartient pas.");
    }
    verifierPrix(changes.prixInitial ?? actuelle.prixInitial, changes.prixReduit ?? actuelle.prixReduit);
    tx.update(ref, { ...changes, dateModification: FieldValue.serverTimestamp() });
  });
  return { ok: true };
}));

// ---- DELETE (propriétaire uniquement) ----
// Refusé s'il reste une commande en cours (en_attente / payee) sur cette offre :
// le commerçant peut alors la passer en statut "inactive" via modifierOffre.
exports.supprimerOffre = onCall(handle("supprimerOffre", async (req) => {
  const { uid } = await requireApprovedMerchant(req);
  const offreId = idOffre(req.data?.offreId);
  const ref = db.doc(`offres/${offreId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "Offre introuvable.");
  if (snap.data().commercantId !== uid) {
    throw new HttpsError("permission-denied", "Cette offre ne vous appartient pas.");
  }

  const ouvertes = await db.collection("commandes").where("offreIds", "array-contains", offreId).get();
  const enCours = ouvertes.docs.some((d) =>
    [STATUT_COMMANDE.EN_ATTENTE, STATUT_COMMANDE.PAYEE].includes(d.data().statut));
  if (enCours) {
    throw new HttpsError(
      "failed-precondition",
      'Des commandes sont en cours sur cette offre. Passez-la en statut "inactive" à la place.'
    );
  }
  await ref.delete();
  return { ok: true };
}));

// ---- READ : une offre ----
exports.getOffre = onCall(handle("getOffre", async (req) => {
  requireAuth(req);
  const snap = await db.doc(`offres/${idOffre(req.data?.offreId)}`).get();
  if (!snap.exists) throw new HttpsError("not-found", "Offre introuvable.");
  return { offre: serialiser({ id: snap.id, ...snap.data() }) };
}));

// ---- READ : liste filtrée (offres actives et en stock) ----
// Filtres optionnels : commercantId, estSurpriseBasket, prixMax, recherche, limite (défaut 30, max 100)
exports.listerOffres = onCall(handle("listerOffres", async (req) => {
  requireAuth(req);
  const f = req.data || {};
  let q = db.collection("offres").where("statut", "==", STATUT_OFFRE.ACTIVE);
  if (typeof f.commercantId === "string" && f.commercantId) q = q.where("commercantId", "==", f.commercantId);
  if (typeof f.estSurpriseBasket === "boolean") q = q.where("estSurpriseBasket", "==", f.estSurpriseBasket);

  const limite = Number.isInteger(f.limite) ? Math.min(Math.max(f.limite, 1), 100) : 30;
  const recherche = typeof f.recherche === "string" ? f.recherche.trim().toLowerCase() : "";
  const prixMax = typeof f.prixMax === "number" ? f.prixMax : null;

  const snap = await q.limit(300).get();
  const offres = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((o) => o.quantiteDisponible > 0)
    .filter((o) => prixMax === null || o.prixReduit <= prixMax)
    .filter((o) => !recherche
      || `${o.titre} ${o.description || ""}`.toLowerCase().includes(recherche))
    .sort((a, b) => (b.dateCreation?.toMillis?.() ?? 0) - (a.dateCreation?.toMillis?.() ?? 0))
    .slice(0, limite);
  return { offres: offres.map(serialiser) };
}));

// ---- READ : toutes MES offres (actives et inactives) ----
exports.listerMesOffres = onCall(handle("listerMesOffres", async (req) => {
  const { uid } = await requireApprovedMerchant(req);
  const snap = await db.collection("offres").where("commercantId", "==", uid).get();
  const offres = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.dateCreation?.toMillis?.() ?? 0) - (a.dateCreation?.toMillis?.() ?? 0));
  return { offres: offres.map(serialiser) };
}));
