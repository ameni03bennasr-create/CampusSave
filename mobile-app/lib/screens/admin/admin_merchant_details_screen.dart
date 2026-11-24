import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/admin_models.dart';
import '../../routing/app_router.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_badges.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Détails et instruction du dossier commerçant (CampusSave Mobile - Administration).
///
/// Affiche l'ensemble des informations juridiques et administratives fournies
/// par l'établissement (matricule fiscal, adresse, contact, distance ESSECT)
/// et permet l'arbitrage ou la gestion du compte.
class AdminMerchantDetailsScreen extends StatelessWidget {
  const AdminMerchantDetailsScreen({super.key, required this.merchantId});

  final String merchantId;

  void _showDecisionDialog(
    BuildContext context,
    AdminMerchant merchant,
    bool approve,
  ) {
    final reasonController = TextEditingController();

    showDialog<void>(
      context: context,
      builder: (dialogCtx) {
        return AlertDialog(
          title: Text(
            approve ? 'Valider l’établissement ?' : 'Refuser la candidature ?',
            style: AppText.base(
              weight: FontWeight.w800,
              color: approve ? AppColors.greenDark : AppColors.red600,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                approve
                    ? 'L’établissement « ${merchant.establishmentName} » sera immédiatement habilité à publier des paniers.'
                    : 'Indiquez le motif officiel du refus qui sera notifié au responsable :',
                style: AppText.xs(color: AppColors.stone700, height: 1.4),
              ),
              if (!approve) ...[
                const SizedBox(height: 12),
                CsTextField(
                  label: 'MOTIF DU REJET',
                  hint:
                      'Ex: Justificatif de matricule fiscal manquant ou illisible...',
                  controller: reasonController,
                  maxLines: 3,
                ),
              ],
            ],
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
              label: approve ? 'Valider le dossier' : 'Refuser le dossier',
              variant: approve
                  ? CsButtonVariant.primary
                  : CsButtonVariant.danger,
              size: CsButtonSize.small,
              compact: true,
              onPressed: () {
                final reason = reasonController.text.trim();
                if (!approve && reason.isEmpty) {
                  CsToast.show(
                    dialogCtx,
                    'Veuillez préciser un motif de refus.',
                  );
                  return;
                }

                AppScope.read(context).admin.decideMerchant(
                  merchant.id,
                  approve ? 'Validé' : 'Rejeté',
                  reason: reason,
                );

                Navigator.pop(dialogCtx);
                CsToast.show(
                  context,
                  approve
                      ? 'Établissement « ${merchant.establishmentName} » validé.'
                      : 'Dossier refusé.',
                );
              },
            ),
          ],
        );
      },
    ).then((_) => reasonController.dispose());
  }

  @override
  Widget build(BuildContext context) {
    final admin = AppScope.of(context).admin;
    final merchant = admin.merchantById(merchantId);

    if (merchant == null) {
      return EmptyState(
        icon: Icons.store_outlined,
        title: 'Commerçant introuvable',
        description:
            'La référence « $merchantId » n’existe pas dans le registre.',
        actionLabel: 'Retour à la liste',
        onAction: () => AppRouter.back(context),
      );
    }

    final submitted = merchant.submittedInfo;
    final isValidated = merchant.validationStatus == 'Validé';
    final isRejected = merchant.validationStatus == 'Rejeté';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: merchant.establishmentName,
          eyebrow: 'DOSSIER ÉTABLISSEMENT',
          subtitle:
              'ID : ${merchant.id} • Inscrit le ${merchant.registrationDate}',
          onBack: () => AppRouter.back(context),
        ),
        const SizedBox(height: 16),

        // --- Fiche de synthèse établissement ---
        CsCard(
          padding: const EdgeInsets.all(18),
          child: Column(
            children: [
              CircleAvatar(
                radius: 36,
                backgroundColor: AppColors.orangeSoft(),
                child: const Icon(
                  Icons.storefront,
                  color: AppColors.amberText,
                  size: 36,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                merchant.establishmentName,
                style: AppText.base(
                  weight: FontWeight.w800,
                  color: AppColors.stone900,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 2),
              Text(
                merchant.type,
                style: AppText.t11(
                  weight: FontWeight.w600,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 12),
              Wrap(
                alignment: WrapAlignment.center,
                spacing: 8,
                runSpacing: 6,
                children: [
                  ValidationStatusBadge(status: merchant.validationStatus),
                  if (isValidated)
                    AccountStatusBadge(
                      status: merchant.accountActive ? 'Actif' : 'Désactivé',
                    ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Motif de rejet si rejeté ---
        if (isRejected && (merchant.rejectionReason?.isNotEmpty ?? false)) ...[
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.red50,
              borderRadius: AppRadii.rXl,
              border: Border.all(color: AppColors.red600),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.cancel_outlined,
                      color: AppColors.red600,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Motif du rejet notifié',
                      style: AppText.xs(
                        weight: FontWeight.w800,
                        color: AppColors.red600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  merchant.rejectionReason ?? '',
                  style: AppText.xs(color: AppColors.stone800, height: 1.4),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],

        // --- Coordonnées de l'établissement ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Établissement & Localisation',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Raison sociale',
                value: merchant.establishmentName,
              ),
              const Divider(height: 18),
              CsInfoRow(label: 'Catégorie', value: merchant.type),
              const Divider(height: 18),
              CsInfoRow(label: 'Adresse physique', value: merchant.address),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Distance de l’ESSECT',
                value: submitted.distanceEssect.isNotEmpty
                    ? submitted.distanceEssect
                    : 'Proche campus Montfleury',
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Horaires habituels',
                value: submitted.openingHours.isNotEmpty
                    ? submitted.openingHours
                    : '11:30 - 21:00',
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Responsable légal ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Contact du gérant',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Nom du responsable',
                value: merchant.contactName,
              ),
              const Divider(height: 18),
              CsInfoRow(label: 'Email professionnel', value: merchant.email),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Téléphone direct',
                value: merchant.phone.isNotEmpty
                    ? merchant.phone
                    : 'Non renseigné',
              ),
              const Divider(height: 18),
              CsInfoRow(
                label: 'Identifiant compte associé',
                value: merchant.userId,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Conformité fiscale et légale ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Conformité administrative & fiscale',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 12),
              CsInfoRow(
                label: 'Matricule fiscal (RNE)',
                value: submitted.matriculeFiscal.isNotEmpty
                    ? submitted.matriculeFiscal
                    : 'En cours de transmission',
              ),
              if (submitted.description.isNotEmpty) ...[
                const Divider(height: 18),
                Text(
                  'Présentation du commerce',
                  style: AppText.t11(
                    weight: FontWeight.w700,
                    color: AppColors.stone700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  submitted.description,
                  style: AppText.xs(color: AppColors.stone600, height: 1.4),
                ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 20),

        // --- Actions Administratives ---
        if (merchant.isPending) ...[
          CsCard(
            padding: const EdgeInsets.all(16),
            borderColor: AppColors.gold,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Décision administrative',
                  style: AppText.xs(
                    weight: FontWeight.w800,
                    color: AppColors.stone900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Vérifiez la validité du matricule fiscal et l’accessibilité pour les étudiants avant validation.',
                  style: AppText.xs(color: AppColors.stone600, height: 1.4),
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: CsButton(
                        label: 'Rejeter',
                        variant: CsButtonVariant.danger,
                        onPressed: () =>
                            _showDecisionDialog(context, merchant, false),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Expanded(
                      child: CsButton(
                        label: 'Valider',
                        variant: CsButtonVariant.primary,
                        onPressed: () =>
                            _showDecisionDialog(context, merchant, true),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ] else if (isValidated) ...[
          CsCard(
            padding: const EdgeInsets.all(16),
            borderColor: merchant.accountActive
                ? AppColors.stone200
                : AppColors.red600,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Statut du compte commerçant',
                  style: AppText.xs(
                    weight: FontWeight.w800,
                    color: AppColors.stone900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  merchant.accountActive
                      ? 'L’établissement est actif et peut publier des offres. Vous pouvez désactiver temporairement son compte.'
                      : 'L’établissement est actuellement suspendu. Ses offres ne sont plus visibles des étudiants.',
                  style: AppText.xs(color: AppColors.stone600, height: 1.4),
                ),
                const SizedBox(height: 14),
                CsButton(
                  label: merchant.accountActive
                      ? 'Désactiver le compte'
                      : 'Réactiver le compte',
                  variant: merchant.accountActive
                      ? CsButtonVariant.danger
                      : CsButtonVariant.primary,
                  expand: true,
                  onPressed: () {
                    final willActive = !merchant.accountActive;
                    AppScope.read(
                      context,
                    ).admin.toggleMerchantAccount(merchant.id);
                    CsToast.show(
                      context,
                      willActive
                          ? 'Compte commerçant réactivé.'
                          : 'Compte commerçant désactivé.',
                    );
                  },
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 16),
      ],
    );
  }
}
