# CampusSave Mobile – Data Mapping

**Version:** 1.0  
**Scope:** Student, Merchant and Admin Models  
**Status:** Frontend models documented – Backend mapping pending

---

# 1. Overview

This document describes the data models currently implemented in the CampusSave Flutter application.

It is intended to help the integration team map frontend models to Firebase or another backend data source.

The models are located in:

`lib/data/models/`

Main files:

- `student_models.dart`
- `merchant_models.dart`
- `admin_models.dart`
- `user_role.dart`

Most models provide:

- `fromJson()` to convert JSON data into Dart objects.
- `toJson()` to convert Dart objects into JSON.
- `copyWith()` to create updated copies of objects.

**Important:** The field names documented here represent the current Flutter implementation. They are not yet a confirmed Firebase collection or database schema.

# 2. Student Models

Source: `lib/data/models/student_models.dart`

## 2.1 StudentProfile

Represents the connected student's profile.

| Field | Type |
|---|---|
| id | String |
| fullName | String |
| email | String |
| phone | String |
| filiere | String |
| annee | String |
| etablissement | String |
| avatar | String |
| ecoPoints | int |
| memberSince | String |

## 2.2 Restaurant

Represents a partner restaurant or cafeteria.

| Field | Type |
|---|---|
| id | String |
| name | String |
| type | String |
| address | String |
| distanceMeters | int |
| rating | double |
| reviewsCount | int |
| pickupHours | String |
| phone | String |
| coordsX | double |
| coordsY | double |
| activeOffersCount | int |

**Note:** `coordsX` and `coordsY` represent percentage coordinates used by the Campus Radar schematic map. They are not GPS coordinates.

## 2.3 StudentOffer

Represents a food offer displayed to students.

| Field | Type |
|---|---|
| id | String |
| title | String |
| description | String |
| category | String |
| restaurantId | String |
| initialPrice | double |
| reducedPrice | double |
| quantity | int |
| pickupHours | String |
| image | String |
| featured | bool |
| isRecent | bool |
| isSurpriseBasket | bool |
| weightKg | double |

Computed properties:

- `discountPercent`
- `isSoldOut`

## 2.4 StudentOrder

Represents a student's reservation, payment and collection order.

| Field | Type |
|---|---|
| id | String |
| offerId | String |
| productTitle | String |
| productImage | String |
| restaurantId | String |
| restaurantName | String |
| restaurantAddress | String |
| quantity | int |
| initialUnitPrice | double |
| unitPrice | double |
| totalAmount | double |
| pickupHours | String |
| createdAt | String |
| paymentStatus | String |
| orderStatus | String |
| paymentMethod | String |
| qrToken | String? |
| weightKg | double |

Computed properties:

- `isPaid`
- `isCollected`
- `isAwaitingPayment`

Current documented status examples:

- Payment: `Payée`, `En attente`, `Échouée`
- Order: `Payée / À récupérer`, `Récupérée`, `En attente de paiement`, `Annulée`

**Important:** Payment confirmation and QR token generation must be handled or verified by trusted backend services.

## 2.5 StudentNotification

Represents a notification displayed in the student workspace.

| Field | Type |
|---|---|
| id | String |
| type | String |
| title | String |
| message | String |
| timestamp | String |
| read | bool |
| orderId | String |

## 2.6 StudentRegistrationForm

Represents the student registration form.

| Field | Type |
|---|---|
| fullName | String |
| email | String |
| phone | String |
| password | String |
| confirmPassword | String |
| filiere | String |
| annee | String |

**Important:** `toJson()` deliberately excludes `password` and `confirmPassword`. Credentials must be handled separately through the authentication layer.

# 3. Merchant Models

Source: `lib/data/models/merchant_models.dart`

## 3.1 MerchantNotificationPrefs

Represents merchant notification preferences.

| Field | Type | Default |
|---|---|---|
| newReservations | bool | true |
| paidOrders | bool | true |
| lowStock | bool | true |

## 3.2 MerchantProfile

Represents the connected merchant profile.

| Field | Type |
|---|---|
| id | String |
| fullName | String |
| role | String |
| email | String |
| phone | String |
| personalPhone | String |
| notificationsPrefs | MerchantNotificationPrefs |

## 3.3 MerchantEstablishment

Represents the restaurant or cafeteria managed by the merchant.

| Field | Type |
|---|---|
| name | String |
| type | String |
| address | String |
| phone | String |
| email | String |
| description | String |
| openingHours | String |
| logo | String |
| coverImage | String |
| adminValidated | bool |
| validatedDate | String |

## 3.4 MerchantOffer

Represents an offer published by a merchant.

