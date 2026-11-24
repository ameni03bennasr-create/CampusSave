import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran des statistiques et d'impact pour l'étudiant.
///
/// Calcule les métriques réelles à partir des commandes payées et de
/// l'état du profil (EcoPoints, kg de nourriture sauvés, économies en dinars).
class StudentStatisticsScreen extends StatelessWidget {
  const StudentStatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final profile = student.profile;
    final orders = student.orders;

    final completedOrders = orders.where((o) => o.isPaid || o.isCollected).toList();
    final totalMeals = completedOrders.fold<int>(0, (sum, o) => sum + o.quantity);
    final totalSaved = completedOrders.fold<double>(
      0,
      (sum, o) => sum + ((o.initialUnitPrice - o.unitPrice) * o.quantity),
    );
    final totalWeight = completedOrders.fold<double>(
      0,
      (sum, o) => sum + o.weightKg,
    );
    final totalSpent = completedOrders.fold<double>(
      0,
      (sum, o) => sum + o.totalAmount,
    );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Mon impact & Statistiques',
          subtitle: 'Suivez vos économies réalisées et votre impact anti-gaspillage à l’ESSECT.',
        ),
        const SizedBox(height: 16),

        // --- Grille de KPIs principaux ---
        CsKpiGrid(
          children: [
            StatCard(
              label: 'Repas sauvés',
              value: '$totalMeals',
              note: 'repas retirés avec succès',
              icon: Icons.dinner_dining_outlined,
              valueColor: AppColors.green,
            ),
            StatCard(
              label: 'Économies totales',
              value: Formatters.price(totalSaved),
              note: 'économisés sur le budget',
              icon: Icons.savings_outlined,
              valueColor: AppColors.primary,
            ),
            StatCard(
              label: 'Poids sauvé',
              value: '${totalWeight.toStringAsFixed(1)} kg',
              note: 'nourriture non gaspillée',
              icon: Icons.scale_outlined,
              valueColor: AppColors.stone800,
            ),
            StatCard(
              label: 'EcoPoints',
              value: '${profile.ecoPoints}',
              note: 'points de fidélité actifs',
              icon: Icons.eco_outlined,
              valueColor: AppColors.green,
            ),
          ],
        ),
        const SizedBox(height: 18),

        // --- Carte Programme de fidélité ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.stars_rounded, color: AppColors.gold, size: 24),
                  const SizedBox(width: 8),
                  Text(
                    'Programme Fidélité ESSECT',
                    style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Chaque repas sauvé vous rapporte 10 EcoPoints. À partir de 100 points, vous bénéficiez de réductions supplémentaires auprès des commerces partenaires.',
                style: AppText.xs(color: AppColors.stone600, height: 1.4),
              ),
              const SizedBox(height: 12),
              CsSplitBar(
                leftFraction: (profile.ecoPoints % 100) / 100.0,
                leftColor: AppColors.green,
                rightColor: AppColors.stone200,
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Text(
                    '${profile.ecoPoints % 100} / 100 pts vers le prochain palier',
                    style: AppText.t11(color: AppColors.stone500),
                  ),
                  const Spacer(),
                  Text(
                    'Palier ${profile.ecoPoints ~/ 100 + 1}',
                    style: AppText.t11(weight: FontWeight.w700, color: AppColors.green),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // --- Répartition des dépenses vs économies ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bilan financier',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Total dépensé sur l’application',
                value: Formatters.price(totalSpent),
              ),
              CsInfoRow(
                label: 'Total des remises obtenues',
                value: Formatters.price(totalSaved),
                valueColor: AppColors.green,
              ),
              CsInfoRow(
                label: 'Commandes totales passées',
                value: '${orders.length}',
              ),
              CsInfoRow(
                label: 'Commandes complétées',
                value: '${completedOrders.length}',
              ),
            ],
          ),
        ),
      ],
    );
  }
}
