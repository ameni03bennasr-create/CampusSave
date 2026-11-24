import 'package:flutter/widgets.dart';

import '../data/repositories/repositories.dart';
import 'admin_workspace.dart';
import 'auth_controller.dart';
import 'merchant_workspace.dart';
import 'student_workspace.dart';

/// Racine de l'état applicatif : session + les trois espaces métier.
///
/// Les écrans n'accèdent jamais directement aux dépôts de données ; ils lisent
/// et déclenchent des actions via cet objet, ce qui isole complètement
/// l'interface de la source de données (mock aujourd'hui, API demain).
class AppRoot extends ChangeNotifier {
  AppRoot({
    AuthRepository? authRepository,
    StudentRepository? studentRepository,
    MerchantRepository? merchantRepository,
    AdminRepository? adminRepository,
  })  : auth = AuthController(authRepository ?? MockAuthRepository()),
        student = StudentWorkspace(studentRepository ?? MockStudentRepository()),
        merchant =
            MerchantWorkspace(merchantRepository ?? MockMerchantRepository()),
        admin = AdminWorkspace(adminRepository ?? MockAdminRepository()) {
    auth.addListener(notifyListeners);
    student.addListener(notifyListeners);
    merchant.addListener(notifyListeners);
    admin.addListener(notifyListeners);
  }

  final AuthController auth;
  final StudentWorkspace student;
  final MerchantWorkspace merchant;
  final AdminWorkspace admin;

  /// Charge les données des trois espaces (appelé au démarrage).
  Future<void> bootstrap() async {
    await Future.wait<void>(<Future<void>>[
      student.load(),
      merchant.load(),
      admin.load(),
    ]);
  }

  @override
  void dispose() {
    auth.dispose();
    student.dispose();
    merchant.dispose();
    admin.dispose();
    super.dispose();
  }
}

/// Expose [AppRoot] à l'ensemble de l'arbre de widgets et reconstruit les
/// écrans abonnés à chaque changement d'état.
class AppScope extends InheritedNotifier<AppRoot> {
  const AppScope({
    required AppRoot root,
    required super.child,
    super.key,
  }) : super(notifier: root);

  /// Raccourci d'accès depuis un écran.
  static AppRoot of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<AppScope>();
    assert(scope != null, 'AppScope est absent de l’arbre de widgets.');
    return scope!.notifier!;
  }

  /// Accès sans abonnement (pour déclencher une action dans un callback).
  static AppRoot read(BuildContext context) {
    final scope =
        context.getInheritedWidgetOfExactType<AppScope>();
    assert(scope != null, 'AppScope est absent de l’arbre de widgets.');
    return scope!.notifier!;
  }
}
