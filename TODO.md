# SELLIO PLATFORM - MASTER TODO

## 🔴 HIGH PRIORITY (PENDING)

### UI/UX Refactor & Dashboards
- [ ] **Revamp Analytical Dashboards**: Update UI/UX for Reports & Analytics, Revenue & Payments, Booking Summary, and Property Occupancy to match the main dashboard theme (improved cards, background, and polish).
- [ ] **Admin Theme Colors**: Apply theme colors to the Gallery page (`/admin/gallery`).
- [ ] **Navigation & Breadcrumbs**: Move "Add New User", "Roles", and "Permissions" buttons to the top right and replace/augment breadcrumbs for a cleaner look.
- [ ] **SweetAlerts Integration**: Write a plan and implement SweetAlerts across the entire admin dashboard for professional feedback.

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
- [ ] **Job Applications**:
    - [ ] Fix missing ID# (#122).
    - [ ] Show more details (category, etc.).
    - [ ] Add more search fields to the form.
- [ ] **Service Bookings**:
    - [ ] Show category, type, and other details.

### System & Infrastructure
- [ ] **Multi-Tenant Deployment**: Prepare architecture for horizontal scaling.

---

## ✅ COMPLETED (RECENT & PREVIOUS)

### UI/UX Standardization
- [x] **Standardize DataTables**: Search bar to Left, "Per Page" to Right on all Attribute and Management pages.
- [x] **Combobox Filtering**: Replaced select/input fields with searchable comboboxes (datalist) for Vehicles (Autos), Events, Jobs, Services, and Classifieds.
- [x] **"Add New" Button Alignment**: Moved to top right for Categories, Locations, Amenities, Features, Tags, Brands, and Types.
- [x] **Pagination Spacing**: Fixed spacing/padding for pagination at the bottom of tables.
- [x] **Settings Explorer UX**: Made category cards fully clickable.
- [x] **Admin → Frontend Link**: Added icon-only quick-link in dashboard.

### Critical Bug Fixes
- [x] **Email Templates**: Fixed PHP error by removing broken/missing "Add Template" functionality (system-managed).
- [x] **Tickets Page**: Fixed PHP error by removing broken "Add Ticket" link.
- [x] **Logout 419 Error**: Replaced GET links with POST forms for CSRF security.
- [x] **Frontend Image 404**: Fixed Spatie Media URL domain generation via `APP_URL`.
- [x] **Maintenance Alerts**: Added success/error alert messages to the maintenance page.

### Features & Listings
- [x] **Media Columns**: Unified thumbnail CSS and added dedicated Media columns to Products, Properties, Autos, Events, Jobs, Services, Classifieds.
- [x] **Search Filters**: Module-specific category/location/brand filters implemented for all listing types.
- [x] **Theme Preview**: Real-time Google Font loading and preview in theme editor.
- [x] **Dynamic Theme Fonts**: Implemented Lora/Playfair Display loader.
- [x] **Body Glow**: Ambient background glow synchronized with theme primary color.

---

## 🟡 REPORTED ISSUES / TO INVESTIGATE

- [ ] **Admin Bookings Index**: Investigate 500 Error at `/admin/bookings` ("Cannot end a section without first starting one").
- [ ] **Create Page Errors**: Verify and fix potential errors on `create` pages for Locations, Categories, Types, Amenities, Features, Tags, Brands (Reported in TODO1.txt).