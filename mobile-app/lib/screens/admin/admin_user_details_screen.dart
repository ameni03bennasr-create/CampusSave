import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/user_role.dart';
import '../../routing/app_router.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_surfaces.dart';

/// Détails d'un compte utilisateur (CampusSave Mobile - Administration).
///
/// Affiche la fiche signalétique, le parcours académique et l'activité
/// de la plateforme, avec la possibilité de suspendre/réactiver l'utilisateur.
class AdminUserDetailsScreen extends StatelessWidget {
  const AdminUserDetailsScreen({super.key, required this.userId});

  final String userId;

  void _confirmToggleStatus(
    BuildContext context,
    String name,
    String id,
    bool isActive,
  ) {
    showDialog<void>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: Text(
          isActive ? 'Suspendre l’accès ?' : 'Réactiver le compte ?',
          style: AppText.base(
            weight: FontWeight.w800,
            color: isActive ? AppColors.red600 : AppColors.stone900,
          ),
        ),
        content: Text(
          isActive
              ? 'Le compte de $name ne pourra plus se connecter ni effectuer d’opérations sur la plateforme.'
              : 'Le compte de $name sera réactivé avec l’ensemble de ses droits d’accès.',
          style: AppText.xs(color: AppColors.stone700, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text(
              'Annuler',
              style: AppText.xs(color: AppColors.stone500),
            ),
          ),
          CsButton(
            label: isActive ? 'Suspendre' : 'Réactiver',
            variant: isActive
                ? CsButtonVariant.danger
                : CsButtonVariant.primary,
            size: CsButtonSize.small,
            compact: true,
            onPressed: () {
              AppScope.read(context).admin.toggleUserStatus(id);
              Navigator.pop(dialogCtx);
              CsToast.show(
                context,
                isActive ? 'Compte suspendu.' : 'Compte réactivé.',
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
    final user = admin.userById(userId);

    if (user == null) {
      return EmptyState(
        icon: Icons.person_off_outlined,
        title: 'Utilisateur introuvable',
        description: 'La référence « $userId » n’existe pas ou a été retirée.',
        actionLabel: 'Retour à la liste',
        onAction: () => AppRouter.back(context),
      );
    }

    final isSelfAdmin = user.role == UserRole.admin;
    final details = user.details;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: user.fullName,
          eyebrow: 'FICHE UTILISATEUR',
          subtitle: 'Identifiant système : ${user.id}',
          onBack: () => AppRouter.back(context),
        ),
        const SizedBox(height: 16),

        // --- Carte identité principale ---
        CsCard(
          padding: const EdgeInsets.all(18),
          child: Column(
            children: [
              CircleAvatar(
                radius: 36,
                backgroundColor: AppColors.primarySoft(),
                child: Text(
                  user.fullName.trim().isNotEmpty
                      ? user.fullName.trim()[0].toUpperCase()
                      : '?',
                  style: AppText.xl(
                    weight: FontWeight.w900,
                    color: AppColors.primary,
                  ),
                ),
              ),
              const SizedBox(height: 12),
              Text(
                user.fullName,
                style: AppText.base(
                  weight: FontWeight.w800,
                  color: AppColors.stone900,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 2),
              Text(
                user.email,
                style: AppText.t11(color: AppColors.stone500),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 12),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 8,
                children: [
                  RoleBadge(role: user.role),
                  AccountStatusBadge(status: user.status),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Coordonnées et détails de compte ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Coordonnées & Inscription',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(label: 'Identifiant', value: user.id),
              const Divider(height: 18),
              CsInfoRow(label: 'Adresse e-mail', value: user.email),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Téléphone',
                value: user.phone.isNotEmpty ? user.phone : 'Non renseigné',
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Date d’inscription',
                value: user.registrationDate,
              ),
              const Divider(height: 18),
              CsInfoRow(label: 'Dernière connexion', value: details.lastLogin),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Parcours académique si étudiant ---
        if (user.role == UserRole.student) ...[
          CsCard(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Rattachement académique',
                  style: AppText.t10(
                    weight: FontWeight.w800,
                    color: AppColors.stone400,
                  ),
                ),
                const SizedBox(height: 12),
                CsInfoRow(
                  label: 'Filière / Niveau',
                  value: details.filiere ?? 'ESSECT Tunis',
                ),
                const Divider(height: 18),
                CsInfoRow(
                  label: 'Établissement',
                  value: details.establishmentName ?? 'ESSECT',
                ),
                if (details.establishmentId != null) ...[
                  const Divider(height: 18),
                  CsInfoRow(
                    label: 'N° Carte étudiant',
                    value: details.establishmentId!,
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],

        // --- Métriques d'activité plateforme ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Activité sur CampusSave',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 14),
              Row(
                children: [
                  Expanded(
                    child: _UserMetricTile(
                      label: 'Commandes',
                      value: '${details.ordersCount ?? 0}',
                      icon: Icons.receipt_long_outlined,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: _UserMetricTile(
                      label: 'Dernière connexion',
                      value: details.lastLogin.isNotEmpty
                          ? details.lastLogin
                          : 'Récente',
                      icon: Icons.access_time_outlined,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // --- Action de modération ---
        if (!isSelfAdmin) ...[
          CsCard(
            padding: const EdgeInsets.all(16),
            borderColor: user.isActive ? AppColors.stone200 : AppColors.red600,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Modération administrative',
                  style: AppText.xs(
                    weight: FontWeight.w800,
                    color: AppColors.stone900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  user.isActive
                      ? 'La suspension désactive l’accès au compte sans supprimer l’historique des transactions.'
                      : 'Ce compte est actuellement suspendu. Vous pouvez rétablir les accès de l’utilisateur à tout moment.',
                  style: AppText.xs(color: AppColors.stone600, height: 1.4),
                ),
                const SizedBox(height: 14),
                CsButton(
                  label: user.isActive
                      ? 'Suspendre ce compte'
                      : 'Réactiver ce compte',
                  variant: user.isActive
                      ? CsButtonVariant.danger
                      : CsButtonVariant.primary,
                  expand: true,
                  onPressed: () => _confirmToggleStatus(
                    context,
                    user.fullName,
                    user.id,
                    user.isActive,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
      ],
    );
  }
}

class _UserMetricTile extends StatelessWidget {
  const _UserMetricTile({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final String value;
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.stone50,
        borderRadius: AppRadii.rLg,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 14, color: AppColors.stone500),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  label,
                  style: AppText.t10(color: AppColors.stone500),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: AppText.sm(
              weight: FontWeight.w800,
              color: AppColors.stone900,
            ),
          ),
        ],
      ),
    );
  }
}
