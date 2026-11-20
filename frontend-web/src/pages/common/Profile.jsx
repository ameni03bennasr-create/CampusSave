import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { LogOut, Save, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');

  const handleSave = () => {
    updateProfile({ name });
    alert('Profil mis à jour avec succès !');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Logique du bouton retour
  const handleGoBack = () => {
    // Si on a un historique de navigation, on recule d'une page
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // Sinon, on redirige vers le tableau de bord correspondant au rôle
      if (user?.role === 'etudiant') navigate('/etudiant');
      else if (user?.role === 'commercant') navigate('/commercant');
      else if (user?.role === 'admin') navigate('/admin');
      else navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      
      {/* --- BOUTON RETOUR AJOUTÉ ICI --- */}
      <button 
        onClick={handleGoBack} 
        className="flex items-center text-stone-500 hover:text-terracotta mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Page précédente
      </button>

      <h1 className="text-2xl font-extrabold mb-6">Mon Profil</h1>
      
      <div className="bg-white p-6 rounded-2xl border border-sand shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Nom complet</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full px-3 py-2 border rounded-xl focus:border-terracotta outline-none" 
          />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Rôle (Non modifiable)</label>
          <input 
            type="text" 
            value={user?.role || 'etudiant'} 
            disabled 
            className="w-full px-3 py-2 border rounded-xl bg-stone-100 text-stone-500" 
          />
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-stone-100">
          <Button onClick={handleSave} variant="secondary" className="flex-1">
            <Save className="w-4 h-4 mr-2"/> Enregistrer
          </Button>
          <Button onClick={handleLogout} variant="danger" className="flex-1">
            <LogOut className="w-4 h-4 mr-2"/> Déconnexion
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;