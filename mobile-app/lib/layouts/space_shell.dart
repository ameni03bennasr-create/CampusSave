import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';
import '../routing/app_router.dart';
import '../widgets/brand_logo.dart';
import '../widgets/cs_buttons.dart';

/// Élément de navigation d'un espace (sidebar React -> tiroir + barre mobile).
class SpaceNavItem {
  const SpaceNavItem({
    required this.label,
    required this.icon,
    required this.route,
    this.badge,
    this.alsoActiveFor = const <String>[],
  });

  final String label;
  final IconData icon;
  final String route;

  /// Compteur affiché à droite de l'entrée (`badge` du layout React).
  final int? badge;

  /// Pages enfants qui gardent l'entrée active (ex. détails d'une commande).
  final List<String> alsoActiveFor;

  bool isActive(String currentRoute) =>
      route == currentRoute || alsoActiveFor.contains(currentRoute);
}

/// Coquille commune aux trois espaces : en-tête blanc, tiroir de navigation,
/// barre inférieure mobile et zone de contenu.
///
/// Adaptation mobile du layout React « sidebar 288 px + header + contenu » :
/// sur téléphone la sidebar devient un tiroir et les 5 accès principaux sont
/// repris dans une barre inférieure, comme dans le prototype web responsive.
class SpaceShell extends StatelessWidget {
  const SpaceShell({
    super.key,
    required this.roleLabel,
    required this.roleLabelColor,
    required this.currentRoute,
    required this.navItems,
    required this.bottomItems,
    required this.child,
    required this.onLogout,
    this.headerActions = const <Widget>[],
    this.drawerProfile,
    this.drawerExtra,
    this.showBottomNav = true,
    this.maxContentWidth = 760,
    this.headerHeight = 62,
  });

  final String roleLabel;
  final Color roleLabelColor;
  final String currentRoute;
  final List<SpaceNavItem> navItems;
  final List<SpaceNavItem> bottomItems;
  final List<Widget> headerActions;
  final Widget? drawerProfile;
  final Widget? drawerExtra;
  final Widget child;
  final VoidCallback onLogout;
  final bool showBottomNav;
  final double maxContentWidth;
  final double headerHeight;

