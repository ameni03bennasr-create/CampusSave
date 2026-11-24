import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/admin_models.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Supervision des commandes de la plateforme (CampusSave Mobile - Administration).
///
/// Permet l'audit des flux de réservations, le contrôle du statut de paiement
/// et l'accès à la piste d'audit détaillée de chaque commande.
class AdminOrdersSupervisionScreen extends StatefulWidget {
  const AdminOrdersSupervisionScreen({super.key});

  @override
  State<AdminOrdersSupervisionScreen> createState() =>
      _AdminOrdersSupervisionScreenState();
}

class _AdminOrdersSupervisionScreenState
    extends State<AdminOrdersSupervisionScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _selectedFilter = 'Toutes';
  final List<String> _filters = const [
    'Toutes',
    'En attente',
    'Terminée',
    'Annulée',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  bool _matchesStatus(String orderStatus, String filter) {
    final status = orderStatus.toLowerCase();
    return switch (filter) {
      'En attente' =>
        status.contains('attente') ||
            status.contains('cours') ||
            status.contains('prête'),
      'Terminée' => status.contains('termin') || status.contains('récup'),
      'Annulée' => status.contains('annul'),
      _ => true,
    };
  }

  List<AdminOrder> _filterOrders(List<AdminOrder> orders) {
    final query = _searchController.text.trim().toLowerCase();

    return orders.where((order) {
      final matchesSearch =
          query.isEmpty ||
          order.id.toLowerCase().contains(query) ||
          order.studentName.toLowerCase().contains(query) ||
          order.merchantName.toLowerCase().contains(query) ||
          order.productName.toLowerCase().contains(query);

      final matchesStatus =
          _selectedFilter == 'Toutes' ||
          _matchesStatus(order.orderStatus, _selectedFilter);

      return matchesSearch && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final allOrders = admin.orders;
    final filteredOrders = _filterOrders(allOrders);

    final paidOrdersCount = allOrders
        .where((o) => o.paymentStatus.toLowerCase().contains('payé'))
        .length;
    final totalRevenue = allOrders
        .where((o) => o.paymentStatus.toLowerCase().contains('payé'))
        .fold<double>(0, (sum, o) => sum + o.totalAmount);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Supervision des commandes',
          eyebrow: 'FLUX DE TRANSACTIONS',
          subtitle:
              'Suivez en temps réel les réservations, paiements et retraits.',
        ),
        const SizedBox(height: 16),

        // --- Statistiques commandes ---
        Row(
          children: [
            Expanded(
              child: _OrderSummaryCard(
                label: 'Commandes',
                count: '${allOrders.length}',
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _OrderSummaryCard(
                label: 'Payées',
                count: '$paidOrdersCount',
                color: AppColors.green,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _OrderSummaryCard(
                label: 'Encaissé',
                count: Formatters.price(totalRevenue),
                color: AppColors.greenDark,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // --- Champ de recherche ---
        CsTextField(
          label: 'RECHERCHE COMMANDE',
          hint: 'Référence #, étudiant, commerçant, produit...',
          controller: _searchController,
          icon: Icons.search,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 12),

        // --- Filtres de statut ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final filter in _filters) ...[
                Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: _FilterChip(
                    label: filter,
                    selected: _selectedFilter == filter,
                    onTap: () => setState(() => _selectedFilter = filter),
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Nombre de résultats ---
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Commandes enregistrées',
              style: AppText.xs(
                weight: FontWeight.w800,
                color: AppColors.stone900,
              ),
            ),
            Text(
              '${filteredOrders.length} résultat(s)',
              style: AppText.t11(color: AppColors.stone500),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // --- Liste des commandes ---
        if (filteredOrders.isEmpty)
          EmptyState(
            title: 'Aucune commande trouvée',
            description: 'Aucune commande ne correspond aux filtres appliqués.',
            icon: Icons.receipt_long_outlined,
          )
        else
          ...filteredOrders.map((order) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: InkWell(
                onTap: () {
                  AppRouter.push(
                    context,
                    Routes.adminOrderDetails,
                    args: PageArgs(orderId: order.id),
                  );
                },
                borderRadius: AppRadii.rXl,
                child: CsCard(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Commande #${order.id}',
                                  style: AppText.xs(
                                    weight: FontWeight.w800,
                                    color: AppColors.primary,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  order.productName,
                                  style: AppText.sm(
                                    weight: FontWeight.w800,
                                    color: AppColors.stone900,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            Formatters.price(order.totalAmount),
                            style: AppText.base(
                              weight: FontWeight.w900,
                              color: AppColors.greenDark,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text(
                        '${order.merchantName} • Client : ${order.studentName}',
                        style: AppText.t11(color: AppColors.stone600),
                      ),
                      const Divider(height: 20),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              PaymentStatusBadge(
                                status: order.paymentStatus,
                                pendingLabel: 'En attente',
                              ),
                              const SizedBox(width: 6),
                              AdminOrderStatusBadge(status: order.orderStatus),
                            ],
                          ),
                          Row(
                            children: [
                              Text(
                                order.reservationDate,
                                style: AppText.t10(color: AppColors.stone400),
                              ),
                              const SizedBox(width: 4),
                              const Icon(
                                Icons.chevron_right,
                                size: 16,
                                color: AppColors.stone400,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
      ],
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
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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

class _OrderSummaryCard extends StatelessWidget {
  const _OrderSummaryCard({
    required this.label,
    required this.count,
    required this.color,
  });

  final String label;
  final String count;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return CsCard(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppText.t10(color: AppColors.stone500)),
          const SizedBox(height: 2),
          Text(
            count,
            style: AppText.base(weight: FontWeight.w900, color: color),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
