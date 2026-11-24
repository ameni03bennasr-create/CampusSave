import 'package:material_ui/material_ui.dart';

import 'app_colors.dart';
import 'app_style.dart';
import 'app_text.dart';

/// Thème Material 3 de CampusSave : fond crème, surfaces blanches, accent
/// terracotta et contours or. Les composants Material sont alignés sur la
/// charte pour que les widgets standards (champs, dialogues, snackbars)
/// restent cohérents avec les composants sur mesure.
abstract final class AppTheme {
  static ThemeData get light {
    final colorScheme =
        ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ).copyWith(
          primary: AppColors.primary,
          onPrimary: Colors.white,
          secondary: AppColors.green,
          onSecondary: Colors.white,
          surface: Colors.white,
          onSurface: AppColors.stone800,
          error: AppColors.red700,
          outline: AppColors.gold,
          surfaceContainerHighest: AppColors.background,
        );

    final base = ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: AppText.fontFamily,
      splashFactory: InkRipple.splashFactory,
    );

    return base.copyWith(
      textTheme: base.textTheme.apply(
        bodyColor: AppColors.stone800,
        displayColor: AppColors.stone900,
        fontFamily: AppText.fontFamily,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.stone800,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: AppText.base(weight: FontWeight.w800),
      ),
      dialogTheme: DialogThemeData(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: AppRadii.rXl3),
        titleTextStyle: AppText.lg(),
        contentTextStyle: AppText.sm(),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
      dividerTheme: DividerThemeData(
        color: AppColors.goldSoft(0.5),
        thickness: 1,
        space: 1,
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: AppColors.toastBackground,
        contentTextStyle: AppText.sm(
          weight: FontWeight.w500,
          color: Colors.white,
          height: 1.35,
        ),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: AppRadii.rXl2),
        elevation: 8,
      ),
      progressIndicatorTheme: const ProgressIndicatorThemeData(
        color: AppColors.primary,
        linearTrackColor: AppColors.background,
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? Colors.white
              : Colors.white,
        ),
        trackColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? AppColors.green
              : AppColors.stone300,
        ),
        trackOutlineColor: WidgetStateProperty.resolveWith(
          (states) => states.contains(WidgetState.selected)
              ? AppColors.green
              : AppColors.stone300,
        ),
      ),
      textSelectionTheme: const TextSelectionThemeData(
        cursorColor: AppColors.primary,
        selectionColor: Color(0x33A84F32),
        selectionHandleColor: AppColors.primary,
      ),
      scrollbarTheme: ScrollbarThemeData(
        thumbColor: WidgetStateProperty.all(AppColors.goldSoft(0.8)),
        radius: const Radius.circular(8),
      ),
    );
  }
}
