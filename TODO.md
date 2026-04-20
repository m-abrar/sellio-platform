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

## 📋 NEXT ACTIONS

### Bookings & Inquiries
- [ ] **Product Orders Search:** Add search by product name.
- [ ] **Property Bookings:** Fix guest name display (check full_name vs user relationship).
- [ ] **Auto Inquiries:** Add search by person name and/or vehicle.
- [ ] **Event Bookings:** Fix search form column sizes and centered; add event name combobox/autofill.
- [ ] **Job Applications:** Fix search form column sizes and centered; add job title combobox/autofill.
- [ ] **Service Quotes:** Fix search form column sizes and centered; add service name combobox/autofill.
- [ ] **Classified Inquiries:** Fix search form column sizes and centered; add classified ad name combobox/autofill.

### Taxonomy & Management
- [ ] **Taxonomy Pages Cleanup (Locations, Categories, Types, Amenities, Features, Tags, Brands):** Remove manual search form and pagination (keep DataTables versions); adjust card header alignment.
- [ ] **Taxonomy Pagination Styling:** Add classes "row px-4 pb-3" to DataTables pagination row.

### Finance & Payments UI
- [ ] **Payments UI Cleanup:** Remove separate ID column; use badges in existing columns.
  - `/admin/payments`
  - `/admin/payments/failed`
- [ ] **Withdrawals UI Cleanup:** Remove separate ID column; use badges in existing columns.
  - `/admin/withdrawals/pending`
  - `/admin/withdrawals`
  - `/admin/withdrawals/failed`
- [ ] **Payments DataTables Alignment:** Align search form to left, entries to right side.
- [ ] **Log Offline Payment Button:** Apply theme button styling; scan all pages for buttons missing theme rules.

### Forms & Create Pages - Theme & UI Fixes
- [ ] **Payments Create Page:** Fix theme appearance.
- [ ] **Profile Edit Page:** Verify submit button matches dashboard design.
- [ ] **Auto Inquiries Create:** Fix PHP error.
- [ ] **Event Bookings Create:** Fix PHP error.
- [ ] **Product Create Tabs:** Fix UI/UX layout appearance.
- [ ] **Create Pages UI/UX Improvement:** Add proper icons for field purposes.
  - `/admin/properties/create`
  - `/admin/products/create`
  - `/admin/autos/create`
  - `/admin/events/create`
  - `/admin/jobs/create`
  - `/admin/services/create`

### Dashboard Analytics
- [ ] **Reports & Analytics:** Apply dashboard design UI/UX inspired by main dashboard.
- [ ] **Revenue & Payments:** Apply dashboard design UI/UX inspired by main dashboard.
- [ ] **Booking Summary:** Apply dashboard design UI/UX inspired by main dashboard.
- [ ] **Property Occupancy:** Apply dashboard design UI/UX inspired by main dashboard.

---

### Previously Completed
- [x] UI Verification - pagination, search, and SweetAlert dialogs
- [x] Documentation - ADMIN_UI_GUIDE.md created
- [x] Fix Product Orders Controller - null-safe blade template access
- [x] Integrate SweetAlert2 globally in adminlte.php

---