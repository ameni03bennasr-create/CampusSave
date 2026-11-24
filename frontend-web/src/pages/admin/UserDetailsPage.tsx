import {
  ChevronLeft
} from 'lucide-react';
import { AccountStatusBadge } from '@/components/admin/AccountStatusBadge';
import { RoleBadge } from '@/components/admin/RoleBadge';
import type { AdminUser } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';

// ============================================================================
// PAGE 04 – DÉTAILS DE L'UTILISATEUR
// ============================================================================
interface UserDetailsPageProps {
  user: AdminUser;
  onToggleStatus: (userId: string) => void;
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function UserDetailsPage({ user, onToggleStatus, onNavigate }: UserDetailsPageProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('users')}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 hover:text-[#A84F32]"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour à la liste des utilisateurs
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-stone-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F8F1E7] text-[#A84F32] flex items-center justify-center font-extrabold text-xl border border-[#E9C98B]">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-stone-900">{user.fullName}</h1>
                <RoleBadge role={user.role} />
              </div>
              <p className="text-xs font-mono text-stone-400 mt-1">ID : {user.id}</p>
            </div>
          </div>

          <AccountStatusBadge status={user.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div className="p-4 rounded-2xl bg-[#F8F1E7]/60">
            <span className="text-xs font-bold text-stone-400 block">Adresse e-mail</span>
            <span className="font-bold text-stone-900 mt-1 block">{user.email}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F1E7]/60">
            <span className="text-xs font-bold text-stone-400 block">Numéro de téléphone</span>
            <span className="font-bold text-stone-900 mt-1 block">{user.phone}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F1E7]/60">
            <span className="text-xs font-bold text-stone-400 block">Date d’inscription</span>
            <span className="font-bold text-stone-900 mt-1 block">{user.registrationDate}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F8F1E7]/60">
            <span className="text-xs font-bold text-stone-400 block">Dernière activité</span>
            <span className="font-bold text-stone-900 mt-1 block">
              {user.details?.lastLogin || 'Récemment'}
            </span>
          </div>
        </div>

        {/* Informations spécifiques au rôle */}
        <div className="p-5 rounded-2xl border border-[#E9C98B]/70 bg-white space-y-2">
          <h2 className="font-extrabold text-stone-900 text-sm">
            Informations complémentaires du compte
          </h2>
          {user.role === 'Commerçant' ? (
            <div className="text-xs text-stone-700 space-y-1.5">
              <p>
                <strong>Établissement associé :</strong> {user.details?.establishmentName}
              </p>
              <button
                onClick={() =>
                  onNavigate('merchant-details', { merchantId: user.details?.establishmentId })
                }
                className="text-[#A84F32] font-bold hover:underline inline-flex items-center gap-1 pt-1"
              >
                Consulter la fiche de l’établissement →
              </button>
            </div>
          ) : (
            <div className="text-xs text-stone-700 space-y-1">
              <p>
                <strong>Affectation / Filière :</strong> {user.details?.filiere}
              </p>
              {user.role === 'Étudiant' && (
                <p>
                  <strong>Commandes passées sur CampusSave :</strong> {user.details?.ordersCount}
                </p>
              )}
            </div>
          )}
        </div>

        {user.role !== 'Administrateur' && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => onToggleStatus(user.id)}
              className={`px-5 py-3 rounded-xl text-xs font-bold text-white shadow-xs ${
                user.status === 'Actif'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-[#4C6749] hover:bg-[#3B5239]'
              }`}
            >
              {user.status === 'Actif'
                ? 'Désactiver ce compte utilisateur'
                : 'Activer ce compte utilisateur'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
