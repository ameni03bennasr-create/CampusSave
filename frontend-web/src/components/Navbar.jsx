import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Home, Search, ShoppingBag, ShoppingCart, User, LogOut, Menu, X, Leaf, Store, Shield } from 'lucide-react';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { logout, user } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = getCartCount();

  // --- DÉFINITION DES LIENS PAR RÔLE ---
  const getNavItems = () => {
    const profileLink = { name: 'Profil', path: '/profile', icon: User };
    
    if (user?.role === 'etudiant') {
      return [
        { name: 'Accueil', path: '/etudiant', icon: Home },
        { name: 'Explorer', path: '/explore', icon: Search },
        { name: 'Panier', path: '/cart', icon: ShoppingCart, badge: cartCount },
        { name: 'Commandes', path: '/orders', icon: ShoppingBag },
        profileLink
      ];
    }

    if (user?.role === 'commercant') {
      return [
        { name: 'Mon Espace', path: '/commercant', icon: Store },
        // J'ajoute "Commandes" car un commerçant doit voir les commandes qu'on lui a passées pour valider les QR codes
        { name: 'Commandes Reçues', path: '/orders', icon: ShoppingBag }, 
        profileLink
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Supervision', path: '/admin', icon: Shield },
        profileLink
      ];
    }

    return []; // Par défaut
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white border-b border-[#E9C98B] sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo et Nom */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src={logo} alt="CampusSave Logo" className="h-12 w-auto object-contain mr-3" />
            <span className="font-extrabold text-2xl tracking-tight text-[#4C6749]">
              Campus<span className="text-[#A84F32]">Save</span>
            </span>
          </div>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors relative ${
                    isActive ? 'bg-[#F8F1E7] text-[#A84F32]' : 'text-stone-600 hover:bg-stone-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
                {item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#D93828] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Profil et Déconnexion (Desktop) */}
          <div className="hidden md:flex items-center gap-4 border-l border-stone-200 pl-4">
            {user?.role === 'etudiant' && (
              <div className="flex items-center gap-1.5 text-[#4C6749] bg-[#4C6749]/10 px-3 py-1.5 rounded-lg font-bold text-sm">
                <Leaf className="w-4 h-4" /> 340 pts
              </div>
            )}
            <div className="text-right">
              <p className="text-sm font-bold text-stone-800">{user?.name || 'Utilisateur'}</p>
              <p className="text-xs text-stone-500 capitalize">{user?.role || 'Invité'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* Bouton Menu Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-600 hover:text-[#A84F32] p-2"
            >
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Déroulant */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-3 rounded-xl text-base font-bold ${
                    isActive ? 'bg-[#F8F1E7] text-[#A84F32]' : 'text-stone-600 hover:bg-stone-50'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </div>
                {item.badge > 0 && (
                  <span className="bg-[#D93828] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 mt-4 rounded-xl text-base font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;