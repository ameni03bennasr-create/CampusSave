/// Modèles de l'espace commerçant — portés de `src/types/merchant.ts`.
library;

/// Préférences de notification du commerçant.
class MerchantNotificationPrefs {
  const MerchantNotificationPrefs({
    this.newReservations = true,
    this.paidOrders = true,
    this.lowStock = true,
  });

  final bool newReservations;
  final bool paidOrders;
  final bool lowStock;

  factory MerchantNotificationPrefs.fromJson(Map<String, dynamic> json) {
    return MerchantNotificationPrefs(
      newReservations: json['newReservations'] ?? json['new_reservations'] ?? true,
      paidOrders: json['paidOrders'] ?? json['paid_orders'] ?? true,
      lowStock: json['lowStock'] ?? json['low_stock'] ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'newReservations': newReservations,
    'paidOrders': paidOrders,
    'lowStock': lowStock,
  };

  MerchantNotificationPrefs copyWith({
    bool? newReservations,
    bool? paidOrders,
    bool? lowStock,
  }) =>
      MerchantNotificationPrefs(
        newReservations: newReservations ?? this.newReservations,
        paidOrders: paidOrders ?? this.paidOrders,
        lowStock: lowStock ?? this.lowStock,
      );
}

/// Profil du commerçant connecté.
class MerchantProfile {
  const MerchantProfile({
    required this.id,
    required this.fullName,
    required this.role,
    required this.email,
    required this.phone,
    required this.personalPhone,
    required this.notificationsPrefs,
  });

  final String id;
  final String fullName;
  final String role;
  final String email;
  final String phone;
  final String personalPhone;
  final MerchantNotificationPrefs notificationsPrefs;

  factory MerchantProfile.fromJson(Map<String, dynamic> json) {
    return MerchantProfile(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? json['full_name']?.toString() ?? '',
      role: json['role']?.toString() ?? 'Commerçant',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      personalPhone: json['personalPhone']?.toString() ?? json['personal_phone']?.toString() ?? '',
      notificationsPrefs: json['notificationsPrefs'] != null
          ? MerchantNotificationPrefs.fromJson(json['notificationsPrefs'] as Map<String, dynamic>)
          : (json['notifications_prefs'] != null
              ? MerchantNotificationPrefs.fromJson(json['notifications_prefs'] as Map<String, dynamic>)
              : const MerchantNotificationPrefs()),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'fullName': fullName,
    'role': role,
    'email': email,
    'phone': phone,
    'personalPhone': personalPhone,
    'notificationsPrefs': notificationsPrefs.toJson(),
  };

  MerchantProfile copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? personalPhone,
    MerchantNotificationPrefs? notificationsPrefs,
  }) =>
      MerchantProfile(
        id: id,
        fullName: fullName ?? this.fullName,
        role: role,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        personalPhone: personalPhone ?? this.personalPhone,
        notificationsPrefs: notificationsPrefs ?? this.notificationsPrefs,
      );
}

/// Établissement (restaurant ou cafétéria) géré par le commerçant.
class MerchantEstablishment {
  const MerchantEstablishment({
    required this.name,
    required this.type,
    required this.address,
    required this.phone,
    required this.email,
    required this.description,
    required this.openingHours,
    required this.logo,
    required this.coverImage,
    required this.adminValidated,
    required this.validatedDate,
  });

  final String name;
  final String type;
  final String address;
  final String phone;
  final String email;
  final String description;
  final String openingHours;
  final String logo;
  final String coverImage;
  final bool adminValidated;
  final String validatedDate;

