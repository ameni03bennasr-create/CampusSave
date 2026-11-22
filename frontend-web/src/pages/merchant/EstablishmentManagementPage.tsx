import { useState, useRef } from 'react';
import {
  Camera,
  Edit3,
  ShieldCheck
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import type { MerchantEstablishment } from '@/types/merchant';
import type { ChangeEvent, FormEvent } from 'react';

// ============================================================================
// PAGE 04 – MON ÉTABLISSEMENT
// ============================================================================
interface EstablishmentManagementPageProps {
  establishment: MerchantEstablishment;
  onSave: (updated: MerchantEstablishment) => void;
}

export function EstablishmentManagementPage({ establishment, onSave }: EstablishmentManagementPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...establishment });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, logo: String(reader.result) }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Mon établissement</h1>
          <p className="text-sm text-stone-500 mt-1">
            Consultez et mettez à jour la fiche publique visible par les étudiants de l’ESSECT.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
          >
            <Edit3 className="w-4 h-4" />
            Modifier les informations
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-2xs overflow-hidden">
        {/* Photo de couverture */}
        <div className="relative h-44 sm:h-52 bg-stone-200">
          <SafeImage
            src={form.coverImage}
            alt={form.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
          <span
            className={`absolute top-4 right-4 px-3.5 py-1.5 rounded-full text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md ${
              establishment.adminValidated ? 'bg-[#4C6749]' : 'bg-[#D98245]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            {establishment.adminValidated
              ? `Validé par l’Administrateur${establishment.validatedDate ? ` (${establishment.validatedDate})` : ''}`
              : 'En attente de validation par l’administrateur'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          {/* Logo & En-tête */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-6 relative z-10">
            <div className="flex items-end gap-4">
              <div className="relative">
                <SafeImage
                  src={form.logo}
                  alt={form.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#A84F32] text-white shadow-md hover:bg-[#8E4128]"
                    title="Changer le logo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-stone-900">{form.name}</h2>
                <span className="text-xs font-bold text-[#D98245]">{form.type} • Montfleury</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Nom de l’établissement
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Type d’établissement
              </label>
              <select
                disabled={!isEditing}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
              >
                <option value="Restaurant">Restaurant</option>
                <option value="Cafétéria">Cafétéria</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Numéro de téléphone
              </label>
              <input
                type="tel"
                disabled={!isEditing}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Adresse e-mail de contact
              </label>
              <input
                type="email"
                disabled={!isEditing}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Adresse (proximité ESSECT)
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Horaires d’ouverture
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-xs font-bold text-stone-500 mb-1.5">
              Description de l’établissement
            </label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm text-stone-800 disabled:bg-[#F8F1E7]/60 focus:outline-none focus:border-[#A84F32]"
            />
          </div>

          {isEditing && (
            <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setForm({ ...establishment });
                  setIsEditing(false);
                }}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold shadow-sm"
              >
                Enregistrer les modifications
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
