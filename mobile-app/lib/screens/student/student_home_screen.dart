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
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';
import '../../widgets/safe_image.dart';

/// Écran d'accueil de l'espace étudiant.
///
/// Relié de manière réactive à [StudentWorkspace] : affiche le profil, les
/// EcoPoints, la commande prête à retirer (le cas échéant), les offres en vedette
/// et les statistiques d'impact réelles.
class StudentHomeScreen extends StatelessWidget {
  const StudentHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final profile = student.profile;
    final readyOrder = student.readyOrder;
    final featured = student.featuredOffers.isNotEmpty
        ? student.featuredOffers
        : student.offers.take(4).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // --- En-tête de bienvenue ---
        _buildGreeting(profile.fullName),
        const SizedBox(height: 18),

        // --- Alerte commande prête (raccourci QR) ---
        if (readyOrder != null) ...[
          _buildReadyOrderBanner(context, readyOrder),
          const SizedBox(height: 18),
        ],

        // --- Carte EcoPoints & Campus Radar ---
        _buildEcoPointsCard(context, profile.ecoPoints),
        const SizedBox(height: 24),

        // --- Section Offres près de vous ---
        SectionHeader(
          title: 'Offres près de vous',
          subtitle: 'Paniers et plats à prix réduit autour de l’ESSECT',
          actionLabel: 'Tout voir',
          actionIcon: Icons.arrow_forward,
          onAction: () => AppRouter.switchTo(context, Routes.studentExplore),
        ),
        const SizedBox(height: 12),

        if (featured.isEmpty)
          const EmptyState(
            icon: Icons.restaurant_outlined,
            title: 'Aucune offre pour le moment',
            description: 'Revenez bientôt pour découvrir de nouveaux paniers.',
            compact: true,
          )
        else
          Column(
            children: [
              for (final offer in featured) ...[
                _buildOfferTile(context, offer, student.restaurantOf(offer)),
                const SizedBox(height: 10),
              ],
            ],
          ),

        const SizedBox(height: 24),

        // --- Section Impact anti-gaspillage ---
        const SectionHeader(
          title: 'Mon impact',
          subtitle: 'Votre contribution concrète contre le gaspillage alimentaire',
        ),
        const SizedBox(height: 12),
        _buildImpactMetrics(student.orders),
        const SizedBox(height: 24),

        // --- Section Dernières commandes ---
        SectionHeader(
          title: 'Dernières commandes',
          subtitle: 'Suivez vos réservations et vos retraits en cours',
          actionLabel: student.orders.isNotEmpty ? 'Historique' : null,
          onAction: student.orders.isNotEmpty
              ? () => AppRouter.switchTo(context, Routes.studentOrders)
              : null,
        ),
        const SizedBox(height: 12),

        if (student.orders.isEmpty)
          EmptyState(
            icon: Icons.shopping_bag_outlined,
            title: 'Aucune commande enregistrée',
            description: 'Réservez votre premier panier pour le retrouver ici.',
            compact: true,
            actionLabel: 'Explorer les offres',
            onAction: () => AppRouter.switchTo(context, Routes.studentExplore),
          )
        else
          Column(
            children: [
              for (final order in student.orders.take(3)) ...[
                _buildOrderTile(context, order),
                const SizedBox(height: 10),
              ],
            ],
          ),

