import {
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Clock,
  Package,
  PlusCircle,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Tag,
  UtensilsCrossed
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { OrderStatusBadge } from '@/components/merchant/OrderStatusBadge';
import { formatPrice } from '@/utils/format';
import type { MerchantEstablishment, MerchantOffer, MerchantOrder, MerchantProfile } from '@/types/merchant';
import type { MerchantNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 03 – TABLEAU DE BORD COMMERÇANT
// ============================================================================
interface MerchantDashboardPageProps {
  merchant: MerchantProfile;
  establishment: MerchantEstablishment;
  offers: MerchantOffer[];
  orders: MerchantOrder[];
  onNavigate: (page: "register" | "login" | "orders" | "order-details" | "notifications" | "statistics" | "offers" | "dashboard" | "establishment" | "add-offer" | "edit-offer" | "qr-scanner" | "settings", params?: MerchantNavigateOptions) => void;
}

export function MerchantDashboardPage({ merchant, establishment, offers, orders, onNavigate }: MerchantDashboardPageProps) {
  const totalPublishedOffers = offers.length;
  const availableProductsCount = offers.reduce((sum, o) => sum + o.quantity, 0);
  const receivedOrdersCount = orders.length;
  const awaitingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Payée / À récupérer' || o.orderStatus === 'En attente'
  ).length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === 'Récupérée').length;

  const recentOrders = orders.slice(0, 4);
  const recentOffers = offers.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* En-tête de bienvenue & Action rapide */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C98B]/60 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C6749]/10 text-[#4C6749] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            {establishment.adminValidated ? 'Établissement validé par l’administrateur' : 'Établissement en attente de validation'}
            {establishment.type ? ` • ${establishment.type}` : ''}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Bonjour{merchant.fullName ? `, ${merchant.fullName}` : ''}
            {establishment.name && (
              <>
                {' '}— <span className="text-[#A84F32]">{establishment.name}</span>
              </>
            )}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Suivez l’activité de vos invendus et des réservations étudiantes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('qr-scanner')}
            className="px-4 py-3 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-xs transition-colors"
          >
            <QrCode className="w-4 h-4" />
            Scanner un QR Code
          </button>
          <button
            onClick={() => onNavigate('add-offer')}
            className="px-5 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Publier une nouvelle offre
          </button>
        </div>
      </section>

      {/* 5 Cartes KPI */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase">Offres publiées</span>
            <UtensilsCrossed className="w-4 h-4 text-[#A84F32]" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">{totalPublishedOffers}</p>
          <p className="text-xs text-stone-500 mt-1">Catalogue actif & archivé</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase">Produits dispo</span>
            <Package className="w-4 h-4 text-[#4C6749]" />
          </div>
          <p className="text-3xl font-extrabold text-[#4C6749]">{availableProductsCount}</p>
          <p className="text-xs text-stone-500 mt-1">Portions en stock aujourd’hui</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase">Commandes reçues</span>
            <ShoppingBag className="w-4 h-4 text-[#D98245]" />
          </div>
          <p className="text-3xl font-extrabold text-stone-900">{receivedOrdersCount}</p>
          <p className="text-xs text-stone-500 mt-1">Réservations étudiantes</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase">En attente</span>
            <Clock className="w-4 h-4 text-[#D98245]" />
          </div>
          <p className="text-3xl font-extrabold text-[#D98245]">{awaitingOrdersCount}</p>
          <p className="text-xs text-stone-500 mt-1">À traiter ou à récupérer</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-bold uppercase">Terminées</span>
            <CheckCircle2 className="w-4 h-4 text-[#4C6749]" />
          </div>
          <p className="text-3xl font-extrabold text-[#A84F32]">{completedOrdersCount}</p>
          <p className="text-xs text-stone-500 mt-1">Validées par QR Code</p>
        </div>
      </section>

      {/* Activité : le graphique sera calculé à partir des réservations réelles */}
      <section className="bg-white rounded-2xl p-6 border border-[#E9C98B]/60 shadow-2xs">
        <h2 className="font-extrabold text-stone-900 text-base">Activité des réservations</h2>
        <EmptyState
          compact
          className="border-0 !px-0 !pb-2"
          icon={BarChart3}
          title="Les statistiques apparaîtront lorsque les premières données seront disponibles."
          description="L’évolution de vos réservations sera affichée ici dès que des étudiants réserveront vos offres."
        />
      </section>

      {/* Deux colonnes : Commandes récentes & Offres récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Commandes récentes */}
        <section className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-stone-900 text-base">Commandes récentes</h2>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs font-bold text-[#A84F32] hover:underline"
            >
              Toutes les commandes →
            </button>
          </div>

          {recentOrders.length === 0 && (
            <EmptyState compact className="border-0 !py-8" icon={ClipboardList} title="Aucune commande pour le moment." description="Les réservations des étudiants apparaîtront ici." />
          )}
          <div className="space-y-3">
            {recentOrders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => onNavigate('order-details', { orderId: ord.id })}
                className="p-3.5 rounded-xl bg-[#F8F1E7]/65 hover:bg-[#F8F1E7] border border-[#E9C98B]/40 cursor-pointer transition-colors flex flex-wrap items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-900">{ord.id}</span>
                    <span className="text-xs text-stone-500">• {ord.studentName}</span>
                  </div>
                  <p className="text-xs font-semibold text-stone-700 truncate mt-0.5">
                    {ord.quantity}× {ord.productName}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={ord.orderStatus} />
                  <span className="text-sm font-extrabold text-stone-900">
                    {formatPrice(ord.totalAmount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Offres récentes */}
        <section className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-stone-900 text-base">Offres récentes</h2>
            <button
              onClick={() => onNavigate('offers')}
              className="text-xs font-bold text-[#A84F32] hover:underline"
            >
              Gérer mes offres →
            </button>
          </div>

          {recentOffers.length === 0 && (
            <EmptyState
              compact
              className="border-0 !py-8"
              icon={Tag}
              title="Aucune offre publiée pour le moment."
              action={{ label: 'Publier une offre', onClick: () => onNavigate('add-offer') }}
            />
          )}
          <div className="space-y-3">
            {recentOffers.map((off) => (
              <div
                key={off.id}
                onClick={() => onNavigate('edit-offer', { offerId: off.id })}
                className="p-3 rounded-xl bg-[#F8F1E7]/65 hover:bg-[#F8F1E7] border border-[#E9C98B]/40 cursor-pointer transition-colors flex items-center gap-3"
              >
                <SafeImage
                  src={off.photo}
                  alt={off.name}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-stone-900 truncate">{off.name}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Stock : <strong>{off.quantity}</strong> • {off.pickupStart} - {off.pickupEnd}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#4C6749]">
                      {formatPrice(off.reducedPrice)}
                    </span>
                    <span className="text-[11px] text-stone-400 line-through">
                      {formatPrice(off.initialPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
