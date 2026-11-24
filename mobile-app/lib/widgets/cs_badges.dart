import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_text.dart';
import '../data/models/user_role.dart';

/// Pastille générique (fond teinté, texte bold, icône ou point optionnel).
///
/// Toutes les pastilles de statut du projet React sont reconstruites avec ce
/// composant : `rounded-full`, `px-2.5 py-1`, `text-xs font-bold`.
class CsPill extends StatelessWidget {
  const CsPill({
    super.key,
    required this.label,
    this.background = const Color(0x264C6749),
    this.foreground = AppColors.green,
    this.borderColor,
    this.icon,
    this.iconColor,
    this.dotColor,
    this.dense = false,
    this.maxWidth,
  });

  final String label;
  final Color background;
  final Color foreground;
  final Color? borderColor;
  final IconData? icon;
  final Color? iconColor;
  final Color? dotColor;
  final bool dense;
  final double? maxWidth;

  @override
  Widget build(BuildContext context) {
    final content = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (dotColor != null) ...[
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
          ),
          const SizedBox(width: 5),
        ],
        if (icon != null) ...[
          Icon(icon, size: dense ? 11 : 13, color: iconColor ?? foreground),
          const SizedBox(width: 4),
        ],
        Flexible(
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: AppText.xs(
              weight: FontWeight.w700,
              color: foreground,
            ).copyWith(fontSize: dense ? 10.5 : 11.5),
          ),
        ),
      ],
    );

    return Container(
      constraints: BoxConstraints(maxWidth: maxWidth ?? double.infinity),
      padding: EdgeInsets.symmetric(
        horizontal: dense ? 8 : 10,
        vertical: dense ? 3 : 4,
      ),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(999),
        border: borderColor == null ? null : Border.all(color: borderColor!),
      ),
      child: content,
    );
  }
}

/// Pastille de statut de commande côté étudiant.
class StudentOrderStatusBadge extends StatelessWidget {
  const StudentOrderStatusBadge({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    if (status.contains('Confirmée') || status.contains('Prête')) {
      return CsPill(
        label: status,
        background: AppColors.greenSoft(),
        foreground: AppColors.green,
        dotColor: AppColors.green,
      );
    }
    if (status.contains('Récupérée')) {
      return CsPill(
        label: status,
        background: AppColors.emerald50,
        foreground: AppColors.emerald800,
        borderColor: AppColors.emerald200,
        icon: Icons.check_circle_outline,
        iconColor: AppColors.green,
      );
    }
    if (status.contains('attente')) {
      return CsPill(
        label: status,
        background: AppColors.goldTint(0.45),
        foreground: AppColors.amberText,
        icon: Icons.schedule,
        iconColor: AppColors.orange,
      );
    }
    return CsPill(
      label: status,
      background: AppColors.red50,
      foreground: AppColors.red700,
      borderColor: AppColors.red200,
      icon: Icons.cancel_outlined,
      iconColor: AppColors.red600,
    );
  }
}

/// Pastille de statut de commande côté commerçant.
class MerchantOrderStatusBadge extends StatelessWidget {
  const MerchantOrderStatusBadge({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    if (status == 'Payée / À récupérer') {
      return CsPill(
        label: status,
        background: AppColors.orangeSoft(),
        foreground: AppColors.primary,
        borderColor: AppColors.orangeSoft(0.3),
        icon: Icons.qr_code_2,
      );
    }
    if (status == 'Récupérée') {
      return CsPill(
        label: status,
        background: AppColors.greenSoft(),
        foreground: AppColors.green,
        icon: Icons.check_circle_outline,
      );
    }
    if (status == 'En attente') {
      return CsPill(
        label: status,
        background: AppColors.goldTint(),
        foreground: AppColors.amberText,
        icon: Icons.schedule,
      );
    }
    return CsPill(
      label: status,
      background: AppColors.red50,
      foreground: AppColors.red700,
      borderColor: AppColors.red200,
      icon: Icons.cancel_outlined,
    );
  }
}

/// Pastille de statut de commande côté administrateur.
class AdminOrderStatusBadge extends StatelessWidget {
  const AdminOrderStatusBadge({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    if (status.contains('Confirmée')) {
      return CsPill(
        label: status,
        background: AppColors.orangeSoft(),
        foreground: AppColors.primary,
        icon: Icons.schedule,
      );
    }
    if (status.contains('Récupérée')) {
      return CsPill(
        label: status,
        background: AppColors.greenSoft(),
        foreground: AppColors.green,
        icon: Icons.check_circle_outline,
      );
    }
    if (status == 'En attente') {
      return CsPill(
        label: status,
        background: AppColors.goldTint(),
        foreground: AppColors.amberText,
      );
    }
    return const CsPill(
      label: 'Annulée',
      background: AppColors.red50,
      foreground: AppColors.red700,
      borderColor: AppColors.red200,
    );
  }
}

/// Pastille de statut de paiement (commerçant & administrateur).
class PaymentStatusBadge extends StatelessWidget {
  const PaymentStatusBadge({
    super.key,
    required this.status,
    this.pendingLabel = 'En attente de paiement',
    this.failedLabel = 'Échoué / Non payé',
  });

  final String status;
  final String pendingLabel;
  final String failedLabel;

