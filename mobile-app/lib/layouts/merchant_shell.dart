import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';
import '../routing/app_router.dart';
import '../routing/route_names.dart';
import '../state/app_scope.dart';
import '../widgets/cs_buttons.dart';
import '../widgets/cs_feedback.dart';
import '../widgets/safe_image.dart';
import 'space_shell.dart';

/// Coquille de l'espace commerçant : carte établissement dans le tiroir,
/// accès QR Code dans l'en-tête, barre inférieure à 5 accès.
class MerchantShell extends StatelessWidget {
  const MerchantShell({
    super.key,
    required this.currentRoute,
    required this.child,
  });

  final String currentRoute;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final root = AppScope.of(context);
    final workspace = root.merchant;
    final establishment = workspace.establishment;
    final unread = workspace.unreadNotificationsCount;

    final navItems = <SpaceNavItem>[
      const SpaceNavItem(
        label: 'Tableau de bord',
        icon: Icons.dashboard_outlined,
        route: Routes.merchantDashboard,
      ),
      const SpaceNavItem(
        label: 'Mon établissement',
        icon: Icons.storefront_outlined,
        route: Routes.merchantEstablishment,
      ),
      SpaceNavItem(
        label: 'Mes offres',
        icon: Icons.restaurant_outlined,
        route: Routes.merchantOffers,
        badge: workspace.offers.isEmpty ? null : workspace.offers.length,
        alsoActiveFor: const <String>[
          Routes.merchantOfferAdd,
          Routes.merchantOfferEdit,
        ],
      ),
      const SpaceNavItem(
        label: 'Ajouter une offre',
        icon: Icons.add_circle_outline,
        route: Routes.merchantOfferAdd,
      ),
      SpaceNavItem(
        label: 'Commandes',
        icon: Icons.shopping_bag_outlined,
        route: Routes.merchantOrders,
        badge: workspace.pendingPickupCount > 0
            ? workspace.pendingPickupCount
            : null,
        alsoActiveFor: const <String>[Routes.merchantOrderDetails],
      ),
      const SpaceNavItem(
        label: 'Validation QR Code',
        icon: Icons.qr_code_scanner,
        route: Routes.merchantQrScanner,
      ),
      const SpaceNavItem(
        label: 'Statistiques',
        icon: Icons.bar_chart,
        route: Routes.merchantStatistics,
      ),
      SpaceNavItem(
        label: 'Notifications',
        icon: Icons.notifications_none,
        route: Routes.merchantNotifications,
        badge: unread > 0 ? unread : null,
      ),
      const SpaceNavItem(
        label: 'Paramètres',
        icon: Icons.settings_outlined,
        route: Routes.merchantSettings,
      ),
    ];

    final bottomItems = <SpaceNavItem>[
      navItems[0],
      const SpaceNavItem(
        label: 'Offres',
        icon: Icons.restaurant_outlined,
        route: Routes.merchantOffers,
        alsoActiveFor: <String>[
          Routes.merchantOfferAdd,
          Routes.merchantOfferEdit,
        ],
      ),
      const SpaceNavItem(
        label: 'Commandes',
        icon: Icons.shopping_bag_outlined,
        route: Routes.merchantOrders,
        alsoActiveFor: <String>[Routes.merchantOrderDetails],
      ),
      const SpaceNavItem(
        label: 'Scan QR',
        icon: Icons.qr_code_scanner,
        route: Routes.merchantQrScanner,
      ),
      const SpaceNavItem(
        label: 'Stats',
        icon: Icons.bar_chart,
        route: Routes.merchantStatistics,
      ),
    ];

    return SpaceShell(
      roleLabel: 'Espace Commerçant',
      roleLabelColor: AppColors.orange,
      currentRoute: currentRoute,
      navItems: navItems,
      bottomItems: bottomItems,
      maxContentWidth: 780,
      headerActions: <Widget>[
        CsIconButton(
          icon: Icons.qr_code_scanner,
          background: AppColors.green,
          foreground: Colors.white,
          tooltip: 'Scanner un QR Code',
          onPressed: () =>
              AppRouter.switchTo(context, Routes.merchantQrScanner),
        ),
        const SizedBox(width: 8),
        CsIconButton(
          icon: Icons.notifications_none,
          background: AppColors.background,
          foreground: AppColors.stone700,
          badge: unread > 0,
          tooltip: 'Notifications',
          onPressed: () =>
              AppRouter.switchTo(context, Routes.merchantNotifications),
        ),
      ],
      drawerProfile: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.background.withValues(alpha: 0.85),
          borderRadius: AppRadii.rXl2,
          border: Border.all(color: AppColors.goldSoft(0.6)),
        ),
        child: Column(
          children: [
            Row(
              children: [
                SafeImage(
                  src: establishment.logo,
                  width: 38,
                  height: 38,
                  radius: 10,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        establishment.name.isEmpty
                            ? 'Mon établissement'
                            : establishment.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppText.sm(
                          weight: FontWeight.w800,
                          color: AppColors.stone900,
                        ),
                      ),
                      Text(
                        establishment.type.isEmpty
                            ? 'Mon établissement'
                            : establishment.type,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppText.t11(color: AppColors.stone500),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(height: 1, color: AppColors.goldSoft(0.4)),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(
                  Icons.verified_user_outlined,
                  size: 13,
                  color: establishment.adminValidated
                      ? AppColors.green
                      : AppColors.orange,
                ),
                const SizedBox(width: 5),
                Expanded(
                  child: Text(
                    establishment.adminValidated
                        ? 'Validé par l’Admin'
                        : 'En attente de validation',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.t11(
                      weight: FontWeight.w700,
                      color: establishment.adminValidated
                          ? AppColors.green
                          : AppColors.orange,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      onLogout: () {
        root.auth.signOut();
        Navigator.of(context).pop();
        CsToast.show(context, 'Session commerçant fermée.');
        AppRouter.switchTo(context, Routes.merchantLogin);
      },
      child: child,
    );
  }
}
