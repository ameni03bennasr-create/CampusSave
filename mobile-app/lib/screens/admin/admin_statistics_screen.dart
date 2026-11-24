import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/user_role.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_surfaces.dart';

/// Statistiques et analytique globale de la plateforme (CampusSave Mobile - Administration).
///
/// Dérive l'ensemble de ses métriques des listes réelles de commandes, commerçants,
/// utilisateurs et offres chargées dans [AdminWorkspace].
class AdminStatisticsScreen extends StatelessWidget {
  const AdminStatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final orders = admin.orders;
    final users = admin.users;
    final merchants = admin.merchants;
    final offers = admin.offers;

    final paidOrders = orders.where((order) {
      final status = order.paymentStatus.toLowerCase();
      return status.contains('payé');
    }).toList();

    final pendingOrdersCount = orders.where((order) {
      final status = order.orderStatus.toLowerCase();
      return status.contains('attente') ||
          status.contains('cours') ||
          status.contains('prête');
    }).length;

    final completedOrdersCount = orders.where((order) {
      final status = order.orderStatus.toLowerCase();
      return status.contains('termin') || status.contains('récup');
    }).length;

    final cancelledOrdersCount = orders.where((order) {
      return order.orderStatus.toLowerCase().contains('annul');
    }).length;

    final revenue = paidOrders.fold<double>(
      0,
      (sum, order) => sum + order.totalAmount,
    );

    final averageOrder = paidOrders.isEmpty ? 0.0 : revenue / paidOrders.length;
    final studentsCount = users
        .where((user) => user.role == UserRole.student)
        .length;
    final activeMerchantsCount = merchants
        .where((merchant) => merchant.accountActive)
        .length;
    final publishedOffersCount = offers
        .where((offer) => offer.publicationStatus == 'Publiée')
        .length;
    final totalQuantity = orders.fold<int>(
      0,
      (sum, order) => sum + order.quantity,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Statistiques globales',
          eyebrow: 'ANALYTIQUE PLATEFORME',
          subtitle: 'Indicateurs clés et métriques d’activité en temps réel.',
        ),
        const SizedBox(height: 16),

        // --- Grand bloc Chiffre d'affaires ---
        CsCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.greenSoft(),
                      borderRadius: AppRadii.rLg,
                    ),
                    child: const Icon(
                      Icons.account_balance_wallet_outlined,
                      color: AppColors.greenDark,
                      size: 24,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'CHIFFRE D’AFFAIRES ENCAISSÉ',
                          style: AppText.t10(
                            weight: FontWeight.w700,
                            color: AppColors.stone500,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          Formatters.price(revenue),
                          style: AppText.xl(
                            weight: FontWeight.w900,
                            color: AppColors.greenDark,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const Divider(height: 24),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Commandes réglées',
                          style: AppText.t11(color: AppColors.stone500),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${paidOrders.length}',
                          style: AppText.sm(
                            weight: FontWeight.w800,
                            color: AppColors.stone900,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Panier moyen',
                          style: AppText.t11(color: AppColors.stone500),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          Formatters.price(averageOrder),
                          style: AppText.sm(
                            weight: FontWeight.w800,
                            color: AppColors.stone900,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Grille d'indicateurs fondamentaux ---
        Text(
          'Indicateurs d’adoption',
          style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _MetricCard(
                title: 'Étudiants inscrits',
                value: '$studentsCount',
                icon: Icons.school_outlined,
                color: AppColors.primary,
                background: AppColors.primarySoft(),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _MetricCard(
                title: 'Commerces actifs',
                value: '$activeMerchantsCount',
                icon: Icons.storefront_outlined,
                color: AppColors.orange,
                background: AppColors.orangeSoft(),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _MetricCard(
                title: 'Offres publiées',
                value: '$publishedOffersCount',
                icon: Icons.local_offer_outlined,
                color: AppColors.green,
                background: AppColors.greenSoft(),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _MetricCard(
                title: 'Paniers sauvés',
                value: '$totalQuantity',
                icon: Icons.eco_outlined,
                color: AppColors.primaryDark,
                background: AppColors.goldSoft(),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // --- Répartition des commandes ---
        CsCard(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Répartition des flux de commandes',
                style: AppText.xs(
                  weight: FontWeight.w800,
                  color: AppColors.stone900,
                ),
              ),
              const SizedBox(height: 14),
              _StatusProgressBar(
                label: 'Terminées & retirées',
                count: completedOrdersCount,
                total: orders.isEmpty ? 1 : orders.length,
                color: AppColors.green,
              ),
              const SizedBox(height: 10),
              _StatusProgressBar(
                label: 'En attente de retrait',
                count: pendingOrdersCount,
                total: orders.isEmpty ? 1 : orders.length,
                color: AppColors.amberText,
              ),
              const SizedBox(height: 10),
              _StatusProgressBar(
                label: 'Annulées',
                count: cancelledOrdersCount,
                total: orders.isEmpty ? 1 : orders.length,
                color: AppColors.red600,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- État du réseau commerçant ---
        CsCard(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'État du parc commerçant',
                style: AppText.xs(
                  weight: FontWeight.w800,
                  color: AppColors.stone900,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Total référencés',
                value: '${merchants.length}',
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Comptes actifs habilités',
                value: '$activeMerchantsCount',
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Dossiers en attente de validation',
                value: '${admin.pendingMerchantsCount}',
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Note de transparence ---
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppColors.goldSoft(0.3),
            borderRadius: AppRadii.rLg,
            border: Border.all(color: AppColors.gold),
          ),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(
                Icons.info_outline,
                color: AppColors.amberText,
                size: 18,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Ces données sont issues des flux réels de l’application. Les volumes financiers correspondent uniquement aux règlements confirmés.',
                  style: AppText.xs(color: AppColors.stone700, height: 1.4),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.background,
  });

  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color background;

  @override
  Widget build(BuildContext context) {
    return CsCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: background,
              borderRadius: AppRadii.rLg,
            ),
            child: Icon(icon, color: color, size: 16),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: AppText.lg(
              weight: FontWeight.w900,
              color: AppColors.stone900,
            ),
          ),
          const SizedBox(height: 2),
          Text(title, style: AppText.t11(color: AppColors.stone500)),
        ],
      ),
    );
  }
}

class _StatusProgressBar extends StatelessWidget {
  const _StatusProgressBar({
    required this.label,
    required this.count,
    required this.total,
    required this.color,
  });

  final String label;
  final int count;
  final int total;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final ratio = total > 0 ? (count / total).clamp(0.0, 1.0) : 0.0;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: AppText.t11(color: AppColors.stone700)),
            Text(
              '$count (${(ratio * 100).toStringAsFixed(0)}%)',
              style: AppText.t11(
                weight: FontWeight.w700,
                color: AppColors.stone900,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: AppRadii.rFull,
          child: LinearProgressIndicator(
            value: ratio,
            backgroundColor: AppColors.stone200,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
          ),
        ),
      ],
    );
  }
}
