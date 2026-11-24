import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';
import '../routing/app_router.dart';
import '../routing/route_names.dart';
import '../state/app_scope.dart';
import '../widgets/cs_feedback.dart';
import 'space_shell.dart';

/// Coquille de l'espace administrateur.
///
/// Le layout React d'administration ne comporte **pas** de barre inférieure :
/// la navigation passe uniquement par l'en-tête et le tiroir.
class AdminShell extends StatelessWidget {
  const AdminShell({
    super.key,
    required this.currentRoute,
    required this.child,
  });

  final String currentRoute;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final root = AppScope.of(context);
    final workspace = root.admin;
    final pending = workspace.pendingMerchantsCount;

    final navItems = <SpaceNavItem>[
      const SpaceNavItem(
        label: 'Tableau de bord',
        icon: Icons.dashboard_outlined,
        route: Routes.adminDashboard,
      ),
      const SpaceNavItem(
        label: 'Gestion des utilisateurs',
        icon: Icons.people_outline,
        route: Routes.adminUsers,
        alsoActiveFor: <String>[Routes.adminUserDetails],
      ),
      const SpaceNavItem(
        label: 'Gestion des commerçants',
        icon: Icons.storefront_outlined,
        route: Routes.adminMerchants,
        alsoActiveFor: <String>[Routes.adminMerchantDetails],
      ),
      SpaceNavItem(
        label: 'Validation des commerçants',
        icon: Icons.verified_user_outlined,
        route: Routes.adminMerchantValidation,
        badge: pending > 0 ? pending : null,
      ),
      const SpaceNavItem(
        label: 'Supervision des offres',
        icon: Icons.restaurant_outlined,
        route: Routes.adminOffersSupervision,
      ),
      const SpaceNavItem(
        label: 'Supervision des commandes',
        icon: Icons.shopping_bag_outlined,
        route: Routes.adminOrdersSupervision,
        alsoActiveFor: <String>[Routes.adminOrderDetails],
      ),
      const SpaceNavItem(
        label: 'Statistiques',
        icon: Icons.bar_chart,
        route: Routes.adminStatistics,
      ),
      const SpaceNavItem(
        label: 'Paramètres',
        icon: Icons.settings_outlined,
        route: Routes.adminSettings,
      ),
    ];

    return SpaceShell(
      roleLabel: 'Administration',
      roleLabelColor: AppColors.green,
      currentRoute: currentRoute,
      navItems: navItems,
      bottomItems: const <SpaceNavItem>[],
      showBottomNav: false,
      maxContentWidth: 820,
      headerActions: <Widget>[
        if (pending > 0)
          InkWell(
            onTap: () =>
                AppRouter.switchTo(context, Routes.adminMerchantValidation),
            borderRadius: AppRadii.rXl,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 7),
              decoration: BoxDecoration(
                color: AppColors.goldTint(0.6),
                borderRadius: AppRadii.rXl,
              ),
              child: Text(
                '$pending à valider',
                style: AppText.t11(
                  weight: FontWeight.w800,
                  color: AppColors.amberText,
                ),
              ),
            ),
          ),
      ],
      drawerProfile: DrawerProfileCard(
        title: workspace.profile.fullName.isEmpty
            ? 'Administrateur'
            : workspace.profile.fullName,
        subtitle: workspace.profile.role.isEmpty
            ? 'Administration CampusSave'
            : workspace.profile.role,
        leading: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: AppRadii.rXl,
          ),
          alignment: Alignment.center,
          child: Text(
            _initials(workspace.profile.fullName),
            style: AppText.sm(weight: FontWeight.w800, color: Colors.white),
          ),
        ),
        onTap: () {
          Navigator.of(context).pop();
          AppRouter.switchTo(context, Routes.adminSettings);
        },
      ),
      drawerExtra: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(height: 1, color: AppColors.background),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppRadii.rXl,
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.shield_outlined,
                  size: 14,
                  color: AppColors.green,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Accès restreint — rôle Administrateur',
                    style: AppText.t10(
                      weight: FontWeight.w700,
                      color: AppColors.green,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      onLogout: () {
        root.auth.signOut();
        Navigator.of(context).pop();
        CsToast.show(context, 'Session administrateur fermée.');
        AppRouter.switchTo(context, Routes.adminLogin);
      },
      child: child,
    );
  }

  static String _initials(String name) {
    final parts = name
        .trim()
        .split(RegExp(r'\s+'))
        .where((p) => p.isNotEmpty)
        .toList();
    if (parts.isEmpty) return '?';
    return parts.map((p) => p.substring(0, 1)).join().toUpperCase();
  }
}
