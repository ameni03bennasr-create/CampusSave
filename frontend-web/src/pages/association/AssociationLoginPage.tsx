import { useState } from 'react';

export function AssociationLoginPage({ onGoRegister, onLogin }: { onGoRegister: () => void, onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Connexion (mock)
    onLogin();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900">Connexion Association</h2>
        <p className="text-sm text-stone-500 mt-1">Accédez à l'espace de gestion de votre club.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Adresse Email</label>
          <input required type="email" placeholder="contact@club.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Mot de passe</label>
          <input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold transition-colors">
          Se connecter
        </button>
      </form>

      <p className="text-center text-sm text-stone-600">
        Pas encore de compte ? <button onClick={onGoRegister} className="font-bold text-[#A84F32] hover:underline">Créer un compte</button>
      </p>
    </div>
  );
}