import { useState } from 'react';
import {
  Edit3,
  Save
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import type { StudentProfile } from '@/types/student';
import type { FormEvent } from 'react';

// ============================================================================
// PAGE 12 – PROFIL ÉTUDIANT
// ============================================================================
interface StudentProfilePageProps {
  student: StudentProfile;
  onUpdateStudent: (updated: StudentProfile) => void;
}

export function StudentProfilePage({ student, onUpdateStudent }: StudentProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: student.fullName,
    email: student.email,
    phone: student.phone,
    filiere: student.filiere,
    etablissement: student.etablissement
  });
  const [error, setError] = useState('');

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.includes('@')) {
      setError('Veuillez vérifier votre nom complet et votre adresse e-mail.');
      return;
    }
    setError('');
    onUpdateStudent({
      ...student,
      ...form
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">Mon profil étudiant</h1>
          <p className="text-sm text-stone-500 mt-1">
            Gérez vos informations personnelles et vos coordonnées de contact CampusSave.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs font-bold inline-flex items-center gap-2 shadow-xs"
          >
            <Edit3 className="w-4 h-4" />
            Modifier le profil
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-[#E9C98B]/70 shadow-sm overflow-hidden">
        {/* Bandeau supérieur */}
        <div className="h-28 bg-gradient-to-r from-[#A84F32] via-[#D98245] to-[#E9C98B]" />

        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <SafeImage
                src={student.avatar}
                alt={student.fullName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="pb-1">
                <h2 className="text-xl font-extrabold text-stone-900">{student.fullName}</h2>
                <p className="text-xs font-semibold text-[#4C6749]">
                  Compte Étudiant Vérifié • {student.id}
                </p>
              </div>
            </div>
            <span className="text-xs text-stone-500">Membre depuis {student.memberSince}</span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5">
                  Nom complet
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/50 disabled:text-stone-700 focus:outline-none focus:border-[#A84F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  disabled={!isEditing}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/50 disabled:text-stone-700 focus:outline-none focus:border-[#A84F32]"
                />
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
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/50 disabled:text-stone-700 focus:outline-none focus:border-[#A84F32]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 mb-1.5">
                  Établissement universitaire
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={form.etablissement}
                  onChange={(e) => setForm({ ...form, etablissement: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/50 disabled:text-stone-700 focus:outline-none focus:border-[#A84F32]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 mb-1.5">
                Filière & Niveau d’études
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={form.filiere}
                onChange={(e) => setForm({ ...form, filiere: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm font-semibold text-stone-900 disabled:bg-[#F8F1E7]/50 disabled:text-stone-700 focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            {isEditing && (
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setForm({
                      fullName: student.fullName,
                      email: student.email,
                      phone: student.phone,
                      filiere: student.filiere,
                      etablissement: student.etablissement
                    });
                    setIsEditing(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#4C6749] hover:bg-[#3B5239] text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer les modifications
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
