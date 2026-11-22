export const ASSOCIATION_BASE_PATH = '/association';

export const ALL_ASSOCIATION_PAGES = [
  { id: 'login', label: 'Connexion Association' },
  { id: 'register', label: 'Inscription Association' },
  { id: 'home', label: 'Tableau de bord Club' },
  { id: 'explore', label: 'Explorer les offres' },
  { id: 'cart', label: 'Panier Groupé' },
  { id: 'checkout', label: 'Paiement' },
  { id: 'orders', label: 'Demandes Groupées' },
  { id: 'profile', label: 'Profil du Club' },
] as const;

export type AssociationPageId = 'login' | 'register' | 'home' | 'explore' | 'cart' | 'checkout' | 'orders' | 'profile';
export const ASSOCIATION_PAGE_IDS: readonly AssociationPageId[] = ALL_ASSOCIATION_PAGES.map((p) => p.id);
export const ASSOCIATION_DEFAULT_PAGE: AssociationPageId = 'home';
export const ASSOCIATION_AUTH_PAGES: readonly AssociationPageId[] = ['login', 'register'];