const { Timestamp } = require("firebase-admin/firestore");

// Les Timestamp Firestore deviennent des chaînes ISO (lisibles par React et Flutter).
function serialiser(valeur) {
  if (valeur instanceof Timestamp) return valeur.toDate().toISOString();
  if (Array.isArray(valeur)) return valeur.map(serialiser);
  if (valeur && typeof valeur === "object") {
    return Object.fromEntries(Object.entries(valeur).map(([k, v]) => [k, serialiser(v)]));
  }
  return valeur;
}

module.exports = { serialiser };
