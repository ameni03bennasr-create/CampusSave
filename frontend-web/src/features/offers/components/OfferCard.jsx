import React from 'react';

const OfferCard = ({ offer, userRole, onEdit, onDelete, onView }) => {
  if (!offer) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden flex flex-col w-full max-w-sm transition-transform hover:shadow-md">
      {/* Image de l'offre */}
      <div className="h-48 w-full relative">
        <img 
          src={offer.imageUrl} 
          alt={offer.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 right-3">
          {offer.isAvailable ? (
            <span className="bg-[#4C6749] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Disponible
            </span>
          ) : (
            <span className="bg-[#A84F32] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              Indisponible
            </span>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-stone-800 mb-1">{offer.title}</h3>
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
          {offer.category}
        </span>
        
        <p className="text-sm text-stone-600 mb-4 line-clamp-2">{offer.description}</p>
        
        {/* Prix */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-sm text-stone-400 line-through">
            {offer.initialPrice.toFixed(3)} DT
          </span>
          <span className="text-2xl font-extrabold text-[#A84F32]">
            {offer.discountedPrice.toFixed(3)} DT
          </span>
        </div>
        
        {/* Détails (Quantité & Retrait) */}
        <div className="text-sm text-stone-600 space-y-1 mb-5">
          <p><span className="font-semibold text-stone-800">Quantité :</span> {offer.quantity}</p>
          <p><span className="font-semibold text-stone-800">Retrait :</span> {offer.pickupTime}</p>
        </div>

        {/* Boutons d'action */}
        <div className="mt-auto pt-4 border-t border-stone-100 flex gap-3">
          {userRole === 'merchant' && (
            <>
              <button 
                onClick={() => onEdit(offer.id)} 
                className="flex-1 bg-[#D98245] hover:bg-[#c0723a] text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                Modifier
              </button>
              <button 
                onClick={() => onDelete(offer.id)} 
                className="flex-1 bg-[#A84F32] hover:bg-[#8f3f26] text-white font-bold py-2 px-4 rounded-xl transition-colors"
              >
                Supprimer
              </button>
            </>
          )}
          
          {userRole === 'student' && (
            <button 
              onClick={() => onView(offer.id)} 
              disabled={!offer.isAvailable}
              className={`w-full font-bold py-2 px-4 rounded-xl transition-colors text-white 
                ${offer.isAvailable 
                  ? 'bg-[#4C6749] hover:bg-[#3d543a]' 
                  : 'bg-stone-300 cursor-not-allowed'}`}
            >
              {offer.isAvailable ? "Consulter l'offre" : "Indisponible"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferCard;