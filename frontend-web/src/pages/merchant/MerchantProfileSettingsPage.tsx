import { useState } from 'react';
import {
  LogOut,
  ShieldCheck
} from 'lucide-react';
import type { MerchantEstablishment, MerchantProfile } from '@/types/merchant';
import type { FormEvent } from 'react';
import type { FeedbackMessage } from '@/types/ui';

// ============================================================================
// PAGE 13 – PROFIL ET PARAMÈTRES COMMERÇANT
// ============================================================================
interface MerchantProfileSettingsPageProps {
  merchant: MerchantProfile;
  establishment: MerchantEstablishment;
  onUpdateMerchant: (updated: MerchantProfile) => void;
  onLogout: () => void;
}

export function MerchantProfileSettingsPage({
  merchant,
  establishment,
  onUpdateMerchant,
  onLogout
}: MerchantProfileSettingsPageProps) {
  const [form, setForm] = useState({ ...merchant });
  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: ''
  });
  const [pwdFeedback, setPwdFeedback] = useState<FeedbackMessage | null>(null);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    onUpdateMerchant(form);
  };

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    if (!passwords.current || passwords.next.length < 6) {
      setPwdFeedback({
        type: 'error',
        text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.'
      });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwdFeedback({
        type: 'error',
        text: 'La confirmation du nouveau mot de passe ne correspond pas.'
      });
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    setPwdFeedback({
      type: 'success',
      text: 'Mot de passe mis à jour avec succès.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Profil et paramètres
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Gérez vos informations personnelles, la sécurité de votre compte et vos préférences d’alertes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Informations personnelles & Préférences */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C98B]/60 shadow-2xs space-y-5"
        >
          <h2 className="font-extrabold text-stone-900 text-lg">
            Informations du responsable
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                Nom complet
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                Fonction
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                E-mail du compte
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                Téléphone mobile
              </label>
              <input
                type="tel"
                value={form.personalPhone}
                onChange={(e) => setForm({ ...form, personalPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:border-[#A84F32]"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Paramètres de notification
            </h3>
            {[
              { key: 'newReservations', label: 'Recevoir une alerte à chaque nouvelle réservation étudiante' },
              { key: 'paidOrders', label: 'Notifier dès qu’un paiement est confirmé' },
              { key: 'lowStock', label: 'Alerter lorsque le stock d’une offre passe sous 3 portions' }
            ].map((pref) => (
              <label key={pref.key} className="flex items-center gap-3 text-xs font-semibold text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.notificationsPrefs[pref.key as keyof typeof form.notificationsPrefs]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notificationsPrefs: {
                        ...form.notificationsPrefs,
                        [pref.key]: e.target.checked
                      }
                    })
                  }
                  className="rounded border-stone-300 text-[#A84F32] focus:ring-[#A84F32]"
                />
                {pref.label}
              </label>
            ))}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs font-bold shadow-xs"
            >
              Enregistrer les paramètres
            </button>
          </div>
        </form>

        {/* Colonne droite : Établissement lié, Mot de passe & Déconnexion */}
        <div className="lg:col-span-5 space-y-5">
          {/* Résumé Établissement */}
          <div className="bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4C6749]">
              Établissement rattaché
            </span>
            <h3 className="font-extrabold text-stone-900 text-base">{establishment.name}</h3>
            <p className="text-xs text-stone-600">{establishment.address}</p>
            <p className="text-xs font-bold text-[#4C6749] pt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Compte commerçant validé et actif
            </p>
          </div>

          {/* Gestion du mot de passe */}
          <form
            onSubmit={handlePasswordChange}
            className="bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-3"
          >
            <h3 className="font-extrabold text-stone-900 text-base">Sécurité & Mot de passe</h3>
            {pwdFeedback && (
              <p
                className={`text-xs font-semibold p-2.5 rounded-xl ${
                  pwdFeedback.type === 'success'
                    ? 'bg-[#4C6749]/15 text-[#4C6749]'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {pwdFeedback.text}
              </p>
            )}
            <input
              type="password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              placeholder="Mot de passe actuel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#A84F32]"
            />
            <input
              type="password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              placeholder="Nouveau mot de passe (min. 6 car.)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#A84F32]"
            />
            <input
              type="password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              placeholder="Confirmer le nouveau mot de passe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#A84F32]"
            />
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold"
            >
              Mettre à jour le mot de passe
            </button>
          </form>

          {/* Bouton Déconnexion */}
          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3.5 px-5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter de l’espace commerçant
          </button>
        </div>
      </div>
    </div>
  );
}
