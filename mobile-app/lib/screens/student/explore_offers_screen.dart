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
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';
import '../../widgets/safe_image.dart';

/// Écran « Explorer les offres » de l'espace étudiant.
///
/// Connecté à [StudentWorkspace] pour la recherche textuelle, le filtrage par
/// catégorie et le tri.
class ExploreOffersScreen extends StatefulWidget {
  const ExploreOffersScreen({super.key});

  @override
  State<ExploreOffersScreen> createState() => _ExploreOffersScreenState();
}

class _ExploreOffersScreenState extends State<ExploreOffersScreen> {
  late final TextEditingController _searchController;
  String _sortBy = 'recommandes';

  @override
  void initState() {
    super.initState();
    final student = AppScope.read(context).student;
    _searchController = TextEditingController(text: student.searchProduct);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _onSearchChanged(String value) {
    AppScope.read(context).student.setFilters(product: value);
  }

  void _onCategorySelected(String category) {
    AppScope.read(context).student.setFilters(category: category);
  }

  List<StudentOffer> _sortOffers(List<StudentOffer> raw) {
    final list = List<StudentOffer>.of(raw);
    if (_sortBy == 'prix_asc') {
      list.sort((a, b) => a.reducedPrice.compareTo(b.reducedPrice));
    } else if (_sortBy == 'reduction') {
      list.sort((a, b) => b.discountPercent.compareTo(a.discountPercent));
    }
    return list;
  }

  @override
  Widget build(BuildContext context) {
    final student = AppScope.of(context).student;
    final offers = _sortOffers(student.filteredOffers);
    final categories = student.categories;
    final selectedCategory = student.category;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Explorer les offres',
          subtitle: 'Trouvez des repas et des paniers anti-gaspillage près de votre campus',
        ),
        const SizedBox(height: 16),

        // --- Champ de recherche ---
        CsSearchField(
          controller: _searchController,
          hint: 'Rechercher un plat, une viennoiserie, un restaurant…',
          onChanged: _onSearchChanged,
        ),
        const SizedBox(height: 14),

        // --- Filtre par catégories ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final cat in categories) ...[
                _CategoryChip(
                  label: cat,
                  selected: cat == selectedCategory,
                  onTap: () => _onCategorySelected(cat),
                ),
                const SizedBox(width: 8),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Barre d'état & tri ---
        Row(
          children: [
            Text(
              '${offers.length} offre${offers.length > 1 ? 's' : ''} disponible${offers.length > 1 ? 's' : ''}',
              style: AppText.xs(weight: FontWeight.w700, color: AppColors.stone600),
            ),
            const Spacer(),
            DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _sortBy,
                icon: const Icon(Icons.sort, size: 16, color: AppColors.stone600),
                style: AppText.xs(weight: FontWeight.w700, color: AppColors.stone700),
                items: const [
                  DropdownMenuItem(value: 'recommandes', child: Text('Recommandés')),
                  DropdownMenuItem(value: 'prix_asc', child: Text('Prix croissant')),
                  DropdownMenuItem(value: 'reduction', child: Text('Plus forte réduction')),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _sortBy = val);
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),

        // --- Liste des résultats ---
        if (offers.isEmpty)
          EmptyState(
            icon: Icons.search_off,
            title: 'Aucune offre trouvée',
            description: 'Aucune offre ne correspond à votre recherche actuelle. Essayez d’ajuster vos filtres.',
            actionLabel: 'Réinitialiser les filtres',
            onAction: () {
              _searchController.clear();
              student.setFilters(product: '', category: 'Tous');
            },
          )
        else
          Column(
            children: [
              for (final offer in offers) ...[
                _buildOfferCard(context, offer, student.restaurantOf(offer)),
                const SizedBox(height: 12),
              ],
            ],
          ),
      ],
    );
  }

  Widget _buildOfferCard(BuildContext context, StudentOffer offer, Restaurant? restaurant) {
    return CsCard(
      padding: const EdgeInsets.all(14),
      onTap: () {
        AppRouter.push(
          context,
          Routes.studentOfferDetails,
          args: PageArgs(offerId: offer.id),
        );
      },
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          OfferImage(
            src: offer.image,
            height: 86,
            discountPercent: offer.discountPercent,
            surpriseBasket: offer.isSurpriseBasket,
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        offer.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: AppText.sm(weight: FontWeight.w700, color: AppColors.stone900),
                      ),
                    ),
                    const SizedBox(width: 6),
                    CsPill(
                      label: '-${offer.discountPercent}%',
                      background: AppColors.primarySoft(),
                      foreground: AppColors.primary,
                      dense: true,
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  restaurant?.name ?? 'Commerce partenaire',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppText.t11(color: AppColors.stone500),
                ),
                const SizedBox(height: 3),
                Row(
                  children: [
                    const Icon(Icons.access_time, size: 12, color: AppColors.stone400),
                    const SizedBox(width: 4),
                    Text(
                      offer.pickupHours,
                      style: AppText.t10(color: AppColors.stone500),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
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
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
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