  factory MerchantEstablishment.fromJson(Map<String, dynamic> json) {
    return MerchantEstablishment(
      name: json['name']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      openingHours: json['openingHours']?.toString() ?? json['opening_hours']?.toString() ?? '',
      logo: json['logo']?.toString() ?? '',
      coverImage: json['coverImage']?.toString() ?? json['cover_image']?.toString() ?? '',
      adminValidated: json['adminValidated'] == true || json['admin_validated'] == true,
      validatedDate: json['validatedDate']?.toString() ?? json['validated_date']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'type': type,
    'address': address,
    'phone': phone,
    'email': email,
    'description': description,
    'openingHours': openingHours,
    'logo': logo,
    'coverImage': coverImage,
    'adminValidated': adminValidated,
    'validatedDate': validatedDate,
  };

  MerchantEstablishment copyWith({
    String? name,
    String? type,
    String? address,
    String? phone,
    String? email,
    String? description,
    String? openingHours,
    String? logo,
    String? coverImage,
    bool? adminValidated,
    String? validatedDate,
  }) =>
      MerchantEstablishment(
        name: name ?? this.name,
        type: type ?? this.type,
        address: address ?? this.address,
        phone: phone ?? this.phone,
        email: email ?? this.email,
        description: description ?? this.description,
        openingHours: openingHours ?? this.openingHours,
        logo: logo ?? this.logo,
        coverImage: coverImage ?? this.coverImage,
        adminValidated: adminValidated ?? this.adminValidated,
        validatedDate: validatedDate ?? this.validatedDate,
      );
}

/// Offre publiée par le commerçant.
class MerchantOffer {
  const MerchantOffer({
    required this.id,
    required this.name,
    required this.description,
    required this.category,
    required this.photo,
    required this.initialPrice,
    required this.reducedPrice,
    required this.quantity,
    required this.pickupStart,
    required this.pickupEnd,
    required this.status,
    required this.createdAt,
  });

  final String id;
  final String name;
  final String description;
  final String category;
  final String photo;
  final double initialPrice;
  final double reducedPrice;
  final int quantity;
  final String pickupStart;
  final String pickupEnd;

  /// `Active`, `Stock faible`, `Épuisée`.
  final String status;

  final String createdAt;

  /// Créneau de retrait affiché (`12:00 – 14:30`).
  String get pickupHours => '$pickupStart – $pickupEnd';

  int get discountPercent => _discount(initialPrice, reducedPrice);

  static int _discount(double initial, double reduced) {
    if (initial <= 0) return 0;
    final value = ((initial - reduced) / initial * 100).round();
    return value < 0 ? 0 : value;
  }

  factory MerchantOffer.fromJson(Map<String, dynamic> json) {
    return MerchantOffer(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      photo: json['photo']?.toString() ?? '',
      initialPrice: (json['initialPrice'] as num?)?.toDouble() ?? (json['initial_price'] as num?)?.toDouble() ?? 0.0,
      reducedPrice: (json['reducedPrice'] as num?)?.toDouble() ?? (json['reduced_price'] as num?)?.toDouble() ?? 0.0,
      quantity: (json['quantity'] as num?)?.toInt() ?? 0,
      pickupStart: json['pickupStart']?.toString() ?? json['pickup_start']?.toString() ?? '',
      pickupEnd: json['pickupEnd']?.toString() ?? json['pickup_end']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Active',
      createdAt: json['createdAt']?.toString() ?? json['created_at']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'description': description,
    'category': category,
    'photo': photo,
    'initialPrice': initialPrice,
    'reducedPrice': reducedPrice,
    'quantity': quantity,
    'pickupStart': pickupStart,
    'pickupEnd': pickupEnd,
    'status': status,
    'createdAt': createdAt,
  };
}

/// Commande reçue par le commerçant.
class MerchantOrder {
  const MerchantOrder({
    required this.id,
    required this.qrToken,
    required this.studentName,
    required this.studentEmail,
    required this.studentPhone,
    required this.offerId,
    required this.productName,
    required this.productPhoto,
    required this.unitPrice,
    required this.quantity,
    required this.totalAmount,
    required this.paymentStatus,
    required this.paymentMethod,
    required this.orderStatus,
    required this.reservationDate,
    required this.pickupTime,
    required this.collectedAt,
  });

  final String id;
  final String qrToken;
  final String studentName;
  final String studentEmail;
  final String studentPhone;
  final String offerId;
  final String productName;
  final String productPhoto;
  final double unitPrice;
  final int quantity;
  final double totalAmount;

  /// `Payée`, `En attente`, `Échouée`.
  final String paymentStatus;

  final String paymentMethod;

