import 'package:flutter/foundation.dart';

import '../core/utils/formatters.dart';
import '../core/utils/id_generator.dart';
import '../data/models/student_models.dart';
import '../data/repositories/repositories.dart';

/// État et actions de l'espace étudiant.
///
/// Portage de `src/hooks/useStudentWorkspace.ts` : sélections du parcours de
/// réservation, filtres de recherche, cycle de vie des commandes
/// (réservation → paiement → QR Code → retrait) et notifications.
class StudentWorkspace extends ChangeNotifier {
  StudentWorkspace(this._repository);

  final StudentRepository _repository;

  StudentProfile _profile = const StudentProfile(
    id: '',
    fullName: '',
    email: '',
    phone: '',
    filiere: '',
    annee: '',
    etablissement: '',
    avatar: '',
    ecoPoints: 0,
    memberSince: '',
  );

  StudentProfile get profile => _profile;

  List<Restaurant> _restaurants = <Restaurant>[];
  List<Restaurant> get restaurants =>
      List<Restaurant>.unmodifiable(_restaurants);

  List<StudentOffer> _offers = <StudentOffer>[];
  List<StudentOffer> get offers => List<StudentOffer>.unmodifiable(_offers);

  List<StudentOrder> _orders = <StudentOrder>[];
  List<StudentOrder> get orders => List<StudentOrder>.unmodifiable(_orders);

  List<StudentNotification> _notifications = <StudentNotification>[];
  List<StudentNotification> get notifications =>
      List<StudentNotification>.unmodifiable(_notifications);

  // --- Filtres de la page « Explorer les offres » ----------------------------

  String _searchProduct = '';
  String _searchRestaurant = '';
  String _category = 'Tous';

  String get searchProduct => _searchProduct;
  String get searchRestaurant => _searchRestaurant;
  String get category => _category;

  /// Quantité choisie sur la page de réservation.
  int _draftQuantity = 1;
  int get draftQuantity => _draftQuantity;

  /// Charge (ou recharge) les données de l'espace étudiant.
  Future<void> load() async {
    _profile = await _repository.loadProfile();
    _restaurants = await _repository.loadRestaurants();
    _offers = await _repository.loadOffers();
    _orders = await _repository.loadOrders();
    _notifications = await _repository.loadNotifications();
    notifyListeners();
  }

  // --- Lecture ---------------------------------------------------------------

  StudentOffer? offerById(String? id) {
    if (id == null) return null;
    for (final offer in _offers) {
      if (offer.id == id) return offer;
    }
    return null;
  }

  Restaurant? restaurantById(String? id) {
    if (id == null) return null;
    for (final restaurant in _restaurants) {
      if (restaurant.id == id) return restaurant;
    }
    return null;
  }

  Restaurant? restaurantOf(StudentOffer? offer) =>
      offer == null ? null : restaurantById(offer.restaurantId);

  StudentOrder? orderById(String? id) {
    if (id == null) return null;
    for (final order in _orders) {
      if (order.id == id) return order;
    }
    return null;
  }

  /// Commandes payées en attente de retrait (badge de navigation).
  int get activeOrdersCount => _orders
      .where(
        (o) =>
            o.orderStatus.contains('Confirmée') ||
            o.orderStatus.contains('attente'),
      )
      .length;

  int get unreadNotificationsCount =>
      _notifications.where((n) => !n.read).length;

  /// Commande payée prête à être retirée (raccourci QR de l'accueil).
  StudentOrder? get readyOrder {
    for (final order in _orders) {
      if (order.orderStatus.contains('Confirmée')) return order;
    }
    return null;
  }

  List<StudentOffer> get featuredOffers =>
      _offers.where((o) => o.featured && o.quantity > 0).toList();

  List<StudentOffer> get recentOffers =>
      _offers.where((o) => o.isRecent && o.quantity > 0).toList();

  List<StudentOffer> get surpriseBaskets =>
      _offers.where((o) => o.isSurpriseBasket).toList();

  /// Catégories réellement présentes dans le catalogue (+ « Tous »).
  List<String> get categories {
    final values = <String>{'Tous'};
    for (final offer in _offers) {
      values.add(offer.category);
    }
    return values.toList();
  }

  /// Offres filtrées par produit / commerce / catégorie.
  List<StudentOffer> get filteredOffers {
    final product = _searchProduct.trim().toLowerCase();
    final restaurant = _searchRestaurant.trim().toLowerCase();

    return _offers.where((offer) {
      final matchProduct =
          product.isEmpty ||
          offer.title.toLowerCase().contains(product) ||
          offer.description.toLowerCase().contains(product);

      final restaurantName =
          restaurantById(offer.restaurantId)?.name.toLowerCase() ?? '';

      final matchRestaurant =
          restaurant.isEmpty || restaurantName.contains(restaurant);

      final matchCategory = _category == 'Tous' || offer.category == _category;

      return matchProduct && matchRestaurant && matchCategory;
    }).toList();
  }

