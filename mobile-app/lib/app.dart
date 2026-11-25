import 'package:material_ui/material_ui.dart';

import 'core/theme/app_theme.dart';
import 'routing/app_router.dart';
import 'routing/route_names.dart';
import 'state/app_scope.dart';

/// Application CampusSave.
///
/// Fournit l'état applicatif à tout l'arbre ([AppScope]) puis délègue la
/// navigation au routeur central.
class CampusSaveApp extends StatelessWidget {
  const CampusSaveApp({super.key, required this.root});

  final AppRoot root;

  @override
  Widget build(BuildContext context) {
    return AppScope(
      root: root,
      child: MaterialApp(
        title: 'CampusSave',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        initialRoute: Routes.landing,
        onGenerateRoute: (settings) => AppRouter.generate(settings, root),

        // Application francophone.
        locale: const Locale('fr', 'TN'),
        supportedLocales: const <Locale>[
          Locale('fr', 'TN'),
          Locale('fr'),
          Locale('en'),
        ],

        // Nouveaux delegates de localisation.
        localizationsDelegates: GlobalMaterialLocalizations.delegates,

        builder: (context, child) {
          // Évite le débordement horizontal des textes sur petits écrans.
          return MediaQuery.withClampedTextScaling(
            minScaleFactor: 1,
            maxScaleFactor: 1.2,
            child: child ?? const SizedBox.shrink(),
          );
        },
      ),
    );
  }
}
