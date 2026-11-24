import { useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User
} from 'lucide-react';
import type { StudentRegistrationForm } from '@/types/student';
import type { FormEvent } from 'react';
import { errorMessage } from '@/services/errors';
import { isAllowedStudentEmail, STUDENT_EMAIL_DOMAINS } from '@/config/auth';

// ============================================================================
// PAGE 01 – INSCRIPTION ÉTUDIANT
// ============================================================================
interface StudentRegisterPageProps {
  onSubmit: (form: StudentRegistrationForm) => Promise<void>;
  onGoLogin: () => void;
}

export function StudentRegisterPage({ onSubmit, onGoLogin }: StudentRegisterPageProps) {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '+216 ',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pending, setPending] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 3) {
      newErrors.fullName = 'Veuillez saisir votre nom complet (au moins 3 caractères).';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Veuillez saisir une adresse e-mail valide (ex : prenom.nom@exemple.com).';
    } else if (!isAllowedStudentEmail(form.email)) {
      newErrors.email = `L’inscription est réservée aux adresses e-mail ${STUDENT_EMAIL_DOMAINS.map((d) => '@' + d).join(', ')}.`;
    }
    const cleanPhone = form.phone.replace(/\s+/g, '');
    if (!/^(\+216)?[24579]\d{7}$/.test(cleanPhone)) {
      newErrors.phone = 'Numéro de téléphone tunisien invalide (8 chiffres requis).';
    }
    if (form.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères.';
    }
    if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = 'Les deux mots de passe ne correspondent pas.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;
    setPending(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setSubmitError(errorMessage(err));
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#E9C98B]/40 text-[#A84F32] mb-2">
          Nouveau compte étudiant
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Inscription Étudiant
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Rejoignez la communauté anti-gaspillage des étudiants de l’ESSECT.
        </p>
      </div>

      {submitError && (
        <div role="alert" className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Nom complet *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Prénom et nom"
              className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:ring-2 ${
                errors.fullName
                  ? 'border-red-400 focus:ring-red-200'
                  : 'border-stone-200 focus:border-[#A84F32] focus:ring-[#A84F32]/15'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.fullName}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Adresse e-mail *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="votre.adresse@exemple.com"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-stone-200 focus:border-[#A84F32] focus:ring-[#A84F32]/15'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Numéro de téléphone *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+216 00 000 000"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-stone-200 focus:border-[#A84F32] focus:ring-[#A84F32]/15'
                }`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Mot de passe *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min. 6 caractères"
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-stone-200 focus:border-[#A84F32] focus:ring-[#A84F32]/15'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Répéter le mot de passe"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:ring-2 ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-stone-200 focus:border-[#A84F32] focus:ring-[#A84F32]/15'
                }`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 px-6 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-md transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Création du compte…' : 'Créer mon compte étudiant'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-stone-100 text-center text-sm text-stone-600">
        Vous avez déjà un compte CampusSave ?{' '}
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
