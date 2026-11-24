import { useState, useMemo } from 'react';
import {
  ClipboardList,
  Search
} from 'lucide-react';
import { OrderStatusBadge } from '@/components/admin/OrderStatusBadge';
import { PaymentStatusBadge } from '@/components/admin/PaymentStatusBadge';
import { formatPrice } from '@/utils/format';
import type { AdminOrder } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 09 – SUPERVISION DES COMMANDES
// ============================================================================
interface OrdersSupervisionPageProps {
  orders: AdminOrder[];
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function OrdersSupervisionPage({ orders, onNavigate }: OrdersSupervisionPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.merchantName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPayment =
        paymentFilter === 'Tous' || o.paymentStatus === paymentFilter;
      const matchesStatus = statusFilter === 'Tous' || o.orderStatus === statusFilter;
      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [orders, searchQuery, paymentFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Supervision des commandes
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Suivi global des réservations étudiantes, des paiements et des retraits sur l’ensemble de la plateforme.
        </p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Référence, étudiant ou établissement..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Paiement : Tous</option>
            <option value="Payée">Payée</option>
            <option value="En attente">En attente</option>
            <option value="Échouée">Échouée</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Statut commande : Tous</option>
            <option value="En attente">En attente</option>
            <option value="Confirmée / À récupérer">Confirmée / À récupérer</option>
            <option value="Récupérée">Récupérée</option>
            <option value="Annulée">Annulée</option>
          </select>
        </div>
      </div>

      {/* Tableau global des commandes */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7] border-b border-[#E9C98B]/50 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5">Référence</th>
                <th className="py-3.5 px-4">Étudiant</th>
                <th className="py-3.5 px-4">Commerçant</th>
                <th className="py-3.5 px-4">Produit & Qté</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Paiement</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-stone-500">
                    {orders.length === 0 ? (
                      <EmptyState compact className="border-0" icon={ClipboardList} title="Aucune commande pour le moment." description="Les réservations et leurs paiements apparaîtront ici dès les premières commandes." />
                    ) : (
                      <span className="block py-10">Aucune commande ne correspond à vos filtres.</span>
                    )}
                  </td>
                </tr>
              )}
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F8F1E7]/35 transition-colors">
                  <td className="py-4 px-5 whitespace-nowrap">
                    <span className="font-extrabold text-stone-900">{ord.id}</span>
                    <span className="text-[11px] text-stone-400 block">{ord.reservationDate}</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-stone-800 whitespace-nowrap">
                    {ord.studentName}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#D98245] text-xs whitespace-nowrap">
                    {ord.merchantName}
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-stone-800 line-clamp-1 max-w-[190px]">
                      {ord.productName}
                    </p>
                    <span className="text-xs text-stone-500">Qté : {ord.quantity}</span>
                  </td>
                  <td className="py-4 px-4 font-extrabold text-stone-900 whitespace-nowrap">
                    {formatPrice(ord.totalAmount)}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <PaymentStatusBadge status={ord.paymentStatus} />
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <OrderStatusBadge status={ord.orderStatus} />
                  </td>
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigate('order-details', { orderId: ord.id })}
                      className="px-3 py-1.5 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold"
                    >
                      Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
