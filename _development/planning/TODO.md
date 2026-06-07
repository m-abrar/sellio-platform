# TODO

## Admin Dashboard Fixes Required - 2026-05-31

### Dashboard Data And Widgets
- [x] Dashboard shows zero partner applications and zero moderation approvals; add demo data so these areas are populated.
- [x] The dark "Intelligence Pulse" card does not show anything; investigate and populate it.
- [x] The "Submissions Queue" card only shows autos; verify where the rest of the entries are and include them.
- [x] The growth section "Global User Base" card does not show anything in the progress bar; fix/populate it.
- [x] Verify whether "Geospatial Demand Heatmap" is real data or dummy/mocked data.

### Ecommerce Dashboard
- [x] Low-stock alerts show zero; because this is an Envato demo app, populate demo values everywhere.
- [x] Verify whether "Revenue & Growth Trends" is true/realistic.
- [x] Find out if anything on the ecommerce dashboard is dummy or mocked.

### Listings
- [x] Sidebar: rename `Listings > All Unified` to `All Listings`.
- [x] Pending and expired listings show nothing; populate demo values for Envato demo usage.
- [x] On `/admin/listings`, show avatar in the proprietor column.
- [x] On `/admin/[module]/[id]/edit`, show the proprietor with avatar.
- [x] On `/admin/[module]/[id]/edit`, add a link to a dedicated analytics and reports page.

### Properties And Bookings
- [x] On `/admin/properties`, add tabs for rental and sale.
- [x] Add a dedicated route for property bookings filtered by a specific property.
- [x] Update the property bookings link on `/admin/properties/[id]/edit`.
- [x] On `/admin/property-bookings/77`, allow clicking back to the single property page.
- [x] On single property or event edit pages, evaluate adding a Google Maps modal for selecting an exact pinned location with drag-and-drop pin support, using Google API if required.
  - Evaluation: yes, but implement it as a follow-up feature behind `GOOGLE_MAPS_API_KEY`; the models already have `latitude`/`longitude`, while the admin forms/requests still need coordinate fields, validation, and a shared map-picker partial before enabling drag-and-drop pins.

### Module Edit Pages
- [x] In each module edit mode, fix the "Visual Identity" card warning:
  - `System Lock: Initialization Required`
  - `Establish record persistence before attaching assets.`
- [x] On each module edit page, show the proprietor.
- [x] Related bookings or inquiries cards should have a "View all" link.
- [x] Single booking entries in related bookings/inquiries should be clickable.

### Taxonomy, Locations, And Attributes
- [x] On `/admin/locations`, color the badges in the "applicability" column.
- [x] Check whether images from `database/seeders/images/location` were skipped and apply them if needed.
- [x] Apply suitable icons or images to other attributes:
  - Categories
  - Types
  - Amenities
  - Features
  - Tags
  - Brands

### Withdrawals
- [x] On `/admin/withdrawals`, help the admin understand wallet balance before approving or rejecting withdrawals.

### Reports
- [x] On `/admin/reports/payments`, improve datepickers so they feel premium.
- [x] On `/admin/reports/bookings`, improve datepickers so they feel premium.
- [x] On `/admin/reports/properties`, improve datepickers so they feel premium.

### Subscriptions
- [x] On `/admin/subscriptions`, check whether avatars are missing and add them if needed.
- [x] On `/admin/subscriptions/[id]/edit`, add the missing avatar.

### Content And Media
- [x] On `/admin/blogs/[id]/edit`, fix image attachment support.
- [x] On `/admin/email-templates/[id]/edit`, fix the Laravel PHP crash.
- [x] On `/admin/advertisements`, attach images from `seeders/images/advertisement`.
- [x] On `/admin/testimonials`, check whether avatars are missing and add them if needed.

### Tables And DataTables Styling
- [x] On `/admin/users`, fix DataTables search input and pagination positioning CSS.
- [x] On `/admin/permissions`, fix DataTables search input and pagination positioning CSS.
- [x] On `/admin/roles`, fix DataTables search input and pagination positioning CSS.

