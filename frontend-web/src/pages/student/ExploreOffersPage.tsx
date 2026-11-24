import { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  Clock,
  RefreshCw,
  Search,
  Store
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { calcDiscountPercent, formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOffer } from '@/types/student';

// ============================================================================
// PAGE 04 – EXPLORER LES OFFRES
// ============================================================================
interface ExploreOffersPageProps {
  offers: StudentOffer[];
  restaurants: Restaurant[];
  initialSearchProduct: string;
  initialSearchRestaurant: string;
  initialCategory: string;
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function ExploreOffersPage({
  offers,
  restaurants,
  initialSearchProduct,
  initialSearchRestaurant,
  initialCategory,
  onNavigate
}: ExploreOffersPageProps) {
  const [productQuery, setProductQuery] = useState(initialSearchProduct || '');
  const [restaurantQuery, setRestaurantQuery] = useState(initialSearchRestaurant || '');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'Tous');
  const [maxPrice, setMaxPrice] = useState(15);
  const [sortBy, setSortBy] = useState('relevance');

  // Re-apply the prefilled filters when navigation provides new ones
  // (adjust state while rendering instead of syncing in an effect).
  const [prevInitialProduct, setPrevInitialProduct] = useState(initialSearchProduct);
  if (prevInitialProduct !== initialSearchProduct) {
    setPrevInitialProduct(initialSearchProduct);
    setProductQuery(initialSearchProduct || '');
  }
  const [prevInitialRestaurant, setPrevInitialRestaurant] = useState(initialSearchRestaurant);
  if (prevInitialRestaurant !== initialSearchRestaurant) {
    setPrevInitialRestaurant(initialSearchRestaurant);
    setRestaurantQuery(initialSearchRestaurant || '');
  }
  const [prevInitialCategory, setPrevInitialCategory] = useState(initialCategory);
  if (prevInitialCategory !== initialCategory) {
    setPrevInitialCategory(initialCategory);
    if (initialCategory) setSelectedCategory(initialCategory);
  }

  const categories = [
    'Tous',
    'Plats chauds',
    'Sandwichs & Paninis',
    'Viennoiseries & Pâtisseries',
    'Salades & Bowls',
    'Paniers Surprise'
  ];

  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        const rest = restaurants.find((r) => r.id === offer.restaurantId);
        const matchesProduct =
          offer.title.toLowerCase().includes(productQuery.toLowerCase()) ||
          offer.description.toLowerCase().includes(productQuery.toLowerCase());
        const matchesRestaurant =
          !restaurantQuery.trim() ||
          (rest && rest.name.toLowerCase().includes(restaurantQuery.toLowerCase()));
        const matchesCategory =
          selectedCategory === 'Tous' || offer.category === selectedCategory;
        const matchesPrice = offer.reducedPrice <= maxPrice;

        return matchesProduct && matchesRestaurant && matchesCategory && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.reducedPrice - b.reducedPrice;
        if (sortBy === 'discount-desc') {
          return (
            calcDiscountPercent(b.initialPrice, b.reducedPrice) -
            calcDiscountPercent(a.initialPrice, a.reducedPrice)
          );
        }
        if (sortBy === 'quantity-desc') return b.quantity - a.quantity;
        return 0;
      });
  }, [offers, restaurants, productQuery, restaurantQuery, selectedCategory, maxPrice, sortBy]);

  const resetFilters = () => {
    setProductQuery('');
    setRestaurantQuery('');
    setSelectedCategory('Tous');
    setMaxPrice(15);
    setSortBy('relevance');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Explorer les offres anti-gaspi
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Filtrez par produit, restaurant, catégorie ou budget étudiant autour de l’ESSECT.
        </p>
      </div>

      {/* Panneau de recherche et filtres */}
      <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Recherche par produit */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={productQuery}
              onChange={(e) => setProductQuery(e.target.value)}
              placeholder="Nom du produit (ex: Panini, Couscous)..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
          </div>

          {/* Recherche par restaurant / cafétéria */}
          <div className="relative">
            <Store className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={restaurantQuery}
              onChange={(e) => setRestaurantQuery(e.target.value)}
              placeholder="Restaurant ou cafétéria..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
          </div>

          {/* Filtre prix maximum */}
          <div className="bg-[#F8F1E7]/60 border border-stone-200 rounded-xl px-3.5 py-2 flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
              <span>Prix max :</span>
              <span className="text-[#A84F32]">{formatPrice(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="0.5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#A84F32] cursor-pointer"
            />
          </div>

          {/* Tri */}
          <div className="relative">
            <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-medium text-stone-700 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            >
              <option value="relevance">Trier : Pertinence</option>
              <option value="price-asc">Prix réduit croissant</option>
              <option value="discount-desc">Plus forte réduction (%)</option>
              <option value="quantity-desc">Quantité disponible</option>
            </select>
          </div>
        </div>

        {/* Filtres par catégorie */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  active
                    ? 'bg-[#A84F32] text-white shadow-xs'
                    : 'bg-[#F8F1E7] text-stone-700 hover:bg-[#E9C98B]/50'
                }`}
              >
                {cat === 'Paniers Surprise' ? '🎁 Paniers Surprise' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Compteur de résultats */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-stone-600">
        <span>
          <strong className="text-stone-900">{filteredOffers.length}</strong> offre(s) trouvée(s)
        </span>
        {(productQuery || restaurantQuery || selectedCategory !== 'Tous' || maxPrice < 15) && (
          <button
            onClick={resetFilters}
            className="text-[#A84F32] font-bold hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Liste des offres ou État vide */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E9C98B]/60 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#F8F1E7] text-[#D98245] flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-stone-900">
            {offers.length === 0 ? 'Aucune offre disponible pour le moment.' : 'Aucune offre ne correspond à votre recherche'}
          </h3>
          <p className="text-sm text-stone-500 mt-2">
            {offers.length === 0
              ? 'Les offres des commerçants partenaires apparaîtront ici dès leur publication.'
              : 'Essayez d’élargir votre budget maximum, de changer de catégorie ou d’effacer vos mots-clés.'}
          </p>
          {offers.length > 0 && (
            <button
              onClick={resetFilters}
              className="mt-6 px-6 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-sm font-bold transition-colors"
            >
              Afficher toutes les offres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => {
            const rest = restaurants.find((r) => r.id === offer.restaurantId);
            const discount = calcDiscountPercent(offer.initialPrice, offer.reducedPrice);
            const outOfStock = offer.quantity === 0;

            return (
              <div
                key={offer.id}
                onClick={() =>
                  !outOfStock && onNavigate('offer-details', { offerId: offer.id, quantity: 1 })
                }
                className={`bg-white rounded-2xl border border-[#E9C98B]/60 overflow-hidden shadow-xs transition-all flex flex-col ${
                  outOfStock
                    ? 'opacity-60 cursor-not-allowed'
                    : 'hover:shadow-lg cursor-pointer group'
                }`}
              >
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <SafeImage
                    src={offer.image}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-[#A84F32] text-white text-xs font-extrabold">
                      -{discount}%
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-stone-900/75 text-white text-[11px] font-semibold backdrop-blur-xs">
                      {offer.category}
                    </span>
                  </div>
                  <span
                    className={`absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      outOfStock
                        ? 'bg-red-600 text-white'
                        : 'bg-white/95 text-stone-900 shadow-xs'
                    }`}
                  >
                    {outOfStock ? 'Épuisé' : `${offer.quantity} disponible(s)`}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                      <span className="font-bold text-[#D98245] truncate">{rest?.name}</span>
                      <span className="shrink-0">{rest?.distanceMeters}m</span>
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-[#A84F32] transition-colors">
                      {offer.title}
                    </h3>
                    <div className="mt-2.5 flex items-center gap-2 text-xs text-stone-600">
                      <Clock className="w-3.5 h-3.5 text-[#4C6749]" />
                      <span>Récupération : {offer.pickupHours}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 line-through block">
                        Prix initial : {formatPrice(offer.initialPrice)}
                      </span>
                      <span className="text-lg font-extrabold text-[#4C6749]">
                        {formatPrice(offer.reducedPrice)}
                      </span>
                    </div>

                    <button
                      disabled={outOfStock}
                      className="px-4 py-2.5 rounded-xl bg-[#A84F32] group-hover:bg-[#8E4128] disabled:bg-stone-300 text-white text-xs font-bold transition-colors"
                    >
                      Détails & Réserver
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
