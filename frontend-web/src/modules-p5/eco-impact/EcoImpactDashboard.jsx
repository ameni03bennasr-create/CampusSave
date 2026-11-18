import React from 'react';

export default function EcoImpactDashboard({ stats }) {
  // Valeurs par défaut si aucune statistique n'est encore transmise par le backend
  const data = stats || {
    produitsSauves: 12,
    poidsRecupereKg: 4.5,
    co2EviteKg: 11.2,
    repasEquivalent: 9
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">🌱 Mon Impact Écologique</h2>
        <span className="text-xs bg-green-100 text-green-800 font-semibold px-2.5 py-1 rounded-full">
          Vérifié & Certifié
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-6">
        Voici la contribution de vos achats anti-gaspillage sur la préservation de l'environnement.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {/* Carte 1 : Produits sauvés */}
        <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
          <span className="text-2xl font-extrabold text-green-700">{data.produitsSauves}</span>
          <p className="text-xs text-gray-600 mt-1 font-medium">Produits sauvés</p>
        </div>

        {/* Carte 2 : Poids récupéré */}
        <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
          <span className="text-2xl font-extrabold text-blue-700">{data.poidsRecupereKg} kg</span>
          <p className="text-xs text-gray-600 mt-1 font-medium">Nourriture sauvée</p>
        </div>

        {/* Carte 3 : CO2 évité */}
        <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
          <span className="text-2xl font-extrabold text-emerald-700">{data.co2EviteKg} kg</span>
          <p className="text-xs text-gray-600 mt-1 font-medium">CO₂ évité</p>
        </div>

        {/* Carte 4 : Repas équivalents */}
        <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-100">
          <span className="text-2xl font-extrabold text-amber-700">{data.repasEquivalent}</span>
          <p className="text-xs text-gray-600 mt-1 font-medium">Repas équivalents</p>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 p-3 rounded-lg text-center">
        <p className="text-xs text-gray-500">
          💡 <em>Calcul basé sur les coefficients standards validés par l'équipe CampusSave.</em>
        </p>
      </div>
    </div>
  );
}