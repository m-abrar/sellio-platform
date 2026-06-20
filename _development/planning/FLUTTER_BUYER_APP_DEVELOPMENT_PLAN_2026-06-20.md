# Sellio Flutter Buyer App Development Plan

Captured: 2026-06-20

## Decision

Build a buyer-first Flutter application for Android and iOS as Sellio's primary native mobile product.

The first Flutter release will combine:

- Public marketplace discovery across all seven verticals.
- Vertical-aware listing details and customer actions.
- Secure buyer authentication.
- The authenticated buyer workspace.
- Messaging and notifications.
- Web-assisted checkout and booking payment completion.
- Buyer profile, location, preferences, and reviews.

Seller-native functionality is explicitly excluded from version one. Sellers will continue using the responsive React seller portal until a separate seller mobile phase is approved.

## Commercial Objective

The mobile application should strengthen the CodeCanyon product rather than act as a decorative demo. Buyers must receive:

- Complete Flutter source code.
- Repeatable Android and iOS build instructions.
- Simple branding and API configuration.
- A working connection to the Laravel backend.
- A populated mobile demo.
- Documentation for authentication, deep links, push notifications, and payments.
- Clear boundaries between included services and credentials buyers must provide.

Recommended future listing language:

> Sellio — Multi-Vendor Marketplace Platform with Laravel, Next.js and Flutter Mobile App

Do not add Flutter to public sales copy until signed release builds and the documented buyer workflows have been verified.

## Relationship to the Existing Expo Prototype

The existing `apps/mobile` directory is an Expo/React Native prototype. It contains useful workflow research but is not a production release candidate.

Create the Flutter application in a separate directory:

```text
apps/mobile_flutter/
```

Keep `apps/mobile` unchanged during the Flutter foundation phase. It can be archived or removed only after the Flutter app passes authentication, discovery, and build gates. This preserves a working reference and avoids a destructive migration.

Reusable concepts from the Expo prototype:

- Buyer-first navigation.
- Secure bearer-token authentication.
- Unified discovery with vertical filters.
- Favorites, messages, settings, and listing-detail routes.

Do not port its hardcoded API hosts, mock records, mojibake labels, broad `any` mapping, or seller/partner wording.

## Version-One Scope

### Included

#### Public discovery

- Products
- Properties
- Vehicles
- Events
- Jobs
- Services
- Classifieds
- Unified home and featured content
- Search, filters, sorting, pagination, and pull-to-refresh
- Location-aware results using the buyer's selected `location_id`
- Listing sharing and deep links

#### Listing details and actions

- Product detail and cart/checkout entry
- Property detail, booking dates, calculated pricing, booking entry, and inquiry
- Vehicle detail and inquiry
- Event detail, ticket selection, and booking entry
- Job detail and application
- Service detail, consultation/quote/appointment entry
- Classified detail and inquiry
- Favorite/unfavorite
- Start conversation with an appropriate seller/provider

#### Buyer workspace

- Dashboard
- Favorites
- Orders and property/event bookings
- Job applications
- Vehicle inquiries
- Service appointments and quotes
- Classified inquiries
- Record-specific detail pages
- Reviews
- Messages
- Notifications
- Profile, avatar, location, password, and notification preferences

#### Platform capabilities

- Secure session storage
- Deep links
- Push notifications
- Web-assisted payment handoff and return verification
- Loading, empty, error, and offline states
- Accessibility and localization readiness
- Light/dark theme support if approved before UI implementation
- Android App Bundle and iOS archive builds

### Deferred

- Seller listing CRUD and seller dashboard
- Seller wallet, withdrawals, subscriptions, leads, and Media Studio
- Admin application
- Native Stripe/PayPal SDKs
- Offline mutation queue
- SMS delivery
- Background location tracking
- Native turn-by-turn maps
- TOTP/2FA until the backend flow is complete
- Replicating every Next.js storefront theme in Flutter
- Tablet-specific administration layouts