### Tickets
- [x] On `/admin/tickets`, check whether avatars are shown and add them if needed.
- [x] On `/admin/tickets`, remove sorting from the first column.




NEW TODO ITEMS


http://127.0.0.1:8000/properties (search form sumbitted)

- [x] The check in field must match the format m-d-Y. (Fixed: aligned validation with flatpickr `Y-m-d` output.)
- [x] The check out field must match the format m-d-Y. (Fixed: aligned validation with flatpickr `Y-m-d` output.)



----------------------


Property Detail Page:

- [x] Can we add score here as well? if already available in the database. (Added to vacation and default detail pages; sale page already had scores.)

-------------------------

Everything that i showed on property detail page, should be cross check if admin and partner form has been designed to manage the cruds and pivot table data?
- [x] Property scores (Walk Score, School Rating, etc.) — admin property form + partner seller dashboard now support CRUD.
- [x] Seasonal rental rates — admin property form added; partner seller dashboard already had UI; fixed partner save mapping (`season_name` → DB `title`).

-------------------------

on the property detail page, there is a rating section on the last, it shows two "" empty 
- [x] Fixed: template used `$review->body` but the Review model field is `comment`.

----------------

- [x] when seeding fresh database, does our seller/partner subscibe to a plan? (Yes: `partner@sellio-platform.test` is now assigned an active `Enterprise Plan` subscription by `SubscriptionSeeder`, with regression coverage in `SeededPartnerSubscriptionTest`.)

--------------------------

- [x] Add latitude/longitude fields to admin property/event forms. (Added shared coordinate/map picker to admin property and event forms.)

-----------------

- [x] Add validation in the admin requests. (Admin `PropertyRequest` and `EventRequest` now validate latitude/longitude ranges.)

----------------

- [x] Add a shared map-picker partial that enables drag-and-drop Google Maps pin selection when either `GOOGLE_MAPS_API_KEY` or the Admin Settings Google Maps key exists.

-----------------

- [x] Keep manual coordinate inputs as fallback. (Manual latitude/longitude inputs always render; the map renders when an env or Admin Settings Google Maps key is configured.)

-----------------
in the partner dashboard
- [x] http://localhost:5173/dashboard/properties can we show counting? (Added total, live, pending, and draft property counters.)

-----------------

- [x] http://localhost:5173/dashboard/properties/edit/[slug] can we give space to tightly shrinked form fields? which are collapsed horizontally. (Widened the main form column, relaxed field breakpoints, and made dynamic tables scroll-safe.)

--------------------

- [x] Do we have drag pin on real google map in seller panel like in the admin? (Now yes: seller property forms load the Google Maps key from partner form metadata and support drag/click pin updates for latitude/longitude.)

------------------

- [x] Laravel storefront ( Frontend views ) need to follow css style tokens. (Added shared semantic aliases in `frontend/css/style.css` for colors, fonts, radius, surface, text, border, and shadows.)

------------------

- [x] Login page needs to follow style tokens colors and fonts. (Aligned `frontend/css/auth.css` with the shared storefront token aliases instead of its separate accent palette.)

------------------

- [x] In the admin dashboard, the sidebar logo now prefers the uploaded `site_logo`, keeps the original file colors, and no longer forces the circular logo crop class.

--------------

- [x] In the admin dashboard, the sidebar logo color is changed with some CSS styling? fix it to show original. (Admin sidebar now prefers the uploaded original `site_logo` file and avoids the circular crop class.)

-------------------------

- [x] In the seller dashboard, add map pin drag on the events form. (Events now receive the Google Maps key in form metadata and use the same drag/click map picker as seller properties.)

--------------------

- [x] http://127.0.0.1:8000/properties showed `205 Listings Available` / too many entries. (Problem: repeated demo seeding kept adding 30 properties. `PropertySeeder` now skips once 30 exist, and the unfiltered public properties page uses a curated 30-listing demo cap while filtered searches still use matching results.)

-------------------
- [x] In the admin dashboard, the sidebar logo color is changed with some CSS styling? (Removed the `hue-rotate` / `brightness` filter from `.brand-image` in `public/admin-assets/style.css`.)

--------------

- [x] http://127.0.0.1:8000/admin/welcome — navbar hamburger dropdown items misaligned. (Fixed double-offset on `.main-header` by zeroing AdminLTE `margin-left`, using full-width fluid container padding aligned with dashboard content, and correcting `.navbar-nav` dropdown positioning on mobile/desktop.)

---------------------

- [x] http://localhost:5173/dashboard/properties — show total/live/pending/draft counts on other seller vertical listing pages too. (Added shared `ListingCountCards` + `getListingCounts` across products, autos, events, services, jobs, and classifieds.)

----------------------
- [x] Seller dashboard index counters flashed zero while loading. (`ListingCountCards` now renders pulse skeletons until fetch completes.)
- [x] Admin topbar/sidebar misaligned when collapsed. (Unified collapsed offset to `4.6rem` for header width, sidebar, brand link, and content wrapper.)
- [x] Admin collapsed layout regressions: topbar gap, off-center sidebar logo, clipped username. (Removed stacked AdminLTE `margin-left` on `.main-header` when using absolute `left`, centered collapsed brand mark, and fixed navbar/user-menu overflow.)

---------------------

- [x] Stripe webhook local fulfillment — `stripe listen --forward-to http://127.0.0.1:8000/webhooks/stripe` receives events but Laravel returned **419** (CSRF). Fixed by excluding `webhooks/*` from CSRF verification; focused `PartnerSubscriptionCheckoutTest` passes and confirms `checkout.session.completed` activates partner subscriptions in the database. Return-url `session_id` confirm fallback already exists.

----------------------

- [x] Laravel public property booking checkout now uses the real Stripe gateway path instead of instant demo confirmation: payment submission resolves the active Stripe gateway, charges the booking total, records a polymorphic `payments` row, confirms only successful charges, stores failed attempts, supports Stripe auth return confirmation, and handles `payment_intent.succeeded` webhooks for property bookings.

----------------------

- [x] Impersonate from super admin now routes through `dashboard` and lands partners/buyers on their configured React portal URLs (`url_partner` / `url_user`), with activity logging. Coverage: `AdminImpersonateTest`.

-----------------------

- [x] Event booking attendee columns (`user_name`, `user_email`, `user_phone`) — migration `2026_06_06_000002_add_attendee_fields_to_event_bookings_table` applied; fresh inserts work.

------------------

- [x] Event and product checkout UI/UX polished to match property rental flow: shared stepper/header/layout, sticky order summary, token-aligned forms, and confirmation pages. Shared `StripeCheckoutConfigService` extracted for gateway publishable-key resolution.

-----------------------

- [x] Product detail page UI/UX polished: unified header/meta, purchase quote card, `btn-primary-theme`, gallery tokens, and property-style section rhythm.

------------------
- [x] Cart summary subtotal showed `$0.00` — cart page now uses `calculateTotal()`, `Cart::syncTempTotal()` runs on index, and cart item creation persists `cart_id` reliably. Coverage: `LaravelPublicStorefrontTest::test_cart_page_shows_calculated_subtotal_for_cart_items`.

-------------------------

- [x] Events single page UI/UX refreshed: metric cards, ticket sidebar styling, sticky purchase panel, mobile CTA, and shared detail tokens aligned with property/product pages.

-----------------------

- [x] Product `/checkout` and event booking checkout now match property payment UX: shared `booking-payment-panel` with card preview, secure header, trust list, review cards, sticky price breakdown sidebar, and mobile pay bar.

--------------------------

- [x] Auth pages (login, register, forgot/reset password) redesigned: shared marketing panel + form card partials, storefront `filter-label` / `btn-primary-theme` tokens, buyer-friendly copy, and social login divider.

---------------------------

- [x] Products single page UI/UX fixes: related products use `primary_image_url`, sidebar add-ons use property-style `addon-card` panel, required add-ons submit reliably, merchant block null-safe.

