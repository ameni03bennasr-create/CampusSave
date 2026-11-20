import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import OfferFormFields from '../../features/offers/components/OfferFormFields';
import { validateOffer } from '../../features/offers/utils/validateOffer';
import { mockOffers } from '../../features/offers/data/mockOffers';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const OfferFormPage = () => {
  const { id } = useParams(); // Si un ID est présent dans l'URL, c'est une modification
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // État initial du formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    initialPrice: '',
    discountedPrice: '',
    category: '',
    quantity: '',
    pickupTime: '',
    imageUrl: '',
    isAvailable: true
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Si on est en mode modification, on charge les données de l'offre
  useEffect(() => {
    if (isEditMode) {
      const offerToEdit = mockOffers.find(o => o.id === id);
      if (offerToEdit) {
        setFormData(offerToEdit);
      } else {
        alert("Offre introuvable");
        navigate('/commercant');
      }
    }
  }, [id, isEditMode, navigate]);

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // On efface l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const validationErrors = validateOffer(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Remonter pour voir les erreurs
      return;
    }

    // Simulation de l'appel API (à remplacer par la vraie API plus tard)
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Offre ${isEditMode ? 'modifiée' : 'créée'} avec succès !`);
      navigate('/commercant');
    }, 1500);
  };

  return (
    <MainLayout>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-stone-500 hover:text-[#A84F32] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Retour au tableau de bord
      </button>

      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E9C98B] shadow-sm p-8">
        <h1 className="text-2xl font-extrabold text-stone-800 mb-2">
          {isEditMode ? 'Modifier l\'offre' : 'Créer une nouvelle offre'}
        </h1>
        <p className="text-stone-500 mb-8">Remplissez les informations ci-dessous pour publier vos invendus.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* On utilise le composant réutilisable créé dans G3 */}
          <OfferFormFields 
            formData={formData} 
            errors={errors} 
            onChange={handleChange} 
          />

          <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
            <Button 
              type="button" 
              onClick={() => navigate('/commercant')} 
              className="bg-stone-200 hover:bg-stone-300 text-stone-800"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className={`flex items-center gap-2 ${isLoading ? 'bg-stone-400' : 'bg-[#4C6749] hover:bg-[#3d543a]'} text-white`}
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
              ) : (
                <><Save className="w-5 h-5" /> {isEditMode ? 'Enregistrer les modifications' : 'Créer l\'offre'}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default OfferFormPage;