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
- [x] **Frontend i18n pass complete.** `lang/en.json` expanded from 39 → 110+ keys. All customer-facing frontend partials that had hardcoded English now use `__()`: autos gallery/related/dealer-contact, events ticket selection, jobs sidebar/description/back-button/mobile-CTA (also fixed hardcoded demo data in mobile CTA), property amenities + VR summary features, services gallery/reviews/feature-list, classifieds pickup-location card. Also fixed `**bold**` markdown-in-HTML in jobs partials (replaced with `<strong>` tags) and removed `ui-avatars.com` from `_description.blade.php`. Admin panel remains English-only (standard for CodeCanyon). Admin/frontend string catalog split deferred — JSON flat file is sufficient for current buyer scope.

### Events / listeners / email templates
- [x] Wired orphaned flows: `PartnerLeadCreated` → `NewListingLead` email; `PropertyBookingConfirmed` now dispatches from public checkout; `ReviewRequested` after property/event purchase; `PaymentFailed` on Stripe subscription webhook failure; `PlanExpired` via `app:check-expired-subscriptions`; renewal query fixed (`title` not `name`).
- [x] Scheduled `app:check-renewals` (daily 08:00) and `app:check-expired-subscriptions` (daily 08:15).
- [x] **Orphan template:** `password_reset_link` — wired by overriding `sendPasswordResetNotification()` in `User` model; builds the reset URL, queues `DynamicEmail` with `{{ reset_link }}`; falls back to Laravel default if template is missing.

### Home page dynamic content
- [x] **Yes.** Home (`frontend/unifieds/index.blade.php`) uses `page_content()` for hero badge, title, and description — same pattern as footer, search meta, and unified index body. There is no `pagecontent()` helper; the correct helper is `page_content()`.

### Impersonation → React portal
- [x] **Working.** Admin impersonate logs in as target user, redirects to `route('dashboard')` → `DashboardRedirectController` sends partners to `url_partner` and buyers to `url_user` from settings. Coverage: `AdminImpersonateTest`.

### Blade inline PHP / CSS / JS
- [x] **Frontend inline JS/CSS extraction complete (incremental).** Created `public/frontend/js/` with `event-booking.js` (248-line event ticket booking logic), `product-gallery.js` (thumbnail switcher), and `auth.js` (password toggle). Extracted inline CSS from `_pagination.blade.php`, `_breadcrumbs.blade.php`, and `_quote_sidebar.blade.php` into `public/frontend/css/style.css`. Deleted two dead/orphaned Blade files (`2_detail_head_extra.blade.php`, `_guest_partner.blade.php`). Admin panel inline CSS/JS deferred — not shipped to CodeCanyon buyers in source form.

### Permissions vs roles
- [x] **Mixed — prefer permissions for admin routes.** Admin routes already use `can:manage-*` and `can:app-settings` middleware (Spatie permissions). API routes use `role:partner|admin` middleware. Policies exist on some resources (e.g. `ThemePolicy`). **Recommendation:** keep roles for portal routing (partner vs buyer vs admin); use permissions for admin CRUD gates; add policies for partner API mutations where missing. **Done:** added `manage-marketing` permission to `RolesAndPermissionsSeeder` (was used in routes but never seeded); created `App\Traits\AuthorizesOwnership` with generic `authorizeOwner(mixed $model, string $ownerField = 'user_id')` method; wired trait into 5 direct-ownership partner controllers (`AutoController`, `ClassifiedController`, `EventController`, `JobListingController`, `ServiceController`) and removed their inline duplicate methods.

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

- [x] the buyer app does not load correct title, favicon, and logo, and more problems like this, fix them (see seller portal for reference)

--------------------

- [x] Login screen CSS without Vite build — guest layout falls back to `public/vendor/npm/*` + `frontend/css/style.css`

--------------------

- [x] the dist version of buyer and seller panels change URL in the browser, which is fake and it becomes 404 when we refresh the browser.

- [x] on the buyer login screen, can you show an eye icon to show password

-----------------

- [x] can you show alert messages on login screen of buyer panel just like seller panel, either success or error with detail.

-----------------

- [x] https://demo.sellio.vebdez.com/products/[slug] → https://demo.sellio.vebdez.com/product/[slug]

-------------------------

- [x] Platform ecosystem URLs: leave blank/unverified with placeholders; admin warning + HTTP verify + Connected tick (not pre-filled demo URLs).

