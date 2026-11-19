import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();
    if (email) setSent(true); // Simulation d'envoi
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-sand/60 shadow-lg">
        <Link to="/login" className="inline-flex items-center text-xs font-bold text-stone-500 hover:text-terracotta mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour
        </Link>

        <h1 className="text-2xl font-extrabold text-stone-900 mb-2">Réinitialisation</h1>
        <p className="text-sm text-stone-500 mb-6">Entrez votre e-mail pour recevoir un lien de récupération.</p>

        {sent ? (
          <div className="text-center p-6 bg-olive/10 rounded-2xl border border-olive/30">
            <CheckCircle2 className="w-10 h-10 text-olive mx-auto mb-2" />
            <h3 className="text-sm font-bold text-olive">E-mail envoyé !</h3>
            <p className="text-xs text-stone-600 mt-1">Vérifiez votre boîte de réception à l'adresse {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Votre e-mail" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-terracotta outline-none" />
            </div>
            <Button type="submit" className="w-full py-3.5">Envoyer le lien</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;