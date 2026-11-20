export const mockOrders = [
  {
    id: 'CMD-1029',
    date: '2026-11-19',
    total: 9.000,
    status: 'Prête', // 'En attente', 'Prête', 'Récupérée'
    qrCodeValue: 'CMD-1029-VALIDATION-XYZ',
    items: [
      { id: 'o1', title: 'Sandwich Poulet + Jus', quantity: 1, price: 4.000 },
      { id: 'o2', title: 'Assortiment de 3 Pâtisseries', quantity: 1, price: 5.000 },
    ]
  },
  {
    id: 'CMD-1028',
    date: '2026-11-15',
    total: 4.000,
    status: 'Récupérée',
    qrCodeValue: 'CMD-1028-VALIDATION-ABC',
    items: [
      { id: 'o1', title: 'Sandwich Poulet + Jus', quantity: 1, price: 4.000 },
    ]
  }
];