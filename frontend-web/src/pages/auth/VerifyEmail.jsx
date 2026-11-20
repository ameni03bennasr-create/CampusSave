import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../../components/Button';
import { MailCheck } from 'lucide-react';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || 'votre adresse email';

  // Simulation du clic sur le lien de vérification reçu par mail
  const handleSimulateVerification = () => {
    alert("Email vérifié avec succès ! Vous pouvez maintenant vous connecter.");
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#E9C98B] shadow-sm text-center">
        <div className="w-20 h-20 bg-[#4C6749]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <MailCheck className="w-10 h-10 text-[#4C6749]" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-stone-800 mb-2">Vérifiez votre boîte mail</h2>
        <p className="text-stone-500 mb-8">
          Un lien de confirmation a été envoyé à <br/>
          <span className="font-bold text-stone-800">{email}</span>
        </p>

        <div className="space-y-4">
          {/* Bouton de simulation (à retirer quand Firebase sera connecté) */}
          <Button 
            onClick={handleSimulateVerification}
            className="w-full bg-[#A84F32] hover:bg-[#8f3f26] text-white py-3"
          >
            Simuler la vérification (Test)
          </Button>
          
          <p className="text-sm text-stone-500">
            Vous n'avez rien reçu ?{' '}
            <button className="font-bold text-[#D98245] hover:underline">
              Renvoyer l'email
            </button>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100">
          <Link to="/login" className="text-sm font-bold text-stone-500 hover:text-stone-800">
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;