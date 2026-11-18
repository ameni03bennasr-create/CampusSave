import React from 'react';

const MerchantCard = ({ merchant }) => {
  if (!merchant) return null;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approuvé':
        return 'badge-success';
      case 'En attente':
        return 'badge-warning';
      case 'Refusé':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div className="merchant-card">
      <img src={merchant.logoUrl} alt={`${merchant.name} logo`} className="merchant-logo" />
      <div className="merchant-info">
        <h3>{merchant.name}</h3>
        <p className="merchant-speciality">{merchant.speciality}</p>
        <p className="merchant-description">{merchant.description}</p>
        <span className={`badge ${getStatusClass(merchant.status)}`}>
          {merchant.status}
        </span>
      </div>
    </div>
  );
};

export default MerchantCard;