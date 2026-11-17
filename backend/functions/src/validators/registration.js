const { HttpsError } = require("firebase-functions/v2/https");
const { ROLES, SELF_REGISTRATION_ROLES } = require("../constants/roles");
const { text } = require("./common");

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

  if (data.role === ROLES.COMMERCANT) {
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
