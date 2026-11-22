import { useState } from 'react';
import {
  Award,
  BarChart3,
  Gift,
  Leaf,
  Radar,
  Store
} from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOffer, StudentOrder, StudentProfile } from '@/types/student';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 14 – STATISTIQUES ÉTUDIANT & MODULES BONUS OPTIONNELS
// ============================================================================
interface StudentStatisticsPageProps {
  student: StudentProfile;
  orders: StudentOrder[];
  offers: StudentOffer[];
  restaurants: Restaurant[];
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function StudentStatisticsPage({ student, orders, offers, restaurants, onNavigate }: StudentStatisticsPageProps) {
  const [selectedRadarId, setSelectedRadarId] = useState<string | null>(null);
  const selectedRadarRest = restaurants.find((r) => r.id === selectedRadarId) ?? restaurants[0];

  // Calculs strictement basés sur les données réelles de commandes du cahier des charges
  const validPaidOrders = orders.filter((o) => o.paymentStatus === 'Payée');
  const collectedOrders = orders.filter((o) => o.orderStatus.includes('Récupérée'));
  const totalSpent = validPaidOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const totalInitialValue = validPaidOrders.reduce(
    (acc, o) => acc + o.initialUnitPrice * o.quantity,
    0
  );
  const totalSavedMoney = Math.max(0, totalInitialValue - totalSpent);

  // Calculs pour les modules facultatifs (Bonus)
  const totalFoodSavedKg = validPaidOrders.reduce((acc, o) => acc + (o.weightKg ?? 0), 0);
  const co2AvoidedKg = totalFoodSavedKg * 2.5;
  const surpriseBaskets = offers.filter((o) => o.isSurpriseBasket);

  return (
    <div className="space-y-10">
      {/* ==================================================================== */}
      {/* PARTIE 1 : STATISTIQUES OBLIGATOIRES (CAHIER DES CHARGES)            */}
      {/* ==================================================================== */}
      <section className="space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Mes statistiques d’activité
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Suivi personnel de vos commandes et des économies réalisées sur CampusSave.
          </p>
        </div>

        {orders.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="Vos statistiques apparaîtront ici."
            description="Elles seront calculées à partir de vos premières commandes : économies réalisées, commandes récupérées et budget."
            action={{ label: 'Explorer les offres', onClick: () => onNavigate('explore') }}
          />
        ) : (
          <>
        {/* 4 Indicateurs clés obligatoires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Commandes validées
            </span>
            <p className="text-3xl font-extrabold text-stone-900 mt-2">
              {validPaidOrders.length}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Sur {orders.length} réservation(s) enregistrée(s)
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Commandes récupérées
            </span>
            <p className="text-3xl font-extrabold text-[#4C6749] mt-2">
              {collectedOrders.length}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Validées par scan QR Code au comptoir
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Économies réalisées
            </span>
            <p className="text-3xl font-extrabold text-[#A84F32] mt-2">
              {formatPrice(totalSavedMoney)}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Différence entre prix initial et prix réduit
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
            <span className="text-xs font-bold text-stone-400 uppercase">
              Total dépensé
            </span>
            <p className="text-3xl font-extrabold text-[#D98245] mt-2">
              {formatPrice(totalSpent)}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Valeur réelle des repas : {formatPrice(totalInitialValue)}
            </p>
          </div>
        </div>

        {/* Visualisation comparative Budget Payé vs Économisé */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9C98B]/60">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="font-extrabold text-stone-900 text-base">
              Répartition de votre budget alimentaire CampusSave
            </h2>
            <span className="text-xs font-bold text-[#4C6749]">
              Taux moyen de réduction :{' '}
              {totalInitialValue > 0
                ? Math.round((totalSavedMoney / totalInitialValue) * 100)
                : 0}
              %
            </span>
          </div>

          <div className="w-full h-5 rounded-full bg-[#F8F1E7] overflow-hidden flex">
            <div
              style={{
                width: `${
                  totalInitialValue > 0 ? (totalSpent / totalInitialValue) * 100 : 50
                }%`
              }}
              className="bg-[#D98245] h-full transition-all"
              title="Montant payé"
            />
            <div
              style={{
                width: `${
                  totalInitialValue > 0 ? (totalSavedMoney / totalInitialValue) * 100 : 50
                }%`
              }}
              className="bg-[#4C6749] h-full transition-all"
              title="Montant économisé"
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-6 text-xs font-semibold">
            <span className="flex items-center gap-2 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-[#D98245]" />
              Montant payé ({formatPrice(totalSpent)})
            </span>
            <span className="flex items-center gap-2 text-stone-700">
              <span className="w-3 h-3 rounded-full bg-[#4C6749]" />
              Économies réalisées ({formatPrice(totalSavedMoney)})
            </span>
          </div>
        </div>
          </>
        )}
      </section>

      {/* ==================================================================== */}
      {/* PARTIE 2 : FONCTIONNALITÉS INNOVANTES FACULTATIVES (BONUS)           */}
      {/* ==================================================================== */}
      <section className="pt-8 border-t-2 border-dashed border-[#E9C98B] space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Impact, EcoPoints, Campus Radar & Surprise Basket
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Suivez votre impact, vos points, les commerces autour du campus et les paniers surprise.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BONUS 1 : Impact Dashboard */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base">
                <Leaf className="w-5 h-5 text-[#4C6749]" />
                Impact Dashboard
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Visualisation des quantités alimentaires sauvées et du gaspillage évité grâce à vos commandes.
            </p>
            {validPaidOrders.length === 0 && (
              <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">
                Votre impact sera calculé à partir de vos premières commandes récupérées.
              </p>
            )}
            <div className={validPaidOrders.length === 0 ? 'hidden' : 'grid grid-cols-2 gap-3 pt-1'}>
              <div className="p-4 rounded-2xl bg-[#F8F1E7]">
                <span className="text-xs text-stone-500 block">Nourriture sauvée</span>
                <span className="text-2xl font-extrabold text-[#4C6749]">
                  {totalFoodSavedKg.toFixed(2).replace('.', ',')} kg
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F1E7]">
                <span className="text-xs text-stone-500 block">Émissions CO₂ évitées (estimation)</span>
                <span className="text-2xl font-extrabold text-[#A84F32]">
                  {co2AvoidedKg.toFixed(2).replace('.', ',')} kg
                </span>
              </div>
            </div>
          </div>

