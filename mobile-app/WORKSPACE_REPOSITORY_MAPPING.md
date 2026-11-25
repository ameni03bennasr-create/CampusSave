# CampusSave Mobile – Workspace & Repository Mapping

**Version:** 1.0  
**Scope:** Student, Merchant and Admin Workspaces  
**Status:** Frontend architecture documented – Backend integration pending

---

# 1. Purpose

This document explains how the CampusSave Flutter frontend connects its Screens, Workspaces and Repository interfaces.

It helps the backend integration team identify:

- Which screens use each workspace.
- Which repositories provide the initial data.
- Which operations are currently local.
- Which operations require backend implementation.
- Where real-time backend integration must be connected.

**Important:** This document describes the existing frontend architecture. It does not implement Firebase, API services or backend logic.

# 2. Application Architecture

The application follows this architecture:

`Screen → Workspace → Repository Interface → Data Source`

### Screen

Displays the user interface and forwards user actions to the corresponding workspace.

### Workspace

Manages the state and business operations of a specific user area.

### Repository Interface

Defines the data operations expected from the data layer.

### Data Source

Provides the actual data, currently through mock repositories.

In the future, the integration team can provide Firebase or API implementations without rewriting the entire UI.

# 3. Application Initialization

Main files:

- `lib/main.dart`
- `lib/app.dart`
- `lib/state/app_scope.dart`

Current initialization flow:

1. `main.dart` creates the application root.
2. The application uses mock repositories by default.
3. `AppRoot.bootstrap()` initializes the workspaces.
4. `AppScope` exposes the application state.
5. `CampusSaveApp` starts the application and router.

### Important integration note

`AppRoot` accepts repository dependencies and defaults to mock implementations.

This allows the integration team to inject real repository implementations later.

Currently, `bootstrap()` loads Student, Merchant and Admin workspaces concurrently.

The integration team should review this behavior and consider loading only the data authorized for the authenticated user's role.

# 4. Authentication Workspace

Main files:

- `lib/state/auth_controller.dart`
- `lib/data/repositories/repositories.dart`
- Authentication screens under `lib/screens/auth/`

### Repository interface

`AuthRepository`

Current operations:

| Operation | Purpose |
|---|---|
| signIn | Authenticate an existing user |
| registerStudent | Register a student |
| requestMerchantAccount | Submit a merchant registration request |
| signOut | End the current session |

### Current frontend behavior

- Authentication is currently handled through mock/local logic.
- The role is supplied by the login interface.
- The session is stored in memory.
- No persistent authentication session or authentication state stream is implemented.

### Required backend integration

- Real authentication.
- Secure password handling.
- Persistent session management.
- Authenticated user profile retrieval.
- Backend role verification.
- Student registration.
- Merchant registration request.
- Sign-out and session expiration handling.

### Merchant registration flow to review

The current controller immediately assigns the merchant role after a merchant registration request.

However, the UI describes the account as awaiting administrator approval.

The integration team should align the backend response, pending approval state and navigation behavior.

# 5. Student Workspace

Main file:

`lib/state/student_workspace.dart`

### Repository interface

`StudentRepository`

Current loading operations:

| Repository operation | Data |
|---|---|
| loadProfile | StudentProfile |
| loadRestaurants | Restaurant list |
| loadOffers | StudentOffer list |
| loadOrders | StudentOrder list |
| loadNotifications | StudentNotification list |

### Student workspace operations

| Operation | Current behavior | Backend requirement |
|---|---|---|
| Load profile | Repository | Real student profile |
| Load restaurants | Repository | Real restaurant data |
| Load offers | Repository | Real offers and stock |
| Load orders | Repository | Real student orders |
| Load notifications | Repository | Real notifications |
| Create pending order | Local state | Create reservation |
| Confirm payment | Local status update | Trusted payment confirmation |
| Generate QR token | Local operation | Secure server-side token |
| Mark notification as read | Local state | Persist read status |
| Update profile | Local state | Persist profile changes |
| Apply registration | Local operation | Confirm registration persistence |

### Important payment and QR requirements

The frontend must never be the authority for payment confirmation.

The backend should:

1. Verify the payment result.
2. Update the order payment status.
3. Generate or authorize a secure QR token.
4. Make the token available to the student.
5. Ensure the token cannot be reused after successful collection.

# 6. Merchant Workspace

Main file:

`lib/state/merchant_workspace.dart`

### Repository interface

`MerchantRepository`

Current loading operations:

| Repository operation | Data |
|---|---|
| loadProfile | MerchantProfile |
| loadEstablishment | MerchantEstablishment |
| loadOffers | MerchantOffer list |
| loadOrders | MerchantOrder list |
| loadNotifications | MerchantNotification list |

### Merchant workspace operations

| Operation | Current behavior | Backend requirement |
|---|---|---|
| Load profile | Repository | Real merchant profile |
| Load establishment | Repository | Real establishment data |
| Load offers | Repository | Real offers |
| Load orders | Repository | Real orders |
| Load notifications | Repository | Real notifications |
| Add offer | Local state | Create offer |
| Update offer | Local state | Update offer |
| Delete offer | Local state | Delete or archive offer |
| Validate QR code | Local validation | Server-side verification |
| Collect order | Local status update | Atomic collection operation |
| Update profile | Local state | Persist profile |
| Update establishment | Local state | Persist establishment |
| Mark notification as read | Local state | Persist read status |

