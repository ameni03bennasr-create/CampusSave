import { useState, useMemo } from 'react';
import {
  Search,
  ShieldCheck,
  Store
} from 'lucide-react';
import { ValidationStatusBadge } from '@/components/admin/ValidationStatusBadge';
import { SafeImage } from '@/components/common/SafeImage';
import type { AdminMerchant } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 05 – GESTION DES COMMERÇANTS
// ============================================================================
interface MerchantManagementPageProps {
  merchants: AdminMerchant[];
  pendingCount: number;
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function MerchantManagementPage({ merchants, pendingCount, onNavigate }: MerchantManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('Tous');
  const [validationFilter, setValidationFilter] = useState('Tous');

  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      const matchesSearch =
        m.establishmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'Tous' || m.type === typeFilter;
      const matchesValidation =
        validationFilter === 'Tous' || m.validationStatus === validationFilter;
      return matchesSearch && matchesType && matchesValidation;
    });
  }, [merchants, searchQuery, typeFilter, validationFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Gestion des commerçants
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Répertoire des restaurants et cafétérias partenaires autour de l’ESSECT.
          </p>
        </div>

        <button
          onClick={() => onNavigate('merchant-validation')}
          className="px-5 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-xs"
        >
          <ShieldCheck className="w-4 h-4" />
          Demandes de validation ({pendingCount})
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par établissement, responsable ou adresse..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Type : Tous</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Cafétéria">Cafétéria</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={validationFilter}
            onChange={(e) => setValidationFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Validation : Tous</option>
            <option value="Validé">Validé</option>
            <option value="En attente">En attente</option>
            <option value="Rejeté">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Tableau Commerçants */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7] border-b border-[#E9C98B]/50 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5">Établissement</th>
                <th className="py-3.5 px-4">Responsable & Contact</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Adresse</th>
                <th className="py-3.5 px-4">Inscription</th>
                <th className="py-3.5 px-4">Validation</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-stone-500">
                    {merchants.length === 0 ? (
                      <EmptyState compact className="border-0" icon={Store} title="Aucun commerçant enregistré." description="Les établissements apparaîtront ici dès leur demande d’inscription." />
                    ) : (
                      <span className="block py-10">Aucun établissement ne correspond à votre recherche.</span>
                    )}
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F8F1E7]/35 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3 min-w-[200px]">
                        <SafeImage
                          src={m.photo}
                          alt={m.establishmentName}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-100"
                        />
                        <div>
                          <span className="text-[11px] font-mono text-stone-400">{m.id}</span>
                          <p className="font-extrabold text-stone-900">{m.establishmentName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-bold text-stone-900 text-xs">{m.contactName}</p>
                      <p className="text-xs text-stone-500">{m.email}</p>
                      <p className="text-[11px] text-stone-400">{m.phone}</p>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-lg bg-[#F8F1E7] text-stone-700 text-xs font-bold">
                        {m.type}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-stone-600 max-w-[220px]">
                      {m.address}
                    </td>

                    <td className="py-4 px-4 text-xs text-stone-600 whitespace-nowrap">
                      {m.registrationDate}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <ValidationStatusBadge status={m.validationStatus} />
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {m.validationStatus === 'En attente' && (
                          <button
                            onClick={() => onNavigate('merchant-validation')}
                            className="px-3 py-1.5 rounded-xl bg-[#D98245] hover:bg-[#C27138] text-white text-xs font-bold"
                          >
                            Traiter
                          </button>
                        )}
                        <button
                          onClick={() => onNavigate('merchant-details', { merchantId: m.id })}
                          className="px-3 py-1.5 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold"
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
