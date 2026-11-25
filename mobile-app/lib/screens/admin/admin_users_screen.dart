import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/admin_models.dart';
import '../../data/models/user_role.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Gestion des utilisateurs (CampusSave Mobile - Administration).
///
/// Permet la recherche, le filtrage par rôle/statut, la consultation du profil
/// et l'activation / blocage de comptes via [AdminWorkspace.toggleUserStatus].
class AdminUsersScreen extends StatefulWidget {
  const AdminUsersScreen({super.key});

  @override
  State<AdminUsersScreen> createState() => _AdminUsersScreenState();
}

class _AdminUsersScreenState extends State<AdminUsersScreen> {
  final TextEditingController _searchController = TextEditingController();

  String _selectedRole = 'Tous';
  String _selectedStatus = 'Tous';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<AdminUser> _filterUsers(List<AdminUser> users) {
    final query = _searchController.text.trim().toLowerCase();

    return users.where((user) {
      final matchesSearch =
          query.isEmpty ||
          user.fullName.toLowerCase().contains(query) ||
          user.email.toLowerCase().contains(query) ||
          user.phone.toLowerCase().contains(query);

      final role = user.role.name.toLowerCase();
      final matchesRole = switch (_selectedRole) {
        'Étudiants' => role == 'student',
        'Commerçants' => role == 'merchant',
        'Administrateurs' => role == 'admin',
        _ => true,
      };

      final matchesStatus = switch (_selectedStatus) {
        'Actifs' => user.isActive,
        'Bloqués' => !user.isActive,
        _ => true,
      };

      return matchesSearch && matchesRole && matchesStatus;
    }).toList();
  }

  void _showToggleStatusDialog(AdminUser user) {
    final willBlock = user.isActive;

    showDialog<void>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: Text(
          willBlock ? 'Suspendre le compte ?' : 'Réactiver le compte ?',
          style: AppText.base(
            weight: FontWeight.w800,
            color: willBlock ? AppColors.red600 : AppColors.stone900,
          ),
        ),
        content: Text(
          willBlock
              ? 'Voulez-vous vraiment suspendre l’accès de ${user.fullName} (${user.email}) ?'
              : 'Voulez-vous réactiver l’accès de ${user.fullName} sur CampusSave ?',
          style: AppText.xs(color: AppColors.stone700, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogContext),
            child: Text(
              'Annuler',
              style: AppText.xs(color: AppColors.stone500),
            ),
          ),
          CsButton(
            label: willBlock ? 'Suspendre' : 'Réactiver',
            variant: willBlock
                ? CsButtonVariant.danger
                : CsButtonVariant.primary,
            size: CsButtonSize.small,
            compact: true,
            onPressed: () {
              AppScope.read(context).admin.toggleUserStatus(user.id);
              Navigator.pop(dialogContext);
              CsToast.show(
                context,
                willBlock
                    ? 'Compte de ${user.fullName} suspendu.'
                    : 'Compte de ${user.fullName} réactivé.',
              );
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final allUsers = admin.users;
    final filteredUsers = _filterUsers(allUsers);

    final activeCount = allUsers.where((u) => u.isActive).length;
    final blockedCount = allUsers.length - activeCount;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Gestion des utilisateurs',
          eyebrow: 'ADMINISTRATION',
          subtitle:
              'Supervisez les comptes étudiants, commerçants et administrateurs.',
        ),
        const SizedBox(height: 16),

        // --- Statistiques utilisateurs ---
        Row(
          children: [
            Expanded(
              child: _UserMiniStat(
                label: 'Total',
                count: '${allUsers.length}',
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _UserMiniStat(
                label: 'Actifs',
                count: '$activeCount',
                color: AppColors.green,
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: _UserMiniStat(
                label: 'Suspendus',
                count: '$blockedCount',
                color: AppColors.red600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),

        // --- Champ de recherche ---
        CsTextField(
          label: 'RECHERCHE UTILISATEUR',
          hint: 'Nom, adresse email ou numéro de téléphone...',
          controller: _searchController,
          icon: Icons.search,
          onChanged: (_) => setState(() {}),
        ),
        const SizedBox(height: 12),

        // --- Filtres Rôle ---
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (final role in const [
                'Tous',
                'Étudiants',
                'Commerçants',
                'Administrateurs',
              ]) ...[
                Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: _FilterChip(
                    label: role,
                    selected: _selectedRole == role,
                    onTap: () => setState(() => _selectedRole = role),
                  ),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 8),

        // --- Filtres Statut ---
        Row(
          children: [
            for (final status in const ['Tous', 'Actifs', 'Bloqués']) ...[
              Padding(
                padding: const EdgeInsets.only(right: 6),
                child: _FilterChip(
                  label: status,
                  selected: _selectedStatus == status,
                  onTap: () => setState(() => _selectedStatus = status),
                ),
              ),
            ],
          ],
        ),
        const SizedBox(height: 16),

        // --- Résumé du nombre de résultats ---
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Utilisateurs inscrits',
              style: AppText.xs(
                weight: FontWeight.w800,
                color: AppColors.stone900,
              ),
            ),
            Text(
              '${filteredUsers.length} résultat(s)',
              style: AppText.t11(color: AppColors.stone500),
            ),
          ],
        ),
        const SizedBox(height: 10),

        // --- Liste des utilisateurs ---
        if (filteredUsers.isEmpty)
          const EmptyState(
            title: 'Aucun utilisateur trouvé',
            description: 'Modifiez vos filtres ou termes de recherche.',
            icon: Icons.person_search_outlined,
          )
        else
          ...filteredUsers.map((user) {
            final isSelfAdmin = user.role == UserRole.admin;

            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: CsCard(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor: AppColors.primarySoft(),
                          child: Text(
                            user.fullName.trim().isNotEmpty
                                ? user.fullName.trim()[0].toUpperCase()
                                : '?',
                            style: AppText.xs(
                              weight: FontWeight.w800,
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                user.fullName,
                                style: AppText.sm(
                                  weight: FontWeight.w800,
                                  color: AppColors.stone900,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                user.email,
                                style: AppText.t11(color: AppColors.stone500),
                              ),
                              if (user.phone.isNotEmpty) ...[
                                const SizedBox(height: 1),
                                Text(
                                  user.phone,
                                  style: AppText.t10(color: AppColors.stone400),
                                ),
                              ],
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            AccountStatusBadge(status: user.status),
                            const SizedBox(height: 4),
                            RoleBadge(role: user.role),
                          ],
                        ),
                      ],
                    ),
                    const Divider(height: 18),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Inscrit : ${user.registrationDate}',
                          style: AppText.t10(color: AppColors.stone400),
                        ),
                        Row(
                          children: [
                            CsButton(
                              label: 'Détails',
                              variant: CsButtonVariant.secondary,
                              size: CsButtonSize.small,
                              compact: true,
                              onPressed: () {
                                AppRouter.push(
                                  context,
                                  Routes.adminUserDetails,
                                  args: PageArgs(userId: user.id),
                                );
                              },
                            ),
                            if (!isSelfAdmin) ...[
                              const SizedBox(width: 6),
                              CsButton(
                                label: user.isActive ? 'Bloquer' : 'Activer',
                                variant: user.isActive
                                    ? CsButtonVariant.danger
                                    : CsButtonVariant.primary,
                                size: CsButtonSize.small,
                                compact: true,
                                onPressed: () => _showToggleStatusDialog(user),
                              ),
                            ],
                          ],
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

class _UserMiniStat extends StatelessWidget {
  const _UserMiniStat({
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
