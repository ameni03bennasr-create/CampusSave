import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { mockOrders } from '../../features/orders/data/mockOrders';
import { QrCode, CheckCircle, Package, X, Search } from 'lucide-react';

const MerchantOrdersPage = () => {
  // On utilise les mêmes commandes mock pour la simulation
  const [orders, setOrders] = useState(mockOrders);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [validationCode, setValidationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fonction pour valider le code QR
  const handleValidateQR = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // On cherche une commande qui correspond au code ET qui est "Prête"
    const orderToValidate = orders.find(
      o => o.qrCodeValue === validationCode.trim() && o.status === 'Prête'
    );

    if (orderToValidate) {
      // Mise à jour du statut de la commande
      setOrders(prev => prev.map(o => 
        o.id === orderToValidate.id ? { ...o, status: 'Récupérée' } : o
      ));
      setSuccessMessage(`Commande ${orderToValidate.id} validée avec succès !`);
      setValidationCode('');
      
      // On ferme la modale après 2 secondes
      setTimeout(() => {
        setIsScannerOpen(false);
        setSuccessMessage('');
      }, 2000);
    } else {
      setError("Code invalide ou commande déjà récupérée.");
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Commandes Reçues 🛍️</h1>
          <p className="text-stone-500">Gérez les commandes de vos clients et validez les retraits.</p>
        </div>
        <Button 
          onClick={() => setIsScannerOpen(true)}
          className="bg-[#4C6749] hover:bg-[#3d543a] text-white flex items-center gap-2"
        >
          <QrCode className="w-5 h-5" /> Scanner un QR Code
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-800">Liste des commandes</h2>
        </div>
        
        <div className="divide-y divide-stone-100">
          {orders.map((order) => (
            <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${order.status === 'Récupérée' ? 'bg-[#4C6749]/10 text-[#4C6749]' : 'bg-[#D98245]/10 text-[#D98245]'}`}>
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-lg">{order.id}</p>
                  <p className="text-sm text-stone-500">{order.items.length} article(s) • {order.total.toFixed(3)} DT</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  order.status === 'Récupérée' ? 'bg-[#4C6749] text-white' : 'bg-[#D98245] text-white'
                }`}>
                  {order.status === 'Récupérée' ? 'Récupérée' : 'En attente de retrait'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modale de Scan QR */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-2xl text-center">
            <button onClick={() => { setIsScannerOpen(false); setError(''); setValidationCode(''); }} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800">
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-20 h-20 bg-[#F8F1E7] rounded-full flex items-center justify-center mx-auto mb-6">
              <QrCode className="w-10 h-10 text-[#A84F32]" />
            </div>
            
            <h2 className="text-2xl font-extrabold text-stone-800 mb-2">Validation de Retrait</h2>
            <p className="text-stone-500 mb-6 text-sm">
              Saisissez le code situé sous le QR Code de l'étudiant pour valider la remise du panier.
            </p>

            <form onSubmit={handleValidateQR} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-stone-400" />
                <input 
                  type="text" 
                  placeholder="Ex: CMD-1029-VALIDATION-XYZ"
                  value={validationCode}
                  onChange={(e) => setValidationCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32] text-center font-mono font-bold"
                />
              </div>

              {error && <p className="text-red-500 text-sm font-bold bg-red-50 py-2 rounded-lg">{error}</p>}
              {successMessage && (
                <p className="text-[#4C6749] text-sm font-bold bg-[#4C6749]/10 py-2 rounded-lg flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4"/> {successMessage}
                </p>
              )}

              <Button type="submit" className="w-full bg-[#4C6749] hover:bg-[#3d543a] text-white py-3">
                Valider la commande
              </Button>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default MerchantOrdersPage;