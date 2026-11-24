import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran de réservation (Étape 1 sur 3).
///
/// Permet à l'étudiant de valider la quantité, de vérifier le créneau de
/// retrait et d'engager la création d'une commande en attente dans
/// [StudentWorkspace.createPendingOrder].
class ReservationScreen extends StatefulWidget {
  const ReservationScreen({
    super.key,
    required this.offerId,
    this.quantity = 1,
  });

  final String offerId;
  final int quantity;

  @override
  State<ReservationScreen> createState() => _ReservationScreenState();
}

class _ReservationScreenState extends State<ReservationScreen> {
  bool _acceptedTerms = false;
  late int _selectedQuantity;

  @override
  void initState() {
    super.initState();
    _selectedQuantity = widget.quantity < 1 ? 1 : widget.quantity;
  }

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final offer = student.offerById(widget.offerId);

    if (offer == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Offre introuvable',
        description: 'Cette offre n’est plus disponible.',
        actionLabel: 'Retour aux offres',
        onAction: () => AppRouter.switchTo(context, Routes.studentExplore),
      );
    }

    final restaurant = student.restaurantOf(offer);
    final totalAmount = offer.reducedPrice * _selectedQuantity;
    final totalSavings = (offer.initialPrice - offer.reducedPrice) * _selectedQuantity;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Finaliser la réservation',
          eyebrow: 'ÉTAPE 1 SUR 3',
          subtitle: 'Vérifiez les détails avant de confirmer votre réservation.',
          onBack: () => AppRouter.back(context),
        ),
        const SizedBox(height: 16),

        // --- Récapitulatif de l'offre ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Offre sélectionnée',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 6),
              Text(
                offer.title,
                style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 2),
              Text(
                restaurant?.name ?? 'Commerce partenaire',
                style: AppText.xs(color: AppColors.stone600),
              ),
              const Divider(height: 20),
              CsInfoRow(
                label: 'Prix unitaire réduit',
                value: Formatters.price(offer.reducedPrice),
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Quantité réservée',
                value: '$_selectedQuantity portion${_selectedQuantity > 1 ? 's' : ''}',
              ),
              CsInfoRow(
                label: 'Total à régler',
                value: Formatters.price(totalAmount),
                valueColor: AppColors.primary,
              ),
              CsInfoRow(
                label: 'Économie réalisée',
                value: '- ${Formatters.price(totalSavings)}',
                valueColor: AppColors.green,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Lieu & créneau de retrait ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Lieu et horaire de retrait',
                style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
              ),
              const SizedBox(height: 10),
              CsInfoRow(
                label: 'Commerce',
                value: restaurant?.name ?? 'Partenaire ESSECT',
              ),
              CsInfoRow(
                label: 'Adresse',
                value: restaurant?.address ?? 'Campus ESSECT, Montfleury',
              ),
              CsInfoRow(
                label: 'Créneau de retrait',
                value: offer.pickupHours,
                valueColor: AppColors.primary,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Engagement & Charte anti-gaspi ---
        CsCard(
          padding: const EdgeInsets.all(14),
          child: InkWell(
            onTap: () {
              setState(() => _acceptedTerms = !_acceptedTerms);
            },
            borderRadius: AppRadii.rLg,
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Checkbox(
                  value: _acceptedTerms,
                  activeColor: AppColors.green,
                  onChanged: (val) {
                    setState(() => _acceptedTerms = val ?? false);
                  },
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      'Je m’engage à venir récupérer mon panier pendant le créneau horaire prévu, conformément à la charte CampusSave.',
                      style: AppText.xs(color: AppColors.stone700, height: 1.4),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),

        // --- Bouton Confirmer ---
        CsButton(
          label: 'Confirmer et voir le récapitulatif',
          variant: CsButtonVariant.primary,
          size: CsButtonSize.large,
          expand: true,
          icon: Icons.arrow_forward,
          onPressed: !_acceptedTerms
              ? null
              : () {
                  final order = student.createPendingOrder(offer, _selectedQuantity);
                  AppRouter.push(
                    context,
                    Routes.studentOrderSummary,
                    args: PageArgs(orderId: order.id),
                  );
                },
        ),
      ],
    );
  }
}
