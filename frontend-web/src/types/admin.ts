/**
 * UI view-model types of the admin space, derived from the existing interface data model.
 * They mirror what the original screens consume 1:1. Step 3 introduces the canonical domain schema
 * (centralized collection/field/status names) and mappers to/from these shapes.
 */

export interface AdminProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  createdAt: string;
  preferences: {
    alertNewMerchant: boolean;
    alertFailedPayments: boolean;
    dailyDigest: boolean;
  };
}

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  registrationDate: string;
  status: string;
  details: {
    filiere?: string;
    ordersCount?: number;
    lastLogin: string;
    establishmentName?: string;
    establishmentId?: string;
  };
}

export interface AdminMerchant {
  id: string;
  userId: string;
  establishmentName: string;
  contactName: string;
  email: string;
  phone: string;
  type: string;
  address: string;
  registrationDate: string;
  validationStatus: string;
  accountActive: boolean;
  photo: string;
  submittedInfo: {
    matriculeFiscal: string;
    openingHours: string;
    description: string;
    distanceEssect: string;
  };
  rejectionReason?: string;
}

export interface AdminOffer {
  id: string;
  productName: string;
  description: string;
  image: string;
  merchantId: string;
  merchantName: string;
  category: string;
  initialPrice: number;
  reducedPrice: number;
  quantity: number;
  publicationStatus: string;
  pickupSchedule: string;
  publishedAt: string;
}

export interface AdminOrder {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  merchantId: string;
  merchantName: string;
  merchantAddress: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  orderStatus: string;
  reservationDate: string;
  pickupSchedule: string;
}

export interface AdminActivity {
  id: string;
  type: string;
  text: string;
  time: string;
}
