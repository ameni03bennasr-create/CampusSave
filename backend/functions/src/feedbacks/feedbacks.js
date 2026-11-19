const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { ROLES } = require("../constants/roles");
const { requireRole } = require("../auth/guards");
const { handle } = require("../utils/handler");

// Soumettre un feedback (Étudiant)
exports.soumettreFeedback = onCall(handle("soumettreFeedback", async (req) => {
  const uid = requireRole(req, ROLES.ETUDIANT);
  const { note, commentaire } = req.data || {};
  if (!Number.isInteger(note) || note < 1 || note > 5) {
    throw new HttpsError("invalid-argument", "Note invalide (1 à 5)");
  }
  if (commentaire !== undefined && (typeof commentaire !== "string" || commentaire.length > 1000)) {
    throw new HttpsError("invalid-argument", "Commentaire invalide (texte, 1000 caractères max)");
  }
  const ref = db.collection("feedbacks").doc();
  await ref.set({
    etudiantId: uid,
    note,
    commentaire: commentaire || "",
    dateSoumission: FieldValue.serverTimestamp(),
  });
  return { ok: true, feedbackId: ref.id };
}));

// Analyse par l'Agent IA et génération de suggestions (Admin)
exports.analyserFeedbacksIA = onCall(handle("analyserFeedbacksIA", async (req) => {
  requireRole(req, ROLES.ADMIN);

  const snapshot = await db.collection("feedbacks").orderBy("dateSoumission", "desc").limit(50).get();
  if (snapshot.empty) return { ok: true, message: "Aucun feedback à analyser" };

  let sommeNotes = 0;
  let total = 0;
  snapshot.forEach((doc) => { sommeNotes += doc.data().note; total++; });
  const moyenne = sommeNotes / total;

  // Simulation de l'analyse IA (suggestion basée sur la moyenne)
  const suggestionTexte = moyenne < 3
    ? `Attention : La note moyenne récente est de ${moyenne.toFixed(1)}/5. Il est recommandé de revoir la qualité des offres ou les horaires de récupération.`
    : `Satisfaction élevée (${moyenne.toFixed(1)}/5). Les étudiants apprécient globalement les offres actuelles. Continuer sur cette lancée.`;

  const ref = db.collection("suggestionsIA").doc();
  await ref.set({
    idAgent: "AgentIA-01",
    analyseMoyenne: moyenne,
    totalFeedbacksAnalyses: total,
    suggestion: suggestionTexte,
    dateGeneration: FieldValue.serverTimestamp(),
  });
  return { ok: true, suggestionId: ref.id, moyenne };
}));
