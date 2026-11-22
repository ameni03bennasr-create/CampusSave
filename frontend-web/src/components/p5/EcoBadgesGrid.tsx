interface Badge {
  id: number;
  titre: string;
  description: string;
  icone: string;
  debloque: boolean;
  dateObtention?: string;
  progression?: string;
}

export default function EcoBadgesGrid({ badgesData }: { badgesData?: Badge[] }) {
  const badges = badgesData || [
    { id: 1, titre: "Premier Pas Vert", description: "A validé son tout premier panier.", icone: "🌱", debloque: true, dateObtention: "12 Oct" },
    { id: 2, titre: "Héros Zéro Déchet", description: "A sauvé 10 paniers.", icone: "🏅", debloque: true, dateObtention: "02 Nov" },
    { id: 3, titre: "Gardien du Climat", description: "A évité 10 kg de CO₂.", icone: "🌍", debloque: true, dateObtention: "15 Nov" },
    { id: 4, titre: "Ambassadeur Campus", description: "A parrainé 3 amis.", icone: "🎓", debloque: false, progression: "2/3" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">🎖️ Mes Badges</h3>
        <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">{badges.filter(b => b.debloque).length} / {badges.length} Débloqués</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className={`p-4 rounded-xl border flex items-start space-x-3 ${badge.debloque ? 'bg-green-50/50 border-green-200' : 'bg-gray-50/70 border-gray-200 opacity-60 grayscale'}`}>
            <div className="text-3xl p-2 bg-white rounded-xl shadow-sm border border-gray-100">{badge.icone}</div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm truncate">{badge.titre}</h4>
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{badge.description}</p>
              {badge.debloque && <span className="text-[10px] text-green-700 font-bold bg-green-100 px-1.5 py-0.5 rounded mt-2 inline-block">✓ Obtenu le {badge.dateObtention}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}