  /// `Payée / À récupérer`, `Récupérée`, `En attente`, `Annulée`.
  final String orderStatus;

  final String reservationDate;
  final String pickupTime;
  final String? collectedAt;

  bool get isCollected => orderStatus == 'Récupérée';

  bool get canBeCollected => paymentStatus == 'Payée' && !isCollected;

  factory MerchantOrder.fromJson(Map<String, dynamic> json) {
    return MerchantOrder(
      id: json['id']?.toString() ?? '',
      qrToken: json['qrToken']?.toString() ?? json['qr_token']?.toString() ?? '',
      studentName: json['studentName']?.toString() ?? json['student_name']?.toString() ?? '',
      studentEmail: json['studentEmail']?.toString() ?? json['student_email']?.toString() ?? '',
      studentPhone: json['studentPhone']?.toString() ?? json['student_phone']?.toString() ?? '',
      offerId: json['offerId']?.toString() ?? json['offer_id']?.toString() ?? '',
      productName: json['productName']?.toString() ?? json['product_name']?.toString() ?? '',
      productPhoto: json['productPhoto']?.toString() ?? json['product_photo']?.toString() ?? '',
      unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? (json['unit_price'] as num?)?.toDouble() ?? 0.0,
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      paymentStatus: json['paymentStatus']?.toString() ?? json['payment_status']?.toString() ?? 'En attente',
      paymentMethod: json['paymentMethod']?.toString() ?? json['payment_method']?.toString() ?? '',
      orderStatus: json['orderStatus']?.toString() ?? json['order_status']?.toString() ?? 'En attente',
      reservationDate: json['reservationDate']?.toString() ?? json['reservation_date']?.toString() ?? '',
      pickupTime: json['pickupTime']?.toString() ?? json['pickup_time']?.toString() ?? '',
      collectedAt: json['collectedAt']?.toString() ?? json['collected_at']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'qrToken': qrToken,
    'studentName': studentName,
    'studentEmail': studentEmail,
    'studentPhone': studentPhone,
    'offerId': offerId,
    'productName': productName,
    'productPhoto': productPhoto,
    'unitPrice': unitPrice,
    'quantity': quantity,
    'totalAmount': totalAmount,
    'paymentStatus': paymentStatus,
    'paymentMethod': paymentMethod,
    'orderStatus': orderStatus,
    'reservationDate': reservationDate,
    'pickupTime': pickupTime,
    'collectedAt': collectedAt,
  };

  MerchantOrder copyWith({
    String? orderStatus,
    String? collectedAt,
    String? paymentStatus,
  }) =>
      MerchantOrder(
        id: id,
        qrToken: qrToken,
        studentName: studentName,
        studentEmail: studentEmail,
        studentPhone: studentPhone,
        offerId: offerId,
        productName: productName,
        productPhoto: productPhoto,
        unitPrice: unitPrice,
        quantity: quantity,
        totalAmount: totalAmount,
        paymentStatus: paymentStatus ?? this.paymentStatus,
        paymentMethod: paymentMethod,
        orderStatus: orderStatus ?? this.orderStatus,
        reservationDate: reservationDate,
        pickupTime: pickupTime,
        collectedAt: collectedAt ?? this.collectedAt,
      );
}

/// Notification de l'espace commerçant (avec cible de navigation).
class MerchantNotification {
  const MerchantNotification({
    required this.id,
    required this.type,
    required this.title,
    required this.message,
    required this.timestamp,
    required this.read,
    required this.targetPage,
    required this.targetId,
  });

  final String id;
  final String type;
  final String title;
  final String message;
  final String timestamp;
  final bool read;

  /// Identifiant de page interne (`order-details`, `offers`…).
  final String targetPage;

  final String targetId;

