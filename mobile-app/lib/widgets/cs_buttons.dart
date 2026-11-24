import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';

/// Boutons CampusSave — équivalents exacts des classes Tailwind réutilisées
/// dans toutes les pages du projet React :
/// - `primaryBtn`   : terracotta, texte blanc, `rounded-xl`, `font-bold`
/// - `secondaryBtn` : blanc, contour or
/// - `greenBtn`     : vert (actions de paiement / retrait)
/// - `dangerBtn`    : rouge clair (suppression, rejet)
class CsButton extends StatelessWidget {
  const CsButton({
    super.key,
    required this.label,
    this.onPressed,
    this.icon,
    this.variant = CsButtonVariant.primary,
    this.expand = false,
    this.busy = false,
    this.compact = false,
    this.size = CsButtonSize.regular,
  });

  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final CsButtonVariant variant;
  final bool expand;
  final bool busy;
  final bool compact;
  final CsButtonSize size;

  @override
  Widget build(BuildContext context) {
    final style = _styleFor(variant);
    final height = switch (size) {
      CsButtonSize.small => 36.0,
      CsButtonSize.regular => compact ? 40.0 : 46.0,
      CsButtonSize.large => 54.0,
    };
    final padding = switch (size) {
      CsButtonSize.small => const EdgeInsets.symmetric(horizontal: 12),
      CsButtonSize.regular => EdgeInsets.symmetric(
        horizontal: compact ? 14 : 20,
      ),
      CsButtonSize.large => const EdgeInsets.symmetric(horizontal: 24),
    };

    final child = Row(
      mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (busy)
          SizedBox(
            width: 16,
            height: 16,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(style.foreground),
            ),
          )
        else if (icon != null)
          Icon(
            icon,
            size: size == CsButtonSize.small ? 14 : 16,
            color: style.foreground,
          ),
        if (busy || icon != null) const SizedBox(width: 8),
        Flexible(
          child: Text(
            label,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: AppText.sm(
              weight: FontWeight.w700,
              color: style.foreground,
            ).copyWith(fontSize: size == CsButtonSize.small ? 12 : 14),
          ),
        ),
      ],
    );

    final content = Container(
      constraints: BoxConstraints(minHeight: height),
      padding: padding,
      decoration: BoxDecoration(
        color: style.background,
        borderRadius: AppRadii.rXl,
        border: style.border,
        boxShadow: style.shadow,
      ),
      child: child,
    );

    return Semantics(
      button: true,
      enabled: onPressed != null && !busy,
      label: label,
      child: Material(
        color: Colors.transparent,
        borderRadius: AppRadii.rXl,
        child: InkWell(
          onTap: busy ? null : onPressed,
          borderRadius: AppRadii.rXl,
          splashColor: style.splash,
          highlightColor: Colors.transparent,
          child: expand
              ? SizedBox(width: double.infinity, child: content)
              : content,
        ),
      ),
    );
  }

  _ButtonStyle _styleFor(CsButtonVariant variant) {
    switch (variant) {
      case CsButtonVariant.primary:
        return const _ButtonStyle(
          background: AppColors.primary,
          foreground: Colors.white,
          splash: Color(0x33FFFFFF),
        );
      case CsButtonVariant.secondary:
        return const _ButtonStyle(
          background: Colors.white,
          foreground: AppColors.stone800,
          border: Border.fromBorderSide(
            BorderSide(color: AppColors.gold, width: 1),
          ),
        );
      case CsButtonVariant.green:
        return const _ButtonStyle(
          background: AppColors.green,
          foreground: Colors.white,
          shadow: AppShadows.md,
          splash: Color(0x33FFFFFF),
        );
      case CsButtonVariant.ghost:
        return const _ButtonStyle(
          background: Colors.transparent,
          foreground: AppColors.primary,
          border: Border.fromBorderSide(
            BorderSide(color: AppColors.gold, width: 1),
          ),
        );
      case CsButtonVariant.soft:
        return _ButtonStyle(
          background: AppColors.primarySoft(0.08),
          foreground: AppColors.primary,
        );
      case CsButtonVariant.danger:
        return const _ButtonStyle(
          background: AppColors.red50,
          foreground: AppColors.red700,
          border: Border.fromBorderSide(
            BorderSide(color: AppColors.red200, width: 1),
          ),
        );
      case CsButtonVariant.white:
        return const _ButtonStyle(
          background: Colors.white,
          foreground: AppColors.primary,
        );
    }
  }
}

enum CsButtonVariant { primary, secondary, green, ghost, soft, danger, white }

enum CsButtonSize { small, regular, large }

class _ButtonStyle {
  const _ButtonStyle({
    required this.background,
    required this.foreground,
    this.border,
    this.shadow = const <BoxShadow>[],
    this.splash = const Color(0x1A000000),
  });

  final Color background;
  final Color foreground;
  final Border? border;
  final List<BoxShadow> shadow;
  final Color splash;
}

/// Bouton icône arrondi utilisé dans les en-têtes mobiles
/// (`p-2.5 rounded-xl bg-[#A84F32] text-white`).
class CsIconButton extends StatelessWidget {
  const CsIconButton({
    super.key,
    required this.icon,
    this.onPressed,
    this.background = AppColors.primary,
    this.foreground = Colors.white,
    this.size = 42,
    this.badge = false,
    this.tooltip,
  });

  final IconData icon;
  final VoidCallback? onPressed;
  final Color background;
  final Color foreground;
  final double size;
  final bool badge;
  final String? tooltip;

  @override
  Widget build(BuildContext context) {
    final button = Stack(
      clipBehavior: Clip.none,
      children: [
        Material(
          color: background,
          borderRadius: AppRadii.rXl,
          child: InkWell(
            onTap: onPressed,
            borderRadius: AppRadii.rXl,
            child: SizedBox(
              width: size,
              height: size,
              child: Icon(icon, size: 20, color: foreground),
            ),
          ),
        ),
        if (badge)
          Positioned(
            top: 6,
            right: 6,
            child: Container(
              width: 10,
              height: 10,
              decoration: const BoxDecoration(
                color: AppColors.primary,
                shape: BoxShape.circle,
              ),
            ),
          ),
      ],
    );
    if (tooltip == null) return button;
    return Tooltip(message: tooltip!, child: button);
  }
}