### Important QR validation requirements

The current frontend can validate QR information against local orders.

This is only suitable for demonstration.

The backend must:

- Verify that the order exists.
- Verify that the QR token is valid.
- Confirm that payment has succeeded.
- Check that the order has not already been collected.
- Update the collection status atomically.
- Prevent duplicate collection and QR replay.

# 7. Admin Workspace

Main file:

`lib/state/admin_workspace.dart`

### Repository interface

`AdminRepository`

Current loading operations:

| Repository operation | Data |
|---|---|
| loadProfile | AdminProfile |
| loadUsers | AdminUser list |
| loadMerchants | AdminMerchant list |
| loadOffers | AdminOffer list |
| loadOrders | AdminOrder list |
| loadActivities | AdminActivity list |

### Admin workspace operations

| Operation | Current behavior | Backend requirement |
|---|---|---|
| Load profile | Repository | Real administrator profile |
| Load users | Repository | Real users |
| Load merchants | Repository | Real merchant accounts |
| Load offers | Repository | Real offers |
| Load orders | Repository | Real orders |
| Load activities | Repository | Backend activity log |
| Toggle user status | Local state | Authorized account status update |
| Toggle merchant account | Local state | Authorized account status update |
| Decide merchant request | Local state | Approve or reject request |
| Update profile | Local state | Persist administrator profile |
| Log activity | Local state | Persist audit event |

### Important administrator requirements

Administrator operations must be protected by backend authorization.

The frontend route guards are not sufficient security controls.

The backend must verify the administrator's permissions before allowing sensitive actions.

# 8. Repository Interfaces

Source:

`lib/data/repositories/repositories.dart`

Current interfaces:

| Interface | Main responsibility |
|---|---|
| AuthRepository | Authentication and registration |
| StudentRepository | Student data |
| MerchantRepository | Merchant data |
| AdminRepository | Administration data |

Current mock implementations are used for demonstration and UI testing.

The integration team should preserve these interfaces where possible and introduce real implementations behind them.

### Important architecture note

The current repository interfaces mainly define loading and authentication operations.

Several workspace actions do not yet have corresponding repository methods.

The integration team should agree on the necessary mutations and add them to the appropriate repository interfaces.

Examples:

- Create and update student orders.
- Confirm payment status.
- Mark orders as collected.
- Add, update and delete merchant offers.
- Update user account status.
- Approve or reject merchant requests.
- Persist notification read status.
- Retrieve administrative activity logs.

# 9. Mock Data and Demo Behavior

Main mock data source:

`lib/data/mock/mock_data.dart`

Mock repositories and mock data are currently used to:

- Display sample users.
- Display sample restaurants and offers.
- Demonstrate student orders.
- Demonstrate merchant operations.
- Demonstrate administrator dashboards.
- Test UI states without a backend.

**Recommendation:** Keep mock implementations available until real repositories are fully tested.

Do not remove mock data before confirming that the replacement data source works.

# 10. Integration Priorities

Recommended integration order:

## Phase 1 – Authentication

- [ ] Connect real authentication.
- [ ] Retrieve authenticated user profile.
- [ ] Verify user role.
- [ ] Implement persistent sessions.
- [ ] Align merchant approval flow.

## Phase 2 – Student

- [ ] Connect student profile.
- [ ] Connect restaurants.
- [ ] Connect offers.
- [ ] Connect orders.
- [ ] Connect notifications.
- [ ] Implement reservation persistence.
- [ ] Implement trusted payment confirmation.
- [ ] Implement secure QR generation.

## Phase 3 – Merchant

- [ ] Connect merchant profile.
- [ ] Connect establishment information.
- [ ] Connect offers.
- [ ] Implement offer CRUD operations.
- [ ] Connect merchant orders.
- [ ] Implement server-side QR validation.
- [ ] Implement secure order collection.
- [ ] Connect notifications.

## Phase 4 – Admin

- [ ] Connect administrator profile.
- [ ] Connect users.
- [ ] Connect merchant requests.
- [ ] Implement merchant approval and rejection.
- [ ] Connect offers and orders.
- [ ] Implement account status management.
- [ ] Connect administrative activity logs.

## Phase 5 – Testing

- [ ] Test each role independently.
- [ ] Test unauthorized access.
- [ ] Test empty data states.
- [ ] Test loading and error states.
- [ ] Test network failures.
- [ ] Test payment and QR security.
- [ ] Verify that changes persist after restarting the app.

# 11. Frontend Verification

The frontend was previously verified with:

```bash
flutter analyze
```

Result:

`No issues found.`

Debug APK build:

```bash
flutter build apk --debug
```

Result:

`Build succeeded.`

These checks confirm frontend static analysis and debug build status at the time of verification. They do not confirm backend integration.

# 12. Final Handoff

The frontend team has prepared:

- UI screens and navigation.
- Student, Merchant and Admin workspaces.
- Repository interfaces.
- Data models and JSON mapping.
- Mock repositories and demo data.
- Integration documentation.

The backend integration team is responsible for:

- Firebase or API configuration.
- Authentication and authorization.
- Database structure.
- Real repository implementations.
- Storage and image uploads.
- Payment verification.
- QR generation and validation.
- Secure data persistence.
- Backend testing.

**Final status:** Frontend architecture and integration requirements documented. Real backend integration remains pending.

