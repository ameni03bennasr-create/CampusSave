// cSpell:disable
import { useState } from 'react';
import { Award, BarChart3, Gift, Leaf, Radar, Store } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOffer, StudentOrder, StudentProfile } from '@/types/student';
import { EmptyState } from '@/components/common/EmptyState';

interface StudentStatisticsPageProps {
  student: StudentProfile;
  orders: StudentOrder[];
  offers: StudentOffer[];
  restaurants: Restaurant[];
  onNavigate: (page: string, options?: StudentNavigateOptions) => void;
}

export function StudentStatisticsPage({ student, orders = [], offers = [], restaurants = [], onNavigate }: StudentStatisticsPageProps) {
  const [selectedRadarId, setSelectedRadarId] = useState<string | null>(null);
  const selectedRadarRest = restaurants.find((r) => r.id === selectedRadarId) ?? restaurants[0];

  const validPaidOrders = orders.filter((o) => o.paymentStatus === 'Payée' || o.paymentStatus === 'En attente');
  const collectedOrders = orders.filter((o) => o.orderStatus.includes('Récupérée'));
  const totalSpent = validPaidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalInitialValue = validPaidOrders.reduce((acc, o) => acc + o.initialUnitPrice * o.quantity, 0);
  const totalSavedMoney = Math.max(0, totalInitialValue - totalSpent);
  const totalFoodSavedKg = validPaidOrders.reduce((acc, o) => acc + (o.weightKg ?? 0), 0);
  const co2AvoidedKg = totalFoodSavedKg * 2.5;
  const surpriseBaskets = offers.filter((o) => o.isSurpriseBasket);

  return (
    <div className="space-y-10">
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Mes statistiques d’activité</h1>
          <p className="text-sm text-stone-500 mt-1">Suivi personnel de vos commandes et des économies réalisées sur CampusSave.</p>
        </div>

        {orders.length === 0 ? (
          <EmptyState icon={BarChart3} title="Vos statistiques apparaîtront ici." description="Elles seront calculées à partir de vos premières commandes." action={{ label: 'Explorer les offres', onClick: () => onNavigate('explore') }} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
                <span className="text-xs font-bold text-stone-400 uppercase">Commandes validées</span>
                <p className="text-3xl font-extrabold text-stone-900 mt-2">{validPaidOrders.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
                <span className="text-xs font-bold text-stone-400 uppercase">Commandes récupérées</span>
                <p className="text-3xl font-extrabold text-[#4C6749] mt-2">{collectedOrders.length}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
                <span className="text-xs font-bold text-stone-400 uppercase">Économies réalisées</span>
                <p className="text-3xl font-extrabold text-[#A84F32] mt-2">{formatPrice(totalSavedMoney)}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
                <span className="text-xs font-bold text-stone-400 uppercase">Total dépensé</span>
                <p className="text-3xl font-extrabold text-[#D98245] mt-2">{formatPrice(totalSpent)}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#E9C98B]/60">
              <h2 className="font-extrabold text-stone-900 text-base mb-4">Répartition de votre budget alimentaire</h2>
              <div className="w-full h-5 rounded-full bg-[#F8F1E7] overflow-hidden flex">
                <div style={{ width: `${totalInitialValue > 0 ? (totalSpent / totalInitialValue) * 100 : 50}%` }} className="bg-[#D98245] h-full transition-all" />
                <div style={{ width: `${totalInitialValue > 0 ? (totalSavedMoney / totalInitialValue) * 100 : 50}%` }} className="bg-[#4C6749] h-full transition-all" />
              </div>
            </div>
          </>
        )}
      </section>

      <section className="pt-8 border-t-2 border-dashed border-[#E9C98B] space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">Impact, EcoPoints, Campus Radar & Surprise Basket</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Impact Dashboard */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4">
            <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base"><Leaf className="w-5 h-5 text-[#4C6749]" /> Impact Dashboard</span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-4 rounded-2xl bg-[#F8F1E7]">
                <span className="text-xs text-stone-500 block">Nourriture sauvée</span>
                <span className="text-2xl font-extrabold text-[#4C6749]">{totalFoodSavedKg.toFixed(2).replace('.', ',')} kg</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F1E7]">
                <span className="text-xs text-stone-500 block">Émissions CO₂ évitées</span>
                <span className="text-2xl font-extrabold text-[#A84F32]">{co2AvoidedKg.toFixed(2).replace('.', ',')} kg</span>
              </div>
            </div>
          </div>

          {/* EcoPoints */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4">
            <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base"><Award className="w-5 h-5 text-[#D98245]" /> Programme EcoPoints</span>
            <div className="p-4 rounded-2xl bg-[#F8F1E7] flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Solde actuel</span>
                <span className="text-2xl font-extrabold text-[#A84F32]">{student.ecoPoints} EcoPoints</span>
              </div>
            </div>
          </div>

          {/* Campus Radar Sécurisé */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4">
            <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base"><Radar className="w-5 h-5 text-[#A84F32]" /> Campus Radar</span>
            {!selectedRadarRest ? (
              <EmptyState compact icon={Store} title="Aucun commerce partenaire." description="Les établissements s’afficheront ici." />
            ) : (
              <>
                <div className="relative h-52 rounded-2xl bg-[#F8F1E7] border border-[#E9C98B] overflow-hidden p-3">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-64 h-64 rounded-full border border-[#4C6749]/20" />
                    <div className="absolute w-40 h-40 rounded-full border border-[#4C6749]/30" />
                  </div>
                  <div style={{ left: '48%', top: '48%' }} className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    <span className="px-2.5 py-1 rounded-full bg-stone-900 text-white text-[10px] font-extrabold shadow-md">🎓 ESSECT</span>
                  </div>
                  {restaurants.map((rest) => {
                    const isSelected = selectedRadarRest?.id === rest.id;
                    // SÉCURISATION ICI : on utilise les coordonnées si elles existent, sinon on met une position par défaut
                    const coordX = rest.coords?.x || 50;
                    const coordY = rest.coords?.y || 50;
                    return (
                      <button key={rest.id} type="button" onClick={() => setSelectedRadarId(rest.id)} style={{ left: `${coordX}%`, top: `${coordY}%` }} className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-[10px] font-bold transition-all shadow-xs ${isSelected ? 'bg-[#A84F32] text-white scale-110 z-20' : 'bg-white text-stone-800 border border-[#E9C98B] hover:bg-[#E9C98B]/40 z-10'}`}>
                        {rest.distanceMeters}m
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between gap-2 text-xs bg-[#F8F1E7]/60 p-3 rounded-xl">
                  <div>
                    <p className="font-bold text-stone-900">{selectedRadarRest.name}</p>
                    <p className="text-stone-500">À {selectedRadarRest.distanceMeters}m</p>
                  </div>
                  <button onClick={() => onNavigate('explore', { searchRestaurant: selectedRadarRest.name, category: 'Tous' })} className="px-3 py-1.5 rounded-lg bg-[#A84F32] text-white font-bold shrink-0">Voir offres</button>
                </div>
              </>
            )}
          </div>

          {/* Surprise Basket */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base"><Gift className="w-5 h-5 text-[#D98245]" /> Surprise Basket</span>
              <div className="space-y-2.5">
                {surpriseBaskets.map((basket) => (
                  <div key={basket.id} onClick={() => onNavigate('offer-details', { offerId: basket.id, quantity: 1 })} className="p-3 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/40 cursor-pointer flex items-center justify-between gap-3 transition-colors">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-stone-900 truncate">{basket.title}</p>
                      <p className="text-[11px] text-stone-500">{basket.quantity} panier(s) • {basket.pickupHours}</p>
                    </div>
                    <span className="font-extrabold text-sm text-[#4C6749] shrink-0">{formatPrice(basket.reducedPrice)}</span>
                  </div>
                ))}
                {surpriseBaskets.length === 0 && <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">Aucun panier surprise disponible.</p>}
              </div>
            </div>
            <button onClick={() => onNavigate('explore', { category: 'Paniers Surprise' })} className="w-full py-2.5 px-4 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold transition-colors">Explorer tous les Paniers Surprise</button>
          </div>
        </div>
      </section>
    </div>
  );
}