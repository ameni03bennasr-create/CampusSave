import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/admin_models.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Gestion des commerçants partenaires (CampusSave Mobile - Administration).
///
/// Permet la recherche, le filtrage par statut de validation et l'accès
/// aux dossiers complets des établissements partenaires.
class AdminMerchantsScreen extends StatefulWidget {
  const AdminMerchantsScreen({super.key});

  @override
  State<AdminMerchantsScreen> createState() => _AdminMerchantsScreenState();
}

class _AdminMerchantsScreenState extends State<AdminMerchantsScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _selectedFilter = 'Tous';
  final List<String> _filters = const [
    'Tous',
    'En attente',
    'Validé',
    'Rejeté',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<AdminMerchant> _filterMerchants(List<AdminMerchant> merchants) {
    final query = _searchController.text.trim().toLowerCase();

    return merchants.where((merchant) {
      final matchesSearch =
          query.isEmpty ||
          merchant.establishmentName.toLowerCase().contains(query) ||
          merchant.contactName.toLowerCase().contains(query) ||
          merchant.email.toLowerCase().contains(query) ||
          merchant.type.toLowerCase().contains(query);

      final matchesStatus =
          _selectedFilter == 'Tous' ||
          merchant.validationStatus == _selectedFilter;

      return matchesSearch && matchesStatus;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final allMerchants = admin.merchants;
    final filteredMerchants = _filterMerchants(allMerchants);

    final totalCount = allMerchants.length;
    final pendingCount = admin.pendingMerchantsCount;
    final validatedCount = allMerchants
        .where((m) => m.validationStatus == 'Validé')
        .length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Gestion des commerçants',
          eyebrow: 'ADMINISTRATION',
          subtitle:
              'Supervisez les établissements partenaires et leurs statuts de validation.',
        ),
        const SizedBox(height: 16),

        // --- Résumé chiffré ---
        Row(
          children: [
            Expanded(
              child: _MerchantSummaryCard(
                label: 'Total',
                count: '$totalCount',
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _MerchantSummaryCard(
                label: 'En attente',
                count: '$pendingCount',
                color: AppColors.amberText,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _MerchantSummaryCard(
                label: 'Validés',
                count: '$validatedCount',
                color: AppColors.green,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // --- Recherche texte ---
        CsTextField(
          label: 'RECHERCHE COMMERÇANT',
          hint: 'Nom de l’établissement, contact, email...',
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

        // --- Nombre de résultats ---
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Établissements référencés',
              style: AppText.xs(
                weight: FontWeight.w800,
                color: AppColors.stone900,
              ),
            ),
            Text(
              '${filteredMerchants.length} résultat(s)',
              style: AppText.t11(color: AppColors.stone500),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // --- Liste des commerçants ---
        if (filteredMerchants.isEmpty)
          EmptyState(
            title: 'Aucun commerçant trouvé',
            description:
                'Aucun établissement ne correspond aux filtres appliqués.',
            icon: Icons.store_outlined,
          )
        else
          ...filteredMerchants.map((merchant) {
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
                        Container(
                          width: 42,
                          height: 42,
                          decoration: BoxDecoration(
                            color: AppColors.orangeSoft(),
                            borderRadius: AppRadii.rLg,
                          ),
                          child: const Icon(
                            Icons.storefront_outlined,
                            color: AppColors.amberText,
                            size: 22,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                merchant.establishmentName,
                                style: AppText.sm(
                                  weight: FontWeight.w800,
                                  color: AppColors.stone900,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                merchant.type,
                                style: AppText.t11(
                                  weight: FontWeight.w600,
                                  color: AppColors.primary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ValidationStatusBadge(
                          status: merchant.validationStatus,
                        ),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      children: [
                        const Icon(
                          Icons.person_outline,
                          size: 14,
                          color: AppColors.stone500,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            merchant.contactName,
                            style: AppText.xs(color: AppColors.stone700),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(
                          Icons.email_outlined,
                          size: 14,
                          color: AppColors.stone500,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            merchant.email,
                            style: AppText.t11(color: AppColors.stone600),
                          ),
                        ),
                      ],
                    ),
                    if (merchant.phone.isNotEmpty) ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(
                            Icons.phone_outlined,
                            size: 14,
                            color: AppColors.stone500,
                          ),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              merchant.phone,
                              style: AppText.t11(color: AppColors.stone600),
                            ),
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(
                          Icons.location_on_outlined,
                          size: 14,
                          color: AppColors.stone500,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            merchant.address,
                            style: AppText.t11(color: AppColors.stone600),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Inscrit : ${merchant.registrationDate}',
                          style: AppText.t10(color: AppColors.stone400),
                        ),
                        CsButton(
                          label: 'Consulter le dossier',
                          variant: CsButtonVariant.secondary,
                          size: CsButtonSize.small,
                          compact: true,
                          onPressed: () {
                            AppRouter.push(
                              context,
                              Routes.adminMerchantDetails,
                              args: PageArgs(merchantId: merchant.id),
                            );
                          },
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

class _MerchantSummaryCard extends StatelessWidget {
  const _MerchantSummaryCard({
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
