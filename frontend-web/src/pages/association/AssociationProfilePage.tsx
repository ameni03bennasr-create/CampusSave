import { useState, useRef } from 'react';
import { Button } from '@/components/Button';
import { Users, Save, Camera } from 'lucide-react';
import type { AssociationWorkspace } from '@/hooks/useAssociationWorkspace';

export function AssociationProfilePage({ ws }: { ws: AssociationWorkspace }) {
  const { association, setAssociation, showToast } = ws;
  const [formState, setFormState] = useState({ association, formData: association });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset the draft when the source association changes, without an effect.
  if (formState.association !== association) {
    setFormState({ association, formData: association });
  }
  const formData = formState.formData;
  const updateFormData = (update: (current: typeof association) => typeof association) => {
    setFormState(current => ({ ...current, formData: update(current.formData) }));
  };

  const handleSave = () => {
    setAssociation(formData); // On met à jour le state global (la sidebar)
    showToast('Profil du club mis à jour avec succès !');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // On stocke l'image en Base64 pour pouvoir l'afficher partout
        updateFormData(current => ({ ...current, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Profil du Club</h1>
        <p className="text-sm text-stone-500 mt-1">Gérez les informations de votre association.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#E9C98B]/60 shadow-sm space-y-5">
        {/* Section Photo de profil */}
        <div className="flex items-center gap-4 mb-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-20 h-20 bg-[#F8F1E7] rounded-2xl flex items-center justify-center text-[#A84F32] cursor-pointer hover:opacity-80 transition-opacity overflow-hidden border border-[#E9C98B] group"
          >
            {formData.avatar ? (
              <img src={formData.avatar} alt="Logo du club" className="w-full h-full object-cover" />
            ) : (
              <Users className="w-8 h-8" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
          
          <div>
            <h2 className="text-lg font-bold text-stone-800">{formData.name}</h2>
            <p className="text-sm text-stone-500">{formData.memberCount} membres actifs</p>
            <p className="text-xs text-[#A84F32] font-semibold mt-1 cursor-pointer hover:underline" onClick={() => fileInputRef.current?.click()}>
              Changer la photo de profil
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Nom du Club</label>
          <input type="text" value={formData.name} onChange={e => updateFormData(current => ({...current, name: e.target.value}))} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Université</label>
          <input type="text" value={formData.university} onChange={e => updateFormData(current => ({...current, university: e.target.value}))} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">Email de contact</label>
          <input type="email" value={formData.email} onChange={e => updateFormData(current => ({...current, email: e.target.value}))} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
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