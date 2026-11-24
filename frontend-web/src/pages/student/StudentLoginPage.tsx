import { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail
} from 'lucide-react';
import type { FormEvent } from 'react';
import { errorMessage } from '@/services/errors';

// ============================================================================
// PAGE 02 – CONNEXION ÉTUDIANT
// ============================================================================
interface StudentLoginPageProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onGoRegister: () => void;
}

export function StudentLoginPage({ onSubmit, onForgotPassword, onGoRegister }: StudentLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [pending, setPending] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setForgotMessage('');
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
      setForgotMessage(`Un lien de réinitialisation a été envoyé à ${email.trim()}.`);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#4C6749]/15 text-[#4C6749] mb-2">
          Authentification Étudiant
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
          Connexion à CampusSave
        </h2>
        <p className="text-sm text-stone-500 mt-1">
          Accédez aux offres invendues autour de l’ESSECT et gérez vos réservations.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {forgotMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-[#4C6749]/10 border border-[#4C6749]/30 text-[#4C6749] text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {forgotMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Adresse e-mail universitaire ou personnelle
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre.adresse@exemple.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32] focus:ring-2 focus:ring-[#A84F32]/15"
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
              className="w-full pl-10 pr-11 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32] focus:ring-2 focus:ring-[#A84F32]/15"
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
            className="font-semibold text-[#D98245] hover:text-[#A84F32] hover:underline"
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

      <div className="mt-6 pt-5 border-t border-stone-100 text-center text-sm text-stone-600">
        Pas encore inscrit sur CampusSave ?{' '}
        <button
          type="button"
          onClick={onGoRegister}
          className="font-bold text-[#A84F32] hover:underline"
        >
          Créer un compte étudiant
        </button>
      </div>
    </div>
  );
}
