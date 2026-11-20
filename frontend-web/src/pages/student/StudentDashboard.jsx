import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';

// Import des modules de P5
import EcoPointsCard from '../../modules-p5/eco-points/EcoPointsCard';
import EcoImpactDashboard from '../../modules-p5/eco-impact/EcoImpactDashboard';
import EcoBadgesGrid from '../../modules-p5/eco-badges/EcoBadgesGrid';
import Countdown from '../../modules-p5/countdown/Countdown';
import SurpriseBasketCard from '../../modules-p5/countdown/SurpriseBasketCard';

const StudentDashboard = () => {
  const navigate = useNavigate();

  // Données temporaires pour le Countdown (dans 2 heures) et le Panier Surprise
  const mockTargetDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const mockBasket = {
    id: 'b1',
    titre: "Panier Surprise - Boulangerie",
    nomCommerce: "Pâtisserie Le Délice",
    description: "Assortiment de viennoiseries et pains invendus du jour.",
    prixInitial: 15.000,
    prixReduit: 5.000,
    quantiteDisponible: 3,
    horaireRecuperation: "18:00 - 19:30",
    dateExpiration: mockTargetDate
  };

  return (
    <MainLayout>
      {/* En-tête de bienvenue */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Espace Étudiant 🎓</h1>
          <p className="text-stone-500">Bienvenue sur votre tableau de bord. Découvrez vos avantages.</p>
        </div>
        <Button onClick={() => navigate('/profile')} className="bg-[#A84F32] hover:bg-[#8f3f26] text-white">
          Mon Profil
        </Button>
      </div>

      {/* Grille de widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* Widget EcoPoints (P5) */}
        <div className="col-span-1">
          <EcoPointsCard />
        </div>

        {/* Widget Surprise Basket (P5) - Nécessite les données mock */}
        <div className="col-span-1">
          <SurpriseBasketCard 
            basket={mockBasket} 
            onOrder={() => navigate('/explore')} 
          />
        </div>

        {/* Widget EcoImpact (P5) */}
        <div className="col-span-1">
          <EcoImpactDashboard />
        </div>

        {/* Widget EcoBadges (P5) - Prend toute la largeur sur mobile, 2 colonnes sur PC */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <EcoBadgesGrid />
        </div>

        {/* Bouton d'action rapide */}
        <div className="bg-[#F8F1E7] p-6 rounded-2xl border border-[#E9C98B] flex flex-col justify-center items-start h-full">
          <h3 className="font-bold text-stone-800 text-lg mb-2">Prêt à sauver des repas ?</h3>
          <p className="text-sm text-stone-500 mb-4">Consultez les invendus près de chez vous.</p>
          <Button onClick={() => navigate('/explore')} className="w-full bg-[#D98245] hover:bg-[#c0723a] text-white">
            Explorer les offres
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;