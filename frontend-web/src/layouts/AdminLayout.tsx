import { useState } from 'react';
import { BarChart3, CheckCircle2, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, ShoppingBag, Store, Users, UtensilsCrossed, X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import BrandLogo from '@/components/brand/BrandLogo';
import type { ReactNode } from 'react';
import type { AdminWorkspace } from '@/hooks/useAdminWorkspace';
import { useAuth } from '@/context/AuthContext';

export function AdminLayout({ ws, children }: { ws: AdminWorkspace; children: ReactNode }) {
  const { toast, navigateTo, adminProfile, showToast, pendingMerchantsCount, setMobileMenuOpen, mobileMenuOpen, currentPage } = ws;
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [adminAvatar, setAdminAvatar] = useState(() => localStorage.getItem('admin_avatar'));

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminAvatar(reader.result as string);
        localStorage.setItem('admin_avatar', reader.result as string);
        showToast('Photo de profil mise à jour !');
      };
      reader.readAsDataURL(file);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, badge: null },
    { id: 'users', label: 'Gestion des utilisateurs', icon: Users, badge: null },
    { id: 'merchants', label: 'Gestion des commerçants', icon: Store, badge: null },
    { id: 'merchant-validation', label: 'Validation des commerçants', icon: ShieldCheck, badge: pendingMerchantsCount > 0 ? pendingMerchantsCount : null },
    { id: 'offers-supervision', label: 'Supervision des offres', icon: UtensilsCrossed, badge: null },
    { id: 'orders-supervision', label: 'Supervision des commandes', icon: ShoppingBag, badge: null },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Paramètres', icon: Settings, badge: null }
  ];

  const isNavActive = (itemId: string) => {
    if (itemId === 'users' && (currentPage === 'users' || currentPage === 'user-details')) return true;
    if (itemId === 'merchants' && (currentPage === 'merchants' || currentPage === 'merchant-details')) return true;
    if (itemId === 'orders-supervision' && (currentPage === 'orders-supervision' || currentPage === 'order-details')) return true;
    return currentPage === itemId;
  };

  return (
    <div className="min-h-screen bg-[#F8F1E7] text-stone-800 flex flex-col lg:flex-row">
      {toast && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#E9C98B] shrink-0" />
          <p className="text-sm font-medium leading-snug">{toast}</p>
        </div>
      )}

      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E9C98B]/60 z-30 transition-all duration-300 ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-8 bg-white border border-[#E9C98B] rounded-full p-1 z-50 text-stone-500 hover:text-[#A84F32] shadow-sm">
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-6 border-b border-[#F8F1E7] flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3'}`}>
          <button onClick={() => navigateTo('dashboard')} className="flex items-center text-left group w-full">
            <div className={`flex flex-col items-center ${isCollapsed ? '' : 'items-start gap-2'}`}>
              <BrandLogo className={`w-auto transition-all ${isCollapsed ? 'h-10' : 'h-24'}`} />
              {!isCollapsed && <span className="inline-block px-2 py-0.5 rounded-md bg-[#4C6749]/15 text-[#4C6749] text-[11px] font-extrabold">Administration</span>}
            </div>
          </button>
        </div>

        <div className={`px-4 pt-4 pb-2 ${isCollapsed ? 'flex justify-center px-2' : ''}`}>
          <div className={`p-3.5 rounded-2xl bg-[#F8F1E7]/85 border border-[#E9C98B]/60 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <div className="relative group cursor-pointer shrink-0" onClick={() => document.getElementById('admin-avatar-input')?.click()}>
              <div className="w-10 h-10 rounded-xl bg-[#A84F32] text-white flex items-center justify-center font-extrabold text-sm overflow-hidden">
                {adminAvatar ? <img src={adminAvatar} alt="Admin" className="w-full h-full object-cover" /> : adminProfile.fullName.charAt(0) || 'A'}
              </div>
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-white" />
              </div>
              <input id="admin-avatar-input" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => navigateTo('settings')}>
                <p className="text-sm font-extrabold text-stone-900 truncate">{adminProfile.fullName || 'Administrateur'}</p>
                <p className="text-[11px] text-stone-500 truncate">{adminProfile.role}</p>
              </div>
            )}
          </div>
        </div>

        <nav className={`flex-1 py-3 space-y-1 overflow-y-auto ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.id);
            return (
              <button key={item.id} title={isCollapsed ? item.label : undefined} onClick={() => navigateTo(item.id as Parameters<typeof navigateTo>[0])} className={`w-full flex items-center py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? 'bg-[#A84F32] text-white' : 'text-stone-600 hover:bg-[#F8F1E7]'} ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'}`}>
                <span className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  
                  <div className="relative">
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-stone-500'}`} />
                    {isCollapsed && item.badge !== undefined && item.badge !== null && item.badge > 0 && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#A84F32] text-white text-[9px] font-bold flex items-center justify-center border border-white">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && <span>{item.label}</span>}
                </span>
                
                {!isCollapsed && item.badge !== undefined && item.badge !== null && item.badge > 0 && (
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
        <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E9C98B]/60 px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigateTo('dashboard')} className="flex items-center gap-2.5"><BrandLogo className="h-11 w-auto" /><span className="text-[10px] font-extrabold text-[#4C6749]">Admin</span></button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2.5 rounded-xl bg-[#A84F32] text-white">{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </header>
        <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}