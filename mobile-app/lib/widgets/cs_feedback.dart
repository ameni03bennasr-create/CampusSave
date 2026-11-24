import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';
import '../core/theme/app_text.dart';
import 'brand_logo.dart';
import 'cs_buttons.dart';

/// Bloc « aucun contenu » standard des trois espaces.
///
/// Reprend `EmptyState.tsx` : icône dans un carré crème, titre, description et
/// une ou deux actions. Aucun contenu inventé n'est affiché à la place.
class EmptyState extends StatelessWidget {
  const EmptyState({
    super.key,
    required this.icon,
    required this.title,
    this.description,
    this.actionLabel,
    this.onAction,
    this.secondaryActionLabel,
    this.onSecondaryAction,
    this.compact = false,
    this.borderless = false,
  });

  final IconData icon;
  final String title;
  final String? description;
  final String? actionLabel;
  final VoidCallback? onAction;
  final String? secondaryActionLabel;
  final VoidCallback? onSecondaryAction;
  final bool compact;

  /// Utilisé lorsque le bloc est déjà posé dans une carte (`border-0`).
  final bool borderless;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(
        horizontal: compact ? 20 : 24,
        vertical: compact ? 28 : 44,
      ),
      decoration: BoxDecoration(
        color: borderless ? Colors.transparent : Colors.white,
        borderRadius: AppRadii.rXl3,
        border: borderless ? null : AppBorders.card,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: AppRadii.rXl2,
            ),
            child: Icon(icon, size: 26, color: AppColors.primary),
          ),
          const SizedBox(height: 14),
          Text(
            title,
            textAlign: TextAlign.center,
            style: AppText.base(weight: FontWeight.w800),
          ),
          if (description != null)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(
                description!,
                textAlign: TextAlign.center,
                style: AppText.sm(color: AppColors.stone500, height: 1.45),
              ),
            ),
          if (actionLabel != null && onAction != null ||
              secondaryActionLabel != null && onSecondaryAction != null)
            Padding(
              padding: const EdgeInsets.only(top: 20),
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                alignment: WrapAlignment.center,
                children: [
                  if (actionLabel != null && onAction != null)
                    CsButton(
                      label: actionLabel!,
                      onPressed: onAction,
                      compact: true,
                    ),
                  if (secondaryActionLabel != null && onSecondaryAction != null)
                    CsButton(
                      label: secondaryActionLabel!,
                      onPressed: onSecondaryAction,
                      variant: CsButtonVariant.secondary,
                      compact: true,
                    ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Écran de chargement plein écran (équivalent de `LoadingScreen.tsx`).
class LoadingScreen extends StatelessWidget {
  const LoadingScreen({super.key, this.message});

  final String? message;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const BrandLogo(height: 92, opacity: 0.9),
            const SizedBox(height: 22),
            const SizedBox(
              width: 24,
              height: 24,
              child: CircularProgressIndicator(
                strokeWidth: 2.4,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.primary),
              ),
            ),
            if (message != null)
              Padding(
                padding: const EdgeInsets.only(top: 14),
                child: Text(
                  message!,
                  style: AppText.xs(color: AppColors.stone500),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Erreur de dernier recours (équivalent de `ErrorBoundary.tsx`).
class CsErrorView extends StatelessWidget {
  const CsErrorView({
    super.key,
    this.title = 'Une erreur est survenue',
    this.message =
        'Quelque chose s’est mal passé lors de l’affichage de cette page.',
    this.onRetry,
    this.onHome,
  });

  final String title;
  final String message;
  final VoidCallback? onRetry;
  final VoidCallback? onHome;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const BrandLogo(height: 92),
              const SizedBox(height: 18),
              Text(title, style: AppText.xl()),
              const SizedBox(height: 8),
              Text(
                message,
                textAlign: TextAlign.center,
                style: AppText.sm(color: AppColors.stone500),
              ),
              const SizedBox(height: 20),
              Wrap(
                spacing: 10,
                children: [
                  if (onRetry != null)
                    CsButton(label: 'Recharger la page', onPressed: onRetry),
                  if (onHome != null)
                    CsButton(
                      label: 'Accueil',
                      onPressed: onHome,
                      variant: CsButtonVariant.secondary,
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Notification éphémère (toast) sombre avec coche dorée.
///
/// Équivalent du bloc `toast` des layouts React : fond `stone-900`, icône or,
/// bordure `stone-700`, affiché en bas de l'écran pendant 3,8 s.
abstract final class CsToast {
  static OverlayEntry? _current;

  static void show(
    BuildContext context,
    String message, {
    bool success = true,
  }) {
    final overlay = Overlay.maybeOf(context, rootOverlay: true);
    if (overlay == null) return;

    _dismiss();

    final entry = OverlayEntry(
      builder: (context) => Positioned(
        left: 16,
        right: 16,
        bottom: MediaQuery.of(context).padding.bottom + 84,
        child: _ToastCard(message: message, success: success),
      ),
    );
    _current = entry;
    overlay.insert(entry);

    Future<void>.delayed(const Duration(milliseconds: 3800), () {
      if (_current == entry) _dismiss();
    });
  }

  static void _dismiss() {
    _current?.remove();
    _current = null;
  }
}

class _ToastCard extends StatelessWidget {
  const _ToastCard({required this.message, required this.success});

  final String message;
  final bool success;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
        decoration: BoxDecoration(
          color: AppColors.toastBackground,
          borderRadius: AppRadii.rXl2,
          border: Border.all(color: AppColors.stone700),
          boxShadow: AppShadows.xl,
        ),
        child: Row(
          children: [
            Icon(
              success ? Icons.check_circle_outline : Icons.info_outline,
              size: 20,
              color: AppColors.gold,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                message,
                style: AppText.sm(
                  weight: FontWeight.w500,
                  color: Colors.white,
                  height: 1.35,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Bandeau d'alerte inline (erreur de formulaire, refus de validation).
class CsAlert extends StatelessWidget {
  const CsAlert({
    super.key,
    required this.message,
    this.title,
    this.icon = Icons.error_outline,
    this.color = AppColors.red700,
  });

  final String message;
  final String? title;
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color == AppColors.red700
            ? AppColors.red50
            : color.withValues(alpha: 0.10),
        borderRadius: AppRadii.rXl,
        border: Border.all(
          color: color == AppColors.red700
              ? AppColors.red200
              : color.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 16, color: color),
          const SizedBox(width: 8),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (title != null)
                  Text(
                    title!,
                    style: AppText.xs(weight: FontWeight.w800, color: color),
                  ),
                Text(
                  message,
                  style: AppText.xs(
                    weight: FontWeight.w600,
                    color: color,
                    height: 1.45,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
