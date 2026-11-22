import {
  ChevronLeft
} from 'lucide-react';
import { ValidationStatusBadge } from '@/components/admin/ValidationStatusBadge';
import { SafeImage } from '@/components/common/SafeImage';
import { formatPrice } from '@/utils/format';
import type { AdminMerchant, AdminOffer } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';

// ============================================================================
// PAGE 07 – DÉTAILS DU COMMERÇANT
// ============================================================================
interface MerchantDetailsPageProps {
  merchant: AdminMerchant;
  offers: AdminOffer[];
  onDecision: (merchantId: string, decision: string, reason?: string) => void;
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function MerchantDetailsPage({ merchant, offers, onDecision, onNavigate }: MerchantDetailsPageProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => onNavigate('merchants')}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-stone-600 hover:text-[#A84F32]"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour à la gestion des commerçants
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-2xs overflow-hidden">
        <div className="relative h-48 bg-stone-200">
          <SafeImage
            src={merchant.photo}
            alt={merchant.establishmentName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <ValidationStatusBadge status={merchant.validationStatus} />
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-stone-100">
            <div>
              <span className="text-xs font-bold text-[#D98245]">
                {merchant.type} • ID {merchant.id}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-0.5">
                {merchant.establishmentName}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Inscrit le {merchant.registrationDate} • Distance campus :{' '}
                {merchant.submittedInfo?.distanceEssect}
              </p>
            </div>

            {merchant.validationStatus === 'En attente' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDecision(merchant.id, 'Rejeté')}
                  className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold"
                >
                  Rejeter
                </button>
                <button
                  onClick={() => onDecision(merchant.id, 'Validé')}
                  className="px-5 py-2.5 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold"
                >
                  Approuver l’établissement
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#F8F1E7]/70 space-y-1.5">
              <h3 className="font-extrabold text-stone-900 text-sm">Coordonnées du responsable</h3>
              <p>
                <strong>Responsable :</strong> {merchant.contactName}
              </p>
              <p>
                <strong>E-mail :</strong> {merchant.email}
              </p>
              <p>
                <strong>Téléphone :</strong> {merchant.phone}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F1E7]/70 space-y-1.5">
              <h3 className="font-extrabold text-stone-900 text-sm">Détails d’inscription</h3>
              <p>
                <strong>Adresse :</strong> {merchant.address}
              </p>
              <p>
                <strong>Matricule fiscal :</strong> {merchant.submittedInfo?.matriculeFiscal}
              </p>
              <p>
                <strong>Horaires :</strong> {merchant.submittedInfo?.openingHours}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-stone-900 text-sm mb-2">
              Présentation de l’établissement
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {merchant.submittedInfo?.description}
            </p>
          </div>

          {/* Offres publiées par ce commerçant (supervision lecture seule) */}
          <div className="pt-4 border-t border-stone-100 space-y-3">
            <h3 className="font-extrabold text-stone-900 text-sm">
              Offres publiées par cet établissement ({offers.length})
            </h3>
            {offers.length === 0 ? (
              <p className="text-xs text-stone-500">
                Aucune offre publiée pour le moment.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className="p-3 rounded-xl bg-[#F8F1E7]/50 border border-[#E9C98B]/50 flex items-center gap-3"
                  >
                    <SafeImage
                      src={off.image}
                      alt={off.productName}
                      className="w-12 h-12 rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-stone-900 truncate">
                        {off.productName}
                      </p>
                      <p className="text-[11px] text-[#4C6749] font-bold">
                        {formatPrice(off.reducedPrice)} • Stock : {off.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
