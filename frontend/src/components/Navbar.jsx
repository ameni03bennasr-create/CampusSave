import React from 'react';
import { Menu, Bell, Search } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-sand/60 h-16 flex items-center justify-between px-4 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="p-2 rounded-lg bg-cream text-stone-700 md:hidden">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-terracotta text-white flex items-center justify-center font-extrabold text-sm">
              CS
           </div>
           <span className="font-extrabold text-lg text-stone-900 hidden sm:block">CampusSave</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Rechercher..." 
            className="pl-9 pr-4 py-2 rounded-xl bg-cream border border-sand/50 text-sm focus:outline-none focus:border-terracotta w-64"
          />
        </div>
        <button className="relative p-2 rounded-lg bg-cream text-stone-700 hover:bg-sand/50 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;