  @override
  Widget build(BuildContext context) {
    if (status == 'Payée') {
      return const CsPill(
        label: 'Payée',
        background: Color(0x264C6749),
        foreground: AppColors.green,
        icon: Icons.check_circle_outline,
      );
    }
    if (status == 'En attente') {
      return CsPill(
        label: pendingLabel,
        background: AppColors.goldTint(0.55),
        foreground: AppColors.amberText,
        icon: Icons.schedule,
        iconColor: AppColors.orange,
      );
    }
    return CsPill(
      label: failedLabel,
      background: AppColors.red50,
      foreground: AppColors.red700,
      borderColor: AppColors.red200,
      icon: Icons.cancel_outlined,
    );
  }
}

/// Pastille de validation d'un commerçant.
class ValidationStatusBadge extends StatelessWidget {
  const ValidationStatusBadge({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    if (status == 'Validé') {
      return CsPill(
        label: status,
        background: AppColors.greenSoft(),
        foreground: AppColors.green,
        icon: Icons.check_circle_outline,
      );
    }
    if (status == 'En attente') {
      return CsPill(
        label: status,
        background: AppColors.goldTint(0.6),
        foreground: AppColors.amberText,
        borderColor: AppColors.orangeSoft(0.3),
        icon: Icons.schedule,
        iconColor: AppColors.orange,
      );
    }
    return const CsPill(
      label: 'Rejeté',
      background: AppColors.red50,
      foreground: AppColors.red700,
      borderColor: AppColors.red200,
      icon: Icons.cancel_outlined,
    );
  }
}

/// Pastille d'état de compte utilisateur.
class AccountStatusBadge extends StatelessWidget {
  const AccountStatusBadge({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    if (status == 'Actif') {
      return const CsPill(
        label: 'Actif',
        background: Color(0x264C6749),
        foreground: AppColors.green,
        dotColor: AppColors.green,
      );
    }
    if (status == 'En attente') {
      return CsPill(
        label: 'En attente',
        background: AppColors.goldTint(0.55),
        foreground: AppColors.amberText,
        icon: Icons.schedule,
        iconColor: AppColors.orange,
      );
    }
    return const CsPill(
      label: 'Désactivé',
      background: AppColors.red50,
      foreground: AppColors.red700,
      borderColor: AppColors.red200,
      dotColor: AppColors.red600,
    );
  }
}

/// Pastille de rôle (étudiant / commerçant / administrateur).
class RoleBadge extends StatelessWidget {
  const RoleBadge({super.key, required this.role});

  final UserRole role;

  @override
  Widget build(BuildContext context) {
    switch (role) {
      case UserRole.admin:
        return CsPill(
          label: role.label,
          background: AppColors.primarySoft(0.15),
          foreground: AppColors.primary,
          icon: Icons.shield_outlined,
        );
      case UserRole.merchant:
        return CsPill(
          label: role.label,
          background: AppColors.orangeSoft(),
          foreground: AppColors.amberText,
          icon: Icons.storefront_outlined,
          iconColor: AppColors.orange,
        );
      case UserRole.student:
        return CsPill(
          label: role.label,
          background: AppColors.greenSoft(),
          foreground: AppColors.green,
          icon: Icons.person_outline,
        );
    }
  }
}

/// Pastille de statut d'une offre (commerçant).
class OfferStatusBadge extends StatelessWidget {
  const OfferStatusBadge({
    super.key,
    required this.status,
    required this.quantity,
  });

  final String status;
  final int quantity;

  @override
  Widget build(BuildContext context) {
    if (quantity == 0 || status == 'Épuisée') {
      return const CsPill(
        label: 'Épuisée',
        background: AppColors.stone100,
        foreground: AppColors.stone600,
        borderColor: AppColors.stone200,
        dotColor: AppColors.stone400,
      );
    }
    if (quantity <= 2 || status == 'Stock faible') {
      return CsPill(
        label: 'Stock faible ($quantity)',
        background: AppColors.goldTint(0.5),
        foreground: AppColors.amberText,
        borderColor: AppColors.orangeSoft(0.3),
        dotColor: AppColors.orange,
      );
    }
    return const CsPill(
      label: 'Active',
      background: Color(0x264C6749),
      foreground: AppColors.green,
      dotColor: AppColors.green,
    );
  }
}

/// Pastille de statut de publication (supervision des offres).
class PublicationStatusBadge extends StatelessWidget {
  const PublicationStatusBadge({super.key, required this.status});

  final String status;

  @override
  Widget build(BuildContext context) {
    if (status == 'Publiée') {
      return const CsPill(
        label: 'Publiée',
        background: Color(0x264C6749),
        foreground: AppColors.green,
        dotColor: AppColors.green,
      );
    }
    if (status == 'En attente') {
      return CsPill(
        label: 'En attente',
        background: AppColors.goldTint(0.6),
        foreground: AppColors.amberText,
        icon: Icons.schedule,
        iconColor: AppColors.orange,
      );
    }
    return const CsPill(
      label: 'Retirée',
      background: AppColors.stone100,
      foreground: AppColors.stone600,
      borderColor: AppColors.stone200,
      dotColor: AppColors.stone400,
    );
  }
}
