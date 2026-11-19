import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { LogOut, Save } from 'lucide-react';

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

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-extrabold mb-6">Mon Profil</h1>
      
      <div className="bg-white p-6 rounded-2xl border border-sand shadow-sm space-y-4">
        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Nom complet</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-xl focus:border-terracotta outline-none" />
        </div>
        <div>
          <label className="text-xs font-bold text-stone-500 block mb-1">Rôle (Non modifiable)</label>
          <input type="text" value={user?.role} disabled className="w-full px-3 py-2 border rounded-xl bg-stone-100 text-stone-500" />
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-stone-100">
          <Button onClick={handleSave} variant="secondary" className="flex-1"><Save className="w-4 h-4"/> Enregistrer</Button>
          <Button onClick={handleLogout} variant="danger" className="flex-1"><LogOut className="w-4 h-4"/> Déconnexion</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;