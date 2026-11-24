/** Page registry for the merchant space (ids are also the URL segments: /merchant/<id>). */
export const MERCHANT_BASE_PATH = '/merchant';

export const ALL_13_PAGES = [
    { id: 'register', label: 'Inscription Commerçant' },
    { id: 'login', label: 'Connexion Commerçant' },
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'establishment', label: 'Mon établissement' },
    { id: 'offers', label: 'Mes offres' },
    { id: 'add-offer', label: 'Ajouter une offre' },
    { id: 'edit-offer', label: 'Modifier une offre' },
    { id: 'orders', label: 'Commandes' },
    { id: 'order-details', label: 'Détails de la commande' },
    { id: 'qr-scanner', label: 'Validation QR Code' },
    { id: 'statistics', label: 'Statistiques' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'settings', label: 'Profil et Paramètres' }
  ] as const;

export type MerchantPageId = (typeof ALL_13_PAGES)[number]['id'];

export const MERCHANT_PAGE_IDS: readonly MerchantPageId[] = ALL_13_PAGES.map((p) => p.id);
export const MERCHANT_DEFAULT_PAGE: MerchantPageId = 'dashboard';
export const MERCHANT_AUTH_PAGES: readonly MerchantPageId[] = ['login', 'register'];
