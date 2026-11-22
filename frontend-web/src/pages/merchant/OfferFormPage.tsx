import { useState, useRef } from 'react';
import {
  ChevronLeft,
  Clock,
  Upload
} from 'lucide-react';
import { SafeImage } from '@/components/common/SafeImage';
import { calcDiscount, formatPrice } from '@/utils/format';
import type { MerchantOffer, OfferFormSubmission } from '@/types/merchant';
import type { ChangeEvent, FormEvent } from 'react';

// ============================================================================
// PAGES 06 & 07 – AJOUTER UNE OFFRE & MODIFIER UNE OFFRE
// ============================================================================
interface OfferFormPageProps {
  mode?: string;
  offersList?: MerchantOffer[];
  initialOffer?: MerchantOffer | null;
  onSelectOfferId?: (id: string) => void;
  onSubmit: (newOfferData: OfferFormSubmission) => void;
  onCancel: () => void;
}

export function OfferFormPage({
  mode = 'create',
  offersList = [],
  initialOffer = null,
  onSelectOfferId,
  onSubmit,
  onCancel
}: OfferFormPageProps) {
  const [form, setForm] = useState<OfferFormSubmission>(() =>
    mode === 'edit' && initialOffer
      ? { ...initialOffer }
      : {
          name: '',
          description: '',
          category: 'Plats chauds',
          photo: '',
          initialPrice: '',
          reducedPrice: '',
          quantity: '',
          pickupStart: '',
          pickupEnd: ''
        }
  );

  // Reload the form when another offer is selected for editing (adjust state while rendering).
  const [prevSource, setPrevSource] = useState({ mode, initialOffer });
  if (prevSource.mode !== mode || prevSource.initialOffer !== initialOffer) {
    setPrevSource({ mode, initialOffer });
    if (mode === 'edit' && initialOffer) {
      setForm({ ...initialOffer });
    }
  }

  const [errors, setErrors] = useState<Record<string, string>>({});
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, photo: String(reader.result) }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Le nom du produit est obligatoire.';
    if (!form.description.trim() || form.description.trim().length < 10) {
      errs.description = 'Veuillez fournir une description claire (min. 10 caractères).';
    }
    const initP = Number(form.initialPrice);
    const redP = Number(form.reducedPrice);
    const qty = Number(form.quantity);

    if (isNaN(initP) || initP <= 0) {
      errs.initialPrice = 'Le prix initial doit être supérieur à 0 DT.';
    }
    if (isNaN(redP) || redP <= 0) {
      errs.reducedPrice = 'Le prix réduit doit être supérieur à 0 DT.';
    } else if (redP >= initP) {
      errs.reducedPrice = 'Le prix réduit doit être strictement inférieur au prix initial.';
    }
    if (isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
      errs.quantity = 'Veuillez indiquer une quantité entière valide (0 ou plus).';
    }
    if (!form.pickupStart || !form.pickupEnd) {
      errs.pickup = 'Les heures de début et de fin de récupération sont obligatoires.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const discountPreview = calcDiscount(Number(form.initialPrice), Number(form.reducedPrice));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={onCancel}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-[#A84F32] mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à Mes offres
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {mode === 'create' ? 'Ajouter une nouvelle offre' : `Modifier l’offre (${form.id})`}
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            {mode === 'create'
              ? 'Publiez vos invendus alimentaires avec prix réduit, quantité et créneau de récupération.'
              : 'Mettez à jour les informations, les tarifs ou le stock disponible de cette offre.'}
          </p>
        </div>

        {/* Sélecteur rapide d'offre si l'utilisateur accède directement à Page 07 */}
        {mode === 'edit' && offersList.length > 0 && (
          <div className="bg-white px-4 py-2.5 rounded-2xl border border-[#E9C98B] flex items-center gap-2">
            <span className="text-xs font-bold text-stone-500">Offre sélectionnée :</span>
            <select
              value={form.id}
              onChange={(e) => onSelectOfferId?.(e.target.value)}
              className="text-xs font-extrabold text-[#A84F32] bg-transparent focus:outline-none"
            >
              {offersList.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.id} — {o.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Formulaire principal (7 colonnes) */}
        <form
          onSubmit={handleFormSubmit}
          className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#E9C98B]/60 shadow-2xs space-y-5"
        >
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Nom du produit *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nom du produit"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Description du produit *
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez la composition du plat ou du panier invendu..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
            />
            {errors.description && (
              <p className="text-xs text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Catégorie alimentaire *
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              >
                <option value="Plats chauds">Plats chauds</option>
                <option value="Sandwichs & Panini">Sandwichs & Panini</option>
                <option value="Pâtisserie & Viennoiserie">Pâtisserie & Viennoiserie</option>
                <option value="Salades & Bowls">Salades & Bowls</option>
                <option value="Boissons & Snacks">Boissons & Snacks</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Quantité disponible (portions) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              />
              {errors.quantity && <p className="text-xs text-red-600 mt-1">{errors.quantity}</p>}
            </div>
          </div>

          {/* Prix initial & Prix réduit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Prix initial (DT) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={form.initialPrice}
                onChange={(e) => setForm({ ...form, initialPrice: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              />
              {errors.initialPrice && (
                <p className="text-xs text-red-600 mt-1">{errors.initialPrice}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Prix réduit CampusSave (DT) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.5"
                value={form.reducedPrice}
                onChange={(e) => setForm({ ...form, reducedPrice: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              />
              {errors.reducedPrice && (
                <p className="text-xs text-red-600 mt-1">{errors.reducedPrice}</p>
              )}
            </div>
          </div>

          {/* Horaires de récupération */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Heure de début de récupération *
              </label>
              <input
                type="time"
                value={form.pickupStart}
                onChange={(e) => setForm({ ...form, pickupStart: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Heure de fin de récupération *
              </label>
              <input
                type="time"
                value={form.pickupEnd}
                onChange={(e) => setForm({ ...form, pickupEnd: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-[#F8F1E7]/40 focus:bg-white focus:outline-none focus:border-[#A84F32]"
              />
            </div>
          </div>
          {errors.pickup && <p className="text-xs text-red-600">{errors.pickup}</p>}

          {/* Upload photo produit */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-stone-700">
              Photo du produit *
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-[#F8F1E7] hover:bg-[#E9C98B]/50 border border-[#E9C98B] text-stone-800 text-xs font-bold inline-flex items-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#A84F32]" />
                Téléverser une photo
              </button>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

          </div>

          {/* Boutons d'action */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-[#A84F32] hover:bg-[#8E4128] text-white text-xs sm:text-sm font-bold shadow-md"
            >
              {mode === 'create' ? 'Publier l’offre' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>

        {/* Aperçu en direct côté étudiant (5 colonnes) */}
        <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-24">
          <span className="text-xs font-extrabold uppercase tracking-wider text-stone-400 block">
            Aperçu de la carte côté Étudiant
          </span>
          <div className="bg-white rounded-2xl border border-[#E9C98B]/70 overflow-hidden shadow-sm">
            <div className="relative h-48 bg-stone-100">
              <SafeImage
                src={form.photo}
                alt={form.name || 'Aperçu produit'}
                className="w-full h-full object-cover"
              />
              {discountPreview > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#A84F32] text-white text-xs font-extrabold">
                  -{discountPreview}%
                </span>
              )}
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 text-stone-900 text-xs font-bold">
                {form.quantity || 0} portion(s)
              </span>
            </div>
            <div className="p-5 space-y-3">
              <span className="text-xs font-bold text-[#D98245]">{form.category}</span>
              <h3 className="font-extrabold text-stone-900 text-base">
                {form.name || 'Nom de votre produit invendu'}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-2">
                {form.description || 'La description apparaîtra ici pour les étudiants de l’ESSECT.'}
              </p>
              <div className="text-xs text-stone-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4C6749]" />
                Retrait : {form.pickupStart || '--:--'} – {form.pickupEnd || '--:--'}
              </div>
              <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-400 line-through block">
                    {formatPrice(form.initialPrice || 0)}
                  </span>
                  <span className="text-xl font-extrabold text-[#4C6749]">
                    {formatPrice(form.reducedPrice || 0)}
                  </span>
                </div>
                <span className="px-3.5 py-2 rounded-xl bg-[#A84F32] text-white text-xs font-bold">
                  Réserver
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
