# Complete Buyer Panel

Last scanned: 2026-05-26

## Goal

Complete `apps/buyer` into a production-ready buyer dashboard for authenticated Sellio users. The finished panel should let buyers browse marketplace verticals, save favorites, manage bookings/orders/inquiries/applications, message partners, manage reviews, update settings, and move into partner onboarding without relying on prototype-only behavior.

Current dev URL: `http://localhost:3001` when running with `PORT=3001 npm run dev`.

## Current App Snapshot

`apps/buyer` is currently a standalone Vite + React + Express + SQLite app.

- Frontend entry: `apps/buyer/src/App.tsx`
- Local API/server: `apps/buyer/server.ts`
- Local database: `apps/buyer/database.sqlite`
- API wrappers: `apps/buyer/src/api/*`
- Backend switch config: `apps/buyer/src/config/api.ts`

Implemented frontend routes:

| Route | Current View |
| :--- | :--- |
| `/` | dashboard overview |
| `/favorites` | saved listings |
| `/messages` | inbox/conversations |
| `/settings` | profile/security/notifications/billing/backend tabs |
| `/properties` | vertical browse |
| `/events` | vertical browse |
| `/autos` | vertical browse |
| `/services` | vertical browse |
| `/jobs` | vertical browse |
| `/classifieds` | vertical browse |
| `/products` | vertical browse |
| `/bookings` | activity list |
| `/applications` | job activity |
| `/auto-inquiries` | auto activity |
| `/appointments` | service appointment activity |
| `/quotes` | service quote activity |
| `/classifieds-activity` | classified activity |
| `/reviews` | reviews written |
| `/partner` | partner promo/onboarding landing |

Local Express endpoints currently present:

