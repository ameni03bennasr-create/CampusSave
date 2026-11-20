import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import du panier
import { Home, Search, ShoppingBag, ShoppingCart, User, LogOut, Leaf } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const { getCartCount } = useCart(); // Récupération du nombre d'articles
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = getCartCount();

  const navItems = [
    { name: 'Accueil', path: `/${user?.role || 'login'}`, icon: Home },
    { name: 'Explorer', path: '/explore', icon: Search },
    // Ajout du Panier ici
    { name: 'Mon Panier', path: '/cart', icon: ShoppingCart, badge: cartCount },
    { name: 'Commandes', path: '/orders', icon: ShoppingBag },
    { name: 'Mon Profil', path: '/profile', icon: User },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-40 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-sand/60 flex flex-col transition-transform duration-300
        md:translate-x-0 md:static md:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Profil utilisateur */}
        <div className="p-4 border-b border-cream">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-cream">
              <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center text-terracotta font-bold uppercase">
                {user?.name ? user.name.substring(0, 2) : 'US'}
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-stone-500 capitalize">{user?.role || 'Invité'}</p>
              </div>
           </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              to={item.path}
              className={({ isActive }) => `w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                isActive ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-cream'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.name}
              </div>
              {/* Affichage de la bulle rouge si c'est le panier et qu'il y a des articles */}
              {item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Pied de la Sidebar : EcoPoints + Déconnexion */}
        <div className="p-4 border-t border-cream">
          {user?.role === 'etudiant' && (
            <div className="mb-4 p-3 rounded-xl bg-olive/10 flex items-center justify-between">
              <span className="text-xs font-bold text-olive flex items-center gap-1.5">
                <Leaf className="w-4 h-4"/> EcoPoints
              </span>
              <span className="text-sm font-extrabold text-olive">340</span>
            </div>
          )}
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;