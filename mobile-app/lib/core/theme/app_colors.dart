import 'package:material_ui/material_ui.dart';

/// Palette officielle CampusSave, reprise à l'identique des classes Tailwind du
/// projet React d'origine (`bg-[#F8F1E7]`, `text-[#A84F32]`, `border-[#E9C98B]`…).
///
/// Les valeurs sont celles de la charte graphique : terracotta (action), or
/// (contour), vert (impact écologique / validation) et orange (accent).
abstract final class AppColors {
  // --- Marque ---------------------------------------------------------------
  /// Fond crème de l'application (`bg-[#F8F1E7]`).
  static const Color background = Color(0xFFF8F1E7);

  /// Terracotta principal : boutons, liens actifs (`#A84F32`).
  static const Color primary = Color(0xFFA84F32);

  /// Terracotta foncé, état survolé / pressé (`#8E4128`).
  static const Color primaryDark = Color(0xFF8E4128);

  /// Or sable : contours de cartes, séparateurs (`#E9C98B`).
  static const Color gold = Color(0xFFE9C98B);

  /// Vert CampusSave : écologie, validation (`#4C6749`).
  static const Color green = Color(0xFF4C6749);

  /// Vert foncé (état pressé des boutons verts) (`#3D543A`).
  static const Color greenDark = Color(0xFF3D543A);

  /// Orange : accents, icônes secondaires (`#D98245`).
  static const Color orange = Color(0xFFD98245);

  /// Brun utilisé pour le texte des badges « en attente » (`#8A4B1C`).
  static const Color amberText = Color(0xFF8A4B1C);

  // --- Neutres (palette Tailwind `stone`) -----------------------------------
  static const Color stone50 = Color(0xFFFAFAF9);
  static const Color stone100 = Color(0xFFF5F5F4);
  static const Color stone200 = Color(0xFFE7E5E4);
  static const Color stone300 = Color(0xFFD6D3D1);
  static const Color stone400 = Color(0xFFA8A29E);
  static const Color stone500 = Color(0xFF78716C);
  static const Color stone600 = Color(0xFF57534E);
  static const Color stone700 = Color(0xFF44403C);
  static const Color stone800 = Color(0xFF292524);
  static const Color stone900 = Color(0xFF1C1917);

  /// Fond de la barre de notification (toast) sombre.
  static const Color toastBackground = Color(0xFF1C1917);

  // --- États ----------------------------------------------------------------
  static const Color red700 = Color(0xFFB91C1C);
  static const Color red600 = Color(0xFFDC2626);
  static const Color red200 = Color(0xFFFECACA);
  static const Color red50 = Color(0xFFFEF2F2);

  static const Color emerald800 = Color(0xFF065F46);
  static const Color emerald200 = Color(0xFFA7F3D0);
  static const Color emerald50 = Color(0xFFECFDF5);

  /// Or à 60 % d'opacité : `border-[#E9C98B]/60`.
  static Color goldSoft([double alpha = 0.6]) => gold.withValues(alpha: alpha);

  /// Terracotta translucide : `bg-[#A84F32]/10`.
  static Color primarySoft([double alpha = 0.1]) =>
      primary.withValues(alpha: alpha);

  /// Vert translucide : `bg-[#4C6749]/15`.
  static Color greenSoft([double alpha = 0.15]) =>
      green.withValues(alpha: alpha);

  /// Orange translucide : `bg-[#D98245]/15`.
  static Color orangeSoft([double alpha = 0.15]) =>
      orange.withValues(alpha: alpha);

  /// Or translucide : `bg-[#E9C98B]/50`.
  static Color goldTint([double alpha = 0.5]) => gold.withValues(alpha: alpha);
}
