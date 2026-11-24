import { ChevronLeft, ChevronRight, Clock, MapPin, Minus, Plus, Store, ShoppingCart } from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { calcDiscountPercent, formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOffer } from '@/types/student';
import type { Dispatch, SetStateAction } from 'react';
import { useCart } from '@/context/CartContext';

interface OfferDetailsPageProps {
  offer: StudentOffer;
  restaurant: Restaurant;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics" | "cart" | "checkout", options?: StudentNavigateOptions) => void;
  onShowToast?: (message: string) => void;
}

export function OfferDetailsPage({ offer, restaurant, quantity, setQuantity, onNavigate, onShowToast }: OfferDetailsPageProps) {
  const { addToCart } = useCart(); 
  const discount = calcDiscountPercent(offer.initialPrice, offer.reducedPrice);
  const totalPrice = offer.reducedPrice * quantity;
  const totalSavings = (offer.initialPrice - offer.reducedPrice) * quantity;

  const handleAddToCart = () => {
    const cartOffer = {
      id: offer.id,
      title: offer.title,
      category: offer.category,
      imageUrl: offer.image, 
      initialPrice: offer.initialPrice,
      discountedPrice: offer.reducedPrice,
      quantity: offer.quantity, // Le stock maximum
    };
    
    // On passe 'quantity' (la quantité choisie via le bouton +/-) à la fonction
    addToCart(cartOffer, quantity); 
    
    if (onShowToast) {
      onShowToast(`${quantity} x ${offer.title} ajouté au panier !`);
    }
    
    onNavigate('cart'); 
  };

  return (
    <div className="space-y-6">
      <button onClick={() => onNavigate('explore')} className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-[#A84F32]">
        <ChevronLeft className="w-4 h-4" /> Retour aux offres
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[460px] bg-stone-100">
          <SafeImage src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#A84F32] text-white text-sm font-extrabold shadow-md">-{discount}% d’économie</span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/95 text-stone-800 text-xs font-bold shadow-md">{offer.category}</span>
          </div>
        </div>

        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D98245]">Offre invendue vérifiée</span>
              <span className="px-3 py-1 rounded-full bg-[#4C6749]/15 text-[#4C6749] text-xs font-bold">{offer.quantity} portion(s) disponible(s)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">{offer.title}</h1>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">{offer.description}</p>

            <div className="mt-5 p-4 rounded-2xl bg-[#F8F1E7] border border-[#E9C98B]/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm flex items-center gap-2"><Store className="w-4 h-4 text-[#A84F32]" /> {restaurant.name}</span>
                <span className="text-xs font-bold text-[#4C6749]">À {restaurant.distanceMeters}m de l’ESSECT</span>
              </div>
              <p className="text-xs text-stone-600 flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" /> {restaurant.address}</p>
              <p className="text-xs font-semibold text-stone-800 flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#D98245]" /> Horaires de récupération : {offer.pickupHours}</p>
            </div>

            <div className="mt-6 flex items-baseline gap-4">
              <div>
                <span className="text-xs text-stone-400 block">Prix réduit unitaire</span>
                <span className="text-3xl font-extrabold text-[#4C6749]">{formatPrice(offer.reducedPrice)}</span>
              </div>
              <div>
                <span className="text-xs text-stone-400 block">Prix initial</span>
                <span className="text-lg text-stone-400 line-through font-semibold">{formatPrice(offer.initialPrice)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-1.5">Quantité souhaitée (max. {offer.quantity})</span>
                <div className="inline-flex items-center rounded-xl border border-stone-200 bg-[#F8F1E7] p-1">
                  <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="w-9 h-9 rounded-lg bg-white text-stone-800 flex items-center justify-center disabled:opacity-40 shadow-2xs"><Minus className="w-4 h-4" /></button>
                  <span className="w-12 text-center font-extrabold text-base text-stone-900">{quantity}</span>
                  <button type="button" onClick={() => setQuantity(Math.min(offer.quantity, quantity + 1))} disabled={quantity >= offer.quantity} className="w-9 h-9 rounded-lg bg-white text-stone-800 flex items-center justify-center disabled:opacity-40 shadow-2xs"><Plus className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-stone-500 block">Prix total à payer</span>
                <span className="text-2xl font-extrabold text-stone-900">{formatPrice(totalPrice)}</span>
                <span className="text-xs font-semibold text-[#4C6749] block">Vous économisez {formatPrice(totalSavings)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button onClick={handleAddToCart} disabled={offer.quantity === 0} className="w-full py-4 px-6 rounded-xl bg-[#4C6749] hover:bg-[#3d543a] disabled:bg-stone-300 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" /><span>Ajouter au panier</span>
              </button>
              <button onClick={() => onNavigate('reservation', { offerId: offer.id, quantity })} disabled={offer.quantity === 0} className="w-full py-4 px-6 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] disabled:bg-stone-300 text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2">
                <span>Réserver direct</span><ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}