# Sellio React Native Mobile App Development Plan

Updated: 2026-06-28

## Decision

Continue developing the existing Expo/React Native application in `apps/mobile`.

Flutter development is paused and is not part of the active mobile scope. The existing Expo application must remain runnable throughout development.

## Product Direction

Build a buyer-first mobile application that combines:

- Public marketplace discovery across all seven Sellio verticals.
- Vertical-aware listing details and customer actions.
- Secure buyer authentication.
- Favorites and buyer activity management.
- Messaging and notifications.
- Profile and account settings.
- Web-assisted checkout and booking payment flows.

Seller and administrator functionality are excluded from the initial mobile release. Sellers will continue using the responsive seller portal.

## Current Baseline

The existing application already provides:

- Expo SDK 54 and React Native 0.81.
- Expo Router navigation.
- Home, favorites, messages, settings, login, and listing-detail screens.
- Secure token storage with `expo-secure-store`.
- Laravel Sanctum login and logout integration.
- Environment-based API configuration for emulator, simulator, web, physical phone, staging, and production URLs.
- A shared API client with Laravel-envelope normalization, bearer-token injection, validation-error extraction, unauthorized-session handling, timeouts, and clear network errors.
- Authenticated route guards for buyer-only tabs.
- Real API-backed marketplace discovery for all seven verticals.
- Real favorite status, create, remove, and card/detail toggle flows.
- Buyer activity statistics, orders, bookings, applications, inquiries, reviews, and record-detail drilldowns.
- Real conversations, paginated message history, optimistic sending, read states, typing, and Echo/Pusher integration.
- In-app notifications plus Expo push-token registration and backend delivery.
- Product cart management and a signed web-assisted checkout handoff with deep-link verification.
- Automated unit/component-state tests, Maestro smoke flows, EAS profiles, and production branding.

The implementation is feature-complete for the planned buyer scope. Release remains blocked until:

- The Expo project is initialized with its real EAS project ID and production Pusher/API environment values.
- Push delivery and realtime messaging are verified on signed Android and iOS builds.
- A signed Android App Bundle and iOS archive pass physical-device and payment-return QA.

## Phase 1: Application Foundation

### Objectives

Make API communication predictable on Android emulators, iOS simulators, physical devices, and production builds.

### Tasks

- [x] Replace hardcoded API hosts with environment-based configuration.
- [x] Document emulator, simulator, physical-device, staging, and production API URLs.
- [x] Create a shared mobile API client with:
  - JSON response normalization.
  - Sanctum bearer-token injection.
  - Validation-error extraction.
  - Unauthorized-session handling.
  - Request timeouts and clear network errors.
- [x] Introduce typed models for users, listings, pagination, favorites, conversations, and buyer activity.
- [x] Add shared loading, empty, offline, and error states.
- [x] Add authenticated route guards.
- [x] Stop silently replacing failed API requests with mock marketplace data.
- [x] Keep development fixtures explicitly separated from live API behavior.
- [x] Clean up remaining mojibake icons/glyphs in mobile source strings.

### Acceptance Criteria

- The app connects to Laravel from an Android emulator and a physical Android phone.
- Login persists after restarting the application.
- Expired or invalid sessions return the user to login cleanly.
- API errors are visible and actionable.
- TypeScript passes without errors.

## Phase 2: Marketplace Discovery

### Objectives

Replace the prototype home feed with a complete, API-backed marketplace experience.

### Tasks

- [x] Support all seven verticals:
  - Products
  - Properties
  - Vehicles
  - Events
  - Jobs
  - Services
  - Classifieds
- [x] Render listing cards with real images and vertical-aware metadata.
- [x] Extract reusable listing-card components shared by home, favorites, and activity where practical.
- [x] Add unified and vertical-specific browsing.
- [x] Add pull-to-refresh on marketplace discovery.
- [x] Add search, sorting, filters, and pagination/load-more controls.
- [x] Respect enabled/disabled backend modules.
- [x] Respect the buyer's selected location where supported.
- [x] Add basic image rendering and fallback visuals.
- [x] Add image loading failure handling and retry behavior.
- [x] Use vertical-specific listing endpoints for detail screens instead of probing unrelated endpoints.
- [x] Expand detail adapters with richer vertical-specific fields and customer actions.
  - [x] Render contract-backed detail facts and vertical-aware action labels for all seven verticals.
  - [x] Connect the vehicle detail action to a real, buyer-linked dealer inquiry form.
  - [x] Connect the classified detail action to a real, buyer-linked seller inquiry form.
  - [x] Connect the service detail action to a real package-based quote request.
  - [x] Connect the job detail action to a real cover-letter application form.
  - [x] Connect the product detail action to the buyer-owned cart.
  - [x] Connect for-sale property details to a buyer-linked agent inquiry.
  - [x] Connect event details to occurrence and ticket selection with real booking creation.
  - [x] Connect each action to its real buyer workflow and replace the temporary availability notice.
- [x] Add shareable listing links.

### Acceptance Criteria

- Every enabled vertical can be browsed from the mobile home screen.
- Cards display real API data and images.
- Empty results and API failures are distinguishable.
- Listing details render the correct fields and actions for their vertical.

## Phase 3: Authentication and Buyer Account

### Tasks

