import { useState } from 'react';
import {
  BarChart3, Bell, CheckCircle2, Home, Leaf, LogOut, Menu, Search, ShoppingBag, Sparkles, User, ShoppingCart, X, ChevronLeft, ChevronRight
} from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StudentPageId } from '@/config/studentPages';
import type { StudentWorkspace } from '@/hooks/useStudentWorkspace';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/context/AuthContext';

interface NavItem { id: StudentPageId; label: string; icon: LucideIcon; badge?: number | null; }
interface StudentLayoutProps { ws: StudentWorkspace; children: ReactNode; }

export function StudentLayout({ ws, children }: StudentLayoutProps) {
  const { toast, navigateTo, student, showToast, unreadNotificationsCount, setMobileMenuOpen, mobileMenuOpen, currentPage, activeOrdersCount } = ws;
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'explore', label: 'Explorer les offres', icon: Search },
    { id: 'cart', label: 'Mon Panier', icon: ShoppingCart },
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

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E9C98B] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      )}

      {/* SIDEBAR DESKTOP avec mode Rétractable */}
      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/50 z-30 transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        {/* Bouton Toggle (Rétracter/Replier) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="absolute -right-3 top-8 bg-white border border-[#E9C98B] rounded-full p-1 z-50 text-stone-500 hover:text-[#A84F32] shadow-sm"
        >
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
          <div onClick={() => navigateTo('profile')} className={`p-3.5 rounded-2xl bg-[#F8F1E7]/80 hover:bg-[#F8F1E7] border border-[#E9C98B]/50 flex items-center cursor-pointer transition-colors ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Avatar src={student.avatar} name={student.fullName} className="w-10 h-10 rounded-full border-2 border-white shadow-sm shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
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
              <button
                key={item.id}
                title={isCollapsed ? item.label : undefined}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center py-3 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'bg-[#A84F32] text-white shadow-sm' : 'text-stone-600 hover:bg-[#F8F1E7] hover:text-stone-900'
                } ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'}`}
              >
                <span className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-stone-500'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </span>
                {!isCollapsed && item.badge && (
                  <span className={`px-2 py-0.5 text-xs rounded-full font-bold ${active ? 'bg-white text-[#A84F32]' : 'bg-[#D98245]/15 text-[#A84F32]'}`}>{item.badge}</span>
                )}
              </button>
            );
          })}
          {!isCollapsed && (
            <div className="pt-5 mt-5 border-t border-[#F8F1E7]">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#4C6749] mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Avantages</p>
              <button onClick={() => navigateTo('statistics')} className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#4C6749] bg-[#4C6749]/10 hover:bg-[#4C6749]/15 transition-colors">
                <span className="flex items-center gap-2"><Leaf className="w-4 h-4" /> EcoPoints</span>
                <span className="font-bold">{student.ecoPoints} pts</span>
              </button>
            </div>
          )}
        </nav>

        <div className={`p-4 border-t border-[#F8F1E7] ${isCollapsed ? 'flex justify-center' : ''}`}>
          <button
            onClick={() => { logout(); showToast('Déconnecté(e).'); navigateTo('login'); }}
            title={isCollapsed ? "Déconnexion" : undefined}
            className={`flex items-center rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center p-3' : 'w-full gap-3 px-3.5 py-3'}`}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* HEADER & MAIN CONTENT (avec transition de marge) */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9C98B]/50 px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigateTo('home')}><BrandLogo className="h-11 w-auto" /></button>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateTo('notifications')} className="relative p-2.5 rounded-xl bg-[#F8F1E7] text-stone-700">
              <Bell className="w-5 h-5" />
              {unreadNotificationsCount > 0 && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#A84F32]" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 rounded-xl bg-[#A84F32] text-white">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* TIROIR MOBILE */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-72 max-w-[85vw] h-full bg-white p-5 flex flex-col justify-between shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F8F1E7]">
                  <div className="flex flex-col items-start gap-1"><BrandLogo className="h-14 w-auto" /><span className="text-xs font-semibold text-[#4C6749]">Espace Étudiant</span></div>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg bg-[#F8F1E7]"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-1.5">
                  {navItems.map((item) => (
                    <button key={item.id} onClick={() => navigateTo(item.id)} className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold ${isNavActive(item.id) ? 'bg-[#A84F32] text-white' : 'text-stone-700 hover:bg-[#F8F1E7]'}`}>
                      <span className="flex items-center gap-3"><item.icon className="w-5 h-5" />{item.label}</span>
                      {item.badge && <span className="px-2 py-0.5 text-xs rounded-full bg-[#E9C98B] text-stone-900 font-bold">{item.badge}</span>}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => { logout(); navigateTo('login'); }} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-700 bg-red-50"><LogOut className="w-5 h-5" />Déconnexion</button>
            </div>
          </div>
        )}

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-12">{children}</main>
      </div>

      {/* BARRE MOBILE INFÉRIEURE */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E9C98B]/60 px-2 py-1.5 flex items-center justify-around z-30">
        {([{ id: 'home', label: 'Accueil', icon: Home }, { id: 'explore', label: 'Explorer', icon: Search }, { id: 'orders', label: 'Commandes', icon: ShoppingBag }, { id: 'statistics', label: 'Stats', icon: BarChart3 }, { id: 'profile', label: 'Profil', icon: User }] as const).map((item) => (
          <button key={item.id} onClick={() => navigateTo(item.id)} className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[11px] font-semibold ${isNavActive(item.id) ? 'text-[#A84F32]' : 'text-stone-500'}`}>
            <item.icon className="w-5 h-5 mb-0.5" />{item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}