- `GET /api/health`
- `GET /api/user/next-booking`
- `GET /api/user/stats`
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/favorites`
- `POST /api/favorites/toggle`
- `GET /api/bookings`
- `GET /api/items`
- `GET /api/conversations`
- `GET /api/messages`
- `POST /api/messages`
- `GET /api/reviews`
- `POST /api/reviews`

Laravel API surfaces already exist for a future real backend integration:

- Public marketplace APIs under `/api/v1`: products, properties, vehicles, events, jobs, services, classifieds, cart, orders.
- Auth APIs under `/api/v1/auth`: login, register, logout, refresh-token, me.
- Authenticated buyer dashboard APIs under `/api/dashboard/user`: welcome, settings, favorites, bookings, reviews, inquiries, messages, media upload/delete.

## Main Gaps

- No login/register/logout UI, token storage, route guard, or authenticated user boundary.
- Local server hardcodes `userId = 1` across buyer APIs.
- API wrappers expect the local Express shape, not Laravel `{ success, message, data, meta, errors }` responses.
- Browse cards have action buttons but no detail pages or transactional flows.
- `Add New Listing` appears in buyer vertical pages, which is a partner action and should be removed or redirected to partner onboarding.
- Filters button is presentational only; search is client-only and category/status filters are not implemented.
- Favorites can toggle locally, but the UI does not consistently show saved state or map to Laravel favorites.
- Activity rows have `Cancel` and `View Details` buttons with no behavior.
- Review edit/delete buttons have no behavior; there is no create-review form tied to completed bookings.
- Messages poll every 5 seconds and fetch all messages globally; no read-state update, conversation scoping, pagination, or Laravel conversation mapping.
- Settings profile save works against local Express only; security, billing, avatar upload, and some notification saves are incomplete or optimistic.
- Partner page is promotional only; buttons do not start real partner onboarding or link to the seller portal.
- No loading/error/empty state standardization across every view.
- No tests are present for API adapters, routing, or critical user flows.

## Completion Plan

### Phase 1: Stabilize The Local Buyer Panel

- Keep the `PORT` environment override in `apps/buyer/server.ts` so buyer can run beside storefront on `3001`.
- Rename package metadata from `react-example` to a buyer-specific package name.
- Replace the starter README with Sellio buyer setup notes, including port and backend mode.
- Remove buyer-inappropriate actions such as `Add New Listing` from buyer browse pages.
- Add a not-found route and route-level error fallback.
- Add consistent toast/error handling for failed API calls.
- Add empty/loading/error states to dashboard widgets, messages, reviews, favorites, activity, and settings.

### Phase 2: Complete Buyer UX On The Current Local API

- Add listing detail pages for each vertical:
  - `/properties/:id`, `/events/:id`, `/autos/:id`, `/services/:id`, `/jobs/:id`, `/classifieds/:id`, `/products/:id`.
- Wire primary actions by vertical:
  - properties: request booking or viewing.
  - events: book ticket.
  - autos: send inquiry or test-drive request.
  - services: book appointment or request quote.
  - jobs: submit application.
  - classifieds: contact seller.
  - products: add to cart or buy.
- Add local API endpoints for action creation, cancellation, detail fetches, and status transitions.
- Add detail modals/pages for activity rows.
- Implement cancel behavior for pending activities.
- Implement review create/edit/delete flows tied to completed bookings.
- Improve messages with conversation-scoped fetches, send state, read state, and empty states.
- Add notifications panel or remove the nonfunctional bell badge until real notifications exist.
- Make settings tabs functional or explicitly mark unavailable tabs as disabled.

### Phase 3: Add Authentication

- Add login/register views.
- Add auth context with current user, token/session state, logout, and refresh behavior.
- Protect buyer routes from anonymous access.
- Replace hardcoded user `1` in local server with session-derived user for local mode.
- Add role handling so partner/admin users can enter buyer mode while anonymous users cannot.
- Add unauthorized and expired-session states.

### Phase 4: Integrate Laravel API

- Create a shared API client for buyer:
  - `Authorization: Bearer <access_token>`
  - centralized 401/403/422/500 handling
  - normalized response parsing for Laravel `{ success, message, data, meta, errors }`
  - pagination support
  - multipart upload support
- Map current local endpoints to Laravel endpoints:
  - dashboard stats: `GET /api/dashboard/user/welcome`
  - settings/profile: `GET /api/dashboard/user/settings` plus profile update endpoint if missing.
  - favorites: `GET /api/dashboard/user/favorites`, `DELETE /api/dashboard/user/favorites/{favorite}`
  - bookings: `GET /api/dashboard/user/bookings`
  - reviews: `/api/dashboard/user/reviews`
  - messages: `/api/dashboard/user/messages/{conversationId?}`
  - inquiries: `/api/dashboard/user/inquiries/*`
  - public listings: `/api/v1/products`, `/properties`, `/vehicles`, `/events`, `/jobs`, `/services`, `/classifieds`
  - cart/orders: `/api/v1/cart`, `/api/v1/orders`
- Add adapter functions that convert Laravel resources into the buyer panel view models.
- Remove or clearly isolate local SQLite as development fixtures only.

### Phase 5: Backend Gaps To Confirm Or Add

- Confirm buyer profile update API shape and add it if `settings` is read-only.
- Confirm favorite creation/toggle API exists; current Laravel buyer route only shows index/remove in the scanned route file.
- Confirm buyer action creation endpoints exist for bookings, applications, quotes, appointments, inquiries, and classified contact.
- Confirm conversation send endpoint accepts the buyer panel payload shape.
- Confirm notification counts and unread counts are available.
- Confirm order history and cart endpoints return enough data for buyer dashboard cards.
- Add backend feature tests for buyer ownership, auth, validation, and forbidden access.

### Phase 6: Testing And Acceptance

- Run `npm run lint` in `apps/buyer`.
- Run `npm run build` in `apps/buyer`.
- Add focused frontend tests for API adapters and critical route rendering.
- Add manual browser QA for desktop and mobile:
  - login/logout
  - dashboard stats
  - browse and detail pages for all verticals
  - favorite/unfavorite
  - create one activity per vertical
  - cancel a pending activity
  - send and receive a message
  - create/edit/delete a review
  - update profile/settings
  - token expiry handling
- Run Laravel API tests for any backend endpoints changed or added.

## Proposed Milestones

1. Local UX completion: make every visible button either work or disappear.
2. Auth shell: login, route guard, logout, current user, token handling.
3. Laravel adapter: switch read-only dashboard/browse/favorites/settings to real API.
4. Transactional flows: bookings, inquiries, applications, quotes, cart/orders, reviews, messages.
5. QA hardening: tests, build, mobile/desktop browser pass, documentation refresh.

## Acceptance Criteria

- Buyer can authenticate and land on a personalized dashboard.
- Buyer can browse every enabled vertical and open detail pages.
- Buyer can favorite/unfavorite listings and see counts update.
- Buyer can create and track bookings, inquiries, applications, quotes, appointments, and classified contacts.
- Buyer can manage product cart/orders where products are enabled.
- Buyer can message partners from conversations and activity/detail contexts.
- Buyer can create, edit, and delete reviews for eligible completed interactions.
- Buyer can update profile and notification preferences.
- Buyer cannot see or mutate another user's records.
- Buyer app builds cleanly and runs beside storefront without port collision.

## Notes From Scan

- `apps/buyer/package-lock.json` changed after `npm audit fix`; current audit output reported zero vulnerabilities.
- `apps/buyer/server.ts` now supports `process.env.PORT`, which should be kept.
- The current panel is visually coherent but still prototype-heavy in behavior.
