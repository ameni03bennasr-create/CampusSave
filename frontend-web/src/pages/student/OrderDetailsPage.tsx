import {
  ChevronLeft,
  QrCode
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { QrCodeDisplay } from '@/components/common/QrCodeDisplay';
import { OrderStatusBadge } from '@/components/student/OrderStatusBadge';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOrder } from '@/types/student';

// ============================================================================
// PAGE 11 – DÉTAILS DE LA COMMANDE
// ============================================================================
interface OrderDetailsPageProps {
  order: StudentOrder;
  restaurant: Restaurant;
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function OrderDetailsPage({ order, restaurant, onNavigate }: OrderDetailsPageProps) {
  const canShowQr = order.paymentStatus === 'Payée' && Boolean(order.qrToken);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('orders')}
        className="inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-[#A84F32]"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour à mes commandes
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-sm p-6 sm:p-8 space-y-6">
        {/* En-tête référence & statuts */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Détails de la commande
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
              {order.id}
            </h1>
            <p className="text-xs text-stone-500 mt-1">Passée le : {order.createdAt}</p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <span className="text-xs font-semibold text-stone-600">
              Statut paiement :{' '}
              <strong
                className={
                  order.paymentStatus === 'Payée'
                    ? 'text-[#4C6749]'
                    : order.paymentStatus === 'Échouée'
                    ? 'text-red-600'
                    : 'text-[#D98245]'
                }
              >
                {order.paymentStatus}
              </strong>
            </span>
          </div>
        </div>

        {/* Produit & Restaurant */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 space-y-5">
            <div className="flex items-center gap-4">
              <SafeImage
                src={order.productImage}
                alt={order.productTitle}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
              <div>
                <h2 className="font-extrabold text-stone-900 text-lg">{order.productTitle}</h2>
                <p className="text-sm text-stone-600 mt-1">
                  Quantité : <strong>{order.quantity}</strong> × {formatPrice(order.unitPrice)}
                </p>
                <p className="text-base font-extrabold text-[#A84F32] mt-1">
                  Montant total : {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F1E7] space-y-2 text-xs text-stone-700">
              <h3 className="font-extrabold text-stone-900 text-sm">
                Restaurant & Instructions de retrait
              </h3>
              <p className="font-bold text-[#D98245]">{restaurant.name}</p>
              <p>{restaurant.address}</p>
              <p className="font-bold text-[#4C6749]">
                Horaires de récupération : {order.pickupHours}
              </p>
              <p className="text-stone-500 pt-1">
                Instructions : Présentez-vous à l’accueil muni de votre QR Code CampusSave avant la fin du créneau horaire.
              </p>
            </div>
          </div>

          {/* Zone QR Code conditionnelle au paiement */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-[#F8F1E7]/70 border border-[#E9C98B] text-center">
            {canShowQr ? (
              <>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#4C6749] mb-3">
                  QR Code de retrait actif
                </span>
                <QrCodeDisplay value={order.qrToken ?? ''} size={170} />
                <code className="text-[11px] font-mono text-stone-600 mt-2.5">
                  {order.qrToken}
                </code>
              </>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-12 h-12 rounded-xl bg-white text-[#D98245] flex items-center justify-center mx-auto shadow-2xs">
                  <QrCode className="w-6 h-6" />
                </div>
                <p className="font-bold text-sm text-stone-900">QR Code non généré</p>
                <p className="text-xs text-stone-500">
                  Le QR Code unique apparaît uniquement après confirmation du paiement électronique.
                </p>
                <button
                  onClick={() => onNavigate('payment', { orderId: order.id })}
                  className="px-5 py-2.5 rounded-xl bg-[#A84F32] text-white text-xs font-bold"
                >
                  Finaliser le paiement
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
