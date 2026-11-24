/// Paramètres transmis d'un écran à l'autre (équivalent des
/// `StudentNavigateOptions` / `MerchantNavigateOptions` / `AdminNavigateOptions`
/// du routeur React).
class PageArgs {
  const PageArgs({
    this.offerId,
    this.orderId,
    this.userId,
    this.merchantId,
    this.quantity,
    this.qrCode,
    this.searchProduct,
    this.searchRestaurant,
    this.category,
  });

  final String? offerId;
  final String? orderId;
  final String? userId;
  final String? merchantId;
  final int? quantity;
  final String? qrCode;
  final String? searchProduct;
  final String? searchRestaurant;
  final String? category;
}
