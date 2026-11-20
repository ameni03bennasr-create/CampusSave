import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { mockOrders } from '../../features/orders/data/mockOrders';
import { QRCodeSVG } from 'qrcode.react';
import { Package, Clock, CheckCircle, ChevronRight, X } from 'lucide-react';

const OrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Prête': return <span className="bg-[#D98245] text-white px-3 py-1 rounded-full text-xs font-bold">Prête à récupérer</span>;
      case 'Récupérée': return <span className="bg-[#4C6749] text-white px-3 py-1 rounded-full text-xs font-bold">Récupérée</span>;
      default: return <span className="bg-stone-400 text-white px-3 py-1 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-extrabold text-stone-800 mb-8">Mes Commandes 📦</h1>

      <div className="space-y-4 max-w-4xl">
        {mockOrders.map((order) => (
          <div key={order.id} className="bg-white p-5 rounded-2xl border border-[#E9C98B] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#F8F1E7] rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-[#D98245]" />
              </div>
              <div>
                <p className="font-bold text-stone-800 text-lg">{order.id}</p>
                <p className="text-sm text-stone-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {order.date}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <p className="font-extrabold text-[#A84F32]">{order.total.toFixed(3)} DT</p>
                <div className="mt-1">{getStatusBadge(order.status)}</div>
              </div>
              <Button 
                onClick={() => setSelectedOrder(order)} 
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 flex items-center gap-2"
              >
                Détails <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modale de détails de commande avec QR Code */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md relative shadow-2xl">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-800">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-extrabold text-stone-800 mb-1">Commande {selectedOrder.id}</h2>
            <p className="text-sm text-stone-500 mb-6">Passée le {selectedOrder.date}</p>

            {/* QR CODE */}
            {selectedOrder.status === 'Prête' && (
              <div className="bg-[#F8F1E7] p-6 rounded-2xl flex flex-col items-center justify-center mb-6 border border-[#E9C98B]">
                <p className="text-sm font-bold text-stone-700 mb-4 text-center">Présentez ce QR Code au commerçant</p>
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <QRCodeSVG value={selectedOrder.qrCodeValue} size={150} />
                </div>
              </div>
            )}

            {selectedOrder.status === 'Récupérée' && (
              <div className="bg-[#4C6749]/10 p-4 rounded-xl flex items-center gap-3 mb-6 text-[#4C6749]">
                <CheckCircle className="w-6 h-6" />
                <p className="font-bold text-sm">Commande récupérée avec succès.</p>
              </div>
            )}

            <h3 className="font-bold text-stone-800 mb-3 border-b border-stone-100 pb-2">Détails des articles</h3>
            <ul className="space-y-3 mb-6">
              {selectedOrder.items.map((item, idx) => (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-stone-600">{item.quantity}x {item.title}</span>
                  <span className="font-bold text-stone-800">{(item.price * item.quantity).toFixed(3)} DT</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-between font-extrabold text-lg text-stone-800 border-t border-stone-100 pt-4">
              <span>Total</span>
              <span className="text-[#A84F32]">{selectedOrder.total.toFixed(3)} DT</span>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default OrdersPage;