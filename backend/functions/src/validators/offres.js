const { HttpsError } = require("firebase-functions/v2/https");
const { text, nombre, entier, booleen, parmi } = require("./common");
const { STATUT_OFFRE } = require("../constants/statuts");

// Champs de l'offre (mêmes noms que dans Firestore et dans le frontend).
const VALIDATEURS = {
  titre: (v) => text(v, "titre", { min: 2, max: 100 }),
  description: (v) => text(v, "description", { max: 500, required: false }) ?? "",
  prixInitial: (v) => nombre(v, "prixInitial", { min: 0.001, max: 100000 }),
  prixReduit: (v) => nombre(v, "prixReduit", { min: 0, max: 100000 }),
  quantiteDisponible: (v) => entier(v, "quantiteDisponible", { min: 0, max: 1000 }),
  estSurpriseBasket: (v) => booleen(v, "estSurpriseBasket"),
  horaireRecuperation: (v) => text(v, "horaireRecuperation", { max: 100, required: false }) ?? "",
  photo: (v) => text(v, "photo", { max: 500, required: false }) ?? "",
  statut: (v) => parmi(v, "statut", Object.values(STATUT_OFFRE)),
};

const CHAMPS_MODIFIABLES = Object.keys(VALIDATEURS);

function verifierPrix(prixInitial, prixReduit) {
  if (prixReduit > prixInitial) {
    throw new HttpsError("invalid-argument", "Le prix réduit ne peut pas dépasser le prix initial.");
  }
}

function validerCreation(d) {
  if (!d || typeof d !== "object") throw new HttpsError("invalid-argument", "Données manquantes.");
  const offre = {
    titre: VALIDATEURS.titre(d.titre),
    description: VALIDATEURS.description(d.description),
    prixInitial: VALIDATEURS.prixInitial(d.prixInitial),
    prixReduit: VALIDATEURS.prixReduit(d.prixReduit),
    quantiteDisponible: VALIDATEURS.quantiteDisponible(d.quantiteDisponible),
    estSurpriseBasket: d.estSurpriseBasket === undefined ? false : VALIDATEURS.estSurpriseBasket(d.estSurpriseBasket),
    horaireRecuperation: VALIDATEURS.horaireRecuperation(d.horaireRecuperation),
    photo: VALIDATEURS.photo(d.photo),
    statut: d.statut === undefined ? STATUT_OFFRE.ACTIVE : VALIDATEURS.statut(d.statut),
  };
  if (offre.quantiteDisponible < 1) {
    throw new HttpsError("invalid-argument", 'Le champ "quantiteDisponible" doit être au moins 1.');
  }
  verifierPrix(offre.prixInitial, offre.prixReduit);
  return offre;
}

// Ne retient que les champs autorisés (commercantId, dateCreation... sont ignorés).
function validerModification(d) {
  if (!d || typeof d !== "object") throw new HttpsError("invalid-argument", "Données manquantes.");
  const changes = {};
  for (const champ of CHAMPS_MODIFIABLES) {
    if (d[champ] !== undefined) changes[champ] = VALIDATEURS[champ](d[champ]);
  }
  if (Object.keys(changes).length === 0) {
    throw new HttpsError("invalid-argument", "Aucun champ à modifier.");
  }
  return changes;
}

module.exports = { validerCreation, validerModification, verifierPrix };
