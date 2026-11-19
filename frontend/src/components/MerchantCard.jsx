import React from 'react';
import Badge from './Badge';
import { Mail } from 'lucide-react';

const MerchantCard = ({ merchant }) => {
  const statusTypes = {
    'Approuvé': 'success',
    'En attente': 'warning',
    'Refusé': 'danger'
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-sand/60 shadow-sm flex flex-col items-center text-center">
      <img 
        src={merchant.logo} 
        alt={merchant.name} 
        className="w-20 h-20 rounded-full object-cover border-4 border-cream shadow-sm mb-3" 
      />
      <h3 className="font-extrabold text-stone-900 text-base">{merchant.name}</h3>
      <p className="text-xs font-bold text-orange mb-2">{merchant.specialty}</p>
      <p className="text-xs text-stone-500 line-clamp-3 mb-4">{merchant.description}</p>
      
      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-4">
        <Mail className="w-3.5 h-3.5" /> {merchant.email}
      </div>

      <div className="mt-auto">
        <Badge type={statusTypes[merchant.status]} label={merchant.status} />
      </div>
    </div>
  );
};

export default MerchantCard;