import 'package:material_ui/material_ui.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_style.dart';
import '../../core/theme/app_text.dart';
import '../../data/models/merchant_models.dart';
import '../../routing/app_router.dart';
import '../../routing/page_args.dart';
import '../../routing/route_names.dart';
import '../../state/app_scope.dart';
import '../../widgets/cs_buttons.dart';
import '../../widgets/cs_feedback.dart';
import '../../widgets/cs_inputs.dart';
import '../../widgets/cs_surfaces.dart';

/// Écran de validation des retraits par QR Code ou saisie manuelle.
///
/// Connecté à [MerchantWorkspace.validateQrCode] : applique la règle stricte
/// de validation (seule une commande payée peut être remise, double retrait refusé).
class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key, this.prefillCode});

  final String? prefillCode;

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  late final TextEditingController _codeController;
  QrValidationResult? _lastResult;

  @override
  void initState() {
    super.initState();
    _codeController = TextEditingController(text: widget.prefillCode ?? '');
    if (widget.prefillCode != null && widget.prefillCode!.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _validate());
    }
  }

  @override
  void dispose() {
    _codeController.dispose();
    super.dispose();
  }

  void _validate() {
    final query = _codeController.text.trim();
    if (query.isEmpty) {
      CsToast.show(
        context,
        'Veuillez saisir un code de commande ou un jeton QR.',
      );
      return;
    }

    final workspace = AppScope.read(context).merchant;
    final result = workspace.validateQrCode(query);

    setState(() {
      _lastResult = result;
    });

    if (result.isSuccess) {
      CsToast.show(context, 'Retrait validé avec succès !');
    }
  }

  void _reset() {
    setState(() {
      _codeController.clear();
      _lastResult = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const PageHeader(
          title: 'Validation QR Code',
          eyebrow: 'ESPACE RETRAIT',
          subtitle:
              'Vérifiez la validité de la commande avant de remettre le panier.',
        ),
        const SizedBox(height: 16),

        // --- Cadre de visée Caméra / Scanner ---
        CsCard(
          padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
          child: Column(
            children: [
              Container(
                width: 220,
                height: 220,
                decoration: BoxDecoration(
                  color: AppColors.stone900,
                  borderRadius: AppRadii.rXl2,
                  border: Border.all(color: AppColors.gold, width: 2),
                ),
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const Icon(
                      Icons.qr_code_scanner,
                      size: 90,
                      color: Colors.white24,
                    ),
                    Positioned(
                      top: 20,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black54,
                          borderRadius: AppRadii.rFull,
                        ),
                        child: Text(
                          'Viseur Caméra Actif',
                          style: AppText.t10(
                            weight: FontWeight.w700,
                            color: Colors.white70,
                          ),
                        ),
                      ),
                    ),
                    // Coins de visée
                    Positioned(
                      top: 16,
                      left: 16,
                      child: _buildCorner(isTop: true, isLeft: true),
                    ),
                    Positioned(
                      top: 16,
                      right: 16,
                      child: _buildCorner(isTop: true, isLeft: false),
                    ),
                    Positioned(
                      bottom: 16,
                      left: 16,
                      child: _buildCorner(isTop: false, isLeft: true),
                    ),
                    Positioned(
                      bottom: 16,
                      right: 16,
                      child: _buildCorner(isTop: false, isLeft: false),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Text(
                'Placez le QR Code de l’étudiant au centre du cadre.',
                textAlign: TextAlign.center,
                style: AppText.xs(color: AppColors.stone500),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Saisie manuelle de référence ---
        CsCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Ou saisie manuelle de référence',
                style: AppText.t10(
                  weight: FontWeight.w800,
                  color: AppColors.stone400,
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: CsTextField(
                      label: 'RÉFÉRENCE OU JETON QR',
                      hint: 'Ex: #CS-1025 ou TOKEN...',
                      controller: _codeController,
                      icon: Icons.confirmation_number_outlined,
                      onSubmitted: (_) => _validate(),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Padding(
                    padding: const EdgeInsets.only(top: 20),
                    child: CsButton(
                      label: 'Vérifier',
                      variant: CsButtonVariant.primary,
                      size: CsButtonSize.regular,
                      compact: true,
                      onPressed: _validate,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // --- Résultat de la validation ---
        if (_lastResult != null) ...[
          _buildResultCard(context, _lastResult!),
          const SizedBox(height: 16),
        ],
      ],
    );
  }

  Widget _buildResultCard(BuildContext context, QrValidationResult result) {
    final (borderColor, iconColor, iconData) = switch (result.status) {
      QrValidationStatus.success => (
        AppColors.green,
        AppColors.green,
        Icons.check_circle_outline,
      ),
      QrValidationStatus.alreadyCollected => (
        AppColors.primary,
        AppColors.primary,
        Icons.history,
      ),
      QrValidationStatus.unpaid => (
        AppColors.orange,
        AppColors.orange,
        Icons.warning_amber_rounded,
      ),
      QrValidationStatus.invalid => (
        AppColors.red700,
        AppColors.red700,
        Icons.error_outline,
      ),
    };

    return CsCard(
      padding: const EdgeInsets.all(18),
      borderColor: borderColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(iconData, color: iconColor, size: 24),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  result.title,
                  style: AppText.sm(
                    weight: FontWeight.w800,
                    color: AppColors.stone900,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            result.message,
            style: AppText.xs(color: AppColors.stone700, height: 1.4),
          ),
          if (result.order != null) ...[
            const Divider(height: 20),
            CsInfoRow(label: 'Client', value: result.order!.studentName),
            CsInfoRow(
              label: 'Article',
              value: '${result.order!.quantity}x ${result.order!.productName}',
            ),
            CsInfoRow(
              label: 'Statut actuel',
              value: result.order!.orderStatus,
              valueColor: result.order!.isCollected
                  ? AppColors.green
                  : AppColors.orange,
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: CsButton(
                    label: 'Voir la commande',
                    variant: CsButtonVariant.secondary,
                    size: CsButtonSize.small,
                    onPressed: () {
                      AppRouter.push(
                        context,
                        Routes.merchantOrderDetails,
                        args: PageArgs(orderId: result.order!.id),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 8),
                CsButton(
                  label: 'Nouveau scan',
                  variant: CsButtonVariant.ghost,
                  size: CsButtonSize.small,
                  onPressed: _reset,
                ),
              ],
            ),
          ] else ...[
            const SizedBox(height: 10),
            CsButton(
              label: 'Réessayer',
              variant: CsButtonVariant.ghost,
              size: CsButtonSize.small,
              onPressed: _reset,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCorner({required bool isTop, required bool isLeft}) {
    return Container(
      width: 22,
      height: 22,
      decoration: BoxDecoration(
        border: Border(
          top: isTop
              ? const BorderSide(color: AppColors.gold, width: 3)
              : BorderSide.none,
          bottom: !isTop
              ? const BorderSide(color: AppColors.gold, width: 3)
              : BorderSide.none,
          left: isLeft
              ? const BorderSide(color: AppColors.gold, width: 3)
              : BorderSide.none,
          right: !isLeft
              ? const BorderSide(color: AppColors.gold, width: 3)
              : BorderSide.none,
        ),
      ),
    );
  }
}
