import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/merchant_models.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran des notifications de l'espace commerçant.
///
/// Connecté à [MerchantWorkspace.notifications], permet de marquer les alertes
/// comme lues et d'accéder directement au détail de la commande ciblée.
class MerchantNotificationsScreen extends StatefulWidget {
  const MerchantNotificationsScreen({super.key});

  @override
  State<MerchantNotificationsScreen> createState() => _MerchantNotificationsScreenState();
}

class _MerchantNotificationsScreenState extends State<MerchantNotificationsScreen> {
  String _selectedFilter = 'Toutes';

  final List<String> _filters = const ['Toutes', 'Non lues', 'Commandes', 'Offres'];

  List<MerchantNotification> _filterList(List<MerchantNotification> list) {
    if (_selectedFilter == 'Non lues') {
      return list.where((n) => !n.read).toList();
    }
    if (_selectedFilter == 'Commandes') {
      return list.where((n) => n.targetPage == 'order-details' || n.type == 'order').toList();
    }
    if (_selectedFilter == 'Offres') {
      return list.where((n) => n.type == 'offer' || n.type == 'stock').toList();
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final all = workspace.notifications;
    final filtered = _filterList(all);
    final unreadCount = workspace.unreadNotificationsCount;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Notifications',
          subtitle: 'Alertes sur les nouvelles réservations et l’état de vos stocks.',
          trailing: unreadCount > 0
              ? CsButton(
                  label: 'Tout marquer comme lu',
                  variant: CsButtonVariant.ghost,
                  size: CsButtonSize.small,
                  compact: true,
                  onPressed: () {
                    workspace.markAllNotificationsRead();
                    CsToast.show(context, 'Toutes les notifications sont marquées comme lues.');
                  },
                )
              : null,
        ),
        const SizedBox(height: 16),

        // --- Filtres ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final filter in _filters) ...[
                _FilterChip(
                  label: filter,
                  selected: _selectedFilter == filter,
                  badge: filter == 'Non lues' && unreadCount > 0 ? unreadCount : null,
                  onTap: () => setState(() => _selectedFilter = filter),
                ),
                const SizedBox(width: 8),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Liste des notifications ---
        if (filtered.isEmpty)
          EmptyState(
            icon: Icons.notifications_none,
            title: 'Aucune notification',
            description: _selectedFilter == 'Toutes'
                ? 'Aucune alerte reçue pour le moment.'
                : 'Aucune alerte pour le filtre « $_selectedFilter ».',
          )
        else
          Column(
            children: [
              for (final n in filtered) ...[
                _buildNotificationCard(context, n, workspace),
                const SizedBox(height: 10),
              ],
            ],
          ),
      ],
    );
  }

  Widget _buildNotificationCard(
    BuildContext context,
    MerchantNotification n,
    dynamic workspace,
  ) {
    final iconData = switch (n.type) {
      'update' => Icons.check_circle_outline,
      'order' => Icons.shopping_bag_outlined,
      'stock' => Icons.warning_amber_rounded,
      _ => Icons.notifications_outlined,
    };

    final iconColor = switch (n.type) {
      'update' => AppColors.green,
      'order' => AppColors.primary,
      'stock' => AppColors.orange,
      _ => AppColors.stone600,
    };

    return CsCard(
      padding: const EdgeInsets.all(14),
      borderColor: !n.read ? AppColors.goldSoft(0.9) : null,
      onTap: () {
        if (!n.read) {
          workspace.markNotificationRead(n.id);
        }
        if (n.targetPage == 'order-details' && n.targetId.isNotEmpty) {
          AppRouter.push(
            context,
            Routes.merchantOrderDetails,
            args: PageArgs(orderId: n.targetId),
          );
        }
      },
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(9),
            decoration: BoxDecoration(
              color: iconColor.withValues(alpha: 0.12),
              borderRadius: AppRadii.rLg,
            ),
            child: Icon(iconData, color: iconColor, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        n.title,
                        style: AppText.xs(
                          weight: !n.read ? FontWeight.w800 : FontWeight.w700,
                          color: AppColors.stone900,
                        ),
                      ),
                    ),
                    if (!n.read)
                      Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppColors.primary,
                          shape: BoxShape.circle,
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  n.message,
                  style: AppText.t11(color: AppColors.stone700, height: 1.4),
                ),
                const SizedBox(height: 6),
                Text(
                  n.timestamp,
                  style: AppText.t10(color: AppColors.stone400),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
    this.badge,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;
  final int? badge;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadii.rFull,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : Colors.white,
          borderRadius: AppRadii.rFull,
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.goldSoft(0.7),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: AppText.xs(
                weight: selected ? FontWeight.w700 : FontWeight.w500,
                color: selected ? Colors.white : AppColors.stone700,
              ),
            ),
            if (badge != null && badge! > 0) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                decoration: BoxDecoration(
                  color: selected ? Colors.white : AppColors.primary,
                  borderRadius: AppRadii.rFull,
                ),
                child: Text(
                  '$badge',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: selected ? AppColors.primary : Colors.white,
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
