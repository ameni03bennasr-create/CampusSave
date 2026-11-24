/// Rôles de la plateforme CampusSave (trois acteurs du cahier des charges).
enum UserRole {
  student('Étudiant', '/student'),
  merchant('Commerçant', '/merchant'),
  admin('Administrateur', '/admin');

  const UserRole(this.label, this.basePath);

  /// Libellé affiché dans les badges et les formulaires.
  final String label;

  /// Racine d'URL de l'espace correspondant (reprise du routeur React).
  final String basePath;

  static UserRole? fromLabel(String label) {
    for (final role in UserRole.values) {
      if (role.label == label) return role;
    }
    return null;
  }
}
