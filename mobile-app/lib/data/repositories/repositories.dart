/// Contrats d'accès aux données, et implémentations de démonstration.
///
/// **Point d'intégration backend** : chaque écran ne dépend que des
/// `ChangeNotifier` de `lib/state`, eux-mêmes alimentés par ces interfaces.
/// Lorsque l'API REST / Firebase sera disponible, il suffira de fournir une
/// implémentation HTTP de ces mêmes interfaces (voir
/// `lib/data/repositories/http_repositories.dart.example`) puis de la passer à
/// `AppRoot` : aucun écran n'aura à changer.
library;

import '../mock/mock_data.dart';
import '../models/admin_models.dart';
import '../models/merchant_models.dart';
import '../models/student_models.dart';

/// Latence simulée pour rendre visibles les états de chargement de l'interface.
const Duration _kMockLatency = Duration(milliseconds: 220);

/// Accès à l'identité et aux comptes.
abstract interface class AuthRepository {
  /// Connexion ; lève une [AuthException] si les identifiants sont refusés.
  Future<void> signIn({
    required String email,
    required String password,
  });

  /// Création d'un compte étudiant.
  Future<void> registerStudent(StudentRegistrationForm form);

  /// Dépôt d'une demande de compte commerçant (validée par un administrateur).
  Future<void> requestMerchantAccount(MerchantRegistrationForm form);

  /// Fermeture de session.
  Future<void> signOut();
}

/// Erreur d'authentification destinée à l'affichage.
class AuthException implements Exception {
  const AuthException(this.message);

  final String message;

  @override
  String toString() => message;
}

/// Données de l'espace étudiant.
abstract interface class StudentRepository {
  Future<StudentProfile> loadProfile();

  Future<List<Restaurant>> loadRestaurants();

  Future<List<StudentOffer>> loadOffers();

  Future<List<StudentOrder>> loadOrders();

  Future<List<StudentNotification>> loadNotifications();
}

/// Données de l'espace commerçant.
abstract interface class MerchantRepository {
  Future<MerchantProfile> loadProfile();

  Future<MerchantEstablishment> loadEstablishment();

  Future<List<MerchantOffer>> loadOffers();

  Future<List<MerchantOrder>> loadOrders();

  Future<List<MerchantNotification>> loadNotifications();
}

/// Données de l'espace administrateur.
abstract interface class AdminRepository {
  Future<AdminProfile> loadProfile();

  Future<List<AdminUser>> loadUsers();

  Future<List<AdminMerchant>> loadMerchants();

  Future<List<AdminOffer>> loadOffers();

  Future<List<AdminOrder>> loadOrders();

  Future<List<AdminActivity>> loadActivities();
}

/// Implémentation de démonstration : renvoie les jeux de données locaux.
class MockAuthRepository implements AuthRepository {
  @override
  Future<void> signIn({required String email, required String password}) async {
    await Future<void>.delayed(_kMockLatency);
    if (email.trim().isEmpty || password.isEmpty) {
      throw const AuthException('Identifiants incomplets.');
    }
  }

  @override
  Future<void> registerStudent(StudentRegistrationForm form) async {
    await Future<void>.delayed(_kMockLatency);
  }

  @override
  Future<void> requestMerchantAccount(MerchantRegistrationForm form) async {
    await Future<void>.delayed(_kMockLatency);
  }

  @override
  Future<void> signOut() async {
    await Future<void>.delayed(const Duration(milliseconds: 80));
  }
}

class MockStudentRepository implements StudentRepository {
  @override
  Future<StudentProfile> loadProfile() async => StudentMockData.profile;

  @override
  Future<List<Restaurant>> loadRestaurants() async =>
      List<Restaurant>.of(StudentMockData.restaurants);

  @override
  Future<List<StudentOffer>> loadOffers() async =>
      List<StudentOffer>.of(StudentMockData.offers);

  @override
  Future<List<StudentOrder>> loadOrders() async =>
      List<StudentOrder>.of(StudentMockData.orders);

  @override
  Future<List<StudentNotification>> loadNotifications() async =>
      List<StudentNotification>.of(StudentMockData.notifications);
}

class MockMerchantRepository implements MerchantRepository {
  @override
  Future<MerchantProfile> loadProfile() async => MerchantMockData.profile;

  @override
  Future<MerchantEstablishment> loadEstablishment() async =>
      MerchantMockData.establishment;

  @override
  Future<List<MerchantOffer>> loadOffers() async =>
      List<MerchantOffer>.of(MerchantMockData.offers);

  @override
  Future<List<MerchantOrder>> loadOrders() async =>
      List<MerchantOrder>.of(MerchantMockData.orders);

  @override
  Future<List<MerchantNotification>> loadNotifications() async =>
      List<MerchantNotification>.of(MerchantMockData.notifications);
}

class MockAdminRepository implements AdminRepository {
  @override
  Future<AdminProfile> loadProfile() async => AdminMockData.profile;

  @override
  Future<List<AdminUser>> loadUsers() async =>
      List<AdminUser>.of(AdminMockData.users);

  @override
  Future<List<AdminMerchant>> loadMerchants() async =>
      List<AdminMerchant>.of(AdminMockData.merchants);

  @override
  Future<List<AdminOffer>> loadOffers() async =>
      List<AdminOffer>.of(AdminMockData.offers);

  @override
  Future<List<AdminOrder>> loadOrders() async =>
      List<AdminOrder>.of(AdminMockData.orders);

  @override
  Future<List<AdminActivity>> loadActivities() async =>
      List<AdminActivity>.of(AdminMockData.activities);
}
