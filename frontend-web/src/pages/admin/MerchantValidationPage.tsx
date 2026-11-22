import { useState } from 'react';
import {
  CheckCircle2
} from 'lucide-react';
import { ValidationStatusBadge } from '@/components/admin/ValidationStatusBadge';
import { SafeImage } from '@/components/common/SafeImage';
import type { AdminMerchant } from '@/types/admin';
import type { AdminNavigateOptions } from '@/types/navigation';

// ============================================================================
// PAGE 06 – VALIDATION DES COMMERÇANTS
// ============================================================================
interface MerchantValidationPageProps {
  merchants: AdminMerchant[];
  onDecision: (merchantId: string, decision: string, reason?: string) => void;
  onNavigate: (page: "login" | "order-details" | "statistics" | "dashboard" | "settings" | "users" | "merchants" | "user-details" | "merchant-validation" | "merchant-details" | "offers-supervision" | "orders-supervision", params?: AdminNavigateOptions) => void;
}

export function MerchantValidationPage({ merchants, onDecision, onNavigate }: MerchantValidationPageProps) {
  const [viewMode, setViewMode] = useState('pending'); // 'pending' | 'processed'
  const [dialogState, setDialogState] = useState<{ merchant: AdminMerchant; action: 'Validé' | 'Rejeté' } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingList = merchants.filter((m) => m.validationStatus === 'En attente');
  const processedList = merchants.filter((m) => m.validationStatus !== 'En attente');
  const displayedList = viewMode === 'pending' ? pendingList : processedList;

  const confirmDialogAction = () => {
    if (!dialogState) return;
    onDecision(dialogState.merchant.id, dialogState.action, rejectionReason);
    setDialogState(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#A84F32]/10 text-[#A84F32] text-xs font-bold mb-2">
            Gouvernance & Conformité ESSECT
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            Validation des commerçants
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Examinez les dossiers soumis par les restaurants et cafétérias avant d’autoriser la publication d’offres.
          </p>
        </div>

        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-[#E9C98B]/60">
          <button
            onClick={() => setViewMode('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              viewMode === 'pending'
                ? 'bg-[#A84F32] text-white'
                : 'text-stone-600 hover:bg-[#F8F1E7]'
            }`}
          >
            Demandes en attente ({pendingList.length})
          </button>
          <button
            onClick={() => setViewMode('processed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              viewMode === 'processed'
                ? 'bg-[#A84F32] text-white'
                : 'text-stone-600 hover:bg-[#F8F1E7]'
            }`}
          >
            Dossiers traités ({processedList.length})
          </button>
        </div>
      </div>

      {displayedList.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-[#E9C98B]/60 text-center max-w-lg mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#4C6749]/15 text-[#4C6749] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-stone-900">
            {viewMode === 'pending'
              ? 'Aucune demande en attente de validation'
              : 'Aucun dossier traité'}
          </h3>
          <p className="text-sm text-stone-500">
            Tous les dossiers d’inscription commerçants ont été examinés par l’administration.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {displayedList.map((m) => (
            <div
              key={m.id}
              className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-2xs overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 bg-stone-100">
                  <SafeImage
                    src={m.photo}
                    alt={m.establishmentName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-stone-900/80 text-white text-xs font-bold">
                      {m.type}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-white/95 text-stone-800 text-xs font-bold">
                      {m.submittedInfo?.distanceEssect} de l’ESSECT
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <ValidationStatusBadge status={m.validationStatus} />
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <span className="text-xs font-mono text-stone-400">
                      Dossier {m.id} • Soumis le {m.registrationDate}
                    </span>
                    <h2 className="text-xl font-extrabold text-stone-900 mt-0.5">
                      {m.establishmentName}
                    </h2>
                  </div>

                  {/* Coordonnées & Adresse */}
                  <div className="p-4 rounded-2xl bg-[#F8F1E7]/75 border border-[#E9C98B]/50 space-y-1.5 text-xs text-stone-700">
                    <p>
                      <strong>Responsable :</strong> {m.contactName}
                    </p>
                    <p>
                      <strong>Contact :</strong> {m.email} • {m.phone}
                    </p>
                    <p>
                      <strong>Adresse :</strong> {m.address}
                    </p>
                  </div>

                  {/* Informations soumises */}
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <p>
                      <strong className="text-stone-800">Matricule fiscal :</strong>{' '}
                      {m.submittedInfo?.matriculeFiscal}
                    </p>
                    <p>
                      <strong className="text-stone-800">Horaires déclarés :</strong>{' '}
                      {m.submittedInfo?.openingHours}
                    </p>
                    <p className="leading-relaxed pt-1">{m.submittedInfo?.description}</p>
                    {m.rejectionReason && (
                      <p className="text-red-700 font-semibold pt-1">
                        Motif du rejet : {m.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions de validation */}
              <div className="px-6 py-4 bg-[#F8F1E7]/40 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => onNavigate('merchant-details', { merchantId: m.id })}
                  className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs font-bold"
                >
                  Voir les détails
                </button>

                {m.validationStatus === 'En attente' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRejectionReason('');
                        setDialogState({ merchant: m, action: 'Rejeté' });
                      }}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold"
                    >
                      Rejeter l’inscription
                    </button>
                    <button
                      onClick={() => setDialogState({ merchant: m, action: 'Validé' })}
                      className="px-4 py-2 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold shadow-2xs"
                    >
                      Approuver l’inscription
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Boîte de dialogue de confirmation Approbation / Rejet */}
      {dialogState && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E9C98B] shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-stone-900">
              {dialogState.action === 'Validé'
                ? 'Approuver cet établissement ?'
                : 'Rejeter cette demande d’inscription ?'}
            </h3>
            <p className="text-sm text-stone-600">
              {dialogState.action === 'Validé'
                ? `En approuvant « ${dialogState.merchant.establishmentName} », son compte commerçant sera activé et autorisé à publier des offres auprès des étudiants de l’ESSECT.`
                : `Vous êtes sur le point de refuser l’accès à « ${dialogState.merchant.establishmentName} ».`}
            </p>

            {dialogState.action === 'Rejeté' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Motif du rejet (optionnel)
                </label>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Motif du refus (communiqué au commerçant)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#A84F32]"
                />
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDialogState(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700"
              >
                Annuler
              </button>
              <button
                onClick={confirmDialogAction}
                className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold ${
                  dialogState.action === 'Validé'
                    ? 'bg-[#4C6749] hover:bg-[#3B5239]'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {dialogState.action === 'Validé'
                  ? 'Confirmer l’approbation'
                  : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
