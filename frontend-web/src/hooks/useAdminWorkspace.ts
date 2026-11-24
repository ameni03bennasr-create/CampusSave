import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_BASE_PATH, ADMIN_PAGE_IDS, ADMIN_DEFAULT_PAGE } from '@/config/adminPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { AdminPageId } from '@/config/adminPages';
import type { ToastKind, ToastState } from '@/types/ui';
import { authService, type MockUser } from '@/services/authService';

export function useAdminWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(pathname, ADMIN_BASE_PATH, ADMIN_PAGE_IDS, ADMIN_DEFAULT_PAGE);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  
  const [merchants, setMerchants] = useState<MockUser[]>([]);

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const fetchMerchants = async () => {
    const data = await authService.getAllMerchants();
    setMerchants(data);
  };

  // Charger les commerçants au démarrage
  useEffect(() => {
    let active = true;

    void authService.getAllMerchants().then(data => {
      if (active) {
        setMerchants(data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const approveMerchant = async (uid: string) => {
    await authService.updateMerchantStatus(uid, 'approved');
    await fetchMerchants();
    showToast('Commerçant approuvé avec succès !');
  };

  const rejectMerchant = async (uid: string) => {
    await authService.updateMerchantStatus(uid, 'rejected');
    await fetchMerchants();
    showToast('Demande de commerçant refusée.', 'error');
  };

  const navigateTo = (page: AdminPageId) => {
    navigate(`${ADMIN_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
  };

  const pendingMerchantsCount = merchants.filter(m => m.status === 'pending').length;

  return {
    currentPage, isKnownPage, mobileMenuOpen, setMobileMenuOpen, toast, showToast, navigateTo,
    adminProfile: { fullName: 'Super Admin', role: 'Administration CampusSave' },
    pendingMerchantsCount,
    merchants,
    approveMerchant,
    rejectMerchant
  };
}
export type AdminWorkspace = ReturnType<typeof useAdminWorkspace>;