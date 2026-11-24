import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ASSOCIATION_BASE_PATH, ASSOCIATION_PAGE_IDS, ASSOCIATION_DEFAULT_PAGE } from '@/config/associationPages';
import { resolveSpacePage } from '@/routes/spaceRouting';
import type { AssociationPageId } from '@/config/associationPages';
import type { ToastKind, ToastState } from '@/types/ui';
import type { StudentNavigateOptions } from '@/types/navigation';
import { localId } from '@/utils/ids';

interface Restaurant { id: string; name: string; address: string; distanceMeters: number; type: string; pickupHours: string; activeOffersCount: number; coords: { x: number; y: number }; }
interface Offer { id: string; title: string; description: string; initialPrice: number; reducedPrice: number; category: string; image: string; quantity: number; pickupHours: string; restaurantId: string; weightKg: number; featured: boolean; isRecent: boolean; isSurpriseBasket: boolean; }
interface CartItem { id: string; title: string; imageUrl: string; quantity: number; discountedPrice: number; }
interface AssociationOrder {
  id: string;
  offerId: string;
  productTitle: string;
  productImage: string;
  restaurantId: string;
  restaurantName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  createdAt: string;
  status: string;
}

const MOCK_RESTAURANTS: Restaurant[] = [
  { id: 'r1', name: 'Cafétéria ESSECT', address: 'Bâtiment principal, ESSECT', distanceMeters: 50, type: 'Cafétéria', pickupHours: '12h - 15h', activeOffersCount: 2, coords: { x: 60, y: 40 } },
  { id: 'r2', name: 'Pâtisserie Le Délice', address: 'Rue de Montfleury, Tunis', distanceMeters: 200, type: 'Pâtisserie', pickupHours: '16h - 19h', activeOffersCount: 1, coords: { x: 30, y: 60 } },
];

const MOCK_OFFERS: Offer[] = [
  { id: 'o1', title: 'Sandwich Poulet + Jus', description: 'Délicieux sandwich au poulet grillé avec un jus d\'orange frais.', initialPrice: 7.500, reducedPrice: 4.000, category: 'Sandwichs', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop', quantity: 10, pickupHours: '12:00 - 14:00', restaurantId: 'r1', weightKg: 0.3, featured: true, isRecent: true, isSurpriseBasket: false },
  { id: 'o2', title: 'Assortiment de 3 Pâtisseries', description: 'Trois pâtisseries au choix parmi la sélection du jour.', initialPrice: 9.000, reducedPrice: 5.500, category: 'Pâtisseries', image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop', quantity: 5, pickupHours: '16:00 - 18:00', restaurantId: 'r2', weightKg: 0.4, featured: true, isRecent: false, isSurpriseBasket: false },
  { id: 'o3', title: 'Panier Surprise', description: 'Un mélange d\'invendus salés et sucrés.', initialPrice: 15.000, reducedPrice: 6.000, category: 'Panier Surprise', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=600&auto=format&fit=crop', quantity: 3, pickupHours: '18:00 - 19:00', restaurantId: 'r1', weightKg: 0.8, featured: false, isRecent: true, isSurpriseBasket: true }
];

export function useAssociationWorkspace() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { page: currentPage, isKnownPage } = resolveSpacePage(pathname, ASSOCIATION_BASE_PATH, ASSOCIATION_PAGE_IDS, ASSOCIATION_DEFAULT_PAGE);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [offers] = useState<Offer[]>(MOCK_OFFERS);
  const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [draftQuantity, setDraftQuantity] = useState(1);
  
  // 1. On ajoute un état pour stocker l'historique de l'association
  const [orders, setOrders] = useState<AssociationOrder[]>([]);

  const [association, setAssociation] = useState({
    name: 'Club Informatique ESSECT',
    memberCount: 45,
    university: 'Université de Tunis',
    email: 'contact@ci-essect.tn',
    avatar: null as string | null
  });

  const showToast = (message: string, type: ToastKind = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3800);
  };

  const selectedOffer = useMemo(() => offers.find((o) => o.id === selectedOfferId), [offers, selectedOfferId]);
  const getRestaurant = (restId: string) => restaurants.find((r) => r.id === restId);

  const navigateTo = (page: AssociationPageId, options: StudentNavigateOptions = {}) => {
    if (options.offerId) {
      setSelectedOfferId(options.offerId);
      setDraftQuantity(options.quantity || 1);
    }
    navigate(`${ASSOCIATION_BASE_PATH}/${page}`);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 2. On ajoute la fonction de validation de commande
  const handleCartCheckout = (cartItems: CartItem[], total: number) => {
    const newOrders = cartItems.map((item) => {
      const offer = offers.find(o => o.id === item.id);
      const rest = getRestaurant(offer?.restaurantId || 'r1');
      return {
        id: localId('REQ'),
        offerId: item.id,
        productTitle: item.title,
        productImage: item.imageUrl,
        restaurantId: offer?.restaurantId || 'r1',
        restaurantName: rest?.name || 'Commerçant',
        quantity: item.quantity,
        unitPrice: item.discountedPrice,
        totalAmount: item.discountedPrice * item.quantity,
        createdAt: 'À l’instant',
        status: 'Confirmée'
      };
    });

    setOrders(prev => [...newOrders, ...prev]);
    showToast(`Commande groupée de ${newOrders.length} article(s) (${total.toFixed(3)} TND) validée !`);
  };

  return {
    currentPage, isKnownPage, mobileMenuOpen, setMobileMenuOpen, toast, showToast, navigateTo,
    offers, restaurants, selectedOffer, getRestaurant, draftQuantity, setDraftQuantity,
    association, setAssociation,
    orders, // <-- Export de l'historique
    handleCartCheckout // <-- Export de la fonction
  };
}
export type AssociationWorkspace = ReturnType<typeof useAssociationWorkspace>;