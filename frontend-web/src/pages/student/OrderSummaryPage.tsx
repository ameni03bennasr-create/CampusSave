import {
  Clock,
  CreditCard
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOrder, StudentProfile } from '@/types/student';

// ============================================================================
// PAGE 07 – RÉCAPITULATIF DE COMMANDE (AVANT PAIEMENT)
// ============================================================================
interface OrderSummaryPageProps {
  order: StudentOrder;
  restaurant: Restaurant;
  student: StudentProfile;
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function OrderSummaryPage({ order, restaurant, student, onNavigate }: OrderSummaryPageProps) {
  const initialTotal = order.initialUnitPrice * order.quantity;
  const savings = initialTotal - order.totalAmount;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#A84F32]">
          Étape 2 sur 3 • Vérification avant paiement
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          Récapitulatif de commande
        </h1>
        <p className="text-sm text-stone-500">
          Référence : <strong className="text-stone-800">{order.id}</strong> • Vérifiez toutes les informations avant de procéder au règlement.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-sm overflow-hidden">
        {/* En-tête produit */}
        <div className="p-6 sm:p-8 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center gap-5">
          <SafeImage
            src={order.productImage}
            alt={order.productTitle}
            className="w-24 h-24 rounded-2xl object-cover shrink-0"
          />
          <div className="flex-1">
            <span className="px-2.5 py-1 rounded-full bg-[#E9C98B]/40 text-[#8A4B1C] text-xs font-bold">
              {order.orderStatus}
            </span>
            <h2 className="text-xl font-extrabold text-stone-900 mt-2">
              {order.productTitle}
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Quantité commandée : <strong className="text-stone-800">{order.quantity}</strong>
            </p>
          </div>
        </div>

        {/* Détails Restaurant & Retrait */}
        <div className="p-6 sm:p-8 bg-[#F8F1E7]/50 border-b border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Établissement partenaire
            </h3>
            <p className="font-bold text-stone-900">{restaurant.name}</p>
            <p className="text-xs text-stone-600 mt-1">{restaurant.address}</p>
            <p className="text-xs text-stone-500 mt-1">Tél : {restaurant.phone}</p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Informations de retrait
            </h3>
            <p className="font-bold text-[#4C6749] flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {order.pickupHours}
            </p>
            <p className="text-xs text-stone-600 mt-1">
              Bénéficiaire : {student.fullName}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Présentation du QR Code requise au comptoir
            </p>
          </div>
        </div>

        {/* Décompte financier */}
        <div className="p-6 sm:p-8 space-y-3 text-sm">
          <div className="flex justify-between text-stone-500">
            <span>Prix initial ({order.quantity} × {formatPrice(order.initialUnitPrice)})</span>
            <span className="line-through">{formatPrice(initialTotal)}</span>
          </div>
          <div className="flex justify-between text-stone-700">
            <span>Prix réduit CampusSave ({order.quantity} × {formatPrice(order.unitPrice)})</span>
            <span className="font-semibold">{formatPrice(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-[#4C6749] font-bold">
            <span>Économie totale réalisée</span>
            <span>-{formatPrice(savings)}</span>
          </div>

          <div className="pt-4 mt-2 border-t border-stone-200 flex items-baseline justify-between">
            <span className="text-base font-extrabold text-stone-900">Montant total à régler</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#A84F32]">
              {formatPrice(order.totalAmount)}
            </span>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate('orders')}
              className="sm:w-1/3 py-3.5 px-4 rounded-xl border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors"
            >
              Payer plus tard
            </button>
            <button
              onClick={() => onNavigate('payment', { orderId: order.id })}
              className="sm:w-2/3 py-3.5 px-6 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Continuer vers le paiement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
