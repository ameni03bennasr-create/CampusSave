import 'package:flutter/foundation.dart';

import '../core/utils/id_generator.dart';
import '../data/models/admin_models.dart';
import '../data/models/user_role.dart';
import '../data/repositories/repositories.dart';

/// État et actions de l'espace administrateur.
///
/// Portage de `src/hooks/useAdminWorkspace.ts` : supervision des comptes,
/// validation / rejet des commerçants, journal d'activité de la plateforme.
class AdminWorkspace extends ChangeNotifier {
  AdminWorkspace(this._repository);

  final AdminRepository _repository;

  AdminProfile _profile = const AdminProfile(
    id: '',
    fullName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    createdAt: '',
    preferences: AdminPreferences(),
  );
  AdminProfile get profile => _profile;

  List<AdminUser> _users = <AdminUser>[];
  List<AdminUser> get users => List<AdminUser>.unmodifiable(_users);

  List<AdminMerchant> _merchants = <AdminMerchant>[];
  List<AdminMerchant> get merchants =>
      List<AdminMerchant>.unmodifiable(_merchants);

  List<AdminOffer> _offers = <AdminOffer>[];
  List<AdminOffer> get offers => List<AdminOffer>.unmodifiable(_offers);

  List<AdminOrder> _orders = <AdminOrder>[];
  List<AdminOrder> get orders => List<AdminOrder>.unmodifiable(_orders);

  List<AdminActivity> _activities = <AdminActivity>[];
  List<AdminActivity> get activities =>
      List<AdminActivity>.unmodifiable(_activities);

  Future<void> load() async {
    _profile = await _repository.loadProfile();
    _users = await _repository.loadUsers();
    _merchants = await _repository.loadMerchants();
    _offers = await _repository.loadOffers();
    _orders = await _repository.loadOrders();
    _activities = await _repository.loadActivities();
    notifyListeners();
  }

  // --- Lecture ---------------------------------------------------------------
  AdminUser? userById(String? id) {
    if (id == null) return null;
    for (final user in _users) {
      if (user.id == id) return user;
    }
    return null;
  }

  AdminMerchant? merchantById(String? id) {
    if (id == null) return null;
    for (final merchant in _merchants) {
      if (merchant.id == id) return merchant;
    }
    return null;
  }

  AdminOrder? orderById(String? id) {
    if (id == null) return null;
    for (final order in _orders) {
      if (order.id == id) return order;
    }
    return null;
  }

  int get totalStudents =>
      _users.where((u) => u.role == UserRole.student).length;

  int get pendingMerchantsCount =>
      _merchants.where((m) => m.validationStatus == 'En attente').length;

  List<AdminMerchant> get pendingMerchants =>
      _merchants.where((m) => m.validationStatus == 'En attente').toList();

  double get totalRevenue => _orders
      .where((o) => o.paymentStatus == 'Payée')
      .fold(0, (sum, o) => sum + o.totalAmount);

  // --- Actions ---------------------------------------------------------------
  /// Active / désactive un compte utilisateur (jamais un administrateur).
  void toggleUserStatus(String userId) {
    final target = userById(userId);
    if (target == null || target.role == UserRole.admin) return;

    final nextStatus = target.status == 'Actif' ? 'Désactivé' : 'Actif';
    _users = _users
        .map((u) => u.id == userId ? u.copyWith(status: nextStatus) : u)
        .toList();
    _log(
      type: 'user',
      text:
          'Compte utilisateur ${target.fullName} (${target.id}) passé au statut '
          '« $nextStatus ».',
    );
    notifyListeners();
  }

  /// Active / désactive le compte d'un commerçant validé.
  void toggleMerchantAccount(String merchantId) {
    final target = merchantById(merchantId);

    if (target == null || target.isPending) return;

    final nextActive = !target.accountActive;
    final nextStatus = nextActive ? 'Actif' : 'Désactivé';

    // Met à jour le compte commerçant.
    _merchants = _merchants
        .map(
          (m) => m.id == merchantId ? m.copyWith(accountActive: nextActive) : m,
        )
        .toList();

    // Synchronise le compte utilisateur associé.
    _users = _users
        .map((u) => u.id == target.userId ? u.copyWith(status: nextStatus) : u)
        .toList();

    _log(
      type: 'merchant_account',
      text:
          'Compte commerçant ${target.establishmentName} '
          'passé au statut « $nextStatus ».',
    );

    notifyListeners();
  }

  /// Approuve ou rejette une demande d'inscription commerçant.
  void decideMerchant(
    String merchantId,
    String decision, {
    String reason = '',
  }) {
    final target = merchantById(merchantId);
    if (target == null) return;

    final approved = decision == 'Validé';
    _merchants = _merchants
        .map(
          (m) => m.id == merchantId
              ? m.copyWith(
                  validationStatus: decision,
                  accountActive: approved,
                  rejectionReason: approved
                      ? ''
                      : (reason.isEmpty
                            ? 'Dossier non conforme aux critères ESSECT.'
                            : reason),
                )
              : m,
        )
        .toList();

    // Synchronise le statut du compte utilisateur rattaché.
    _users = _users
        .map(
          (u) => u.id == target.userId
              ? u.copyWith(status: approved ? 'Actif' : 'Désactivé')
              : u,
        )
        .toList();

    _log(
      type: approved ? 'merchant_approved' : 'merchant_rejected',
      text: approved
          ? 'Établissement « ${target.establishmentName} » validé par l’administrateur.'
          : 'Demande d’inscription de « ${target.establishmentName} » rejetée.',
    );
    notifyListeners();
  }

  void updateProfile({
    String? fullName,
    String? email,
    String? phone,
    String? department,
    AdminPreferences? preferences,
  }) {
    _profile = _profile.copyWith(
      fullName: fullName,
      email: email,
      phone: phone,
      department: department,
      preferences: preferences,
    );
    notifyListeners();
  }

  void _log({required String type, required String text}) {
    _activities = <AdminActivity>[
      AdminActivity(
        id: IdGenerator.activityId(),
        type: type,
        text: text,
        time: IdGenerator.justNow,
      ),
      ..._activities,
    ];
  }
}
