import 'package:flutter/foundation.dart';

import '../data/models/merchant_models.dart';
import '../data/models/student_models.dart';
import '../data/models/user_role.dart';
import '../data/repositories/repositories.dart';

/// Session utilisateur (rôle courant) — équivalent de `AuthContext`.
///
/// **Frontend uniquement** : la connexion est validée localement puis mémorisée
/// en mémoire. Avec Firebase Authentication, seules les méthodes de cette
/// classe changent (`signInWithEmailAndPassword`, `createUserWithEmailAndPassword`,
/// `signOut`) : les gardes de navigation et les écrans restent identiques.
class AuthController extends ChangeNotifier {
  AuthController(this._repository);

  final AuthRepository _repository;

  UserRole? _role;
  String? _email;
  String? _displayName;
  bool _busy = false;
  String? _error;

  UserRole? get role => _role;
  String? get email => _email;
  String? get displayName => _displayName;
  bool get isAuthenticated => _role != null;
  bool get isBusy => _busy;
  String? get error => _error;

  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Connexion dans un espace donné (le rôle est celui de l'espace choisi).
  Future<bool> signIn({
    required UserRole role,
    required String email,
    required String password,
  }) async {
    _busy = true;
    _error = null;
    notifyListeners();
    try {
      await _repository.signIn(email: email, password: password);
      _role = role;
      _email = email.trim();
      _displayName = null;
      return true;
    } on AuthException catch (e) {
      _error = e.message;
      return false;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }

  /// Inscription étudiante puis connexion automatique.
  Future<bool> registerStudent(StudentRegistrationForm form) async {
    _busy = true;
    _error = null;
    notifyListeners();
    try {
      await _repository.registerStudent(form);
      _role = UserRole.student;
      _email = form.email.trim();
      _displayName = form.fullName.trim();
      return true;
    } on AuthException catch (e) {
      _error = e.message;
      return false;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }

  /// Demande de compte commerçant : la demande part en validation administrateur.
  Future<bool> requestMerchantAccount(MerchantRegistrationForm form) async {
    _busy = true;
    _error = null;
    notifyListeners();
    try {
      await _repository.requestMerchantAccount(form);
      _role = UserRole.merchant;
      _email = form.email.trim();
      _displayName = form.merchantFullName.trim();
      return true;
    } on AuthException catch (e) {
      _error = e.message;
      return false;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }

  Future<void> signOut() async {
    await _repository.signOut();
    _role = null;
    _email = null;
    _displayName = null;
    _error = null;
    notifyListeners();
  }
}
