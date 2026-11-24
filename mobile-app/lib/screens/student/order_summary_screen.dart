import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
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

/// Écran récapitulatif de commande (Étape 2 sur 3).
///
/// Présente l'état de la réservation créée dans [StudentWorkspace] avant
/// le passage au module de règlement.
class OrderSummaryScreen extends StatelessWidget {
  const OrderSummaryScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final order = student.orderById(orderId);

    if (order == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Commande introuvable',
        description: 'La référence de commande « $orderId » est introuvable.',
        actionLabel: 'Retour à l’accueil',
        onAction: () => AppRouter.switchTo(context, Routes.studentHome),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Récapitulatif de commande',
          eyebrow: 'ÉTAPE 2 SUR 3',
          subtitle: 'Vérifiez les informations de retrait avant le paiement.',
          onBack: () => AppRouter.back(context),
        ),
        const SizedBox(height: 16),

        // --- Référence & Statut ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    'Référence :',
                    style: AppText.t11(color: AppColors.stone500),
                  ),
                  const SizedBox(width: 6),
                  SelectableText(
                    order.id,
                    style: AppText.xs(weight: FontWeight.w800, color: AppColors.stone900),
                  ),
                  const Spacer(),
                  StudentOrderStatusBadge(status: order.orderStatus),
                ],
              ),
              const Divider(height: 20),
              Text(
                order.productTitle,
                style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 2),
              Text(
                order.restaurantName,
                style: AppText.xs(color: AppColors.stone600),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Retrait ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Modalités de retrait',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsInfoRow(
                label: 'Lieu de retrait',
                value: order.restaurantAddress,
              ),
              CsInfoRow(
                label: 'Créneau horaire',
                value: order.pickupHours,
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Date de réservation',
                value: order.createdAt,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Montant & Règlement ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Détail du montant',
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
                label: 'Total à régler',
                value: Formatters.price(order.totalAmount),
                valueColor: AppColors.primary,
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),

        // --- Boutons d'action ---
        CsButton(
          label: 'Procéder au paiement (${Formatters.price(order.totalAmount)})',
          variant: CsButtonVariant.primary,
          size: CsButtonSize.large,
          icon: Icons.payment,
          expand: true,
          onPressed: () {
            AppRouter.push(
              context,
              Routes.studentPayment,
              args: PageArgs(orderId: order.id),
            );
          },
        ),
        const SizedBox(height: 10),
        Center(
          child: CsTextLink(
            label: 'Annuler et revenir aux offres',
            color: AppColors.stone500,
            onPressed: () => AppRouter.switchTo(context, Routes.studentExplore),
          ),
        ),
      ],
    );
  }
}
