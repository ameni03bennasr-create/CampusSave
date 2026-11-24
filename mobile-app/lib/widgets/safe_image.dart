import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_style.dart';

/// Image avec repli neutre — équivalent de `SafeImage.tsx`.
///
/// Accepte un chemin d'asset local (`assets/images/...`) ou une URL réseau
/// (photo saisie par le commerçant). En cas d'absence ou d'échec de
/// chargement, un bloc crème avec icône est affiché : jamais d'image cassée.
class SafeImage extends StatelessWidget {
  const SafeImage({
    super.key,
    required this.src,
    this.width,
    this.height,
    this.fit = BoxFit.cover,
    this.radius = 12,
    this.placeholderIcon = Icons.image_not_supported_outlined,
    this.placeholderSize,
  });

  final String? src;
  final double? width;
  final double? height;
  final BoxFit fit;
  final double radius;
  final IconData placeholderIcon;
  final double? placeholderSize;

  bool get _isNetwork =>
      src != null &&
      (src!.startsWith('http://') || src!.startsWith('https://'));

  @override
  Widget build(BuildContext context) {
    final borderRadius = BorderRadius.circular(radius);
    return ClipRRect(
      borderRadius: borderRadius,
      child: SizedBox(width: width, height: height, child: _buildImage()),
    );
  }

  Widget _buildImage() {
    if (src == null || src!.isEmpty) return _placeholder();

    if (_isNetwork) {
      return Image.network(
        src!,
        fit: fit,
        width: width,
        height: height,
        loadingBuilder: (context, child, progress) =>
            progress == null ? child : _placeholder(loading: true),
        errorBuilder: (context, error, stackTrace) => _placeholder(),
      );
    }

    return Image.asset(
      src!,
      fit: fit,
      width: width,
      height: height,
      errorBuilder: (context, error, stackTrace) => _placeholder(),
    );
  }

  Widget _placeholder({bool loading = false}) {
    final side =
        placeholderSize ?? ((width ?? height ?? 48) * 0.3).clamp(14, 32);
    return Container(
      width: width,
      height: height,
      color: AppColors.background,
      alignment: Alignment.center,
      child: loading
          ? const SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(
                strokeWidth: 1.6,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.gold),
              ),
            )
          : Icon(placeholderIcon, size: side, color: AppColors.stone300),
    );
  }
}

/// Photo de profil, ou initiales lorsque l'utilisateur n'a pas d'image.
class Avatar extends StatelessWidget {
  const Avatar({
    super.key,
    this.src,
    required this.name,
    this.size = 40,
    this.radius,
    this.background = const Color(0x26A84F32),
    this.foreground = AppColors.primary,
  });

  final String? src;
  final String name;
  final double size;
  final double? radius;
  final Color background;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    if (src != null && src!.isNotEmpty) {
      return SafeImage(
        src: src,
        width: size,
        height: size,
        radius: radius ?? size / 2,
      );
    }
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(radius ?? size / 2),
      ),
      alignment: Alignment.center,
      child: Text(
        _initials(name),
        style: TextStyle(
          fontSize: size * 0.34,
          fontWeight: FontWeight.w800,
          color: foreground,
        ),
      ),
    );
  }

  static String _initials(String name) {
    final parts = name
        .trim()
        .split(RegExp(r'\s+'))
        .where((p) => p.isNotEmpty)
        .toList();
    if (parts.isEmpty) return '?';
    final first = parts.first.substring(0, 1);
    final last = parts.length > 1 ? parts.last.substring(0, 1) : '';
    return (first + last).toUpperCase();
  }
}

/// Pastille d'icône ronde utilisée dans les listes et bannières
/// (`w-9 h-9 rounded-full bg-[#4C6749]`).
class CsIconBadge extends StatelessWidget {
  const CsIconBadge({
    super.key,
    required this.icon,
    this.background = AppColors.primary,
    this.foreground = Colors.white,
    this.size = 36,
    this.radius,
    this.iconSize,
  });

  final IconData icon;
  final Color background;
  final Color foreground;
  final double size;
  final double? radius;
  final double? iconSize;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(radius ?? size / 2),
      ),
      alignment: Alignment.center,
      child: Icon(icon, size: iconSize ?? size * 0.5, color: foreground),
    );
  }
}

/// Vignette carrée d'une offre avec pastille de remise et stock restant.
class OfferImage extends StatelessWidget {
  const OfferImage({
    super.key,
    required this.src,
    this.height = 160,
    this.radius = 16,
    this.discountPercent,
    this.remainingLabel,
    this.surpriseBasket = false,
  });

  final String? src;
  final double height;
  final double radius;
  final int? discountPercent;
  final String? remainingLabel;
  final bool surpriseBasket;

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        SafeImage(src: src, width: 112, height: height, radius: radius),
        if (discountPercent != null)
          Positioned(
            top: 12,
            left: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: AppRadii.rLg,
              ),
              child: Text(
                '-$discountPercent%',
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        if (surpriseBasket)
          Positioned(
            top: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.green,
                borderRadius: AppRadii.rLg,
              ),
              child: const Text(
                'Panier surprise',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
        if (remainingLabel != null)
          Positioned(
            bottom: 12,
            right: 12,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.95),
                borderRadius: AppRadii.rLg,
              ),
              child: Text(
                remainingLabel!,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: AppColors.stone800,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
