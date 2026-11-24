import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Détails d'une commande reçue par le commerçant.
///
/// Relié à [MerchantWorkspace.orderById] et permet la validation directe
/// de la remise du panier si la commande est payée.
class MerchantOrderDetailsScreen extends StatelessWidget {
  const MerchantOrderDetailsScreen({super.key, required this.orderId});

  final String orderId;

  void _validateOrder(BuildContext context, dynamic workspace, String id) {
    final result = workspace.validateQrCode(id);
    CsToast.show(context, result.message);
  }

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final order = workspace.orderById(orderId);

    if (order == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Commande introuvable',
        description: 'La référence « $orderId » est introuvable.',
        actionLabel: 'Retour aux commandes',
        onAction: () => AppRouter.switchTo(context, Routes.merchantOrders),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Commande ${order.id}',
          eyebrow: 'DÉTAIL COMMANDE CLIENT',
          subtitle: 'Réservation passée le ${order.reservationDate}',
          onBack: () => AppRouter.back(context, fallback: Routes.merchantOrders),
        ),
        const SizedBox(height: 16),

        // --- Statuts ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Statut de retrait',
                      style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                    ),
                    const SizedBox(height: 4),
                    MerchantOrderStatusBadge(status: order.orderStatus),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'Règlement',
                      style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                    ),
                    const SizedBox(height: 4),
                    PaymentStatusBadge(status: order.paymentStatus),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Coordonnées du client ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Coordonnées de l’étudiant',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsInfoRow(
                label: 'Nom de l’étudiant',
                value: order.studentName,
              ),
              CsInfoRow(
                label: 'Téléphone',
                value: order.studentPhone.isEmpty ? 'Non renseigné' : order.studentPhone,
              ),
              CsInfoRow(
                label: 'Adresse e-mail',
                value: order.studentEmail,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Article et retrait ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Panier réservé',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 8),
              Text(
                order.productName,
                style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 4),
              CsInfoRow(
                label: 'Quantité',
                value: '${order.quantity} portion${order.quantity > 1 ? 's' : ''}',
              ),
              CsInfoRow(
                label: 'Créneau prévu',
                value: order.pickupTime,
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Mode de règlement',
                value: order.paymentMethod,
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Montant total',
                value: Formatters.price(order.totalAmount),
                valueColor: AppColors.primary,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Alerte ou Confirmation de retrait ---
        if (order.isCollected) ...[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.greenSoft(0.15),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.green.withValues(alpha: 0.4)),
            ),
            child: Row(
              children: [
                const Icon(Icons.check_circle, color: AppColors.green, size: 22),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Commande remise au client',
                        style: AppText.xs(weight: FontWeight.w800, color: AppColors.green),
                      ),
                      Text(
                        'Retrait validé à ${order.collectedAt ?? 'date antérieure'}. Remise en double refusée.',
                        style: AppText.t11(color: AppColors.stone700),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),
        ] else if (order.canBeCollected) ...[
          CsButton(
            label: 'Confirmer la remise du panier',
            variant: CsButtonVariant.green,
            size: CsButtonSize.large,
            expand: true,
            icon: Icons.check_circle_outline,
            onPressed: () => _validateOrder(context, workspace, order.id),
          ),
          const SizedBox(height: 14),
        ] else ...[
          CsCard(
            padding: const EdgeInsets.all(14),
            borderColor: AppColors.orange,
            child: Text(
              'Cette commande n’est pas encore confirmée comme réglée (${order.paymentStatus}). Conformément aux règles CampusSave, une commande non réglée ne peut être remise.',
              style: AppText.xs(color: AppColors.orange, height: 1.4),
            ),
          ),
          const SizedBox(height: 14),
        ],

        CsButton(
          label: 'Retour aux commandes',
          variant: CsButtonVariant.secondary,
          size: CsButtonSize.regular,
          expand: true,
          onPressed: () => AppRouter.switchTo(context, Routes.merchantOrders),
        ),
      ],
    );
  }
}
