import {
  BarChart3,
  Bell,
  CheckCircle2,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  QrCode,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Store,
  UtensilsCrossed,
  X
} from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import { SafeImage } from '@/components/common/SafeImage';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { MerchantPageId } from '@/config/merchantPages';
import type { MerchantWorkspace } from '@/hooks/useMerchantWorkspace';

interface NavItem {
  id: MerchantPageId;
  label: string;
  icon: LucideIcon;
  badge?: number | null;
}

interface MerchantLayoutProps {
  ws: MerchantWorkspace;
  children: ReactNode;
}

export function MerchantLayout({ ws, children }: MerchantLayoutProps) {
  const {
    toast,
    navigateTo,
    establishment,
    showToast,
    unreadNotificationsCount,
    setMobileMenuOpen,
    mobileMenuOpen,
    currentPage,
    offers,
    pendingPickupCount
  } = ws;

  // ==========================================================================
  // LAYOUT PRINCIPAL DE L'ESPACE COMMERÇANT (SIDEBAR 10 LIENS + CONTENU)
  // ==========================================================================
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'establishment', label: 'Mon établissement', icon: Store },
    { id: 'offers', label: 'Mes offres', icon: UtensilsCrossed, badge: offers.length },
    { id: 'add-offer', label: 'Ajouter une offre', icon: PlusCircle },
    {
      id: 'orders',
      label: 'Commandes',
      icon: ShoppingBag,
      badge: pendingPickupCount > 0 ? pendingPickupCount : null
    },
    { id: 'qr-scanner', label: 'Validation QR Code', icon: QrCode },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : null
    },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const isNavActive = (itemId: string) => {
    if (itemId === 'offers' && (currentPage === 'offers' || currentPage === 'edit-offer')) {
      return true;
    }
    if (itemId === 'orders' && (currentPage === 'orders' || currentPage === 'order-details')) {
      return true;
    }
    return currentPage === itemId;
  };

  return (
<div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {/* Notification Toast globale */}
      {toast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E9C98B] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toast.message}</p>
        </div>
      )}

      {/* SIDEBAR DESKTOP (1440x1024 Desktop-First) */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/60 z-30">
        {/* Marque CampusSave */}
        <div className="p-6 border-b border-[#F8F1E7]">
          <button
            onClick={() => navigateTo('dashboard')}
            className="flex items-center gap-3 text-left group w-full"
          >
            <div className="flex flex-col items-start gap-2">
              <BrandLogo className="h-24 w-auto" />
              <span className="text-xs text-[#D98245] font-bold block">
                Espace Commerçant
              </span>
            </div>
          </button>
        </div>

        {/* Carte Établissement & Statut validation Admin */}
        <div className="px-4 pt-4 pb-2">
          <div
            onClick={() => navigateTo('establishment')}
            className="p-3.5 rounded-2xl bg-[#F8F1E7]/85 hover:bg-[#F8F1E7] border border-[#E9C98B]/60 cursor-pointer transition-colors space-y-2"
          >
            <div className="flex items-center gap-3">
              <SafeImage
                src={establishment.logo}
                alt={establishment.name}
                className="w-10 h-10 rounded-xl object-cover border border-white shadow-2xs shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-stone-900 truncate">
                  {establishment.name || 'Mon établissement'}
                </p>
                <p className="text-[11px] text-stone-500 truncate">
                  {establishment.type || 'Mon établissement'}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#E9C98B]/40">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${establishment.adminValidated ? 'text-[#4C6749]' : 'text-[#D98245]'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
                {establishment.adminValidated ? 'Validé par l’Admin' : 'En attente de validation'}
              </span>
            </div>
          </div>
        </div>

        {/* Menu de navigation Commerçant */}
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
                  {item.label}
                </span>
                {item.badge !== undefined && item.badge !== null && (
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
        </nav>

        {/* Bouton Déconnexion */}
        <div className="p-4 border-t border-[#F8F1E7]">
          <button
            onClick={() => {
              showToast('Session commerçant fermée.');
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
          <span className="text-[10px] font-bold text-[#D98245]">Espace Commerçant</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateTo('qr-scanner')}
            className="p-2.5 rounded-xl bg-[#4C6749] text-white"
            aria-label="Scanner QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
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
                <div>
                  <span className="font-extrabold text-lg text-[#A84F32] block">
                    {establishment.name}
                  </span>
                  <span className="text-xs text-[#4C6749] font-semibold">{establishment.adminValidated ? 'Validé par l’Admin' : 'En attente de validation'}</span>
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
                        {item.label}
                      </span>
                      {item.badge !== undefined && item.badge !== null && (
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
              className="mt-6 w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-bold text-red-700 bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}

      {/* ZONE PRINCIPALE DE CONTENU */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">

        <main className="flex-1 max-w-[1220px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-24 lg:pb-12">
{children}
</main>
      </div>

      {/* BARRE INFÉRIEURE MOBILE */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-[#E9C98B]/60 px-2 py-1.5 flex items-center justify-around z-30">
        {([
          { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
          { id: 'offers', label: 'Offres', icon: UtensilsCrossed },
          { id: 'orders', label: 'Commandes', icon: ShoppingBag },
          { id: 'qr-scanner', label: 'Scan QR', icon: QrCode },
          { id: 'statistics', label: 'Stats', icon: BarChart3 }
        ] as const).map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2.5 rounded-xl text-[11px] font-bold ${
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
