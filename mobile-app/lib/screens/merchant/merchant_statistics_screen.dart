import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran des statistiques pour le commerçant.
///
/// Calcule les métriques réelles à partir des commandes enregistrées dans
/// [MerchantWorkspace.orders].
class MerchantStatisticsScreen extends StatefulWidget {
  const MerchantStatisticsScreen({super.key});

  @override
  State<MerchantStatisticsScreen> createState() => _MerchantStatisticsScreenState();
}

class _MerchantStatisticsScreenState extends State<MerchantStatisticsScreen> {
  String _period = 'Cette semaine';

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final orders = workspace.orders;

    final paidOrders = orders.where((o) => o.paymentStatus == 'Payée').toList();
    final collectedOrders = orders.where((o) => o.isCollected).toList();
    final revenue = workspace.revenuePaid;
    final foodSavedKg = workspace.foodSavedKg;
    final avgOrder = paidOrders.isEmpty ? 0.0 : revenue / paidOrders.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Statistiques & Performance',
          eyebrow: 'ESPACE ANALYTIQUE',
          subtitle: 'Suivez vos ventes anti-gaspillage et l’impact écologique de votre commerce.',
          trailing: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _period,
              icon: const Icon(Icons.arrow_drop_down, color: AppColors.stone600),
              style: AppText.xs(weight: FontWeight.w700, color: AppColors.stone700),
              items: const [
                DropdownMenuItem(value: 'Cette semaine', child: Text('Cette semaine')),
                DropdownMenuItem(value: 'Ce mois', child: Text('Ce mois')),
                DropdownMenuItem(value: 'Cette année', child: Text('Cette année')),
              ],
              onChanged: (val) {
                if (val != null) setState(() => _period = val);
              },
            ),
          ),
        ),
        const SizedBox(height: 16),

        // --- Grille de KPIs principaux ---
        CsKpiGrid(
          children: [
            StatCard(
              label: 'Chiffre d’affaires',
              value: Formatters.price(revenue),
              note: 'issu des commandes réglées',
              icon: Icons.payments_outlined,
              valueColor: AppColors.primary,
            ),
            StatCard(
              label: 'Paniers sauvés',
              value: '${collectedOrders.length}',
              note: 'retirés par les étudiants',
              icon: Icons.check_circle_outline,
              valueColor: AppColors.green,
            ),
            StatCard(
              label: 'Nourriture sauvée',
              value: '${foodSavedKg.toStringAsFixed(1)} kg',
              note: 'repas détournés du gaspillage',
              icon: Icons.scale_outlined,
              valueColor: AppColors.stone800,
            ),
            StatCard(
              label: 'Panier moyen',
              value: Formatters.price(avgOrder),
              note: 'par commande réglée',
              icon: Icons.shopping_basket_outlined,
              valueColor: AppColors.amberText,
            ),
          ],
        ),
        const SizedBox(height: 18),

        // --- Détails des commandes ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bilan des commandes',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Total des réservations reçues',
                value: '${orders.length}',
              ),
              CsInfoRow(
                label: 'Commandes réglées',
                value: '${paidOrders.length}',
                valueColor: AppColors.green,
              ),
              CsInfoRow(
                label: 'Retraits validés au comptoir',
                value: '${collectedOrders.length}',
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Taux de récupération',
                value: orders.isEmpty
                    ? '0 %'
                    : '${((collectedOrders.length / orders.length) * 100).round()} %',
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // --- Impact écologique du commerce ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.eco, color: AppColors.green, size: 22),
                  const SizedBox(width: 8),
                  Text(
                    'Impact environnemental ESSECT',
                    style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'En valorisant vos surplus plutôt qu’en les jetant, vous avez permis d’éviter le gaspillage de ${foodSavedKg.toStringAsFixed(1)} kg de denrées alimentaires fraîches autour du campus.',
                style: AppText.xs(color: AppColors.stone600, height: 1.4),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
