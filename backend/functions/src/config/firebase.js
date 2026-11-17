const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");

const app = initializeApp();

module.exports = {
  auth: getAuth(app),
  db: getFirestore(app),
};