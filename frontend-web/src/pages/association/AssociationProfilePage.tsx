import { useState } from 'react';
import { Button } from '@/components/Button';
import { Users, Save } from 'lucide-react';
import type { AssociationWorkspace } from '@/hooks/useAssociationWorkspace';

export function AssociationProfilePage({ ws }: { ws: AssociationWorkspace }) {
  const { association, showToast } = ws;
  const [formData, setFormData] = useState(association);

  const handleSave = () => {
    showToast('Profil du club mis à jour avec succès !');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Profil du Club</h1>
        <p className="text-sm text-stone-500 mt-1">Gérez les informations de votre association.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E9C98B]/60 shadow-sm space-y-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#F8F1E7] rounded-2xl flex items-center justify-center text-[#A84F32]">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-800">{formData.name}</h2>
            <p className="text-sm text-stone-500">{formData.memberCount} membres actifs</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Nom du Club</label>
          <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Université</label>
          <input type="text" value={formData.university} onChange={e => setFormData({...formData, university: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Email de contact</label>
          <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>

        <div className="pt-4 border-t border-stone-100">
          <Button onClick={handleSave} className="w-full bg-[#4C6749] hover:bg-[#3d543a] text-white flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}