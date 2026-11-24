/** Page registry for the admin space (ids are also the URL segments: /admin/<id>). */
export const ADMIN_BASE_PATH = '/admin';

export const ALL_12_PAGES = [
    { id: 'login', label: 'Connexion Administrateur' },
    { id: 'dashboard', label: 'Tableau de bord' },
    { id: 'users', label: 'Gestion des utilisateurs' },
    { id: 'user-details', label: 'Détails de l’utilisateur' },
    { id: 'merchants', label: 'Gestion des commerçants' },
    { id: 'merchant-validation', label: 'Validation des commerçants' },
    { id: 'merchant-details', label: 'Détails du commerçant' },
    { id: 'offers-supervision', label: 'Supervision des offres' },
    { id: 'orders-supervision', label: 'Supervision des commandes' },
    { id: 'order-details', label: 'Détails de la commande' },
    { id: 'statistics', label: 'Statistiques de la plateforme' },
    { id: 'settings', label: 'Profil et Paramètres' }
  ] as const;

export type AdminPageId = (typeof ALL_12_PAGES)[number]['id'];

export const ADMIN_PAGE_IDS: readonly AdminPageId[] = ALL_12_PAGES.map((p) => p.id);
export const ADMIN_DEFAULT_PAGE: AdminPageId = 'dashboard';
export const ADMIN_AUTH_PAGES: readonly AdminPageId[] = ['login'];
