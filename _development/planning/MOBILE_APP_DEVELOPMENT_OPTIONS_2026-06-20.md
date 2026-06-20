# Sellio Mobile App Development Options and Delivery Plan

Captured: 2026-06-20

## Purpose

This document defines practical options for turning the existing `apps/mobile` Expo prototype into a production mobile product. It supplements the older `mobile_app_plan.md`; it does not replace that historical blueprint.

The central product decision is not whether to use React Native or Flutter. Sellio already has a useful Expo/React Native foundation. The important decision is which users and workflows belong in the first shippable application.

## Current Repository Reality

The current app is an early prototype, not a release candidate.

### What already exists

- Expo SDK 54, React Native 0.81, React 19, and Expo Router.
- File-based routes for login, discovery, favorites, messages, settings, and listing detail.
- SecureStore-backed bearer-token persistence.
- Public API experiments for properties, vehicles, events, services, jobs, and classifieds.
- An existing shared `@sellio/api-client` package and `@sellio/types` package elsewhere in the monorepo.
- A substantial authenticated buyer API under `/api/dashboard/user`.

### Gaps that must be treated as real work

- API URLs are hardcoded to `127.0.0.1` or Android emulator host `10.0.2.2`.
- Discovery and listing detail silently fall back to hardcoded mock records.
- Products are missing from the mobile category list.
- Several icons and labels contain broken encoding/mojibake.
- Favorites, messages, and settings are mostly static shells.
- Listing results use broad `any` mappings instead of stable typed adapters.
- The app does not yet share the monorepo API client.
- There is no pagination, durable cache, offline/error strategy, deep linking, push notification support, analytics, crash reporting, or EAS build configuration.
- Checkout, bookings, applications, inquiries, reviews, and profile editing are incomplete.
- Current copy inconsistently suggests both partner and buyer access without providing a real role-aware experience.
- App identifiers, signing, store metadata, privacy disclosures, and release automation are not configured.

## Product Options

### Option A — Buyer-First Marketplace App

One customer application containing public discovery plus the authenticated buyer workspace.

**Includes**

- Browse/search all seven verticals.
- Listing details, favorites, and sharing.
- Buyer login and profile.
- Orders/bookings, job applications, vehicle inquiries, service quotes/appointments, classifieds inquiries, reviews, notifications, and messaging.
- Web-assisted checkout/payment handoff for the first release.

**Advantages**

- Matches the existing prototype and buyer API.
- Smallest coherent app-store product.
- Reuses the buyer portal's established workflows.
- Creates a useful CodeCanyon differentiator without delaying the Laravel launch excessively.
- Leaves seller complexity outside the first release.

**Trade-offs**

- Sellers continue using the responsive seller web portal initially.
- A later seller application will require its own information architecture.

**Relative effort:** 1.0x

**Recommendation:** Build this first.

### Option B — One Role-Aware Buyer and Seller App

One binary switches navigation and features according to the authenticated role.

**Advantages**

- One app-store listing and one release pipeline.
- Convenient for small marketplace operators whose users may buy and sell.
- Shared authentication, messaging, notifications, and design system.

**Trade-offs**

- Navigation becomes substantially more complex.
- Seller listing forms, media workflows, subscription quotas, wallet, withdrawals, leads, and seven vertical CRUD systems expand the first-release scope dramatically.
- Role switching, permission gates, and test coverage become critical.
- A single app can feel crowded and less focused.

**Relative effort:** approximately 1.7x the buyer-first application.

**Recommendation:** Do not choose this for the first production release. Reconsider only if a combined buyer/seller app is a firm commercial requirement.

### Option C — Separate Buyer and Seller Applications

Build a polished consumer app first, then a separate seller operations app on shared mobile packages.

**Advantages**

- Best user experience and clearest app-store positioning.
- Seller application can prioritize operational workflows rather than discovery.
- Independent release cadence, permissions, onboarding, and notifications.
- Strongest long-term architecture for a mature marketplace suite.

**Trade-offs**

- Two app-store listings, signing setups, review processes, and release pipelines.
- Shared code must be deliberately extracted to avoid duplication.
- Highest maintenance cost.

**Relative effort:** approximately 2.0-2.3x across both completed apps.

**Recommendation:** Best long-term destination after Option A proves the mobile foundation.

### Option D — PWA or WebView Wrapper

Package the existing web portals as an installable PWA or thin native wrapper.

**Advantages**

- Fastest route to an installable experience.
- Maximum reuse of current web screens.

**Trade-offs**

- Weaker native navigation, performance, offline behavior, gestures, and push integration.
- App-store review and perceived product quality may be less predictable for a thin wrapper.
- Does not make good use of the existing Expo prototype.

**Recommendation:** Keep a PWA as a browser convenience, not as Sellio's primary mobile product.

## Recommended Product Direction

Build **Option A now**, while structuring shared mobile code so **Option C** remains easy later.

The initial product should be named and described as a buyer/customer marketplace application. Remove seller/partner wording from the mobile login, favorites, messages, and settings UI until a genuine seller mobile experience exists.

