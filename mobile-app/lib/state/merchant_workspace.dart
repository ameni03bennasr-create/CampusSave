import 'package:flutter/foundation.dart';

import '../core/utils/id_generator.dart';
import '../data/models/merchant_models.dart';
import '../data/repositories/repositories.dart';

/// État et actions de l'espace commerçant.
///
/// Portage de `src/hooks/useMerchantWorkspace.ts` : CRUD des offres, suivi des
/// commandes, validation des QR Codes de retrait et notifications.
class MerchantWorkspace extends ChangeNotifier {
  MerchantWorkspace(this._repository);

  final MerchantRepository _repository;

  MerchantProfile _profile = const MerchantProfile(
    id: '',
    fullName: '',
    role: '',
    email: '',
    phone: '',
    personalPhone: '',
    notificationsPrefs: MerchantNotificationPrefs(),
  );
  MerchantProfile get profile => _profile;

  MerchantEstablishment _establishment = const MerchantEstablishment(
    name: '',
    type: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: '',
    logo: '',
    coverImage: '',
    adminValidated: false,
    validatedDate: '',
  );
  MerchantEstablishment get establishment => _establishment;

  List<MerchantOffer> _offers = <MerchantOffer>[];
  List<MerchantOffer> get offers => List<MerchantOffer>.unmodifiable(_offers);

  List<MerchantOrder> _orders = <MerchantOrder>[];
  List<MerchantOrder> get orders => List<MerchantOrder>.unmodifiable(_orders);

  List<MerchantNotification> _notifications = <MerchantNotification>[];
  List<MerchantNotification> get notifications =>
      List<MerchantNotification>.unmodifiable(_notifications);

  Future<void> load() async {
    _profile = await _repository.loadProfile();
    _establishment = await _repository.loadEstablishment();
    _offers = await _repository.loadOffers();
    _orders = await _repository.loadOrders();
    _notifications = await _repository.loadNotifications();
    notifyListeners();
  }

  // --- Lecture ---------------------------------------------------------------
  MerchantOffer? offerById(String? id) {
    if (id == null) return null;
    for (final offer in _offers) {
      if (offer.id == id) return offer;
    }
    return null;
  }

  MerchantOrder? orderById(String? id) {
    if (id == null) return null;
    for (final order in _orders) {
      if (order.id == id) return order;
    }
    return null;
  }

  int get unreadNotificationsCount =>
      _notifications.where((n) => !n.read).length;

  /// Commandes payées en attente de remise (badge « Commandes »).
  int get pendingPickupCount => _orders
      .where((o) => o.orderStatus == 'Payée / À récupérer')
      .length;

  List<MerchantOrder> get collectableOrders =>
      _orders.where((o) => o.canBeCollected).toList();

  double get revenuePaid => _orders
      .where((o) => o.paymentStatus == 'Payée')
      .fold(0, (sum, o) => sum + o.totalAmount);

  double get foodSavedKg => _orders
      .where((o) => o.paymentStatus == 'Payée')
      .fold(0, (sum, o) => sum + 0.35 * o.quantity);

  // --- CRUD des offres -------------------------------------------------------
  static String _statusFor(int quantity) {
    if (quantity == 0) return 'Épuisée';
    if (quantity <= 2) return 'Stock faible';
    return 'Active';
  }

  void addOffer(OfferFormSubmission data) {
    final quantity = int.tryParse(data.quantity) ?? 0;
    final offer = MerchantOffer(
      id: 'M-OFF-${IdGenerator.randomCode()}',
      name: data.name,
      description: data.description,
      category: data.category,
      photo: data.photo,
      initialPrice: double.tryParse(data.initialPrice) ?? 0,
      reducedPrice: double.tryParse(data.reducedPrice) ?? 0,
      quantity: quantity,
      pickupStart: data.pickupStart,
      pickupEnd: data.pickupEnd,
      status: _statusFor(quantity),
      createdAt: IdGenerator.justNow,
    );
    _offers = <MerchantOffer>[offer, ..._offers];
    notifyListeners();
  }

  void updateOffer(OfferFormSubmission data) {
    final id = data.id;
    if (id == null) return;
    final index = _offers.indexWhere((o) => o.id == id);
    if (index < 0) return;
    final quantity = int.tryParse(data.quantity) ?? 0;
    final updated = MerchantOffer(
      id: id,
      name: data.name,
      description: data.description,
      category: data.category,
      photo: data.photo,
      initialPrice: double.tryParse(data.initialPrice) ?? 0,
      reducedPrice: double.tryParse(data.reducedPrice) ?? 0,
      quantity: quantity,
      pickupStart: data.pickupStart,
      pickupEnd: data.pickupEnd,
      status: _statusFor(quantity),
      createdAt: data.createdAt ?? _offers[index].createdAt,
    );
    _offers = List<MerchantOffer>.of(_offers)..[index] = updated;
    notifyListeners();
  }

