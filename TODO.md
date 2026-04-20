# SELLIO PLATFORM - TODO

## ✅ COMPLETED

### Architecture & DevOps
- [x] **Architecture Doc:** Created `STRUCTURE.md`
- [x] **DevOps:** Root `.gitignore` updated
- [x] **Architectural Refactor:** Approve/Disapprove/Edit/Delete decentralized to dedicated vertical controllers
- [x] **DB Error Screen:** Professional glassmorphic error view + `bootstrap/app.php` handler
- [x] **Fresh DB Migration:** Successfully performed `migrate:fresh --seed` to reset the environment
- [x] **Logout 419 Error:** Replaced GET links with secure POST forms (`_adminbar.blade.php`, `_header.blade.php`) to fix CSRF token failure on logout
- [x] **Frontend Image 404:** Updated `APP_URL` from `localhost:8000` to `http://127.0.0.1:8000` to fix Spatie Media URL domain generation
- [x] **Product Duplication Route:** Added missing route with proper middleware

### Theme System
- [x] **Fallback Images:** Resolved via absolute `asset()` paths in `HasImageAccess.php`
- [x] **Theme Library:** Fixed visibility and added icons to vertical tabs
- [x] **Dynamic Theme Fonts:** Implemented Google Fonts loader for Lora/Playfair Display
- [x] **Admin Live Font Preview:** Real-time Google Font loading and preview in theme editor
- [x] **Global Body Glow:** Ambient background glow now dynamic and synchronized with theme primary color
- [x] **Dynamic Hero Section:** Background gradient and active tab colors now use theme variables

### UI/UX
- [x] **Login & Register UIUX:** Themed with active theme variables
- [x] **Laravel Frontend Header:** Dynamic theme-aware menu items fixed
- [x] **`hide_site_name` for Laravel Frontend:** Implemented in Blade header
- [x] **Laravel Frontend UIUX Audit:** Global theme hardening and pagination standardization complete
- [x] **Settings Explorer UX:** Made all 7 category cards fully clickable (full-card link)
- [x] **Admin → Frontend Link:** Added icon-only quick-link in dashboard
- [x] **Admin UI Improvements - Table Consistency:** Added unified thumbnail classes and pagination to Products, Properties, Autos, Events, Jobs, Services, Classifieds, Listings
- [x] **Admin UI Improvements - Search Filters:** Implemented module‑specific search filters for Products, Properties, Autos, Events, Jobs, Services, Classifieds
- [x] **Admin UI Improvements - Pagination:** Added 15‑per‑page pagination to Products, Properties, Services, Classifieds, Jobs, and others
- [x] **Null‑Safe Property Access:** Updated forms for Locations, Types, etc. using `$model?->property`
- [x] **Search Forms & Unified Pagination Footer:** Added search boxes and standardized pagination footers across Locations, Categories, Types, Amenities, Features, Tags, Brands

## 🟡 LONG-TERM

- [ ] can we add multiple themes in the nextjs app?

---

## NEW ITEMS FROM TODO.TXT

### Completed
- [x] Attributes pages - DataTable pagination (Amenities, Categories, Features, Locations, Types, Tags, Brands)
- [x] Search forms - one row centered (Product Orders, Property Bookings, Auto Inquiries, Event Bookings, Job Applications, Service Quotes, Classified Inquiries)
- [x] Remove ID column from Payments and Subscriptions pages
- [x] Reports pages - match main dashboard design
- [x] Add New button right-aligned on taxonomy pages

### Completed (continued)
- [x] Title field auto-fill/combobox across all forms (datalist)
- [x] Add icons to labels - Properties, Products, Autos, Events, Jobs, Services, Classifieds
- [x] Add icons to labels - Blog, Features, Brands, Categories, Types, Locations, Amenities, Tags, Plans, Withdrawals, etc.
- [x] Add icons to labels - Tickets, Subscriptions, Payment Gateways, Pages, Advertisements, Addons

### Completed (All tasks done)
- [x] Remove ID column - payments, subscriptions, users, roles, permissions, newsletter, tickets
- [x] DataTable alignment - blogs, newsletter, payment-gateways
- [x] Tab pills UI consistency - plans/create pattern applied
- [x] Search forms - one-row centered layout (7 pages)
- [x] Gallery search form - theme coloring
- [x] Email templates - button styling
- [x] Roles/Permissions Add New button theme
- [x] Tickets Add New button added
- [x] Blog create - comment toggle UI polish

## 📋 NEXT ACTIONS

### Bookings & Inquiries
- [x] **Product Orders Search:** Add search by product name.
- [x] **Property Bookings:** Fix guest name display (check full_name vs user relationship).
- [x] **Auto Inquiries:** Add search by person name and/or vehicle.
- [x] **Event Bookings:** Fix search form column sizes and centered; add event name combobox/autofill.
- [x] **Job Applications:** Fix search form column sizes and centered; add job title combobox/autofill.
- [x] **Service Quotes:** Fix search form column sizes and centered; add service name combobox/autofill.
- [x] **Classified Inquiries:** Fix search form column sizes and centered; add classified ad name combobox/autofill.

### Taxonomy & Management
- [x] **Taxonomy Pages Cleanup (Locations, Categories, Types, Amenities, Features, Tags, Brands):** Remove manual search form and pagination (keep DataTables versions); adjust card header alignment.
- [x] **Taxonomy Pagination Styling:** Add classes "row px-4 pb-3" to DataTables pagination row.

### Finance & Payments UI
- [x] **Payments UI Cleanup:** Remove separate ID column; use badges in existing columns.
  - `/admin/payments`
  - `/admin/payments/failed`
- [x] **Withdrawals UI Cleanup:** Remove separate ID column; use badges in existing columns.
  - `/admin/withdrawals/pending`
  - `/admin/withdrawals`
  - `/admin/withdrawals/failed`
- [x] **Payments DataTables Alignment:** Align search form to left, entries to right side.
- [x] **Log Offline Payment Button:** Apply theme button styling; scan all pages for buttons missing theme rules.

### Forms & Create Pages - Theme & UI Fixes
- [x] **Payments Create Page:** Fix theme appearance.
- [x] **Profile Edit Page:** Verify submit button matches dashboard design.
- [x] **Auto Inquiries Create:** Fix PHP error.
- [x] **Event Bookings Create:** Fix PHP error.
- [x] **Product Create Tabs:** Fix UI/UX layout appearance.
- [x] **Create Pages UI/UX Improvement:** Add proper icons for field purposes.
  - `/admin/properties/create`
  - `/admin/products/create`
  - `/admin/autos/create`
  - `/admin/events/create`
  - `/admin/jobs/create`
  - `/admin/services/create`

### Dashboard Analytics
- [x] **Reports & Analytics:** Apply dashboard design UI/UX inspired by main dashboard.
- [x] **Revenue & Payments:** Apply dashboard design UI/UX inspired by main dashboard.
- [x] **Booking Summary:** Apply dashboard design UI/UX inspired by main dashboard.
- [x] **Property Occupancy:** Apply dashboard design UI/UX inspired by main dashboard.

---

### Previously Completed
- [x] UI Verification - pagination, search, and SweetAlert dialogs
- [x] Documentation - ADMIN_UI_GUIDE.md created
- [x] Fix Product Orders Controller - null-safe blade template access
- [x] Integrate SweetAlert2 globally in adminlte.php

---