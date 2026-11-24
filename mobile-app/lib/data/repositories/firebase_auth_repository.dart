import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart' as fb;

import '../../services/firebase_service.dart';
import '../models/merchant_models.dart';
import '../models/student_models.dart';
import '../models/user_role.dart';
import 'repositories.dart';

/// Implémentation [AuthRepository] adossée à Firebase (`campussave-815dd`)
/// avec repli automatique sur [MockAuthRepository] tant que Firebase n'est pas
/// configuré sur l'appareil/environnement.
class FirebaseAuthRepository implements AuthRepository {
  FirebaseAuthRepository({
    AuthRepository? fallback,
  }) : _fallback = fallback ?? MockAuthRepository();

  final AuthRepository _fallback;

  Future<bool> _useFirebase() => FirebaseService.ensureInitialized();

  @override
  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    if (!await _useFirebase()) {
      return _fallback.signIn(email: email, password: password);
    }

    final trimmedEmail = email.trim();
    if (trimmedEmail.isEmpty || password.isEmpty) {
      throw const AuthException('Identifiants incomplets.');
    }

    try {
      await FirebaseService.auth.signInWithEmailAndPassword(
        email: trimmedEmail,
        password: password,
      );
    } on fb.FirebaseAuthException catch (e) {
      throw AuthException(_mapAuthError(e));
    }
  }

  @override
  Future<void> registerStudent(StudentRegistrationForm form) async {
    if (!await _useFirebase()) {
      return _fallback.registerStudent(form);
    }

    try {
      final credential =
          await FirebaseService.auth.createUserWithEmailAndPassword(
        email: form.email.trim(),
        password: form.password,
      );

      final user = credential.user;
      if (user != null) {
        if (form.fullName.trim().isNotEmpty) {
          await user.updateDisplayName(form.fullName.trim());
        }
        await FirebaseService.firestore
            .collection('users')
            .doc(user.uid)
            .set(
          <String, dynamic>{
            'uid': user.uid,
            'fullName': form.fullName.trim(),
            'email': form.email.trim(),
            'phone': form.phone.trim(),
            'filiere': form.filiere.trim(),
            'annee': form.annee.trim(),
            'role': UserRole.student.backendCode,
            'status': 'active',
            'createdAt': FieldValue.serverTimestamp(),
          },
          SetOptions(merge: true),
        );
      }
    } on fb.FirebaseAuthException catch (e) {
      throw AuthException(_mapAuthError(e));
    } on FirebaseException catch (e) {
      throw AuthException(
        e.message ?? 'Impossible d’enregistrer le profil étudiant.',
      );
    }
  }

  @override
  Future<void> requestMerchantAccount(MerchantRegistrationForm form) async {
    if (!await _useFirebase()) {
      return _fallback.requestMerchantAccount(form);
    }

    try {
      fb.User? user = FirebaseService.auth.currentUser;
      if (user == null ||
          user.email?.toLowerCase() != form.email.trim().toLowerCase()) {
        final credential =
            await FirebaseService.auth.createUserWithEmailAndPassword(
          email: form.email.trim(),
          password: form.password,
        );
        user = credential.user;
      }

      if (user != null && form.merchantFullName.trim().isNotEmpty) {
        await user.updateDisplayName(form.merchantFullName.trim());
      }

      final callable = FirebaseService.functions.httpsCallable(
        'completeRegistration',
      );
      await callable.call(<String, dynamic>{
        'role': UserRole.merchantPending.backendCode,
        'establishmentName': form.establishmentName.trim(),
        'merchantFullName': form.merchantFullName.trim(),
        'email': form.email.trim(),
        'phone': form.phone.trim(),
        'address': form.address.trim(),
        'establishmentType': form.establishmentType.trim(),
      });
    } on fb.FirebaseAuthException catch (e) {
      throw AuthException(_mapAuthError(e));
    } on FirebaseFunctionsException catch (e) {
      throw AuthException(
        e.message ??
            'La demande de compte commerçant n’a pas pu être soumise.',
      );
    } on FirebaseException catch (e) {
      throw AuthException(
        e.message ?? 'Erreur Firebase lors de la demande commerçant.',
      );
    }
  }

  @override
  Future<void> signOut() async {
    if (!await _useFirebase()) {
      return _fallback.signOut();
    }
    await FirebaseService.auth.signOut();
  }

  String _mapAuthError(fb.FirebaseAuthException e) {
    switch (e.code) {
      case 'invalid-email':
        return 'Adresse e-mail invalide.';
      case 'user-disabled':
        return 'Ce compte a été désactivé.';
      case 'user-not-found':
      case 'wrong-password':
      case 'invalid-credential':
        return 'Adresse e-mail ou mot de passe incorrect.';
      case 'email-already-in-use':
        return 'Un compte existe déjà avec cette adresse e-mail.';
      case 'weak-password':
        return 'Le mot de passe est trop faible.';
      case 'network-request-failed':
        return 'Erreur réseau : vérifiez la connexion internet.';
      default:
        return e.message ?? 'Erreur d’authentification (${e.code}).';
    }
  }
}


