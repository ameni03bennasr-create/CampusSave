import { useState, useMemo } from 'react';
import {
  Edit3,
  PlusCircle,
  Search,
  Tag,
  Trash2
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { OfferStatusBadge } from '@/components/merchant/OfferStatusBadge';
import { calcDiscount, formatPrice } from '@/utils/format';
import type { MerchantOffer } from '@/types/merchant';
import type { MerchantNavigateOptions } from '@/types/navigation';
import { EmptyState } from '@/components/common/EmptyState';

// ============================================================================
// PAGE 05 – MES OFFRES
// ============================================================================
interface OffersManagementPageProps {
  offers: MerchantOffer[];
  onNavigate: (page: "register" | "login" | "orders" | "order-details" | "notifications" | "statistics" | "offers" | "dashboard" | "establishment" | "add-offer" | "edit-offer" | "qr-scanner" | "settings", params?: MerchantNavigateOptions) => void;
  onDeleteOffer: (offerId: string) => void;
}

export function OffersManagementPage({ offers, onNavigate, onDeleteOffer }: OffersManagementPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Toutes');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesName =
        offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.category.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchesName) return false;

      if (statusFilter === 'Active') return offer.quantity > 2;
      if (statusFilter === 'Stock faible') return offer.quantity > 0 && offer.quantity <= 2;
      if (statusFilter === 'Épuisée') return offer.quantity === 0;
      return true;
    });
  }, [offers, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Mes offres</h1>
          <p className="text-sm text-stone-500 mt-1">
            Publiez, modifiez ou supprimez vos offres alimentaires invendues.
          </p>
        </div>

        <button
          onClick={() => onNavigate('add-offer')}
          className="px-5 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Ajouter une nouvelle offre
        </button>
      </div>

      {/* Barre de recherche & filtres par statut */}
      <div className="bg-white rounded-2xl p-4 border border-[#E9C98B]/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom de produit ou catégorie..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#F8F1E7]/60 border border-stone-200 text-sm focus:bg-white focus:outline-none focus:border-[#A84F32]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['Toutes', 'Active', 'Stock faible', 'Épuisée'].map((st) => {
            const active = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  active
                    ? 'bg-[#A84F32] text-white'
                    : 'bg-[#F8F1E7] text-stone-700 hover:bg-[#E9C98B]/45'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tableau structuré des offres */}
      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F1E7] border-b border-[#E9C98B]/50 text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                <th className="py-3.5 px-5">Produit</th>
                <th className="py-3.5 px-4">Catégorie</th>
                <th className="py-3.5 px-4">Prix initial / réduit</th>
                <th className="py-3.5 px-4">Quantité</th>
                <th className="py-3.5 px-4">Récupération</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {filteredOffers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-stone-500 text-sm">
                    {offers.length === 0 ? (
                      <EmptyState
                        compact
                        className="border-0"
                        icon={Tag}
                        title="Vous n’avez pas encore publié d’offre."
                        description="Publiez votre premier invendu pour le proposer aux étudiants."
                        action={{ label: 'Ajouter une offre', onClick: () => onNavigate('add-offer') }}
                      />
                    ) : (
                      <span className="block py-10">Aucune offre ne correspond à vos critères de recherche.</span>
                    )}
                  </td>
                </tr>
              ) : (
                filteredOffers.map((offer) => {
                  const discount = calcDiscount(offer.initialPrice, offer.reducedPrice);
                  return (
                    <tr key={offer.id} className="hover:bg-[#F8F1E7]/35 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3.5 min-w-[220px]">
                          <SafeImage
                            src={offer.photo}
                            alt={offer.name}
                            className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-100"
                          />
                          <div>
                            <span className="text-[11px] font-bold text-stone-400">
                              {offer.id}
                            </span>
                            <p className="font-extrabold text-stone-900 leading-snug">
                              {offer.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-[#F8F1E7] text-stone-700 text-xs font-semibold whitespace-nowrap">
                          {offer.category}
                        </span>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="text-xs text-stone-400 line-through block">
                          {formatPrice(offer.initialPrice)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-[#4C6749]">
                            {formatPrice(offer.reducedPrice)}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#A84F32]/10 text-[#A84F32] text-[10px] font-extrabold">
                            -{discount}%
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-extrabold text-stone-800 whitespace-nowrap">
                        {offer.quantity} portion(s)
                      </td>

                      <td className="py-4 px-4 text-xs font-semibold text-stone-600 whitespace-nowrap">
                        {offer.pickupStart} – {offer.pickupEnd}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <OfferStatusBadge status={offer.status} quantity={offer.quantity} />
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onNavigate('edit-offer', { offerId: offer.id })}
                            className="px-3 py-2 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 text-stone-800 text-xs font-bold inline-flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#A84F32]" />
                            Modifier
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(offer.id)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700"
                            title="Supprimer cette offre"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modale de confirmation de suppression */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E9C98B] shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-stone-900">Supprimer cette offre ?</h3>
            <p className="text-sm text-stone-600">
              Cette action retirera définitivement l’offre du catalogue étudiant CampusSave.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  onDeleteOffer(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
