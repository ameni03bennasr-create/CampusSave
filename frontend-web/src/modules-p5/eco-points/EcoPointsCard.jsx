import React from 'react';

export default function EcoPointsCard({ pointsData }) {
  // Données par défaut si le backend n'a pas encore transmis le profil complet
  const data = pointsData || {
    solde: 250,
    niveau: "Éco-Citoyen Confirmé",
    historique: [
      { id: 1, motif: "Achat Panier Surprise - Boulangerie", points: +50, date: "Hier" },
      { id: 2, motif: "Validation Retrait Commande", points: +30, date: "Il y a 3 jours" },
      { id: 3, motif: "Bonus parrainage campus", points: +100, date: "La semaine dernière" }
    ]
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 max-w-md">
      {/* En-tête du solde de points */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-yellow-500 p-4 rounded-xl text-white shadow-md">
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold opacity-90">Solde Actuel</p>
          <h3 className="text-3xl font-extrabold mt-1">{data.solde} <span className="text-lg font-normal">pts</span></h3>
        </div>
        <div className="text-right">
          <span className="bg-white/20 text-xs px-3 py-1 rounded-full font-medium">
            🏆 {data.niveau}
          </span>
        </div>
      </div>

      {/* Historique récent */}
      <div className="mt-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Derniers gains d'EcoPoints
        </h4>
        <div className="space-y-2">
          {data.historique && data.historique.length > 0 ? (
            data.historique.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{item.motif}</p>
                  <span className="text-xs text-gray-400">{item.date}</span>
                </div>
                <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs">
                  +{item.points} pts
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-2">Aucun historique récent pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}