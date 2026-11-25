import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Tableau de bord de l'espace commerçant.
///
/// Relié de manière réactive à [MerchantWorkspace] : affiche l'état de validation
/// de l'établissement, les KPI réels (commandes en attente de remise, chiffre d'affaires
/// réglé, kg sauvés), les raccourcis d'actions et les dernières commandes.
class MerchantDashboardScreen extends StatelessWidget {
  const MerchantDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final establishment = workspace.establishment;
    final isPendingApproval = !establishment.adminValidated;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // --- En-tête avec nom de l'établissement ---
        PageHeader(
          title: establishment.name.isEmpty ? 'Mon Établissement' : establishment.name,
          eyebrow: 'TABLEAU DE BORD COMMERÇANT',
          subtitle: establishment.type.isEmpty ? 'Partenaire CampusSave' : establishment.type,
          trailing: ValidationStatusBadge(
            status: establishment.adminValidated ? 'Validé' : 'En attente',
          ),
        ),
        const SizedBox(height: 16),

        // --- Alerte d'approbation en attente si non validé ---
        if (isPendingApproval) ...[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.orangeSoft(0.18),
              borderRadius: AppRadii.rXl,
              border: Border.all(color: AppColors.orange.withValues(alpha: 0.5)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.pending_actions, color: AppColors.orange, size: 22),
                    const SizedBox(width: 8),
                    Text(
                      'Établissement en attente de validation',
                      style: AppText.sm(weight: FontWeight.w800, color: AppColors.orange),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Votre dossier est actuellement en cours d’examen par l’administration de l’ESSECT. Vos offres seront automatiquement rendues visibles aux étudiants dès sa validation.',
                  style: AppText.xs(color: AppColors.stone800, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
        ],

        // --- Grille des KPI réels ---
        CsKpiGrid(
          children: [
            StatCard(
              label: 'À récupérer',
              value: '${workspace.pendingPickupCount}',
              note: 'commandes payées en attente',
              icon: Icons.shopping_bag_outlined,
              valueColor: AppColors.orange,
              onTap: () => AppRouter.switchTo(context, Routes.merchantOrders),
            ),
            StatCard(
              label: 'Chiffre d’affaires',
              value: Formatters.price(workspace.revenuePaid),
              note: 'commandes réglées',
              icon: Icons.payments_outlined,
              valueColor: AppColors.primary,
            ),
            StatCard(
              label: 'Nourriture sauvée',
              value: '${workspace.foodSavedKg.toStringAsFixed(1)} kg',
              note: 'anti-gaspillage alimentaire',
              icon: Icons.scale_outlined,
              valueColor: AppColors.green,
            ),
            StatCard(
              label: 'Offres publiées',
              value: '${workspace.offers.length}',
              note: 'dans votre catalogue',
              icon: Icons.restaurant_outlined,
              valueColor: AppColors.stone800,
              onTap: () => AppRouter.switchTo(context, Routes.merchantOffers),
            ),
          ],
        ),
        const SizedBox(height: 20),

        // --- Raccourcis d'actions rapides ---
        Row(
          children: [
            Expanded(
              child: CsButton(
                label: 'Scanner un QR',
                variant: CsButtonVariant.green,
                size: CsButtonSize.regular,
                icon: Icons.qr_code_scanner,
                onPressed: () => AppRouter.switchTo(context, Routes.merchantQrScanner),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: CsButton(
                label: 'Ajouter une offre',
                variant: CsButtonVariant.primary,
                size: CsButtonSize.regular,
                icon: Icons.add,
                onPressed: () => AppRouter.push(context, Routes.merchantOfferAdd),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        // --- Section Commandes en cours ---
        SectionHeader(
          title: 'Commandes récentes',
          subtitle: 'Réservations reçues pour vos invendus',
          actionLabel: workspace.orders.isNotEmpty ? 'Tout voir' : null,
          onAction: workspace.orders.isNotEmpty
              ? () => AppRouter.switchTo(context, Routes.merchantOrders)
              : null,
        ),
        const SizedBox(height: 12),

        if (workspace.orders.isEmpty)
          const EmptyState(
            icon: Icons.receipt_long_outlined,
            title: 'Aucune commande reçue',
            description: 'Les commandes de vos clients apparaîtront ici dès leur réservation.',
            compact: true,
          )
        else
          Column(
            children: [
              for (final order in workspace.orders.take(3)) ...[
                CsCard(
                  padding: const EdgeInsets.all(14),
                  onTap: () {
                    AppRouter.push(
                      context,
                      Routes.merchantOrderDetails,
                      args: PageArgs(orderId: order.id),
                    );
                  },
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(9),
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
                                    order.studentName,
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
                              '${order.quantity}x ${order.productName} • ${order.pickupTime}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppText.t11(color: AppColors.stone500),
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                MerchantOrderStatusBadge(status: order.orderStatus),
                                const SizedBox(width: 6),
                                PaymentStatusBadge(status: order.paymentStatus),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 6),
                      const Icon(Icons.chevron_right, size: 16, color: AppColors.stone400),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
              ],
            ],
          ),

        const SizedBox(height: 24),

        // --- Section Offres au catalogue ---
        SectionHeader(
          title: 'Offres publiées',
          subtitle: 'Gérez vos stocks disponibles aujourd’hui',
          actionLabel: workspace.offers.isNotEmpty ? 'Gérer les offres' : null,
          onAction: workspace.offers.isNotEmpty
              ? () => AppRouter.switchTo(context, Routes.merchantOffers)
              : null,
        ),
        const SizedBox(height: 12),

        if (workspace.offers.isEmpty)
          EmptyState(
            icon: Icons.restaurant_outlined,
            title: 'Aucune offre active',
            description: 'Publiez votre premier panier surprise ou plat pour éviter le gaspillage.',
            actionLabel: 'Créer une offre',
            onAction: () => AppRouter.push(context, Routes.merchantOfferAdd),
            compact: true,
          )
        else
          Column(
            children: [
              for (final offer in workspace.offers.take(3)) ...[
                CsCard(
                  padding: const EdgeInsets.all(12),
                  onTap: () {
                    AppRouter.push(
                      context,
                      Routes.merchantOfferEdit,
                      args: PageArgs(offerId: offer.id),
                    );
                  },
                  child: Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: AppColors.primarySoft(),
                          borderRadius: AppRadii.rLg,
                        ),
                        child: const Icon(Icons.restaurant_menu, color: AppColors.primary, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              offer.name,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppText.xs(weight: FontWeight.w700, color: AppColors.stone900),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '${Formatters.price(offer.reducedPrice)} • Stock : ${offer.quantity}',
                              style: AppText.t11(color: AppColors.stone500),
                            ),
                          ],
                        ),
                      ),
                      OfferStatusBadge(status: offer.status, quantity: offer.quantity),
                    ],
                  ),
                ),
                const SizedBox(height: 8),
              ],
            ],
          ),
      ],
    );
  }
}
