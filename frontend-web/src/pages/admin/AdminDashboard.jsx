import React, { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { mockMerchants } from '../../features/merchants/data/mockMerchants';
import { Users, Store, ShoppingBag, CheckCircle, XCircle, Search } from 'lucide-react';

const AdminDashboard = () => {
  // On initialise avec les données mock pour pouvoir les modifier en temps réel
  const [merchants, setMerchants] = useState(mockMerchants);
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour changer le statut d'un commerçant
  const handleStatusChange = (id, newStatus) => {
    setMerchants(prev => prev.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  // Filtrage de la recherche
  const filteredMerchants = merchants.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistiques rapides
  const totalMerchants = merchants.length;
  const pendingMerchants = merchants.filter(m => m.status === 'En attente').length;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Tableau de Bord - Admin 🛡️</h1>
        <p className="text-stone-500">Supervisez la plateforme et gérez les partenariats.</p>
      </div>

      {/* Cartes de Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-[#E9C98B] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-[#F8F1E7] rounded-xl flex items-center justify-center text-[#D98245]">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">Total Commerçants</p>
            <p className="text-2xl font-extrabold text-stone-800">{totalMerchants}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E9C98B] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center text-[#A84F32]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">Demandes en attente</p>
            <p className="text-2xl font-extrabold text-stone-800">{pendingMerchants}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E9C98B] shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-[#4C6749]/10 rounded-xl flex items-center justify-center text-[#4C6749]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-bold text-stone-500">Commandes totales</p>
            <p className="text-2xl font-extrabold text-stone-800">128</p>
          </div>
        </div>
      </div>

      {/* Gestion des commerçants */}
      <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-xl font-bold text-stone-800">Gestion des Commerçants</h2>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-xl outline-none focus:border-[#D98245]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">Commerçant</th>
                <th className="p-4 font-bold">Spécialité</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={merchant.logoUrl} alt="logo" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-stone-800">{merchant.name}</p>
                        <p className="text-xs text-stone-500">ID: {merchant.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-stone-600">{merchant.speciality}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      merchant.status === 'Approuvé' ? 'bg-[#4C6749]/10 text-[#4C6749]' :
                      merchant.status === 'En attente' ? 'bg-[#D98245]/10 text-[#D98245]' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {merchant.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {merchant.status === 'En attente' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleStatusChange(merchant.id, 'Approuvé')}
                          className="p-2 bg-[#4C6749]/10 text-[#4C6749] hover:bg-[#4C6749] hover:text-white rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(merchant.id, 'Refusé')}
                          className="p-2 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                          title="Refuser"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-stone-400 italic">Aucune action requise</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMerchants.length === 0 && (
            <div className="p-10 text-center text-stone-500">
              Aucun commerçant ne correspond à votre recherche.
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;