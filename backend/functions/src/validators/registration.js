const { HttpsError } = require("firebase-functions/v2/https");
const { ROLES, SELF_REGISTRATION_ROLES } = require("../auth/roles");

function text(value, field, { min = 1, max = 100, required = true } = {}) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      throw new HttpsError("invalid-argument", `Le champ "${field}" est obligatoire.`);
    }
    return null;
  }
  if (typeof value !== "string") {
    throw new HttpsError("invalid-argument", `Le champ "${field}" doit être du texte.`);
  }
  const clean = value.trim();
  if (clean.length < min || clean.length > max) {
    throw new HttpsError(
      "invalid-argument",
      `Le champ "${field}" doit contenir entre ${min} et ${max} caractères.`
    );
  }
  return clean;
}

function phone(value) {
  const clean = text(value, "telephone", { min: 8, max: 20, required: false });
  if (clean !== null && !/^[0-9+\s]+$/.test(clean)) {
    throw new HttpsError("invalid-argument", 'Le champ "telephone" est invalide.');
  }
  return clean;
}

function validateRegistrationData(data) {
  if (!data || typeof data !== "object") {
    throw new HttpsError("invalid-argument", "Données d'inscription manquantes.");
  }
  if (!SELF_REGISTRATION_ROLES.includes(data.role)) {
    throw new HttpsError("invalid-argument", "Rôle non autorisé pour l'inscription.");
  }

  const result = {
    role: data.role,
    nom: text(data.nom, "nom", { min: 2, max: 80 }),
    telephone: phone(data.telephone),
  };

  if (data.role === ROLES.MERCHANT) {
    result.nomCommerce = text(data.nomCommerce, "nomCommerce", { min: 2, max: 100 });
    result.adresse = text(data.adresse, "adresse", { min: 5, max: 200 });
    result.specialite = text(data.specialite, "specialite", { min: 2, max: 100 });
    result.description = text(data.description, "description", { max: 500, required: false });
  }

  if (data.role === ROLES.ASSOCIATION) {
    result.nomClub = text(data.nomClub, "nomClub", { min: 2, max: 100 });
    result.universite = text(data.universite, "universite", { min: 2, max: 100 });
  }

  return result;
}

module.exports = { validateRegistrationData };