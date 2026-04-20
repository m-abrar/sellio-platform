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

- [x] **Fix Product Orders Controller:** Fixed null-safe access in blade template for `selected_attributes`.
- [x] **Integrate SweetAlert2:** Enabled globally in adminlte.php config and added to package.json.
- [ ] **UI Verification:** Test pagination spacing, search functionality, and SweetAlert dialogs across all admin pages.
- [ ] **Documentation:** Add `ADMIN_UI_GUIDE.md` describing the new UI patterns and how to extend them.

---

### Open Issues (from previous TODO)

- [x] http://127.0.0.1:8000/admin/bookings – Internal Server Error (Fixed: moved @include inside @section)
- [x] http://127.0.0.1:8000/admin/product-orders – `foreach()` argument must be of type array|object, string given (Fixed: added null-safe checks)
- [x] http://127.0.0.1:8000/admin/bookings/services – Class "Service" not found (Fixed: added import)
- Pagination spacing issues on various admin index pages (now addressed)
- Search form missing on several modules (now added)