import { Home, Search, ShoppingCart, ShoppingBag, User, LogOut, Menu, X, Users } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { ReactNode } from 'react';
import type { AssociationWorkspace } from '@/hooks/useAssociationWorkspace';
import { useAuth } from '@/context/AuthContext';

export function AssociationLayout({ ws, children }: { ws: AssociationWorkspace, children: ReactNode }) {
  const { currentPage, navigateTo, mobileMenuOpen, setMobileMenuOpen, association } = ws;
  const { logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Accueil Club', icon: Home },
    { id: 'explore', label: 'Explorer', icon: Search },
    { id: 'cart', label: 'Panier Groupé', icon: ShoppingCart },
    { id: 'orders', label: 'Demandes Groupées', icon: ShoppingBag },
    { id: 'profile', label: 'Profil du Club', icon: User },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {ws.toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl">
          {ws.toast.message}
        </div>
      )}

      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/60 z-30">
        <div className="p-6 border-b border-[#F8F1E7]">
          <BrandLogo className="h-24 w-auto" />
          <span className="text-xs text-[#D98245] font-bold block mt-2">Espace Association</span>
        </div>

        <div className="px-4 pt-4 pb-2">
          <div className="p-3.5 rounded-2xl bg-[#F8F1E7]/85 border border-[#E9C98B]/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#A84F32] text-white flex items-center justify-center font-extrabold"><Users className="w-5 h-5" /></div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-stone-900 truncate">{association.name}</p>
              <p className="text-[11px] text-stone-500 truncate">{association.university}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold ${currentPage === item.id ? 'bg-[#A84F32] text-white' : 'text-stone-600 hover:bg-[#F8F1E7]'}`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#F8F1E7]">
          <button onClick={() => { logout(); navigateTo('login'); }} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-700 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b p-4 flex justify-between items-center">
          <BrandLogo className="h-10 w-auto" />
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 bg-[#A84F32] text-white rounded-lg">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </header>
        <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}