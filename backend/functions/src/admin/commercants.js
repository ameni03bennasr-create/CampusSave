const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { auth, db } = require("../config/firebase");
const { ROLES } = require("../constants/roles");
const { STATUT_VALIDATION } = require("../constants/statuts");
const { requireRole } = require("../auth/guards");
const { handle } = require("../utils/handler");
const { text } = require("../validators/common");
const { serialiser } = require("../utils/serialize");

async function chargerCommercant(commercantId) {
  if (typeof commercantId !== "string" || !commercantId) {
    throw new HttpsError("invalid-argument", 'Le champ "commercantId" est obligatoire.');
  }
  const ref = db.doc(`commercants/${commercantId}`);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError("not-found", "Commerçant introuvable.");
  return { ref, data: snap.data() };
}

// Valider : statut -> approuve ET rôle -> commercant (base + claim).
// Idempotent : on peut le rappeler sans risque (réapplique le claim).
exports.validerCommercant = onCall(handle("validerCommercant", async (req) => {
  const adminUid = requireRole(req, ROLES.ADMIN);
  const id = req.data?.commercantId;
  const { ref, data } = await chargerCommercant(id);

  if (data.statutValidation !== STATUT_VALIDATION.APPROUVE) {
    const batch = db.batch();
    batch.update(ref, {
      statutValidation: STATUT_VALIDATION.APPROUVE,
      dateValidation: FieldValue.serverTimestamp(),
      validePar: adminUid,
      motifRefus: FieldValue.delete(),
    });
    batch.update(db.doc(`users/${id}`), {
      role: ROLES.COMMERCANT,
      statutValidation: STATUT_VALIDATION.APPROUVE,
    });
    await batch.commit();
  }
  await auth.setCustomUserClaims(id, { role: ROLES.COMMERCANT });
  return { ok: true, role: ROLES.COMMERCANT, statutValidation: STATUT_VALIDATION.APPROUVE };
}));

exports.refuserCommercant = onCall(handle("refuserCommercant", async (req) => {
  const adminUid = requireRole(req, ROLES.ADMIN);
  const id = req.data?.commercantId;
  const motif = text(req.data?.motif, "motif", { max: 300, required: false });
  const { ref, data } = await chargerCommercant(id);

  if (data.statutValidation !== STATUT_VALIDATION.EN_ATTENTE) {
    throw new HttpsError("failed-precondition", "Seule une demande en attente peut être refusée.");
  }
  const batch = db.batch();
  batch.update(ref, {
    statutValidation: STATUT_VALIDATION.REFUSE,
    dateValidation: FieldValue.serverTimestamp(),
    validePar: adminUid,
    motifRefus: motif,
  });
  batch.update(db.doc(`users/${id}`), { statutValidation: STATUT_VALIDATION.REFUSE });
  await batch.commit();
  // Le rôle reste "commercant_en_attente" : aucun droit de publier.
  return { ok: true, statutValidation: STATUT_VALIDATION.REFUSE };
}));

exports.listerCommercantsEnAttente = onCall(handle("listerCommercantsEnAttente", async (req) => {
  requireRole(req, ROLES.ADMIN);
  const snap = await db.collection("commercants")
    .where("statutValidation", "==", STATUT_VALIDATION.EN_ATTENTE).limit(100).get();
  return { commercants: snap.docs.map((d) => serialiser({ id: d.id, ...d.data() })) };
}));