------------------

- [x] Classifieds single page UI/UX polished: token-aligned header/meta, seller contact card, removed duplicate gallery script, safety tips card aligned with detail shell.

------------------------

- [x] Related products show correct images (`primary_image_url` instead of missing `main_image_url` accessor; brand filter uses `brand` query param).

--------------------------

- [x] Product sidebar add-ons redesigned with property booking step-1 inspiration (`addon-card`, icon box, check badge, optional badge).

--------------------------

- [x] Gallery thumbnail 404s fixed across verticals: shared `resolveMediaUrl()` falls back to original when Spatie conversions are missing; autos empty-gallery `src` bug fixed.

-----------------------

- [x] Step 3 confirmation flows redesigned across verticals: shared `checkout-success-hero` celebration card, steppers hidden on property/event/product/autos/visit/job confirmations, emotional copy + reference IDs retained.

------------------------


- [x] Step 2 payment pages no longer duplicate listing thumbnails: header context card hidden on product/event checkout step 2; sidebar summary keeps the single thumb.

--------------------------------

- [x] Event booking confirmation deduplicated: removed redundant header title/context and repeated booking summary labels; success hero + compact ticket receipt only.

-----------------------------


## Open Audit Items — 2026-06-07

### Translatability (admin + frontend Blade)
- [ ] **Partial — needs follow-up.** ~65% of Blade files use `__()`, but `lang/en.json` has only ~39 keys. Many partials (filters, sidebars, page-builder widgets, ecommerce dashboard) remain hardcoded English. Frontend CMS uses `page_content()` / `@editable()` on home and several index pages — not a full i18n layer. **Action:** expand `en.json`, wrap remaining partials, split admin/frontend string catalogs.

### Events / listeners / email templates
- [x] Wired orphaned flows: `PartnerLeadCreated` → `NewListingLead` email; `PropertyBookingConfirmed` now dispatches from public checkout; `ReviewRequested` after property/event purchase; `PaymentFailed` on Stripe subscription webhook failure; `PlanExpired` via `app:check-expired-subscriptions`; renewal query fixed (`title` not `name`).
- [x] Scheduled `app:check-renewals` (daily 08:00) and `app:check-expired-subscriptions` (daily 08:15).
- [ ] **Orphan template:** `password_reset_link` seeded but Laravel default reset flow does not use `DynamicEmail` — wire custom notification or remove template.

### Home page dynamic content
- [x] **Yes.** Home (`frontend/unifieds/index.blade.php`) uses `page_content()` for hero badge, title, and description — same pattern as footer, search meta, and unified index body. There is no `pagecontent()` helper; the correct helper is `page_content()`.

### Impersonation → React portal
- [x] **Working.** Admin impersonate logs in as target user, redirects to `route('dashboard')` → `DashboardRedirectController` sends partners to `url_partner` and buyers to `url_user` from settings. Coverage: `AdminImpersonateTest`.

### Blade inline PHP / CSS / JS
- [ ] **Needs cleanup pass.** Many Blade files embed `<style>` blocks, inline `<script>`, and `@php` blocks (admin dashboard widgets, checkout panels, page-builder). Not blocking, but CodeCanyon buyers benefit from moving scripts to `public/` assets and minimizing inline CSS. **Action:** incremental extraction per module.

### Permissions vs roles
- [ ] **Mixed — prefer permissions for admin routes.** Admin routes already use `can:manage-*` and `can:app-settings` middleware (Spatie permissions). API routes use `role:partner|admin` middleware. Policies exist on some resources (e.g. `ThemePolicy`). **Recommendation:** keep roles for portal routing (partner vs buyer vs admin); use permissions for admin CRUD gates; add policies for partner API mutations where missing.

