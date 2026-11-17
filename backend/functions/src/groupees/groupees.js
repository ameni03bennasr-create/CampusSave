const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { ROLES } = require("../constants/roles");
const { requireRole, requireApprovedMerchant } = require("../auth/guards");
const { handle } = require("../utils/handler");

// Initier une commande groupée (Association)
exports.envoyerDemandeGroupee = onCall(handle("envoyerDemandeGroupee", async (req) => {
  const uid = requireRole(req, ROLES.ASSOCIATION);
  const { nomEvenement, dateEvenement } = req.data || {};
  if (typeof nomEvenement !== "string" || !nomEvenement.trim() || !dateEvenement) {
    throw new HttpsError("invalid-argument", "Nom et date de l'événement requis");
  }
  const date = new Date(dateEvenement);
  if (Number.isNaN(date.getTime())) throw new HttpsError("invalid-argument", "Date invalide");

  const ref = db.collection("commandesGroupees").doc();
  await ref.set({
    associationId: uid,
    nomEvenement: nomEvenement.trim(),
    dateEvenement: date,
    statutDemande: "en_attente",
    dateCreation: FieldValue.serverTimestamp(),
  });
  return { ok: true, commandeGroupeeId: ref.id };
}));

// Répondre à une commande groupée (Commerçant validé)
exports.accepterOuRefuserProposition = onCall(handle("accepterOuRefuserProposition", async (req) => {
  const { uid } = await requireApprovedMerchant(req);
  const { commandeGroupeeId, action } = req.data || {}; // action : 'accepte' ou 'refuse'
  if (!["accepte", "refuse"].includes(action)) throw new HttpsError("invalid-argument", "Action invalide");
  if (typeof commandeGroupeeId !== "string" || !commandeGroupeeId) {
    throw new HttpsError("invalid-argument", "commandeGroupeeId requis");
  }

  const ref = db.doc(`commandesGroupees/${commandeGroupeeId}`);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new HttpsError("not-found", "Commande groupée introuvable");
    if (snap.data().statutDemande !== "en_attente") {
      throw new HttpsError("failed-precondition", "Demande déjà traitée");
    }
    tx.update(ref, {
      statutDemande: action === "accepte" ? "acceptee" : "refusee",
      commercantId: uid,
    });
  });
  return { ok: true };
}));
