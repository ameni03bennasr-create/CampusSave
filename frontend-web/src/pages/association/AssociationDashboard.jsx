import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import { Users, GraduationCap, Calendar, Plus, FileText } from 'lucide-react';

const AssociationDashboard = () => {
  const navigate = useNavigate();

  // Simulation des demandes groupées du club
  const mockGroupRequests = [
    { id: 'REQ-001', event: 'Assemblée Générale', date: '2026-11-25', quantity: 20, status: 'En attente' },
    { id: 'REQ-002', event: 'Réunion Bureau', date: '2026-11-28', quantity: 10, status: 'Confirmée' },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Espace Association 🏛️</h1>
          <p className="text-stone-500">Gérez les achats de votre club et vos événements.</p>
        </div>
        <Button 
          onClick={() => navigate('/profile')} 
          className="bg-[#A84F32] hover:bg-[#8f3f26] text-white"
        >
          Profil du Club
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Carte d'identité du Club */}
        <div className="bg-white p-6 rounded-2xl border border-[#E9C98B] shadow-sm col-span-1 md:col-span-2 flex items-center gap-6">
          <div className="w-20 h-20 bg-[#F8F1E7] rounded-2xl flex items-center justify-center text-[#4C6749] flex-shrink-0">
            <Users className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-800">Club Informatique ESSECT</h2>
            <p className="text-sm text-stone-500 flex items-center gap-2 mt-1">
              <GraduationCap className="w-4 h-4" /> Université de Tunis
            </p>
            <div className="mt-3 flex gap-4 text-sm font-bold">
              <span className="text-[#D98245] bg-[#D98245]/10 px-2 py-1 rounded">45 Membres</span>
              <span className="text-[#4C6749] bg-[#4C6749]/10 px-2 py-1 rounded">EcoPoints : 1200</span>
            </div>
          </div>
        </div>

        {/* Action rapide */}
        <div className="bg-[#F8F1E7] p-6 rounded-2xl border border-[#E9C98B] shadow-sm flex flex-col justify-center">
          <h3 className="font-bold text-stone-800 text-lg mb-2">Commander pour un événement</h3>
          <p className="text-sm text-stone-500 mb-4">Parcourez le catalogue et faites une demande de devis groupé.</p>
          <Button onClick={() => navigate('/explore')} className="w-full bg-[#D98245] hover:bg-[#c0723a] text-white">
            Explorer les offres
          </Button>
        </div>
      </div>

      {/* Tableau des demandes groupées */}
      <div className="bg-white rounded-2xl border border-[#E9C98B] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#A84F32]" /> Suivi des Demandes Groupées
          </h2>
          <Button className="bg-[#4C6749] hover:bg-[#3d543a] text-white text-sm py-1.5 px-3 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Nouvelle demande
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">ID Demande</th>
                <th className="p-4 font-bold">Événement</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Quantité</th>
                <th className="p-4 font-bold">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {mockGroupRequests.map((req) => (
                <tr key={req.id} className="hover:bg-stone-50 transition-colors">
                  <td className="p-4 font-bold text-stone-800">{req.id}</td>
                  <td className="p-4 text-sm text-stone-600">{req.event}</td>
                  <td className="p-4 text-sm text-stone-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-stone-400" /> {req.date}
                  </td>
                  <td className="p-4 text-sm font-bold text-[#A84F32]">{req.quantity} paniers</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Confirmée' ? 'bg-[#4C6749]/10 text-[#4C6749]' : 'bg-[#D98245]/10 text-[#D98245]'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssociationDashboard;