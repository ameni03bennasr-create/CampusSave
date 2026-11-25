import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/merchant_models.dart';
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

/// Gestion des offres du commerçant.
///
/// Relié à [MerchantWorkspace.offers] et [MerchantWorkspace.deleteOffer].
class MerchantOffersScreen extends StatefulWidget {
  const MerchantOffersScreen({super.key});

  @override
  State<MerchantOffersScreen> createState() => _MerchantOffersScreenState();
}

class _MerchantOffersScreenState extends State<MerchantOffersScreen> {
  final _searchController = TextEditingController();
  String _selectedFilter = 'Toutes';

  final List<String> _filters = const ['Toutes', 'Active', 'Stock faible', 'Épuisée'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<MerchantOffer> _filterOffers(List<MerchantOffer> offers) {
    final query = _searchController.text.trim().toLowerCase();

    return offers.where((offer) {
      final matchesSearch = query.isEmpty ||
          offer.name.toLowerCase().contains(query) ||
          offer.category.toLowerCase().contains(query);

      final matchesFilter = switch (_selectedFilter) {
        'Active' => offer.quantity > 2,
        'Stock faible' => offer.quantity > 0 && offer.quantity <= 2,
        'Épuisée' => offer.quantity == 0,
        _ => true,
      };

      return matchesSearch && matchesFilter;
    }).toList();
  }

  void _confirmDelete(BuildContext context, MerchantOffer offer) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        title: Text(
          'Supprimer cette offre ?',
          style: AppText.base(weight: FontWeight.w800, color: AppColors.stone900),
        ),
        content: Text(
          'Voulez-vous vraiment retirer l’offre « ${offer.name} » de votre catalogue ?',
          style: AppText.xs(color: AppColors.stone600),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text('Annuler', style: AppText.xs(color: AppColors.stone500)),
          ),
          CsButton(
            label: 'Supprimer',
            variant: CsButtonVariant.danger,
            size: CsButtonSize.small,
            compact: true,
            onPressed: () {
              Navigator.of(ctx).pop();
              AppScope.read(context).merchant.deleteOffer(offer.id);
              CsToast.show(context, 'Offre supprimée du catalogue.');
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final workspace = AppScope.of(context).merchant;
    final allOffers = workspace.offers;
    final filtered = _filterOffers(allOffers);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Mes offres',
          subtitle: 'Gérez vos paniers surprises et plats anti-gaspillage en ligne.',
          trailing: CsButton(
            label: 'Ajouter',
            variant: CsButtonVariant.primary,
            size: CsButtonSize.small,
            icon: Icons.add,
            onPressed: () => AppRouter.push(context, Routes.merchantOfferAdd),
          ),
        ),
        const SizedBox(height: 16),

        // --- Recherche ---
        CsSearchField(
          controller: _searchController,
          hint: 'Rechercher une offre ou catégorie…',
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 14),

        // --- Filtres ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final filter in _filters) ...[
                _FilterChip(
                  label: filter,
                  selected: _selectedFilter == filter,
                  onTap: () => setState(() => _selectedFilter = filter),
                ),
                const SizedBox(width: 8),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Liste des offres ---
        if (filtered.isEmpty)
          EmptyState(
            icon: Icons.restaurant_outlined,
            title: 'Aucune offre trouvée',
            description: _selectedFilter == 'Toutes'
                ? 'Vous n’avez publié aucune offre pour le moment.'
                : 'Aucune offre ne correspond au statut « $_selectedFilter ».',
            actionLabel: 'Créer une offre',
            onAction: () => AppRouter.push(context, Routes.merchantOfferAdd),
          )
        else
          Column(
            children: [
              for (final offer in filtered) ...[
                _buildOfferTile(context, offer),
                const SizedBox(height: 12),
              ],
            ],
          ),
      ],
    );
  }

  Widget _buildOfferTile(BuildContext context, MerchantOffer offer) {
    return CsCard(
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              OfferImage(
                src: offer.photo,
                height: 72,
                discountPercent: offer.discountPercent,
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
                            offer.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
                          ),
                        ),
                        const SizedBox(width: 6),
                        OfferStatusBadge(status: offer.status, quantity: offer.quantity),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      offer.category,
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
                          style: AppText.xs(color: AppColors.stone400).copyWith(
                            decoration: TextDecoration.lineThrough,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          'Stock : ${offer.quantity}',
                          style: AppText.xs(weight: FontWeight.w700, color: AppColors.stone700),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              const Icon(Icons.access_time, size: 13, color: AppColors.stone400),
              const SizedBox(width: 4),
              Text(
                'Retrait : ${offer.pickupHours}',
                style: AppText.t11(color: AppColors.stone500),
              ),
              const Spacer(),
              CsButton(
                label: 'Modifier',
                variant: CsButtonVariant.secondary,
                size: CsButtonSize.small,
                compact: true,
                icon: Icons.edit_outlined,
                onPressed: () {
                  AppRouter.push(
                    context,
                    Routes.merchantOfferEdit,
                    args: PageArgs(offerId: offer.id),
                  );
                },
              ),
              const SizedBox(width: 6),
              CsButton(
                label: 'Supprimer',
                variant: CsButtonVariant.danger,
                size: CsButtonSize.small,
                compact: true,
                icon: Icons.delete_outline,
                onPressed: () => _confirmDelete(context, offer),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  const _FilterChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppRadii.rFull,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
        decoration: BoxDecoration(
          color: selected ? AppColors.primary : Colors.white,
          borderRadius: AppRadii.rFull,
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.goldSoft(0.7),
          ),
        ),
        child: Text(
          label,
          style: AppText.xs(
            weight: selected ? FontWeight.w700 : FontWeight.w500,
            color: selected ? Colors.white : AppColors.stone700,
          ),
        ),
      ),
    );
  }
}
