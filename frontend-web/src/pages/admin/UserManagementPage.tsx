import { useState, useMemo } from 'react';
import {
  Search,
  Users
} from 'lucide-react';
import { AccountStatusBadge } from '@/components/admin/AccountStatusBadge';
import { RoleBadge } from '@/components/admin/RoleBadge';
import type { AdminUser } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 03 – GESTION DES UTILISATEURS
// ============================================================================
interface UserManagementPageProps {
  users: AdminUser[];
  onToggleStatus: (userId: string) => void;
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function UserManagementPage({ users, onToggleStatus, onNavigate }: UserManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [confirmUser, setConfirmUser] = useState<AdminUser | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'Tous' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'Tous' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Gestion des utilisateurs
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Consultez l’ensemble des comptes étudiants, commerçants et administrateurs inscrits sur CampusSave.
        </p>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom, e-mail ou ID utilisateur..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Rôle : Tous</option>
            <option value="Étudiant">Étudiant</option>
            <option value="Commerçant">Commerçant</option>
            <option value="Administrateur">Administrateur</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Statut : Tous</option>
            <option value="Actif">Actif</option>
            <option value="En attente">En attente</option>
            <option value="Désactivé">Désactivé</option>
          </select>
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7] border-b border-[#E9C98B]/50 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5">ID Utilisateur</th>
                <th className="py-3.5 px-4">Nom complet</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Rôle</th>
                <th className="py-3.5 px-4">Date d’inscription</th>
                <th className="py-3.5 px-4">Statut du compte</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-stone-500">
                    {users.length === 0 ? (
                      <EmptyState compact className="border-0" icon={Users} title="Aucun utilisateur inscrit pour le moment." description="Les comptes étudiants et commerçants apparaîtront ici dès les premières inscriptions." />
                    ) : (
                      <span className="block py-10">Aucun utilisateur ne correspond aux filtres sélectionnés.</span>
                    )}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8F1E7]/35 transition-colors">
                    <td className="py-4 px-5 font-mono text-xs font-bold text-stone-600 whitespace-nowrap">
                      {u.id}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-stone-900 whitespace-nowrap">
                      {u.fullName}
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-600">{u.email}</td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-600 whitespace-nowrap">
                      {u.registrationDate}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <AccountStatusBadge status={u.status} />
                    </td>
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('user-details', { userId: u.id })}
                          className="px-3 py-1.5 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold"
                        >
                          Voir détails
                        </button>
                        {u.role !== 'Administrateur' && (
                          <button
                            onClick={() => setConfirmUser(u)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                              u.status === 'Actif'
                                ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                : 'bg-[#4C6749]/15 hover:bg-[#4C6749]/25 text-[#4C6749]'
                            }`}
                          >
                            {u.status === 'Actif' ? 'Désactiver' : 'Activer'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale de confirmation activation/désactivation */}
      {confirmUser && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E9C98B] shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-stone-900">
              {confirmUser.status === 'Actif'
                ? 'Désactiver ce compte utilisateur ?'
                : 'Activer ce compte utilisateur ?'}
            </h3>
            <p className="text-sm text-stone-600">
              Confirmez-vous le changement de statut pour{' '}
              <strong>{confirmUser.fullName}</strong> ({confirmUser.email}) ?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmUser(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onToggleStatus(confirmUser.id);
                  setConfirmUser(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold ${
                  confirmUser.status === 'Actif'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-[#4C6749] hover:bg-[#3B5239]'
                }`}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
