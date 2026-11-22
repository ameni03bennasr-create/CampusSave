import { useState } from 'react';
import {
  AlertCircle,
  Clock,
  Info
} from 'lucide-react';
import type { FormEvent } from 'react';
import { errorMessage } from '@/services/errors';
import type { MerchantRegistrationForm } from '@/types/merchant';

// ============================================================================
// PAGE 01 – INSCRIPTION COMMERÇANT
// ============================================================================
interface MerchantRegisterPageProps {
  onSubmit: (form: MerchantRegistrationForm) => Promise<void>;
  onGoLogin: () => void;
}

export function MerchantRegisterPage({ onSubmit, onGoLogin }: MerchantRegisterPageProps) {
  const [form, setForm] = useState({
    establishmentName: '',
    merchantFullName: '',
    email: '',
    phone: '+216 ',
    password: '',
    confirmPassword: '',
    address: '',
    establishmentType: 'Restaurant'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pending, setPending] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.establishmentName.trim() || form.establishmentName.trim().length < 2) {
      errs.establishmentName = 'Veuillez saisir le nom de votre restaurant ou cafétéria.';
    }
    if (!form.merchantFullName.trim() || form.merchantFullName.trim().length < 3) {
      errs.merchantFullName = 'Veuillez saisir le nom complet du responsable.';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Adresse e-mail professionnelle invalide.';
    }
    const cleanPhone = form.phone.replace(/\s+/g, '');
    if (!/^(\+216)?[24579]\d{7}$/.test(cleanPhone)) {
      errs.phone = 'Numéro de téléphone tunisien invalide (8 chiffres).';
    }
    if (!form.address.trim() || form.address.trim().length < 6) {
      errs.address = 'Veuillez indiquer l’adresse complète près de l’ESSECT.';
    }
    if (form.password.length < 6) {
      errs.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (form.confirmPassword !== form.password) {
      errs.confirmPassword = 'La confirmation du mot de passe ne correspond pas.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setPending(true);
    try {
      await onSubmit(form);
      setSubmitted(true); // only after the server accepted the request
    } catch (err) {
      setSubmitError(errorMessage(err));
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center space-y-5 py-4">
        <div className="w-16 h-16 rounded-2xl bg-[#E9C98B]/50 text-[#A84F32] flex items-center justify-center mx-auto">
          <Clock className="w-9 h-9" />
        </div>
        <span className="inline-block px-3 py-1 rounded-full bg-[#E9C98B]/50 text-[#8A4B1C] text-xs font-extrabold">
          Demande d’inscription enregistrée • En attente de validation
        </span>
        <h2 className="text-2xl font-extrabold text-stone-900">
          Merci, {form.merchantFullName} !
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
          Le dossier de <strong>{form.establishmentName}</strong> ({form.establishmentType}) a bien été transmis à l’administrateur CampusSave.
        </p>
        <div className="p-4 rounded-2xl bg-[#F8F1E7] border border-[#E9C98B] text-xs text-stone-700 max-w-md mx-auto text-left">
          <strong className="text-[#A84F32] block mb-1">Prochaine étape obligatoire :</strong>
          Votre établissement doit être validé par l’administrateur avant que votre compte commerçant puisse publier des offres alimentaires sur la plateforme.
        </div>
        <button
          onClick={onGoLogin}
          className="px-6 py-3.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-sm"
        >
          Aller à la page de connexion
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/45 text-[#A84F32] mb-2">
          Partenaire Restaurateur / Cafétéria
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Inscription Commerçant
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Enregistrez votre établissement situé à proximité de l’ESSECT.
        </p>
      </div>

      {/* Bannière explicative obligatoire : Validation Administrateur */}
      <div className="mb-5 p-3.5 rounded-2xl bg-[#E9C98B]/35 border border-[#D98245]/40 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#A84F32] shrink-0 mt-0.5" />
        <p className="text-xs text-stone-800 leading-relaxed">
          <strong>Validation administrateur requise :</strong> Votre établissement devra être validé par l’administrateur CampusSave avant que votre compte commerçant puisse accéder aux fonctionnalités de publication d’offres.
        </p>
      </div>

      {submitError && (
        <div role="alert" className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nom de l’établissement *
            </label>
            <input
              type="text"
              value={form.establishmentName}
              onChange={(e) => setForm({ ...form, establishmentName: e.target.value })}
              placeholder="Nom de votre restaurant ou cafétéria"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.establishmentName && (
              <p className="text-[11px] text-red-600 mt-1">{errors.establishmentName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Type d’établissement *
            </label>
            <select
              value={form.establishmentType}
              onChange={(e) => setForm({ ...form, establishmentType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            >
              <option value="Restaurant">Restaurant</option>
              <option value="Cafétéria">Cafétéria</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Nom complet du commerçant *
            </label>
            <input
              type="text"
              value={form.merchantFullName}
              onChange={(e) => setForm({ ...form, merchantFullName: e.target.value })}
              placeholder="Prénom et nom du responsable"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.merchantFullName && (
              <p className="text-[11px] text-red-600 mt-1">{errors.merchantFullName}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Numéro de téléphone *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+216 00 000 000"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Adresse e-mail *
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@etablissement.tn"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Adresse de l’établissement *
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="Rue Abou Kacem Chebbi, Montfleury"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.address && <p className="text-[11px] text-red-600 mt-1">{errors.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Mot de passe *
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 6 caractères"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.password && (
              <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">
              Confirmer le mot de passe *
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Répéter le mot de passe"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.confirmPassword && (
              <p className="text-[11px] text-red-600 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 px-6 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-md transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Envoi de la demande…' : 'Soumettre ma demande d’inscription'}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-stone-100 text-center text-sm text-stone-600">
        Votre établissement est déjà inscrit ?{' '}
        <button
          type="button"
          onClick={onGoLogin}
          className="font-bold text-[#A84F32] hover:underline"
        >
          Se connecter
        </button>
      </div>
    </div>
  );
}
