const { HttpsError } = require("firebase-functions/v2/https");

const invalide = (msg) => new HttpsError("invalid-argument", msg);

function text(value, field, { min = 1, max = 100, required = true } = {}) {
  if (value === undefined || value === null || value === "") {
    if (required) throw invalide(`Le champ "${field}" est obligatoire.`);
    return null;
  }
  if (typeof value !== "string") throw invalide(`Le champ "${field}" doit être du texte.`);
  const clean = value.trim();
  if (clean.length < min || clean.length > max) {
    throw invalide(`Le champ "${field}" doit contenir entre ${min} et ${max} caractères.`);
  }
  return clean;
}

function nombre(value, field, { min, max }) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw invalide(`Le champ "${field}" doit être un nombre.`);
  }
  if (value < min || value > max) {
    throw invalide(`Le champ "${field}" doit être entre ${min} et ${max}.`);
  }
  return Math.round(value * 1000) / 1000; // 3 décimales (millimes TND)
}

function entier(value, field, { min, max }) {
  if (!Number.isInteger(value)) throw invalide(`Le champ "${field}" doit être un entier.`);
  if (value < min || value > max) {
    throw invalide(`Le champ "${field}" doit être entre ${min} et ${max}.`);
  }
  return value;
}

function booleen(value, field) {
  if (typeof value !== "boolean") throw invalide(`Le champ "${field}" doit être vrai ou faux.`);
  return value;
}

function parmi(value, field, valeurs) {
  if (!valeurs.includes(value)) {
    throw invalide(`Le champ "${field}" doit valoir : ${valeurs.join(", ")}.`);
  }
  return value;
}

module.exports = { text, nombre, entier, booleen, parmi, invalide };
