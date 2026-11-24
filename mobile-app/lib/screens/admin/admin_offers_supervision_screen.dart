import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../core/utils/formatters.dart';
import '../../data/models/admin_models.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Supervision globale des offres alimentaires (CampusSave Mobile - Administration).
///
/// Permet la consultation, le filtrage et la surveillance des paniers mis en
/// ligne par les commerçants partenaires autour du campus de l'ESSECT.
class AdminOffersSupervisionScreen extends StatefulWidget {
  const AdminOffersSupervisionScreen({super.key});

  @override
  State<AdminOffersSupervisionScreen> createState() =>
      _AdminOffersSupervisionScreenState();
}

class _AdminOffersSupervisionScreenState
    extends State<AdminOffersSupervisionScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _selectedFilter = 'Toutes';
  final List<String> _filters = const [
    'Toutes',
    'Publiée',
    'En attente',
    'Retirée',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<AdminOffer> _filterOffers(List<AdminOffer> offers) {
    final query = _searchController.text.trim().toLowerCase();

    return offers.where((offer) {
      final matchesSearch =
          query.isEmpty ||
          offer.productName.toLowerCase().contains(query) ||
          offer.merchantName.toLowerCase().contains(query) ||
          offer.category.toLowerCase().contains(query);

      final matchesStatus =
          _selectedFilter == 'Toutes' ||
          offer.publicationStatus == _selectedFilter;

      return matchesSearch && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final allOffers = admin.offers;
    final filteredOffers = _filterOffers(allOffers);

    final totalCount = allOffers.length;
    final publishedCount = allOffers
        .where((o) => o.publicationStatus == 'Publiée')
        .length;
    final pendingCount = allOffers
        .where((o) => o.publicationStatus == 'En attente')
        .length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Supervision des offres',
          eyebrow: 'CATALOGUE & MODÉRATION',
          subtitle:
              'Contrôlez les paniers anti-gaspillage publiés par les commerçants.',
        ),
        const SizedBox(height: 16),

        // --- Résumé quantitatif ---
        Row(
          children: [
            Expanded(
              child: _OfferSummaryBadge(
                label: 'Total offres',
                count: '$totalCount',
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _OfferSummaryBadge(
                label: 'Publiées',
                count: '$publishedCount',
                color: AppColors.green,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _OfferSummaryBadge(
                label: 'En attente',
                count: '$pendingCount',
                color: AppColors.amberText,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // --- Champ de recherche ---
        CsTextField(
          label: 'RECHERCHE D’OFFRE',
          hint: 'Produit, commerçant, catégorie...',
          controller: _searchController,
          icon: Icons.search,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 12),

        // --- Chips de filtre statut ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final filter in _filters) ...[
                Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: _FilterChip(
                    label: filter,
                    selected: _selectedFilter == filter,
                    onTap: () => setState(() => _selectedFilter = filter),
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Compteur de résultats ---
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Offres répertoriées',
              style: AppText.xs(
                weight: FontWeight.w800,
                color: AppColors.stone900,
              ),
            ),
            Text(
              '${filteredOffers.length} résultat(s)',
              style: AppText.t11(color: AppColors.stone500),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // --- Liste des offres ---
        if (filteredOffers.isEmpty)
          const EmptyState(
            title: 'Aucune offre trouvée',
            description:
                'Aucune offre ne correspond aux critères de recherche actuels.',
            icon: Icons.local_offer_outlined,
          )
        else
          ...filteredOffers.map((offer) {
            final discount = offer.initialPrice > 0
                ? (((offer.initialPrice - offer.reducedPrice) /
                              offer.initialPrice) *
                          100)
                      .round()
                : 0;

            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CsCard(
                padding: const EdgeInsets.all(16),
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
                                offer.productName,
                                style: AppText.sm(
                                  weight: FontWeight.w800,
                                  color: AppColors.stone900,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                '${offer.merchantName} • ${offer.category}',
                                style: AppText.t11(
                                  weight: FontWeight.w600,
                                  color: AppColors.primary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        PublicationStatusBadge(status: offer.publicationStatus),
                      ],
                    ),
                    if (offer.description.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(
                        offer.description,
                        style: AppText.xs(color: AppColors.stone600),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                    const Divider(height: 20),
                    Row(
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'PRIX INITIAL',
                              style: AppText.t10(
                                weight: FontWeight.w700,
                                color: AppColors.stone400,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              Formatters.price(offer.initialPrice),
                              style: AppText.xs(color: AppColors.stone400)
                                  .copyWith(
                                    decoration: TextDecoration.lineThrough,
                                  ),
                            ),
                          ],
                        ),
                        const SizedBox(width: 20),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'PRIX RÉDUIT',
                              style: AppText.t10(
                                weight: FontWeight.w700,
                                color: AppColors.greenDark,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              Formatters.price(offer.reducedPrice),
                              style: AppText.sm(
                                weight: FontWeight.w900,
                                color: AppColors.greenDark,
                              ),
                            ),
                          ],
                        ),
                        const Spacer(),
                        if (discount > 0)
                          CsPill(
                            label: '-$discount%',
                            background: AppColors.greenSoft(),
                            foreground: AppColors.green,
                          ),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(
                              Icons.schedule,
                              size: 14,
                              color: AppColors.stone400,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              offer.pickupSchedule,
                              style: AppText.t11(color: AppColors.stone600),
                            ),
                          ],
                        ),
                        Text(
                          '${offer.quantity} disponible(s)',
                          style: AppText.t11(
                            weight: FontWeight.w700,
                            color: offer.quantity > 0
                                ? AppColors.stone700
                                : AppColors.red600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            );
          }),
      ],
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
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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

class _OfferSummaryBadge extends StatelessWidget {
  const _OfferSummaryBadge({
    required this.label,
    required this.count,
    required this.color,
  });

  final String label;
  final String count;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return CsCard(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: AppText.t10(color: AppColors.stone500)),
          const SizedBox(height: 2),
          Text(
            count,
            style: AppText.base(weight: FontWeight.w900, color: color),
          ),
        ],
      ),
    );
  }
}
