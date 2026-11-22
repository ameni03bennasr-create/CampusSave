import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { Mail, Lock, User, Store, GraduationCap, Users } from 'lucide-react'; // Ajout de Users
import logo from '../../assets/logo.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';  


const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'etudiant' 
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsLoading(true);
  try {
    // 1. Créer l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    
    // 2. Enregistrer ses infos (rôle, nom) dans Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString()
    });

    navigate('/verify-email', { state: { email: formData.email } });
  } catch (err) {
    setErrors({ email: "Cet email est déjà utilisé ou une erreur est survenue." });
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

  function handleRoleSelect(role) {
    setFormData(prev => ({ ...prev, role }));
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom est obligatoire.";
    if (!formData.email.includes('@')) newErrors.email = "L'adresse email est invalide.";
    if (formData.password.length < 6) newErrors.password = "Le mot de passe doit faire au moins 6 caractères.";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    return newErrors;
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <img src={logo} alt="CampusSave" className="h-20 mx-auto mb-4" />
        <h2 className="text-3xl font-extrabold text-[#4C6749]">Créer un compte</h2>
        <p className="mt-2 text-sm text-stone-500">Rejoignez la communauté anti-gaspillage</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[#E9C98B] sm:rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Choix du rôle (3 boutons) */}
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-2">Je suis un :</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('etudiant')}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all ${
                    formData.role === 'etudiant' 
                      ? 'border-[#4C6749] bg-[#4C6749]/10 text-[#4C6749]' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <GraduationCap className="w-5 h-5 mb-1" />
                  <span className="font-bold text-xs">Étudiant</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('commercant')}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all ${
                    formData.role === 'commercant' 
                      ? 'border-[#D98245] bg-[#D98245]/10 text-[#D98245]' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <Store className="w-5 h-5 mb-1" />
                  <span className="font-bold text-xs">Commerçant</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('association')}
                  className={`flex flex-col items-center justify-center p-3 border rounded-xl transition-all ${
                    formData.role === 'association' 
                      ? 'border-[#A84F32] bg-[#A84F32]/10 text-[#A84F32]' 
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <Users className="w-5 h-5 mb-1" />
                  <span className="font-bold text-xs">Association</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700">Nom complet / Nom du club</label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className={`pl-10 w-full px-3 py-2.5 border rounded-xl outline-none focus:border-[#A84F32] ${errors.name ? 'border-red-500' : 'border-stone-300'}`}
                  placeholder="Ex: Club Informatique ESSECT"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700">Adresse Email</label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`pl-10 w-full px-3 py-2.5 border rounded-xl outline-none focus:border-[#A84F32] ${errors.email ? 'border-red-500' : 'border-stone-300'}`}
                  placeholder="contact@club.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700">Mot de passe</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange}
                  className={`pl-10 w-full px-3 py-2.5 border rounded-xl outline-none focus:border-[#A84F32] ${errors.password ? 'border-red-500' : 'border-stone-300'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-stone-700">Confirmer le mot de passe</label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-stone-400" />
                <input
                  type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  className={`pl-10 w-full px-3 py-2.5 border rounded-xl outline-none focus:border-[#A84F32] ${errors.confirmPassword ? 'border-red-500' : 'border-stone-300'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 ${isLoading ? 'bg-stone-400' : 'bg-[#4C6749] hover:bg-[#3d543a]'} text-white`}
            >
              {isLoading ? 'Création en cours...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-bold text-[#A84F32] hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;