## Recommended Flutter Stack

Pin the current stable Flutter and Dart versions when implementation begins and record them in the mobile documentation.

| Concern | Recommended choice | Reason |
| --- | --- | --- |
| Navigation | `go_router` | Declarative routes, guards, and deep-link support |
| State and dependency injection | Riverpod | Testable feature state without global widget coupling |
| HTTP | Dio | Interceptors, cancellation, multipart uploads, and consistent errors |
| Models | Freezed plus `json_serializable` | Immutable typed models and explicit JSON contracts |
| Secure session | `flutter_secure_storage` | Keychain/Keystore-backed token storage |
| Local preferences | `shared_preferences` | Non-sensitive app settings only |
| Images | `cached_network_image` | Cache, loading, and fallback control |
| Forms | Flutter Form plus typed validators | Avoid unnecessary form abstraction initially |
| Deep links | `app_links` | Checkout, notification, and listing links |
| External/in-app browser | `url_launcher` or secure in-app browser package | Payment and web handoff |
| Push | Firebase Messaging | Android/iOS push transport |
| Local notifications | `flutter_local_notifications` | Foreground notification presentation |
| Realtime messaging | Existing Laravel Echo/Pusher-compatible transport | Match current backend contracts |
| Connectivity | `connectivity_plus` | Network awareness, not proof of internet availability |
| Crash reporting | Configurable Firebase Crashlytics or Sentry | Production diagnostics without hardwiring buyer credentials |
| Testing | `flutter_test`, integration tests, and mock HTTP adapters | Unit, widget, and end-to-end coverage |

All third-party packages must receive license, maintenance, and platform-support review before release packaging.

## Proposed Project Structure

```text
apps/mobile_flutter/
  android/
  ios/
  assets/
    branding/
    fonts/
    images/
  lib/
    app/
      app.dart
      bootstrap.dart
      router.dart
    core/
      config/
      errors/
      network/
      storage/
      theme/
      localization/
      widgets/
    features/
      auth/
      discovery/
      listings/
      favorites/
      activity/
      orders/
      bookings/
      applications/
      inquiries/
      services/
      reviews/
      messages/
      notifications/
      profile/
      checkout/
    shared/
      models/
      repositories/
      adapters/
  test/
  integration_test/
  config/
    development.json
    preview.json
    production.example.json
  pubspec.yaml
  analysis_options.yaml
  README.md
```

Each feature should separate API/data code, domain models, presentation state, and screens/widgets. Avoid a large global services folder containing unrelated business behavior.

## Configuration and White-Label Requirements

CodeCanyon buyers should not need to edit Dart source throughout the app to apply basic branding.

Provide documented configuration for:

- Application name
- Android application ID
- iOS bundle identifier
- API base URL
- Public storefront URL
- Deep-link scheme and universal/app-link domains
- Logo, launcher icon, adaptive icon, and splash screen
- Primary and secondary colors
- Default light/dark behavior
- Firebase configuration
- Push notification icon/channel
- Support, privacy, and terms URLs
- Optional analytics/crash-reporting enablement

Never ship Sellio production secrets, Firebase private credentials, signing keys, payment secrets, or real push credentials in the CodeCanyon package.

## Navigation Model

Use five primary tabs:

```text
Discover
Activity
Messages
Notifications
Account
```

Suggested routes:

```text
/
/login
/register
/forgot-password
/vertical/:type
/listing/:type/:slug
/favorites
/activity
/activity/:type/:id
/messages
/messages/:conversationId
/notifications
/reviews
/reviews/:id/edit
/profile/edit
/settings/notifications
/checkout/return
/booking/return
```

Do not create a permanent tab for each marketplace vertical. Discovery should use vertical filters, categories, search, and deep links.

## API Integration Strategy

### Base client

