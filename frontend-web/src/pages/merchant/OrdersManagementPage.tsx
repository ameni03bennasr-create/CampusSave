import { useState, useMemo } from 'react';
import {
  ClipboardList,
  QrCode,
  Search
} from 'lucide-react';
import { OrderStatusBadge } from '@/components/merchant/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/merchant/PaymentStatusBadge';
import { formatPrice } from '@/utils/format';
import type { MerchantOrder } from '@/types/merchant';
import type { MerchantNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 08 – COMMANDES (ORDERS MANAGEMENT)
// ============================================================================
interface OrdersManagementPageProps {
  orders: MerchantOrder[];
  onNavigate: (page: "register" | "login" | "orders" | "order-details" | "notifications" | "statistics" | "offers" | "dashboard" | "establishment" | "add-offer" | "edit-offer" | "qr-scanner" | "settings", params?: MerchantNavigateOptions) => void;
}

export function OrdersManagementPage({ orders, onNavigate }: OrdersManagementPageProps) {
  const [statusTab, setStatusTab] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'Toutes', count: orders.length },
    {
      id: 'En attente',
      count: orders.filter((o) => o.orderStatus === 'En attente').length
    },
    {
      id: 'Payée / À récupérer',
      count: orders.filter((o) => o.orderStatus === 'Payée / À récupérer').length
    },
    {
      id: 'Récupérée',
      count: orders.filter((o) => o.orderStatus === 'Récupérée').length
    },
    {
      id: 'Annulée',
      count: orders.filter((o) => o.orderStatus === 'Annulée').length
    }
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = statusTab === 'Toutes' || o.orderStatus === statusTab;
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.productName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, statusTab, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Gestion des commandes
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Suivez les réservations étudiantes, vérifiez le statut de paiement et validez les retraits.
          </p>
        </div>

        <button
          onClick={() => onNavigate('qr-scanner')}
          className="px-5 py-3 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs"
        >
          <QrCode className="w-4 h-4" />
          Ouvrir le scanner QR Code
        </button>
      </div>

      {/* Onglets de filtrage + Recherche */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const active = statusTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  active
                    ? 'bg-[#A84F32] text-white shadow-2xs'
                    : 'bg-white text-stone-700 border border-[#E9C98B]/60 hover:bg-[#F8F1E7]'
                }`}
              >
                <span>{tab.id}</span>
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

        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Référence, étudiant ou plat..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm focus:outline-none focus:border-[#A84F32]"
          />
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7] border-b border-[#E9C98B]/50 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5">Référence</th>
                <th className="py-3.5 px-4">Étudiant</th>
                <th className="py-3.5 px-4">Produit & Qté</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Paiement</th>
                <th className="py-3.5 px-4">Statut commande</th>
                <th className="py-3.5 px-4">Retrait</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-stone-500 text-sm">
                    {orders.length === 0 ? (
                      <EmptyState
                        compact
                        className="border-0"
                        icon={ClipboardList}
                        title="Aucune commande pour le moment."
                        description="Les réservations des étudiants apparaîtront ici dès qu’elles seront effectuées."
                      />
                    ) : (
                      <span className="block py-10">Aucune commande trouvée pour ce filtre.</span>
                    )}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const isPaidAndReady =
                    ord.paymentStatus === 'Payée' && ord.orderStatus === 'Payée / À récupérer';
                  return (
                    <tr key={ord.id} className="hover:bg-[#F8F1E7]/35 transition-colors">
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-extrabold text-stone-900">{ord.id}</span>
                        <span className="text-[11px] text-stone-400 block">
                          {ord.reservationDate}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-bold text-stone-900">{ord.studentName}</p>
                        <p className="text-xs text-stone-500">{ord.studentPhone}</p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-stone-800 line-clamp-1 max-w-[200px]">
                          {ord.productName}
                        </p>
                        <span className="text-xs text-stone-500">Quantité : {ord.quantity}</span>
                      </td>

                      <td className="py-4 px-4 font-extrabold text-stone-900 whitespace-nowrap">
                        {formatPrice(ord.totalAmount)}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <PaymentStatusBadge paymentStatus={ord.paymentStatus} />
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <OrderStatusBadge status={ord.orderStatus} />
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-stone-600 whitespace-nowrap">
                        {ord.pickupTime}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          {isPaidAndReady && (
                            <button
                              onClick={() => onNavigate('qr-scanner', { qrCode: ord.id })}
                              className="px-3 py-2 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold inline-flex items-center gap-1"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              Valider
                            </button>
                          )}
                          <button
                            onClick={() => onNavigate('order-details', { orderId: ord.id })}
                            className="px-3 py-2 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold"
                          >
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