          {/* BONUS 2 : EcoPoints */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base">
                <Award className="w-5 h-5 text-[#D98245]" />
                Programme EcoPoints
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Attribution automatique de points après chaque récupération de commande validée par QR Code.
            </p>
            <div className="p-4 rounded-2xl bg-[#F8F1E7] flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">Solde actuel</span>
                <span className="text-2xl font-extrabold text-[#A84F32]">
                  {student.ecoPoints} EcoPoints
                </span>
              </div>
            </div>
          </div>

          {/* BONUS 3 : Campus Radar (Localisation autour de l'ESSECT) */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base">
                <Radar className="w-5 h-5 text-[#A84F32]" />
                Campus Radar (autour du campus)
              </span>
            </div>

            {!selectedRadarRest ? (
              <EmptyState
                compact
                icon={Store}
                title="Aucun commerce partenaire pour le moment."
                description="Les établissements autour du campus s’afficheront ici dès leur inscription."
              />
            ) : (
              <>
            {/* Carte schématique des commerces partenaires */}
            <div className="relative h-52 rounded-2xl bg-[#F8F1E7] border border-[#E9C98B] overflow-hidden p-3">
              {/* Cercles radar */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full border border-[#4C6749]/20" />
                <div className="absolute w-40 h-40 rounded-full border border-[#4C6749]/30" />
              </div>

              {/* Point central Campus ESSECT */}
              <div
                style={{ left: '48%', top: '48%' }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center"
              >
                <span className="px-2.5 py-1 rounded-full bg-stone-900 text-white text-[10px] font-extrabold shadow-md">
                  🎓 ESSECT
                </span>
              </div>

              {/* Marqueurs des commerces partenaires */}
              {restaurants.map((rest) => {
                const isSelected = selectedRadarRest?.id === rest.id;
                return (
                  <button
                    key={rest.id}
                    type="button"
                    onClick={() => setSelectedRadarId(rest.id)}
                    style={{ left: `${rest.coords.x}%`, top: `${rest.coords.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-lg text-[10px] font-bold transition-all shadow-xs ${
                      isSelected
                        ? 'bg-[#A84F32] text-white scale-110 z-20'
                        : 'bg-white text-stone-800 border border-[#E9C98B] hover:bg-[#E9C98B]/40 z-10'
                    }`}
                  >
                    {rest.distanceMeters}m
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-2 text-xs bg-[#F8F1E7]/60 p-3 rounded-xl">
              <div>
                <p className="font-bold text-stone-900">{selectedRadarRest.name}</p>
                <p className="text-stone-500">
                  À {selectedRadarRest.distanceMeters}m • Retrait {selectedRadarRest.pickupHours}
                </p>
              </div>
              <button
                onClick={() =>
                  onNavigate('explore', {
                    searchRestaurant: selectedRadarRest.name,
                    category: 'Tous'
                  })
                }
                className="px-3 py-1.5 rounded-lg bg-[#A84F32] text-white font-bold shrink-0"
              >
                Voir offres
              </button>
            </div>
              </>
            )}
          </div>

          {/* BONUS 4 : Surprise Basket */}
          <div className="bg-white rounded-3xl p-6 border border-[#4C6749]/30 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 font-extrabold text-stone-900 text-base">
                  <Gift className="w-5 h-5 text-[#D98245]" />
                  Surprise Basket (Paniers Invendus)
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Paniers alimentaires composés d’invendus du jour à tarif ultra-préférentiel.
              </p>

              {surpriseBaskets.length === 0 && (
                <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">
                  Aucun panier surprise n’est proposé pour le moment.
                </p>
              )}
              <div className="space-y-2.5">
                {surpriseBaskets.map((basket) => (
                  <div
                    key={basket.id}
                    onClick={() =>
                      onNavigate('offer-details', { offerId: basket.id, quantity: 1 })
                    }
                    className="p-3 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/40 cursor-pointer flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-stone-900 truncate">{basket.title}</p>
                      <p className="text-[11px] text-stone-500">
                        {basket.quantity} panier(s) • {basket.pickupHours}
                      </p>
                    </div>
                    <span className="font-extrabold text-sm text-[#4C6749] shrink-0">
                      {formatPrice(basket.reducedPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('explore', { category: 'Paniers Surprise' })}
              className="w-full py-2.5 px-4 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold transition-colors"
            >
              Explorer tous les Paniers Surprise
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
