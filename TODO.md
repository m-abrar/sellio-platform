# SELLIO PLATFORM - MASTER TODO

## 🔴 HIGH PRIORITY (PENDING)

### UI/UX Refactor & Dashboards
- [ ] **Revamp Analytical Dashboards**: Update UI/UX to match the main dashboard theme (improved cards, background, polish).
    - [ ] Reports & Analytics
    - [ ] Revenue & Payments
    - [ ] Booking Summary
    - [ ] Property Occupancy
- [ ] **Admin Theme Colors**: Apply theme colors to the Gallery page (`/admin/gallery`).
- [ ] **Navigation & Breadcrumbs**: Move "Add New User", "Roles", and "Permissions" buttons to the top right and replace/augment breadcrumbs.
- [ ] **SweetAlerts Integration**: Implement SweetAlerts across the entire admin dashboard for professional feedback.
- [ ] **Attributes UI Polish**: For all attribute pages (Locations, Categories, etc.), ensure the "Add New" button position and font color are consistent.

### Booking Modules Enhancements
- [ ] **Product Orders**: 
    - [ ] Show product name and additional relevant info.
    - [ ] Expand data in the "Customer" column.
    - [ ] In the "Total" column, show quantity, variation, and unit price.
    - [ ] Fix `foreach()` error in `resources/views/admin/product-orders/index.blade.php:134`.
- [ ] **Property Bookings**:
    - [ ] Show category and location of the property.
    - [ ] Fix bug in displaying guest names.
- [ ] **Event Bookings**:
    - [ ] Show category in search fields and results table.
    - [ ] Show `$value` (booking value).
    - [ ] Search by event name instead of long dropdown (implement searchable combobox).
- [ ] **Job Applications**:
    - [ ] Fix missing ID# (#122).
    - [ ] Show more details (category, etc.).
    - [ ] Add more search fields to the form.
    - [ ] Search by job name instead of long dropdown (implement searchable combobox).
- [ ] **Service Bookings**:
    - [ ] Show category, type, and other details.
    - [ ] Add search form to the page (consistent with other modules).

### System & Infrastructure
- [ ] **Multi-Tenant Deployment**: Prepare architecture for horizontal scaling.

---

## 🟡 REPORTED ISSUES / TO INVESTIGATE

### Runtime Errors
- [x] **Admin Bookings Index**: Investigate 500 Error at `/admin/bookings` ("Cannot end a section without first starting one").
- [x] **Create Page Errors**: Verify and fix potential errors on `create` pages for the following:
    - [x] Locations (`/admin/locations/create`)
    - [x] Categories (`/admin/categories/create`)
    - [x] Types (`/admin/types/create`)
    - [x] Amenities (`/admin/amenities/create`)
    - [x] Features (`/admin/features/create`)
    - [x] Tags (`/admin/tags/create`)
    - [x] Brands (`/admin/brands/create`)

### Logic & Consistency
- [ ] **Combobox Implementation**: Ensure "Title/Name" fields use searchable comboboxes where they currently have separate input/select fields (e.g., Event/Job/Service bookings).

---

## 🟠 PENDING RE-EVALUATION (Previously marked as Done)

### Architecture & Infrastructure
- [ ] **Architecture Doc:** Created `STRUCTURE.md`.
- [ ] **DevOps:** Root `.gitignore` and `APP_URL` (`127.0.0.1:8000`) updated.
- [ ] **DB Reset:** Fresh migration and seeding successful.
- [ ] **Error Handling:** Professional glassmorphic DB error screen implemented.
- [ ] **Security:** CSRF 419 Logout error fixed (GET to POST).

### UI/UX Standardization
- [ ] **DataTables Consistency**: Search bar to Left, "Per Page" to Right on all management pages.
- [ ] **Thumbnail Style**: Unified `.table-img-preview` across all modules.
- [ ] **Pagination**: Fixed spacing/padding at the bottom of tables.
- [ ] **Navigation**: Added icon-only quick-link from Admin to Frontend.
- [ ] **Settings UX**: Made category cards fully clickable.

### Module Specific Improvements
- [ ] **Media Columns**: Dedicated Media columns added to Products, Properties, Autos, Events, Jobs, Services, Classifieds.
- [ ] **Search Filters**: Module-specific filtering (category, location, brand) implemented for all listing types.
- [ ] **Theme System**: Real-time Google Font preview, ambient body glow, and dynamic gradient synchronization.
- [ ] **Bug Fixes**: 
    - [ ] Fixed `Email Templates` and `Tickets` PHP errors (removed broken links).
    - [ ] Fixed `SettingController` `$themes` undefined bug.
    - [x] Fixed `Listing` `edit()` runtime error.
    - [ ] Fixed `@endendif` ParseError in listings.

---

## 📋 REFERENCE LINKS (FROM FEEDBACK)
- Admin Gallery: `http://127.0.0.1:8000/admin/gallery`
- Bookings Index: `http://127.0.0.1:8000/admin/bookings`
- Product Orders: `http://127.0.0.1:8000/admin/product-orders`
- Maintenance Settings: `http://127.0.0.1:8000/admin/system/maintenance`

---
**Note:** All tasks have been reset to NOT DONE as per user request to ensure quality and consistency across the platform.


-----------------


http://127.0.0.1:8000/admin/plans/create

ErrorException
resources\views\admin\plans\form.blade.php:3
Undefined variable $plan


--------------


http://127.0.0.1:8000/admin/blogs/create


ErrorException
resources\views\admin\blogs\form.blade.php:3
Undefined variable $blog

--------------------

http://127.0.0.1:8000/admin/gallery
This page needs to be updated for theme colors

---------------------

http://127.0.0.1:8000/admin/payment-gateways
The status column needs better presentation

---------------------

