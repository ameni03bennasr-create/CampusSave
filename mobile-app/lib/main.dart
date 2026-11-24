import 'package:material_ui/material_ui.dart';

import 'app.dart';
import 'core/theme/app_theme.dart';
import 'services/firebase_service.dart';
import 'state/app_scope.dart';
import 'widgets/cs_feedback.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await FirebaseService.ensureInitialized();
  runApp(const CampusSaveBootstrap());
}

class CampusSaveBootstrap extends StatefulWidget {
  const CampusSaveBootstrap({super.key});

  @override
  State<CampusSaveBootstrap> createState() => _CampusSaveBootstrapState();
}

class _CampusSaveBootstrapState extends State<CampusSaveBootstrap> {
  late final AppRoot _root = AppRoot();
  late final Future<void> _loading = _root.bootstrap();

  @override
  void dispose() {
    _root.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<void>(
      future: _loading,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            theme: AppTheme.light,
            home: const LoadingScreen(message: 'Chargement de CampusSave…'),
          );
        }
        return CampusSaveApp(root: _root);
      },
    );
  }
}
