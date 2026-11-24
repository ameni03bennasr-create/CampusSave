import { useState } from 'react';
import { AlertCircle, CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { errorMessage } from '@/services/errors';
import { formatPrice } from '@/utils/format';
import type { StudentNavigate } from '@/types/navigation';
import type { StudentOrder } from '@/types/student';

// ============================================================================
// PAGE 08 – PAIEMENT ÉLECTRONIQUE
// Le paiement est créé côté serveur auprès du prestataire ; il n'est confirmé que par
// le prestataire (webhook). Cette page ne simule jamais un succès ou un échec.
// ============================================================================
interface ElectronicPaymentPageProps {
  order: StudentOrder;
  /** Creates the payment on the backend and redirects to the provider (rejects if unavailable). */
  onPay: (method: string) => Promise<void>;
  onNavigate: StudentNavigate;
}

const PAYMENT_METHODS = [
  {
    id: 'bank_card',
    title: 'Carte bancaire',
    desc: 'Paiement sécurisé sur la page de notre prestataire de paiement',
    icon: CreditCard
  },
  {
    id: 'e_dinar',
    title: 'e-Dinar',
    desc: 'Paiement avec votre carte e-Dinar via notre prestataire de paiement',
    icon: Wallet
  }
];

export function ElectronicPaymentPage({ order, onPay, onNavigate }: ElectronicPaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0].id);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setError('');
    setPending(true);
    try {
      await onPay(selectedMethod);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#A84F32]">
          Étape 3 sur 3 • Paiement sécurisé
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
          Paiement électronique
        </h1>
        <p className="text-sm text-stone-500">
          Votre paiement est traité par un prestataire agréé. CampusSave ne collecte ni ne stocke aucune donnée bancaire.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-sm overflow-hidden">
          {/* En-tête montant & référence */}
          <div className="p-6 sm:p-8 bg-[#F8F1E7] border-b border-[#E9C98B]/50 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-stone-500 block">Référence commande</span>
              <span className="text-lg font-extrabold text-stone-900">{order.id}</span>
              <p className="text-xs text-stone-600 mt-0.5">{order.productTitle}</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-bold text-stone-500 block">Montant à payer</span>
              <span className="text-3xl font-extrabold text-[#A84F32]">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Sélection du moyen de paiement */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Choisissez votre moyen de paiement
              </label>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  const active = selectedMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        active
                          ? 'border-[#A84F32] bg-[#A84F32]/5'
                          : 'border-stone-200 hover:border-[#E9C98B]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            active ? 'bg-[#A84F32] text-white' : 'bg-[#F8F1E7] text-stone-600'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-stone-900">{method.title}</p>
                          <p className="text-xs text-stone-500">{method.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          active ? 'border-[#A84F32]' : 'border-stone-300'
                        }`}
                      >
                        {active && <div className="w-2.5 h-2.5 rounded-full bg-[#A84F32]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sécurité & confidentialité */}
            <div className="p-4 rounded-2xl bg-[#4C6749]/10 border border-[#4C6749]/25 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#4C6749] shrink-0 mt-0.5" />
              <div className="text-xs text-stone-700 leading-relaxed">
                <strong className="text-[#4C6749] block">Environnement de paiement sécurisé</strong>
                Vous serez redirigé vers la page de paiement de notre prestataire. Votre commande n’est validée, et votre QR Code généré, qu’après confirmation du paiement par le prestataire.
              </div>
            </div>

            {error && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={pending}
                onClick={handlePay}
                className="w-full py-4 px-6 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {pending ? 'Redirection vers le paiement sécurisé…' : `Payer ${formatPrice(order.totalAmount)}`}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('orders')}
                className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition-colors"
              >
                Payer plus tard — voir mes commandes
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
