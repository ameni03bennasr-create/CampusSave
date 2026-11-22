/** Page registry for the student space (ids are also the URL segments: /student/<id>). */
export const STUDENT_BASE_PATH = '/student';

export const ALL_14_PAGES = [
  { id: 'register', label: 'Inscription Étudiant' },
  { id: 'login', label: 'Connexion Étudiant' },
  { id: 'home', label: 'Accueil / Tableau de bord' },
  { id: 'explore', label: 'Explorer les offres' },
  { id: 'offer-details', label: 'Détails de l’offre' },
  { id: 'reservation', label: 'Réservation' },
  { id: 'order-summary', label: 'Récapitulatif de commande' },
  { id: 'payment', label: 'Paiement électronique' },
  { id: 'confirmation-qr', label: 'Confirmation / QR Code' },
  { id: 'orders', label: 'Mes commandes' },
  { id: 'order-details', label: 'Détails de la commande' },
  { id: 'profile', label: 'Profil Étudiant' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'statistics', label: 'Statistiques & Bonus' },
  // Vos ajouts
  { id: 'cart', label: 'Mon Panier' },
  { id: 'checkout', label: 'Paiement' },
] as const;

export type StudentPageId = 'home' | 'explore' | 'cart' | 'checkout' | 'offer-details' | 'reservation' | 'order-summary' | 'payment' | 'confirmation-qr' | 'orders' | 'order-details' | 'profile' | 'notifications' | 'statistics' | 'login' | 'register';

export const STUDENT_PAGE_IDS: readonly StudentPageId[] = ALL_14_PAGES.map((p) => p.id);
export const STUDENT_DEFAULT_PAGE: StudentPageId = 'home';
export const STUDENT_AUTH_PAGES: readonly StudentPageId[] = ['login', 'register'];