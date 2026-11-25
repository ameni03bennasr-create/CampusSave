import 'package:material_ui/material_ui.dart';

import '../data/models/user_role.dart';
import '../layouts/admin_shell.dart';
import '../layouts/auth_layout.dart';
import '../layouts/merchant_shell.dart';
import '../layouts/student_shell.dart';
import '../screens/admin/admin_dashboard_screen.dart';
import '../screens/admin/admin_login_screen.dart';
import '../screens/admin/admin_merchant_details_screen.dart';
import '../screens/admin/admin_merchant_validation_screen.dart';
import '../screens/admin/admin_merchants_screen.dart';
import '../screens/admin/admin_offers_supervision_screen.dart';
import '../screens/admin/admin_order_details_screen.dart';
import '../screens/admin/admin_orders_supervision_screen.dart';
import '../screens/admin/admin_settings_screen.dart';
import '../screens/admin/admin_statistics_screen.dart';
import '../screens/admin/admin_user_details_screen.dart';
import '../screens/admin/admin_users_screen.dart';
import '../screens/merchant/establishment_screen.dart';
import '../screens/merchant/merchant_dashboard_screen.dart';
import '../screens/merchant/merchant_login_screen.dart';
import '../screens/merchant/merchant_notifications_screen.dart';
import '../screens/merchant/merchant_offer_form_screen.dart';
import '../screens/merchant/merchant_offers_screen.dart';
import '../screens/merchant/merchant_order_details_screen.dart';
import '../screens/merchant/merchant_orders_screen.dart';
import '../screens/merchant/merchant_register_screen.dart';
import '../screens/merchant/merchant_settings_screen.dart';
import '../screens/merchant/merchant_statistics_screen.dart';
import '../screens/merchant/qr_scanner_screen.dart';
import '../screens/public/landing_screen.dart';
import '../screens/public/not_found_screen.dart';
import '../screens/student/confirmation_qr_screen.dart';
import '../screens/student/explore_offers_screen.dart';
import '../screens/student/my_orders_screen.dart';
import '../screens/student/offer_details_screen.dart';
import '../screens/student/order_summary_screen.dart';
import '../screens/student/payment_screen.dart';
import '../screens/student/reservation_screen.dart';
import '../screens/student/student_home_screen.dart';
import '../screens/student/student_login_screen.dart';
import '../screens/student/student_notifications_screen.dart';
import '../screens/student/student_order_details_screen.dart';
import '../screens/student/student_profile_screen.dart';
import '../screens/student/student_register_screen.dart';
import '../screens/student/student_statistics_screen.dart';
import '../state/app_scope.dart';
import 'page_args.dart';
import 'route_names.dart';

/// Routeur central de l'application.
///
/// Chaque route construit l'Ã©cran **et sa coquille** (espace ou page
/// d'authentification) : les Ã©crans restent ainsi de simples contenus, comme
/// les pages React enfermÃ©es dans leur layout.
abstract final class AppRouter {
  /// GÃ©nÃ¨re la route demandÃ©e, en appliquant les mÃªmes rÃ¨gles d'accÃ¨s que
  /// `RequireRole.tsx` / `SpaceGate.tsx`.
  static Route<dynamic>? generate(RouteSettings settings, AppRoot root) {
    final name = settings.name ?? Routes.landing;
    final args = settings.arguments is PageArgs
        ? settings.arguments as PageArgs
        : const PageArgs();

    final requiredRole = _roleForRoute(name);
    if (requiredRole != null) {
      final signedRole = root.auth.role;
      if (signedRole != requiredRole) {
        // Non connectÃ© (ou rÃ´le diffÃ©rent) : retour Ã  la page de connexion
        // de l'espace demandÃ©, exactement comme le garde de route React.
        final loginRoute = _loginRouteFor(requiredRole);
        return _material(_screenFor(loginRoute, const PageArgs()));
      }
    }

    return _material(_screenFor(name, args));
  }

  static MaterialPageRoute<dynamic> _material(Widget child) =>
      MaterialPageRoute<dynamic>(builder: (_) => child);

  /// Navigue en remplaÃ§ant la pile de l'espace (barre infÃ©rieure, tiroir).
  static void switchTo(BuildContext context, String route, {PageArgs? args}) {
    Navigator.of(
      context,
    ).pushNamedAndRemoveUntil(route, (r) => r.isFirst, arguments: args);
  }

  /// Empile un Ã©cran (parcours de rÃ©servation, pages de dÃ©tail).
  static Future<dynamic> push(
    BuildContext context,
    String route, {
    PageArgs? args,
  }) {
    return Navigator.of(context).pushNamed(route, arguments: args);
  }

