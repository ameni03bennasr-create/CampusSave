import { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  QrCode,
  XCircle
} from 'lucide-react';
import { formatPrice } from '@/utils/format';
import type { QrValidationResult } from '@/types/merchant';

// ============================================================================
// PAGE 10 – VALIDATION QR CODE (SCANNER CAMÉRA & SAISIE MANUELLE)
// ============================================================================
interface QrScannerValidationPageProps {
  initialCode?: string;
  onValidateQr: (rawInput: string) => QrValidationResult;
}

export function QrScannerValidationPage({ initialCode = '', onValidateQr }: QrScannerValidationPageProps) {
  const [manualCode, setManualCode] = useState(initialCode);
  const [validationResult, setValidationResult] = useState<QrValidationResult | null>(null);

  // Prefill the manual field when navigation provides a code (adjust state while rendering).
  const [prevInitialCode, setPrevInitialCode] = useState(initialCode);
  if (prevInitialCode !== initialCode) {
    setPrevInitialCode(initialCode);
    if (initialCode) setManualCode(initialCode);
  }

  const runValidation = (codeToTest: string) => {
    const res = onValidateQr(codeToTest);
    setValidationResult(res);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4C6749]/15 text-[#4C6749] text-xs font-bold mb-2">
          <QrCode className="w-3.5 h-3.5" />
          Contrôle au comptoir • Retrait Étudiant
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Validation QR Code de commande
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Scannez le QR Code présenté par l’étudiant ou saisissez la référence de commande pour confirmer le retrait.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Colonne gauche : Caméra de scan */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-[#E9C98B]/70 shadow-2xs space-y-4">
          <h2 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
            <Camera className="w-4 h-4 text-[#A84F32]" />
            Caméra de scan QR Code
          </h2>

          {/* Le scan par caméra est intégré à l'étape « QR Code » : aucun scan n'est simulé. */}
          <div className="h-64 rounded-2xl bg-stone-900 flex flex-col items-center justify-center p-6 text-center gap-3">
            <span className="w-14 h-14 rounded-2xl bg-white/10 text-[#E9C98B] flex items-center justify-center">
              <Camera className="w-7 h-7" aria-hidden="true" />
            </span>
            <p className="text-sm font-bold text-white">Scan par caméra bientôt disponible</p>
            <p className="text-xs text-stone-400 max-w-xs">
              En attendant, saisissez la référence de commande communiquée par l’étudiant dans le champ de droite.
            </p>
          </div>
        </div>

        {/* Colonne droite : Saisie manuelle & Résultat de validation */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-[#E9C98B]/70 shadow-2xs space-y-4">
            <h2 className="font-extrabold text-stone-900 text-base">
              Saisie manuelle de la référence ou du jeton QR
            </h2>
            <p className="text-xs text-stone-500">
              En cas de difficulté de lecture optique, saisissez le numéro de commande affiché sur le téléphone de l’étudiant.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                runValidation(manualCode);
              }}
              className="flex flex-col sm:flex-row gap-2.5"
            >
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Référence de commande ou code QR"
                className="flex-1 px-4 py-3 rounded-xl border border-stone-200 text-sm font-mono font-bold bg-[#F8F1E7]/50 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-xs shrink-0"
              >
                Valider
              </button>
            </form>
          </div>

          {/* Affichage dynamique des 4 états de résultat */}
          {validationResult && (
            <div
              className={`rounded-3xl p-6 border-2 shadow-sm space-y-3 ${
                validationResult.status === 'success'
                  ? 'bg-[#4C6749]/10 border-[#4C6749]'
                  : validationResult.status === 'unpaid'
                  ? 'bg-[#E9C98B]/35 border-[#D98245]'
                  : validationResult.status === 'already_collected'
                  ? 'bg-orange-50 border-orange-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.status === 'success' && (
                  <CheckCircle2 className="w-7 h-7 text-[#4C6749] shrink-0" />
                )}
                {validationResult.status === 'unpaid' && (
                  <AlertTriangle className="w-7 h-7 text-[#D98245] shrink-0" />
                )}
                {validationResult.status === 'already_collected' && (
                  <Clock className="w-7 h-7 text-orange-600 shrink-0" />
                )}
                {validationResult.status === 'invalid' && (
                  <XCircle className="w-7 h-7 text-red-600 shrink-0" />
                )}

                <div>
                  <h3 className="font-extrabold text-stone-900 text-base">
                    {validationResult.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
                    {validationResult.message}
                  </p>
                </div>
              </div>

              {validationResult.order && (
                <div className="p-3.5 rounded-2xl bg-white/90 border border-stone-200/80 text-xs space-y-1">
                  <p>
                    <strong>Étudiant :</strong> {validationResult.order.studentName}
                  </p>
                  <p>
                    <strong>Produit :</strong> {validationResult.order.quantity}×{' '}
                    {validationResult.order.productName}
                  </p>
                  <p>
                    <strong>Montant :</strong> {formatPrice(validationResult.order.totalAmount)} (
                    {validationResult.order.paymentStatus})
                  </p>
                  <p>
                    <strong>Statut actuel :</strong>{' '}
                    <span className="font-bold text-[#A84F32]">
                      {validationResult.order.orderStatus}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
