import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_BASE_PATH, ADMIN_PAGE_IDS, ADMIN_DEFAULT_PAGE, ADMIN_AUTH_PAGES } from '@/config/adminPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { AdminPageId } from '@/config/adminPages';
import type { AdminNavigateOptions } from '@/types/navigation';
import type { AdminActivity, AdminMerchant, AdminOffer, AdminOrder, AdminProfile, AdminUser } from '@/types/admin';

/**
 * Admin workspace: all client-side state and actions of the admin space.
 * Extracted verbatim from the original single-file App component.
 * Navigation is now URL-driven (React Router); data is still fixture-backed until Step 4.
 */
const EMPTY_ADMIN: AdminProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  role: '',
  department: '',
  createdAt: '',
  preferences: { alertNewMerchant: true, alertFailedPayments: true, dailyDigest: false },
};

export function useAdminWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(
    pathname,
    ADMIN_BASE_PATH,
    ADMIN_PAGE_IDS,
    ADMIN_DEFAULT_PAGE
  );
  // Login / registration pages are public; everything else is behind the role guard (see SpaceGate).
  const isAuthPage = ADMIN_AUTH_PAGES.includes(currentPage);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Données globales supervisées par l'Administrateur
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(EMPTY_ADMIN);

  const [users, setUsers] = useState<AdminUser[]>([]);

  const [merchants, setMerchants] = useState<AdminMerchant[]>([]);

  const [offers] = useState<AdminOffer[]>([]);

  const [orders] = useState<AdminOrder[]>([]);

  const [activities, setActivities] = useState<AdminActivity[]>([]);

  // Sélections actives pour les pages de détails (Pages 04, 07, 10)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [selectedMerchantId, setSelectedMerchantId] = useState<string | null>(null);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Toast global
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3800);
  };

  // Compteur dynamique des demandes commerçants en attente de validation
  const pendingMerchantsCount = useMemo(
    () => merchants.filter((m) => m.validationStatus === 'En attente').length,
    [merchants]
  );

  // Navigation centralisée
  const navigateTo = (page: AdminPageId, params: AdminNavigateOptions = {}) => {
    if (params.userId) setSelectedUserId(params.userId);
    if (params.merchantId) setSelectedMerchantId(params.merchantId);
    if (params.orderId) setSelectedOrderId(params.orderId);
    navigate(`${ADMIN_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions Admin : Activer / Désactiver un compte utilisateur
  const handleToggleUserStatus = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target || target.role === 'Administrateur') return;

    const nextStatus = target.status === 'Actif' ? 'Désactivé' : 'Actif';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: nextStatus } : u))
    );
    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        type: 'user',
        text: `Compte utilisateur ${target.fullName} (${target.id}) passé au statut « ${nextStatus} ».`,
        time: 'À l’instant'
      },
      ...prev
    ]);
    showToast(`Le compte de ${target.fullName} est désormais « ${nextStatus} ».`);
  };

  // Actions Admin : Approuver ou Rejeter une demande commerçant
  const handleMerchantDecision = (merchantId: string, decision: string, reason = '') => {
    const target = merchants.find((m) => m.id === merchantId);
    if (!target) return;

    const isApproved = decision === 'Validé';

    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              validationStatus: decision,
              accountActive: isApproved,
              rejectionReason: isApproved ? '' : reason || 'Dossier non conforme aux critères ESSECT.'
            }
          : m
      )
    );

    // Synchroniser le statut du compte utilisateur associé
    setUsers((prev) =>
      prev.map((u) =>
        u.id === target.userId
          ? { ...u, status: isApproved ? 'Actif' : 'Désactivé' }
          : u
      )
    );

    setActivities((prev) => [
      {
        id: `ACT-${Date.now()}`,
        type: isApproved ? 'merchant_approved' : 'merchant_rejected',
        text: isApproved
          ? `Établissement « ${target.establishmentName} » validé par l’administrateur.`
          : `Demande d’inscription de « ${target.establishmentName} » rejetée.`,
        time: 'À l’instant'
      },
      ...prev
    ]);

    showToast(
      isApproved
        ? `Établissement « ${target.establishmentName} » approuvé ! Son compte commerçant est maintenant actif.`
        : `Inscription de « ${target.establishmentName} » rejetée.`
    );
  };

  return {
    currentPage,
    isAuthPage,
    isKnownPage,
    mobileMenuOpen,
    setMobileMenuOpen,
    adminProfile,
    setAdminProfile,
    users,
    merchants,
    offers,
    orders,
    activities,
    selectedUserId,
    selectedMerchantId,
    selectedOrderId,
    toast,
    showToast,
    pendingMerchantsCount,
    navigateTo,
    handleToggleUserStatus,
    handleMerchantDecision
  };
}

export type AdminWorkspace = ReturnType<typeof useAdminWorkspace>;
