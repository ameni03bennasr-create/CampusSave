/// Fonctions de formatage partagées, portées depuis `src/utils/format.ts`.
abstract final class Formatters {
  /// `5.5` -> `« 5,50 DT »` (séparateur décimal français).
  static String price(num value) {
    final text = value.toDouble().toStringAsFixed(2).replaceAll('.', ',');
    return '$text DT';
  }

  /// `12.5` -> `« 12,5 »` (sans unité).
  static String decimal(num value) =>
      value.toDouble().toStringAsFixed(2).replaceAll('.', ',');

  /// Pourcentage de remise non borné (comportement de l'espace étudiant).
  static int discountPercent(num initial, num reduced) {
    if (initial == 0) return 0;
    return (((initial - reduced) / initial) * 100).round();
  }

  /// Pourcentage de remise borné à 0 (comportement commerçant / admin).
  static int discount(num initialPrice, num reducedPrice) {
    if (initialPrice <= 0) return 0;
    final value = ((initialPrice - reducedPrice) / initialPrice * 100).round();
    return value < 0 ? 0 : value;
  }

  /// Initiales d'un nom complet (« Rahma Ben Ali » -> « RB »).
  static String initials(String name) {
    final parts =
        name.trim().split(RegExp(r'\s+')).where((p) => p.isNotEmpty).toList();
    if (parts.isEmpty) return '?';
    final first = parts.first.substring(0, 1);
    final last = parts.length > 1 ? parts.last.substring(0, 1) : '';
    return (first + last).toUpperCase();
  }

  /// `2` -> `« 2 restants »`, `1` -> `« 1 restant »`.
  static String remaining(int quantity) =>
      quantity > 1 ? '$quantity restants' : '$quantity restant';

  /// Tronque proprement une chaîne pour l'affichage compact.
  static String truncate(String value, int maxChars) {
    if (value.length <= maxChars) return value;
    return '${value.substring(0, maxChars).trimRight()}…';
  }

  /// Compteur pluriel simple (« 3 offres » / « 1 offre »).
  static String plural(int count, String singular, String plural) =>
      count > 1 ? '$count $plural' : '$count $singular';
}

