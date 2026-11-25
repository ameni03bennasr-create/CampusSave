import 'package:material_ui/material_ui.dart';
import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';

/// Carte blanche CampusSave : `bg-white rounded-2xl border border-[#E9C98B]/60`.
class CsCard extends StatelessWidget {
  const CsCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.radius = 16,
    this.onTap,
    this.color = Colors.white,
    this.borderColor,
    this.borderWidth = 1,
    this.shadow = AppShadows.xs2,
    this.margin,
    this.clip = false,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final VoidCallback? onTap;
  final Color color;
  final Color? borderColor;
  final double borderWidth;
  final List<BoxShadow> shadow;
  final EdgeInsetsGeometry? margin;
  final bool clip;

  @override
  Widget build(BuildContext context) {
    final content = Container(
      margin: margin,
      padding: padding,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(
          color: borderColor ?? AppColors.goldSoft(0.6),
          width: borderWidth,
        ),
        boxShadow: shadow,
      ),
      clipBehavior: clip ? Clip.antiAlias : Clip.none,
      child: child,
    );

    if (onTap == null) return content;
    return Material(
      color: Colors.transparent,
      borderRadius: BorderRadius.circular(radius),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(radius),
        splashColor: AppColors.primarySoft(0.06),
        highlightColor: Colors.transparent,
        child: content,
      ),
    );
  }
}

/// En-tête de section : titre + sous-titre + action facultative
/// (`text-xl font-extrabold` + lien terracotta).
class SectionHeader extends StatelessWidget {
  const SectionHeader({
    super.key,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onAction,
    this.actionIcon,
  });

  final String title;
  final String? subtitle;
  final String? actionLabel;
  final VoidCallback? onAction;
  final IconData? actionIcon;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(title, style: AppText.xl()),
              if (subtitle != null)
                Padding(
                  padding: const EdgeInsets.only(top: 3),
                  child: Text(
                    subtitle!,
                    style: AppText.xs(color: AppColors.stone500),
                  ),
                ),
            ],
          ),
        ),
        if (actionLabel != null && onAction != null) ...[
          const SizedBox(width: 8),
          _TextAction(
            label: actionLabel!,
            onPressed: onAction!,
            icon: actionIcon,
          ),
        ],
      ],
    );
  }
}

/// Lien d'action (`text-sm font-bold text-[#A84F32]`).
class _TextAction extends StatelessWidget {
  const _TextAction({required this.label, required this.onPressed, this.icon});

  final String label;
  final VoidCallback onPressed;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      borderRadius: AppRadii.rLg,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 2),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: AppText.xs(
                weight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
            if (icon != null) ...[
              const SizedBox(width: 2),
              Icon(icon, size: 14, color: AppColors.primary),
            ],
          ],
        ),
      ),
    );
  }
}

/// Action texte réutilisable (liens « Tout explorer », « Valider → »…).
class CsTextLink extends StatelessWidget {
  const CsTextLink({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.color = AppColors.primary,
    this.fontSize = 12,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Color color;
  final double fontSize;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onPressed,
      borderRadius: AppRadii.rLg,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 3, horizontal: 1),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              label,
              style: AppText.xs(
                weight: FontWeight.w700,
                color: color,
              ).copyWith(fontSize: fontSize),
            ),
            if (icon != null) ...[
              const SizedBox(width: 2),
              Icon(icon, size: fontSize + 2, color: color),
            ],
          ],
        ),
      ),
    );
  }
}

/// En-tête de page : surtitre (étape / espace), titre, description.
class PageHeader extends StatelessWidget {
  const PageHeader({
    super.key,
    required this.title,
    this.eyebrow,
    this.subtitle,
    this.eyebrowColor = AppColors.primary,
    this.trailing,
    this.onBack,
    this.backLabel,
  });

  final String title;
  final String? eyebrow;
  final String? subtitle;
  final Color eyebrowColor;
  final Widget? trailing;
  final VoidCallback? onBack;
  final String? backLabel;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (onBack != null)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: InkWell(
              onTap: onBack,
              borderRadius: AppRadii.rLg,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.chevron_left,
                      size: 16,
                      color: AppColors.stone600,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      backLabel ?? 'Retour',
                      style: AppText.xs(
                        weight: FontWeight.w700,
                        color: AppColors.stone600,
                      ).copyWith(fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
          ),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (eyebrow != null)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: Text(
                        eyebrow!.toUpperCase(),
                        style: AppText.t11(
                          weight: FontWeight.w800,
                          color: eyebrowColor,
                          letterSpacing: 0.9,
                        ),
                      ),
                    ),
                  Text(title, style: AppText.xl2()),
                  if (subtitle != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(
                        subtitle!,
                        style: AppText.sm(color: AppColors.stone500),
                      ),
                    ),
                ],
              ),
            ),
            if (trailing != null) ...[const SizedBox(width: 12), trailing!],
          ],
        ),
      ],
    );
  }
}

