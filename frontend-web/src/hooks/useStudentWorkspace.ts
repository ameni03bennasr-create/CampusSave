import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STUDENT_BASE_PATH, STUDENT_PAGE_IDS, STUDENT_DEFAULT_PAGE, STUDENT_AUTH_PAGES } from '@/config/studentPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { StudentPageId } from '@/config/studentPages';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentNotification, StudentOffer, StudentOrder, StudentProfile } from '@/types/student';
import { localId } from '@/utils/ids';
import type { ToastKind, ToastState } from '@/types/ui';

/**
 * Student workspace: all client-side state and actions of the student space.
 * Extracted verbatim from the original single-file App component.
 * Navigation is now URL-driven (React Router); data is still fixture-backed until Step 4.
 */
const EMPTY_STUDENT: StudentProfile = {
  id: '',
  fullName: '',
  email: '',
  phone: '',
  filiere: '',
  etablissement: '',
  avatar: '',
  ecoPoints: 0,
  memberSince: '',
};

export function useStudentWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(
    pathname,
    STUDENT_BASE_PATH,
    STUDENT_PAGE_IDS,
    STUDENT_DEFAULT_PAGE
  );
  // Login / registration pages are public; everything else is behind the role guard (see SpaceGate).
  const isAuthPage = STUDENT_AUTH_PAGES.includes(currentPage);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // État utilisateur Étudiant
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT);

  // Données de la plateforme : chargées depuis l'API (Étape 3+). Aucune donnée fictive.
  const [restaurants] = useState<Restaurant[]>([]);
  // Offres, Commandes & Notifications
  const [offers] = useState<StudentOffer[]>([]);

  const [orders, setOrders] = useState<StudentOrder[]>([]);

  const [notifications, setNotifications] = useState<StudentNotification[]>([]);

  // Sélection courante pour le parcours Réservation -> Récapitulatif -> Paiement -> QR Code
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const [draftQuantity, setDraftQuantity] = useState(1);

  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);

  // Recherche globale depuis Accueil vers Explorer
  const [exploreSearchProduct, setExploreSearchProduct] = useState('');

  const [exploreSearchRestaurant, setExploreSearchRestaurant] = useState('');

  const [exploreCategory, setExploreCategory] = useState('Tous');

  // Toast de feedback utilisateur
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  // Helpers de récupération d'objets
  const selectedOffer = useMemo(
    () => offers.find((o) => o.id === selectedOfferId),
    [offers, selectedOfferId]
  );

  const activeOrder = useMemo(
    () => orders.find((ord) => ord.id === activeOrderId),
    [orders, activeOrderId]
  );

  const getRestaurant = (restId: string) => restaurants.find((r) => r.id === restId);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const activeOrdersCount = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.orderStatus.includes('Confirmée') ||
          o.orderStatus.includes('attente')
      ).length,
    [orders]
  );

  // Navigation centralisée
  const navigateTo = (page: StudentPageId, options: StudentNavigateOptions = {}) => {
    if (options.offerId) {
      setSelectedOfferId(options.offerId);
      setDraftQuantity(options.quantity || 1);
    }
    if (options.orderId) {
      setActiveOrderId(options.orderId);
    }
    if (options.searchProduct !== undefined) {
      setExploreSearchProduct(options.searchProduct);
    }
    if (options.searchRestaurant !== undefined) {
      setExploreSearchRestaurant(options.searchRestaurant);
    }
    if (options.category !== undefined) {
      setExploreCategory(options.category);
    }
    navigate(`${STUDENT_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions du workflow Réservation & Paiement
  const handleCreatePendingOrder = (offer: StudentOffer, qty: number) => {
    const rest = getRestaurant(offer.restaurantId);
    const newId = localId('CMD');
    const newOrder = {
      id: newId,
      offerId: offer.id,
      productTitle: offer.title,
      productImage: offer.image,
      restaurantId: offer.restaurantId,
      restaurantName: rest?.name ?? '',
      restaurantAddress: rest?.address ?? '',
      quantity: qty,
      initialUnitPrice: offer.initialPrice,
      unitPrice: offer.reducedPrice,
      totalAmount: Number((offer.reducedPrice * qty).toFixed(2)),
      pickupHours: offer.pickupHours,
      createdAt: 'À l’instant',
      paymentStatus: 'En attente',
      orderStatus: 'En attente de paiement',
      paymentMethod: 'En cours de sélection',
      qrToken: null,
      weightKg: Number(((offer.weightKg ?? 0) * qty).toFixed(2))
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newId);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        type: 'reservation',
        title: `Réservation créée (${newId})`,
        message: `Vous avez réservé ${qty}x « ${offer.title} » chez ${rest?.name ?? 'le commerçant'}. Finalisez le paiement pour générer votre QR Code.`,
        timestamp: 'À l’instant',
        read: false,
        orderId: newId
      },
      ...prev
    ]);

    navigateTo('order-summary', { orderId: newId });
  };

  return {
    currentPage,
    isAuthPage,
    isKnownPage,
    mobileMenuOpen,
    setMobileMenuOpen,
    student,
    setStudent,
    restaurants,
    offers,
    orders,
    notifications,
    setNotifications,
    draftQuantity,
    setDraftQuantity,
    exploreSearchProduct,
    exploreSearchRestaurant,
    exploreCategory,
    toast,
    showToast,
    selectedOffer,
    activeOrder,
    getRestaurant,
    unreadNotificationsCount,
    activeOrdersCount,
    navigateTo,
    handleCreatePendingOrder
  };
}

export type StudentWorkspace = ReturnType<typeof useStudentWorkspace>;
