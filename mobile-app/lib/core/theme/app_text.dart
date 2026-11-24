import 'package:material_ui/material_ui.dart';

import 'app_colors.dart';

/// Fabrique de [TextStyle] alignée sur l'échelle typographique Tailwind utilisée
/// dans l'interface React (`text-xs`, `text-sm`, `font-extrabold`…).
abstract final class AppText {
  static const String fontFamily = 'Roboto';

  /// `text-[10px]`
  static TextStyle t10({
    FontWeight weight = FontWeight.w700,
    Color color = AppColors.stone700,
    double? height,
    double? letterSpacing,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 10,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );

  /// `text-[11px]`
  static TextStyle t11({
    FontWeight weight = FontWeight.w600,
    Color color = AppColors.stone500,
    double? height,
    double? letterSpacing,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 11,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );

  /// `text-xs` (12 px)
  static TextStyle xs({
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.stone600,
    double? height,
    double? letterSpacing,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 12,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );

  /// `text-sm` (14 px) — texte courant de l'application.
  static TextStyle sm({
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.stone600,
    double? height,
    double? letterSpacing,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 14,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );

  /// `text-base` (16 px)
  static TextStyle base({
    FontWeight weight = FontWeight.w400,
    Color color = AppColors.stone700,
    double? height,
    double? letterSpacing,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 16,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: letterSpacing,
  );

  /// `text-lg` (18 px)
  static TextStyle lg({
    FontWeight weight = FontWeight.w700,
    Color color = AppColors.stone900,
    double? height,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 18,
    fontWeight: weight,
    color: color,
    height: height,
  );

  /// `text-xl` (20 px)
  static TextStyle xl({
    FontWeight weight = FontWeight.w800,
    Color color = AppColors.stone900,
    double? height,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 20,
    fontWeight: weight,
    color: color,
    height: height,
  );

  /// `text-2xl` (24 px) — titres de page.
  static TextStyle xl2({
    FontWeight weight = FontWeight.w800,
    Color color = AppColors.stone900,
    double? height,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 24,
    fontWeight: weight,
    color: color,
    height: height,
  );

  /// `text-3xl` (30 px)
  static TextStyle xl3({
    FontWeight weight = FontWeight.w800,
    Color color = AppColors.stone900,
    double? height,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 30,
    fontWeight: weight,
    color: color,
    height: height,
  );

  /// `text-4xl` (36 px) — accroche du hero.
  static TextStyle xl4({
    FontWeight weight = FontWeight.w800,
    Color color = AppColors.stone900,
    double? height = 1.1,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 36,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: -0.5,
  );

  /// `text-5xl` (48 px)
  static TextStyle xl5({
    FontWeight weight = FontWeight.w800,
    Color color = AppColors.stone900,
    double? height = 1.1,
  }) => TextStyle(
    fontFamily: fontFamily,
    fontSize: 48,
    fontWeight: weight,
    color: color,
    height: height,
    letterSpacing: -1,
  );
}
