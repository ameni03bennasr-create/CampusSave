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
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_surfaces.dart';

/// Tableau de bord administrateur (CampusSave Mobile).
///
/// Vue d'ensemble connectée à [AdminWorkspace] : indicateurs clés, alertes de
/// validation de commerçants et journal d'activité de la plateforme.
class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final profile = admin.profile;
    final pendingCount = admin.pendingMerchantsCount;
    final publishedOffersCount = admin.offers
        .where((o) => o.publicationStatus == 'Publiée')
        .length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Tableau de bord',
          eyebrow: 'SUPERVISION GLOBALE',
          subtitle:
              'Bienvenue ${profile.fullName.isNotEmpty ? profile.fullName : 'Administrateur'} • Vue d’ensemble de la plateforme.',
        ),
        const SizedBox(height: 16),

        // --- Alerte demandes en attente si > 0 ---
        if (pendingCount > 0) ...[
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.orangeSoft(),
              borderRadius: AppRadii.rXl,
              border: Border.all(color: AppColors.gold),
            ),
            child: Row(
              children: [
                const Icon(
                  Icons.pending_actions_outlined,
                  color: AppColors.amberText,
                  size: 24,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '$pendingCount demande(s) commerçant en attente',
                        style: AppText.xs(
                          weight: FontWeight.w800,
                          color: AppColors.amberText,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Des dossiers nécessitent votre vérification avant d’autoriser la publication d’offres.',
                        style: AppText.t11(color: AppColors.stone700),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                CsButton(
                  label: 'Traiter',
                  variant: CsButtonVariant.primary,
                  size: CsButtonSize.small,
                  compact: true,
                  onPressed: () {
                    AppRouter.switchTo(context, Routes.adminMerchantValidation);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],

        // --- Grille de KPIs ---
        Row(
          children: [
            Expanded(
              child: _AdminKpiCard(
                title: 'Étudiants',
                value: '${admin.totalStudents}',
                icon: Icons.school_outlined,
                color: AppColors.primary,
                background: AppColors.primarySoft(),
                onTap: () => AppRouter.switchTo(context, Routes.adminUsers),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _AdminKpiCard(
                title: 'Commerçants',
                value: '${admin.merchants.length}',
                icon: Icons.storefront_outlined,
                color: AppColors.orange,
                background: AppColors.orangeSoft(),
                onTap: () => AppRouter.switchTo(context, Routes.adminMerchants),
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _AdminKpiCard(
                title: 'Offres actives',
                value: '$publishedOffersCount',
                icon: Icons.local_offer_outlined,
                color: AppColors.green,
                background: AppColors.greenSoft(),
                onTap: () =>
                    AppRouter.switchTo(context, Routes.adminOffersSupervision),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _AdminKpiCard(
                title: 'Commandes',
                value: '${admin.orders.length}',
                icon: Icons.receipt_long_outlined,
                color: AppColors.primaryDark,
                background: AppColors.goldSoft(),
                onTap: () =>
                    AppRouter.switchTo(context, Routes.adminOrdersSupervision),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // --- Carte Chiffre d'Affaires ---
        CsCard(
          padding: const EdgeInsets.all(18),
          child: Row(
            children: [
              Container(
                width: 46,
                height: 46,
                decoration: BoxDecoration(
                  color: AppColors.greenSoft(),
                  borderRadius: AppRadii.rLg,
                ),
                child: const Icon(
                  Icons.trending_up,
                  color: AppColors.greenDark,
                  size: 24,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Volume d’affaires total (payé)',
                      style: AppText.t11(
                        weight: FontWeight.w700,
                        color: AppColors.stone500,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      Formatters.price(admin.totalRevenue),
                      style: AppText.xl(
                        weight: FontWeight.w900,
                        color: AppColors.greenDark,
                      ),
                    ),
                  ],
                ),
              ),
              CsButton(
                label: 'Statistiques',
                variant: CsButtonVariant.secondary,
                size: CsButtonSize.small,
                compact: true,
                onPressed: () =>
                    AppRouter.switchTo(context, Routes.adminStatistics),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // --- Raccourcis de gestion rapide ---
        Text(
          'Modules de gestion',
          style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            _QuickActionChip(
              icon: Icons.people_outline,
              label: 'Utilisateurs',
              onTap: () => AppRouter.switchTo(context, Routes.adminUsers),
            ),
            _QuickActionChip(
              icon: Icons.store_outlined,
              label: 'Commerçants',
              onTap: () => AppRouter.switchTo(context, Routes.adminMerchants),
            ),
            _QuickActionChip(
              icon: Icons.verified_user_outlined,
              label: 'Validations ($pendingCount)',
              onTap: () =>
                  AppRouter.switchTo(context, Routes.adminMerchantValidation),
            ),
            _QuickActionChip(
              icon: Icons.shopping_bag_outlined,
              label: 'Commandes',
              onTap: () =>
                  AppRouter.switchTo(context, Routes.adminOrdersSupervision),
            ),
            _QuickActionChip(
              icon: Icons.settings_outlined,
              label: 'Paramètres',
              onTap: () => AppRouter.switchTo(context, Routes.adminSettings),
            ),
          ],
        ),
        const SizedBox(height: 24),

        // --- Dernières demandes commerçants ---
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Dossiers commerçants récents',
              style: AppText.sm(
                weight: FontWeight.w800,
                color: AppColors.stone900,
              ),
            ),
            if (pendingCount > 0)
              InkWell(
                onTap: () =>
                    AppRouter.switchTo(context, Routes.adminMerchantValidation),
                child: Text(
                  'Voir tout ($pendingCount)',
                  style: AppText.xs(
                    weight: FontWeight.w700,
                    color: AppColors.primary,
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(height: 10),
        if (admin.pendingMerchants.isEmpty)
          CsCard(
            padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
            child: Center(
              child: Column(
                children: [
                  const Icon(
                    Icons.check_circle_outline,
                    color: AppColors.green,
                    size: 32,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Tous les dossiers commerçants sont à jour.',
                    style: AppText.xs(
                      weight: FontWeight.w700,
                      color: AppColors.stone700,
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ...admin.pendingMerchants.take(3).map((merchant) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: CsCard(
                padding: const EdgeInsets.all(14),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: AppColors.orangeSoft(),
                        borderRadius: AppRadii.rLg,
                      ),
                      child: const Icon(
                        Icons.store_outlined,
                        color: AppColors.amberText,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            merchant.establishmentName,
                            style: AppText.sm(
                              weight: FontWeight.w800,
                              color: AppColors.stone900,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${merchant.type} • Contact: ${merchant.contactName}',
                            style: AppText.t11(color: AppColors.stone500),
                          ),
                        ],
                      ),
                    ),
                    CsButton(
                      label: 'Examiner',
                      variant: CsButtonVariant.secondary,
                      size: CsButtonSize.small,
                      compact: true,
                      onPressed: () {
                        AppRouter.push(
                          context,
                          Routes.adminMerchantDetails,
                          args: PageArgs(merchantId: merchant.id),
                        );
                      },
                    ),
                  ],
                ),
              ),
            );
          }),
        const SizedBox(height: 24),

        // --- Journal d'activité récente ---
        Text(
          'Journal d’activité récente',
          style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
        ),
        const SizedBox(height: 10),
        if (admin.activities.isEmpty)
          CsCard(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            child: Center(
              child: Text(
                'Aucune activité enregistrée pour le moment.',
                style: AppText.xs(color: AppColors.stone500),
              ),
            ),
          )
        else
          CsCard(
            padding: const EdgeInsets.all(14),
            child: Column(
              children: [
                for (
                  int i = 0;
                  i < admin.activities.take(5).toList().length;
                  i++
                ) ...[
                  if (i > 0) const Divider(height: 18),
                  _ActivityTile(activity: admin.activities[i]),
                ],
              ],
            ),
          ),
      ],
    );
  }
}

class _AdminKpiCard extends StatelessWidget {
  const _AdminKpiCard({
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    required this.background,
    required this.onTap,
  });

  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final Color background;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadii.rXl,
      child: CsCard(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: background,
                    borderRadius: AppRadii.rLg,
                  ),
                  child: Icon(icon, color: color, size: 18),
                ),
                const Icon(
                  Icons.arrow_forward_ios,
                  size: 12,
                  color: AppColors.stone400,
                ),
              ],
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
            Text(
              title,
              style: AppText.t11(
                weight: FontWeight.w600,
                color: AppColors.stone500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _QuickActionChip extends StatelessWidget {
  const _QuickActionChip({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  final IconData icon;
  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadii.rFull,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: AppRadii.rFull,
          border: Border.all(color: AppColors.stone200),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 15, color: AppColors.primary),
            const SizedBox(width: 6),
            Text(
              label,
              style: AppText.t11(
                weight: FontWeight.w700,
                color: AppColors.stone800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActivityTile extends StatelessWidget {
  const _ActivityTile({required this.activity});

  final AdminActivity activity;

  @override
  Widget build(BuildContext context) {
    final (icon, color) = switch (activity.type) {
      'merchant_approved' => (Icons.check_circle_outline, AppColors.green),
      'merchant_rejected' => (Icons.cancel_outlined, AppColors.red600),
      'user' => (Icons.person_outline, AppColors.primary),
      'merchant_account' => (Icons.store_outlined, AppColors.orange),
      _ => (Icons.info_outline, AppColors.stone600),
    };

    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: color),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                activity.text,
                style: AppText.xs(color: AppColors.stone800, height: 1.3),
              ),
              const SizedBox(height: 2),
              Text(
                activity.time,
                style: AppText.t10(color: AppColors.stone400),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
