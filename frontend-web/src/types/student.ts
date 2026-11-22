/**
 * UI view-model types of the student space, derived from the existing interface data model.
 * They mirror what the original screens consume 1:1. Step 3 introduces the canonical domain schema
 * (centralized collection/field/status names) and mappers to/from these shapes.
 */

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  filiere: string;
  etablissement: string;
  avatar: string;
  ecoPoints: number;
  memberSince: string;
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  distanceMeters: number;
  rating: number;
  reviewsCount: number;
  pickupHours: string;
  phone: string;
  coords: {
    x: number;
    y: number;
  };
  activeOffersCount: number;
}

export interface StudentOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  restaurantId: string;
  initialPrice: number;
  reducedPrice: number;
  quantity: number;
  pickupHours: string;
  image: string;
  featured: boolean;
  isRecent: boolean;
  isSurpriseBasket: boolean;
  weightKg: number;
}

export interface StudentOrder {
  id: string;
  offerId: string;
  productTitle: string;
  productImage: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  quantity: number;
  initialUnitPrice: number;
  unitPrice: number;
  totalAmount: number;
  pickupHours: string;
  createdAt: string;
  paymentStatus: string;
  orderStatus: string;
  paymentMethod: string;
  qrToken: string | null;
  weightKg: number;
}

export interface StudentNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  orderId: string;
}

/** Values collected by the student registration form. */
export interface StudentRegistrationForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
