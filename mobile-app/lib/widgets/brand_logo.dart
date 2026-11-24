import 'package:material_ui/material_ui.dart';

/// Logo officiel CampusSave.
///
/// L'artwork fourni par la marque est utilisé tel quel ; seule sa hauteur
/// d'affichage change selon l'écran (ratio intrinsèque 800 × 485 préservé).
class BrandLogo extends StatelessWidget {
  const BrandLogo({super.key, this.height = 48, this.opacity = 1});

  /// Hauteur d'affichage en pixels logiques (`h-11`, `h-12`, `h-24`…).
  final double height;

  final double opacity;

  @override
  Widget build(BuildContext context) {
    return Opacity(
      opacity: opacity,
      child: Image.asset(
        'assets/images/campussave_logo.png',
        height: height,
        fit: BoxFit.contain,
        filterQuality: FilterQuality.high,
        semanticLabel: 'CampusSave – Moins de gaspillage, plus de partage',
        errorBuilder: (context, error, stackTrace) => SizedBox(
          height: height,
          child: Center(
            child: Text(
              'CampusSave',
              style: TextStyle(
                fontSize: height * 0.4,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.5,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
