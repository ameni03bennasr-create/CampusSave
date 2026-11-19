import React from 'react';
import { Clock, MapPin, Edit3, Trash2, Eye } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';

const OfferCard = ({ offer, role, onView, onEdit, onDelete }) => {
  const discount = Math.round(((offer.originalPrice - offer.price) / offer.originalPrice) * 100);

  return (
    <div className="bg-white rounded-2xl border border-sand/60 shadow-sm overflow-hidden flex flex-col">
      {/* Image & Badges */}
      <div className="relative h-44 bg-stone-100">
        <img src={offer.image} alt={offer.title} className="w-full h-full object-cover" />
        
        {offer.isAvailable ? (
          <div className="absolute top-3 left-3">
            <Badge type="available" label={`-${discount}%`} />
          </div>
        ) : (
          <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
            <Badge type="soldout" label="Épuisé" />
          </div>
        )}
        
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-stone-800">
          {offer.category}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs font-bold text-orange mb-1">{offer.merchantName}</p>
          <h3 className="font-extrabold text-stone-900 text-sm line-clamp-2 leading-tight">
            {offer.title}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2">{offer.description}</p>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-olive">{offer.price.toFixed(2)} DT</span>
            <span className="text-xs text-stone-400 line-through">{offer.originalPrice.toFixed(2)} DT</span>
          </div>

          {/* Actions selon le rôle */}
          {role === 'commercant' ? (
            <div className="flex gap-2">
              <Button variant="ghost" className="flex-1 bg-cream py-2" onClick={() => onEdit(offer)}>
                <Edit3 className="w-4 h-4" /> Modifier
              </Button>
              <Button variant="danger" className="flex-1 py-2" onClick={() => onDelete(offer)}>
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
            </div>
          ) : (
            <Button className="w-full py-2.5" onClick={() => onView(offer)} disabled={!offer.isAvailable}>
              <Eye className="w-4 h-4" /> Consulter l'offre
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;