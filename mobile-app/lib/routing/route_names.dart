/// Table des routes de l'application (reprise des URL du routeur React).
///
/// | React                         | Flutter                        |
/// |-------------------------------|--------------------------------|
/// | `/`                           | [Routes.landing]               |
/// | `/student/<page>`             | [Routes.studentHome]…          |
/// | `/merchant/<page>`            | [Routes.merchantDashboard]…    |
/// | `/admin/<page>`               | [Routes.adminDashboard]…       |
abstract final class Routes {
  // --- Public ---------------------------------------------------------------
  static const String landing = '/';
  static const String notFound = '/notFound';

  // --- Espace étudiant (14 pages) ------------------------------------------
  static const String studentLogin = '/student/login';
  static const String studentRegister = '/student/register';
  static const String studentHome = '/student/home';
  static const String studentExplore = '/student/explore';
  static const String studentOfferDetails = '/student/offer-details';
  static const String studentReservation = '/student/reservation';
  static const String studentOrderSummary = '/student/order-summary';
  static const String studentPayment = '/student/payment';
  static const String studentConfirmationQr = '/student/confirmation-qr';
  static const String studentOrders = '/student/orders';
  static const String studentOrderDetails = '/student/order-details';
  static const String studentProfile = '/student/profile';
  static const String studentNotifications = '/student/notifications';
  static const String studentStatistics = '/student/statistics';

  // --- Espace commerçant (13 pages) ----------------------------------------
  static const String merchantLogin = '/merchant/login';
  static const String merchantRegister = '/merchant/register';
  static const String merchantDashboard = '/merchant/dashboard';
  static const String merchantEstablishment = '/merchant/establishment';
  static const String merchantOffers = '/merchant/offers';
  static const String merchantOfferAdd = '/merchant/add-offer';
  static const String merchantOfferEdit = '/merchant/edit-offer';
  static const String merchantOrders = '/merchant/orders';
  static const String merchantOrderDetails = '/merchant/order-details';
  static const String merchantQrScanner = '/merchant/qr-scanner';
  static const String merchantStatistics = '/merchant/statistics';
  static const String merchantNotifications = '/merchant/notifications';
  static const String merchantSettings = '/merchant/settings';

  // --- Espace administrateur (12 pages) ------------------------------------
  static const String adminLogin = '/admin/login';
  static const String adminDashboard = '/admin/dashboard';
  static const String adminUsers = '/admin/users';
  static const String adminUserDetails = '/admin/user-details';
  static const String adminMerchants = '/admin/merchants';
  static const String adminMerchantValidation = '/admin/merchant-validation';
  static const String adminMerchantDetails = '/admin/merchant-details';
  static const String adminOffersSupervision = '/admin/offers-supervision';
  static const String adminOrdersSupervision = '/admin/orders-supervision';
  static const String adminOrderDetails = '/admin/order-details';
  static const String adminStatistics = '/admin/statistics';
  static const String adminSettings = '/admin/settings';
}
