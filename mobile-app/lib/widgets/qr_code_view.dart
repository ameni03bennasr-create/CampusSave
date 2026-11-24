import 'package:material_ui/material_ui.dart';
import 'package:qr_flutter/qr_flutter.dart';

import '../core/theme/app_colors.dart';

/// QR Code de retrait réel et scannable.
///
/// Remplace `QrCodeDisplay.tsx` (qrcode.react) : même rendu noir sur blanc,
/// niveau de correction `M`, sans marge interne.
class QrCodeView extends StatelessWidget {
  const QrCodeView({
    super.key,
    required this.value,
    this.size = 188,
    this.foreground = AppColors.stone900,
  });

  final String value;
  final double size;
  final Color foreground;

  @override
  Widget build(BuildContext context) {
    if (value.isEmpty) {
      return SizedBox(
        width: size,
        height: size,
        child: const Center(
          child: Icon(Icons.qr_code_2, size: 48, color: AppColors.stone300),
        ),
      );
    }
    return QrImageView(
      data: value,
      version: QrVersions.auto,
      size: size,
      backgroundColor: Colors.white,
      eyeStyle: QrEyeStyle(eyeShape: QrEyeShape.square, color: foreground),
      dataModuleStyle: QrDataModuleStyle(
        dataModuleShape: QrDataModuleShape.square,
        color: foreground,
      ),
      gapless: true,
      semanticsLabel: 'QR Code de retrait',
    );
  }
}
