import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../routing/app_router.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';
import '../../widgets/qr_code_view.dart';

/// Écran de confirmation et affichage du QR Code de retrait.
///
/// Ne génère et n'affiche le QR Code que lorsque la commande est effectivement
/// confirmée et payée. En cas de paiement en attente, informe l'étudiant avec
/// transparence.
class ConfirmationQrScreen extends StatelessWidget {
  const ConfirmationQrScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final order = student.orderById(orderId);

    if (order == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Commande introuvable',
        description: 'La référence « $orderId » est introuvable.',
        actionLabel: 'Retour à l’accueil',
        onAction: () => AppRouter.switchTo(context, Routes.studentHome),
      );
    }

    final isPaid = order.isPaid;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: isPaid ? 'Réservation confirmée' : 'Paiement en attente',
          eyebrow: 'CONFIRMATION',
          subtitle: isPaid
              ? 'Présentez ce QR Code au commerçant lors de votre passage.'
              : 'Votre commande est enregistrée en attente de validation du paiement.',
          onBack: () => AppRouter.switchTo(context, Routes.studentHome),
        ),
        const SizedBox(height: 16),

        // --- Carte QR Code si commande payée ---
        if (isPaid) ...[
          CsCard(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Center(
              child: Column(
                children: [
                  Text(
                    'QR CODE DE RETRAIT',
                    style: AppText.t11(
                      weight: FontWeight.w800,
                      color: AppColors.stone500,
                      letterSpacing: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'À présenter à l’établissement partenaire',
                    style: AppText.t10(color: AppColors.stone400),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: AppRadii.rXl,
                      border: Border.all(color: AppColors.goldSoft(0.8)),
                      boxShadow: AppShadows.xs,
                    ),
                    child: QrCodeView(
                      value: order.qrToken ?? order.id,
                      size: 200,
                    ),
                  ),
                  const SizedBox(height: 14),
                  SelectableText(
                    'Réf : ${order.id}',
                    style: AppText.sm(weight: FontWeight.w800, color: AppColors.primary),
                  ),
                  const SizedBox(height: 6),
                  StudentOrderStatusBadge(status: order.orderStatus),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
        ] else ...[
          // --- Alerte paiement en attente ---
          CsCard(
            padding: const EdgeInsets.all(20),
            borderColor: AppColors.orange,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.schedule, color: AppColors.orange, size: 24),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Paiement en cours de traitement',
                        style: AppText.sm(weight: FontWeight.w800, color: AppColors.orange),
                      ),
                    ),
                    PaymentStatusBadge(status: order.paymentStatus),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Le QR Code officiel sera activé dès la confirmation de la transaction par le prestataire bancaire. Vous recevrez une notification instantanée.',
                  style: AppText.xs(color: AppColors.stone700, height: 1.5),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
        ],

        // --- Détails du retrait ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Informations de retrait',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsInfoRow(
                label: 'Commerce',
                value: order.restaurantName,
              ),
              CsInfoRow(
                label: 'Adresse',
                value: order.restaurantAddress,
              ),
              CsInfoRow(
                label: 'Créneau horaire',
                value: order.pickupHours,
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Montant total',
                value: Formatters.price(order.totalAmount),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // --- Boutons de navigation ---
        CsButton(
          label: 'Voir mes commandes',
          variant: CsButtonVariant.primary,
          size: CsButtonSize.large,
          icon: Icons.shopping_bag_outlined,
          expand: true,
          onPressed: () => AppRouter.switchTo(context, Routes.studentOrders),
        ),
        const SizedBox(height: 10),
        Center(
          child: CsTextLink(
            label: 'Retour à l’accueil',
            onPressed: () => AppRouter.switchTo(context, Routes.studentHome),
          ),
        ),
      ],
    );
  }
}