  /// Remplace l'Ã©cran courant (Ã©tapes d'un mÃªme parcours).
  static Future<dynamic> replace(
    BuildContext context,
    String route, {
    PageArgs? args,
  }) {
    return Navigator.of(context).pushReplacementNamed(route, arguments: args);
  }

  /// Retour Ã  l'Ã©cran prÃ©cÃ©dent s'il existe, sinon Ã  l'accueil.
  static void back(BuildContext context, {String fallback = Routes.landing}) {
    final navigator = Navigator.of(context);
    if (navigator.canPop()) {
      navigator.pop();
    } else {
      switchTo(context, fallback);
    }
  }

  // --- Correspondance route -> rÃ´le -----------------------------------------
  static UserRole? _roleForRoute(String name) {
    if (name.startsWith('/student') && !_isStudentAuth(name)) {
      return UserRole.student;
    }
    if (name.startsWith('/merchant') && !_isMerchantAuth(name)) {
      return UserRole.merchant;
    }
    if (name.startsWith('/admin') && name != Routes.adminLogin) {
      return UserRole.admin;
    }
    return null;
  }

  static bool _isStudentAuth(String name) =>
      name == Routes.studentLogin || name == Routes.studentRegister;

  static bool _isMerchantAuth(String name) =>
      name == Routes.merchantLogin || name == Routes.merchantRegister;

  static String _loginRouteFor(UserRole role) => switch (role) {
    UserRole.student => Routes.studentLogin,
    UserRole.merchant || UserRole.merchantPending => Routes.merchantLogin,
    UserRole.admin => Routes.adminLogin,
  };