| Field | Type |
|---|---|
| id | String |
| name | String |
| description | String |
| category | String |
| photo | String |
| initialPrice | double |
| reducedPrice | double |
| quantity | int |
| pickupStart | String |
| pickupEnd | String |
| status | String |
| createdAt | String |

Computed properties:

- `pickupHours`
- `discountPercent`

Current documented status examples:

- `Active`
- `Stock faible`
- `Épuisée`

## 3.5 MerchantOrder

Represents an order received by a merchant.

| Field | Type |
|---|---|
| id | String |
| qrToken | String |
| studentName | String |
| studentEmail | String |
| studentPhone | String |
| offerId | String |
| productName | String |
| productPhoto | String |
| unitPrice | double |
| quantity | int |
| totalAmount | double |
| paymentStatus | String |
| paymentMethod | String |
| orderStatus | String |
| reservationDate | String |
| pickupTime | String |
| collectedAt | String? |

Computed properties:

- `isCollected`
- `canBeCollected`

Current documented payment status examples:

- `Payée`
- `En attente`
- `Échouée`

Current documented order status examples:

- `Payée / À récupérer`
- `Récupérée`
- `En attente`
- `Annulée`

**Important:** QR validation and order collection must be verified by the backend.

## 3.6 MerchantNotification

Represents a merchant notification with an internal navigation target.

| Field | Type |
|---|---|
| id | String |
| type | String |
| title | String |
| message | String |
| timestamp | String |
| read | bool |
| targetPage | String |
| targetId | String |

## 3.7 OfferFormValues

Represents the merchant offer form values.

| Field | Type |
|---|---|
| name | String |
| description | String |
| category | String |
| photo | String |
| initialPrice | String |
| reducedPrice | String |
| quantity | String |
| pickupStart | String |
| pickupEnd | String |

**Note:** Prices and quantity are represented as strings in the form and must be converted to numeric types before persistence.

## 3.8 OfferFormSubmission

Extends `OfferFormValues`.

Additional fields:

| Field | Type |
|---|---|
| id | String? |
| createdAt | String? |
| status | String? |

Used for creating or editing an offer.

## 3.9 QrValidationResult

Represents the result of a merchant QR validation operation.

| Field | Type |
|---|---|
| status | QrValidationStatus |
| title | String |
| message | String |
| order | MerchantOrder? |

`QrValidationStatus` values:

- `invalid`
- `alreadyCollected`
- `unpaid`
- `success`

## 3.10 MerchantRegistrationForm

Represents a merchant account registration request.

| Field | Type |
|---|---|
| establishmentName | String |
| merchantFullName | String |
| email | String |
| phone | String |
| password | String |
| confirmPassword | String |
| address | String |
| establishmentType | String |

**Important:** `toJson()` excludes `password` and `confirmPassword`. Credentials must be handled separately through authentication.

## 3.11 FoodPreset

Represents a predefined food illustration option.

| Field | Type |
|---|---|
| label | String |
| url | String |

# 4. Admin Models

Source: `lib/data/models/admin_models.dart`

## 4.1 AdminPreferences

Represents administrator notification preferences.

| Field | Type | Default |
|---|---|---|
| alertNewMerchant | bool | true |
| alertFailedPayments | bool | true |
| dailyDigest | bool | false |

## 4.2 AdminProfile

Represents the connected administrator profile.

| Field | Type |
|---|---|
| id | String |
| fullName | String |
| email | String |
| phone | String |
| role | String |
| department | String |
| createdAt | String |
| preferences | AdminPreferences |

## 4.3 AdminUserDetails

Represents additional user account information.

| Field | Type |
|---|---|
| filiere | String? |
| ordersCount | int? |
| establishmentName | String? |
| establishmentId | String? |
| lastLogin | String |

## 4.4 AdminUser

Represents a platform user.

| Field | Type |
|---|---|
| id | String |
| fullName | String |
| email | String |
| phone | String |
| role | UserRole |
| registrationDate | String |
| status | String |
| details | AdminUserDetails |

Computed property:

- `isActive`

Current documented status examples:

- `Actif`
- `En attente`
- `Désactivé`

**Important:** `role` is a `UserRole` enum, not a String.

The current `fromJson()` implementation defaults unknown roles to `UserRole.student`. The integration team should review this behavior and validate backend role values explicitly.

## 4.5 AdminMerchantSubmittedInfo

Represents information submitted by a merchant during registration.

| Field | Type |
|---|---|
| matriculeFiscal | String |
| openingHours | String |
| description | String |
| distanceEssect | String |

## 4.6 AdminMerchant

Represents a merchant registration request managed by the administrator.

