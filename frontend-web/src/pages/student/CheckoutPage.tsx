import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/Button';
import { CheckCircle2, CreditCard } from 'lucide-react';
import type { StudentPageId } from '@/config/studentPages';
interface CheckoutPageProps {
  onNavigate: (page: StudentPageId) => void;
}

const CheckoutPage = ({ onNavigate }: CheckoutPageProps) => {
  const { getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 bg-white rounded-3xl border border-[#E9C98B] shadow-sm mt-10">
        <CheckCircle2 className="w-20 h-20 text-[#4C6749] mx-auto mb-6" />
        <h1 className="text-3xl font-extrabold text-stone-800 mb-4">Commande Confirmée !</h1>
        <p className="text-stone-600 mb-8">
          Merci pour votre achat. Votre commande est prête.
        </p>
        <Button variant="secondary" onClick={() => onNavigate('orders')}>
          Voir mes commandes
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-extrabold text-stone-800 mb-8 text-center">Paiement</h1>
      
      <div className="bg-white p-8 rounded-3xl border border-[#E9C98B] shadow-sm">
        <div className="flex items-center justify-between border-b border-stone-100 pb-6 mb-6">
          <div>
            <p className="text-sm text-stone-500">Total à payer</p>
            <p className="text-3xl font-extrabold text-[#A84F32]">{getCartTotal().toFixed(3)} DT</p>
          </div>
          <CreditCard className="w-10 h-10 text-stone-300" />
        </div>

        <div className="space-y-4 mb-8">
          <div className="p-4 border border-stone-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-[#D98245] transition-colors">
            <span className="font-bold text-stone-700">Carte Bancaire (Konnect)</span>
            <div className="w-4 h-4 rounded-full border-2 border-[#D98245] bg-[#D98245]"></div>
          </div>
          <div className="p-4 border border-stone-200 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed">
            <span className="font-bold text-stone-700">Paiement à la livraison</span>
            <div className="w-4 h-4 rounded-full border-2 border-stone-300"></div>
          </div>
        </div>

        <Button 
          onClick={handlePayment} 
          disabled={isProcessing}
          className={`w-full py-4 text-lg ${isProcessing ? 'bg-stone-400' : ''}`}
        >
          {isProcessing ? 'Traitement en cours...' : 'Payer maintenant'}
        </Button>
      </div>
    </div>
  );
};

export default CheckoutPage;