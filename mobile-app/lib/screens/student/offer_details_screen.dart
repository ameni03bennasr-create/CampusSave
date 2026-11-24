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
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';
import '../../widgets/safe_image.dart';

/// Détails d'une offre pour un étudiant.
///
/// Charge les données réelles depuis [StudentWorkspace] à partir de [offerId],
/// présente le commerce, les horaires de retrait et le sélecteur de quantité.
class OfferDetailsScreen extends StatefulWidget {
  const OfferDetailsScreen({super.key, required this.offerId});

  final String offerId;

  @override
  State<OfferDetailsScreen> createState() => _OfferDetailsScreenState();
}

class _OfferDetailsScreenState extends State<OfferDetailsScreen> {
  int _quantity = 1;

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final offer = student.offerById(widget.offerId);

    if (offer == null) {
      return EmptyState(
        icon: Icons.error_outline,
        title: 'Offre introuvable',
        description: 'Cette offre n’est plus disponible ou a expiré.',
        actionLabel: 'Retour aux offres',
        onAction: () => AppRouter.switchTo(context, Routes.studentExplore),
      );
    }

    final restaurant = student.restaurantOf(offer);
    final totalAmount = offer.reducedPrice * _quantity;
    final totalSavings = (offer.initialPrice - offer.reducedPrice) * _quantity;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: offer.title,
          eyebrow: 'DÉTAIL DE L’OFFRE',
          onBack: () => AppRouter.back(context, fallback: Routes.studentExplore),
        ),
        const SizedBox(height: 16),

        // --- Visuel de l'offre ---
        ClipRRect(
          borderRadius: AppRadii.rXl2,
          child: Stack(
            children: [
              SafeImage(
                src: offer.image,
                width: double.infinity,
                height: 200,
                fit: BoxFit.cover,
              ),
              Positioned(
                top: 12,
                right: 12,
                child: CsPill(
                  label: '-${offer.discountPercent}%',
                  background: AppColors.primary,
                  foreground: Colors.white,
                ),
              ),
              if (offer.isSurpriseBasket)
                const Positioned(
                  bottom: 12,
                  left: 12,
                  child: CsPill(
                    label: 'Panier surprise',
                    background: Colors.white,
                    foreground: AppColors.orange,
                    icon: Icons.card_giftcard,
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 18),

        // --- Bloc Prix & Économies ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PRIX PAR PORTION',
                    style: AppText.t10(weight: FontWeight.w800, color: AppColors.stone400),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        Formatters.price(offer.reducedPrice),
                        style: AppText.xl2(weight: FontWeight.w900, color: AppColors.primary),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        Formatters.price(offer.initialPrice),
                        style: AppText.sm(color: AppColors.stone400).copyWith(
                          decoration: TextDecoration.lineThrough,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              const Spacer(),
              CsPill(
                label: Formatters.remaining(offer.quantity),
                background: offer.quantity <= 2 ? AppColors.orangeSoft() : AppColors.greenSoft(),
                foreground: offer.quantity <= 2 ? AppColors.orange : AppColors.green,
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Description de l'offre ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Description',
                style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
              ),
              const SizedBox(height: 6),
              Text(
                offer.description,
                style: AppText.xs(color: AppColors.stone700, height: 1.5),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Catégorie',
                value: offer.category,
              ),
              CsInfoRow(
                label: 'Poids estimé',
                value: '${(offer.weightKg * _quantity).toStringAsFixed(2)} kg',
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // --- Établissement partenaire ---
        if (restaurant != null)
          _buildRestaurantCard(restaurant),
        const SizedBox(height: 14),

        // --- Sélecteur de quantité & Récapitulatif ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Quantité souhaitée',
                          style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
                        ),
                        Text(
                          'Maximum disponible : ${offer.quantity}',
                          style: AppText.t11(color: AppColors.stone500),
                        ),
                      ],
                    ),
                  ),
                  QuantityStepper(
                    value: _quantity,
                    min: 1,
                    max: offer.quantity,
                    onChanged: (newQty) {
                      setState(() => _quantity = newQty);
                    },
                  ),
                ],
              ),
              const Divider(height: 24),
              CsInfoRow(
                label: 'Sous-total ($_quantity x ${Formatters.price(offer.reducedPrice)})',
                value: Formatters.price(totalAmount),
              ),
              CsInfoRow(
                label: 'Économie totale réalisée',
                value: '- ${Formatters.price(totalSavings)}',
                valueColor: AppColors.green,
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // --- Bouton d'action Réserver ---
        CsButton(
          label: offer.isSoldOut
              ? 'Offre épuisée'
              : 'Réserver pour ${Formatters.price(totalAmount)}',
          variant: CsButtonVariant.primary,
          size: CsButtonSize.large,
          icon: Icons.check_circle_outline,
          expand: true,
          onPressed: offer.isSoldOut
              ? null
              : () {
                  AppRouter.push(
                    context,
                    Routes.studentReservation,
                    args: PageArgs(offerId: offer.id, quantity: _quantity),
                  );
                },
        ),
      ],
    );
  }

  Widget _buildRestaurantCard(Restaurant restaurant) {
    return CsCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.storefront, color: AppColors.primary, size: 22),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  restaurant.name,
                  style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
                ),
              ),
              CsPill(
                label: '${restaurant.rating} ★',
                background: AppColors.goldSoft(),
                foreground: AppColors.amberText,
                dense: true,
              ),
            ],
          ),
          const SizedBox(height: 10),
          CsInfoRow(
            label: 'Adresse',
            value: restaurant.address,
          ),
          CsInfoRow(
            label: 'Créneau de retrait',
            value: restaurant.pickupHours,
            valueColor: AppColors.primary,
          ),
          if (restaurant.phone.isNotEmpty)
            CsInfoRow(
              label: 'Téléphone',
              value: restaurant.phone,
            ),
        ],
      ),
    );
  }
}