        const SizedBox(height: 20),
        _buildExploreCallout(context),
      ],
    );
  }

  Widget _buildGreeting(String fullName) {
    final displayName = fullName.trim().isEmpty ? 'Étudiant' : fullName.trim().split(' ').first;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: AppRadii.rXl2,
        border: AppBorders.card,
        boxShadow: AppShadows.xs,
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Bonjour, $displayName',
                      style: AppText.lg(weight: FontWeight.w800, color: AppColors.stone900),
                    ),
                    const SizedBox(width: 6),
                    const Text('👋', style: TextStyle(fontSize: 18)),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Prêt à sauver un repas aujourd’hui ?',
                  style: AppText.xs(color: AppColors.stone500),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.primarySoft(),
              borderRadius: AppRadii.rLg,
            ),
            child: const Icon(Icons.eco_rounded, color: AppColors.primary, size: 22),
          ),
        ],
      ),
    );
  }

  Widget _buildReadyOrderBanner(BuildContext context, StudentOrder order) {
    return CsCard(
      borderColor: AppColors.green,
      padding: const EdgeInsets.all(14),
      onTap: () {
        AppRouter.push(
          context,
          Routes.studentConfirmationQr,
          args: PageArgs(orderId: order.id),
        );
      },
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.greenSoft(0.15),
              borderRadius: AppRadii.rLg,
            ),
            child: const Icon(Icons.qr_code_2, color: AppColors.green, size: 28),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Commande prête au retrait',
                      style: AppText.xs(weight: FontWeight.w800, color: AppColors.green),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      width: 7,
                      height: 7,
                      decoration: const BoxDecoration(
                        color: AppColors.green,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  order.productTitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.sm(weight: FontWeight.w700, color: AppColors.stone900),
                ),
                Text(
                  '${order.restaurantName} • ${order.pickupHours}',
                  style: AppText.t11(color: AppColors.stone500),
                ),
              ],
            ),
          ),
          const Icon(Icons.chevron_right, color: AppColors.green, size: 20),
        ],
      ),
    );
  }

  Widget _buildEcoPointsCard(BuildContext context, int ecoPoints) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF342820), Color(0xFF4C3A2F)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: AppRadii.rXl2,
        boxShadow: AppShadows.sm,
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'PROGRAMME FIDÉLITÉ',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: AppColors.gold,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '$ecoPoints EcoPoints',
                  style: AppText.xl2(weight: FontWeight.w900, color: Colors.white),
                ),
                const SizedBox(height: 4),
                Text(
                  'Sauvez des invendus et accumulez des points pour débloquer des réductions ESSECT.',
                  style: AppText.xs(color: Colors.white70),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          CsButton(
            label: 'Statistiques',
            variant: CsButtonVariant.secondary,
            size: CsButtonSize.small,
            compact: true,
            onPressed: () {
              AppRouter.switchTo(context, Routes.studentStatistics);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildOfferTile(BuildContext context, StudentOffer offer, Restaurant? restaurant) {
    return CsCard(
      padding: const EdgeInsets.all(12),
      onTap: () {
        AppRouter.push(
          context,
          Routes.studentOfferDetails,
          args: PageArgs(offerId: offer.id),
        );
      },
      child: Row(
        children: [
          OfferImage(
            src: offer.image,
            height: 76,
            discountPercent: offer.discountPercent,
            surpriseBasket: offer.isSurpriseBasket,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  offer.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.sm(weight: FontWeight.w700, color: AppColors.stone900),
                ),
                const SizedBox(height: 2),
                Text(
                  restaurant?.name ?? 'Commerce partenaire',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.t11(color: AppColors.stone500),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    Text(
                      Formatters.price(offer.reducedPrice),
                      style: AppText.sm(weight: FontWeight.w800, color: AppColors.primary),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      Formatters.price(offer.initialPrice),
                      style: AppText.xs(
                        color: AppColors.stone400,
                      ).copyWith(decoration: TextDecoration.lineThrough),
                    ),
                    const Spacer(),
                    CsPill(
                      label: Formatters.remaining(offer.quantity),
                      background: offer.quantity <= 2 ? AppColors.orangeSoft() : AppColors.greenSoft(),
                      foreground: offer.quantity <= 2 ? AppColors.orange : AppColors.green,
                      dense: true,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildImpactMetrics(List<StudentOrder> orders) {
    final paidOrders = orders.where((o) => o.isPaid || o.isCollected).toList();
    final totalMeals = paidOrders.fold<int>(0, (sum, o) => sum + o.quantity);
    final totalSaved = paidOrders.fold<double>(
      0,
      (sum, o) => sum + ((o.initialUnitPrice - o.unitPrice) * o.quantity),
    );
    final totalWeight = paidOrders.fold<double>(
      0,
      (sum, o) => sum + o.weightKg,
    );

    return CsKpiGrid(
      children: [
        StatCard(
          label: 'Repas sauvés',
          value: '$totalMeals',
          note: 'repas détournés du gaspillage',
          icon: Icons.dinner_dining_outlined,
          valueColor: AppColors.green,
        ),
        StatCard(
          label: 'Économies totales',
          value: Formatters.price(totalSaved),
          note: 'sur le budget restauration',
          icon: Icons.savings_outlined,
          valueColor: AppColors.primary,
        ),
        StatCard(
          label: 'Nourriture sauvée',
          value: '${totalWeight.toStringAsFixed(1)} kg',
          note: 'équivalent anti-gaspillage',
          icon: Icons.scale_outlined,
          valueColor: AppColors.stone800,
        ),
      ],
    );
  }

  Widget _buildOrderTile(BuildContext context, StudentOrder order) {
    return CsCard(
      padding: const EdgeInsets.all(12),
      onTap: () {
        AppRouter.push(
          context,
          Routes.studentOrderDetails,
          args: PageArgs(orderId: order.id),
        );
      },
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppRadii.rLg,
            ),
            child: const Icon(Icons.receipt_outlined, color: AppColors.primary, size: 20),
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
                        order.productTitle,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppText.xs(weight: FontWeight.w700, color: AppColors.stone900),
                      ),
                    ),
                    Text(
                      Formatters.price(order.totalAmount),
                      style: AppText.xs(weight: FontWeight.w800, color: AppColors.primary),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                Text(
                  '${order.restaurantName} • ${order.createdAt}',
                  style: AppText.t11(color: AppColors.stone500),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    StudentOrderStatusBadge(status: order.orderStatus),
                    const Spacer(),
                    const Icon(Icons.chevron_right, size: 16, color: AppColors.stone400),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExploreCallout(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.primarySoft(0.12),
        borderRadius: AppRadii.rXl2,
        border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.storefront_outlined, color: AppColors.primary, size: 20),
              const SizedBox(width: 8),
              Text(
                'Commerces partenaires ESSECT',
                style: AppText.sm(weight: FontWeight.w800, color: AppColors.primary),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Boulangeries, snacks, cafétérias et restaurants à Montfleury et Bab Alioua.',
            style: AppText.xs(color: AppColors.stone600),
          ),
          const SizedBox(height: 12),
          CsButton(
            label: 'Explorer tout le catalogue',
            variant: CsButtonVariant.primary,
            size: CsButtonSize.small,
            icon: Icons.search,
            onPressed: () => AppRouter.switchTo(context, Routes.studentExplore),
          ),
        ],
      ),
    );
  }
}
