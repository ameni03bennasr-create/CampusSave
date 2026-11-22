import { useState } from 'react';
import {
  LogOut
} from 'lucide-react';
import { RoleBadge } from '@/components/admin/RoleBadge';
import type { AdminProfile } from '@/types/admin';
import type { FormEvent } from 'react';
import type { FeedbackMessage } from '@/types/ui';

// ============================================================================
// PAGE 12 – PROFIL ET PARAMÈTRES ADMINISTRATEUR
// ============================================================================
interface AdminProfileSettingsPageProps {
  adminProfile: AdminProfile;
  onSave: (updated: AdminProfile) => void;
  onLogout: () => void;
}

export function AdminProfileSettingsPage({ adminProfile, onSave, onLogout }: AdminProfileSettingsPageProps) {
  const [form, setForm] = useState({ ...adminProfile });
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [pwdMessage, setPwdMessage] = useState<FeedbackMessage | null>(null);

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!passwords.current || passwords.next.length < 6) {
      setPwdMessage({
        type: 'error',
        text: 'Le nouveau mot de passe doit contenir au moins 6 caractères.'
      });
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwdMessage({
        type: 'error',
        text: 'Les deux nouveaux mots de passe ne correspondent pas.'
      });
      return;
    }
    setPasswords({ current: '', next: '', confirm: '' });
    setPwdMessage({
      type: 'success',
      text: 'Mot de passe administrateur mis à jour avec succès.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Profil et paramètres administrateur
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Gérez vos informations de compte, la sécurité d’accès et les préférences de supervision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Informations du profil */}
        <form
          onSubmit={handleSaveProfile}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C98B]/60 shadow-2xs space-y-5"
        >
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-stone-900 text-lg">Informations personnelles</h2>
            <RoleBadge role="Administrateur" />
          </div>

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
                Adresse e-mail
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
                Téléphone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5">
                Périmètre
              </label>
              <input
                type="text"
                disabled
                value={form.department}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/50 text-stone-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-400">
              Préférences de supervision
            </h3>
            {[
              {
                key: 'alertNewMerchant',
                label: 'Notifier immédiatement lors d’une nouvelle demande d’inscription commerçant'
              },
              {
                key: 'alertFailedPayments',
                label: 'Signaler les échecs de paiement sur la plateforme'
              },
              {
                key: 'dailyDigest',
                label: 'Recevoir un rapport récapitulatif quotidien par e-mail'
              }
            ].map((pref) => (
              <label
                key={pref.key}
                className="flex items-center gap-3 text-xs font-semibold text-stone-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.preferences[pref.key as keyof typeof form.preferences]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferences: {
                        ...form.preferences,
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

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs font-bold shadow-xs"
          >
            Enregistrer les paramètres
          </button>
        </form>

        {/* Sécurité Mot de passe & Déconnexion */}
        <div className="lg:col-span-5 space-y-5">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white rounded-3xl p-6 border border-[#E9C98B]/60 shadow-2xs space-y-3.5"
          >
            <h3 className="font-extrabold text-stone-900 text-base">Modifier le mot de passe</h3>
            {pwdMessage && (
              <p
                className={`text-xs font-semibold p-2.5 rounded-xl ${
                  pwdMessage.type === 'success'
                    ? 'bg-[#4C6749]/15 text-[#4C6749]'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {pwdMessage.text}
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

          <button
            type="button"
            onClick={onLogout}
            className="w-full py-3.5 px-5 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion de l’espace administrateur
          </button>
        </div>
      </div>
    </div>
  );
}
