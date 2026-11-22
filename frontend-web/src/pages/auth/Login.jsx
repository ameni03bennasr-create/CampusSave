import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import logo from '../../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // La redirection sera gérée par l'AuthContext
      navigate('/'); 
        } catch (err) {
      console.error("ERREUR FIREBASE EXACTE :", err.code, err.message); // Ajoutez cette ligne
      setError("Email ou mot de passe incorrect.");
    } finally {
      setIsLoading(false);
    }};

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src={logo} alt="CampusSave" className="h-20 mx-auto mb-4 cursor-pointer" onClick={() => navigate('/')} />
        <h2 className="text-3xl font-extrabold text-[#4C6749]">Connexion</h2>
        <p className="mt-2 text-sm text-stone-500">Accédez à votre espace CampusSave</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[#E9C98B] sm:rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-sm font-bold">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-stone-700">Adresse Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                <input
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700">Mot de passe</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                <input
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-3 py-2.5 border border-stone-300 rounded-xl outline-none focus:border-[#A84F32]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-[#A84F32] focus:ring-[#A84F32] border-stone-300 rounded" />
                <label className="ml-2 block text-sm text-stone-600">Se souvenir de moi</label>
              </div>
              <Link to="/forgot-password" className="text-sm font-bold text-[#D98245] hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 ${isLoading ? 'bg-stone-400' : 'bg-[#4C6749] hover:bg-[#3d543a]'} text-white`}
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

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
    </div>
  );
};

export default Login;