Public Storefront URL
https://demo.sellio.vebdez.com
Admin Control Panel URL
https://demo.sellio.vebdez.com/admin
Partner Portal URL
https://demo.sellio.vebdez.com/seller
Customer App URL
https://demo.sellio.vebdez.com/buyer

-----------------

- [x] Floating admin warning to fix storage link after fresh install (`/admin/system/maintenance`)

--------------------

- [x] Buyer panel "View Details" — module-aware storefront URLs (properties, events, vehicles, services, jobs, classifieds, product)

---------------------

- [x] Dist buyer/seller: deep URL refresh blank page — Vite `base` + `%BASE_URL%` static assets (rebuild + redeploy required)

-----------------

- [x] Introduction exit popup — replaced 10% OFF email capture with free installation help + documentation/demos/support CTAs

-------------------

- [x] **Seller panel empty screens (dist):** root cause is usually wrong `public/config.js` apiUrl — added error toasts + empty states on Messages, Notifications, Reviews, Customers, Settings.
- [x] **Customer directory blank on mobile:** table was `hidden lg:block` only — added card layout + empty state.
- [x] **Product analytics empty:** `AnalyticsService::getDetailedListingPerformance()` now includes Product + order revenue.
- [x] **Customer directory missing ecommerce buyers:** `CustomerService` now aggregates product `OrderItem` records.
- [x] **Profile settings empty:** load error UI + widened `ProfileUpdateRequest` authorize for admin demo accounts.

### Realtime messaging plan (Pusher) — recommendation

**Phase 0 (current, no Pusher):** REST + poll on page load; `PartnerNotificationService::syncUnread()` builds notifications from DB activity; buyer notifications auto-seed on first API call.

**Phase 1 (optional, low scope):** Laravel Broadcasting + Pusher (or Laravel Reverb self-hosted) for:
- `NewMessageSent` → seller/buyer message threads
- `PartnerAlertNotification` → notification badge increment

**Phase 2:** Presence channels for “typing…” and online status.

**Config surface:** `.env` keys `PUSHER_APP_*`, `BROADCAST_CONNECTION=pusher`; expose read-only app key/cluster to portals via `config.js` (`pusherKey`, `pusherCluster`). Keep REST fallback when broadcasting disabled (CodeCanyon buyers without Pusher account).

**Why not mandatory:** Sellio ships as self-hosted marketplace; polling + refresh is enough for v1; Pusher is an upgrade path for high-traffic demos.

------------------

- [x] Buyer panel: removed Wallet/Billing tab (not needed for buyers).
- [x] Buyer Settings → Backend tab: shows live `config.js` values instead of hardcoded `VITE_STOREFRONT_URL=http://localhost:3000`.
- [x] Two-Factor Authentication: “Coming soon” badge (buyer Security tab + seller Settings cards); removed fake QR modal.
- [x] Buyer notifications: `collectionData()` parsing + error toast on fetch failure.

-----------------

- [x] Documentation — live demo access links updated: added separate "Laravel Storefront" and "Next.js Storefront" links alongside Installer and Marketing page.

- [x] Documentation — Installation section now opens on FTP/cPanel tab with "Recommended for shared hosting" badge; a callout above both tabs guides users to pick the right method.

- [x] Documentation — FTP upload step clarified: "Upload the **contents** of the `backend/` folder to your web root (`public_html`) — not the folder itself. Distribution packages include pre-built `vendor/`, `public/build/`, and `public/vendor/`."

- [x] Documentation — "Contact support via Envato" link updated to `https://codecanyon.net/user/vebdez#contact`; replaced placeholder `mailto:support@sellio-platform.test`.

- [x] 419 Page Expired (and similar error pages) — applied custom branded design. Created `419.blade.php`, `500.blade.php`, `503.blade.php`; refreshed `404.blade.php` and `403.blade.php` to use storefront tokens (`--color-primary`, `btn-primary-theme`). Standalone pages (500/503) follow `db-error.blade.php` pattern.

- [x] Branding consistency — version standardized to `v2.4.0` across all surfaces: documentation, error screens, loading screens, installer, etc. (commit `b0c302e5`)

- [x] blade frontend: Browse Popular Services — capped `$serviceCategories->take(4)` and used capped count for dynamic column calc; no empty space in the row.