### Third-party image URLs
- [x] Production fixes: replaced `picsum.photos` related-services partial with dynamic listing images + local fallback; replaced `via.placeholder.com` in seller adapters/pages with bundled SVG placeholders; replaced `placehold.co` in page-builder widget defaults; removed `ui-avatars.com` from `User` and `Testimonial` models.
- [x] Admin show/index blades now use `$user->avatar_url` or `asset('images/fallbacks/default-avatar.png')` instead of `ui-avatars.com` (11 files). Frontend partials may still use ui-avatars for guest leads — lower priority.
- [ ] `_development/` reference library still has Unsplash/Picsum (not shipped).

### Code comments for CodeCanyon buyers
- [ ] **Guideline for future PRs:** comments should explain *why* and *how to configure*, not session context. No bulk rewrite scheduled — apply on touch.

### Stripe keys lost on demo refresh
- [x] `StripeGatewaySeeder` now seeds `sandbox_config` / `live_config` from `.env` (`STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_CURRENCY`) and auto-activates sandbox mode when keys are present. Admin UI edits still persist in DB; re-seed restores env defaults without wiping manually saved keys if using `updateOrCreate` on credentials (existing row updated, not deleted).

---------------------------

### Distribution / marketing polish — 2026-06-07

- [x] **Introduction landing page:** `sites.php` centralizes demo URLs; `#live-demo` section with admin/seller/buyer credentials + portal links; navbar/footer logo; theme toggle shows Day/Night label; `demos.php` preview URLs use `demo.sellio.vebdez.com`.
- [x] **Documentation:** logo at `assets/img/logo.png`; live demo access block with portal links and credentials.
- [x] **Install wizard CSS (Windows):** `installer_public_base()` normalizes backslashes so asset URLs resolve.
- [x] **Install wizard footer:** dead `docs.sellio.com` / `support.sellio.com` replaced with `installer_doc_url()` / `installer_support_url()` helpers.
- [x] **`prepare-distribution.mjs`:** `shouldExclude()` now skips only Composer `backend/vendor`, not `public/vendor/` (AdminLTE/Bootstrap assets).
- [x] **Admin ui-avatars:** replaced in 11 admin blade files (see Third-party image URLs above).
- [ ] **Demo server restyle:** `/login` and `/admin` on `demo.sellio.vebdez.com` still broken until server is redeployed with `public/vendor/` from a fresh distribution build + `php artisan storage:link`.
- [ ] **Link naming suggestion:** keep subdomain split (`demo.*` = Laravel monolith, `seller-panel.*` / `buyer-panel.*` = React portals, `frontend.*` = Next.js storefront). Single config file: `Introduction/sites.php`.

### React portal login failures — 2026-06-07

- [x] **Root cause identified**
  - **Seller 404:** dist built with `VITE_API_URL=/api` → login POST hits `seller-panel.../api/v1/auth/login` on the static host (no Laravel there).
  - **Buyer CORS/localhost:** dist built with `VITE_API_URL=http://127.0.0.1:8000/api` baked in.
- [x] **Code fixes:** `prepare-distribution.mjs` writes `.env.production` with `--api-url` before building seller/buyer; `config/cors.php` reads `SELLER_APP_URL` / `BUYER_APP_URL`; `SettingSeeder` seeds portal URLs from env; `sites.php` + docs use `seller-panel.sellio.vebdez.com` / `buyer-panel.sellio.vebdez.com`.
- [x] **Permanent buyer fix:** seller/buyer load `public/config.js` at runtime — buyers edit one file in cPanel, no rebuild.
- [x] **Setup reminder UI:** amber banner on login + dashboard when `config.js` still has placeholder/localhost values.
- [ ] **Server action (demo):** Rebuild + redeploy portals, then set on Laravel host `.env`:
  - `SELLER_APP_URL=https://seller-panel.sellio.vebdez.com`
  - `BUYER_APP_URL=https://buyer-panel.sellio.vebdez.com`
  - `php artisan config:clear`
  - Re-upload `apps/seller/dist/*` and `apps/buyer/dist/*` from `npm run prepare:distribution`

------------------------

the buyer app does not load correct title, favicon, and logo, and more problems like this, fix them (see seller portal for reference)