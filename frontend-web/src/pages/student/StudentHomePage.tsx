import { useState } from 'react';
import {
  ChevronRight,
  Clock,
  Leaf,
  MapPin,
  QrCode,
  Search,
  Store,
  Tag
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { calcDiscountPercent, formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOffer, StudentOrder, StudentProfile } from '@/types/student';
import type { FormEvent } from 'react';
import { EmptyState } from '@/components/common/EmptyState';
import EcoPointsCard from '@/components/p5/EcoPointsCard';
import EcoImpactDashboard from '@/components/p5/EcoImpactDashboard';
import EcoBadgesGrid from '@/components/p5/EcoBadgesGrid';
import SurpriseBasketCard from '@/components/p5/SurpriseBasketCard';
// ============================================================================
// PAGE 03 – ACCUEIL / TABLEAU DE BORD ÉTUDIANT
// ============================================================================
interface StudentHomePageProps {
  student: StudentProfile;
  offers: StudentOffer[];
  restaurants: Restaurant[];
  orders: StudentOrder[];
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function StudentHomePage({ student, offers, restaurants, orders, onNavigate }: StudentHomePageProps) {
  const [searchInput, setSearchInput] = useState('');
  const [basketExpiration] = useState(() => new Date(Date.now() + 2 * 60 * 60 * 1000));

  const featuredOffers = offers.filter((o) => o.featured && o.quantity > 0);
  const recentOffers = offers.filter((o) => o.isRecent && o.quantity > 0);
  const readyOrder = orders.find((o) => o.orderStatus.includes('Confirmée'));

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNavigate('explore', { searchProduct: searchInput, category: 'Tous' });
  };

  return (
    <div className="space-y-8">
      {/* Bannière d'accueil personnalisée */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C98B]/60 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C6749]/10 text-[#4C6749] text-xs font-bold mb-3">
              <Leaf className="w-3.5 h-3.5" />
              Anti-gaspillage alimentaire • Campus ESSECT Montfleury
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Bonjour{student.fullName.trim() ? `, ${student.fullName.trim().split(' ')[0]}` : ''} 👋
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 leading-relaxed">
              Découvrez les invendus du jour préparés par les restaurants et cafétérias autour de
              l’ESSECT à prix réduit.
            </p>

            {/* Barre de recherche rapide */}
            <form onSubmit={handleSearchSubmit} className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Rechercher un plat, un panini, une viennoiserie..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#F8F1E7] border border-[#E9C98B]/70 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:border-[#A84F32]"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm transition-colors shrink-0"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Raccourci commande prête à récupérer (QR Code) */}
          {readyOrder && (
            <div className="lg:w-80 bg-[#F8F1E7] rounded-2xl p-4 border border-[#E9C98B] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#4C6749]">
                    Commande prête au retrait
                  </span>
                  <span className="text-xs font-bold text-stone-700">{readyOrder.id}</span>
                </div>
                <p className="text-sm font-bold text-stone-900 line-clamp-1">
                  {readyOrder.productTitle}
                </p>
                <p className="text-xs text-stone-600 mt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D98245]" />
                  Retrait : {readyOrder.pickupHours}
                </p>
              </div>
              <button
                onClick={() => onNavigate('confirmation-qr', { orderId: readyOrder.id })}
                className="mt-3 w-full py-2.5 px-4 rounded-xl bg-[#4C6749] hover:bg-[#3D543A] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-4 h-4" />
                Afficher mon QR Code
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 1 : Offres à la une */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">Offres à la une</h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Sélection des meilleures réductions disponibles immédiatement
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore', { category: 'Tous' })}
            className="inline-flex items-center gap-1 text-sm font-bold text-[#A84F32] hover:underline"
          >
            Tout explorer
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredOffers.length === 0 && (
          <EmptyState
            compact
            icon={Tag}
            title="Aucune offre disponible pour le moment."
            description="Les offres des commerçants partenaires apparaîtront ici dès leur publication."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {featuredOffers.map((offer) => {
            const rest = restaurants.find((r) => r.id === offer.restaurantId);
            const discount = calcDiscountPercent(offer.initialPrice, offer.reducedPrice);
            return (
              <div
                key={offer.id}
                onClick={() => onNavigate('offer-details', { offerId: offer.id, quantity: 1 })}
                className="group bg-white rounded-2xl border border-[#E9C98B]/50 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
              >
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <SafeImage
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#A84F32] text-white text-xs font-extrabold shadow-xs">
                    -{discount}%
                  </span>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 text-stone-800 text-xs font-bold shadow-xs">
                    {offer.quantity} restant{offer.quantity > 1 ? 's' : ''}
                  </span>
                  {offer.isSurpriseBasket && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-[#4C6749] text-white text-[11px] font-bold">
                      Panier surprise
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-[#D98245] mb-1 truncate">
                      {rest?.name}
                    </p>
                    <h3 className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 group-hover:text-[#A84F32] transition-colors">
                      {offer.title}
                    </h3>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 line-through block">
                        {formatPrice(offer.initialPrice)}
                      </span>
                      <span className="text-base font-extrabold text-[#4C6749]">
                        {formatPrice(offer.reducedPrice)}
                      </span>
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-[#F8F1E7] group-hover:bg-[#A84F32] group-hover:text-white text-stone-800 text-xs font-bold transition-colors">
                      Voir l’offre
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2 : Restaurants & Cafétérias autour de l'ESSECT */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              Restaurants & Cafétérias partenaires
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Établissements partenaires autour du campus
            </p>
          </div>
        </div>

        {restaurants.length === 0 && (
          <EmptyState
            compact
            icon={Store}
            title="Aucun établissement partenaire pour le moment."
            description="Les restaurants et cafétérias partenaires apparaîtront ici."
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((rest) => (
            <div
              key={rest.id}
              onClick={() =>
                onNavigate('explore', {
                  searchRestaurant: rest.name,
                  searchProduct: '',
                  category: 'Tous'
                })
              }
              className="bg-white rounded-2xl p-4 border border-[#E9C98B]/50 hover:border-[#A84F32] transition-all cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#F8F1E7] text-[#A84F32] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-stone-900 text-sm truncate">{rest.name}</h3>
                  <p className="text-xs text-stone-500 truncate">{rest.type}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-600">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#4C6749]">
                      <MapPin className="w-3.5 h-3.5" />
                      {rest.distanceMeters} m
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D98245]" />
                      {rest.pickupHours}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#E9C98B]/40 text-stone-800 text-xs font-bold shrink-0">
                {rest.activeOffersCount} offres
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3 : Ajoutées récemment */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">Ajoutées récemment</h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Derniers invendus publiés par les commerçants du quartier
            </p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-sm font-bold text-[#A84F32] hover:underline"
          >
            Voir le catalogue complet
          </button>
        </div>

        {recentOffers.length === 0 && (
          <EmptyState
            compact
            icon={Clock}
            title="Aucune offre publiée récemment."
            description="Les derniers invendus publiés par les commerçants s’afficheront ici."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentOffers.map((offer) => {
            const rest = restaurants.find((r) => r.id === offer.restaurantId);
            const discount = calcDiscountPercent(offer.initialPrice, offer.reducedPrice);
            return (
              <div
                key={offer.id}
                onClick={() => onNavigate('offer-details', { offerId: offer.id, quantity: 1 })}
                className="bg-white rounded-2xl p-3.5 border border-[#E9C98B]/50 hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
              >
                <SafeImage
                  src={offer.image}
                  alt={offer.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-[#A84F32]/10 text-[#A84F32] text-[11px] font-bold">
                      -{discount}%
                    </span>
                    <span className="text-xs text-stone-500 truncate">{rest?.name}</span>
                  </div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base line-clamp-1">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D98245]" />
                      {offer.pickupHours}
                    </span>
                    <span className="font-semibold text-stone-700">
                      Dispo : {offer.quantity}
                    </span>
                  </p>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-extrabold text-[#4C6749]">
                        {formatPrice(offer.reducedPrice)}
                      </span>
                      <span className="text-xs text-stone-400 line-through">
                        {formatPrice(offer.initialPrice)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[#A84F32]">Réserver →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4 : MODULES BONUS P5 */}
      <section className="pt-8 border-t border-stone-200">
        <h2 className="text-xl font-extrabold text-stone-900 mb-4">
          Mes Avantages Éco-responsables 🌱
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <EcoPointsCard />
          <EcoImpactDashboard />
          <EcoBadgesGrid />
          <SurpriseBasketCard
            basket={{
              titre: "Panier Surprise - Boulangerie",
              nomCommerce: "Pâtisserie Le Délice",
              description: "Assortiment de viennoiseries et pains invendus du jour.",
              prixInitial: 15,
              prixReduit: 5,
              quantiteDisponible: 3,
              horaireRecuperation: "18:00 - 19:30",
              dateExpiration: basketExpiration
            }}
          />
        </div>
      </section>
    </div>
  );
}
