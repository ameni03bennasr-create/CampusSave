import { useState } from 'react';
import { BarChart3, Bell, CheckCircle2, Home, LogOut, Menu, Search, ShoppingBag, User, ShoppingCart, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StudentPageId } from '@/config/studentPages';
import type { StudentWorkspace } from '@/hooks/useStudentWorkspace';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

interface NavItem { id: StudentPageId; label: string; icon: LucideIcon; badge?: number | null; }
interface StudentLayoutProps { ws: StudentWorkspace; children: ReactNode; }

export function StudentLayout({ ws, children }: StudentLayoutProps) {
  const { toast, navigateTo, student, setStudent, showToast, unreadNotificationsCount, setMobileMenuOpen, mobileMenuOpen, currentPage, activeOrdersCount } = ws;
  const { logout } = useAuth();
  const { getCartCount } = useCart();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const cartCount = getCartCount();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'explore', label: 'Explorer les offres', icon: Search },
    { id: 'cart', label: 'Mon Panier', icon: ShoppingCart, badge: cartCount > 0 ? cartCount : null },
    { id: 'orders', label: 'Mes commandes', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'profile', label: 'Mon profil', icon: User }
  ];

  const isNavActive = (itemId: string) => {
    if (itemId === 'explore' && ['explore', 'offer-details', 'reservation', 'order-summary', 'payment', 'confirmation-qr'].includes(currentPage)) return true;
    if (itemId === 'cart' && ['cart', 'checkout'].includes(currentPage)) return true;
    if (itemId === 'orders' && ['orders', 'order-details'].includes(currentPage)) return true;
    return currentPage === itemId;
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudent({ ...student, avatar: reader.result as string });
        showToast('Photo de profil mise à jour !');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E9C98B] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      )}

      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/50 z-30 transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 bg-white border border-[#E9C98B] rounded-full p-1 z-50 text-stone-500 hover:text-[#A84F32] shadow-sm">
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-6 border-b border-[#F8F1E7] flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
          <button onClick={() => navigateTo('home')} className="flex items-center text-left group w-full">
            <div className={`flex flex-col items-center ${isCollapsed ? '' : 'items-start gap-2'}`}>
              <BrandLogo className={`w-auto transition-all ${isCollapsed ? 'h-10' : 'h-24'}`} />
              {!isCollapsed && <span className="text-xs text-[#4C6749] font-semibold block">Espace Étudiant • ESSECT</span>}
            </div>
          </button>
        </div>

        <div className={`px-4 pt-5 pb-2 ${isCollapsed ? 'flex justify-center px-2' : ''}`}>
          <div className={`p-3.5 rounded-2xl bg-[#F8F1E7]/80 border border-[#E9C98B]/50 flex items-center transition-colors ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative group cursor-pointer" onClick={() => document.getElementById('student-avatar-input')?.click()}>
              <Avatar src={student.avatar} name={student.fullName} className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <input id="student-avatar-input" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => navigateTo('profile')}>
                <p className="text-sm font-bold text-stone-900 truncate">{student.fullName || 'Mon compte'}</p>
                <p className="text-xs text-stone-500 truncate">{student.filiere || student.email || 'Espace Étudiant'}</p>
              </div>
            )}
          </div>
        </div>

        <nav className={`flex-1 py-4 space-y-1.5 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {!isCollapsed && <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">Navigation</p>}
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button key={item.id} title={isCollapsed ? item.label : undefined} onClick={() => navigateTo(item.id)} className={`w-full flex items-center py-3 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#A84F32] text-white shadow-sm' : 'text-stone-600 hover:bg-[#F8F1E7] hover:text-stone-900'} ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
                <span className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  
                  {/* WRAPPER POUR L'ICONE ET LE BADGE COLLAPSED */}
                  <div className="relative">
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-stone-500'}`} />
                    {isCollapsed && item.badge && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#A84F32] text-white text-[9px] font-bold flex items-center justify-center border border-white">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && <span>{item.label}</span>}
                </span>

                {/* BADGE NORMAL (QUAND OUVERT) */}
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${active ? 'bg-white text-[#A84F32]' : 'bg-[#D98245]/15 text-[#A84F32]'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`p-4 border-t border-[#F8F1E7] ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button onClick={() => { logout(); showToast('Déconnecté(e).'); navigateTo('login'); }} title={isCollapsed ? "Déconnexion" : undefined} className={`flex items-center rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center p-3' : 'w-full gap-3 px-3.5 py-3'}`}>
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9C98B]/50 px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigateTo('home')}><BrandLogo className="h-11 w-auto" /></button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('cart')} className="relative p-2.5 rounded-xl bg-[#F8F1E7] text-stone-700">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#A84F32] text-white text-[9px] font-bold flex items-center justify-center">{cartCount}</span>}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 rounded-xl bg-[#A84F32] text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-12">{children}</main>
      </div>
    </div>
  );
}