/// Carte d'indicateur clé (KPI) : libellé, valeur, note.
class StatCard extends StatelessWidget {
  const StatCard({
    super.key,
    required this.label,
    required this.value,
    this.note,
    this.valueColor = AppColors.stone900,
    this.onTap,
    this.highlighted = false,
    this.icon,
  });

  final String label;
  final String value;
  final String? note;
  final Color valueColor;
  final VoidCallback? onTap;
  final bool highlighted;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return CsCard(
      onTap: onTap,
      padding: const EdgeInsets.all(16),
      radius: 16,
      borderWidth: highlighted ? 2 : 1,
      borderColor: highlighted ? AppColors.orangeSoft(0.6) : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  label.toUpperCase(),
                  style: AppText.t11(
                    weight: FontWeight.w800,
                    color: highlighted ? AppColors.primary : AppColors.stone400,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              if (icon != null)
                Icon(
                  icon,
                  size: 15,
                  color: highlighted ? AppColors.orange : AppColors.stone300,
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: AppText.xl2(
              weight: FontWeight.w800,
              color: valueColor,
            ).copyWith(fontSize: 24),
          ),
          if (note != null)
            Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(
                note!,
                style: AppText.t11(
                  color: highlighted ? AppColors.amberText : AppColors.stone500,
                  weight: FontWeight.w600,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Ligne « libellé / valeur » des pages de détail.
class CsInfoRow extends StatelessWidget {
  const CsInfoRow({
    super.key,
    required this.label,
    required this.value,
    this.valueColor = AppColors.stone800,
    this.labelWidth,
  });

  final String label;
  final String value;
  final Color valueColor;
  final double? labelWidth;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: labelWidth ?? 132,
            child: Text(label, style: AppText.xs(color: AppColors.stone500)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              value,
              style: AppText.xs(weight: FontWeight.w700, color: valueColor),
            ),
          ),
        ],
      ),
    );
  }
}

/// Barre de répartition bicolore (budget payé / économies).
class CsSplitBar extends StatelessWidget {
  const CsSplitBar({
    super.key,
    required this.leftFraction,
    this.leftColor = AppColors.orange,
    this.rightColor = AppColors.green,
    this.height = 20,
  });

  final double leftFraction;
  final Color leftColor;
  final Color rightColor;
  final double height;

  @override
  Widget build(BuildContext context) {
    final left = leftFraction.clamp(0.0, 1.0);
    return ClipRRect(
      borderRadius: BorderRadius.circular(height / 3.5),
      child: Container(
        height: height,
        color: AppColors.background,
        child: Row(
          children: [
            if (left > 0)
              Expanded(
                flex: (left * 1000).round(),
                child: Container(color: leftColor),
              ),
            if (left < 1)
              Expanded(
                flex: ((1 - left) * 1000).round(),
                child: Container(color: rightColor),
              ),
          ],
        ),
      ),
    );
  }
}

/// Légende de graphique / barre de répartition.
class CsLegendDot extends StatelessWidget {
  const CsLegendDot({super.key, required this.color, required this.label});

  final Color color;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(color: color, shape: BoxShape.circle),
        ),
        const SizedBox(width: 6),
        Flexible(
          child: Text(
            label,
            style: AppText.xs(
              weight: FontWeight.w600,
              color: AppColors.stone700,
            ),
          ),
        ),
      ],
    );
  }
}

/// Bandeau d'information coloré (sécurité paiement, rappels).
class CsInfoBanner extends StatelessWidget {
  const CsInfoBanner({
    super.key,
    required this.title,
    required this.message,
    this.icon = Icons.verified_user_outlined,
    this.color = AppColors.green,
  });

  final String title;
  final String message;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.10),
        borderRadius: AppRadii.rXl2,
        border: Border.all(color: color.withValues(alpha: 0.25)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: AppText.xs(weight: FontWeight.w800, color: color),
                ),
                const SizedBox(height: 3),
                Text(
                  message,
                  style: AppText.xs(color: AppColors.stone700, height: 1.45),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Grille adaptative de cartes KPI (1 / 2 / 3 colonnes selon la largeur).
class CsKpiGrid extends StatelessWidget {
  const CsKpiGrid({super.key, required this.children, this.minItemWidth = 150});

  final List<Widget> children;
  final double minItemWidth;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = (constraints.maxWidth / minItemWidth).floor().clamp(
          1,
          3,
        );
        return Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            for (final child in children)
              SizedBox(
                width: (constraints.maxWidth - (columns - 1) * 12) / columns,
                child: child,
              ),
          ],
        );
      },
    );
  }
}