- Read the API URL from compile-time environment configuration.
- Send `Accept: application/json` consistently.
- Attach bearer tokens through one authentication interceptor.
- Translate 401 responses into a controlled session-expired flow.
- Normalize Laravel validation errors for native forms.
- Support request cancellation when screens or searches change.
- Apply bounded retries only to safe/idempotent requests.
- Record request IDs for support diagnostics without logging secrets.

### Typed contracts

Create explicit Dart models for:

- Authentication session and user
- Location
- Product
- Property
- Vehicle
- Event
- Job
- Service
- Classified
- Favorite
- Order
- Property/event booking
- Job application
- Vehicle/classified inquiry
- Service quote/appointment
- Review
- Conversation and message
- Notification and preferences

Do not force every vertical into one oversized listing model. Use a small shared listing summary interface plus vertical-specific detail models.

### Backend contract work

- Confirm consistent public list/detail envelopes and pagination.
- Provide normalized `primary_image_url`, `thumbnail_url`, formatted price, location, seller/provider, and allowed-action fields.
- Add authenticated detail endpoints where buyer APIs currently expose only lists.
- Return explicit allowed actions such as `can_cancel`, `can_delete`, `can_edit`, `can_review`, or `can_message`.
- Persist `location_id` and include the related location in user resources.
- Implement notification preference APIs.
- Add device-token registration, update, and revocation endpoints.
- Ensure payment return routes support mobile deep links without trusting client success flags.
- Add feature tests for every new or modified mobile contract.

## Authentication and Security

- Authenticate against Laravel Sanctum token endpoints.
- Store only the token and minimum session metadata in secure storage.
- Fetch the current user during session restoration rather than permanently trusting cached user JSON.
- Revoke the server token on logout where possible, then clear local state regardless of network outcome.
- Clear authenticated caches when the user logs out or changes accounts.
- Never store passwords, payment details, gateway secrets, or full sensitive responses.
- Mask tokens and personal data in logs and crash reports.
- Validate all deep-link parameters and re-fetch authorized records from the backend.
- Apply certificate/transport hardening appropriate to production without making buyer setup brittle.
- Support account deletion entry points if required by target app-store policy and backend capability.

## Payments and Checkout

Use web-assisted payments for version one.

### Flow

1. Flutter creates or prepares the order/booking through the authenticated API.
2. The Laravel backend returns a trusted checkout or payment URL.
3. Flutter opens the payment flow in a secure browser context.
4. Stripe/PayPal completes authentication and server-side confirmation.
5. Laravel redirects to a configured mobile deep link.
6. Flutter receives only the record type and identifier.
7. Flutter queries Laravel for the authoritative payment/booking status.
8. The native confirmation screen displays the verified result.

Never mark a payment successful solely because the deep link contains `success=true`.

## Push Notifications

### Initial notification types

- New message
- Booking confirmed, cancelled, or updated
- Order status updated
- Job application status updated
- Appointment confirmed or reminded
- Quote/inquiry response
- Review request
- System/admin announcement
- Promotional notification only when explicitly opted in

### Required behavior

- Register a token per device and authenticated user.
- Refresh changed Firebase tokens.
- Revoke/disable the device token on logout.
- Respect per-type and per-channel notification preferences.
- Present foreground notifications safely.
- Deep-link taps to the correct authorized record.
- Avoid placing sensitive message contents in lock-screen payloads by default.

## Design Direction

Create one coherent Sellio mobile design system rather than reproducing dozens of storefront themes.

### Design tokens

- Color roles
- Typography scale
- Spacing scale
- Radius scale
- Elevation/shadows
- Borders and dividers
- Motion duration/easing
- Success, warning, danger, and information states

### Reusable components

- App bars and tab shell
- Listing cards
- Vertical chips
- Search and filter sheets
- Image gallery
- Price/status blocks
- Primary, secondary, and destructive buttons
- Form fields and validation summaries
- Skeletons
- Empty/error/offline states
- Confirmation bottom sheets
- Toast/banner feedback
- Avatar and media picker
- Timeline and activity cards
- Message bubbles and composer

