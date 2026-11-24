import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../routing/app_router.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Détails et piste d'audit d'une commande (CampusSave Mobile - Administration).
///
/// Présente l'intégralité des flux liés à une transaction : coordonnées de
/// l'étudiant, identification du commerçant, état du paiement et statut de retrait.
class AdminOrderDetailsScreen extends StatelessWidget {
  const AdminOrderDetailsScreen({super.key, required this.orderId});

  final String orderId;

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final order = admin.orderById(orderId);

    if (order == null) {
      return EmptyState(
        icon: Icons.receipt_long_outlined,
        title: 'Commande introuvable',
        description: 'La référence « $orderId » n’a pas été trouvée.',
        actionLabel: 'Retour à la supervision',
        onAction: () => AppRouter.back(context),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Commande #${order.id}',
          eyebrow: 'PISTE D’AUDIT TRANSACTION',
          subtitle: 'Réservation passée le ${order.reservationDate}',
          onBack: () => AppRouter.back(context),
        ),
        const SizedBox(height: 16),

        // --- Synthèse financière ---
        CsCard(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          order.productName,
                          style: AppText.base(
                            weight: FontWeight.w800,
                            color: AppColors.stone900,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${order.merchantName} • Quantité : ${order.quantity}',
                          style: AppText.t11(color: AppColors.stone600),
                        ),
                      ],
                    ),
                  ),
                  Text(
                    Formatters.price(order.totalAmount),
                    style: AppText.xl(
                      weight: FontWeight.w900,
                      color: AppColors.greenDark,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  PaymentStatusBadge(
                    status: order.paymentStatus,
                    pendingLabel: 'En attente de paiement',
                  ),
                  const SizedBox(width: 8),
                  AdminOrderStatusBadge(status: order.orderStatus),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Détails Panier & Commerce ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Panier & Établissement',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(label: 'Produit / Panier', value: order.productName),
              const Divider(height: 18),
              CsInfoRow(label: 'Commerçant', value: order.merchantName),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Adresse de retrait',
                value: order.merchantAddress,
              ),
              const Divider(height: 18),
              CsInfoRow(label: 'Quantité réservée', value: '${order.quantity}'),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Prix unitaire',
                value: Formatters.price(order.unitPrice),
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Montant total',
                value: Formatters.price(order.totalAmount),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Informations Étudiant ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Bénéficiaire (Étudiant)',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(label: 'Nom complet', value: order.studentName),
              const Divider(height: 18),
              CsInfoRow(label: 'Adresse email', value: order.studentEmail),
              const Divider(height: 18),
              CsInfoRow(label: 'Téléphone', value: order.studentPhone),
              const Divider(height: 18),
              CsInfoRow(label: 'Identifiant étudiant', value: order.studentId),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Audit Règlement et Retrait ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Règlement & Créneau de retrait',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(label: 'Mode de paiement', value: order.paymentMethod),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Statut du règlement',
                value: order.paymentStatus,
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Créneau horaire de retrait',
                value: order.pickupSchedule,
              ),
              const Divider(height: 18),
              CsInfoRow(label: 'Statut du retrait', value: order.orderStatus),
            ],
          ),
        ),
        const SizedBox(height: 20),
      ],
    );
  }
}
