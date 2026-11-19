export const MOCK_MERCHANTS = [
  {
    id: 'MER-201',
    name: 'Bistro Montfleury',
    description: 'Restaurant universitaire proposant des plats tunisiens faits maison à 90 mètres de l’ESSECT.',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
    specialty: 'Plats chauds & Cuisine locale',
    status: 'Approuvé', // En attente, Approuvé, Refusé
    email: 'karim@bistromontfleury.tn'
  },
  {
    id: 'MER-204',
    name: 'Snack ESSECT Express',
    description: 'Restauration rapide étudiante, crêpes salées et sandwichs escalope.',
    logo: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=200&q=80',
    specialty: 'Fast-food & Sandwichs',
    status: 'En attente',
    email: 'direction@snack-essect.tn'
  }
];

export const MOCK_OFFERS = [
  {
    id: 'OFF-101',
    title: 'Escalope Grillée, Riz Safrané',
    description: 'Assiette complète du midi avec blanc de poulet mariné.',
    price: 5.5,
    originalPrice: 12.0,
    category: 'Plats chauds',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    merchantName: 'Bistro Montfleury',
    isAvailable: true,
    portions: 6
  },
  {
    id: 'OFF-105',
    title: 'Assortiment 4 Viennoiseries',
    description: 'Sélection du jour : 2 croissants, 1 pain au chocolat, 1 brioche.',
    price: 3.2,
    originalPrice: 7.2,
    category: 'Viennoiseries',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    merchantName: 'Cafétéria L’Olivier',
    isAvailable: false, // Épuisé
    portions: 0
  }
];