### Recommended first-release boundary

**Ship**

- Guest marketplace discovery.
- All seven public verticals.
- Typed listing details and contextual actions.
- Buyer authentication and secure session restoration.
- Favorites, messages, notifications, and reviews.
- Unified activity hub with record-specific detail screens.
- Profile editing, location selection, and notification preferences.
- Deep links and web-assisted payment/checkout completion.
- Android and iOS EAS builds.

**Defer**

- Native seller listing CRUD.
- Seller Media Studio.
- Seller subscriptions, wallet, and withdrawals.
- Native payment SDKs.
- Offline mutation queues.
- SMS notifications.
- Native maps and background location.
- TOTP/2FA until the backend feature is complete.
- Full theme replication from the Next.js storefront.

## Recommended Technical Architecture

### Keep Expo and React Native

Retain Expo SDK 54 and Expo Router. A Flutter rewrite would discard working React knowledge, navigation, authentication, and monorepo TypeScript packages without solving a product problem.

### Proposed application layers

```text
apps/mobile/
  app/                    Expo Router screens and layouts
  src/
    api/                  Mobile API configuration and endpoint adapters
    auth/                 Session, role gate, and secure token lifecycle
    components/           Reusable native UI primitives
    features/             Vertical and buyer-domain feature modules
    hooks/                Query and platform hooks
    theme/                Colors, typography, spacing, radius, shadows
    utils/                Formatting, validation, deep links
  assets/                 App icons, splash art, bundled fallbacks
  app.config.ts           Environment-aware Expo configuration
  eas.json                Preview and production build profiles
```

### Data and state choices

- Use `EXPO_PUBLIC_API_URL` with development, preview, and production profiles.
- Add a mobile-safe entry point to `@sellio/api-client`, or create a thin mobile client that reuses `@sellio/types` while the browser-specific defaults are removed.
- Use TanStack Query for server state, pagination, caching, invalidation, and retries.
- Keep authentication/session state in a small context or lightweight store.
- Store only tokens and minimum session metadata in SecureStore.
- Use React Hook Form plus schema validation for profile, review, inquiry, and booking forms.
- Create vertical adapters with discriminated types instead of returning `any`.

### Payments

For version one, start checkout through the backend and open the secure hosted/web flow using an in-app browser. Return through a verified deep link such as:

```text
sellio://checkout/complete?type=order&id=...
sellio://booking/complete?type=property&id=...
```

On return, the app must query the backend for final status. It must never trust success parameters from the URL alone.

Native Stripe/PayPal SDK integration can be evaluated after the web payment contracts are stable and app-store requirements are understood.

### Push notifications

- Use Expo Notifications for the first release.
- Store device push tokens against the authenticated user and device.
- Support message, booking/order status, application, appointment, and system notifications.
- Respect the notification preferences planned for the buyer portal.
- Tapping a notification must deep-link to the relevant native detail screen.

## Delivery Phases

### Phase 0 — Product and API contract freeze

- [ ] Approve Option A as the first-release scope.
- [ ] Inventory buyer web routes and map them to mobile routes.
- [ ] Document request/response contracts for all public listing and buyer endpoints.
- [ ] Resolve the buyer portal detail-page actions in `BUYER_PORTAL_TASKS.md` so web and mobile share behavior.
- [ ] Decide cancellation, deletion, editing, and receipt rules per record type.
- [ ] Decide which checkout flows use web handoff in version one.

**Exit gate:** every planned screen has a real backend contract or an explicitly scheduled backend task.

### Phase 1 — Foundation cleanup

- [ ] Replace hardcoded hosts with environment-aware configuration.
- [ ] Remove mock fallback data from production paths.
- [ ] Fix mojibake and replace emoji navigation icons with a consistent icon library.
- [ ] Add products as the seventh vertical.
- [ ] Connect typed API adapters and normalized error handling.
- [ ] Introduce theme tokens and reusable buttons, cards, fields, loaders, errors, and empty states.
- [ ] Add authenticated and guest route guards.
- [ ] Add query caching and pull-to-refresh behavior.

**Exit gate:** the app boots against local and preview APIs, restores a valid session, rejects an invalid session, and shows honest loading/error/empty states.

### Phase 2 — Public marketplace discovery

- [ ] Home and featured marketplace content.
- [ ] Vertical selection for products, properties, vehicles, events, jobs, services, and classifieds.
- [ ] Paginated lists with search, filtering, sorting, and location context.
- [ ] Typed listing cards and native image handling.
- [ ] Vertical-aware listing details.
- [ ] Favorites and native share/deep links.
- [ ] Contextual actions: buy/book, apply, inquire, request quote, or message.

**Exit gate:** every vertical can be browsed from list to detail with no mock data and no raw API errors.

### Phase 3 — Buyer workspace

