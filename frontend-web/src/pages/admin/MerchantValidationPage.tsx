import { CheckCircle2, XCircle, Store, Search } from 'lucide-react';
import type { AdminWorkspace } from '@/hooks/useAdminWorkspace';
import { useState } from 'react';

export function AdminMerchantValidationPage({ ws }: { ws: AdminWorkspace }) {
  const { merchants, approveMerchant, rejectMerchant } = ws;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMerchants = merchants.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Validation des Commerçants</h1>
          <p className="text-sm text-stone-500 mt-1">Gérez les demandes d'inscription des restaurants et cafétérias.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
          <h2 className="font-bold text-stone-800 flex items-center gap-2">
            <Store className="w-5 h-5 text-[#A84F32]" /> Liste des établissements
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Rechercher un commerce..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm border border-stone-200 rounded-lg outline-none focus:border-[#A84F32]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider border-b border-stone-200">
                <th className="p-4 font-bold">Établissement</th>
                <th className="p-4 font-bold">Contact</th>
                <th className="p-4 font-bold">Type</th>
                <th className="p-4 font-bold">Statut</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredMerchants.map((merchant) => (
                <tr key={merchant.uid} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-stone-800">{merchant.name}</p>
                    <p className="text-xs text-stone-500">ID: {merchant.uid.substring(0, 8)}</p>
                  </td>
                  <td className="p-4 text-sm text-stone-600">
                    {merchant.email}
                  </td>
                  <td className="p-4 text-sm text-stone-600">
                    <span className="bg-stone-100 px-2 py-1 rounded text-xs font-bold">{merchant.type || 'Non spécifié'}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      merchant.status === 'approved' ? 'bg-[#4C6749]/10 text-[#4C6749]' :
                      merchant.status === 'pending' ? 'bg-[#D98245]/10 text-[#D98245]' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {merchant.status === 'approved' ? 'Approuvé' : merchant.status === 'pending' ? 'En attente' : 'Refusé'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {merchant.status === 'pending' ? (
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => approveMerchant(merchant.uid)}
                          className="p-2 bg-[#4C6749]/10 text-[#4C6749] hover:bg-[#4C6749] hover:text-white rounded-lg transition-colors"
                          title="Approuver"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => rejectMerchant(merchant.uid)}
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
    </div>
  );
}