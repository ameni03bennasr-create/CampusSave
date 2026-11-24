/// Modèles de l'espace étudiant — portés à l'identique de `src/types/student.ts`.
///
/// Ces classes sont les *view models* consommés par les écrans. La couche
/// `repositories` est la seule à connaître leur origine (données de
/// démonstration aujourd'hui, API REST/Firebase demain).
library;

import '../../core/utils/formatters.dart';

/// Profil de l'étudiant connecté.
class StudentProfile {
  const StudentProfile({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.filiere,
    required this.annee,
    required this.etablissement,
    required this.avatar,
    required this.ecoPoints,
    required this.memberSince,
  });

  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String filiere;
  final String annee;
  final String etablissement;
  final String avatar;
  final int ecoPoints;
  final String memberSince;

  factory StudentProfile.fromJson(Map<String, dynamic> json) {
    return StudentProfile(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? json['full_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      filiere: json['filiere']?.toString() ?? '',
      annee: json['annee']?.toString() ?? '',
      etablissement: json['etablissement']?.toString() ?? '',
      avatar: json['avatar']?.toString() ?? '',
      ecoPoints: (json['ecoPoints'] as num?)?.toInt() ?? (json['eco_points'] as num?)?.toInt() ?? 0,
      memberSince: json['memberSince']?.toString() ?? json['member_since']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'fullName': fullName,
    'email': email,
    'phone': phone,
    'filiere': filiere,
    'annee': annee,
    'etablissement': etablissement,
    'avatar': avatar,
    'ecoPoints': ecoPoints,
    'memberSince': memberSince,
  };

  StudentProfile copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? filiere,
    String? annee,
    String? etablissement,
    String? avatar,
    int? ecoPoints,
  }) {
    return StudentProfile(
      id: id,
      fullName: fullName ?? this.fullName,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      filiere: filiere ?? this.filiere,
      annee: annee ?? this.annee,
      etablissement: etablissement ?? this.etablissement,
      avatar: avatar ?? this.avatar,
      ecoPoints: ecoPoints ?? this.ecoPoints,
      memberSince: memberSince,
    );
  }
}

/// Restaurant ou cafétéria partenaire autour de l'ESSECT.
class Restaurant {
  const Restaurant({
    required this.id,
    required this.name,
    required this.type,
    required this.address,
    required this.distanceMeters,
    required this.rating,
    required this.reviewsCount,
    required this.pickupHours,
    required this.phone,
    required this.coordsX,
    required this.coordsY,
    required this.activeOffersCount,
  });

  final String id;
  final String name;
  final String type;
  final String address;
  final int distanceMeters;
  final double rating;
  final int reviewsCount;
  final String pickupHours;
  final String phone;

  /// Coordonnées en pourcentage pour la carte schématique « Campus Radar ».
  final double coordsX;
  final double coordsY;

  final int activeOffersCount;

  factory Restaurant.fromJson(Map<String, dynamic> json) {
    return Restaurant(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      distanceMeters: (json['distanceMeters'] as num?)?.toInt() ?? (json['distance_meters'] as num?)?.toInt() ?? 0,
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewsCount: (json['reviewsCount'] as num?)?.toInt() ?? (json['reviews_count'] as num?)?.toInt() ?? 0,
      pickupHours: json['pickupHours']?.toString() ?? json['pickup_hours']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      coordsX: (json['coordsX'] as num?)?.toDouble() ?? (json['coords_x'] as num?)?.toDouble() ?? 0.0,
      coordsY: (json['coordsY'] as num?)?.toDouble() ?? (json['coords_y'] as num?)?.toDouble() ?? 0.0,
      activeOffersCount: (json['activeOffersCount'] as num?)?.toInt() ?? (json['active_offers_count'] as num?)?.toInt() ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'type': type,
    'address': address,
    'distanceMeters': distanceMeters,
    'rating': rating,
    'reviewsCount': reviewsCount,
    'pickupHours': pickupHours,
    'phone': phone,
    'coordsX': coordsX,
    'coordsY': coordsY,
    'activeOffersCount': activeOffersCount,
  };
}

/// Offre alimentaire publiée par un commerçant.
class StudentOffer {
  const StudentOffer({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.restaurantId,
    required this.initialPrice,
    required this.reducedPrice,
    required this.quantity,
    required this.pickupHours,
    required this.image,
    required this.featured,
    required this.isRecent,
    required this.isSurpriseBasket,
    required this.weightKg,
  });

