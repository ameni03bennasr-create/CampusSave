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
import '../../widgets/qr_code_view.dart';

/// Détails d'une commande spécifique dans l'espace étudiant.
///
/// Relié à [StudentWorkspace.orderById] via [orderId]. Affiche le récapitulatif
/// complet, les badges de statuts et le QR Code dès que la commande est confirmée.
class StudentOrderDetailsScreen extends StatelessWidget {
  const StudentOrderDetailsScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final order = student.orderById(orderId);

    if (order == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Commande introuvable',
        description: 'La référence « $orderId » n’existe pas dans vos commandes.',
        actionLabel: 'Retour à mes commandes',
        onAction: () => AppRouter.switchTo(context, Routes.studentOrders),
      );
    }

    final isPaid = order.isPaid;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Détail de la commande',
          eyebrow: 'COMMANDE #${order.id}',
          subtitle: 'Enregistrée le ${order.createdAt}',
          onBack: () => AppRouter.back(context, fallback: Routes.studentOrders),
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
                      'Statut de la commande',
                      style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                    ),
                    const SizedBox(height: 4),
                    StudentOrderStatusBadge(status: order.orderStatus),
                  ],
                ),
              ),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(
                      'Paiement',
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

        // --- QR Code de retrait si payée ---
        if (isPaid) ...[
          CsCard(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
            child: Center(
              child: Column(
                children: [
                  Text(
                    'QR CODE OFFICIEL DE RETRAIT',
                    style: AppText.t11(
                      weight: FontWeight.w800,
                      color: AppColors.green,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: AppRadii.rXl,
                      border: Border.all(color: AppColors.goldSoft(0.7)),
                    ),
                    child: QrCodeView(
                      value: order.qrToken ?? order.id,
                      size: 180,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Présentez ce QR Code au commerçant pour retirer votre commande.',
                    textAlign: TextAlign.center,
                    style: AppText.t10(color: AppColors.stone500),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
        ] else if (order.isAwaitingPayment) ...[
          // --- Alerte paiement requis ---
          CsCard(
            padding: const EdgeInsets.all(16),
            borderColor: AppColors.orange,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.info_outline, color: AppColors.orange, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      'Paiement requis',
                      style: AppText.sm(weight: FontWeight.w800, color: AppColors.orange),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Le paiement n’a pas encore été finalisé pour cette réservation. Votre QR Code sera généré dès la validation.',
                  style: AppText.xs(color: AppColors.stone700, height: 1.4),
                ),
                const SizedBox(height: 12),
                CsButton(
                  label: 'Régler la commande (${Formatters.price(order.totalAmount)})',
                  variant: CsButtonVariant.primary,
                  size: CsButtonSize.small,
                  onPressed: () {
                    AppRouter.push(
                      context,
                      Routes.studentPayment,
                      args: PageArgs(orderId: order.id),
                    );
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
        ],

        // --- Produit & Lieu de retrait ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Détails de l’article',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 8),
              Text(
                order.productTitle,
                style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 2),
              Text(
                order.restaurantName,
                style: AppText.xs(color: AppColors.stone600),
              ),
              const Divider(height: 20),
              CsInfoRow(
                label: 'Adresse de retrait',
                value: order.restaurantAddress,
              ),
              CsInfoRow(
                label: 'Créneau horaire',
                value: order.pickupHours,
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Mode de paiement choisi',
                value: order.paymentMethod.isEmpty ? 'Non renseigné' : order.paymentMethod,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Montant ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Montant de la commande',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsInfoRow(
                label: 'Prix unitaire réduit',
                value: Formatters.price(order.unitPrice),
              ),
              CsInfoRow(
                label: 'Quantité',
                value: '${order.quantity}',
              ),
              const Divider(height: 20),
              CsInfoRow(
                label: 'Total réglé / à régler',
                value: Formatters.price(order.totalAmount),
                valueColor: AppColors.primary,
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        CsButton(
          label: 'Retour à mes commandes',
          variant: CsButtonVariant.secondary,
          size: CsButtonSize.regular,
          expand: true,
          onPressed: () => AppRouter.switchTo(context, Routes.studentOrders),
        ),
      ],
    );
  }
}
