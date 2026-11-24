/// Rôles de la plateforme CampusSave.
enum UserRole {
  student('Étudiant', '/student', 'etudiant'),
  merchant('Commerçant', '/merchant', 'commercant'),
  merchantPending(
    'Commerçant en attente',
    '/merchant',
    'commercant_en_attente',
  ),
  admin('Administrateur', '/admin', 'admin');

  const UserRole(this.label, this.basePath, this.backendCode);

  /// Libellé affiché dans les badges et les formulaires.
  final String label;

  /// Racine d'URL de l'espace correspondant.
  final String basePath;

  /// Identifiant de rôle côté backend / Firestore.
  final String backendCode;

  static UserRole? fromLabel(String label) {
    for (final role in UserRole.values) {
      if (role.label == label) return role;
    }
    return null;
  }

  static UserRole fromBackendCode(String? code, {UserRole? fallback}) {
    switch (code?.trim().toLowerCase()) {
      case 'etudiant':
      case 'student':
        return UserRole.student;
      case 'commercant':
      case 'merchant':
        return UserRole.merchant;
      case 'commercant_en_attente':
      case 'merchant_pending':
      case 'pending_merchant':
        return UserRole.merchantPending;
      case 'admin':
      case 'administrateur':
        return UserRole.admin;
      default:
        return fallback ?? UserRole.student;
    }
  }
}
