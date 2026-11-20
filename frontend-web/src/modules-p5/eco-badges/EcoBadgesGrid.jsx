import React from 'react';

export default function EcoBadgesGrid({ badgesData }) {
  // Données par défaut si le backend ne fournit pas encore la liste complète
  const badges = badgesData || [
    {
      id: 1,
      titre: "Premier Pas Vert",
      description: "A validé son tout premier panier anti-gaspi.",
      icone: "🌱",
      debloque: true,
      dateObtention: "12 Oct 2026"
    },
    {
      id: 2,
      titre: "Héros Zéro Déchet",
      description: "A sauvé plus de 10 paniers de la mise au rebut.",
      icone: "🏅",
      debloque: true,
      dateObtention: "02 Nov 2026"
    },
    {
      id: 3,
      titre: "Gardien du Climat",
      description: "A évité l'émission de 10 kg de CO₂.",
      icone: "🌍",
      debloque: true,
      dateObtention: "15 Nov 2026"
    },
    {
      id: 4,
      titre: "Ambassadeur Campus",
      description: "A parrainé 3 amis sur la plateforme CampusSave.",
      icone: "🎓",
      debloque: false,
      progression: "2/3 parrainages"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-6 max-w-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">🎖️ Mes Badges & Accomplissements</h3>
        <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">
          {badges.filter(b => b.debloque).length} / {badges.length} Débloqués
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-6">
        Collectionne des badges en adoptant des habitudes écoresponsables au quotidien sur le campus.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`p-4 rounded-xl border transition-all duration-200 flex items-start space-x-3 ${
              badge.debloque
                ? 'bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-green-200 shadow-sm'
                : 'bg-gray-50/70 border-gray-200 opacity-60 grayscale'
            }`}
          >
            <div className="text-3xl p-2 bg-white rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
              {badge.icone}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-800 text-sm truncate">{badge.titre}</h4>
                {badge.debloque && (
                  <span className="text-[10px] text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded">
                    ✓ Débloqué
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{badge.description}</p>
              
              <div className="mt-2 text-[11px] font-medium">
                {badge.debloque ? (
                  <span className="text-gray-400">Obtenu le {badge.dateObtention}</span>
                ) : (
                  <span className="text-amber-600 font-semibold">Progression : {badge.progression}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}