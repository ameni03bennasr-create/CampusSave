import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { mockOffers } from '../../features/offers/data/mockOffers';
import { ArrowLeft, Clock, Tag, ShieldCheck } from 'lucide-react';

const OfferDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  
  // Récupération de l'offre (simulation avec les données mock)
  const offer = mockOffers.find(o => o.id === id);

  if (!offer) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-stone-800">Offre introuvable</h2>
          <Button onClick={() => navigate('/explore')} className="mt-4">Retour au catalogue</Button>
        </div>
      </MainLayout>
    );
  }

  const handleAddToCart = () => {
    // Logique du panier à venir dans la prochaine étape
    alert(`${quantity} x ${offer.title} ajouté au panier !`);
  };

  return (
    <MainLayout>
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center text-stone-500 hover:text-[#A84F32] mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Retour aux offres
      </button>

      <div className="bg-white rounded-3xl border border-[#E9C98B] shadow-sm overflow-hidden flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-1/2 h-64 md:h-auto relative">
          <img src={offer.imageUrl} alt={offer.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
             <span className="bg-[#4C6749] text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
               -{Math.round((1 - offer.discountedPrice / offer.initialPrice) * 100)}%
             </span>
          </div>
        </div>

        {/* Détails */}
        <div className="md:w-1/2 p-8 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-[#D98245]" />
            <span className="text-sm font-bold text-[#D98245] uppercase tracking-wider">{offer.category}</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-stone-800 mb-4">{offer.title}</h1>
          <p className="text-stone-600 mb-6 leading-relaxed">{offer.description}</p>
          
          <div className="bg-[#F8F1E7] p-4 rounded-xl mb-6 space-y-3">
            <div className="flex items-center gap-3 text-stone-700">
              <Clock className="w-5 h-5 text-[#A84F32]" />
              <span>Retrait : <strong>{offer.pickupTime}</strong></span>
            </div>
            <div className="flex items-center gap-3 text-stone-700">
              <ShieldCheck className="w-5 h-5 text-[#4C6749]" />
              <span>Quantité restante : <strong>{offer.quantity}</strong></span>
            </div>
          </div>

          <div className="mt-auto border-t border-stone-100 pt-6">
            <div className="flex items-end gap-3 mb-6">
              <span className="text-stone-400 line-through text-lg">{offer.initialPrice.toFixed(3)} DT</span>
              <span className="text-4xl font-extrabold text-[#A84F32]">{offer.discountedPrice.toFixed(3)} DT</span>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold">-</button>
                <span className="px-4 font-bold text-stone-800">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(offer.quantity, quantity + 1))} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold">+</button>
              </div>
              <Button onClick={handleAddToCart} className="flex-grow bg-[#4C6749] hover:bg-[#3d543a] text-white">
                Ajouter au panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OfferDetails;