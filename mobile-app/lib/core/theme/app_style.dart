import 'package:material_ui/material_ui.dart';

import 'app_colors.dart';

/// Rayons, espacements et ombres repris des classes Tailwind du projet React.
abstract final class AppRadii {
  static const double lg = 8; // rounded-lg
  static const double xl = 12; // rounded-xl
  static const double xl2 = 16; // rounded-2xl
  static const double xl3 = 24; // rounded-3xl
  static const double xl32 = 32; // rounded-[2rem]
  static const double full = 999; // rounded-full

  static BorderRadius get rLg => BorderRadius.circular(lg);
  static BorderRadius get rXl => BorderRadius.circular(xl);
  static BorderRadius get rXl2 => BorderRadius.circular(xl2);
  static BorderRadius get rXl3 => BorderRadius.circular(xl3);
  static BorderRadius get rXl32 => BorderRadius.circular(xl32);
  static BorderRadius get rFull => BorderRadius.circular(full);
}

/// Espacements (échelle Tailwind : 1 = 4 px).
abstract final class AppSpacing {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 12;
  static const double base = 16;
  static const double lg = 20;
  static const double xl = 24;
  static const double xl2 = 32;
  static const double xl3 = 40;
  static const double xl4 = 48;

  /// Padding horizontal du contenu principal (`px-4 sm:px-6 lg:px-10`).
  static const double pagePadding = 16;
}

/// Ombres officielles Tailwind v4 (voir `tailwind.config.js` du projet React).
abstract final class AppShadows {
  /// `shadow-2xs` — 0 1px rgb(0 0 0 / 0.05)
  static const List<BoxShadow> xs2 = [
    BoxShadow(color: Color(0x0D000000), blurRadius: 0, offset: Offset(0, 1)),
  ];

  /// `shadow-xs` — 0 1px 2px 0 rgb(0 0 0 / 0.05)
  static const List<BoxShadow> xs = [
    BoxShadow(color: Color(0x0D000000), blurRadius: 2, offset: Offset(0, 1)),
  ];

  /// `shadow-sm` — 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
  static const List<BoxShadow> sm = [
    BoxShadow(color: Color(0x1A000000), blurRadius: 3, offset: Offset(0, 1)),
    BoxShadow(color: Color(0x1A000000), blurRadius: 2, offset: Offset(0, 1)),
  ];

  /// `shadow-md`
  static const List<BoxShadow> md = [
    BoxShadow(color: Color(0x1A000000), blurRadius: 6, offset: Offset(0, 4)),
    BoxShadow(color: Color(0x1A000000), blurRadius: 4, offset: Offset(0, 2)),
  ];

  /// `shadow-xl`
  static const List<BoxShadow> xl = [
    BoxShadow(color: Color(0x1A000000), blurRadius: 25, offset: Offset(0, 20)),
    BoxShadow(color: Color(0x1A000000), blurRadius: 10, offset: Offset(0, 8)),
  ];

  /// `shadow-2xl`
  static const List<BoxShadow> xl2 = [
    BoxShadow(color: Color(0x40000000), blurRadius: 50, offset: Offset(0, 25)),
  ];
}

/// Couleurs par défaut des bordures de cartes CampusSave.
abstract final class AppBorders {
  static Border get card => Border.all(color: AppColors.goldSoft(0.6));

  static Border get cardLight => Border.all(color: AppColors.goldSoft(0.5));

  static Border get divider => Border.all(color: AppColors.background);
}
