const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8085';
initializeApp({ projectId: 'campussave-815dd' });
const db = getFirestore();

async function runTests() {
  console.log("--- TEST FEEDBACKS & AGENT IA ---");
  const fbRef = await db.collection("feedbacks").add({
    etudiantId: "etudiant_test_123",
    note: 4,
    commentaire: "Très bon service et super initiative !",
    dateSoumission: new Date()
  });
  console.log("Feedback soumis avec ID :", fbRef.id);

  console.log("--- TEST COMMANDES GROUPÉES (Association) ---");
  const cmdGrpRef = await db.collection("commandesGroupees").add({
    associationId: "asso_test_123",
    nomEvenement: "Journée éco-responsable ESSECT",
    dateEvenement: new Date("2026-12-01"),
    statutDemande: "en_attente",
    dateCreation: new Date()
  });
  console.log("Commande groupée créée avec ID :", cmdGrpRef.id);
}

runTests().catch(console.error);
