const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { STATUT_COMMANDE } = require("../constants/statuts");
const { requireApprovedMerchant } = require("../auth/guards");
const { handle } = require("../utils/handler");

const POINTS_PAR_ARTICLE = 10;
const KG_PAR_ARTICLE = 0.5; // estimation

exports.validerRetrait = onCall(handle("validerRetrait", async (req) => {
  const { uid } = await requireApprovedMerchant(req);
  const code = req.data?.codeUnique;
  if (typeof code !== "string" || !code) throw new HttpsError("invalid-argument", "codeUnique requis");

  const q = await db.collection("qrcodes").where("codeUnique", "==", code).limit(1).get();
  if (q.empty) throw new HttpsError("not-found", "QR invalide");
  const qrRef = q.docs[0].ref;

  // Transaction : deux scans simultanés ne peuvent pas créditer deux fois.
  await db.runTransaction(async (tx) => {
    const qr = (await tx.get(qrRef)).data();
    if (qr.estScanne) throw new HttpsError("failed-precondition", "QR déjà utilisé");

    const cmdRef = db.doc(`commandes/${qr.commandeId}`);
    const cmd = (await tx.get(cmdRef)).data();
    if (cmd.commercantId !== uid) throw new HttpsError("permission-denied", "Ce n'est pas votre commande");
    if (cmd.statut !== STATUT_COMMANDE.PAYEE) {
      throw new HttpsError("failed-precondition", "Commande non payée ou déjà retirée");
    }

    const nbArticles = cmd.lignes.reduce((s, l) => s + l.quantiteDemandee, 0);
    tx.update(qrRef, { estScanne: true, dateScan: FieldValue.serverTimestamp() });
    tx.update(cmdRef, { statut: STATUT_COMMANDE.RETIREE, dateRetrait: FieldValue.serverTimestamp() });
    tx.update(db.doc(`users/${cmd.etudiantId}`), {
      soldeEcoPoints: FieldValue.increment(nbArticles * POINTS_PAR_ARTICLE),
    });
    tx.set(db.doc("stats/impactEco"), {
      totalCommandes: FieldValue.increment(1),
      totalNourritureSauveeKg: FieldValue.increment(nbArticles * KG_PAR_ARTICLE),
    }, { merge: true });
  });
  return { ok: true };
}));