- [x] the blade frontend, footer is not perfectly designed. it is not balanced including the newsletter subscription. Balanced to 4 equal col-lg-3 columns (brand + 3 link cols); improved newsletter strip alignment and bottom bar with Privacy/Terms links.

- [x] login / register and other auth pages have UIUX bugs. Fixed: `is-invalid` class now applied to `password_confirmation` on register and reset-password; removed focus `translateY` layout-jump; cleaned `is-invalid` background-image conflict on pill inputs; social divider badge background uses theme token instead of hardcoded `bg-white`.

---------------------

- [x] The theme switcher should appear after few seconds and somehow also indicate to the user that it is draggable position. (`ThemeSwitcherClient`: widget hidden on mount, slides in from left after 2.5 s with a spring + left/right nudge animation (`ts-enter-nudge`) to hint movement; 2×3 dot drag-handle icon added to button left edge.)

- [x] Increased the theme switcher's appearance delay from 2.5s to 6s in `src/components/ThemeSwitcherClient.tsx`.

- [x] The theme icon should have two cursor changes, one should be for dragging and other should indicate the clicking. (Drag-handle zone: `cursor: grab` / `grabbing` when dragging; button body: `cursor: pointer`. `onMouseDown` moved to the drag-handle span only so the click and drag zones are independent.)



- [x] Buyer panel main loading screen — redesigned with branded logo mark, animated progress bar, and "Loading your dashboard" copy.

- [x] Buyer panel `/messages` inbox — sidebar shows skeleton placeholders during load; no more "zero messages" flash.

- [x] Admin dashboard — queue worker warning already implemented: `QueueHealthService` feeds `_system_status` partial on the dashboard showing `worker_up`, failed job count, and stale/pending jobs.

- [x] Real-time messaging (seller ↔ buyer) — new messages appear on both sides without page refresh; Laravel Echo + Pusher integrated.

- [x] Enter key sends message immediately and clears input; auto-scroll to latest message on load and on send (both seller and buyer panels).

- [x] Buyer panel `/messages` — right-side chat area now shows a pulse skeleton while `loading` is true; "Select an active conversation…" placeholder only appears after conversations have loaded.

- [x] Seller panel messages layout — tightened inbox/listing split proportions.

- [x] Real-time: buyer messages now appear in seller panel without page refresh.

- [x] Seller panel thread — replaced "No messages in this thread yet." with a loading skeleton while thread loads.

- [x] Echo/Pusher real-time — root cause identified and resolved (Sanctum guard on channels, SafeBroadcast wrapper).

- [x] Buyer chat read receipts — implemented with real-time updates.

- [x] Seller message timestamp — time format correct on send with no delay.

- [x] Message sending indication — animated in-flight indicator shown while message saves to database.

- [x] Storefront favicon — replaced default Next.js favicon with branded one; dynamic SEO metadata wired.

- [x] Storefront SEO — `robots.txt`, `sitemap.xml`, and per-page listing metadata verified and working.

- [x] Laravel auth pages (login/register) — redesigned and aligned with shared partials and plain copy.

- [x] Pusher/Echo test files — moved to non-production `_development/` folder.

- [x] Production cleanup — dev artifacts moved to `_development/` folder.

- [x] Buyer panel online indicator — replaced fake "Active" green light; real presence detection via Echo (`fix(buyer-chat): remove fake online presence indicators`).

- [x] Buyer panel `/messages` — duplicate of above; resolved by the same change.
- [x] Partner login screen: dynamic logo from backend — logo was already fetched via `getBrandSettings()` and `brand?.site_logo`; confirmed working.

- [x] Password field label was "Security Key" — changed to "Password" in `apps/seller/src/pages/Login.tsx`.

- [x] Seller dashboard AI/studio labels — replaced all user-visible "Studio" references with normal marketplace copy: "Partner Access" on login, "Sign In" button, sidebar "Seller Portal"/"Seller Account"/"Dashboard", page headers (Wallet, Messages, Settings), "Listing Photos" in MediaStudio, "Photos & Media" section headings across all 7 create forms, loading spinners, and organizer/company placeholders.

- [x] Chat window shows two login buttons — root cause was `LiveChatWidget.tsx` auth phase showing a "Log in / Register" tab-toggle row plus a "Sign in & chat" submit button simultaneously. Fixed by removing the tab row; replaced with a plain text link below the submit button ("No account? Register" / "Already have an account? Sign in"). Updated `chat.css`: removed `.sl-chat-auth-toggle` styles, added `.sl-chat-auth-switch`.

