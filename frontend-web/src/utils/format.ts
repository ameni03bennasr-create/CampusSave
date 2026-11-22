/** Formatting and pricing helpers (shared by the Student, Merchant and Administrator spaces). */

/** 5.5 -> "5,50 DT" */
export const formatPrice = (val: number | string): string => `${Number(val).toFixed(2).replace('.', ',')} DT`;

/** Discount percentage, unclamped (original student-space behaviour). */
export const calcDiscountPercent = (initial: number, reduced: number): number =>
  Math.round(((initial - reduced) / initial) * 100);

/** Discount percentage clamped to >= 0 and safe for a zero/invalid initial price (merchant/admin behaviour). */
export const calcDiscount = (initialPrice: number, reducedPrice: number): number => {
  if (!initialPrice || initialPrice <= 0) return 0;
  return Math.max(0, Math.round(((initialPrice - reducedPrice) / initialPrice) * 100));
};
