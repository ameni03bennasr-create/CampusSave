type EcoImpactStats = {
  produitsSauves: number;
  poidsRecupereKg: number;
  co2EviteKg: number;
  repasEquivalent: number;
};

export default function EcoImpactDashboard({ stats }: { stats?: EcoImpactStats }) {
  const data = stats || { produitsSauves: 12, poidsRecupereKg: 4.5, co2EviteKg: 11.2, repasEquivalent: 9 };
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-6 w-full">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🌱 Mon Impact Écologique</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100"><span className="text-2xl font-extrabold text-green-700">{data.produitsSauves}</span><p className="text-xs text-gray-600 mt-1">Produits sauvés</p></div>
        <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100"><span className="text-2xl font-extrabold text-blue-700">{data.poidsRecupereKg} kg</span><p className="text-xs text-gray-600 mt-1">Nourriture sauvée</p></div>
        <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100"><span className="text-2xl font-extrabold text-emerald-700">{data.co2EviteKg} kg</span><p className="text-xs text-gray-600 mt-1">CO₂ évité</p></div>
        <div className="bg-amber-50 p-4 rounded-xl text-center border border-amber-100"><span className="text-2xl font-extrabold text-amber-700">{data.repasEquivalent}</span><p className="text-xs text-gray-600 mt-1">Repas équivalents</p></div>
      </div>
    </div>
  );
}