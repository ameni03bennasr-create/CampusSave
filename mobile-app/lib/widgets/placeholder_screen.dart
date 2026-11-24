import 'package:material_ui/material_ui.dart';

import '../core/theme/app_colors.dart';
import '../core/theme/app_text.dart';

/// Écran temporaire utilisé pendant le portage d'une page.
///
/// Il ne reste aucun écran dans cet état dans la version livrée : il sert de
/// garde-fou de compilation pendant le développement.
class PlaceholderScreen extends StatelessWidget {
  const PlaceholderScreen({super.key, required this.title, this.subtitle});

  final String title;
  final String? subtitle;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(
              Icons.construction_outlined,
              size: 34,
              color: AppColors.stone300,
            ),
            const SizedBox(height: 10),
            Text(title, style: AppText.lg(), textAlign: TextAlign.center),
            if (subtitle != null)
              Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(
                  subtitle!,
                  textAlign: TextAlign.center,
                  style: AppText.sm(color: AppColors.stone500),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
