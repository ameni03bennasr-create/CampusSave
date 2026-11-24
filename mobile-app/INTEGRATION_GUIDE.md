# CampusSave Mobile – Integration Guide

**Version:** 1.0  
**Status:** Frontend prepared – Backend integration pending  
**Technology:** Flutter / Dart

## 1. Project Overview

CampusSave is a mobile application connecting students, merchants and administrators.

The application contains three main workspaces:

- **Student:** Browse restaurants and offers, manage orders, payments and notifications.
- **Merchant:** Manage establishment information, offers, orders and QR code validation.
- **Admin:** Manage users, merchants, offers, orders and administrative activities.

The current application uses mock repositories and local state. Backend and Firebase integration must be implemented separately.

## 2. Architecture Overview

The application follows this general structure:

`Screen → Workspace → Repository → Data Source`

- **Screens:** Display the user interface and handle user interactions.
- **Workspaces:** Manage application state and business operations.
- **Repositories:** Define the contracts used to load and manage data.
- **Models:** Represent application data.
- **Mock Data:** Provide temporary data for frontend testing.

## 3. Important Project Directories

| Directory | Responsibility |
|---|---|
| `lib/screens/` | Application screens |
| `lib/widgets/` | Reusable UI components |
| `lib/data/models/` | Data models |
| `lib/data/repositories/` | Repository interfaces and implementations |
| `lib/data/mock/` | Temporary mock data |
| `lib/state/` | Application state and workspaces |
| `lib/routing/` | Navigation and route protection |
| `lib/core/` | Shared utilities, themes and configuration |

## 4. Repository Layer

The repository interfaces are defined in:

`lib/data/repositories/repositories.dart`

Current interfaces:

- `AuthRepository`
- `StudentRepository`
- `MerchantRepository`
- `AdminRepository`

They currently provide authentication methods and data-loading methods.

Mock implementations are used by default.

**Integration note:** The repository contracts must be reviewed and extended where necessary to support operations such as creating orders, updating offers, managing profiles and administrative actions.

The final implementation depends on the backend architecture selected by the integration team.

## 5. Application Initialization

Main files:

- `lib/main.dart`
- `lib/app.dart`
- `lib/state/app_scope.dart`

`AppRoot` initializes the repositories and workspaces.

By default, it uses:

- `MockAuthRepository`
- `MockStudentRepository`
- `MockMerchantRepository`
- `MockAdminRepository`

It also initializes the workspaces through `bootstrap()`.

**Integration note:** Replace the mock implementations with the real implementations when the backend is ready. Review the current bootstrap behavior because it loads all three workspaces before role-specific authentication.

## 6. Authentication

Authentication logic is managed by:

`lib/state/auth_controller.dart`

Current operations:

- Sign in
- Student registration
- Merchant account request
- Sign out

**Current limitations:**

- Authentication is simulated by mock implementations.
- Session persistence is not implemented.
- The role is currently supplied by the login interface.
- The merchant registration flow displays a pending-validation message, while the current local controller assigns the merchant role immediately.

**Integration requirements:**

- Connect authentication to the real authentication provider.
- Retrieve the authenticated user's role from trusted backend data.
- Implement session persistence and authentication-state handling.
- Define the correct pending merchant account flow.

## 7. Student Workspace

File:

`lib/state/student_workspace.dart`

The workspace currently manages:

- Student profile
- Restaurants
- Offers
- Orders
- Notifications

**Local operations requiring integration:**

- Creating orders
- Confirming payments
- Generating QR tokens
- Updating profile information
- Marking notifications as read

**Important:** Payment confirmation and QR token generation must be handled or verified by trusted backend services. The frontend must not be the authority for payment status.

## 8. Merchant Workspace

File:

`lib/state/merchant_workspace.dart`

The workspace currently manages:

- Merchant profile
- Establishment information
- Offers
- Orders
- Notifications

**Local operations requiring integration:**

- Adding, updating and deleting offers
- Updating establishment information
- Updating merchant profile
- Validating QR codes
- Marking orders as collected
- Managing notification read status

**Important:** QR validation must be verified by the backend to prevent invalid or repeated collection.

