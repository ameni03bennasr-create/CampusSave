import {
  BarChart3,
  Bell,
  CheckCircle2,
  Home,
  Leaf,
  LogOut,
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  User,
  ShoppingCart, // <-- Ajoutez ceci
  X
} from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { StudentPageId } from '@/config/studentPages';
import type { StudentWorkspace } from '@/hooks/useStudentWorkspace';
import { Avatar } from '@/components/common/Avatar';
import { useAuth } from '@/context/AuthContext'; // <-- Ajoutez ceci
interface NavItem {
  id: StudentPageId;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
}

interface StudentLayoutProps {
  ws: StudentWorkspace;
  children: ReactNode;
}

export function StudentLayout({ ws, children }: StudentLayoutProps) {
  const {
    toast,
    navigateTo,
    student,
    showToast,
    unreadNotificationsCount,
    setMobileMenuOpen,
    mobileMenuOpen,
    currentPage,
    activeOrdersCount
  } = ws;
    const { logout } = useAuth(); // <-- Ajoutez ceci

  // ==========================================================================
  // LAYOUT PRINCIPAL DE L'ESPACE ÉTUDIANT (DESKTOP SIDEBAR + MOBILE NAV)
  // ==========================================================================
  const navItems: NavItem[] = [
   { id: 'home', label: 'Accueil', icon: Home },
    { id: 'explore', label: 'Explorer les offres', icon: Search },
    // Ajoutez votre panier ici
    { id: 'cart', label: 'Mon Panier', icon: ShoppingCart },
    {
      id: 'orders',
      label: 'Mes commandes',
      icon: ShoppingBag,
      badge: activeOrdersCount > 0 ? activeOrdersCount : null
    }, {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'profile', label: 'Mon profil', icon: User }
  ];

   const isNavActive = (itemId: string) => {
    if (itemId === 'explore' && ['explore', 'offer-details', 'reservation', 'order-summary', 'payment', 'confirmation-qr'].includes(currentPage)) {
      return true;
    }
    // Ajoutez ceci :
    if (itemId === 'cart' && ['cart', 'checkout'].includes(currentPage)) {
      return true;
    }
    if (itemId === 'orders' && ['orders', 'order-details'].includes(currentPage)) {
      return true;
    }
    return currentPage === itemId;
  };
  return (
<div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {/* Toast global */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#E9C98B] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      )}

      {/* SIDEBAR DESKTOP (1440x1024 Desktop-First) */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/50 z-30">
        {/* Logo CampusSave */}
        <div className="p-6 border-b border-[#F8F1E7]">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group w-full"
          >
            <div className="flex flex-col items-start gap-2">
              <BrandLogo className="h-24 w-auto" />
              <span className="text-xs text-[#4C6749] font-semibold block">
                Espace Étudiant • ESSECT
              </span>
            </div>
          </button>
        </div>

        {/* Carte profil rapide dans la sidebar */}
        <div className="px-4 pt-5 pb-2">
          <div
            onClick={() => navigateTo('profile')}
            className="p-3.5 rounded-2xl bg-[#F8F1E7]/80 hover:bg-[#F8F1E7] border border-[#E9C98B]/50 flex items-center gap-3 cursor-pointer transition-colors"
          >
            <Avatar src={student.avatar} name={student.fullName} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-stone-900 truncate">{student.fullName || 'Mon compte'}</p>
              <p className="text-xs text-stone-500 truncate">{student.filiere || student.email || 'Espace Étudiant'}</p>
            </div>
          </div>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            Navigation Étudiant
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#A84F32] text-white shadow-sm'
                    : 'text-stone-600 hover:bg-[#F8F1E7] hover:text-stone-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-stone-500'}`} />
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                      active
                        ? 'bg-white text-[#A84F32]'
                        : 'bg-[#D98245]/15 text-[#A84F32]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Accès direct Modules Bonus (clairement séparés) */}
          <div className="pt-5 mt-5 border-t border-[#F8F1E7]">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#4C6749] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Mes avantages
            </p>
            <button
              onClick={() => navigateTo('statistics')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#4C6749] bg-[#4C6749]/10 hover:bg-[#4C6749]/15 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Leaf className="w-4 h-4" />
                EcoPoints & Radar ESSECT
              </span>
              <span className="font-bold">{student.ecoPoints} pts</span>
            </button>
          </div>
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-4 border-t border-[#F8F1E7]">
                    <button
            onClick={() => {
              logout(); // <-- LA VRAIE DÉCONNEXION
              showToast('Vous avez été déconnecté(e).');
              navigateTo('login');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>        </div>
      </aside>

      {/* HEADER MOBILE & TABLETTE */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9C98B]/50 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5"
        >
          <BrandLogo className="h-11 w-auto" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('notifications')}
            className="relative p-2.5 rounded-xl bg-[#F8F1E7] text-stone-700"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#A84F32]" />
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-[#A84F32] text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* TIROIR DE NAVIGATION MOBILE */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-72 max-w-[85vw] h-full bg-white p-5 flex flex-col justify-between shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F8F1E7]">
                <div className="flex flex-col items-start gap-1">
                  <BrandLogo className="h-14 w-auto" />
                  <span className="text-xs font-semibold text-[#4C6749]">Espace Étudiant • ESSECT</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg bg-[#F8F1E7]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold ${
                        active ? 'bg-[#A84F32] text-white' : 'text-stone-700 hover:bg-[#F8F1E7]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[#E9C98B] text-stone-900 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => navigateTo('login')}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-red-700 bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* ZONE DE CONTENU PRINCIPAL */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">

        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-12">
{children}
</main>
      </div>

      {/* BARRE DE NAVIGATION INFÉRIEURE MOBILE */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E9C98B]/60 px-2 py-1.5 flex items-center justify-around z-30">
        {([
          { id: 'home', label: 'Accueil', icon: Home },
          { id: 'explore', label: 'Explorer', icon: Search },
          { id: 'orders', label: 'Commandes', icon: ShoppingBag },
          { id: 'statistics', label: 'Stats', icon: BarChart3 },
          { id: 'profile', label: 'Profil', icon: User }
        ] as const).map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-[11px] font-semibold ${
                active ? 'text-[#A84F32]' : 'text-stone-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
