import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/merchant_models.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran « Commandes » de l'espace commerçant.
///
/// Connecté à [MerchantWorkspace.orders], permet le suivi et le filtrage des
/// commandes clients (Toutes, À récupérer, Récupérées, En attente).
class MerchantOrdersScreen extends StatefulWidget {
  const MerchantOrdersScreen({super.key});

  @override
  State<MerchantOrdersScreen> createState() => _MerchantOrdersScreenState();
}

class _MerchantOrdersScreenState extends State<MerchantOrdersScreen> {
  final _searchController = TextEditingController();
  String _selectedFilter = 'Toutes';

  final List<String> _filters = const ['Toutes', 'À récupérer', 'Récupérées', 'En attente'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<MerchantOrder> _filterOrders(List<MerchantOrder> orders) {
    final query = _searchController.text.trim().toLowerCase();

    return orders.where((order) {
      final matchesSearch = query.isEmpty ||
          order.studentName.toLowerCase().contains(query) ||
          order.productName.toLowerCase().contains(query) ||
          order.id.toLowerCase().contains(query);

      final matchesFilter = switch (_selectedFilter) {
        'À récupérer' => order.orderStatus == 'Payée / À récupérer',
        'Récupérées' => order.orderStatus == 'Récupérée',
        'En attente' => order.orderStatus == 'En attente' || order.orderStatus.contains('attente'),
        _ => true,
      };

      return matchesSearch && matchesFilter;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final allOrders = workspace.orders;
    final filtered = _filterOrders(allOrders);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Commandes reçues',
          subtitle: 'Suivez les réservations et validez les retraits de vos paniers.',
        ),
        const SizedBox(height: 16),

        // --- Recherche ---
        CsSearchField(
          controller: _searchController,
          hint: 'Rechercher par référence, client ou produit…',
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 14),

        // --- Filtres ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final filter in _filters) ...[
                _FilterChip(
                  label: filter,
                  selected: _selectedFilter == filter,
                  badge: filter == 'À récupérer' && workspace.pendingPickupCount > 0
                      ? workspace.pendingPickupCount
                      : null,
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
            icon: Icons.shopping_bag_outlined,
            title: 'Aucune commande dans cette section',
            description: _selectedFilter == 'Toutes'
                ? 'Aucune commande n’a été enregistrée pour votre établissement.'
                : 'Aucune commande ne correspond au filtre « $_selectedFilter ».',
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

  Widget _buildOrderCard(BuildContext context, MerchantOrder order) {
    return CsCard(
      padding: const EdgeInsets.all(16),
      onTap: () {
        AppRouter.push(
          context,
          Routes.merchantOrderDetails,
          args: PageArgs(orderId: order.id),
        );
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                order.id,
                style: AppText.xs(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const Spacer(),
              MerchantOrderStatusBadge(status: order.orderStatus),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            order.studentName,
            style: AppText.base(weight: FontWeight.w700, color: AppColors.stone900),
          ),
          const SizedBox(height: 2),
          Text(
            '${order.quantity}x ${order.productName} • ${order.pickupTime}',
            style: AppText.xs(color: AppColors.stone600),
          ),
          const Divider(height: 18),
          Row(
            children: [
              PaymentStatusBadge(status: order.paymentStatus),
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
