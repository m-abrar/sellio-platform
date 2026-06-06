# Buyer Panel Status Report

Last refreshed: 2026-06-06

## Done

- Auth shell exists: login, token storage, logout, and route guard via `UserContext.tsx` and `LoginView.tsx`.
- Buyer app talks to Laravel APIs through `apiClient.ts`; local SQLite is no longer the runtime data source.
- Dashboard stats use `GET /api/dashboard/user/welcome`.
- Header notifications use the Laravel dashboard notification count instead of a fixed badge.
- Favorites read/remove use buyer API.
- Favorite cards support real Laravel media URLs through `adapters.ts`.
- Full listing browsing is no longer inside buyer panel.
- Vertical routes redirect to storefront through `StorefrontRedirectView.tsx`.
- Activity rows and favorite cards open storefront listing URLs.
- Activity list routes read from the relevant Laravel buyer endpoints for bookings, job applications, auto inquiries, service appointments, service quotes, and classified inquiries.
- Reviews can be listed, created, edited, and deleted (reviewable context wired via `adapters.ts`).
- Messages list conversations, load messages by active conversation, use the logged-in user id for alignment, and can send messages.
- Laravel exposes `GET /api/dashboard/user/profile` and `PUT /api/dashboard/user/profile`.
- Settings profile read/update is wired for name, email, phone, location, and notification preferences (`preferences` JSON on users table).
- Profile avatar upload is wired via `POST /api/dashboard/user/upload-image` and the Settings camera control.
- A not-found route exists for unknown buyer panel paths.
- A buyer route error boundary exists for unexpected view failures.
- Activity cancellation is wired where Laravel exposes safe cancel routes.
- Completion plan is aligned with the current direction: buyer activity/logs in buyer panel, storefront for discovery.
- Backend feature test: `apps/backend/tests/Feature/BuyerDashboardApiTest.php`.

## Pending

- Settings security (password change) and billing are still mostly visual/prototype.
- No focused frontend tests yet.

## Verification

- `npm.cmd run lint` passed (last full buyer sweep).
- `npm.cmd run build` passed (last full buyer sweep).
- `php artisan route:list --path=api/dashboard/user` confirmed the buyer profile routes.
- `php artisan test --filter=BuyerDashboardApiTest` covers profile/preferences persistence.
