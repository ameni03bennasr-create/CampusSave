import { useMemo } from 'react';
import { BarChart3 } from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { MerchantOffer, MerchantOrder } from '@/types/merchant';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 11 – STATISTIQUES COMMERÇANT
// ============================================================================
interface MerchantStatisticsPageProps {
  offers: MerchantOffer[];
  orders: MerchantOrder[];
}

export function MerchantStatisticsPage({ offers, orders }: MerchantStatisticsPageProps) {
  const totalPublished = offers.length;
  const totalReceived = orders.length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'Récupérée');
  // Règle métier stricte : le chiffre d'affaires est calculé UNIQUEMENT sur les commandes terminées/payées
  const totalCompletedRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Produits les plus populaires basés sur les commandes réelles
  const popularProducts = useMemo(() => {
    const map: Record<string, { name: string; qty: number; revenue: number }> = {};
    orders
      .filter((o) => o.orderStatus !== 'Annulée')
      .forEach((o) => {
        if (!map[o.productName]) {
          map[o.productName] = { name: o.productName, qty: 0, revenue: 0 };
        }
        map[o.productName].qty += o.quantity;
        if (o.orderStatus === 'Récupérée') {
          map[o.productName].revenue += o.totalAmount;
        }
      });
    return Object.values(map).sort((a, b) => b.qty - a.qty);
  }, [orders]);

  const maxQty = popularProducts[0]?.qty || 1;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Statistiques de performance
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Suivi des offres publiées, des commandes traitées et des revenus générés par vos ventes finalisées.
        </p>
      </div>

      {orders.length === 0 && offers.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Les statistiques apparaîtront lorsque les premières données seront disponibles."
          description="Publiez vos premières offres : le suivi des offres, des commandes et du chiffre d’affaires s’affichera ici."
        />
      ) : (
        <>
      {/* 4 KPI Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase">
            Total offres publiées
          </span>
          <p className="text-3xl font-extrabold text-stone-900 mt-2">{totalPublished}</p>
          <p className="text-xs text-stone-500 mt-1">Depuis l’activation du compte</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase">
            Total commandes reçues
          </span>
          <p className="text-3xl font-extrabold text-[#D98245] mt-2">{totalReceived}</p>
          <p className="text-xs text-stone-500 mt-1">Toutes réservations confondues</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase">
            Commandes terminées
          </span>
          <p className="text-3xl font-extrabold text-[#4C6749] mt-2">
            {completedOrders.length}
          </p>
          <p className="text-xs text-stone-500 mt-1">Payées et récupérées par QR Code</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <span className="text-xs font-bold text-stone-400 uppercase">
            Revenu des ventes terminées
          </span>
          <p className="text-3xl font-extrabold text-[#A84F32] mt-2">
            {formatPrice(totalCompletedRevenue)}
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Calculé uniquement sur les commandes récupérées
          </p>
        </div>
      </div>

      {/* Graphiques : Évolution dans le temps & Produits populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Produits les plus populaires */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-5">
          <div>
            <h2 className="font-extrabold text-stone-900 text-base">
              Produits les plus populaires
            </h2>
            <p className="text-xs text-stone-500">
              Classement selon le nombre de portions réservées par les étudiants
            </p>
          </div>

          <div className="space-y-4">
            {popularProducts.map((prod) => {
              const widthPct = Math.round((prod.qty / maxQty) * 100);
              return (
                <div key={prod.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800 truncate pr-2">{prod.name}</span>
                    <span className="font-extrabold text-[#A84F32] shrink-0">
                      {prod.qty} portion(s)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#F8F1E7] overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-[#A84F32] to-[#D98245] rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
