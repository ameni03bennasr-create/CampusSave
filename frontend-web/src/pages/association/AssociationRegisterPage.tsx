import { useState } from 'react';

export function AssociationRegisterPage({ onGoLogin }: { onGoLogin: () => void }) {
  const [formData, setFormData] = useState({ clubName: '', university: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'inscription (mock)
    alert("Inscription de l'association réussie ! (Simulation)");
    onGoLogin();
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block px-3 py-1 rounded-full bg-[#4C6749]/10 text-[#4C6749] text-xs font-bold mb-3">Nouveau compte club</span>
        <h2 className="text-2xl font-extrabold text-stone-900">Inscription Association</h2>
        <p className="text-sm text-stone-500 mt-1">Rejoignez CampusSave pour équiper votre club.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Nom du Club / Association</label>
          <input required type="text" placeholder="Ex: Club Informatique ESSECT" value={formData.clubName} onChange={e => setFormData({...formData, clubName: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Université / Établissement</label>
          <input required type="text" placeholder="Ex: ESSECT" value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Adresse Email</label>
          <input required type="email" placeholder="contact@club.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Mot de passe</label>
          <input required type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white font-bold transition-colors">
          Créer mon compte association
        </button>
      </form>

      <p className="text-center text-sm text-stone-600">
        Déjà un compte ? <button onClick={onGoLogin} className="font-bold text-[#A84F32] hover:underline">Se connecter</button>
      </p>
    </div>
  );
}