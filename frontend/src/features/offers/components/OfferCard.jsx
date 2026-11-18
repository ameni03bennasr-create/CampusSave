import React from 'react';

const OfferCard = ({ offer, userRole, onEdit, onDelete, onView }) => {
  if (!offer) return null;

  return (
    <div className="offer-card">
      <img src={offer.imageUrl} alt={offer.title} className="offer-image" />
      <div className="offer-content">
        <div className="offer-header">
          <h3>{offer.title}</h3>
          {offer.isAvailable ? (
            <span className="badge badge-success">Disponible</span>
          ) : (
            <span className="badge badge-danger">Indisponible</span>
          )}
        </div>
        <p className="offer-description">{offer.description}</p>
        <p className="offer-category">Catégorie: {offer.category}</p>
        <div className="offer-pricing">
          <span className="price-original">{offer.initialPrice.toFixed(3)} DT</span>
          <span className="price-discounted">{offer.discountedPrice.toFixed(3)} DT</span>
        </div>
        <p className="offer-quantity">Quantité restante: {offer.quantity}</p>
        <p className="offer-pickup">Retrait: {offer.pickupTime}</p>

        <div className="offer-actions">
          {userRole === 'merchant' && (
            <>
              <button onClick={() => onEdit(offer.id)} className="btn btn-secondary">Modifier</button>
              <button onClick={() => onDelete(offer.id)} className="btn btn-danger">Supprimer</button>
            </>
          )}
          {userRole === 'student' && (
            <button onClick={() => onView(offer.id)} className="btn btn-primary" disabled={!offer.isAvailable}>
              Consulter l'offre
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;