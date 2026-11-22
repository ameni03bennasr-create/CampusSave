// cspell:locale fr-FR

import {
  BarChart3,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  X
} from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { AdminPageId } from '@/config/adminPages';
import type { AdminWorkspace } from '@/hooks/useAdminWorkspace';

interface NavItem {
  id: AdminPageId;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
}

interface AdminLayoutProps {
  ws: AdminWorkspace;
  children: ReactNode;
}

export function AdminLayout({ ws, children }: AdminLayoutProps) {
  const {
    toast,
    navigateTo,
    adminProfile,
    showToast,
    pendingMerchantsCount,
    setMobileMenuOpen,
    mobileMenuOpen,
    currentPage
  } = ws;

  // ==========================================================================
  // LAYOUT PRINCIPAL DE L'ESPACE ADMINISTRATEUR (SIDEBAR + HEADER + CONTENU)
  // ==========================================================================
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'users', label: 'Gestion des utilisateurs', icon: Users },
    { id: 'merchants', label: 'Gestion des commerçants', icon: Store },
    {
      id: 'merchant-validation',
      label: 'Validation des commerçants',
      icon: ShieldCheck,
      badge: pendingMerchantsCount > 0 ? pendingMerchantsCount : null
    },
    { id: 'offers-supervision', label: 'Supervision des offres', icon: UtensilsCrossed },
    { id: 'orders-supervision', label: 'Supervision des commandes', icon: ShoppingBag },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const isNavActive = (itemId: string) => {
    if (itemId === 'users' && (currentPage === 'users' || currentPage === 'user-details')) {
      return true;
    }
    if (
      itemId === 'merchants' &&
      (currentPage === 'merchants' || currentPage === 'merchant-details')
    ) {
      return true;
    }
    if (
      itemId === 'orders-supervision' &&
      (currentPage === 'orders-supervision' || currentPage === 'order-details')
    ) {
      return true;
    }
    return currentPage === itemId;
  };

  return (
<div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {/* Toast global */}
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E9C98B] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toast}</p>
        </div>
      )}

      {/* SIDEBAR DESKTOP (1440x1024 Desktop-First) */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/60 z-30">
        {/* Logo CampusSave + Badge Administration */}
        <div className="p-6 border-b border-[#F8F1E7]">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3 text-left group w-full"
          >
            <div className="flex flex-col items-start gap-2">
              <BrandLogo className="h-24 w-auto" />
              <span className="inline-block px-2 py-0.5 rounded-md bg-[#4C6749]/15 text-[#4C6749] text-[11px] font-extrabold">
                Administration
              </span>
            </div>
          </button>
        </div>

        {/* Carte profil Admin */}
        <div className="px-4 pt-4 pb-2">
          <div
            onClick={() => navigateTo('settings')}
            className="p-3.5 rounded-2xl bg-[#F8F1E7]/85 hover:bg-[#F8F1E7] border border-[#E9C98B]/60 cursor-pointer transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-[#A84F32] text-white flex items-center justify-center font-extrabold text-sm shrink-0">
              {adminProfile.fullName
                .split(' ')
                .filter(Boolean)
                .map((n) => n[0])
                .join('') || '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-extrabold text-stone-900 truncate">
                {adminProfile.fullName || 'Administrateur'}
              </p>
              <p className="text-[11px] text-stone-500 truncate">{adminProfile.role || 'Administration CampusSave'}</p>
            </div>
          </div>
        </div>

        {/* Liens de navigation Admin */}
        <nav className="flex-1 px-4 py-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-[#A84F32] text-white shadow-xs'
                    : 'text-stone-600 hover:bg-[#F8F1E7] hover:text-stone-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-stone-500'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge !== undefined && item.badge !== null && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-extrabold shrink-0 ${
                      active
                        ? 'bg-white text-[#A84F32]'
                        : 'bg-[#D98245] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-4 border-t border-[#F8F1E7]">
          <button
            onClick={() => {
              showToast('Session administrateur fermée.');
              navigateTo('login');
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-700 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* HEADER MOBILE & TABLETTE */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9C98B]/60 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2.5">
          <BrandLogo className="h-11 w-auto" />
          <span className="text-[10px] font-extrabold text-[#4C6749]">Administration</span>
        </button>

        <div className="flex items-center gap-2">
          {pendingMerchantsCount > 0 && (
            <button
              onClick={() => navigateTo('merchant-validation')}
              className="px-2.5 py-1.5 rounded-xl bg-[#E9C98B]/60 text-[#8A4B1C] text-xs font-extrabold"
            >
              {pendingMerchantsCount} à valider
            </button>
          )}
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
        <div
          className="lg:hidden fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] h-full bg-white p-5 flex flex-col justify-between shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F8F1E7]">
                <div className="flex flex-col items-start gap-1">
                  <BrandLogo className="h-14 w-auto" />
                  <span className="text-xs font-bold text-[#4C6749]">Espace Administration</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-[#F8F1E7]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                        active ? 'bg-[#A84F32] text-white' : 'text-stone-700 hover:bg-[#F8F1E7]'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </span>
                      {item.badge !== undefined && item.badge !== null && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-[#D98245] text-white font-bold">
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
              className="mt-6 w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-red-700 bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* ZONE DE CONTENU PRINCIPAL */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">

        <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
{children}
</main>
      </div>
    </div>
  );
}