  factory MerchantNotification.fromJson(Map<String, dynamic> json) {
    return MerchantNotification(
      id: json['id']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      message: json['message']?.toString() ?? '',
      timestamp: json['timestamp']?.toString() ?? '',
      read: json['read'] == true,
      targetPage: json['targetPage']?.toString() ?? json['target_page']?.toString() ?? '',
      targetId: json['targetId']?.toString() ?? json['target_id']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'title': title,
    'message': message,
    'timestamp': timestamp,
    'read': read,
    'targetPage': targetPage,
    'targetId': targetId,
  };

  MerchantNotification copyWith({bool? read}) => MerchantNotification(
        id: id,
        type: type,
        title: title,
        message: message,
        timestamp: timestamp,
        read: read ?? this.read,
        targetPage: targetPage,
        targetId: targetId,
      );
}

/// Valeurs du formulaire d'offre.
class OfferFormValues {
  const OfferFormValues({
    required this.name,
    required this.description,
    required this.category,
    required this.photo,
    required this.initialPrice,
    required this.reducedPrice,
    required this.quantity,
    required this.pickupStart,
    required this.pickupEnd,
  });

  final String name;
  final String description;
  final String category;
  final String photo;
  final String initialPrice;
  final String reducedPrice;
  final String quantity;
  final String pickupStart;
  final String pickupEnd;

  factory OfferFormValues.fromJson(Map<String, dynamic> json) {
    return OfferFormValues(
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      photo: json['photo']?.toString() ?? '',
      initialPrice: json['initialPrice']?.toString() ?? json['initial_price']?.toString() ?? '0',
      reducedPrice: json['reducedPrice']?.toString() ?? json['reduced_price']?.toString() ?? '0',
      quantity: json['quantity']?.toString() ?? '0',
      pickupStart: json['pickupStart']?.toString() ?? json['pickup_start']?.toString() ?? '',
      pickupEnd: json['pickupEnd']?.toString() ?? json['pickup_end']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'name': name,
    'description': description,
    'category': category,
    'photo': photo,
    'initialPrice': initialPrice,
    'reducedPrice': reducedPrice,
    'quantity': quantity,
    'pickupStart': pickupStart,
    'pickupEnd': pickupEnd,
  };
}

/// Soumission du formulaire : l'édition transporte l'identité de l'offre.
class OfferFormSubmission extends OfferFormValues {
  const OfferFormSubmission({
    required super.name,
    required super.description,
    required super.category,
    required super.photo,
    required super.initialPrice,
    required super.reducedPrice,
    required super.quantity,
    required super.pickupStart,
    required super.pickupEnd,
    this.id,
    this.createdAt,
    this.status,
  });

  final String? id;
  final String? createdAt;
  final String? status;
}

/// Résultat d'une validation QR par le commerçant.
enum QrValidationStatus { invalid, alreadyCollected, unpaid, success }

class QrValidationResult {
  const QrValidationResult({
    required this.status,
    required this.title,
    required this.message,
    this.order,
  });

  final QrValidationStatus status;
  final String title;
  final String message;
  final MerchantOrder? order;

  bool get isSuccess => status == QrValidationStatus.success;
}

/// Valeurs du formulaire de demande d'inscription commerçant.
class MerchantRegistrationForm {
  const MerchantRegistrationForm({
    required this.establishmentName,
    required this.merchantFullName,
    required this.email,
    required this.phone,
    required this.password,
    required this.confirmPassword,
    required this.address,
    required this.establishmentType,
  });

  final String establishmentName;
  final String merchantFullName;
  final String email;
  final String phone;
  final String password;
  final String confirmPassword;
  final String address;
  final String establishmentType;

  factory MerchantRegistrationForm.fromJson(Map<String, dynamic> json) {
    return MerchantRegistrationForm(
      establishmentName: json['establishmentName']?.toString() ?? json['establishment_name']?.toString() ?? '',
      merchantFullName: json['merchantFullName']?.toString() ?? json['merchant_full_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      password: json['password']?.toString() ?? '',
      confirmPassword: json['confirmPassword']?.toString() ?? json['confirm_password']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      establishmentType: json['establishmentType']?.toString() ?? json['establishment_type']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'establishmentName': establishmentName,
    'merchantFullName': merchantFullName,
    'email': email,
    'phone': phone,
    'address': address,
    'establishmentType': establishmentType,
  };
}

/// Preset d'illustration proposé dans le formulaire d'offre.
class FoodPreset {
  const FoodPreset({required this.label, required this.url});

  final String label;
  final String url;
}
