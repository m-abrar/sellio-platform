# Buyer Panel Status Report

Last scanned: 2026-05-26

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
- Reviews can be listed, edited, and deleted.
- Messages list conversations, load messages by active conversation, use the logged-in user id for alignment, and can send messages.
- Laravel now exposes `GET /api/dashboard/user/profile` and `PUT /api/dashboard/user/profile`.
- Settings profile read/update is wired for the Laravel-supported fields: name, email, and phone.
- A not-found route exists for unknown buyer panel paths.
- A buyer route error boundary exists for unexpected view failures.
- Unsupported activity cancellation is no longer shown as a failing visible action.
- Completion plan is aligned with the current direction: buyer activity/logs in buyer panel, storefront for discovery.

## Pending

- Buyer transaction creation is not implemented yet. `bookingApi.ts` still throws until Laravel routes and payloads are confirmed.
- Activity cancellation is not implemented yet. The UI hides cancel actions until Laravel exposes a safe route.
- Review creation is blocked until tied to an eligible Laravel booking/reviewable context.
- Settings security, billing, avatar upload, location, and notification preference persistence are still mostly visual/prototype.
- No focused frontend tests yet.

## Verification

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- `php artisan route:list --path=api/dashboard/user` confirmed the buyer profile routes.
- `php -l` passed for the touched Laravel route/request/controller files.
