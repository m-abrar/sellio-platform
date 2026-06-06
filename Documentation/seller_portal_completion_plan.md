# Complete Seller Portal Against Laravel API

## Summary

Replace the seller portal's local SQLite/Express backend with the existing Laravel API. The finished portal will authenticate with Laravel Sanctum bearer tokens, enforce partner/admin access, and support complete seller workflows for products, properties, autos, events, services, jobs, classifieds, activity, messages, reviews, wallet, payouts, memberships, analytics, notifications, and settings.

Default development API base: `http://127.0.0.1:8000/api`, overrideable via seller env.

## Current Workspace Status

Last refreshed: 2026-06-06 by static workspace scan.

This plan remains active for backend polish and verification. Several items from the May 2026 scan are now resolved:

- Settings page no longer shows a `Coming Soon` overlay.
- Product, event, and job create flows navigate immediately after save (no `setTimeout` delay).
- Listing count cards and loading skeletons are wired on all vertical list pages.
- Storefront and Blade admin bars expose real Add New create routes (module-gated for listings).
- Stripe subscription checkout foundation exists (`SubscriptionCheckoutService`, partner checkout route, webhook fulfillment).

Still open from the original plan:

- `apps/backend/app/Http/Controllers/Dashboard/Partner/Traits/Activities.php` still retains mock counts for reviews, awaiting approval, and expired listings.
- `apps/backend/app/Services/ContactService.php` still has a TODO for actual mailing logic.

This scan did not re-run seller build, Laravel tests, or browser acceptance tests in this refresh.

## Key Changes

- Remove seller dependence on `apps/seller/server.ts`, `src/db/index.ts`, `marketplace.db`, and mock fallbacks for normal operation.
- Add a shared seller API client with:
  - `Authorization: Bearer <access_token>`
  - centralized 401/403/422/500 handling
  - multipart upload support
  - normalized response parsing for Laravel `{ success, message, data, meta, errors }`
- Update auth flow to use:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/logout`
  - `POST /api/v1/auth/refresh-token`
  - `GET /api/v1/auth/me`
- Guard seller routes by authenticated user role: `partner`, `admin`, or `super-admin`.

## API And Backend Work

- Use protected partner routes under `/api/dashboard/partner`.
- Complete or normalize backend endpoints for:
  - `/welcome`, `/analytics`, `/activities`
  - CRUD: `/products`, `/properties`, `/autos`, `/events`, `/services`, `/joblistings`, `/classifieds`
  - leads: property bookings/visits, auto inquiries, event bookings, service quotes/appointments, job applications, classified inquiries
  - finance: `/payments`, `/wallet/overview`, `/wallet/history`, `/wallet/withdraw`, `/plans`, `/subscriptions`
  - relationships: `/reviews`, `/messages`
  - profile/settings: `/profile`
  - media: `/media/upload`, `DELETE /media/{media}`
- Add explicit partner form-metadata endpoints where needed, because controller `create()` methods are not available through `apiResource`:
  - categories, brands, types, locations, amenities, features, service/job/event options.
- Ensure every partner resource supports owner-scoped list/show/create/update/delete and returns enough data for list cards, detail pages, and edit forms.
- Use real Spatie media uploads for all verticals via multipart requests.

## Seller UI Work

- Replace per-file mock API modules with typed API services grouped by domain.
- Wire all vertical list/create/edit/detail/delete flows to Laravel:
  - products, properties, autos, events, services, jobs, classifieds.
- Align form fields with Laravel request validation:
  - Laravel is already complete, you will modify or fix the fields on this app to follow laravel.
  - products use `title`, `slug`, `sku`, `description`, `category_id`, `brand_id`, `type_id`, prices, stock, `main_image`, `gallery`.
  - properties include taxonomy, address/city/country, pricing, rental/sale flags, bedrooms/bathrooms/guests/area, amenities.
  - autos include make/model/year, mileage, engine/transmission/drivetrain, city/country, pricing, stock, status flags.
  - events include tickets and occurrences.
  - services, jobs, and classifieds use their partner request schemas.
- Replace simulated saves and `setTimeout` flows with real loading, success, validation-error, empty, and retry states.
- Make settings functional for profile update; leave destructive account deletion behind confirmation.
- Keep the current visual direction, but remove "Coming Soon" overlays from completed pages.

## Updated Pending Items

- Replace retained mock activity counts with real backend queries or clearly labeled development fixtures.
- Implement contact mailing or explicitly document the mail transport dependency.
- Run seller `npm run lint` and `npm run build` after API/UI cleanup.
- Run focused Laravel tests for partner dashboard/API routes after backend cleanup.
- Live-test Stripe subscription checkout with configured keys.

## Test Plan

- Frontend:
  - `npm.cmd run lint` in `apps/seller`
  - build seller with Vite
  - verify login/logout, route guard, token expiry handling, and role rejection.
- Backend:
  - run Laravel tests for auth and partner dashboard routes.
  - add focused feature tests for partner CRUD ownership and 422 validation responses.
- Manual acceptance:
  - partner can log in and see dashboard metrics.
  - partner can create, edit, view, delete one listing in each vertical.
  - image upload works and appears on list/detail/edit screens.
  - validation errors map to fields.
  - wallet withdrawal, messages, reviews, activities, analytics, memberships, and profile pages load from API.
  - unauthorized user cannot access seller portal data.

## Assumptions

- The existing Laravel backend is the source of truth.
- Seller portal should target Laravel Sanctum token auth as JWT-style bearer auth.
- Backend changes are allowed.
- Local dev runs Laravel on `127.0.0.1:8000` and seller on its own Vite/tsx dev server.
- All seller mock fallbacks should be removed or limited to clearly labeled development fixtures only.
