import { useCart } from '@/context/CartContext';
import { Button } from '@/components/Button';
import { formatPrice } from '@/utils/format';
import { ShoppingCart, Search } from 'lucide-react';
import { useState } from 'react';
import type { AssociationWorkspace } from '@/hooks/useAssociationWorkspace';

interface ExploreOffer {
  id: string;
  title: string;
  category: string;
  image: string;
  initialPrice: number;
  reducedPrice: number;
  quantity: number;
  restaurantId: string;
}

export function AssociationExplorePage({ ws }: { ws: AssociationWorkspace }) {
  const { offers, restaurants, navigateTo } = ws;
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOffers = (offers as ExploreOffer[]).filter((o) => o.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddToCart = (offer: ExploreOffer) => {
    const cartOffer = {
      id: offer.id, title: offer.title, category: offer.category, imageUrl: offer.image,
      initialPrice: offer.initialPrice, discountedPrice: offer.reducedPrice, quantity: offer.quantity,
    };
    addToCart(cartOffer, 1);
    navigateTo('cart');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Catalogue pour le Club</h1>
        <p className="text-sm text-stone-500 mt-1">Sélectionnez des offres pour vos événements.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
        <input 
          type="text" 
          placeholder="Rechercher un produit..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 focus:border-[#A84F32] outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer: ExploreOffer) => {
          const rest = restaurants.find((r) => r.id === offer.restaurantId);
          return (
            <div key={offer.id} className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden flex flex-col">
              <img src={offer.image} alt={offer.title} className="w-full h-40 object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <span className="text-xs font-bold text-[#D98245]">{rest?.name}</span>
                <h3 className="font-bold text-stone-900 mt-1">{offer.title}</h3>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-[#4C6749]">{formatPrice(offer.reducedPrice)}</span>
                  <span className="text-xs text-stone-400 line-through">{formatPrice(offer.initialPrice)}</span>
                </div>
                <div className="pt-4 border-t border-stone-100 flex gap-2 mt-auto">
                  <Button onClick={() => handleAddToCart(offer)} className="flex-1 bg-[#4C6749] text-white flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Ajouter
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}