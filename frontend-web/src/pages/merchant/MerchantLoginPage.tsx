import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import type { FormEvent } from 'react';
import { errorMessage } from '@/services/errors';

// ============================================================================
// PAGE 02 – CONNEXION COMMERÇANT
// ============================================================================
interface MerchantLoginPageProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onGoRegister: () => void;
}

export function MerchantLoginPage({ onSubmit, onForgotPassword, onGoRegister }: MerchantLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setResetSent(false);
    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez saisir une adresse e-mail valide.');
      return;
    }
    if (password.length < 4) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }
    setError('');
    setPending(true);
    try {
      await onSubmit(email.trim(), password);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setPending(false);
    }
  };

  const handleForgot = async () => {
    if (!email.trim() || !email.includes('@')) {
      setError('Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.');
      return;
    }
    setError('');
    try {
      await onForgotPassword(email.trim());
      setResetSent(true);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749] mb-2">
          Authentification Commerçant
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Connexion Espace Commerçant
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Gérez les offres invendues et les commandes de votre établissement autour de l’ESSECT.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {resetSent && (
        <div className="mb-4 p-3 rounded-xl bg-[#4C6749]/10 border border-[#4C6749]/30 text-[#4C6749] text-xs font-semibold">
          Un lien de réinitialisation du mot de passe a été envoyé à {email}.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Adresse e-mail professionnelle
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="karim.benali@bistromontfleury.tn"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
              aria-label="Afficher ou masquer le mot de passe"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgot}
            className="text-xs font-bold text-[#D98245] hover:text-[#A84F32] hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 px-6 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Connexion…' : 'Se connecter à mon espace'}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-stone-100 text-center text-sm text-stone-600">
        Nouveau restaurant ou cafétéria près de l’ESSECT ?{' '}
        <button
          type="button"
          onClick={onGoRegister}
          className="font-bold text-[#A84F32] hover:underline"
        >
          Inscrire mon établissement
        </button>
      </div>
    </div>
  );
}
