import 'package:material_ui/material_ui.dart';

import '../../widgets/placeholder_screen.dart';

/// Ecran NotFound - portage de la page React correspondante.
class NotFoundScreen extends StatelessWidget {
  const NotFoundScreen({super.key});

  @override
  Widget build(BuildContext context) =>
      const PlaceholderScreen(title: 'NotFound');
}
