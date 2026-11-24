import { useState, useRef } from 'react';
import { Button } from '@/components/Button';
import { User, Camera, Save } from 'lucide-react';
import type { StudentProfile } from '@/types/student';

interface StudentProfilePageProps {
  student: StudentProfile;
  onUpdateStudent: (student: StudentProfile) => void;
}

export function StudentProfilePage({ student, onUpdateStudent }: StudentProfilePageProps) {
  const [formData, setFormData] = useState(student);
  const [previousStudent, setPreviousStudent] = useState(student);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (student !== previousStudent) {
    setPreviousStudent(student);
    setFormData(student);
  }

  const handleSave = () => {
    onUpdateStudent(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(current => ({ ...current, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">Mon profil étudiant</h1>
          <p className="text-sm text-stone-500 mt-1">Gérez vos informations personnelles et vos coordonnées.</p>
        </div>
        <Button onClick={handleSave} className="bg-[#A84F32] hover:bg-[#8E4128] text-white">
          <Save className="w-4 h-4 mr-2" /> Enregistrer
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/60 shadow-sm overflow-hidden">
        {/* Bannière de fond */}
        <div className="h-32 bg-gradient-to-r from-[#A84F32] to-[#D98245] relative">
           <div className="absolute -bottom-12 left-8">
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="relative w-24 h-24 bg-white rounded-2xl border-4 border-white shadow-md flex items-center justify-center text-stone-400 cursor-pointer group overflow-hidden"
             >
               {formData.avatar ? (
                 <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <User className="w-10 h-10" />
               )}
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <Camera className="w-6 h-6 text-white" />
               </div>
               <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
             </div>
           </div>
        </div>

        {/* Formulaire */}
        <div className="pt-16 px-8 pb-8">
          <div className="flex justify-between items-start mb-8">
             <div>
               <h2 className="text-xl font-bold text-stone-900">{formData.fullName || 'Étudiant'}</h2>
               <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#4C6749]/10 text-[#4C6749] text-xs font-bold">Compte Étudiant Vérifié</span>
             </div>
             <div className="text-right text-xs text-stone-500">
               <p>Membre depuis</p>
               <p className="font-bold">{formData.memberSince || 'N/A'}</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Nom complet</label>
              <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Adresse e-mail</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Numéro de téléphone</label>
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Établissement universitaire</label>
              <input type="text" value={formData.etablissement} onChange={e => setFormData({...formData, etablissement: e.target.value})} className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-stone-700 mb-1">Filière & Niveau d'études</label>
              <input type="text" value={formData.filiere} onChange={e => setFormData({...formData, filiere: e.target.value})} className="w-full px-4 py-3 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}