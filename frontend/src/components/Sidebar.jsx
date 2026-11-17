import React from 'react';
import { Home, Search, ShoppingBag, User, LogOut, Leaf } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Accueil', icon: Home, active: true },
    { name: 'Explorer', icon: Search, active: false },
    { name: 'Commandes', icon: ShoppingBag, active: false },
    { name: 'Mon Profil', icon: User, active: false },
  ];

  return (
    <>
      {/* Overlay mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-stone-900/50 z-40 md:hidden" onClick={onClose} />
      )}

      {/* Sidebar Desktop & Mobile */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-sand/60 flex flex-col transition-transform duration-300
        md:translate-x-0 md:static md:w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 border-b border-cream">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-cream">
              <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center text-terracotta font-bold">
                YB
              </div>
              <div>
                <p className="text-sm font-bold text-stone-900">Yasmine B.</p>
                <p className="text-xs text-stone-500">Étudiante ESSECT</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
              item.active ? 'bg-terracotta text-white' : 'text-stone-600 hover:bg-cream'
            }`}>
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-cream">
          <div className="mb-4 p-3 rounded-xl bg-olive/10 flex items-center justify-between">
            <span className="text-xs font-bold text-olive flex items-center gap-1.5"><Leaf className="w-4 h-4"/> EcoPoints</span>
            <span className="text-sm font-extrabold text-olive">340</span>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;