The UI should feel premium and buyer-friendly, not like a compressed administration dashboard.

## Development Phases and Estimates

The estimates assume one experienced Flutter developer working full-time with timely backend support.

### Phase 0 — Contract and product freeze: 1 week

- [ ] Confirm version-one feature boundary.
- [ ] Map buyer web behavior to mobile screens.
- [ ] Resolve pending buyer portal detail-page rules.
- [ ] Inventory public and buyer API contracts.
- [ ] Define checkout and deep-link behavior.
- [ ] Approve navigation and wireframes.

**Exit gate:** every screen has a real API contract or a scheduled backend task.

### Phase 1 — Flutter foundation: 2 weeks

- [ ] Create `apps/mobile_flutter` on the stable Flutter channel.
- [ ] Configure linting, environments, routing, Riverpod, Dio, model generation, and secure storage.
- [ ] Implement design tokens and core UI primitives.
- [ ] Implement authentication, session restoration, logout, and route guards.
- [ ] Configure development and preview API targets.
- [ ] Establish unit/widget test conventions.

**Exit gate:** authenticated and guest shells work on Android and iOS against a non-local preview API.

### Phase 2 — Discovery and seven verticals: 3-4 weeks

- [ ] Unified home and vertical navigation.
- [ ] Search, filters, sorting, pagination, refresh, and location context.
- [ ] Listing summaries for all verticals.
- [ ] Seven typed detail experiences.
- [ ] Favorite and share actions.
- [ ] Contextual purchase, booking, application, inquiry, quote, and message actions.

**Exit gate:** every vertical works from list to detail with real API data and honest failure states.

### Phase 3 — Buyer workspace: 3 weeks

- [ ] Dashboard with loading-safe statistics.
- [ ] Favorites.
- [ ] Unified activity hub.
- [ ] Orders and booking details.
- [ ] Application, inquiry, appointment, and quote details.
- [ ] Reusable premium confirmation sheets and allowed actions.
- [ ] Reviews.
- [ ] Profile, avatar, location, password, and preference screens.

**Exit gate:** native buyer records and actions match the finalized buyer portal behavior.

### Phase 4 — Messaging, notifications, and payments: 3 weeks

- [ ] Conversation list and message threads.
- [ ] Send, pagination, read status, typing, and realtime updates.
- [ ] In-app notifications.
- [ ] Firebase push registration and deep-link routing.
- [ ] Web-assisted product checkout.
- [ ] Property/event booking payment handoff.
- [ ] Server-verified return and native confirmation screens.

**Exit gate:** a buyer can communicate and complete at least one verified sandbox transaction journey on both platforms.

### Phase 5 — Quality, accessibility, and resilience: 2 weeks

- [ ] Loading, empty, error, offline, timeout, and expired-session passes.
- [ ] Accessibility labels, semantics, contrast, dynamic text, focus, and touch targets.
- [ ] Keyboard and form behavior.
- [ ] Small/large phone and tablet checks.
- [ ] Image caching and long-list performance.
- [ ] Crash reporting and privacy-safe diagnostics.
- [ ] Localization readiness and copy cleanup.

**Exit gate:** no critical accessibility, navigation, authentication, data-loss, or crash defects remain.

### Phase 6 — Packaging and release: 2-3 weeks

- [ ] Finalize package/bundle identifiers and signing.
- [ ] Configure app links/universal links.
- [ ] Produce Android App Bundle and iOS archive.
- [ ] Run closed Google Play and TestFlight testing.
- [ ] Complete store privacy, permissions, screenshots, descriptions, and support URLs.
- [ ] Write buyer-facing Flutter setup and branding documentation.
- [ ] Prepare clean CodeCanyon source package without credentials or build caches.
- [ ] Record mobile demo footage for the sales campaign.

