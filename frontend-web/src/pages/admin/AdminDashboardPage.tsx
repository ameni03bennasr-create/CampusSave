import {
  Activity,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import { RoleBadge } from '@/components/admin/RoleBadge';
import { ValidationStatusBadge } from '@/components/admin/ValidationStatusBadge';
import { formatPrice } from '@/utils/format';
import type { AdminActivity, AdminMerchant, AdminOffer, AdminOrder, AdminProfile, AdminUser } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 02 – TABLEAU DE BORD ADMINISTRATEUR
// ============================================================================
interface AdminDashboardPageProps {
  adminProfile: AdminProfile;
  users: AdminUser[];
  merchants: AdminMerchant[];
  offers: AdminOffer[];
  orders: AdminOrder[];
  activities: AdminActivity[];
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function AdminDashboardPage({
  adminProfile,
  users,
  merchants,
  offers,
  orders,
  activities,
  onNavigate
}: AdminDashboardPageProps) {
  const totalStudents = users.filter((u) => u.role === 'Étudiant').length;
  const totalMerchants = merchants.length;
  const pendingValidations = merchants.filter((m) => m.validationStatus === 'En attente');
  const totalOffers = offers.length;
  const totalOrders = orders.length;

  return (
    <div className="space-y-8">
      {/* Bannière d'accueil supervision */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C98B]/60 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4C6749]/10 text-[#4C6749] text-xs font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            Espace d’administration CampusSave
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Tableau de bord d’administration
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Bienvenue{adminProfile.fullName ? <>, <strong>{adminProfile.fullName}</strong></> : ''}. Supervisez les inscriptions, validez les commerçants et contrôlez les flux de commandes.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            onClick={() => onNavigate('merchant-validation')}
            className="px-5 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            Demandes à valider ({pendingValidations.length})
          </button>
          <button
            onClick={() => onNavigate('statistics')}
            className="px-4 py-3 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 border border-[#E9C98B] text-stone-800 text-xs sm:text-sm font-bold"
          >
            Statistiques détaillées
          </button>
        </div>
      </section>

      {/* 6 Cartes KPI de synthèse */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div
          onClick={() => onNavigate('users')}
          className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 hover:border-[#A84F32] cursor-pointer transition-all shadow-2xs"
        >
          <span className="text-[11px] font-bold uppercase text-stone-400 block">
            Étudiants inscrits
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1.5">{totalStudents}</p>
          <span className="text-[11px] text-[#4C6749] font-semibold mt-1 block">
            Comptes ESSECT
          </span>
        </div>

        <div
          onClick={() => onNavigate('merchants')}
          className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 hover:border-[#A84F32] cursor-pointer transition-all shadow-2xs"
        >
          <span className="text-[11px] font-bold uppercase text-stone-400 block">
            Commerçants
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1.5">{totalMerchants}</p>
          <span className="text-[11px] text-stone-500 mt-1 block">Restaurants & Cafétérias</span>
        </div>

        <div
          onClick={() => onNavigate('merchant-validation')}
          className="bg-white rounded-2xl p-4 border-2 border-[#D98245]/60 hover:border-[#A84F32] cursor-pointer transition-all shadow-2xs"
        >
          <span className="text-[11px] font-bold uppercase text-[#A84F32] block">
            Validations en attente
          </span>
          <p className="text-2xl font-extrabold text-[#D98245] mt-1.5">
            {pendingValidations.length}
          </p>
          <span className="text-[11px] text-[#8A4B1C] font-semibold mt-1 block">
            Action requise →
          </span>
        </div>

        <div
          onClick={() => onNavigate('offers-supervision')}
          className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 hover:border-[#A84F32] cursor-pointer transition-all shadow-2xs"
        >
          <span className="text-[11px] font-bold uppercase text-stone-400 block">
            Offres publiées
          </span>
          <p className="text-2xl font-extrabold text-[#4C6749] mt-1.5">{totalOffers}</p>
          <span className="text-[11px] text-stone-500 mt-1 block">Catalogue supervisé</span>
        </div>

        <div
          onClick={() => onNavigate('orders-supervision')}
          className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 hover:border-[#A84F32] cursor-pointer transition-all shadow-2xs"
        >
          <span className="text-[11px] font-bold uppercase text-stone-400 block">
            Total commandes
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1.5">{totalOrders}</p>
          <span className="text-[11px] text-stone-500 mt-1 block">Réservations plateforme</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 shadow-2xs">
          <span className="text-[11px] font-bold uppercase text-stone-400 block">
            Activité plateforme
          </span>
          <p className={`text-2xl font-extrabold mt-1.5 ${activities.length > 0 ? 'text-[#4C6749]' : 'text-stone-400'}`}>
            {activities.length > 0 ? 'Active' : '—'}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {activities.length} événements récents
          </span>
        </div>
      </section>

      {/* Graphique d'activité & Journal des activités récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-2">
          <h2 className="font-extrabold text-stone-900 text-base">Activité de la plateforme</h2>
          <EmptyState
            compact
            className="border-0 !px-0"
            icon={BarChart3}
            title="Les statistiques apparaîtront lorsque les premières données seront disponibles."
            description="Inscriptions et commandes seront comparées ici dès les premières activités sur la plateforme."
          />
        </section>

        {/* Journal des activités récentes */}
        <section className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-4">
          <h2 className="font-extrabold text-stone-900 text-base">Activités récentes</h2>
          {activities.length === 0 && (
            <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">Aucune activité récente.</p>
          )}
          <div className="space-y-3">
            {activities.slice(0, 4).map((act) => (
              <div
                key={act.id}
                className="p-3 rounded-xl bg-[#F8F1E7]/70 border border-[#E9C98B]/40 flex items-start gap-3"
              >
                <span className="w-2 h-2 rounded-full bg-[#A84F32] mt-1.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-stone-800 leading-relaxed">{act.text}</p>
                  <span className="text-[11px] text-stone-400">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Trois blocs de synthèse : Demandes commerçants, Inscriptions récentes, Dernières commandes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demandes commerçants récemment soumises */}
        <section className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-sm">
              Demandes commerçants récentes
            </h3>
            <button
              onClick={() => onNavigate('merchant-validation')}
              className="text-xs font-bold text-[#A84F32] hover:underline"
            >
              Valider →
            </button>
          </div>
          {merchants.length === 0 && (
            <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">Aucune demande de commerçant.</p>
          )}
          <div className="space-y-2.5">
            {merchants.slice(0, 4).map((m) => (
              <div
                key={m.id}
                onClick={() => onNavigate('merchant-details', { merchantId: m.id })}
                className="p-3 rounded-xl bg-[#F8F1E7]/60 hover:bg-[#F8F1E7] cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-stone-900 truncate">
                    {m.establishmentName}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">
                    {m.type} • {m.contactName}
                  </p>
                </div>
                <ValidationStatusBadge status={m.validationStatus} />
              </div>
            ))}
          </div>
        </section>

        {/* Inscriptions récentes */}
        <section className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-sm">Inscriptions récentes</h3>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs font-bold text-[#A84F32] hover:underline"
            >
              Utilisateurs →
            </button>
          </div>
          {users.length === 0 && (
            <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">Aucune inscription récente.</p>
          )}
          <div className="space-y-2.5">
            {users.slice(0, 4).map((u) => (
              <div
                key={u.id}
                onClick={() => onNavigate('user-details', { userId: u.id })}
                className="p-3 rounded-xl bg-[#F8F1E7]/60 hover:bg-[#F8F1E7] cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-stone-900 truncate">{u.fullName}</p>
                  <p className="text-[11px] text-stone-500 truncate">{u.registrationDate}</p>
                </div>
                <RoleBadge role={u.role} />
              </div>
            ))}
          </div>
        </section>

        {/* Dernières commandes de la plateforme */}
        <section className="bg-white rounded-2xl p-5 border border-[#E9C98B]/60 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-stone-900 text-sm">Dernières commandes</h3>
            <button
              onClick={() => onNavigate('orders-supervision')}
              className="text-xs font-bold text-[#A84F32] hover:underline"
            >
              Commandes →
            </button>
          </div>
          {orders.length === 0 && (
            <p className="text-xs text-stone-500 bg-[#F8F1E7] rounded-xl p-3">Aucune commande pour le moment.</p>
          )}
          <div className="space-y-2.5">
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                onClick={() => onNavigate('order-details', { orderId: ord.id })}
                className="p-3 rounded-xl bg-[#F8F1E7]/60 hover:bg-[#F8F1E7] cursor-pointer flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-stone-900 truncate">
                    {ord.id} • {ord.studentName}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate">{ord.merchantName}</p>
                </div>
                <span className="text-xs font-extrabold text-[#4C6749] shrink-0">
                  {formatPrice(ord.totalAmount)}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
