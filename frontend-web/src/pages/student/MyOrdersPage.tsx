import { useState, useMemo } from 'react';
import {
  CreditCard,
  QrCode,
  ShoppingBag
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { OrderStatusBadge } from '@/components/student/OrderStatusBadge';
import { formatPrice } from '@/utils/format';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { StudentOrder } from '@/types/student';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 10 – MES COMMANDES
// ============================================================================
interface MyOrdersPageProps {
  orders: StudentOrder[];
  onNavigate: (page: "register" | "login" | "home" | "explore" | "offer-details" | "reservation" | "order-summary" | "payment" | "confirmation-qr" | "orders" | "order-details" | "profile" | "notifications" | "statistics", options?: StudentNavigateOptions) => void;
}

export function MyOrdersPage({ orders, onNavigate }: MyOrdersPageProps) {
  const [filterTab, setFilterTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Toutes', count: orders.length },
    {
      id: 'confirmed',
      label: 'En cours / Payées',
      count: orders.filter((o) => o.orderStatus.includes('Confirmée')).length
    },
    {
      id: 'pending',
      label: 'En attente',
      count: orders.filter((o) => o.orderStatus.includes('attente')).length
    },
    {
      id: 'collected',
      label: 'Récupérées',
      count: orders.filter((o) => o.orderStatus.includes('Récupérée')).length
    },
    {
      id: 'cancelled',
      label: 'Annulées / Échouées',
      count: orders.filter(
        (o) => o.orderStatus.includes('Annulée') || o.paymentStatus === 'Échouée'
      ).length
    }
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (filterTab === 'confirmed') return o.orderStatus.includes('Confirmée');
      if (filterTab === 'pending') return o.orderStatus.includes('attente');
      if (filterTab === 'collected') return o.orderStatus.includes('Récupérée');
      if (filterTab === 'cancelled')
        return o.orderStatus.includes('Annulée') || o.paymentStatus === 'Échouée';
      return true;
    });
  }, [orders, filterTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Mes commandes</h1>
          <p className="text-sm text-stone-500 mt-1">
            Suivez vos réservations, accédez à vos QR Codes de retrait et consultez votre historique.
          </p>
        </div>

        <button
          onClick={() => onNavigate('explore')}
          className="px-5 py-2.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs font-bold shadow-xs"
        >
          + Nouvelle réservation
        </button>
      </div>

      {/* Onglets de statut */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = filterTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                active
                  ? 'bg-[#A84F32] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-[#E9C98B]/60 hover:bg-[#F8F1E7]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] ${
                  active ? 'bg-white/20 text-white' : 'bg-[#F8F1E7] text-stone-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Liste des commandes */}
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="Vous n’avez pas encore de réservation."
          description="Dès que vous réserverez une offre, vous la retrouverez ici avec son statut et son QR Code de retrait."
          action={{ label: 'Explorer les offres', onClick: () => onNavigate('explore') }}
        />
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 border border-[#E9C98B]/60 text-center">
          <p className="font-bold text-stone-800">Aucune commande dans cette catégorie.</p>
          <button
            onClick={() => setFilterTab('all')}
            className="mt-3 text-xs font-bold text-[#A84F32] hover:underline"
          >
            Afficher toutes mes commandes
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const hasQr = ord.paymentStatus === 'Payée' && Boolean(ord.qrToken);
            const isPending = ord.orderStatus.includes('attente');

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <SafeImage
                    src={ord.productImage}
                    alt={ord.productTitle}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-stone-900 bg-[#F8F1E7] px-2.5 py-0.5 rounded-md">
                        {ord.id}
                      </span>
                      <OrderStatusBadge status={ord.orderStatus} />
                    </div>
                    <h3 className="font-extrabold text-stone-900 text-base">
                      {ord.productTitle}
                    </h3>
                    <p className="text-xs text-stone-600">
                      <strong className="text-[#D98245]">{ord.restaurantName}</strong> • Quantité :{' '}
                      <strong>{ord.quantity}</strong> • Créneau : {ord.pickupHours}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      Commandé : {ord.createdAt} • Paiement : {ord.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100">
                  <div className="mr-2">
                    <span className="text-[11px] text-stone-400 block">Total</span>
                    <span className="text-lg font-extrabold text-stone-900">
                      {formatPrice(ord.totalAmount)}
                    </span>
                  </div>

                  {hasQr && (
                    <button
                      onClick={() => onNavigate('confirmation-qr', { orderId: ord.id })}
                      className="px-4 py-2.5 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4" />
                      QR Code
                    </button>
                  )}

                  {isPending && (
                    <button
                      onClick={() => onNavigate('payment', { orderId: ord.id })}
                      className="px-4 py-2.5 rounded-xl bg-[#D98245] hover:bg-[#C27138] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      Payer
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('order-details', { orderId: ord.id })}
                    className="px-4 py-2.5 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold"
                  >
                    Détails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