  // --- Commandes -------------------------------------------------------------

  void setFilters({String? product, String? restaurant, String? category}) {
    if (product != null) _searchProduct = product;
    if (restaurant != null) _searchRestaurant = restaurant;
    if (category != null) _category = category;
    notifyListeners();
  }

  void setDraftQuantity(int quantity) {
    _draftQuantity = quantity < 1 ? 1 : quantity;
    notifyListeners();
  }

  /// Crée une commande non payée pour l'offre et la quantité choisies.
  StudentOrder createPendingOrder(StudentOffer offer, int quantity) {
    final restaurant = restaurantById(offer.restaurantId);
    final orderId = IdGenerator.nextOrderId();

    final order = StudentOrder(
      id: orderId,
      offerId: offer.id,
      productTitle: offer.title,
      productImage: offer.image,
      restaurantId: offer.restaurantId,
      restaurantName: restaurant?.name ?? '',
      restaurantAddress: restaurant?.address ?? '',
      quantity: quantity,
      initialUnitPrice: offer.initialPrice,
      unitPrice: offer.reducedPrice,
      totalAmount: double.parse(
        (offer.reducedPrice * quantity).toStringAsFixed(2),
      ),
      pickupHours: offer.pickupHours,
      createdAt: IdGenerator.justNow,
      paymentStatus: 'En attente',
      orderStatus: 'En attente de paiement',
      paymentMethod: 'En cours de sélection',
      qrToken: null,
      weightKg: double.parse((offer.weightKg * quantity).toStringAsFixed(2)),
    );

    _orders = <StudentOrder>[order, ..._orders];

    _notifications = <StudentNotification>[
      StudentNotification(
        id: IdGenerator.notificationId(),
        type: 'reservation',
        title: 'Réservation créée ($orderId)',
        message:
            'Vous avez réservé ${quantity}x « ${offer.title} » chez '
            '${restaurant?.name ?? 'le commerçant'}. Finalisez le paiement pour '
            'générer votre QR Code.',
        timestamp: IdGenerator.justNow,
        read: false,
        orderId: orderId,
      ),
      ..._notifications,
    ];

    notifyListeners();
    return order;
  }

  /// Confirme le paiement et émet le jeton QR de retrait.
  ///
  /// Dans la version connectée au backend, cette méthode est remplacée par
  /// l'ouverture de la page du prestataire de paiement : la commande n'est
  /// confirmée qu'à la réception du webhook serveur.
  StudentOrder? confirmPayment(String orderId, String paymentMethod) {
    final index = _orders.indexWhere((o) => o.id == orderId);
    if (index < 0) return null;

    final order = _orders[index];
    final token = IdGenerator.qrTokenFor(order.id, order.offerId);

    final updated = order.copyWith(
      paymentStatus: 'Payée',
      orderStatus: 'Confirmée / À récupérer',
      paymentMethod: paymentMethod,
      qrToken: token,
    );

    _orders = List<StudentOrder>.of(_orders)..[index] = updated;

    _notifications = <StudentNotification>[
      StudentNotification(
        id: IdGenerator.notificationId(),
        type: 'payment',
        title: 'Paiement confirmé (${order.id})',
        message:
            'Votre paiement de ${Formatters.price(order.totalAmount)} a été '
            'confirmé. Votre QR Code de retrait est disponible.',
        timestamp: IdGenerator.justNow,
        read: false,
        orderId: order.id,
      ),
      ..._notifications,
    ];

    notifyListeners();
    return updated;
  }

  /// Marque une notification comme lue.
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

  /// Met à jour le profil (page « Mon profil »).
  void updateProfile({
    String? fullName,
    String? email,
    String? phone,
    String? filiere,
    String? etablissement,
  }) {
    _profile = _profile.copyWith(
      fullName: fullName,
      email: email,
      phone: phone,
      filiere: filiere,
      etablissement: etablissement,
    );

    notifyListeners();
  }

  /// Renseigne l'identité issue du formulaire d'inscription.
  void applyRegistration(StudentRegistrationForm form) {
    _profile = _profile.copyWith(
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      filiere: form.filiere,
      annee: form.annee,
    );

    notifyListeners();
  }

  /// Réinitialise la session étudiant (déconnexion).
  void reset() {
    _draftQuantity = 1;
    _searchProduct = '';
    _searchRestaurant = '';
    _category = 'Tous';
    notifyListeners();
  }
}
