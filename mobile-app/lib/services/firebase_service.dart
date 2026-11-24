import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';

/// Gestionnaire centralisé d'initialisation Firebase pour CampusSave.
///
/// Projet cible : `campussave-815dd` — Cloud Functions en `europe-west1`.
class FirebaseService {
  FirebaseService._();

  static const String projectId = 'campussave-815dd';
  static const String functionsRegion = 'europe-west1';

  static bool _initialized = false;
  static String? _lastError;

  static bool get isInitialized => _initialized;
  static String? get lastError => _lastError;

  static Future<bool> ensureInitialized() async {
    if (_initialized) {
      return true;
    }
    if (Firebase.apps.isNotEmpty) {
      _initialized = true;
      _lastError = null;
      return true;
    }
    try {
      await Firebase.initializeApp();
      _initialized = true;
      _lastError = null;
      return true;
    } catch (e) {
      _lastError = e.toString();
      debugPrint(
        'FirebaseService: initialisation différée (mode repli mock) — $e',
      );
      return false;
    }
  }

  static FirebaseAuth get auth {
    if (!_initialized && Firebase.apps.isEmpty) {
      throw StateError(
        'FirebaseAuth indisponible : FirebaseService.ensureInitialized() non initialisé.',
      );
    }
    return FirebaseAuth.instance;
  }

  static FirebaseFirestore get firestore {
    if (!_initialized && Firebase.apps.isEmpty) {
      throw StateError(
        'FirebaseFirestore indisponible : FirebaseService.ensureInitialized() non initialisé.',
      );
    }
    return FirebaseFirestore.instance;
  }

  static FirebaseFunctions get functions {
    if (!_initialized && Firebase.apps.isEmpty) {
      throw StateError(
        'FirebaseFunctions indisponible : FirebaseService.ensureInitialized() non initialisé.',
      );
    }
    return FirebaseFunctions.instanceFor(region: functionsRegion);
  }
}
