import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MERCHANT_BASE_PATH, MERCHANT_PAGE_IDS, MERCHANT_DEFAULT_PAGE, MERCHANT_AUTH_PAGES } from '@/config/merchantPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { MerchantPageId } from '@/config/merchantPages';
import type { MerchantNavigateOptions } from '@/types/navigation';
import type {
  MerchantEstablishment,
  MerchantNotification,
  MerchantOffer,
  MerchantOrder,
  MerchantProfile,
  OfferFormSubmission,
  QrValidationResult,
} from '@/types/merchant';
import { localId, nowLabel } from '@/utils/ids';
import type { ToastKind, ToastState } from '@/types/ui';

/**
 * Merchant workspace: all client-side state and actions of the merchant space.
 * Extracted verbatim from the original single-file App component.
 * Navigation is now URL-driven (React Router); data is still fixture-backed until Step 4.
 */
const EMPTY_MERCHANT: MerchantProfile = {
  id: '',
  fullName: '',
  role: '',
  email: '',
  phone: '',
  personalPhone: '',
  notificationsPrefs: { newReservations: true, paidOrders: true, lowStock: true },
};

const EMPTY_ESTABLISHMENT: MerchantEstablishment = {
  name: '',
  type: '',
  address: '',
  phone: '',
  email: '',
  description: '',
  openingHours: '',
  logo: '',
  coverImage: '',
  adminValidated: false,
  validatedDate: '',
};