**Exit gate:** signed builds and the packaged source pass a clean-machine installation/build rehearsal.

## Overall Timeline

| Delivery target | Estimate |
| --- | ---: |
| Functional internal MVP | 8-10 weeks |
| Production-ready feature complete app | 14-16 weeks |
| Store and CodeCanyon-ready package | 16-19 weeks |

Two experienced developers can parallelize backend contracts, Flutter features, and QA, but coordination and integration prevent the schedule from scaling linearly. A realistic two-developer target is approximately 11-14 weeks for the complete package.

## Testing Strategy

### Unit tests

- JSON parsing and adapters
- Currency/date/status formatting
- Validators
- Authentication/session state
- Allowed-action rules
- Payment return parsing
- Notification routing

### Widget tests

- Login and validation
- Search/filter behavior
- Listing cards and details
- Loading/error/empty states
- Activity details and confirmations
- Review forms
- Message composer
- Profile and preferences

### Integration tests

- Login, restore session, and logout
- Browse each vertical and open details
- Favorite/unfavorite
- Update profile location
- Open an activity record and perform allowed action
- Send/read a message
- Receive/open notification
- Complete checkout handoff and verified return

### Device matrix

- Current and minimum supported Android versions
- Current and minimum supported iOS versions
- Small and large phones
- At least one tablet layout smoke test
- Slow network, offline transition, expired token, denied notification permission, and deep-link cold start

## CodeCanyon Delivery Package

Include:

- Flutter source excluding caches and secrets
- Android and iOS platform projects
- Environment/configuration examples
- Branding guide
- Laravel API connection guide
- Firebase/push guide
- Deep-link setup guide
- Payment-return setup guide
- Build and signing guide
- Troubleshooting guide
- Version compatibility matrix
- Changelog
- Demo credentials and URLs
- Dependency/license inventory

Do not include:

- `.env` files containing real values
- Keystores, provisioning profiles, or certificates
- Firebase service-account keys
- Real `google-services.json` or `GoogleService-Info.plist` unless they belong only to a disposable documented demo and redistribution is explicitly safe
- Build directories, IDE caches, or local absolute paths
- Production API/payment secrets

## Risks and Controls

| Risk | Control |
| --- | --- |
| Mobile scope expands into seller workflows | Keep seller features outside the version-one acceptance criteria |
| Backend list payloads cannot support detail screens | Freeze and test API contracts in Phase 0 |
| Seven verticals create duplicated UI logic | Share summaries/actions while retaining typed detail models |
| Payment redirects produce false success | Re-query authoritative backend status after deep-link return |
| Push setup becomes buyer-specific and hard to configure | Provide documented replaceable Firebase configuration |
| CodeCanyon buyers struggle to rebrand/build | Test documentation on a clean machine and centralize configuration |
| Flutter work delays Sellio web launch | Develop mobile after or alongside web release without blocking core submission |
| App-store policies change | Recheck official policies during Phase 6 rather than freezing old assumptions now |

## Definition of Done

The Flutter buyer application is complete only when:

- All seven verticals use live Laravel data.
- No production screen falls back to mock records.
- Authentication and session expiry are secure and predictable.
- Buyer activity has native list and detail experiences.
- Messages and notifications work with real accounts.
- At least one commerce and one booking payment journey are verified end to end.
- Android and iOS signed candidates pass the device matrix.
- Deep links work for cold and warm app starts.
- Accessibility and error/offline states have been reviewed.
- The source package builds on a clean machine using its documentation.
- No secrets, personal data, debug output, or broken assets ship.
- CodeCanyon marketing claims match the demonstrated application exactly.

## Recommended Next Action

Complete and stabilize the buyer portal contracts in `BUYER_PORTAL_TASKS.md`, then execute Phase 0 as a short API-and-wireframe sprint. Do not begin bulk Flutter screen implementation until record-detail behavior, allowed actions, notification preferences, and payment return contracts are explicit.