- [x] Header CTA button: was always linking to `url_partner` regardless of who clicked it. Now auth-aware: partners/admins → seller portal, logged-in buyers → "Become a Seller" → register, guests → "Post Listing" → register. Fixed in `frontend/_partials/_header.blade.php`.

- [x] Footer squeezed (all unifieds_* themes share the same footer): added `py-5` to the `container-xl` wrapper in `frontend/_partials/_footer.blade.php` for vertical breathing room. Applies to all themes including unifieds_minimal and unifieds_mega.

- [x] Classifieds single listing chat vs inquiry: no inquiry route exists for classifieds (only autos have one). Classifieds use the conversation/chat flow (`conversation.start`). Added `@auth/@else` guard to the "Send Message" button so guests see "Sign in to Message" (previously silently redirected to login). Same guard applied to the autos `_contact_dealer.blade.php`.

- [x] unifieds_* themes content feels like theme demo — needs seeded demo data to look like a finished marketplace. Fixed: (1) created `HomePageContentSeeder` that seeds realistic hero/discovery/footer copy for the `laravel_blade` content scope; (2) replaced hardcoded "1.2k+" CTA metric with a dynamic sum of all active module listing counts from `HomeDataService::$totalListingsCount`; (3) registered seeder in `DatabaseSeeder` before `PageContentMediaSeeder`.


404, 403, 419, 500, 503 
should we make their titles and other content dynamic? is it logically valid?
should we keep the css inline or external file?


404, 403, 419, 500, 503 how can i see them in browser?
- [x] buyer dashboard keep showing 1 unread message, even i have opened all the chats one by one. (Root cause: StatsContext loaded `messagesCount` once on mount and never refreshed after `markRead()`. Fix: `MessagesView` now calls `refreshStats()` after each `markRead()` success, and resets that conversation's local `unread` to 0.)

TODO
Support link and email, are still pending, remind me later


- [x] in the seeders/migration files, please check the logic that no listings with Draft, expired, pending, etc should be published on the frontend. (All list-page queries go through `scopeActive` / `scopeVisibleTo` — correct. Fixed three detail-page gaps: `EventController::show()` had no guard; `AutoController::show()` only checked `is_published`; `ProductController::show()` had no filter at all. Also fixed `PendingListingsSeeder` pending Events and Classifieds missing explicit `status = 'pending'`.)


- [x] is the laravel frontend design based on css tokens? (Yes. `:root` defines `--primary-color`, `--primary-dark`, `--color-*` aliases, `--radius-card`, `--shadow-*` etc. Bootstrap's `btn-primary`, `text-primary`, `bg-primary`, `btn-outline-primary` are all overridden to resolve through those tokens. Custom utility classes `btn-primary-theme`, `filter-label`, `glass-surface`, `card-glass` also use tokens. 271 uses across 46+ blade files. Only minor non-token color: `#eee` on map-placeholder divs in 3 `_pickup_location_card.blade.php` files — negligible.)



in the admin panel, we have notifications showing on top right, they are zero, can you fix them?



in the frontend footer, the newsletter form does not seem fit in this design, please redesign the full footer once again. Also add social icons.


in the laravel frontend hero, the search form for each tab is too simple, can you make it with some extra options as well.

the hero search forms should have their own categories, locations, etc, assigned to specific vertical.


the newsletter subscribe section has extra space on top which does not look good.

footer {

    /* padding: 3rem 0 1.5rem; */ 
}

on the login screen, the social login buttons lose readibitliy on hover

on the login screen, left side content lose colors / readiblity, and also need to be fixed for vertical center.
also add logo dynamically.

on the login screen the password placeholder color is too dark, fix it.

i wrote the content on admin dashboard (all pages of admin portal) with the help of Ai tool. Now a days all people are using Ai, therefore the content is easily guessed that it is written by Ai. 
Can we use different english words, that feel like manually chosen and most commonly used on codecanyon dashboards.



The laravel frontend hero section looks like very common design that Ai Tools generally create.
Can you suggest something different? Unique UIUX? As well as changing the fonts, colors, spacing throughout all the layout and theme?



http://192.168.10.7:8000/login
the login screen is not following the css design tokens, please fix it.