- [x] Add basic login validation and error presentation.
- [x] Add buyer registration.
- [x] Add forgot-password and reset-password flows.
- [x] Restore the stored authenticated buyer session on startup.
- [x] Refresh the authenticated buyer profile from the API on startup.
- [x] Add profile editing, avatar upload, and location selection.
- [x] Add password management.
- [x] Finish buyer terminology and remaining source-string encoding cleanup.
- [x] Prevent seller-only accounts from entering unsupported mobile workflows where appropriate.

### Acceptance Criteria

- A buyer can register, log in, restart the app, update their profile, change their password, and log out.
- Authentication state is consistent across every tab.

## Phase 4: Buyer Workspace

Reuse the established Laravel endpoints under `/api/dashboard/user` and align mobile response adapters with the working buyer web application.

### Tasks

- [x] Load favorites.
- [x] Manage favorites.
- [x] Add authenticated favorite creation endpoint.
- [x] Add authenticated listing favorite-status endpoint.
- [x] Add save-to-favorites action to listing details.
- [x] Add favorite/unfavorite toggle to listing details.
- [x] Add favorite/unfavorite toggles to listing cards.
- [x] Refresh favorites automatically when a listing is saved or removed from another screen.
- [x] Add buyer dashboard statistics.
- [x] Add orders.
- [x] Add property/event bookings and service appointments.
- [x] Add job applications.
- [x] Add vehicle inquiries.
- [x] Add service quotes.
- [x] Add classified inquiries.
- [x] Add record-specific detail screens.
- [x] Add buyer reviews.
- [x] Add focused automated coverage for buyer activity adapters.

### Acceptance Criteria

- Buyer activity shown in the mobile app matches the Laravel database and buyer web dashboard.
- Mutations update the interface immediately and remain correct after refresh.

## Phase 5: Messaging and Notifications

### Tasks

- [x] Replace the messages placeholder with real conversation data.
- [x] Add conversation detail and message sending.
- [x] Add read states, unread counts, pagination, and optimistic sending.
- [x] Support starting a conversation from relevant listings.
- [x] Add notifications with read, read-all, and delete actions.
- [x] Integrate the existing Laravel Echo/Pusher-compatible realtime contracts.
- [x] Add typing and connection indicators only after the basic message flow is reliable.
- [x] Add push-notification delivery after in-app notification behavior is verified.

### Acceptance Criteria

- Messages sent from mobile appear in the buyer/seller web applications and vice versa.
- Unread counters and notification states remain synchronized.

## Phase 6: Transactions and Customer Actions

### Tasks

- [x] Add product cart and checkout entry.
- [x] Add property inquiry, date selection, pricing, and booking entry.
- [x] Add vehicle inquiry.
- [x] Add event ticket selection and booking entry.
- [x] Add job application submission.
- [x] Add service consultation, quote, and appointment entry.
- [x] Add classified inquiry.
- [x] Implement secure web-assisted Stripe/PayPal checkout handoff and return verification.
- [x] Add deep links for listings, authentication returns, and payment returns.

### Acceptance Criteria

- Each vertical exposes only valid customer actions.
- Payment completion or cancellation returns the buyer to a clear, verified mobile state.

## Phase 7: Quality and Release

### Tasks

- [x] Add unit tests for adapters, validation, API errors, and auth storage.
- [x] Add component tests for important loading, empty, error, and authenticated states.
- [x] Add end-to-end tests for login, discovery, favorites, messaging, and transaction handoffs.
- [x] Review accessibility, keyboard handling, safe areas, and small-screen layouts.
- [x] Add production branding, icons, splash screens, bundle identifiers, and versioning.
- [x] Configure EAS development, preview, and production profiles.
- [x] Document Android and iOS setup and build commands.
- [ ] Produce and verify an Android App Bundle and iOS archive before advertising mobile support.
  - [x] Verify the production Android JavaScript/Hermes export.
  - [ ] Produce and install a signed Android App Bundle through EAS.
  - [ ] Produce and install an iOS archive through EAS or macOS.

## First Sprint

The first sprint will deliver the foundation and one complete real-data path.

### Sprint Tasks

- [x] Add environment-based API configuration that works on the currently connected physical phone.
- [x] Create the shared authenticated API client.
- [x] Create core listing and pagination types.
- [x] Remove implicit mock fallback behavior.
- [x] Normalize first-pass buyer-facing copy and remove the original broken encoding on implemented screens.
- [x] Finish cleanup of remaining mojibake icons/glyphs found after the first sprint.
- [x] Add Products to the category list.
- [x] Replace the home feed with real API data for all enabled verticals.
- [x] Render real listing images and vertical-aware card metadata.
- [x] Add visible retry and empty states.
- [x] Verify login and discovery against the local Laravel backend.
- [x] Run TypeScript and Android bundle verification.

### Sprint Completion Definition

The sprint is complete when the physical Android phone can connect to the local Laravel backend, authenticate, browse real records across every enabled vertical, open a correct listing detail, and receive clear feedback when the backend is unavailable.

## Implementation Principles

- Reuse working Laravel and buyer-dashboard contracts before adding backend endpoints.
- Keep public marketplace APIs separate from authenticated buyer-dashboard APIs.
- Use typed vertical adapters rather than broad dynamic field guessing.
- Never hide genuine API failures behind production mock data.
- Keep each phase runnable and demonstrable on a physical device.
- Do not advertise React Native mobile support publicly until signed release builds and core buyer workflows have been verified.