export function useMerchantWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(
    pathname,
    MERCHANT_BASE_PATH,
    MERCHANT_PAGE_IDS,
    MERCHANT_DEFAULT_PAGE
  );
  // Login / registration pages are public; everything else is behind the role guard (see SpaceGate).
  const isAuthPage = MERCHANT_AUTH_PAGES.includes(currentPage);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // États métier Commerçant
  const [merchant, setMerchant] = useState<MerchantProfile>(EMPTY_MERCHANT);

  const [establishment, setEstablishment] = useState<MerchantEstablishment>(EMPTY_ESTABLISHMENT);

  const [offers, setOffers] = useState<MerchantOffer[]>([]);

  const [orders, setOrders] = useState<MerchantOrder[]>([]);

  const [notifications, setNotifications] = useState<MerchantNotification[]>([]);

  // Sélections actives pour Édition d'offre, Détails commande & Validation QR
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [prefillQrCode, setPrefillQrCode] = useState('');

  // Toast global
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // Compteurs dynamiques
  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const pendingPickupCount = useMemo(
    () =>
      orders.filter(
        (o) => o.orderStatus === 'Payée / À récupérer' || o.orderStatus === 'En attente'
      ).length,
    [orders]
  );

  // Fonction centrale de navigation
  const navigateTo = (page: MerchantPageId, params: MerchantNavigateOptions = {}) => {
    if (params.offerId) setEditingOfferId(params.offerId);
    if (params.orderId) setSelectedOrderId(params.orderId);
    if (params.qrCode !== undefined) setPrefillQrCode(params.qrCode);
    navigate(`${MERCHANT_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions CRUD sur les Offres
  const handleAddOffer = (newOfferData: OfferFormSubmission) => {
    const newId = localId('OFF');
    const qty = Number(newOfferData.quantity);
    const created = {
      ...newOfferData,
      id: newId,
      initialPrice: Number(newOfferData.initialPrice),
      reducedPrice: Number(newOfferData.reducedPrice),
      quantity: qty,
      status: qty === 0 ? 'Épuisée' : qty <= 2 ? 'Stock faible' : 'Active',
      createdAt: 'À l’instant'
    };
    setOffers((prev) => [created, ...prev]);
    showToast(`Offre « ${created.name} » publiée avec succès !`);
    navigateTo('offers');
  };

  const handleUpdateOffer = (updatedOffer: OfferFormSubmission) => {
    const qty = Number(updatedOffer.quantity);
    const normalized: MerchantOffer = {
      ...updatedOffer,
      id: updatedOffer.id ?? '',
      createdAt: updatedOffer.createdAt ?? 'À l’instant',
      initialPrice: Number(updatedOffer.initialPrice),
      reducedPrice: Number(updatedOffer.reducedPrice),
      quantity: qty,
      status: qty === 0 ? 'Épuisée' : qty <= 2 ? 'Stock faible' : 'Active'
    };
    setOffers((prev) => prev.map((o) => (o.id === normalized.id ? normalized : o)));
    showToast(`Les modifications sur « ${normalized.name} » ont été enregistrées.`);
    navigateTo('offers');
  };

  const handleDeleteOffer = (offerId: string) => {
    const target = offers.find((o) => o.id === offerId);
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    showToast(`L’offre « ${target?.name || offerId} » a été supprimée.`, 'info');
  };

  // Action métier critique : Validation d'un QR Code étudiant
  // Règle stricte : Seule une commande PAYÉE ("Payée / À récupérer") peut devenir "Récupérée"
  const handleValidateQrCode = (rawInput: string): QrValidationResult => {
    const query = rawInput.trim().toUpperCase();
    if (!query) {
      return {
        status: 'invalid',
        title: 'Code vide ou illisible',
        message: 'Veuillez scanner un QR Code ou saisir une référence de commande valide (ex: #CS-2026-841).'
      };
    }

    const matchedOrder = orders.find(
      (ord) =>
        ord.id.toUpperCase() === query ||
        ord.id.replace('#', '').toUpperCase() === query ||
        ord.qrToken.toUpperCase() === query
    );

    if (!matchedOrder) {
      return {
        status: 'invalid',
        title: 'QR Code invalide ou introuvable',
        message: `Aucune commande enregistrée chez ${establishment.name} ne correspond au code « ${rawInput} ».`
      };
    }

    if (matchedOrder.orderStatus === 'Récupérée') {
      return {
        status: 'already_collected',
        title: 'Commande déjà récupérée',
        message: `Ce QR Code (${matchedOrder.id}) a déjà été validé le ${
          matchedOrder.collectedAt || 'précédemment'
        }. Remise en double refusée.`,
        order: matchedOrder
      };
    }

    if (matchedOrder.paymentStatus !== 'Payée' || matchedOrder.orderStatus === 'En attente') {
      return {
        status: 'unpaid',
        title: 'Paiement non confirmé — Validation refusée',
        message: `La commande ${matchedOrder.id} de ${matchedOrder.studentName} est en statut « ${matchedOrder.paymentStatus} ». Conformément aux règles CampusSave, une commande non payée ne peut pas être remise.`,
        order: matchedOrder
      };
    }

    if (matchedOrder.orderStatus === 'Annulée') {
      return {
        status: 'invalid',
        title: 'Commande annulée',
        message: `La commande ${matchedOrder.id} a été annulée suite à un échec de paiement.`,
        order: matchedOrder
      };
    }

    // Succès : la commande est payée et prête à récupérer -> Passage à "Récupérée"
    const nowTime = nowLabel();
    const updatedOrder = {
      ...matchedOrder,
      orderStatus: 'Récupérée',
      collectedAt: nowTime
    };

    setOrders((prev) => prev.map((o) => (o.id === matchedOrder.id ? updatedOrder : o)));
    setNotifications((prev) => [
      {
        id: `NOTIF-${Date.now()}`,
        type: 'update',
        title: `Retrait validé par QR Code (${matchedOrder.id})`,
        message: `Commande de ${matchedOrder.studentName} (${matchedOrder.quantity}× ${matchedOrder.productName}) marquée comme Récupérée.`,
        timestamp: 'À l’instant',
        read: false,
        targetPage: 'order-details',
        targetId: matchedOrder.id
      },
      ...prev
    ]);

    showToast(`Commande ${matchedOrder.id} validée et marquée comme Récupérée !`);

    return {
      status: 'success',
      title: 'QR Code valide — Retrait confirmé !',
      message: `La commande ${matchedOrder.id} a été vérifiée et mise à jour au statut « Récupérée ».`,
      order: updatedOrder
    };
  };

  return {
    currentPage,
    isAuthPage,
    isKnownPage,
    mobileMenuOpen,
    setMobileMenuOpen,
    merchant,
    setMerchant,
    establishment,
    setEstablishment,
    offers,
    orders,
    notifications,
    setNotifications,
    editingOfferId,
    setEditingOfferId,
    selectedOrderId,
    prefillQrCode,
    toast,
    showToast,
    unreadNotificationsCount,
    pendingPickupCount,
    navigateTo,
    handleAddOffer,
    handleUpdateOffer,
    handleDeleteOffer,
    handleValidateQrCode
  };
}

export type MerchantWorkspace = ReturnType<typeof useMerchantWorkspace>;