- [ ] Dashboard with loading-safe counters.
- [ ] Favorites management.
- [ ] Unified activity list plus native detail pages for orders/bookings, job applications, auto inquiries, service appointments, service quotes, and classifieds inquiries.
- [ ] Record-specific actions using reusable premium confirmation sheets.
- [ ] Reviews list, create, edit, and delete flows.
- [ ] Profile editing with backend `location_id` selection.
- [ ] Notification preference UI once backend persistence exists.
- [ ] Remove developer/backend and unimplemented 2FA surfaces.

**Exit gate:** the main buyer workflows match the final behavior of the buyer web portal.

### Phase 4 — Messaging, notifications, and transactions

- [ ] Conversation list and thread screens.
- [ ] Send, read status, pagination, and typing behavior.
- [ ] Realtime transport with a safe polling fallback if needed.
- [ ] In-app notifications and notification detail routing.
- [ ] Expo push registration and device-token lifecycle.
- [ ] Web-assisted checkout/payment handoff and verified deep-link return.
- [ ] Confirmation and receipt/detail screens.

**Exit gate:** a buyer can receive an event, open the correct screen, communicate, and complete at least one verified sandbox transaction journey.

### Phase 5 — Native quality and accessibility

- [ ] Skeleton loading and optimistic updates where safe.
- [ ] Screen-reader labels, focus order, dynamic text, contrast, and touch-target review.
- [ ] Keyboard avoidance and form error focus.
- [ ] Small/large phone and tablet layout pass.
- [ ] Slow-network, offline, expired-token, and API-error behavior.
- [ ] Image caching and long-list performance review.
- [ ] Light/dark mode decision and consistent implementation.
- [ ] Crash reporting and privacy-safe analytics.

**Exit gate:** no critical accessibility, navigation, data-loss, authentication, or crash defects remain.

### Phase 6 — Testing and release pipeline

- [ ] Unit tests for adapters, formatting, validation, and reducers/stores.
- [ ] Component tests for critical forms and state boundaries.
- [ ] End-to-end tests for login, discovery, favorites, activity details, messaging, profile update, and checkout return.
- [ ] Add `typecheck`, `lint`, `test`, and release scripts to `package.json`.
- [ ] Configure stable Android package and iOS bundle identifiers.
- [ ] Add `eas.json` development, preview, and production profiles.
- [ ] Configure signing, privacy manifests, permissions, icons, splash screens, and store metadata.
- [ ] Produce internal Android/iOS preview builds.
- [ ] Complete TestFlight and Google Play closed testing.

**Exit gate:** signed production candidates pass automated checks and a written device test matrix.

## Suggested Mobile Route Map

```text
/(tabs)/discover
/(tabs)/activity
/(tabs)/messages
/(tabs)/notifications
/(tabs)/account

/vertical/[type]
/listing/[type]/[slug]
/favorites
/activity/[type]/[id]
/messages/[conversationId]
/reviews/[id]
/profile/edit
/settings/notifications
/checkout/return
```

Avoid separate permanent tabs for every marketplace vertical. Use one Discover tab with vertical filters and deep links.

## Backend Work Required

- Confirm that all buyer dashboard routes return stable resource envelopes and pagination metadata.
- Add record-detail endpoints where the buyer portal currently only receives list payloads.
- Add receipt/download metadata where supported.
- Persist notification preferences and device push tokens.
- Ensure profile update validates and returns `location_id` plus its related location resource.
- Standardize image URL, formatted price, status, listing link, and allowed-actions fields across buyer activity resources.
- Add mobile deep-link return parameters to payment/booking flows without weakening server-side confirmation.
- Apply API throttling suitable for mobile retry behavior.
- Add focused feature tests for each new or changed mobile contract.

## Commercial Packaging Options

### Bundle mobile source with Sellio

Strongest CodeCanyon value proposition, but increases support expectations and requires both platforms to be demonstrably buildable.

### Sell mobile as a separate add-on

Keeps the core item smaller and creates an upsell, but introduces compatibility/version management and may reduce the apparent completeness of the main listing.

### Include Android first, label iOS as source-ready

Not recommended if marketing implies full cross-platform delivery. Prefer honest source/build support for both Android and iOS, even if public store publication happens in stages.

**Recommended commercial direction:** include the buyer mobile source only after production builds are repeatable. Treat a future seller mobile app as a separate expansion or major update rather than promising it in the initial item.

## Decision Gates

Before implementation proceeds beyond foundation work, explicitly decide:

1. Buyer-only first release or combined buyer/seller release.
2. Mobile source bundled with the initial CodeCanyon item or delivered later.
3. Web-assisted checkout or native payment SDKs for version one.
4. Push notifications included at launch or scheduled for the first update.
5. Required iOS/Android store publication versus source/build delivery only.
6. Branding strategy: fixed Sellio application or buyer-configurable white-label build.

## Final Recommendation

Complete the buyer web contract first, then turn `apps/mobile` into a buyer-first Expo application. Deliver public discovery and the buyer workspace in one focused app, use web-assisted payment confirmation for the initial release, and postpone seller-native functionality until the mobile foundation is proven.

This path produces a credible mobile product fastest while protecting a clean future route to separate buyer and seller applications.
