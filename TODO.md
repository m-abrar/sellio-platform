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

Product detail page needs polishing the UIUX

------------------
http://127.0.0.1:8000/cart
Summary
Subtotal

$0.00 (this is by mistake, it must be some value)

-------------------------

