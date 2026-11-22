import type { AdminMerchant, AdminOffer, AdminOrder, AdminUser } from '@/types/admin';
import { BarChart3, Leaf } from 'lucide-react';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 11 – STATISTIQUES DE LA PLATEFORME
// ============================================================================
interface PlatformStatisticsPageProps {
  users: AdminUser[];
  merchants: AdminMerchant[];
  offers: AdminOffer[];
  orders: AdminOrder[];
}

export function PlatformStatisticsPage({ users, merchants, offers, orders }: PlatformStatisticsPageProps) {

  const totalUsers = users.length;
  const studentsCount = users.filter((u) => u.role === 'Étudiant').length;
  const merchantsCount = merchants.length;
  const validatedMerchantsCount = merchants.filter((m) => m.validationStatus === 'Validé').length;
  const pendingMerchantsCount = merchants.filter((m) => m.validationStatus === 'En attente').length;
  const totalOffersCount = offers.length;
  const totalOrdersCount = orders.length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Statistiques de la plateforme
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Indicateurs clés des utilisateurs, établissements partenaires, offres et commandes CampusSave.
          </p>
        </div>

      </div>

      {users.length === 0 && merchants.length === 0 && offers.length === 0 && orders.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="Les statistiques apparaîtront lorsque les premières données seront disponibles."
          description="Utilisateurs, établissements, offres et commandes seront comptabilisés ici dès les premières inscriptions."
        />
      ) : (
        <>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3.5">
        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Total utilisateurs
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">{totalUsers}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Étudiants
          </span>
          <p className="text-2xl font-extrabold text-[#4C6749] mt-1">{studentsCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Commerçants
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">{merchantsCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Validés
          </span>
          <p className="text-2xl font-extrabold text-[#4C6749] mt-1">
            {validatedMerchantsCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            En attente
          </span>
          <p className="text-2xl font-extrabold text-[#D98245] mt-1">{pendingMerchantsCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Offres publiées
          </span>
          <p className="text-2xl font-extrabold text-[#A84F32] mt-1">{totalOffersCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60">
          <span className="text-[10px] font-bold uppercase text-stone-400 block">
            Total commandes
          </span>
          <p className="text-2xl font-extrabold text-stone-900 mt-1">{totalOrdersCount}</p>
        </div>
      </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-2">
            <h2 className="font-extrabold text-stone-900 text-base">Évolution et impact environnemental</h2>
            <EmptyState
              compact
              className="border-0 !px-0"
              icon={Leaf}
              title="Les courbes d’évolution et les indicateurs d’impact apparaîtront ici."
              description="Ils seront calculés à partir de l’activité réelle de la plateforme (réservations et retraits validés)."
            />
          </div>
        </>
      )}
    </div>
  );
}
