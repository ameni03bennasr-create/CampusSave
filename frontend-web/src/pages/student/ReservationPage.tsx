import {
  ChevronLeft,
  Clock,
  MapPin,
  Minus,
  Plus,
  Store
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOffer, StudentProfile } from '@/types/student';
import type { Dispatch, SetStateAction } from 'react';

// ============================================================================
// PAGE 06 â€“ RÃ‰SERVATION
// ============================================================================
interface ReservationPageProps {
  offer: StudentOffer;
  restaurant: Restaurant;
  quantity: number;
  setQuantity: Dispatch<SetStateAction<number>>;
  student: StudentProfile;
  onConfirmReservation: () => void;
  isSubmitting?: boolean;
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function ReservationPage({
  offer,
  restaurant,
  quantity,
  setQuantity,
  student,
  onConfirmReservation,
  isSubmitting = false,
  onNavigate
}: ReservationPageProps) {
  const totalAmount = offer.reducedPrice * quantity;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('offer-details', { offerId: offer.id, quantity })}
        className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-[#A84F32]"
      >
        <ChevronLeft className="w-4 h-4" />
        Modifier la sÃ©lection
      </button>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#A84F32]">
          Ã‰tape 1 sur 3 â€¢ RÃ©servation
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          Configurer votre rÃ©servation
        </h1>
        <p className="text-sm text-stone-500">
          VÃ©rifiez la quantitÃ© et le crÃ©neau de retrait avant de passer au rÃ©capitulatif.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-5">
          {/* Produit sÃ©lectionnÃ© */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 flex items-center gap-4">
            <SafeImage
              src={offer.image}
              alt={offer.title}
              className="w-24 h-24 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#D98245]">{restaurant.name}</span>
              <h2 className="font-extrabold text-stone-900 text-base leading-snug mt-0.5">
                {offer.title}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Prix unitaire rÃ©duit :{' '}
                <strong className="text-[#4C6749]">{formatPrice(offer.reducedPrice)}</strong>{' '}
                <span className="line-through text-stone-400">
                  ({formatPrice(offer.initialPrice)})
                </span>
              </p>
            </div>
          </div>

          {/* Ajustement de quantitÃ© */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">QuantitÃ© rÃ©servÃ©e</h3>
              <p className="text-xs text-stone-500">
                Stock disponible chez le commerÃ§ant : {offer.quantity}
              </p>
            </div>
            <div className="inline-flex items-center rounded-xl border border-stone-200 bg-[#F8F1E7] p-1">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-9 h-9 rounded-lg bg-white text-stone-800 flex items-center justify-center disabled:opacity-40"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-11 text-center font-extrabold text-base">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(offer.quantity, quantity + 1))}
                disabled={quantity >= offer.quantity}
                className="w-9 h-9 rounded-lg bg-white text-stone-800 flex items-center justify-center disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Informations Restaurant & CrÃ©neau de retrait */}
          <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 space-y-3">
            <h3 className="font-bold text-stone-900 text-sm">
              Informations de rÃ©cupÃ©ration sur place
            </h3>
            <div className="p-3.5 rounded-xl bg-[#F8F1E7] space-y-2 text-xs text-stone-700">
              <p className="flex items-center gap-2 font-semibold">
                <Store className="w-4 h-4 text-[#A84F32]" />
                {restaurant.name}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-500" />
                {restaurant.address}
              </p>
              <p className="flex items-center gap-2 font-bold text-[#4C6749]">
                <Clock className="w-4 h-4" />
                CrÃ©neau obligatoire aujourdâ€™hui : {offer.pickupHours}
              </p>
            </div>
            <p className="text-xs text-stone-500">
              RÃ©servation au nom de : <strong className="text-stone-800">{student.fullName}</strong> ({student.phone})
            </p>
          </div>
        </div>

        {/* Encart RÃ©sumÃ© de rÃ©servation */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 border border-[#E9C98B] shadow-sm sticky top-24 space-y-4">
            <h3 className="font-extrabold text-stone-900 text-lg">
              RÃ©sumÃ© de rÃ©servation
            </h3>
            <div className="space-y-2.5 text-sm border-y border-stone-100 py-4">
              <div className="flex justify-between text-stone-600">
                <span>Prix unitaire rÃ©duit</span>
                <span className="font-semibold">{formatPrice(offer.reducedPrice)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>QuantitÃ©</span>
                <span className="font-semibold">Ã— {quantity}</span>
              </div>
              <div className="flex justify-between text-[#4C6749] text-xs font-bold">
                <span>Ã‰conomie rÃ©alisÃ©e</span>
                <span>
                  -{formatPrice((offer.initialPrice - offer.reducedPrice) * quantity)}
                </span>
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="font-bold text-stone-800">Montant total</span>
              <span className="text-2xl font-extrabold text-[#A84F32]">
                {formatPrice(totalAmount)}
              </span>
            </div>

            <button
              onClick={onConfirmReservation}
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Création de la réservation...' : 'Confirmer la réservation'}
            </button>

            <p className="text-[11px] text-stone-400 text-center leading-relaxed">
              Le QR Code de retrait sera gÃ©nÃ©rÃ© immÃ©diatement aprÃ¨s la confirmation du paiement Ã©lectronique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