| Field | Type |
|---|---|
| id | String |
| userId | String |
| establishmentName | String |
| contactName | String |
| email | String |
| phone | String |
| type | String |
| address | String |
| registrationDate | String |
| validationStatus | String |
| accountActive | bool |
| photo | String |
| submittedInfo | AdminMerchantSubmittedInfo |
| rejectionReason | String? |

Computed property:

- `isPending`

Current documented validation status examples:

- `Validé`
- `En attente`
- `Rejeté`

## 4.7 AdminOffer

Represents an offer monitored by the administrator.

| Field | Type |
|---|---|
| id | String |
| productName | String |
| description | String |
| image | String |
| merchantId | String |
| merchantName | String |
| category | String |
| initialPrice | double |
| reducedPrice | double |
| quantity | int |
| publicationStatus | String |
| pickupSchedule | String |
| publishedAt | String |

Current documented publication status examples:

- `Publiée`
- `En attente`
- `Retirée`

## 4.8 AdminOrder

Represents an order monitored by the administrator.

| Field | Type |
|---|---|
| id | String |
| studentId | String |
| studentName | String |
| studentEmail | String |
| studentPhone | String |
| merchantId | String |
| merchantName | String |
| merchantAddress | String |
| productName | String |
| productImage | String |
| unitPrice | double |
| quantity | int |
| totalAmount | double |
| paymentStatus | String |
| paymentMethod | String |
| orderStatus | String |
| reservationDate | String |
| pickupSchedule | String |

## 4.9 AdminActivity

Represents an administrative activity log entry.

| Field | Type |
|---|---|
| id | String |
| type | String |
| text | String |
| time | String |

**Important:** The official activity log should eventually be retrieved from a trusted backend source.

# 5. User Roles

Source: `lib/data/models/user_role.dart`

The application defines three roles:

| Enum value | Label | Base route |
|---|---|---|
| student | Étudiant | /student |
| merchant | Commerçant | /merchant |
| admin | Administrateur | /admin |

The backend role identifiers must be agreed upon with the integration team.

# 6. JSON Mapping Notes

Several models support both camelCase and snake_case field names in `fromJson()`.

Examples:

- `fullName` / `full_name`
- `restaurantId` / `restaurant_id`
- `initialPrice` / `initial_price`
- `paymentStatus` / `payment_status`
- `createdAt` / `created_at`

However, `toJson()` generally writes camelCase keys.

**Integration requirement:** Choose one canonical naming convention for the backend and verify all mappings before deployment.

# 7. Important Data Types and Nullability

The integration team must pay attention to the following:

| Field | Model | Type |
|---|---|---|
| qrToken | StudentOrder | String? |
| collectedAt | MerchantOrder | String? |
| rejectionReason | AdminMerchant | String? |
| filiere | AdminUserDetails | String? |
| ordersCount | AdminUserDetails | int? |
| establishmentName | AdminUserDetails | String? |
| establishmentId | AdminUserDetails | String? |
| order | QrValidationResult | MerchantOrder? |

Numeric fields must be mapped correctly:

- Prices and amounts: `double`
- Quantities and counts: `int`
- Boolean flags: `bool`

Dates and times are currently represented mostly as `String`. The backend team should agree on a consistent date/time format, preferably an ISO 8601 representation where appropriate.

# 8. Image Fields

The following fields represent image references or URLs in the current models:

- StudentProfile: `avatar`
- StudentOffer: `image`
- MerchantEstablishment: `logo`, `coverImage`
- MerchantOffer: `photo`
- MerchantOrder: `productPhoto`
- AdminMerchant: `photo`
- AdminOffer: `image`
- AdminOrder: `productImage`

The integration team must define whether these fields store download URLs or storage paths.

The actual image upload mechanism is not implemented in the current frontend audit.

# 9. Security-Sensitive Data

The following operations must not rely on frontend-only logic:

- Password and authentication handling
- Payment confirmation
- QR token generation and validation
- Order collection
- User role assignment
- Merchant approval
- Administrative permissions

The backend must validate these operations and enforce the appropriate access permissions.

# 10. Integration Checklist

- [ ] Confirm the backend database structure.
- [ ] Agree on collection/table names.
- [ ] Agree on document/record identifiers.
- [ ] Confirm all field names and data types.
- [ ] Confirm role identifiers.
- [ ] Standardize payment and order statuses.
- [ ] Standardize merchant validation statuses.
- [ ] Review nullable fields.
- [ ] Review all `fromJson()` and `toJson()` mappings.
- [ ] Define image storage and upload behavior.
- [ ] Verify authentication and permissions.
- [ ] Test all models with real backend data.

---

**Document status:** Frontend data models documented.  
**Backend schema:** To be confirmed by the integration team.  
**Next step:** Repository and Workspace integration mapping.