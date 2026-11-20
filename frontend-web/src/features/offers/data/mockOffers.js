export const mockOffers = [
  {
    id: 'o1',
    title: 'Sandwich Poulet + Jus',
    description: 'Un délicieux sandwich au poulet grillé avec un jus d\'orange frais.',
    initialPrice: 7.500,
    discountedPrice: 4.000,
    category: 'Sandwichs',
    // Vraie image de sandwich
    imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600&auto=format&fit=crop',
    isAvailable: true,
    quantity: 10,
    pickupTime: '12:00 - 14:00',
    merchantId: 'm1',
  },
  {
    id: 'o2',
    title: 'Assortiment de 3 Pâtisseries',
    description: 'Trois pâtisseries au choix parmi la sélection du jour.',
    initialPrice: 9.000,
    discountedPrice: 5.500,
    category: 'Pâtisseries',
    // Vraie image de pâtisseries
    imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?q=80&w=600&auto=format&fit=crop',
    isAvailable: false,
    quantity: 0,
    pickupTime: '16:00 - 18:00',
    merchantId: 'm2',
  },
];