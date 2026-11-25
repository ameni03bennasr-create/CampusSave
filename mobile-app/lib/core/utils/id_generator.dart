/// Génération d'identifiants locaux et d'horodatages lisibles.
///
/// Ces valeurs sont produites côté client uniquement parce que la démonstration
/// n'a pas de backend. Avec l'API en place, les identifiants (référence de
/// commande, jeton QR, identifiant de notification) seront émis par le serveur
/// et ces fonctions disparaîtront des écrans.
library;

import 'dart:math';

abstract final class IdGenerator {
  static final Random _random = Random();
  static int _orderSequence = 841;

  /// Référence de commande au format du cahier des charges : `#CS-2026-842`.
  static String nextOrderId() {
    _orderSequence += 1;
    return '#CS-2026-$_orderSequence';
  }

  /// Jeton QR lisible, dérivé de la référence de commande.
  ///
  /// En production ce jeton est signé par le backend : il constitue la preuve
  /// de paiement présentée au commerçant lors du retrait.
  static String qrTokenFor(String orderId, String seed) {
    final digits = orderId.replaceAll(RegExp(r'[^0-9]'), '');
    final suffix = (digits.length >= 3 ? digits.substring(digits.length - 3) : digits)
        .padLeft(3, '0');
    final word = seed
        .toUpperCase()
        .replaceAll(RegExp(r'[^A-Z]'), '')
        .padRight(4, 'X')
        .substring(0, 4);
    return 'CSQR-2026-$suffix-$word';
  }

  static String notificationId() =>
      'NOTIF-${DateTime.now().microsecondsSinceEpoch}';

  static String activityId() =>
      'ACT-${DateTime.now().microsecondsSinceEpoch}';

  /// Libellé relatif utilisé par les journaux d'activité.
  static const String justNow = 'À l’instant';

  /// Heure courte `HH:mm` pour l'horodatage d'un retrait.
  static String nowTimeLabel() {
    final now = DateTime.now();
    final hh = now.hour.toString().padLeft(2, '0');
    final mm = now.minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }

  /// Code marchand aléatoire (4 chiffres) — secours si aucun produit n'est disponible.
  static String randomCode() => _random.nextInt(9000).toString().padLeft(4, '0');
}