  void _go(BuildContext context, SpaceNavItem item) {
    Navigator.of(context).pop(); // ferme le tiroir si ouvert
    AppRouter.switchTo(context, item.route);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      drawer: _buildDrawer(context),
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(headerHeight),
        child: _buildHeader(context),
      ),
      body: SafeArea(
        top: false,
        bottom: false,
        child: SingleChildScrollView(
          padding: EdgeInsets.fromLTRB(16, 18, 16, showBottomNav ? 96 : 32),
          child: Center(
            child: ConstrainedBox(
              constraints: BoxConstraints(maxWidth: maxContentWidth),
              child: child,
            ),
          ),
        ),
      ),
      bottomNavigationBar: showBottomNav ? _buildBottomBar(context) : null,
    );
  }

  // --- En-tête ---------------------------------------------------------------
  Widget _buildHeader(BuildContext context) {
    return Container(
      height: headerHeight,
      padding: const EdgeInsets.symmetric(horizontal: 14),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.goldSoft(0.6))),
        boxShadow: const <BoxShadow>[
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: InkWell(
              onTap: () => AppRouter.switchTo(context, navItems.first.route),
              borderRadius: AppRadii.rLg,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const BrandLogo(height: 38),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      roleLabel,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppText.t10(
                        weight: FontWeight.w800,
                        color: roleLabelColor,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          ...headerActions,
          const SizedBox(width: 8),
          Builder(
            builder: (context) => CsIconButton(
              icon: Icons.menu,
              onPressed: () => Scaffold.of(context).openDrawer(),
              tooltip: 'Menu',
            ),
          ),
        ],
      ),
    );
  }

  // --- Tiroir de navigation ---------------------------------------------------
  Widget _buildDrawer(BuildContext context) {
    return Drawer(
      width: 292,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(),
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 12),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const BrandLogo(height: 52),
                        const SizedBox(height: 4),
                        Text(
                          roleLabel,
                          style: AppText.t11(
                            weight: FontWeight.w800,
                            color: roleLabelColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                  CsIconButton(
                    icon: Icons.close,
                    size: 34,
                    background: AppColors.background,
                    foreground: AppColors.stone700,
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),
            if (drawerProfile != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 14, 16, 6),
                child: drawerProfile!,
              ),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                children: [
                  Text(
                    'NAVIGATION',
                    style: AppText.t10(
                      weight: FontWeight.w800,
                      color: AppColors.stone400,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 8),
                  for (final item in navItems)
                    _DrawerTile(
                      item: item,
                      active: item.isActive(currentRoute),
                      onTap: () => _go(context, item),
                    ),
                  if (drawerExtra != null) ...[
                    const SizedBox(height: 16),
                    drawerExtra!,
                  ],
                ],
              ),
            ),
            const Divider(height: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: InkWell(
                onTap: onLogout,
                borderRadius: AppRadii.rXl,
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    vertical: 12,
                    horizontal: 12,
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        Icons.logout,
                        size: 18,
                        color: AppColors.red700,
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Déconnexion',
                        style: AppText.sm(
                          weight: FontWeight.w700,
                          color: AppColors.red700,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Barre inférieure -------------------------------------------------------
  Widget _buildBottomBar(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: AppColors.goldSoft(0.6))),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 62,
          child: Row(
            children: [
              for (final item in bottomItems)
                Expanded(
                  child: _BottomTile(
                    item: item,
                    active: item.isActive(currentRoute),
                    onTap: () => AppRouter.switchTo(context, item.route),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DrawerTile extends StatelessWidget {
  const _DrawerTile({
    required this.item,
    required this.active,
    required this.onTap,
  });

  final SpaceNavItem item;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Material(
        color: active ? AppColors.primary : Colors.transparent,
        borderRadius: AppRadii.rXl,
        child: InkWell(
          onTap: onTap,
          borderRadius: AppRadii.rXl,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
            child: Row(
              children: [
                Icon(
                  item.icon,
                  size: 18,
                  color: active ? Colors.white : AppColors.stone500,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    item.label,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.sm(
                      weight: FontWeight.w600,
                      color: active ? Colors.white : AppColors.stone700,
                    ),
                  ),
                ),
                if (item.badge != null && item.badge! > 0)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 7,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: active
                          ? Colors.white
                          : AppColors.orange.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      '${item.badge}',
                      style: AppText.t11(
                        weight: FontWeight.w800,
                        color: active ? AppColors.primary : AppColors.primary,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BottomTile extends StatelessWidget {
  const _BottomTile({
    required this.item,
    required this.active,
    required this.onTap,
  });

  final SpaceNavItem item;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            item.icon,
            size: 21,
            color: active ? AppColors.primary : AppColors.stone500,
          ),
          const SizedBox(height: 2),
          Text(
            item.label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppText.t10(
              weight: FontWeight.w700,
              color: active ? AppColors.primary : AppColors.stone500,
            ),
          ),
        ],
      ),
    );
  }
}

/// Carte de profil affichée en haut du tiroir (équivalent de la carte
/// « profil rapide » de la sidebar React).
class DrawerProfileCard extends StatelessWidget {
  const DrawerProfileCard({
    super.key,
    required this.title,
    required this.subtitle,
    this.leading,
    this.trailing,
    this.onTap,
  });

  final String title;
  final String subtitle;
  final Widget? leading;
  final Widget? trailing;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadii.rXl2,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.background.withValues(alpha: 0.85),
          borderRadius: AppRadii.rXl2,
          border: Border.all(color: AppColors.goldSoft(0.6)),
        ),
        child: Row(
          children: [
            if (leading != null) ...[leading!, const SizedBox(width: 10)],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.sm(
                      weight: FontWeight.w800,
                      color: AppColors.stone900,
                    ),
                  ),
                  const SizedBox(height: 1),
                  Text(
                    subtitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppText.t11(color: AppColors.stone500),
                  ),
                ],
              ),
            ),
            ?trailing,
          ],
        ),
      ),
    );
  }
}
