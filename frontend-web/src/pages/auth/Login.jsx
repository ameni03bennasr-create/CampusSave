import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    // Vraie connexion Firebase
    await login(email, password); 
    
    // La redirection sera gérée par Firebase, mais vous pouvez forcer 
    // une redirection selon le rôle si besoin via navigate()
    navigate('/'); 
  } catch (err) {
    setError("Email ou mot de passe incorrect.");
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};
 


  return (
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-sand/60 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-terracotta text-white rounded-xl flex items-center justify-center font-extrabold text-xl mx-auto mb-3">CS</div>
          <h1 className="text-2xl font-extrabold text-stone-900">Connexion</h1>
          <p className="text-sm text-stone-500 mt-1">Accédez à votre espace CampusSave</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-terracotta outline-none" />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-sm focus:border-terracotta outline-none" />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-xs font-bold text-orange hover:text-terracotta">Mot de passe oublié ?</Link>
          </div>

          <Button type="submit" className="w-full py-3.5 mt-2">Se connecter</Button>
        </form>
        {/* Juste en dessous du formulaire de connexion, ajoutez ceci */}
<div className="mt-6 text-center">
  <p className="text-sm text-stone-600">
    Pas encore de compte ?{' '}
    <Link to="/register" className="font-bold text-[#A84F32] hover:underline">
      S'inscrire
    </Link>
  </p>
</div>
      </div>
    </div>
  );
};

export default Login;