## 9. Admin Workspace

File:

`lib/state/admin_workspace.dart`

The workspace currently manages:

- Admin profile
- Users
- Merchants
- Offers
- Orders
- Activities

**Local operations requiring integration:**

- Changing user status
- Changing merchant account status
- Approving or rejecting merchant requests
- Updating admin profile
- Recording administrative activities

**Important:** Administrative permissions and sensitive actions must be enforced by the backend, not only by frontend route protection.

## 10. Models and Data Mapping

Models are located in:

`lib/data/models/`

Main model files:

- `student_models.dart`
- `merchant_models.dart`
- `admin_models.dart`
- `user_role.dart`

Several models already provide `fromJson()` and `toJson()` methods.

**Integration requirements:**

- Compare model fields with the backend data structure.
- Verify field names and data types.
- Check nullable fields and default values.
- Agree on status values and role identifiers.
- Test JSON serialization and deserialization.

Some models accept camelCase and snake_case fields. The final mapping must follow the actual backend contract.

## 11. Image Handling

The application currently supports displaying local assets and network images through:

`lib/widgets/safe_image.dart`

However, a complete image selection and upload mechanism has not been identified.

The integration team should define:

- Image storage provider
- Upload and update process
- Image URL persistence
- Access permissions
- File size and format restrictions

## 12. Security and Authorization

Frontend route protection is implemented in:

`lib/routing/app_router.dart`

This protects navigation based on the current application role.

However, frontend protection is not sufficient for security.

The backend must enforce:

- User authentication
- Role-based permissions
- Access to user-specific data
- Merchant data ownership
- Admin permissions
- Payment verification
- QR code validation

## 13. Example HTTP Repository

The project contains:

`lib/data/repositories/http_repositories.dart.example`

This file is an example template only.

It contains placeholder endpoints and unimplemented methods. It is not an active backend integration.

It should only be used if the integration team chooses a REST API architecture. It is not required for a Firebase SDK implementation.

## 14. Integration Checklist

### Authentication
- [ ] Connect real authentication.
- [ ] Implement session persistence.
- [ ] Retrieve user roles from trusted data.
- [ ] Handle pending merchant accounts.
- [ ] Implement logout and session expiration.

### Student
- [ ] Load student profile.
- [ ] Load restaurants and offers.
- [ ] Create and retrieve orders.
- [ ] Integrate payment verification.
- [ ] Generate and verify QR tokens.
- [ ] Update profile and notifications.

### Merchant
- [ ] Load merchant profile and establishment.
- [ ] Create, update and delete offers.
- [ ] Retrieve merchant orders.
- [ ] Validate QR codes securely.
- [ ] Update collected order status.
- [ ] Manage notifications.

### Admin
- [ ] Load users and merchants.
- [ ] Approve or reject merchant requests.
- [ ] Manage user and merchant status.
- [ ] Manage offers and orders.
- [ ] Retrieve administrative activities.

### General
- [ ] Agree on backend data structures.
- [ ] Review model mappings.
- [ ] Configure image storage.
- [ ] Enforce backend security rules.
- [ ] Replace mock repositories.
- [ ] Test all three user roles.
- [ ] Verify error handling and loading states.

## 15. Frontend Verification

The following commands were successfully executed during frontend verification:

```bash
flutter analyze
```

Result: No issues found.

```bash
flutter build apk --debug
```

Result: Debug APK generated successfully.

These results confirm that the current frontend passes the checks performed at that time. They do not confirm backend integration.

## 16. Important Notes for the Integration Team

1. The current mock repositories must remain available for frontend testing until real repositories are ready.
2. Do not confuse local workspace operations with persisted backend operations.
3. Review repository contracts before implementing remote data access.
4. Keep the existing UI and navigation behavior unless a technical requirement makes a change necessary.
5. Agree on backend field names, role values and status values before connecting the models.
6. Never trust frontend-only payment confirmation, QR validation or administrative permissions.

---

**Project handoff status:** Frontend implementation prepared for backend integration.  
**Backend/Firebase implementation:** Assigned to the integration team.