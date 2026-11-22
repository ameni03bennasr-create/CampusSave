import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STUDENT_BASE_PATH, STUDENT_PAGE_IDS, STUDENT_DEFAULT_PAGE, STUDENT_AUTH_PAGES } from '@/config/studentPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { StudentPageId } from '@/config/studentPages';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentNotification, StudentOffer, StudentOrder, StudentProfile } from '@/types/student';
import { localId } from '@/utils/ids';
import type { ToastKind, ToastState } from '@/types/ui';

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

// --- DONNÉES FICTIVES POUR TESTER ---
const MOCK_RESTAURANTS = [
  { id: 'r1', name: 'Cafétéria ESSECT', address: 'Bâtiment principal, ESSECT', distanceMeters: 50 },
  { id: 'r2', name: 'Pâtisserie Le Délice', address: 'Rue de Montfleury, Tunis', distanceMeters: 200 },
] as Restaurant[];

const MOCK_OFFERS: StudentOffer[] = [
  {
    id: 'o1', title: 'Sandwich Poulet + Jus', description: 'Délicieux sandwich au poulet grillé avec un jus d\'orange frais.',
    initialPrice: 7.500, reducedPrice: 4.000, category: 'Sandwichs',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop',
    quantity: 10, pickupHours: '12:00 - 14:00', restaurantId: 'r1', weightKg: 0.3,
    featured: true, isRecent: true, isSurpriseBasket: false
  },
  {
    id: 'o2', title: 'Assortiment de 3 Pâtisseries', description: 'Trois pâtisseries au choix parmi la sélection du jour.',
    initialPrice: 9.000, reducedPrice: 5.500, category: 'Pâtisseries',
    image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop',
    quantity: 5, pickupHours: '16:00 - 18:00', restaurantId: 'r2', weightKg: 0.4,
    featured: false, isRecent: true, isSurpriseBasket: false
  },
  {
    id: 'o3', title: 'Panier Surprise', description: 'Un mélange d\'invendus salés et sucrés.',
    initialPrice: 15.000, reducedPrice: 6.000, category: 'Panier Surprise',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop',
    quantity: 3, pickupHours: '18:00 - 19:00', restaurantId: 'r1', weightKg: 0.8,
    featured: false, isRecent: false, isSurpriseBasket: true
  }
];
// ------------------------------------

export function useStudentWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(
    pathname,
    STUDENT_BASE_PATH,
    STUDENT_PAGE_IDS,
    STUDENT_DEFAULT_PAGE
  );
  const isAuthPage = STUDENT_AUTH_PAGES.includes(currentPage);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [student, setStudent] = useState<StudentProfile>(EMPTY_STUDENT);

  // On remplace les tableaux vides par nos mock data
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [offers] = useState<StudentOffer[]>(MOCK_OFFERS);

  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [draftQuantity, setDraftQuantity] = useState(1);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [exploreSearchProduct, setExploreSearchProduct] = useState('');
  const [exploreSearchRestaurant, setExploreSearchRestaurant] = useState('');
  const [exploreCategory, setExploreCategory] = useState('Tous');
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type });
    setTimeout(() => { setToast(null); }, 3800);
  };

  const selectedOffer = useMemo(() => offers.find((o) => o.id === selectedOfferId), [offers, selectedOfferId]);
  const activeOrder = useMemo(() => orders.find((ord) => ord.id === activeOrderId), [orders, activeOrderId]);
  const getRestaurant = (restId: string) => restaurants.find((r) => r.id === restId);

  const unreadNotificationsCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const activeOrdersCount = useMemo(() => orders.filter((o) => o.orderStatus.includes('Confirmée') || o.orderStatus.includes('attente')).length, [orders]);

  const navigateTo = (page: StudentPageId, options: StudentNavigateOptions = {}) => {
    if (options.offerId) { setSelectedOfferId(options.offerId); setDraftQuantity(options.quantity || 1); }
    if (options.orderId) { setActiveOrderId(options.orderId); }
    if (options.searchProduct !== undefined) setExploreSearchProduct(options.searchProduct);
    if (options.searchRestaurant !== undefined) setExploreSearchRestaurant(options.searchRestaurant);
    if (options.category !== undefined) setExploreCategory(options.category);
    navigate(`${STUDENT_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePendingOrder = (offer: StudentOffer, qty: number) => {
    const rest = getRestaurant(offer.restaurantId);
    const newId = localId('CMD');
    const newOrder = {
      id: newId, offerId: offer.id, productTitle: offer.title, productImage: offer.image,
      restaurantId: offer.restaurantId, restaurantName: rest?.name ?? '', restaurantAddress: rest?.address ?? '',
      quantity: qty, initialUnitPrice: offer.initialPrice, unitPrice: offer.reducedPrice,
      totalAmount: Number((offer.reducedPrice * qty).toFixed(2)), pickupHours: offer.pickupHours,
      createdAt: 'À l’instant', paymentStatus: 'En attente', orderStatus: 'En attente de paiement',
      paymentMethod: 'En cours de sélection', qrToken: null, weightKg: Number(((offer.weightKg ?? 0) * qty).toFixed(2))
    };
    setOrders((prev) => [newOrder, ...prev]);
    setActiveOrderId(newId);
    setNotifications((prev) => [
      { id: `notif-${Date.now()}`, type: 'reservation', title: `Réservation créée (${newId})`, message: `Vous avez réservé ${qty}x « ${offer.title} » chez ${rest?.name ?? 'le commerçant'}. Finalisez le paiement pour générer votre QR Code.`, timestamp: 'À l’instant', read: false, orderId: newId },
      ...prev
    ]);
    navigateTo('order-summary', { orderId: newId });
  };

  return {
    currentPage, isAuthPage, isKnownPage, mobileMenuOpen, setMobileMenuOpen,
    student, setStudent, restaurants, offers, orders, notifications, setNotifications,
    draftQuantity, setDraftQuantity, exploreSearchProduct, exploreSearchRestaurant, exploreCategory,
    toast, showToast, selectedOffer, activeOrder, getRestaurant,
    unreadNotificationsCount, activeOrdersCount, navigateTo, handleCreatePendingOrder
  };
}
export type StudentWorkspace = ReturnType<typeof useStudentWorkspace>;