import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/student_models.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran « Mes commandes » de l'espace étudiant.
///
/// Relié en temps réel à [StudentWorkspace.orders], permet le filtrage par statut
/// (Toutes, En cours, Terminées, Annulées).
class MyOrdersScreen extends StatefulWidget {
  const MyOrdersScreen({super.key});

  @override
  State<MyOrdersScreen> createState() => _MyOrdersScreenState();
}

class _MyOrdersScreenState extends State<MyOrdersScreen> {
  String _selectedFilter = 'Toutes';

  final List<String> _filters = const ['Toutes', 'En cours', 'Terminées', 'Annulées'];

  List<StudentOrder> _filterOrders(List<StudentOrder> orders) {
    if (_selectedFilter == 'Toutes') return orders;

    return orders.where((order) {
      if (_selectedFilter == 'En cours') {
        return order.isAwaitingPayment ||
            order.orderStatus.contains('Confirmée') ||
            order.orderStatus.contains('attente') ||
            order.orderStatus.contains('récupérer');
      }
      if (_selectedFilter == 'Terminées') {
        return order.isCollected || order.orderStatus == 'Terminée';
      }
      if (_selectedFilter == 'Annulées') {
        return order.orderStatus.contains('Annul');
      }
      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final allOrders = student.orders;
    final filtered = _filterOrders(allOrders);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Mes commandes',
          subtitle: 'Retrouvez l’historique et le suivi de toutes vos réservations.',
        ),
        const SizedBox(height: 16),

        // --- Onglets de filtre ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final filter in _filters) ...[
                _FilterChip(
                  label: filter,
                  selected: _selectedFilter == filter,
                  onTap: () => setState(() => _selectedFilter = filter),
                ),
                const SizedBox(width: 8),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Liste des commandes ---
        if (filtered.isEmpty)
          EmptyState(
            icon: Icons.receipt_long_outlined,
            title: 'Aucune commande dans cette section',
            description: _selectedFilter == 'Toutes'
                ? 'Vous n’avez pas encore passé de commande sur CampusSave.'
                : 'Aucune commande ne correspond au filtre « $_selectedFilter ».',
            actionLabel: 'Découvrir les offres',
            onAction: () => AppRouter.switchTo(context, Routes.studentExplore),
          )
        else
          Column(
            children: [
              for (final order in filtered) ...[
                _buildOrderCard(context, order),
                const SizedBox(height: 12),
              ],
            ],
          ),
      ],
    );
  }

  Widget _buildOrderCard(BuildContext context, StudentOrder order) {
    return CsCard(
      padding: const EdgeInsets.all(16),
      onTap: () {
        AppRouter.push(
          context,
          Routes.studentOrderDetails,
          args: PageArgs(orderId: order.id),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Commande #${order.id}',
                style: AppText.xs(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const Spacer(),
              StudentOrderStatusBadge(status: order.orderStatus),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            order.productTitle,
            style: AppText.base(weight: FontWeight.w700, color: AppColors.stone900),
          ),
          const SizedBox(height: 2),
          Text(
            '${order.restaurantName} • ${order.quantity} portion${order.quantity > 1 ? 's' : ''}',
            style: AppText.xs(color: AppColors.stone600),
          ),
          const Divider(height: 18),
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Retrait : ${order.pickupHours}',
                    style: AppText.t11(color: AppColors.stone500),
                  ),
                  Text(
                    'Réservé le : ${order.createdAt}',
                    style: AppText.t10(color: AppColors.stone400),
                  ),
                ],
              ),
              const Spacer(),
              Text(
                Formatters.price(order.totalAmount),
                style: AppText.sm(weight: FontWeight.w800, color: AppColors.primary),
              ),
              const SizedBox(width: 6),
              const Icon(Icons.chevron_right, size: 18, color: AppColors.stone400),
            ],
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
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

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
        child: Text(
          label,
          style: AppText.xs(
            weight: selected ? FontWeight.w700 : FontWeight.w500,
            color: selected ? Colors.white : AppColors.stone700,
          ),
        ),
      ),
    );
  }
}
