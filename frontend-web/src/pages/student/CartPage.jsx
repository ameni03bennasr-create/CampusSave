import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { useCart } from '../../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-20 bg-white rounded-3xl border border-[#E9C98B]">
          <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Votre panier est vide</h2>
          <p className="text-stone-500 mb-6">Découvrez nos offres et faites de bonnes affaires !</p>
          <Button onClick={() => navigate('/explore')} className="bg-[#D98245] hover:bg-[#c0723a] text-white">
            Voir les offres
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 className="text-3xl font-extrabold text-stone-800 mb-8">Mon Panier 🛒</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Liste des articles */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#E9C98B] shadow-sm flex items-center gap-4">
              <img src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover rounded-xl" />
              
              <div className="flex-grow">
                <h3 className="font-bold text-stone-800">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.category}</p>
                <p className="font-bold text-[#A84F32] mt-1">{item.discountedPrice.toFixed(3)} DT</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button onClick={() => removeFromCart(item.id)} className="text-stone-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden text-sm">
                  <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="px-2 py-1 bg-stone-50 hover:bg-stone-100">-</button>
                  <span className="px-3 py-1 font-bold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, Math.min(item.quantity + 1, item.quantity + 10))} className="px-2 py-1 bg-stone-50 hover:bg-stone-100">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-2xl border border-[#E9C98B] shadow-sm sticky top-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Résumé</h2>
            <div className="space-y-3 mb-6 border-b border-stone-100 pb-4">
              <div className="flex justify-between text-stone-600">
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Frais de service</span>
                <span className="text-[#4C6749]">Gratuit</span>
              </div>
            </div>
            <div className="flex justify-between font-extrabold text-lg text-stone-800 mb-6">
              <span>Total</span>
              <span className="text-[#A84F32]">{getCartTotal().toFixed(3)} DT</span>
            </div>
            
            <Button 
              onClick={() => navigate('/checkout')} 
              className="w-full bg-[#4C6749] hover:bg-[#3d543a] text-white flex justify-center items-center gap-2 py-3"
            >
              Passer la commande <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CartPage;