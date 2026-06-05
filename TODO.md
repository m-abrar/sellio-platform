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

when seeding fresh database, does our seller/partner subscibe to a plan?

--------------------------













