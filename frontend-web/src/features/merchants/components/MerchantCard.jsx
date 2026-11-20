import React from 'react';

const MerchantCard = ({ merchant }) => {
  if (!merchant) return null;

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approuvé':
        return 'bg-[#4C6749] text-white'; // Olive
      case 'En attente':
        return 'bg-[#D98245] text-white'; // Orange
      case 'Refusé':
        return 'bg-[#A84F32] text-white'; // Terracotta
      default:
        return 'bg-stone-500 text-white';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden flex flex-col w-full max-w-sm">
      {/* Image du logo */}
      <div className="h-40 w-full bg-[#F8F1E7] flex items-center justify-center overflow-hidden">
        <img 
          src={merchant.logoUrl} 
          alt={`${merchant.name} logo`} 
          className="w-full h-full object-cover" 
        />
      </div>
      
      {/* Informations */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-stone-800 leading-tight">{merchant.name}</h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-md ${getStatusStyle(merchant.status)}`}>
            {merchant.status}
          </span>
        </div>
        
        <p className="text-sm font-medium text-[#D98245] mb-2">{merchant.speciality}</p>
        <p className="text-sm text-stone-500 line-clamp-3">{merchant.description}</p>
      </div>
    </div>
  );
};

export default MerchantCard;