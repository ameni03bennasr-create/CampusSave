import { useState, useMemo } from 'react';
import {
  Search,
  Tag,
  X
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/utils/format';
import type { AdminMerchant, AdminOffer } from '@/types/admin';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 08 – SUPERVISION DES OFFRES (LECTURE SEULE / CONTRÔLE PLATEFORME)
// ============================================================================
interface OffersSupervisionPageProps {
  offers: AdminOffer[];
  merchants: AdminMerchant[];
}

export function OffersSupervisionPage({ offers, merchants }: OffersSupervisionPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [inspectedOffer, setInspectedOffer] = useState<AdminOffer | null>(null);

  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      const matchesSearch =
        o.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesMerchant = merchantFilter === 'Tous' || o.merchantId === merchantFilter;
      const matchesStatus = statusFilter === 'Tous' || o.publicationStatus === statusFilter;
      return matchesSearch && matchesMerchant && matchesStatus;
    });
  }, [offers, searchQuery, merchantFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4C6749]/15 text-[#4C6749] text-xs font-bold mb-2">
            Supervision Plateforme • Contrôle des publications
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Supervision des offres
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Contrôlez l’ensemble des offres alimentaires publiées par les commerçants validés autour de l’ESSECT.
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 grid grid-cols-1 md:grid-cols-12 gap-3.5">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par ID offre ou nom du produit..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
          />
        </div>

        <div className="md:col-span-4">
          <select
            value={merchantFilter}
            onChange={(e) => setMerchantFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Commerçant : Tous</option>
            {merchants
              .filter((m) => m.validationStatus === 'Validé')
              .map((m) => (
                <option key={m.id} value={m.id}>
                  {m.establishmentName}
                </option>
              ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm font-semibold text-stone-700 focus:outline-none focus:border-[#A84F32]"
          >
            <option value="Tous">Statut : Tous</option>
            <option value="Active">Active</option>
            <option value="Stock faible">Stock faible</option>
            <option value="Épuisée">Épuisée</option>
          </select>
        </div>
      </div>

      {/* Tableau des offres supervisées */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7] border-b border-[#E9C98B]/50 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5">ID Offre</th>
                <th className="py-3.5 px-4">Produit</th>
                <th className="py-3.5 px-4">Commerçant</th>
                <th className="py-3.5 px-4">Prix initial / réduit</th>
                <th className="py-3.5 px-4">Quantité</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Récupération</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredOffers.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center text-stone-500">
                    {offers.length === 0 ? (
                      <EmptyState compact className="border-0" icon={Tag} title="Aucune offre publiée pour le moment." description="Les offres des commerçants apparaîtront ici pour supervision." />
                    ) : (
                      <span className="block py-10">Aucune offre ne correspond à vos filtres.</span>
                    )}
                  </td>
                </tr>
              )}
              {filteredOffers.map((off) => (
                <tr key={off.id} className="hover:bg-[#F8F1E7]/35 transition-colors">
                  <td className="py-4 px-5 font-mono text-xs font-bold text-stone-600 whitespace-nowrap">
                    {off.id}
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <SafeImage
                        src={off.image}
                        alt={off.productName}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <p className="font-extrabold text-stone-900 leading-snug">
                        {off.productName}
                      </p>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-[#D98245] text-xs whitespace-nowrap">
                    {off.merchantName}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs text-stone-400 line-through block">
                      {formatPrice(off.initialPrice)}
                    </span>
                    <span className="font-extrabold text-[#4C6749]">
                      {formatPrice(off.reducedPrice)}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-bold text-stone-800 whitespace-nowrap">
                    {off.quantity}
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        off.publicationStatus === 'Active'
                          ? 'bg-[#4C6749]/15 text-[#4C6749]'
                          : off.publicationStatus === 'Stock faible'
                          ? 'bg-[#E9C98B]/55 text-[#8A4B1C]'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {off.publicationStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-xs text-stone-600 whitespace-nowrap">
                    {off.pickupSchedule}
                  </td>

                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => setInspectedOffer(off)}
                      className="px-3 py-1.5 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold"
                    >
                      Voir détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modale d'inspection d'une offre */}
      {inspectedOffer && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#E9C98B] shadow-2xl overflow-hidden">
            <div className="relative h-48 bg-stone-100">
              <SafeImage
                src={inspectedOffer.image}
                alt={inspectedOffer.productName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setInspectedOffer(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-800 shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <span className="text-xs font-bold text-[#D98245]">
                  {inspectedOffer.merchantName} • {inspectedOffer.id}
                </span>
                <h3 className="text-xl font-extrabold text-stone-900 mt-0.5">
                  {inspectedOffer.productName}
                </h3>
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                  {inspectedOffer.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F8F1E7] text-xs">
                <div>
                  <span className="text-stone-500 block">Tarif initial / réduit</span>
                  <strong className="text-[#4C6749] text-sm">
                    {formatPrice(inspectedOffer.reducedPrice)}
                  </strong>{' '}
                  <span className="line-through text-stone-400">
                    ({formatPrice(inspectedOffer.initialPrice)})
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block">Créneau de retrait</span>
                  <strong className="text-stone-900">{inspectedOffer.pickupSchedule}</strong>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setInspectedOffer(null)}
                  className="px-5 py-2.5 rounded-xl bg-[#A84F32] text-white text-xs font-bold"
                >
                  Fermer l’aperçu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
