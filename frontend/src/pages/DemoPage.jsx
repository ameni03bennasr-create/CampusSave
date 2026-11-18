import React, { useState } from 'react';
import MerchantCard from '../features/merchants/components/MerchantCard';
import OfferCard from '../features/offers/components/OfferCard';
import { mockMerchants } from '../features/merchants/data/mockMerchants';
import { mockOffers } from '../features/offers/data/mockOffers';

const DemoPage = () => {
  const [loading, setLoading] = useState(false);
  const userRole = 'merchant'; // Changez en 'student' pour tester l'autre vue

  const handleEditOffer = (id) => {
    alert(`Modifier l'offre ${id} (à connecter à l'API plus tard)`);
  };
  const handleDeleteOffer = (id) => {
    alert(`Supprimer l'offre ${id} (à connecter à l'API plus tard)`);
  };
  const handleViewOffer = (id) => {
    alert(`Consulter l'offre ${id} (à connecter à l'API plus tard)`);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Démo - Gestion des Commerçants et Offres</h1>

      <h2>Liste des Commerçants</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {mockMerchants.map((merchant) => (
          <MerchantCard key={merchant.id} merchant={merchant} />
        ))}
      </div>

      <h2>Liste des Offres (Vue {userRole === 'merchant' ? 'Commerçant' : 'Étudiant'})</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {mockOffers.length === 0 ? (
          <p>Aucune offre disponible pour le moment.</p>
        ) : (
          mockOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              userRole={userRole}
              onEdit={handleEditOffer}
              onDelete={handleDeleteOffer}
              onView={handleViewOffer}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DemoPage;