import { useState } from 'react';
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import type { FormEvent } from 'react';
import { errorMessage } from '@/services/errors';

// ============================================================================
// PAGE 01 – CONNEXION ADMINISTRATEUR
// ============================================================================
interface AdminLoginPageProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
}

export function AdminLoginPage({ onSubmit, onForgotPassword }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setInfo('');
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez saisir une adresse e-mail administrateur valide.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
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
      setInfo(`Un lien de réinitialisation a été envoyé à ${email.trim()}.`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749] mb-2">
          Accès Restreint • Rôle Administrateur
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Connexion Administrateur
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Authentifiez-vous pour accéder au tableau de supervision CampusSave.
        </p>
      </div>

      {info && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#4C6749]/10 border border-[#4C6749]/30 text-[#4C6749] text-xs font-semibold">
          {info}
        </div>
      )}

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Adresse e-mail administrateur
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="adresse e-mail administrateur"
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

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <label className="inline-flex items-center gap-2 cursor-pointer text-stone-600 font-medium">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-stone-300 text-[#A84F32] focus:ring-[#A84F32]"
            />
            Se souvenir de moi
          </label>

          <button
            type="button"
            onClick={handleForgot}
            className="font-bold text-[#D98245] hover:text-[#A84F32] hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3.5 px-6 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold text-sm shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {pending ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}
