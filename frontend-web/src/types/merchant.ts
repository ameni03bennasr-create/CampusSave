/**
 * UI view-model types of the merchant space, derived from the existing interface data model.
 * They mirror what the original screens consume 1:1. Step 3 introduces the canonical domain schema
 * (centralized collection/field/status names) and mappers to/from these shapes.
 */

import type { MerchantPageId } from '@/config/merchantPages';

export interface FoodPreset {
  label: string;
  url: string;
}

export interface MerchantProfile {
  id: string;
  fullName: string;
  role: string;
  email: string;
  phone: string;
  personalPhone: string;
  notificationsPrefs: {
    newReservations: boolean;
    paidOrders: boolean;
    lowStock: boolean;
  };
}

export interface MerchantEstablishment {
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  openingHours: string;
  logo: string;
  coverImage: string;
  adminValidated: boolean;
  validatedDate: string;
}

export interface MerchantOffer {
  id: string;
  name: string;
  description: string;
  category: string;
  photo: string;
  initialPrice: number;
  reducedPrice: number;
  quantity: number;
  pickupStart: string;
  pickupEnd: string;
  status: string;
  createdAt: string;
}

export interface MerchantOrder {
  id: string;
  qrToken: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  offerId: string;
  productName: string;
  productPhoto: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  reservationDate: string;
  pickupTime: string;
  collectedAt: string | null;
}

export interface MerchantNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetPage: MerchantPageId;
  targetId: string;
}

/** Values handled by the offer form (inputs are strings until submitted). */
export interface OfferFormValues {
  name: string;
  description: string;
  category: string;
  photo: string;
  initialPrice: number | string;
  reducedPrice: number | string;
  quantity: number | string;
  pickupStart: string;
  pickupEnd: string;
}

/** Submission of the offer form: edit mode also carries the existing offer's identity. */
export type OfferFormSubmission = OfferFormValues & Partial<Pick<MerchantOffer, 'id' | 'createdAt' | 'status'>>;

/** Outcome of a QR validation attempt (merchant scanner). */
export interface QrValidationResult {
  status: 'invalid' | 'already_collected' | 'unpaid' | 'success';
  title: string;
  message: string;
  order?: MerchantOrder;
}

/** Values collected by the merchant account-request form (reviewed by an administrator). */
export interface MerchantRegistrationForm {
  establishmentName: string;
  merchantFullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  establishmentType: string;
}
