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
- [ ] **Admin Bookings Index**: Investigate 500 Error at `/admin/bookings` ("Cannot end a section without first starting one").
- [ ] **Create Page Errors**: Verify and fix potential errors on `create` pages for the following:
    - [ ] Locations (`/admin/locations/create`)
    - [ ] Categories (`/admin/categories/create`)
    - [ ] Types (`/admin/types/create`)
    - [ ] Amenities (`/admin/amenities/create`)
    - [ ] Features (`/admin/features/create`)
    - [ ] Tags (`/admin/tags/create`)
    - [ ] Brands (`/admin/brands/create`)

### Logic & Consistency
- [ ] **Combobox Implementation**: Ensure "Title/Name" fields use searchable comboboxes where they currently have separate input/select fields (e.g., Event/Job/Service bookings).

---

## ✅ COMPLETED (HISTORY)

### Architecture & Infrastructure
- [x] **Architecture Doc:** Created `STRUCTURE.md`.
- [x] **DevOps:** Root `.gitignore` and `APP_URL` (`127.0.0.1:8000`) updated.
- [x] **DB Reset:** Fresh migration and seeding successful.
- [x] **Error Handling:** Professional glassmorphic DB error screen implemented.
- [x] **Security:** CSRF 419 Logout error fixed (GET to POST).

### UI/UX Standardization
- [x] **DataTables Consistency**: Search bar to Left, "Per Page" to Right on all management pages.
- [x] **Thumbnail Style**: Unified `.table-img-preview` across all modules.
- [x] **Pagination**: Fixed spacing/padding at the bottom of tables.
- [x] **Navigation**: Added icon-only quick-link from Admin to Frontend.
- [x] **Settings UX**: Made category cards fully clickable.

### Module Specific Improvements
- [x] **Media Columns**: Dedicated Media columns added to Products, Properties, Autos, Events, Jobs, Services, Classifieds.
- [x] **Search Filters**: Module-specific filtering (category, location, brand) implemented for all listing types.
- [x] **Theme System**: Real-time Google Font preview, ambient body glow, and dynamic gradient synchronization.
- [x] **Bug Fixes**: 
    - [x] Fixed `Email Templates` and `Tickets` PHP errors (removed broken links).
    - [x] Fixed `SettingController` `$themes` undefined bug.
    - [x] Fixed `Listing` `edit()` runtime error.
    - [x] Fixed `@endendif` ParseError in listings.

---

## 📋 REFERENCE LINKS (FROM FEEDBACK)
- Admin Gallery: `http://127.0.0.1:8000/admin/gallery`
- Bookings Index: `http://127.0.0.1:8000/admin/bookings`
- Product Orders: `http://127.0.0.1:8000/admin/product-orders`
- Maintenance Settings: `http://127.0.0.1:8000/admin/system/maintenance`