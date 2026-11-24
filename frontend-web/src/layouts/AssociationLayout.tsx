import { useState } from 'react';
import { Home, Search, ShoppingCart, ShoppingBag, User, LogOut, Menu, X, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { ReactNode } from 'react';
import type { AssociationWorkspace } from '@/hooks/useAssociationWorkspace';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

export function AssociationLayout({ ws, children }: { ws: AssociationWorkspace, children: ReactNode }) {
  const { currentPage, navigateTo, mobileMenuOpen, setMobileMenuOpen, association, toast } = ws;
  const { logout } = useAuth();
  const { getCartCount } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const cartCount = getCartCount();

  const navItems = [
    { id: 'home', label: 'Accueil Club', icon: Home, badge: null },
    { id: 'explore', label: 'Explorer', icon: Search, badge: null },
    { id: 'cart', label: 'Panier Groupé', icon: ShoppingCart, badge: cartCount > 0 ? cartCount : null },
    { id: 'orders', label: 'Demandes Groupées', icon: ShoppingBag, badge: null },
    { id: 'profile', label: 'Profil du Club', icon: User, badge: null },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {toast && <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl">{toast.message}</div>}

      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/60 z-30 transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 bg-white border border-[#E9C98B] rounded-full p-1 z-50 text-stone-500 hover:text-[#A84F32] shadow-sm">
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-6 border-b border-[#F8F1E7] flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
          <button onClick={() => navigateTo('home')} className="flex items-center text-left group w-full">
            <div className={`flex flex-col items-center ${isCollapsed ? '' : 'items-start gap-2'}`}>
              <BrandLogo className={`w-auto transition-all ${isCollapsed ? 'h-10' : 'h-24'}`} />
              {!isCollapsed && <span className="text-xs text-[#D98245] font-bold block">Espace Association</span>}
            </div>
          </button>
        </div>

        <div className={`px-4 pt-4 pb-2 ${isCollapsed ? 'flex justify-center px-2' : ''}`}>
          <div onClick={() => navigateTo('profile')} className={`p-3.5 rounded-2xl bg-[#F8F1E7]/85 border border-[#E9C98B]/60 flex items-center cursor-pointer ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 rounded-xl bg-[#A84F32] text-white flex items-center justify-center shrink-0 overflow-hidden">
              {association.avatar ? <img src={association.avatar} alt="Logo" className="w-full h-full object-cover" /> : <Users className="w-5 h-5" />}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-stone-900 truncate">{association.name}</p>
                <p className="text-[11px] text-stone-500 truncate">{association.university}</p>
              </div>
            )}
          </div>
        </div>

        <nav className={`flex-1 py-3 space-y-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button key={item.id} title={isCollapsed ? item.label : undefined} onClick={() => navigateTo(item.id)} className={`w-full flex items-center py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#A84F32] text-white' : 'text-stone-600 hover:bg-[#F8F1E7]'} ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
                <span className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  
                  <div className="relative">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-stone-500'}`} />
                    {isCollapsed && item.badge && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#A84F32] text-white text-[9px] font-bold flex items-center justify-center border border-white">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && <span>{item.label}</span>}
                </span>
                
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${active ? 'bg-white text-[#A84F32]' : 'bg-[#D98245]/15 text-[#A84F32]'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-[#F8F1E7] ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button onClick={() => { logout(); navigateTo('login'); }} title={isCollapsed ? "Déconnexion" : undefined} className={`flex items-center rounded-xl text-sm font-bold text-red-700 hover:bg-red-50 ${isCollapsed ? 'justify-center p-3' : 'w-full gap-3 px-3.5 py-2.5'}`}>
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#E9C98B] p-4 flex justify-between items-center">
          <BrandLogo className="h-10 w-auto" />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-[#A84F32] text-white rounded-lg">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </header>
        <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}