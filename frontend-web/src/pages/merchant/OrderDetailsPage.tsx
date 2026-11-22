import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  QrCode
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { OrderStatusBadge } from '@/components/merchant/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/merchant/PaymentStatusBadge';
import { formatPrice } from '@/utils/format';
import type { MerchantNavigate } from '@/types/navigation';
import type { MerchantOrder } from '@/types/merchant';

// ============================================================================
// PAGE 09 – DÉTAILS DE LA COMMANDE
// ============================================================================
interface OrderDetailsPageProps {
  order: MerchantOrder;
  onNavigate: MerchantNavigate;
}

export function OrderDetailsPage({ order, onNavigate }: OrderDetailsPageProps) {
  const isPaidAndReady =
    order.paymentStatus === 'Payée' && order.orderStatus === 'Payée / À récupérer';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('orders')}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 hover:text-[#A84F32]"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour aux commandes
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-2xs p-6 sm:p-8 space-y-6">
        {/* En-tête */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Fiche détaillée de commande
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
              {order.id}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Réservée le : <strong>{order.reservationDate}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge paymentStatus={order.paymentStatus} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Détails produit & étudiant */}
          <div className="md:col-span-7 space-y-5">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F1E7]/60 border border-[#E9C98B]/40">
              <SafeImage
                src={order.productPhoto}
                alt={order.productName}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div>
                <h2 className="font-extrabold text-stone-900 text-base">{order.productName}</h2>
                <p className="text-xs text-stone-600 mt-1">
                  Quantité : <strong>{order.quantity}</strong> × {formatPrice(order.unitPrice)}
                </p>
                <p className="text-base font-extrabold text-[#A84F32] mt-1">
                  Total : {formatPrice(order.totalAmount)}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
              <h3 className="font-extrabold text-stone-900 text-sm">Informations de l’étudiant</h3>
              <p className="text-stone-700">
                <strong>Nom :</strong> {order.studentName}
              </p>
              <p className="text-stone-700">
                <strong>E-mail ESSECT :</strong> {order.studentEmail}
              </p>
              <p className="text-stone-700">
                <strong>Téléphone :</strong> {order.studentPhone}
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-stone-200 space-y-1.5 text-xs">
              <h3 className="font-extrabold text-stone-900 text-sm">
                Créneau de récupération & Règlement
              </h3>
              <p className="text-stone-700">
                <strong>Horaire prévu :</strong> {order.pickupTime}
              </p>
              <p className="text-stone-700">
                <strong>Méthode de paiement :</strong> {order.paymentMethod}
              </p>
              {order.collectedAt && (
                <p className="text-[#4C6749] font-bold">
                  Retrait validé le : {order.collectedAt}
                </p>
              )}
            </div>
          </div>

          {/* Zone de validation QR Code */}
          <div className="md:col-span-5 bg-[#F8F1E7] rounded-2xl p-6 border border-[#E9C98B] flex flex-col items-center justify-center text-center">
            {isPaidAndReady ? (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#4C6749] text-white flex items-center justify-center mx-auto shadow-sm">
                  <QrCode className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    Prête pour validation QR Code
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Paiement confirmé. Scannez ou validez le code étudiant{' '}
                    <code className="font-mono font-bold text-[#A84F32]">{order.qrToken}</code> lors de la remise.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('qr-scanner', { qrCode: order.id })}
                  className="w-full py-3 px-4 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white font-bold text-xs shadow-sm"
                >
                  Scanner / Valider le retrait
                </button>
              </div>
            ) : order.orderStatus === 'Récupérée' ? (
              <div className="space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#4C6749] mx-auto" />
                <h3 className="font-extrabold text-[#4C6749] text-base">
                  Commande déjà récupérée
                </h3>
                <p className="text-xs text-stone-600">
                  Le QR Code a été scanné et validé avec succès.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <AlertTriangle className="w-12 h-12 text-[#D98245] mx-auto" />
                <h3 className="font-extrabold text-stone-900 text-base">
                  Validation bloquée (Non payée)
                </h3>
                <p className="text-xs text-stone-600">
                  Conformément aux règles CampusSave, cette commande n’a pas encore été payée par l’étudiant et ne peut pas être remise.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
