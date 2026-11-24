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

/// Coquille de l'espace étudiant (tiroir + barre inférieure à 5 accès).
class StudentShell extends StatelessWidget {
  const StudentShell({
    super.key,
    required this.currentRoute,
    required this.child,
  });

  final String currentRoute;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final root = AppScope.of(context);
    final student = root.student;
    final unread = student.unreadNotificationsCount;

    final navItems = <SpaceNavItem>[
      const SpaceNavItem(
        label: 'Accueil',
        icon: Icons.home_outlined,
        route: Routes.studentHome,
      ),
      const SpaceNavItem(
        label: 'Explorer les offres',
        icon: Icons.search,
        route: Routes.studentExplore,
        alsoActiveFor: <String>[
          Routes.studentOfferDetails,
          Routes.studentReservation,
          Routes.studentOrderSummary,
          Routes.studentPayment,
          Routes.studentConfirmationQr,
        ],
      ),
      SpaceNavItem(
        label: 'Mes commandes',
        icon: Icons.shopping_bag_outlined,
        route: Routes.studentOrders,
        badge: student.activeOrdersCount > 0 ? student.activeOrdersCount : null,
        alsoActiveFor: const <String>[Routes.studentOrderDetails],
      ),
      SpaceNavItem(
        label: 'Notifications',
        icon: Icons.notifications_none,
        route: Routes.studentNotifications,
        badge: unread > 0 ? unread : null,
      ),
      const SpaceNavItem(
        label: 'Statistiques',
        icon: Icons.bar_chart,
        route: Routes.studentStatistics,
      ),
      const SpaceNavItem(
        label: 'Mon profil',
        icon: Icons.person_outline,
        route: Routes.studentProfile,
      ),
    ];

    final bottomItems = <SpaceNavItem>[
      navItems[0],
      const SpaceNavItem(
        label: 'Explorer',
        icon: Icons.search,
        route: Routes.studentExplore,
        alsoActiveFor: <String>[
          Routes.studentOfferDetails,
          Routes.studentReservation,
          Routes.studentOrderSummary,
          Routes.studentPayment,
          Routes.studentConfirmationQr,
        ],
      ),
      const SpaceNavItem(
        label: 'Commandes',
        icon: Icons.shopping_bag_outlined,
        route: Routes.studentOrders,
        alsoActiveFor: <String>[Routes.studentOrderDetails],
      ),
      const SpaceNavItem(
        label: 'Stats',
        icon: Icons.bar_chart,
        route: Routes.studentStatistics,
      ),
      const SpaceNavItem(
        label: 'Profil',
        icon: Icons.person_outline,
        route: Routes.studentProfile,
      ),
    ];

    return SpaceShell(
      roleLabel: 'Espace Étudiant • ESSECT',
      roleLabelColor: AppColors.green,
      currentRoute: currentRoute,
      navItems: navItems,
      bottomItems: bottomItems,
      headerActions: <Widget>[
        CsIconButton(
          icon: Icons.notifications_none,
          background: AppColors.background,
          foreground: AppColors.stone700,
          badge: unread > 0,
          tooltip: 'Notifications',
          onPressed: () =>
              AppRouter.switchTo(context, Routes.studentNotifications),
        ),
      ],
      drawerProfile: DrawerProfileCard(
        title: student.profile.fullName.isEmpty
            ? 'Mon compte'
            : student.profile.fullName,
        subtitle: student.profile.filiere.isEmpty
            ? student.profile.email
            : student.profile.filiere,
        leading: Avatar(
          src: student.profile.avatar,
          name: student.profile.fullName,
          size: 38,
          background: Colors.white,
        ),
        onTap: () {
          Navigator.of(context).pop();
          AppRouter.switchTo(context, Routes.studentProfile);
        },
      ),
      drawerExtra: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(height: 1, color: AppColors.background),
          const SizedBox(height: 14),
          Row(
            children: [
              const Icon(Icons.auto_awesome, size: 13, color: AppColors.green),
              const SizedBox(width: 6),
              Text(
                'MES AVANTAGES',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.green,
                  letterSpacing: 0.9,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          InkWell(
            onTap: () {
              Navigator.of(context).pop();
              AppRouter.switchTo(context, Routes.studentStatistics);
            },
            borderRadius: AppRadii.rXl,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: AppColors.greenSoft(0.1),
                borderRadius: AppRadii.rXl,
              ),
              child: Row(
                children: [
                  const Icon(
                    Icons.eco_outlined,
                    size: 15,
                    color: AppColors.green,
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      'EcoPoints & Radar ESSECT',
                      style: AppText.t11(
                        weight: FontWeight.w700,
                        color: AppColors.green,
                      ),
                    ),
                  ),
                  Text(
                    '${student.profile.ecoPoints} pts',
                    style: AppText.t11(
                      weight: FontWeight.w800,
                      color: AppColors.green,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      onLogout: () {
        root.auth.signOut();
        Navigator.of(context).pop();
        CsToast.show(context, 'Vous avez été déconnecté(e) de votre session.');
        AppRouter.switchTo(context, Routes.studentLogin);
      },
      child: child,
    );
  }
}
