import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col items-center justify-center p-4">
      <div className="bg-white p-10 rounded-3xl border border-[#E9C98B] shadow-sm max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-stone-800 mb-2">Accès Refusé 🚫</h1>
        <p className="text-stone-500 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        
        <Button 
          onClick={() => navigate('/')} 
          className="w-full bg-[#A84F32] hover:bg-[#8f3f26] text-white py-3"
        >
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;