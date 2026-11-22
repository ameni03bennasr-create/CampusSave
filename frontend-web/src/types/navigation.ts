import type { AdminPageId } from '@/config/adminPages';
import type { MerchantPageId } from '@/config/merchantPages';
import type { StudentPageId } from '@/config/studentPages';

/** Optional context carried along a navigation (selected record, search prefill...). */
export interface StudentNavigateOptions {
  offerId?: string;
  quantity?: number;
  orderId?: string;
  searchProduct?: string;
  searchRestaurant?: string;
  category?: string;
}
export type StudentNavigate = (page: StudentPageId, options?: StudentNavigateOptions) => void;

export interface MerchantNavigateOptions {
  offerId?: string;
  orderId?: string;
  qrCode?: string;
}
export type MerchantNavigate = (page: MerchantPageId, params?: MerchantNavigateOptions) => void;

export interface AdminNavigateOptions {
  userId?: string;
  merchantId?: string;
  orderId?: string;
}
export type AdminNavigate = (page: AdminPageId, params?: AdminNavigateOptions) => void;