  // --- Construction des Ã©crans ----------------------------------------------
  static Widget _screenFor(String name, PageArgs args) {
    switch (name) {
      // --- Public ------------------------------------------------------------
      case Routes.landing:
        return const LandingScreen();
      case Routes.notFound:
        return const NotFoundScreen();

      // --- Authentification --------------------------------------------------
      case Routes.studentLogin:
        return const AuthLayout(
          variant: AuthVariant.student,
          child: StudentLoginScreen(),
        );
      case Routes.studentRegister:
        return const AuthLayout(
          variant: AuthVariant.student,
          child: StudentRegisterScreen(),
        );
      case Routes.merchantLogin:
        return const AuthLayout(
          variant: AuthVariant.merchant,
          child: MerchantLoginScreen(),
        );
      case Routes.merchantRegister:
        return const AuthLayout(
          variant: AuthVariant.merchant,
          child: MerchantRegisterScreen(),
        );
      case Routes.adminLogin:
        return const AuthLayout(
          variant: AuthVariant.admin,
          child: AdminLoginScreen(),
        );

      // --- Espace Ã©tudiant ---------------------------------------------------
      case Routes.studentHome:
        return const StudentShell(
          currentRoute: Routes.studentHome,
          child: StudentHomeScreen(),
        );
      case Routes.studentExplore:
        return const StudentShell(
          currentRoute: Routes.studentExplore,
          child: ExploreOffersScreen(),
        );
      case Routes.studentOfferDetails:
        return StudentShell(
          currentRoute: Routes.studentOfferDetails,
          child: OfferDetailsScreen(offerId: args.offerId ?? ''),
        );
      case Routes.studentReservation:
        return StudentShell(
          currentRoute: Routes.studentReservation,
          child: ReservationScreen(
            offerId: args.offerId ?? '',
            quantity: args.quantity ?? 1,
          ),
        );
      case Routes.studentOrderSummary:
        return StudentShell(
          currentRoute: Routes.studentOrderSummary,
          child: OrderSummaryScreen(orderId: args.orderId ?? ''),
        );
      case Routes.studentPayment:
        return StudentShell(
          currentRoute: Routes.studentPayment,
          child: PaymentScreen(orderId: args.orderId ?? ''),
        );
      case Routes.studentConfirmationQr:
        return StudentShell(
          currentRoute: Routes.studentConfirmationQr,
          child: ConfirmationQrScreen(orderId: args.orderId ?? ''),
        );
      case Routes.studentOrders:
        return const StudentShell(
          currentRoute: Routes.studentOrders,
          child: MyOrdersScreen(),
        );
      case Routes.studentOrderDetails:
        return StudentShell(
          currentRoute: Routes.studentOrderDetails,
          child: StudentOrderDetailsScreen(orderId: args.orderId ?? ''),
        );
      case Routes.studentProfile:
        return const StudentShell(
          currentRoute: Routes.studentProfile,
          child: StudentProfileScreen(),
        );
      case Routes.studentNotifications:
        return const StudentShell(
          currentRoute: Routes.studentNotifications,
          child: StudentNotificationsScreen(),
        );
      case Routes.studentStatistics:
        return const StudentShell(
          currentRoute: Routes.studentStatistics,
          child: StudentStatisticsScreen(),
        );

      // --- Espace commerÃ§ant -------------------------------------------------
      case Routes.merchantDashboard:
        return const MerchantShell(
          currentRoute: Routes.merchantDashboard,
          child: MerchantDashboardScreen(),
        );
      case Routes.merchantEstablishment:
        return const MerchantShell(
          currentRoute: Routes.merchantEstablishment,
          child: EstablishmentScreen(),
        );
      case Routes.merchantOffers:
        return const MerchantShell(
          currentRoute: Routes.merchantOffers,
          child: MerchantOffersScreen(),
        );
      case Routes.merchantOfferAdd:
        return const MerchantShell(
          currentRoute: Routes.merchantOfferAdd,
          child: MerchantOfferFormScreen(),
        );
      case Routes.merchantOfferEdit:
        return MerchantShell(
          currentRoute: Routes.merchantOfferEdit,
          child: MerchantOfferFormScreen(offerId: args.offerId),
        );
      case Routes.merchantOrders:
        return const MerchantShell(
          currentRoute: Routes.merchantOrders,
          child: MerchantOrdersScreen(),
        );
      case Routes.merchantOrderDetails:
        return MerchantShell(
          currentRoute: Routes.merchantOrderDetails,
          child: MerchantOrderDetailsScreen(orderId: args.orderId ?? ''),
        );
      case Routes.merchantQrScanner:
        return MerchantShell(
          currentRoute: Routes.merchantQrScanner,
          child: QrScannerScreen(prefillCode: args.qrCode),
        );
      case Routes.merchantStatistics:
        return const MerchantShell(
          currentRoute: Routes.merchantStatistics,
          child: MerchantStatisticsScreen(),
        );
      case Routes.merchantNotifications:
        return const MerchantShell(
          currentRoute: Routes.merchantNotifications,
          child: MerchantNotificationsScreen(),
        );
      case Routes.merchantSettings:
        return const MerchantShell(
          currentRoute: Routes.merchantSettings,
          child: MerchantSettingsScreen(),
        );

      // --- Espace administrateur ---------------------------------------------
      case Routes.adminDashboard:
        return const AdminShell(
          currentRoute: Routes.adminDashboard,
          child: AdminDashboardScreen(),
        );
      case Routes.adminUsers:
        return const AdminShell(
          currentRoute: Routes.adminUsers,
          child: AdminUsersScreen(),
        );
      case Routes.adminUserDetails:
        return AdminShell(
          currentRoute: Routes.adminUserDetails,
          child: AdminUserDetailsScreen(userId: args.userId ?? ''),
        );
      case Routes.adminMerchants:
        return const AdminShell(
          currentRoute: Routes.adminMerchants,
          child: AdminMerchantsScreen(),
        );
      case Routes.adminMerchantValidation:
        return const AdminShell(
          currentRoute: Routes.adminMerchantValidation,
          child: AdminMerchantValidationScreen(),
        );
      case Routes.adminMerchantDetails:
        return AdminShell(
          currentRoute: Routes.adminMerchantDetails,
          child: AdminMerchantDetailsScreen(merchantId: args.merchantId ?? ''),
        );
      case Routes.adminOffersSupervision:
        return const AdminShell(
          currentRoute: Routes.adminOffersSupervision,
          child: AdminOffersSupervisionScreen(),
        );
      case Routes.adminOrdersSupervision:
        return const AdminShell(
          currentRoute: Routes.adminOrdersSupervision,
          child: AdminOrdersSupervisionScreen(),
        );
      case Routes.adminOrderDetails:
        return AdminShell(
          currentRoute: Routes.adminOrderDetails,
          child: AdminOrderDetailsScreen(orderId: args.orderId ?? ''),
        );
      case Routes.adminStatistics:
        return const AdminShell(
          currentRoute: Routes.adminStatistics,
          child: AdminStatisticsScreen(),
        );
      case Routes.adminSettings:
        return const AdminShell(
          currentRoute: Routes.adminSettings,
          child: AdminSettingsScreen(),
        );

      default:
        return const NotFoundScreen();
    }
  }
}

