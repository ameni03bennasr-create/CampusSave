import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { STUDENT_BASE_PATH, STUDENT_PAGE_IDS, STUDENT_DEFAULT_PAGE, STUDENT_AUTH_PAGES } from '@/config/studentPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { StudentPageId } from '@/config/studentPages';
import type { StudentNavigateOptions } from '@/types/navigation';
import type { Restaurant, StudentNotification, StudentOffer, StudentOrder, StudentProfile } from '@/types/student';
import { localId } from '@/utils/ids';
import type { ToastKind, ToastState } from '@/types/ui';

interface CartCheckoutItem {
  id: string;
  title: string;
  imageUrl: string;
  quantity: number;
  initialPrice: number;
  discountedPrice: number;
}

const INITIAL_STUDENT: StudentProfile = {
  id: 's1', fullName: 'Yasmine Ben Ali', email: 'yasmine.benali@essect.tn', phone: '+216 55 123 456', filiere: '3ème année E-Business', etablissement: 'ESSECT Tunis', avatar: '', ecoPoints: 340, memberSince: 'Octobre 2026',
};

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'Cafétéria ESSECT', address: 'Bâtiment principal, ESSECT', distanceMeters: 50, type: 'Cafétéria', pickupHours: '12h - 15h', activeOffersCount: 2, rating: 4.5, reviewsCount: 24, phone: '+216 71 000 001', coords: { x: 60, y: 40 } },
  { id: 'r2', name: 'Pâtisserie Le Délice', address: 'Rue de Montfleury, Tunis', distanceMeters: 200, type: 'Pâtisserie', pickupHours: '16h - 19h', activeOffersCount: 1, rating: 4.7, reviewsCount: 18, phone: '+216 71 000 002', coords: { x: 30, y: 60 } },
];

const MOCK_OFFERS: StudentOffer[] = [
  { id: 'o1', title: 'Sandwich Poulet + Jus', description: 'Délicieux sandwich au poulet grillé avec un jus d\'orange frais.', initialPrice: 7.500, reducedPrice: 4.000, category: 'Sandwichs', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop', quantity: 10, pickupHours: '12:00 - 14:00', restaurantId: 'r1', weightKg: 0.3, featured: true, isRecent: true, isSurpriseBasket: false },
  { id: 'o2', title: 'Assortiment de 3 Pâtisseries', description: 'Trois pâtisseries au choix parmi la sélection du jour.', initialPrice: 9.000, reducedPrice: 5.500, category: 'Pâtisseries', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop', quantity: 5, pickupHours: '16:00 - 18:00', restaurantId: 'r2', weightKg: 0.4, featured: true, isRecent: false, isSurpriseBasket: false },
  { id: 'o3', title: 'Panier Surprise', description: 'Un mélange d\'invendus salés et sucrés.', initialPrice: 15.000, reducedPrice: 6.000, category: 'Panier Surprise', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop', quantity: 3, pickupHours: '18:00 - 19:00', restaurantId: 'r1', weightKg: 0.8, featured: false, isRecent: true, isSurpriseBasket: true }
];

export function useStudentWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(pathname, STUDENT_BASE_PATH, STUDENT_PAGE_IDS, STUDENT_DEFAULT_PAGE);
  const isAuthPage = STUDENT_AUTH_PAGES.includes(currentPage);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [offers] = useState<StudentOffer[]>(MOCK_OFFERS);
  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([
    { id: 'n1', type: 'reservation', title: 'Bienvenue sur CampusSave !', message: 'Merci de rejoindre la plateforme. Explorez les offres autour de vous.', timestamp: 'À l’instant', read: false, orderId: '' }
  ]);

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

  const selectedOffer = useMemo(() => offers.find((offer) => offer.id === selectedOfferId), [offers, selectedOfferId]);
  const activeOrder = useMemo(() => orders.find((order) => order.id === activeOrderId), [orders, activeOrderId]);
  const getRestaurant = (restId: string) => restaurants.find((restaurant) => restaurant.id === restId);

  const unreadNotificationsCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);
  const activeOrdersCount = useMemo(() => orders.filter((order) => order.orderStatus.includes('Confirmée') || order.orderStatus.includes('attente')).length, [orders]);

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

  const handleCartCheckout = (cartItems: CartCheckoutItem[], total: number) => {
    void total;
    const newOrders: StudentOrder[] = cartItems.map((item) => {
      const offer = offers.find((candidate) => candidate.id === item.id);
      const restaurant = getRestaurant(offer?.restaurantId || 'r1');
      return {
        id: localId('CMD'),
        offerId: item.id,
        productTitle: item.title,
        productImage: item.imageUrl,
        restaurantId: offer?.restaurantId || 'r1',
        restaurantName: restaurant?.name || 'Commerçant',
        restaurantAddress: restaurant?.address || '',
        quantity: item.quantity,
        initialUnitPrice: item.initialPrice,
        unitPrice: item.discountedPrice,
        totalAmount: Number((item.discountedPrice * item.quantity).toFixed(2)),
        pickupHours: offer?.pickupHours || '12:00 - 14:00',
        createdAt: 'À l’instant',
        paymentStatus: 'Payée',
        orderStatus: 'Confirmée',
        paymentMethod: 'En ligne',
        qrToken: `QR-${Date.now()}-${item.id}`,
        weightKg: Number(((offer?.weightKg || 0.3) * item.quantity).toFixed(2))
      };
    });

    setOrders((previous) => [...newOrders, ...previous]);

    setNotifications((previous) => [
      { id: `notif-${Date.now()}`, type: 'payment', title: 'Paiement confirmé', message: `Vos ${newOrders.length} commandes ont été payées avec succès. Retrouvez vos QR codes dans "Mes commandes".`, timestamp: 'À l’instant', read: false, orderId: newOrders[0]?.id || '' },
      ...previous
    ]);
  };

  const handleCreatePendingOrder = (offer: StudentOffer, qty: number) => {
    const restaurant = getRestaurant(offer.restaurantId);
    const newId = localId('CMD');
    const newOrder: StudentOrder = {
      id: newId,
      offerId: offer.id,
      productTitle: offer.title,
      productImage: offer.image,
      restaurantId: offer.restaurantId,
      restaurantName: restaurant?.name ?? '',
      restaurantAddress: restaurant?.address ?? '',
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
    setOrders((previous) => [newOrder, ...previous]);
    setActiveOrderId(newId);
    setNotifications((previous) => [
      { id: `notif-${Date.now()}`, type: 'reservation', title: `Réservation créée (${newId})`, message: `Vous avez réservé ${qty}x « ${offer.title} ». Finalisez le paiement.`, timestamp: 'À l’instant', read: false, orderId: newId },
      ...previous
    ]);
    navigateTo('order-summary', { orderId: newId });
  };

  return {
    currentPage, isAuthPage, isKnownPage, mobileMenuOpen, setMobileMenuOpen,
    student, setStudent, restaurants, offers, orders, notifications, setNotifications,
    draftQuantity, setDraftQuantity, exploreSearchProduct, exploreSearchRestaurant, exploreCategory,
    toast, showToast, selectedOffer, activeOrder, getRestaurant,
    unreadNotificationsCount, activeOrdersCount, navigateTo, handleCreatePendingOrder,
    handleCartCheckout
  };
}
export type StudentWorkspace = ReturnType<typeof useStudentWorkspace>;