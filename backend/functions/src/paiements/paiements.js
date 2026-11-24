const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret, defineString } = require("firebase-functions/params");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../config/firebase");
const { BUYER_ROLES } = require("../constants/roles");
const { STATUT_COMMANDE, STATUT_PAIEMENT } = require("../constants/statuts");
const { requireRole } = require("../auth/guards");
const { handle } = require("../utils/handler");
const { verifierPaiementKonnect } = require("./verification");
const { confirmerPaiement, traiterEchecPaiement, signalerAnomalie } = require("./service");

const KONNECT_KEY = defineSecret("KONNECT_API_KEY");
const KONNECT_WALLET = defineSecret("KONNECT_WALLET_ID");
const KONNECT_WEBHOOK_URL = defineString("KONNECT_WEBHOOK_URL", { default: "" });
const KONNECT_VIRTUAL_PARAM = defineString("KONNECT_VIRTUAL", { default: "" });
const KONNECT_API = "https://api.preprod.konnect.network/api/v2";

function isKonnectVirtual() {
  const flag = (process.env.KONNECT_VIRTUAL || KONNECT_VIRTUAL_PARAM.value() || "").toLowerCase();
  if (flag === "true" || flag === "1") return true;
  if (flag === "false" || flag === "0") return false;
  return process.env.FUNCTIONS_EMULATOR === "true" && !process.env.KONNECT_API_KEY;
}

function getLocalWebhookBaseUrl() {
  const projectId = process.env.GCLOUD_PROJECT || "campussave-815dd";
  return `http://127.0.0.1:5001/${projectId}/europe-west1/konnectWebhook`;
}

exports.initierPaiement = onCall(
  { secrets: isKonnectVirtual() ? [] : [KONNECT_KEY, KONNECT_WALLET] },
  handle("initierPaiement", async (req) => {
    const acheteurId = requireRole(req, ...BUYER_ROLES);

    const cmdSnap = await db.doc(`commandes/${req.data?.commandeId}`).get();
    const cmd = cmdSnap.data();
    if (!cmd || cmd.etudiantId !== acheteurId) {
      throw new HttpsError("permission-denied", "Commande invalide");
    }
    if (cmd.statut !== STATUT_COMMANDE.EN_ATTENTE) {
      throw new HttpsError("failed-precondition", "Commande déjà traitée");
    }

    if (isKonnectVirtual()) {
      const paymentRef = `knct_virt_${Date.now()}_${cmdSnap.id}`;
      await db.collection("paiements").doc(paymentRef).set({
        commandeId: cmdSnap.id,
        etudiantId: acheteurId,
        montant: cmd.total,
        modePaiement: "Konnect",
        virtuel: true,
        statutPaiement: STATUT_PAIEMENT.INITIE,
        konnectRef: paymentRef,
        datePaiement: FieldValue.serverTimestamp(),
      });

      const baseUrl = KONNECT_WEBHOOK_URL.value() || getLocalWebhookBaseUrl();
      const sep = baseUrl.includes("?") ? "&" : "?";
      return {
        paymentRef,
        virtual: true,
        payUrl: `${baseUrl}${sep}payment_ref=${encodeURIComponent(paymentRef)}&virtualStatus=completed`,
      };
    }

    const webhook = KONNECT_WEBHOOK_URL.value();
    if (!webhook) throw new HttpsError("failed-precondition", "KONNECT_WEBHOOK_URL non configuré.");

    const res = await fetch(`${KONNECT_API}/payments/init-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": KONNECT_KEY.value() },
      body: JSON.stringify({
        receiverWalletId: KONNECT_WALLET.value(),
        amount: Math.round(cmd.total * 1000),
        token: "TND",
        orderId: cmdSnap.id,
        webhook,
      }),
    });
    const data = await res.json();
    if (!data.paymentRef) throw new HttpsError("internal", "Konnect a refusé la requête");

    await db.collection("paiements").doc(data.paymentRef).set({
      commandeId: cmdSnap.id,
      etudiantId: acheteurId,
      montant: cmd.total,
      modePaiement: "Konnect",
      statutPaiement: STATUT_PAIEMENT.INITIE,
      konnectRef: data.paymentRef,
      datePaiement: FieldValue.serverTimestamp(),
    });
    return { payUrl: data.payUrl };
  })
);

exports.konnectWebhook = onRequest(
  { secrets: isKonnectVirtual() ? [] : [KONNECT_KEY] },
  async (req, res) => {
    try {
      const ref = typeof req.query.payment_ref === "string" ? req.query.payment_ref : "";
      if (!ref) return void res.sendStatus(400);

      const paySnap = await db.doc(`paiements/${ref}`).get();
      if (!paySnap.exists) return void res.sendStatus(404);
      const pay = paySnap.data();
      if (pay.modePaiement !== "Konnect") return void res.sendStatus(400);

      let payment;
      if (isKonnectVirtual() || pay.virtuel === true) {
        const vStatus = typeof req.query.virtualStatus === "string" ? req.query.virtualStatus : "completed";
        if (vStatus === "anomaly_amount") {
          payment = {
            status: "completed",
            amount: Math.round(pay.montant * 1000) + 500,
            orderId: pay.commandeId,
            token: "TND",
          };
        } else if (vStatus === "anomaly_order") {
          payment = {
            status: "completed",
            amount: Math.round(pay.montant * 1000),
            orderId: "COMMANDE_INCONNUE",
            token: "TND",
          };
        } else {
          payment = {
            status: vStatus,
            amount: Math.round(pay.montant * 1000),
            orderId: pay.commandeId,
            token: "TND",
          };
        }
      } else {
        const r = await fetch(`${KONNECT_API}/payments/${encodeURIComponent(ref)}`, {
          headers: { "x-api-key": KONNECT_KEY.value() },
        });
        if (!r.ok) throw new Error(`Konnect HTTP ${r.status}`);
        const body = await r.json();
        payment = body.payment;
      }

      const verdict = verifierPaiementKonnect(pay, payment);
      switch (verdict.etat) {
        case "reussi":
          await confirmerPaiement(ref);
          break;
        case "echec":
          await traiterEchecPaiement(ref, verdict.raison);
          break;
        case "anomalie":
          console.error("ANOMALIE paiement", ref, JSON.stringify(verdict));
          await signalerAnomalie(ref, verdict.raison);
          break;
        default:
          break;
      }
      res.sendStatus(200);
    } catch (err) {
      console.error("ERREUR webhook :", err);
      res.sendStatus(500);
    }
  }
);

exports.simulerPaiement = onCall(handle("simulerPaiement", async (req) => {
  if (process.env.FUNCTIONS_EMULATOR !== "true") {
    throw new HttpsError("permission-denied", "Disponible uniquement en local");
  }
  const acheteurId = requireRole(req, ...BUYER_ROLES);

  const cmdSnap = await db.doc(`commandes/${req.data?.commandeId}`).get();
  const cmd = cmdSnap.data();
  if (!cmd || cmd.etudiantId !== acheteurId) {
    throw new HttpsError("permission-denied", "Commande invalide");
  }

  const payRef = db.collection("paiements").doc();
  await payRef.set({
    commandeId: cmdSnap.id,
    etudiantId: acheteurId,
    montant: cmd.total,
    modePaiement: "Simulation",
    statutPaiement: STATUT_PAIEMENT.INITIE,
    konnectRef: payRef.id,
    datePaiement: FieldValue.serverTimestamp(),
  });
  if (req.data?.succes === false) await traiterEchecPaiement(payRef.id, "simulation");
  else await confirmerPaiement(payRef.id);
  return { ok: true };
}));