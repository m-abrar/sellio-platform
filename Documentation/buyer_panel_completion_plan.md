# Buyer Panel Completion Plan

Last updated: 2026-05-26

## Goal

Complete `apps/buyer` as an authenticated buyer dashboard. The panel should focus on the logged-in user's interactions: saved listings, bookings, inquiries, applications, quotes, appointments, messages, reviews, settings, and partner onboarding.

Marketplace discovery belongs to the storefront. Buyers should be redirected to the storefront when they want to browse full listing catalogs or inspect storefront-facing listing pages. The buyer panel must not include listing CRUD.

Current dev URL: `http://localhost:3003` when running with `npm run dev` or `npm run dev:buyer` from root.

## Current App Snapshot

`apps/buyer` is now a Vite + React app served by a lightweight Express host. Runtime buyer data is expected from Laravel APIs, not local SQLite.

- Frontend entry: `apps/buyer/src/App.tsx`
- Static host/dev server: `apps/buyer/server.ts`
- API wrappers: `apps/buyer/src/api/*`
- API config: `apps/buyer/src/config/api.ts`
- Laravel API default: `http://127.0.0.1:8000/api`
- Storefront default: `http://localhost:3000`

Implemented buyer routes:

| Route | Purpose |
| :--- | :--- |
| `/` | buyer dashboard overview |
| `/favorites` | saved listings from the buyer API |
| `/messages` | buyer conversations/messages |
| `/settings` | profile/settings surface |
| `/bookings` | logged-in buyer booking/activity list |
| `/applications` | job activity |
| `/auto-inquiries` | auto inquiry activity |
| `/appointments` | service appointment activity |
| `/quotes` | service quote activity |
| `/classifieds-activity` | classified/contact activity |
| `/reviews` | reviews written by the buyer |
| `/partner` | partner promo/onboarding handoff |
| `/properties`, `/events`, `/autos`, `/services`, `/jobs`, `/classifieds`, `/products` | redirect to storefront browsing |

## Current Direction

- Keep buyer panel authenticated and user-specific.
- Use Laravel buyer dashboard APIs under `/api/dashboard/user` for private user records.
- Use Laravel auth APIs under `/api/v1/auth` for login/session.
- Use the storefront for catalog browsing and product/listing detail pages.
- Open storefront listing pages from favorites and activity rows.
- Do not add listing create/edit/delete screens or catalog management to buyer.

## Main Gaps

- Confirm final Laravel payloads for buyer favorites, bookings, inquiries, applications, quotes, appointments, reviews, messages, and settings.
- Confirm whether profile updates are supported by `PUT /api/dashboard/user/profile` or another endpoint.
- Confirm favorite creation/toggle API. Current buyer integration can read favorites and delete existing favorites, but creation from storefront may need a shared auth flow.
- Confirm buyer action creation endpoints for bookings, applications, auto inquiries, service appointments, quotes, classified contacts, cart, and orders.
- Replace guarded placeholder errors in buyer transaction APIs once backend route/payload contracts are known.
- Add a real notification source or remove the fixed notification badge.
- Add route-level not-found and error fallback states.
- Standardize loading, empty, and error states across all buyer activity screens.
- Add tests for API adapters, auth state, and critical dashboard flows.

## Completion Plan

### Phase 1: Scope Cleanup

- Keep vertical browse routes as storefront redirects.
- Remove internal full-list browse/detail behavior from buyer routes.
- Ensure empty states and activity buttons that imply browsing open the storefront.
- Keep partner/listing creation paths pointed to partner onboarding or seller portal.
- Document `VITE_STOREFRONT_URL` beside `VITE_API_URL`.

### Phase 2: Laravel Contract Completion

- Map buyer dashboard stats to `GET /api/dashboard/user/welcome`.
- Map settings/profile reads to `GET /api/dashboard/user/settings`.
- Confirm and wire profile update endpoint.
- Map favorites to `GET /api/dashboard/user/favorites` and remove/toggle endpoints.
- Map bookings/activity to `GET /api/dashboard/user/bookings`.
- Confirm creation/cancel endpoints for buyer-owned interactions.
- Map reviews to `/api/dashboard/user/reviews`.
- Map messages to `/api/dashboard/user/messages`.
- Map inquiries to `/api/dashboard/user/inquiries/*`.

### Phase 3: Buyer Interaction UX

- Make cancel behavior work for pending buyer-owned activity once the backend contract is confirmed.
- Add detail views or modals for interaction records, not listing records.
- Add review create/edit/delete flows tied to eligible completed interactions.
- Improve messages with conversation-scoped fetches, send state, read state, pagination, and empty states.
- Add cart/order surfaces only for product buyer ownership, not seller inventory management.

### Phase 4: Auth And Session Hardening

- Keep login/logout and route protection in place.
- Add expired-session and unauthorized states.
- Confirm buyer/partner/admin role behavior.
- Ensure all private calls send `Authorization: Bearer <access_token>`.
- Handle Laravel 401, 403, 422, and 500 responses consistently.

### Phase 5: Testing And Acceptance

- Run `npm run lint` in `apps/buyer`.
- Run `npm run build` in `apps/buyer`.
- Add focused frontend tests for API adapters and auth/routing behavior.
- Add manual QA for login/logout, dashboard stats, favorites, activity rows, messages, reviews, settings, and storefront redirects.
- Run Laravel API tests for any backend endpoints changed or added.

## Acceptance Criteria

- Buyer can authenticate and land on a personalized dashboard.
- Buyer can view buyer-owned favorites, bookings, inquiries, applications, quotes, appointments, messages, reviews, and settings.
- Buyer can open full marketplace browsing in the storefront.
- Buyer can open storefront listing pages from saved/activity records.
- Buyer cannot create, edit, or delete marketplace listings from this panel.
- Buyer cannot see or mutate another user's private records.
- Buyer transaction actions use Laravel APIs with confirmed payloads.
- Buyer app builds cleanly and runs beside storefront without port collision.

## Notes

- `apps/buyer/package-lock.json` changed after `npm audit fix`; the latest audit output reported zero vulnerabilities.
- `apps/buyer/server.ts` should remain a lightweight Vite/static host.
- Storefront links are controlled by `VITE_STOREFRONT_URL` and default to `http://localhost:3000`.
