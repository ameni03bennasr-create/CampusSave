type EcoPointsData = {
  solde: number;
  niveau: string;
  historique: {
    id: number;
    motif: string;
    points: number;
    date: string;
  }[];
};

export default function EcoPointsCard({ pointsData }: { pointsData?: EcoPointsData }) {
  const data = pointsData || {
    solde: 250, niveau: "Éco-Citoyen Confirmé",
    historique: [
      { id: 1, motif: "Achat Panier Surprise", points: 50, date: "Hier" },
      { id: 2, motif: "Validation Retrait", points: 30, date: "Il y a 3 jours" }
    ]
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-6 w-full">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-yellow-500 p-4 rounded-xl text-white shadow-md">
        <div>
          <p className="text-xs uppercase opacity-90">Solde Actuel</p>
          <h3 className="text-3xl font-extrabold mt-1">{data.solde} <span className="text-lg">pts</span></h3>
        </div>
        <span className="bg-white/20 text-xs px-3 py-1 rounded-full">🏆 {data.niveau}</span>
      </div>
      <div className="mt-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Derniers gains</h4>
        <div className="space-y-2">
          {data.historique.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm">
              <div><p className="font-medium text-gray-800">{item.motif}</p><span className="text-xs text-gray-400">{item.date}</span></div>
              <span className="font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs">+{item.points} pts</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}