import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import OfferCard from '../../components/OfferCard';
import MerchantCard from '../../components/MerchantCard';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { MOCK_OFFERS, MOCK_MERCHANTS } from '../../data/mockData';
import { Loader2 } from 'lucide-react';

const ComponentsDemo = () => {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [formData, setFormData] = useState({ name: '', specialty: '' });
  const [errors, setErrors] = useState({});

  // Simulation de chargement API
  useEffect(() => {
    setTimeout(() => {
      setOffers(MOCK_OFFERS);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire.";
    if (!formData.specialty.trim()) newErrors.specialty = "La spécialité est obligatoire.";
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      alert("Formulaire valide ! Prêt pour l'API.");
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-extrabold mb-6">Démo Composants (G3)</h1>

      {/* État de chargement */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-terracotta animate-spin" />
          <span className="ml-2 text-stone-500 font-bold">Chargement des offres...</span>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* Section Cartes Offres */}
          <section>
            <h2 className="text-lg font-bold mb-4">Cartes Offres (Rôle : Étudiant)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map(offer => (
                <OfferCard 
                  key={offer.id} 
                  offer={offer} 
                  role="etudiant" 
                  onView={(o) => alert(`Voir l'offre: ${o.title}`)} 
                />
              ))}
            </div>
          </section>

          {/* Section Cartes Commerçants */}
          <section>
            <h2 className="text-lg font-bold mb-4">Cartes Commerçants (Statuts)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MOCK_MERCHANTS.map(m => (
                <MerchantCard key={m.id} merchant={m} />
              ))}
            </div>
          </section>

          {/* Section Formulaire avec validation */}
          <section className="max-w-md">
            <h2 className="text-lg font-bold mb-4">Formulaire Commerçant (Validation)</h2>
            <form onSubmit={handleFormSubmit} className="bg-white p-5 rounded-2xl border border-sand shadow-sm">
              <FormInput 
                label="Nom de l'établissement" 
                name="name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                error={errors.name}
                required
              />
              <FormInput 
                label="Spécialité" 
                name="specialty" 
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                error={errors.specialty}
                required
              />
              <Button type="submit" className="w-full">Valider</Button>
            </form>
          </section>

        </div>
      )}
    </MainLayout>
  );
};

export default ComponentsDemo;