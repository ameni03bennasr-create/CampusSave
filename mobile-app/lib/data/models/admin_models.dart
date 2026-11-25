/// Modèles de l'espace administrateur — portés de `src/types/admin.ts`.
library;

import 'user_role.dart';

/// Préférences d'alerte de l'administrateur.
class AdminPreferences {
  const AdminPreferences({
    this.alertNewMerchant = true,
    this.alertFailedPayments = true,
    this.dailyDigest = false,
  });

  final bool alertNewMerchant;
  final bool alertFailedPayments;
  final bool dailyDigest;

  factory AdminPreferences.fromJson(Map<String, dynamic> json) {
    return AdminPreferences(
      alertNewMerchant: json['alertNewMerchant'] ?? json['alert_new_merchant'] ?? true,
      alertFailedPayments: json['alertFailedPayments'] ?? json['alert_failed_payments'] ?? true,
      dailyDigest: json['dailyDigest'] ?? json['daily_digest'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'alertNewMerchant': alertNewMerchant,
    'alertFailedPayments': alertFailedPayments,
    'dailyDigest': dailyDigest,
  };

  AdminPreferences copyWith({
    bool? alertNewMerchant,
    bool? alertFailedPayments,
    bool? dailyDigest,
  }) =>
      AdminPreferences(
        alertNewMerchant: alertNewMerchant ?? this.alertNewMerchant,
        alertFailedPayments: alertFailedPayments ?? this.alertFailedPayments,
        dailyDigest: dailyDigest ?? this.dailyDigest,
      );
}

/// Profil de l'administrateur connecté.
class AdminProfile {
  const AdminProfile({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.role,
    required this.department,
    required this.createdAt,
    required this.preferences,
  });

  final String id;
  final String fullName;
  final String email;
  final String phone;
  final String role;
  final String department;
  final String createdAt;
  final AdminPreferences preferences;

  factory AdminProfile.fromJson(Map<String, dynamic> json) {
    return AdminProfile(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? json['full_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      role: json['role']?.toString() ?? 'Administrateur',
      department: json['department']?.toString() ?? '',
      createdAt: json['createdAt']?.toString() ?? json['created_at']?.toString() ?? '',
      preferences: json['preferences'] != null
          ? AdminPreferences.fromJson(json['preferences'] as Map<String, dynamic>)
          : const AdminPreferences(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'fullName': fullName,
    'email': email,
    'phone': phone,
    'role': role,
    'department': department,
    'createdAt': createdAt,
    'preferences': preferences.toJson(),
  };

  AdminProfile copyWith({
    String? fullName,
    String? email,
    String? phone,
    String? department,
    AdminPreferences? preferences,
  }) =>
      AdminProfile(
        id: id,
        fullName: fullName ?? this.fullName,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        role: role,
        department: department ?? this.department,
        createdAt: createdAt,
        preferences: preferences ?? this.preferences,
      );
}

/// Détails complémentaires d'un compte utilisateur.
class AdminUserDetails {
  const AdminUserDetails({
    this.filiere,
    this.ordersCount,
    this.establishmentName,
    this.establishmentId,
    required this.lastLogin,
  });

  final String? filiere;
  final int? ordersCount;
  final String? establishmentName;
  final String? establishmentId;
  final String lastLogin;

  factory AdminUserDetails.fromJson(Map<String, dynamic> json) {
    return AdminUserDetails(
      filiere: json['filiere']?.toString(),
      ordersCount: (json['ordersCount'] as num?)?.toInt() ?? (json['orders_count'] as num?)?.toInt(),
      establishmentName: json['establishmentName']?.toString() ?? json['establishment_name']?.toString(),
      establishmentId: json['establishmentId']?.toString() ?? json['establishment_id']?.toString(),
      lastLogin: json['lastLogin']?.toString() ?? json['last_login']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'filiere': filiere,
    'ordersCount': ordersCount,
    'establishmentName': establishmentName,
    'establishmentId': establishmentId,
    'lastLogin': lastLogin,
  };
}

/// Compte utilisateur de la plateforme (étudiant, commerçant ou admin).
class AdminUser {
  const AdminUser({
    required this.id,
    required this.fullName,
    required this.email,
    required this.phone,
    required this.role,
    required this.registrationDate,
    required this.status,
    required this.details,
  });

  final String id;
  final String fullName;
  final String email;
  final String phone;
  final UserRole role;
  final String registrationDate;

  /// `Actif`, `En attente`, `Désactivé`.
  final String status;

  final AdminUserDetails details;

  bool get isActive => status == 'Actif';

  factory AdminUser.fromJson(Map<String, dynamic> json) {
    final roleRaw = json['role']?.toString().toLowerCase() ?? 'student';
    final role = UserRole.values.firstWhere(
      (r) => r.name.toLowerCase() == roleRaw || r.label.toLowerCase() == roleRaw,
      orElse: () => UserRole.student,
    );

    return AdminUser(
      id: json['id']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? json['full_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      role: role,
      registrationDate: json['registrationDate']?.toString() ?? json['registration_date']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Actif',
      details: json['details'] != null
          ? AdminUserDetails.fromJson(json['details'] as Map<String, dynamic>)
          : const AdminUserDetails(lastLogin: ''),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'fullName': fullName,
    'email': email,
    'phone': phone,
    'role': role.name,
    'registrationDate': registrationDate,
    'status': status,
    'details': details.toJson(),
  };

  AdminUser copyWith({String? status}) => AdminUser(
        id: id,
        fullName: fullName,
        email: email,
        phone: phone,
        role: role,
        registrationDate: registrationDate,
        status: status ?? this.status,
        details: details,
      );
}

/// Informations soumises par un commerçant lors de sa demande.
class AdminMerchantSubmittedInfo {
  const AdminMerchantSubmittedInfo({
    required this.matriculeFiscal,
    required this.openingHours,
    required this.description,
    required this.distanceEssect,
  });

  final String matriculeFiscal;
  final String openingHours;
  final String description;
  final String distanceEssect;

  factory AdminMerchantSubmittedInfo.fromJson(Map<String, dynamic> json) {
    return AdminMerchantSubmittedInfo(
      matriculeFiscal: json['matriculeFiscal']?.toString() ?? json['matricule_fiscal']?.toString() ?? '',
      openingHours: json['openingHours']?.toString() ?? json['opening_hours']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      distanceEssect: json['distanceEssect']?.toString() ?? json['distance_essect']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'matriculeFiscal': matriculeFiscal,
    'openingHours': openingHours,
    'description': description,
    'distanceEssect': distanceEssect,
  };
}

/// Demande d'inscription / établissement commerçant supervisé par l'admin.
class AdminMerchant {
  const AdminMerchant({
    required this.id,
    required this.userId,
    required this.establishmentName,
    required this.contactName,
    required this.email,
    required this.phone,
    required this.type,
    required this.address,
    required this.registrationDate,
    required this.validationStatus,
    required this.accountActive,
    required this.photo,
    required this.submittedInfo,
    this.rejectionReason,
  });

  final String id;
  final String userId;
  final String establishmentName;
  final String contactName;
  final String email;
  final String phone;
  final String type;
  final String address;
  final String registrationDate;

  /// `Validé`, `En attente`, `Rejeté`.
  final String validationStatus;

  final bool accountActive;
  final String photo;
  final AdminMerchantSubmittedInfo submittedInfo;
  final String? rejectionReason;

  bool get isPending => validationStatus == 'En attente';

  factory AdminMerchant.fromJson(Map<String, dynamic> json) {
    return AdminMerchant(
      id: json['id']?.toString() ?? '',
      userId: json['userId']?.toString() ?? json['user_id']?.toString() ?? '',
      establishmentName: json['establishmentName']?.toString() ?? json['establishment_name']?.toString() ?? '',
      contactName: json['contactName']?.toString() ?? json['contact_name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      address: json['address']?.toString() ?? '',
      registrationDate: json['registrationDate']?.toString() ?? json['registration_date']?.toString() ?? '',
      validationStatus: json['validationStatus']?.toString() ?? json['validation_status']?.toString() ?? 'En attente',
      accountActive: json['accountActive'] == true || json['account_active'] == true,
      photo: json['photo']?.toString() ?? '',
      submittedInfo: json['submittedInfo'] != null
          ? AdminMerchantSubmittedInfo.fromJson(json['submittedInfo'] as Map<String, dynamic>)
          : (json['submitted_info'] != null
              ? AdminMerchantSubmittedInfo.fromJson(json['submitted_info'] as Map<String, dynamic>)
              : const AdminMerchantSubmittedInfo(matriculeFiscal: '', openingHours: '', description: '', distanceEssect: '')),
      rejectionReason: json['rejectionReason']?.toString() ?? json['rejection_reason']?.toString(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'establishmentName': establishmentName,
    'contactName': contactName,
    'email': email,
    'phone': phone,
    'type': type,
    'address': address,
    'registrationDate': registrationDate,
    'validationStatus': validationStatus,
    'accountActive': accountActive,
    'photo': photo,
    'submittedInfo': submittedInfo.toJson(),
    'rejectionReason': rejectionReason,
  };

  AdminMerchant copyWith({
    String? validationStatus,
    bool? accountActive,
    String? rejectionReason,
  }) =>
      AdminMerchant(
        id: id,
        userId: userId,
        establishmentName: establishmentName,
        contactName: contactName,
        email: email,
        phone: phone,
        type: type,
        address: address,
        registrationDate: registrationDate,
        validationStatus: validationStatus ?? this.validationStatus,
        accountActive: accountActive ?? this.accountActive,
        photo: photo,
        submittedInfo: submittedInfo,
        rejectionReason: rejectionReason ?? this.rejectionReason,
      );
}

/// Offre supervisée par l'administrateur.
class AdminOffer {
  const AdminOffer({
    required this.id,
    required this.productName,
    required this.description,
    required this.image,
    required this.merchantId,
    required this.merchantName,
    required this.category,
    required this.initialPrice,
    required this.reducedPrice,
    required this.quantity,
    required this.publicationStatus,
    required this.pickupSchedule,
    required this.publishedAt,
  });

  final String id;
  final String productName;
  final String description;
  final String image;
  final String merchantId;
  final String merchantName;
  final String category;
  final double initialPrice;
  final double reducedPrice;
  final int quantity;

  /// `Publiée`, `En attente`, `Retirée`.
  final String publicationStatus;

  final String pickupSchedule;
  final String publishedAt;

  factory AdminOffer.fromJson(Map<String, dynamic> json) {
    return AdminOffer(
      id: json['id']?.toString() ?? '',
      productName: json['productName']?.toString() ?? json['product_name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      image: json['image']?.toString() ?? '',
      merchantId: json['merchantId']?.toString() ?? json['merchant_id']?.toString() ?? '',
      merchantName: json['merchantName']?.toString() ?? json['merchant_name']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      initialPrice: (json['initialPrice'] as num?)?.toDouble() ?? (json['initial_price'] as num?)?.toDouble() ?? 0.0,
      reducedPrice: (json['reducedPrice'] as num?)?.toDouble() ?? (json['reduced_price'] as num?)?.toDouble() ?? 0.0,
      quantity: (json['quantity'] as num?)?.toInt() ?? 0,
      publicationStatus: json['publicationStatus']?.toString() ?? json['publication_status']?.toString() ?? 'Publiée',
      pickupSchedule: json['pickupSchedule']?.toString() ?? json['pickup_schedule']?.toString() ?? '',
      publishedAt: json['publishedAt']?.toString() ?? json['published_at']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'productName': productName,
    'description': description,
    'image': image,
    'merchantId': merchantId,
    'merchantName': merchantName,
    'category': category,
    'initialPrice': initialPrice,
    'reducedPrice': reducedPrice,
    'quantity': quantity,
    'publicationStatus': publicationStatus,
    'pickupSchedule': pickupSchedule,
    'publishedAt': publishedAt,
  };
}

/// Commande supervisée par l'administrateur.
class AdminOrder {
  const AdminOrder({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.studentEmail,
    required this.studentPhone,
    required this.merchantId,
    required this.merchantName,
    required this.merchantAddress,
    required this.productName,
    required this.productImage,
    required this.unitPrice,
    required this.quantity,
    required this.totalAmount,
    required this.paymentStatus,
    required this.paymentMethod,
    required this.orderStatus,
    required this.reservationDate,
    required this.pickupSchedule,
  });

  final String id;
  final String studentId;
  final String studentName;
  final String studentEmail;
  final String studentPhone;
  final String merchantId;
  final String merchantName;
  final String merchantAddress;
  final String productName;
  final String productImage;
  final double unitPrice;
  final int quantity;
  final double totalAmount;
  final String paymentStatus;
  final String paymentMethod;
  final String orderStatus;
  final String reservationDate;
  final String pickupSchedule;

  factory AdminOrder.fromJson(Map<String, dynamic> json) {
    return AdminOrder(
      id: json['id']?.toString() ?? '',
      studentId: json['studentId']?.toString() ?? json['student_id']?.toString() ?? '',
      studentName: json['studentName']?.toString() ?? json['student_name']?.toString() ?? '',
      studentEmail: json['studentEmail']?.toString() ?? json['student_email']?.toString() ?? '',
      studentPhone: json['studentPhone']?.toString() ?? json['student_phone']?.toString() ?? '',
      merchantId: json['merchantId']?.toString() ?? json['merchant_id']?.toString() ?? '',
      merchantName: json['merchantName']?.toString() ?? json['merchant_name']?.toString() ?? '',
      merchantAddress: json['merchantAddress']?.toString() ?? json['merchant_address']?.toString() ?? '',
      productName: json['productName']?.toString() ?? json['product_name']?.toString() ?? '',
      productImage: json['productImage']?.toString() ?? json['product_image']?.toString() ?? '',
      unitPrice: (json['unitPrice'] as num?)?.toDouble() ?? (json['unit_price'] as num?)?.toDouble() ?? 0.0,
      quantity: (json['quantity'] as num?)?.toInt() ?? 1,
      totalAmount: (json['totalAmount'] as num?)?.toDouble() ?? (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      paymentStatus: json['paymentStatus']?.toString() ?? json['payment_status']?.toString() ?? '',
      paymentMethod: json['paymentMethod']?.toString() ?? json['payment_method']?.toString() ?? '',
      orderStatus: json['orderStatus']?.toString() ?? json['order_status']?.toString() ?? '',
      reservationDate: json['reservationDate']?.toString() ?? json['reservation_date']?.toString() ?? '',
      pickupSchedule: json['pickupSchedule']?.toString() ?? json['pickup_schedule']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'studentId': studentId,
    'studentName': studentName,
    'studentEmail': studentEmail,
    'studentPhone': studentPhone,
    'merchantId': merchantId,
    'merchantName': merchantName,
    'merchantAddress': merchantAddress,
    'productName': productName,
    'productImage': productImage,
    'unitPrice': unitPrice,
    'quantity': quantity,
    'totalAmount': totalAmount,
    'paymentStatus': paymentStatus,
    'paymentMethod': paymentMethod,
    'orderStatus': orderStatus,
    'reservationDate': reservationDate,
    'pickupSchedule': pickupSchedule,
  };
}

/// Événement du journal d'activité de la plateforme.
class AdminActivity {
  const AdminActivity({
    required this.id,
    required this.type,
    required this.text,
    required this.time,
  });

  final String id;
  final String type;
  final String text;
  final String time;

  factory AdminActivity.fromJson(Map<String, dynamic> json) {
    return AdminActivity(
      id: json['id']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
      text: json['text']?.toString() ?? '',
      time: json['time']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'text': text,
    'time': time,
  };
}