  final String id;
  final String title;
  final String description;
  final String category;
  final String restaurantId;
  final double initialPrice;
  final double reducedPrice;
  final int quantity;
  final String pickupHours;
  final String image;
  final bool featured;
  final bool isRecent;
  final bool isSurpriseBasket;
  final double weightKg;

  /// Pourcentage de remise affiché sur les vignettes (`-45 %`).
  int get discountPercent =>
      Formatters.discountPercent(initialPrice, reducedPrice);

  bool get isSoldOut => quantity <= 0;

  factory StudentOffer.fromJson(Map<String, dynamic> json) {
    return StudentOffer(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      restaurantId: json['restaurantId']?.toString() ?? json['restaurant_id']?.toString() ?? '',
      initialPrice: (json['initialPrice'] as num?)?.toDouble() ?? (json['initial_price'] as num?)?.toDouble() ?? 0.0,
      reducedPrice: (json['reducedPrice'] as num?)?.toDouble() ?? (json['reduced_price'] as num?)?.toDouble() ?? 0.0,
      quantity: (json['quantity'] as num?)?.toInt() ?? 0,
      pickupHours: json['pickupHours']?.toString() ?? json['pickup_hours']?.toString() ?? '',
      image: json['image']?.toString() ?? '',
      featured: json['featured'] == true,
      isRecent: json['isRecent'] == true || json['is_recent'] == true,
      isSurpriseBasket: json['isSurpriseBasket'] == true || json['is_surprise_basket'] == true,
      weightKg: (json['weightKg'] as num?)?.toDouble() ?? (json['weight_kg'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'description': description,
    'category': category,
    'restaurantId': restaurantId,
    'initialPrice': initialPrice,
    'reducedPrice': reducedPrice,
    'quantity': quantity,
    'pickupHours': pickupHours,
    'image': image,
    'featured': featured,
    'isRecent': isRecent,
    'isSurpriseBasket': isSurpriseBasket,
    'weightKg': weightKg,
  };

  StudentOffer copyWith({int? quantity}) => StudentOffer(
    id: id,
    title: title,
    description: description,
    category: category,
    restaurantId: restaurantId,
    initialPrice: initialPrice,
    reducedPrice: reducedPrice,
    quantity: quantity ?? this.quantity,
    pickupHours: pickupHours,
    image: image,
    featured: featured,
    isRecent: isRecent,
    isSurpriseBasket: isSurpriseBasket,
    weightKg: weightKg,
  );
}

/// Commande de l'étudiant (réservation, paiement, retrait).
class StudentOrder {
  const StudentOrder({
    required this.id,
    required this.offerId,
    required this.productTitle,
    required this.productImage,
    required this.restaurantId,
    required this.restaurantName,
    required this.restaurantAddress,
    required this.quantity,
    required this.initialUnitPrice,
    required this.unitPrice,
    required this.totalAmount,
    required this.pickupHours,
    required this.createdAt,
    required this.paymentStatus,
    required this.orderStatus,
    required this.paymentMethod,
    required this.qrToken,
    required this.weightKg,
  });

  final String id;
  final String offerId;
  final String productTitle;
  final String productImage;
  final String restaurantId;
  final String restaurantName;
  final String restaurantAddress;
  final int quantity;
  final double initialUnitPrice;
  final double unitPrice;
  final double totalAmount;
  final String pickupHours;
  final String createdAt;

  /// `Payée`, `En attente`, `Échouée`.
  final String paymentStatus;

  /// `Payée / À récupérer`, `Récupérée`, `En attente de paiement`, `Annulée`.
  final String orderStatus;

  final String paymentMethod;

  /// Jeton QR émis après confirmation du paiement (`null` avant paiement).
  final String? qrToken;

  final double weightKg;

  bool get isPaid => paymentStatus == 'Payée';

  bool get isCollected => orderStatus.contains('Récupérée');

  bool get isAwaitingPayment => orderStatus == 'En attente de paiement';

  factory StudentOrder.fromJson(Map<String, dynamic> json) {
    return StudentOrder(
      id: json['id']?.toString() ?? '',
      offerId: json['offerId']?.toString() ?? json['offer_id']?.toString() ?? '',
      productTitle: json['productTitle']?.toString() ?? json['product_title']?.toString() ?? '',
      productImage: json['productImage']?.toString() ?? json['product_image']?.toString() ?? '',
      restaurantId: json['restaurantId']?.toString() ?? json['restaurant_id']?.toString() ?? '',
      restaurantName: json['restaurantName']?.toString() ?? json['restaurant_name']?.toString() ?? '',
      restaurantAddress: json['restaurantAddress']?.toString() ?? json['restaurant_address']?.toString() ?? '',
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      initialUnitPrice: (json['initialUnitPrice'] as num?)?.toDouble() ?? (json['initial_unit_price'] as num?)?.toDouble() ?? 0.0,
      unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? (json['unit_price'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      pickupHours: json['pickupHours']?.toString() ?? json['pickup_hours']?.toString() ?? '',
      createdAt: json['createdAt']?.toString() ?? json['created_at']?.toString() ?? '',
      paymentStatus: json['paymentStatus']?.toString() ?? json['payment_status']?.toString() ?? 'En attente',
      orderStatus: json['orderStatus']?.toString() ?? json['order_status']?.toString() ?? 'En attente de paiement',
      paymentMethod: json['paymentMethod']?.toString() ?? json['payment_method']?.toString() ?? '',
      qrToken: json['qrToken']?.toString() ?? json['qr_token']?.toString(),
      weightKg: (json['weightKg'] as num?)?.toDouble() ?? (json['weight_kg'] as num?)?.toDouble() ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'offerId': offerId,
    'productTitle': productTitle,
    'productImage': productImage,
    'restaurantId': restaurantId,
    'restaurantName': restaurantName,
    'restaurantAddress': restaurantAddress,
    'quantity': quantity,
    'initialUnitPrice': initialUnitPrice,
    'unitPrice': unitPrice,
    'totalAmount': totalAmount,
    'pickupHours': pickupHours,
    'createdAt': createdAt,
    'paymentStatus': paymentStatus,
    'orderStatus': orderStatus,
    'paymentMethod': paymentMethod,
    'qrToken': qrToken,
    'weightKg': weightKg,
  };

  StudentOrder copyWith({
    String? paymentStatus,
    String? orderStatus,
    String? paymentMethod,
    String? qrToken,
    String? createdAt,
  }) {
    return StudentOrder(
      id: id,
      offerId: offerId,
      productTitle: productTitle,
      productImage: productImage,
      restaurantId: restaurantId,
      restaurantName: restaurantName,
      restaurantAddress: restaurantAddress,
      quantity: quantity,
      initialUnitPrice: initialUnitPrice,
      unitPrice: unitPrice,
      totalAmount: totalAmount,
      pickupHours: pickupHours,
      createdAt: createdAt ?? this.createdAt,
      paymentStatus: paymentStatus ?? this.paymentStatus,
      orderStatus: orderStatus ?? this.orderStatus,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      qrToken: qrToken ?? this.qrToken,
      weightKg: weightKg,
    );
  }
}

/// Notification affichée dans l'espace étudiant.
class StudentNotification {
  const StudentNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.read,
    required this.orderId,
  });

  final String id;
  final String type;
  final String title;
  final String message;
  final String timestamp;
  final bool read;
  final String orderId;

  factory StudentNotification.fromJson(Map<String, dynamic> json) {
    return StudentNotification(
      id: json['id']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      message: json['message']?.toString() ?? '',
      timestamp: json['timestamp']?.toString() ?? '',
      read: json['read'] == true,
      orderId: json['orderId']?.toString() ?? json['order_id']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'title': title,
    'message': message,
    'timestamp': timestamp,
    'read': read,
    'orderId': orderId,
  };

  StudentNotification copyWith({bool? read}) => StudentNotification(
    id: id,
    type: type,
    title: title,
    message: message,
    timestamp: timestamp,
    read: read ?? this.read,
    orderId: orderId,
  );
}

/// Valeurs saisies dans le formulaire d'inscription étudiant.
class StudentRegistrationForm {
  const StudentRegistrationForm({
    required this.fullName,
    required this.email,
    required this.phone,
    required this.password,
    required this.confirmPassword,
    required this.filiere,
    required this.annee,
  });

  final String fullName;
  final String email;
  final String phone;
  final String password;
  final String confirmPassword;
  final String filiere;
  final String annee;

  factory StudentRegistrationForm.fromJson(Map<String, dynamic> json) {
    return StudentRegistrationForm(
      fullName: json['fullName']?.toString() ?? json['full_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      password: json['password']?.toString() ?? '',
      confirmPassword: json['confirmPassword']?.toString() ?? json['confirm_password']?.toString() ?? '',
      filiere: json['filiere']?.toString() ?? '',
      annee: json['annee']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'fullName': fullName,
    'email': email,
    'phone': phone,
    'filiere': filiere,
    'annee': annee,
  };
}
