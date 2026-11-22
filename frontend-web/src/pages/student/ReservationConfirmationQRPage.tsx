import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Lock,
  MapPin
} from 'lucide-react';
import { QrCodeDisplay } from '@/components/common/QrCodeDisplay';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentOrder } from '@/types/student';

// ============================================================================
// PAGE 09 – CONFIRMATION DE RÉSERVATION / QR CODE
// ============================================================================
interface ReservationConfirmationQRPageProps {
  order: StudentOrder;
  restaurant: Restaurant;
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function ReservationConfirmationQRPage({ order, restaurant, onNavigate }: ReservationConfirmationQRPageProps) {
  const isPaid = order.paymentStatus === 'Payée' && Boolean(order.qrToken);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (!order.qrToken) return;
    navigator.clipboard?.writeText(order.qrToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isPaid) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-[#E9C98B] text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#E9C98B]/40 text-[#A84F32] flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-stone-900">
          QR Code indisponible avant paiement
        </h1>
        <p className="text-sm text-stone-600">
          Le QR Code unique de la commande <strong>{order.id}</strong> ne peut être généré qu’après confirmation du paiement électronique.
        </p>
        <button
          onClick={() => onNavigate('payment', { orderId: order.id })}
          className="px-6 py-3.5 rounded-xl bg-[#A84F32] text-white font-bold text-sm"
        >
          Procéder au paiement maintenant
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Bannière de succès */}
      <div className="bg-[#4C6749] text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-[#E9C98B]" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E9C98B]">
              Réservation confirmée et payée
            </span>
            <h1 className="text-2xl font-extrabold mt-0.5">
              Votre commande est prête à être retirée !
            </h1>
            <p className="text-sm text-white/85 mt-1">
              Référence : <strong>{order.id}</strong> • Montant réglé :{' '}
              <strong>{formatPrice(order.totalAmount)}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Carte principale QR Code + Détails */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-sm p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Colonne QR Code */}
        <div className="md:col-span-5 flex flex-col items-center text-center bg-[#F8F1E7] p-6 rounded-2xl border border-[#E9C98B]">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#A84F32] mb-3">
            Pass de retrait étudiant
          </span>
          <QrCodeDisplay value={order.qrToken ?? ''} size={184} />
          <div className="mt-3 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-stone-200">
            <code className="text-[11px] font-mono font-bold text-stone-800">
              {order.qrToken}
            </code>
            <button
              onClick={handleCopyCode}
              className="text-stone-500 hover:text-[#A84F32]"
              title="Copier le code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#4C6749]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Colonne Informations & Instructions */}
        <div className="md:col-span-7 space-y-5">
          <div>
            <span className="text-xs font-bold text-[#D98245]">{restaurant.name}</span>
            <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">
              {order.productTitle}
            </h2>
            <p className="text-sm text-stone-600 mt-1">
              Quantité : <strong>{order.quantity} portion(s)</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F1E7]/70 border border-[#E9C98B]/60 space-y-2 text-xs text-stone-700">
            <p className="flex items-center gap-2 font-bold text-[#4C6749]">
              <Clock className="w-4 h-4" />
              Créneau de récupération : {order.pickupHours}
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#A84F32] shrink-0 mt-0.5" />
              <span>{restaurant.address}</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
              Instructions pour récupérer votre commande
            </h3>
            <ol className="text-xs text-stone-600 space-y-1.5 list-decimal list-inside">
              <li>Rendez-vous chez <strong>{restaurant.name}</strong> durant le créneau indiqué.</li>
              <li>Présentez ce <strong>QR Code unique</strong> au commerçant au comptoir CampusSave.</li>
              <li>Le commerçant scanne le code pour valider la remise de votre panier.</li>
            </ol>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('orders')}
              className="px-5 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-xs shadow-xs transition-colors"
            >
              Voir toutes mes commandes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
