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

/// Écran de validation des demandes d'inscription commerçants (CampusSave Mobile).
///
/// Permet à l'administrateur d'examiner les dossiers en attente et de statuer :
/// validation officielle ou rejet avec saisie obligatoire d'un motif.
class AdminMerchantValidationScreen extends StatelessWidget {
  const AdminMerchantValidationScreen({super.key});

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
                    ? 'L’établissement « ${merchant.establishmentName} » sera autorisé à publier ses offres anti-gaspillage sur CampusSave.'
                    : 'Indiquez le motif du refus communiqué au commerçant pour son dossier « ${merchant.establishmentName} » :',
                style: AppText.xs(color: AppColors.stone700, height: 1.4),
              ),
              if (!approve) ...[
                const SizedBox(height: 12),
                CsTextField(
                  label: 'MOTIF DU REFUS (OBLIGATOIRE)',
                  hint:
                      'Ex: Matricule fiscal invalide, justificatif manquant...',
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
              label: approve ? 'Confirmer la validation' : 'Confirmer le rejet',
              variant: approve
                  ? CsButtonVariant.primary
                  : CsButtonVariant.danger,
              size: CsButtonSize.small,
              compact: true,
              onPressed: () {
                final reason = reasonController.text.trim();
                if (!approve && reason.isEmpty) {
                  CsToast.show(dialogCtx, 'Veuillez saisir un motif de refus.');
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
                      : 'Dossier rejeté avec notification du motif.',
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
    final pendingMerchants = admin.pendingMerchants;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PageHeader(
          title: 'Validation des commerçants',
          eyebrow: 'CONFORMITÉ & SÉCURITÉ',
          subtitle:
              'Vérifiez la conformité des établissements partenaires avant mise en service.',
        ),
        const SizedBox(height: 16),

        // --- Bannière d'état ---
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: pendingMerchants.isNotEmpty
                ? AppColors.orangeSoft()
                : AppColors.greenSoft(),
            borderRadius: AppRadii.rXl,
            border: Border.all(
              color: pendingMerchants.isNotEmpty
                  ? AppColors.gold
                  : AppColors.green,
            ),
          ),
          child: Row(
            children: [
              Icon(
                pendingMerchants.isNotEmpty
                    ? Icons.pending_actions_outlined
                    : Icons.check_circle_outline,
                color: pendingMerchants.isNotEmpty
                    ? AppColors.amberText
                    : AppColors.greenDark,
                size: 26,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      pendingMerchants.isNotEmpty
                          ? '${pendingMerchants.length} dossier(s) en attente d’arbitrage'
                          : 'Tous les dossiers sont traités',
                      style: AppText.xs(
                        weight: FontWeight.w800,
                        color: pendingMerchants.isNotEmpty
                            ? AppColors.amberText
                            : AppColors.greenDark,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      pendingMerchants.isNotEmpty
                          ? 'Vérifiez la conformité du matricule fiscal et des horaires de retrait.'
                          : 'Aucune nouvelle candidature commerçant en attente.',
                      style: AppText.t11(color: AppColors.stone700),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        Text(
          'Dossiers à instruire',
          style: AppText.sm(weight: FontWeight.w800, color: AppColors.stone900),
        ),
        const SizedBox(height: 12),

        // --- Liste des dossiers en attente ---
        if (pendingMerchants.isEmpty)
          EmptyState(
            title: 'Aucune demande en attente',
            description:
                'Toutes les candidatures commerçants ont été validées ou traitées.',
            icon: Icons.verified_user_outlined,
          )
        else
          ...pendingMerchants.map((merchant) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: CsCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: AppColors.primarySoft(),
                            borderRadius: AppRadii.rLg,
                          ),
                          child: const Icon(
                            Icons.storefront,
                            color: AppColors.primary,
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
                                '${merchant.type} • Soumis le ${merchant.registrationDate}',
                                style: AppText.t11(color: AppColors.stone500),
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
                    CsInfoRow(
                      label: 'Responsable',
                      value: merchant.contactName,
                    ),
                    const SizedBox(height: 6),
                    CsInfoRow(label: 'Email', value: merchant.email),
                    const SizedBox(height: 6),
                    CsInfoRow(label: 'Téléphone', value: merchant.phone),
                    const SizedBox(height: 6),
                    CsInfoRow(label: 'Adresse', value: merchant.address),
                    if (merchant.submittedInfo.matriculeFiscal.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      CsInfoRow(
                        label: 'Matricule fiscal',
                        value: merchant.submittedInfo.matriculeFiscal,
                      ),
                    ],
                    const Divider(height: 20),
                    Row(
                      children: [
                        Expanded(
                          child: CsButton(
                            label: 'Consulter',
                            variant: CsButtonVariant.secondary,
                            size: CsButtonSize.small,
                            onPressed: () {
                              AppRouter.push(
                                context,
                                Routes.adminMerchantDetails,
                                args: PageArgs(merchantId: merchant.id),
                              );
                            },
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: CsButton(
                            label: 'Refuser',
                            variant: CsButtonVariant.danger,
                            size: CsButtonSize.small,
                            onPressed: () =>
                                _showDecisionDialog(context, merchant, false),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: CsButton(
                            label: 'Valider',
                            variant: CsButtonVariant.primary,
                            size: CsButtonSize.small,
                            onPressed: () =>
                                _showDecisionDialog(context, merchant, true),
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
