import {
  ChevronLeft
} from 'lucide-react';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/admin/PaymentStatusBadge';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/utils/format';
import type { AdminOrder } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';

// ============================================================================
// PAGE 10 – DÉTAILS DE LA COMMANDE
// ============================================================================
interface AdminOrderDetailsPageProps {
  order: AdminOrder;
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function AdminOrderDetailsPage({ order, onNavigate }: AdminOrderDetailsPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('orders-supervision')}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 hover:text-[#A84F32]"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour aux commandes
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Détails de transaction supervisée
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
              {order.id}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Date de réservation : <strong>{order.reservationDate}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        {/* Détails produit */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#F8F1E7]/70 border border-[#E9C98B]/50">
          <div className="flex items-center gap-4">
            <SafeImage
              src={order.productImage}
              alt={order.productName}
              className="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">{order.productName}</h2>
              <p className="text-xs text-stone-600 mt-1">
                Quantité : <strong>{order.quantity}</strong> × {formatPrice(order.unitPrice)}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">
                Créneau de retrait : <strong>{order.pickupSchedule}</strong>
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-stone-500 block">Montant total</span>
            <span className="text-2xl font-extrabold text-[#A84F32]">
              {formatPrice(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Informations Étudiant & Commerçant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div className="p-5 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-extrabold text-stone-900 text-sm mb-2">Informations Étudiant</h3>
            <p>
              <strong>Nom :</strong> {order.studentName}
            </p>
            <p>
              <strong>E-mail :</strong> {order.studentEmail}
            </p>
            <p>
              <strong>Téléphone :</strong> {order.studentPhone}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-stone-200 space-y-1.5">
            <h3 className="font-extrabold text-stone-900 text-sm mb-2">
              Informations Commerçant
            </h3>
            <p>
              <strong>Établissement :</strong> {order.merchantName}
            </p>
            <p>
              <strong>Adresse :</strong> {order.merchantAddress}
            </p>
            <p>
              <strong>Mode de règlement :</strong> {order.paymentMethod}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