  void deleteOffer(String offerId) {
    _offers = _offers.where((o) => o.id != offerId).toList();
    notifyListeners();
  }

  // --- Validation du QR Code ------------------------------------------------
  /// Règle stricte reprise du projet React : seule une commande **payée** peut
  /// passer au statut « Récupérée ». Une remise en double est refusée.
  QrValidationResult validateQrCode(String rawInput) {
    final query = rawInput.trim().toUpperCase();

    if (query.isEmpty) {
      return const QrValidationResult(
        status: QrValidationStatus.invalid,
        title: 'Code vide ou illisible',
        message:
            'Veuillez scanner un QR Code ou saisir une référence de commande '
            'valide (ex : #CS-2026-841).',
      );
    }

    MerchantOrder? matched;
    for (final order in _orders) {
      final id = order.id.toUpperCase();
      if (id == query ||
          id.replaceAll('#', '') == query ||
          order.qrToken.toUpperCase() == query) {
        matched = order;
        break;
      }
    }

    if (matched == null) {
      return QrValidationResult(
        status: QrValidationStatus.invalid,
        title: 'QR Code invalide ou introuvable',
        message:
            'Aucune commande enregistrée chez ${_establishment.name} ne '
            'correspond au code « $rawInput ».',
      );
    }

    if (matched.orderStatus == 'Récupérée') {
      return QrValidationResult(
        status: QrValidationStatus.alreadyCollected,
        title: 'Commande déjà récupérée',
        message:
            'Ce QR Code (${matched.id}) a déjà été validé le '
            '${matched.collectedAt ?? 'précédemment'}. Remise en double refusée.',
        order: matched,
      );
    }

    if (matched.paymentStatus != 'Payée' || matched.orderStatus == 'En attente') {
      return QrValidationResult(
        status: QrValidationStatus.unpaid,
        title: 'Paiement non confirmé — Validation refusée',
        message:
            'La commande ${matched.id} de ${matched.studentName} est en statut '
            '« ${matched.paymentStatus} ». Conformément aux règles CampusSave, '
            'une commande non payée ne peut pas être remise.',
        order: matched,
      );
    }

    if (matched.orderStatus == 'Annulée') {
      return QrValidationResult(
        status: QrValidationStatus.invalid,
        title: 'Commande annulée',
        message:
            'La commande ${matched.id} a été annulée suite à un échec de paiement.',
        order: matched,
      );
    }

    final now = IdGenerator.nowTimeLabel();
    final updated = matched.copyWith(
      orderStatus: 'Récupérée',
      collectedAt: now,
    );
    _orders = _orders.map((o) => o.id == matched!.id ? updated : o).toList();
    _notifications = <MerchantNotification>[
      MerchantNotification(
        id: IdGenerator.notificationId(),
        type: 'update',
        title: 'Retrait validé par QR Code (${matched.id})',
        message:
            'Commande de ${matched.studentName} (${matched.quantity}× '
            '${matched.productName}) marquée comme Récupérée.',
        timestamp: IdGenerator.justNow,
        read: false,
        targetPage: 'order-details',
        targetId: matched.id,
      ),
      ..._notifications,
    ];
    notifyListeners();

    return QrValidationResult(
      status: QrValidationStatus.success,
      title: 'QR Code valide — Retrait confirmé !',
      message:
          'La commande ${matched.id} a été vérifiée et mise à jour au statut '
          '« Récupérée ».',
      order: updated,
    );
  }

  // --- Établissement & profil ------------------------------------------------
  void updateEstablishment({
    String? name,
    String? type,
    String? address,
    String? phone,
    String? email,
    String? description,
    String? openingHours,
    String? logo,
    String? coverImage,
  }) {
    _establishment = _establishment.copyWith(
      name: name,
      type: type,
      address: address,
      phone: phone,
      email: email,
      description: description,
      openingHours: openingHours,
      logo: logo,
      coverImage: coverImage,
    );
    notifyListeners();
  }

  void updateProfile({
    String? fullName,
    String? email,
    String? phone,
    String? personalPhone,
    MerchantNotificationPrefs? prefs,
  }) {
    _profile = _profile.copyWith(
      fullName: fullName,
      email: email,
      phone: phone,
      personalPhone: personalPhone,
      notificationsPrefs: prefs,
    );
    notifyListeners();
  }

  void markNotificationRead(String id) {
    _notifications = _notifications
        .map((n) => n.id == id ? n.copyWith(read: true) : n)
        .toList();
    notifyListeners();
  }

  void markAllNotificationsRead() {
    _notifications = _notifications.map((n) => n.copyWith(read: true)).toList();
    notifyListeners();
  }
}
