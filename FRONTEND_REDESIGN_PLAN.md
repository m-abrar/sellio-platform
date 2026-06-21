# Frontend Public Views — Redesign Plan

Goal: Remove all glassmorphism (`glass-surface`, `shadow-lg`, `rounded-5`/`rounded-pill` overuse, `fw-800` everywhere)
and establish the editorial system already built on the homepage:
- **DM Serif Display** weight-400 for headings, titles, numbers
- **Plus Jakarta Sans** for body
- Warm orange primary, `--text-dark: #1C1917` for dark sections
- Clean white cards with `1.5px solid rgba(15,23,42,.07)` border, no backdrop-filter
- Badges: `rounded-2` not `rounded-pill`, natural case
- Buttons: `btn-header-cta` for primary actions, arrow links for secondary

---

## ✅ Phase 0 — Homepage (COMPLETE)

| Section | File(s) | Status |
|---|---|---|
| Hero | `unifieds/_partials/_index-hero.blade.php` | ✅ Done |
| Discovery module cards | `unifieds/_partials/_index-body.blade.php` (top) | ✅ Done |
| Section heading system | `public/frontend/css/style.css` global rule | ✅ Done |
| Property card | `unifieds/_partials/_property-card.blade.php` | ✅ Done |
| Auto card | `unifieds/_partials/_auto-card.blade.php` | ✅ Done |
| Event card | `unifieds/_partials/_event-card.blade.php` | ✅ Done |
| Blog card | `blogs/_partials/_card.blade.php` | ✅ Done |
| Careers & Classifieds split | `unifieds/_partials/_index-body.blade.php` + `_job-list-item.blade.php` + `_classified-mini-card.blade.php` | ✅ Done |
| Service category cards | `unifieds/_partials/_index-body.blade.php` | ✅ Done |
| Taxonomy chips & Location pills | `unifieds/_partials/_index-body.blade.php` | ✅ Done |
| CTA section | `unifieds/_partials/_index-cta.blade.php` | ✅ Done |
| Footer | `frontend/_partials/_footer.blade.php` | ✅ Done |

---

## ✅ Phase 1 — Detail Pages (COMPLETE)

High-traffic, conversion-critical. One module at a time.

### 1a. Property — Sale Detail
**Main file:** `properties/show/sale-property-detail.blade.php`
**Partials:**
- `partials/sale/_header.blade.php` — hero image + price badge + badges
- `partials/sale/_summary_features.blade.php` — beds/baths/area chips
- `partials/sale/_amenities.blade.php` — amenity pill grid
- `partials/sale/_contact_agent_sidebar.blade.php` — sidebar agent card (glass)
- `partials/sale/_contact_form_sidebar.blade.php` — sidebar inquiry form (glass)
- `partials/sale/_contact_form_inline.blade.php` — inline contact form
- `partials/sale/_neighborhood.blade.php` — location scores
- `partials/sale/_scores.blade.php` — walk/transit/bike scores
- `partials/sale/_mortgage_calculator.blade.php` — calculator card
- `partials/sale/_policies.blade.php` — policies block
- `partials/sale/_tours_and_documents.blade.php` — tour/doc links
- `partials/_description.blade.php` — shared description block
- `partials/_breadcrumbs.blade.php` — shared breadcrumb
- `partials/_gallery.blade.php` — shared image gallery
- `partials/_related.blade.php` — shared related listings
- `partials/_map.blade.php` — shared map embed
- `_partials/_reviews.blade.php` — shared reviews (global partial)

### 1b. Property — Vacation Rental Detail
**Main file:** `properties/show/vacation-property-detail.blade.php`
**Partials:**
- `partials/vr/_header.blade.php`
- `partials/vr/_summary_features.blade.php`
- `partials/vr/_amenities.blade.php`
- `partials/vr/_sidebar.blade.php`
- `partials/vr/_sidebar-booking.blade.php` — booking widget (glass)
- `partials/vr/_sidebar-host.blade.php` — host card
- `partials/vr/_sidebar-actions.blade.php`
- `partials/vr/_availability_calendar.blade.php`
- `partials/vr/_seasonal_prices.blade.php`
- `partials/vr/_reviews.blade.php`
- `partials/vr/_local_guide.blade.php`
- `partials/vr/_rules.blade.php`
- `partials/vr/_sticky_footer_cta.blade.php` — mobile sticky CTA
- Shared: `_description`, `_breadcrumbs`, `_gallery`, `_related`, `_map`

### 1c. Property — Default Detail
**Main file:** `properties/show/default-property-detail.blade.php`
(Fallback variant — shorter, reuses most sale partials)

### 1d. Auto — Vehicle Detail
**Main file:** `autos/show/vehicle-detail.blade.php`
**Partials:**
- `partials/_header.blade.php` — gallery + price + badges
- `partials/_breadcrumbs.blade.php`
- `partials/_quick_specs.blade.php` — mileage/gear/fuel chips
- `partials/_features.blade.php` — feature list
- `partials/_specifications_table.blade.php` — specs table
- `partials/_finance_calculator.blade.php` — finance calc card

### 1e. Product — Physical Detail
**Main file:** `products/show/physical-product-detail.blade.php`
(+ any partials inside `products/show/partials/`)

### 1f. Services — Three Variants
**Main files:**
- `services/show/bookable.blade.php`
- `services/show/consultation.blade.php`
- `services/show/quotable.blade.php`
**Shared partials:**
- `partials/_header.blade.php` / `_listing_header.blade.php`
- `partials/_breadcrumbs.blade.php`
- `partials/_quick_specs.blade.php`
- `partials/_operating_hours.blade.php`
- `partials/_location_map.blade.php`
- `partials/_service_list_bookable.blade.php`
- `partials/_service_list_quotable.blade.php`
- `partials/sidebar/_consultation_sidebar.blade.php`
- `partials/_styles_extra.blade.php`

### 1g. Job — Detail + Application
- `jobs/show/job-detail.blade.php` + `partials/_header.blade.php`, `_description.blade.php`, `_breadcrumbs.blade.php`
- `jobs/application/show.blade.php` — application form page

### 1h. Event — Detail
- `events/show/` (check for show file) + `partials/_breadcrumbs.blade.php`
- `events/booking/checkout.blade.php`

### 1i. Classified — Detail
- `classifieds/show/show.blade.php` + `partials/_breadcrumbs.blade.php`

### 1j. Blog Post — Detail
- `blogs/show/show.blade.php` + `partials/_breadcrumbs.blade.php`

---

## ✅ Phase 2 — Index / Browse Pages (COMPLETE)

Listing pages that show cards in a grid with filters.

| Page | File | Notes |
|---|---|---|
| Properties index | `properties/index.blade.php` | Uses shared filter shell |
| Properties search | `properties/search.blade.php` (if exists) | |
| Autos index | `autos/index.blade.php` | |
| Products index | `products/index.blade.php` | |
| Products search | `products/search.blade.php` | |
| Services index | `services/index.blade.php` | |
| Jobs index | `jobs/index.blade.php` | Uses `_partials/_job-card.blade.php` |
| Events index | `events/index.blade.php` | |
| Classifieds index | `classifieds/index.blade.php` | |
| Classifieds search | `classifieds/search.blade.php` | |
| Blog index | `blogs/index.blade.php` | |
| Blog search | `blogs/search.blade.php` | |
| Unifieds index | `unifieds/index.blade.php` | All-modules landing |
| Category show | `unifieds/categories/show.blade.php` + `categories/show.blade.php` | Taxonomy landing |
| Brand show | `unifieds/brands/show.blade.php` + `brands/show.blade.php` | |
| Tag / Type show | `unifieds/tags/show.blade.php`, `unifieds/types/show.blade.php`, etc. | |
| Partner show | `unifieds/partners/show.blade.php` + `partners/show.blade.php` | Seller profile page |

**Shared index/filter components:**
- `_partials/_page-heading.blade.php` — section page header
- `_partials/_filter-shell.blade.php` — filter sidebar wrapper
- `_partials/_mobile-filter-button.blade.php`
- `_partials/_listing-empty-state.blade.php`
- `_partials/_listing-pagination.blade.php`
- `_partials/_pagination_links.blade.php`
- `jobs/_partials/_sidebar-filter.blade.php`
- `services/_partials/_sidebar_filter.blade.php`

---

## ✅ Phase 3 — Auth Pages (COMPLETE)

Public-facing login/register flows. Currently not following CSS design tokens.

| Page | File |
|---|---|
| Login | `auth/login.blade.php` |
| Register | `auth/register.blade.php` |
| Forgot password | `auth/forgot-password.blade.php` |
| Reset password | `auth/reset-password.blade.php` |
| Verify email | `auth/verify-email.blade.php` |
| Confirm password | `auth/confirm-password.blade.php` |
| Partner login | `auth/login-partner.blade.php` |
| Partner register | `auth/register-partner.blade.php` |
| Shared auth partials | `auth/_partials/_form_card_start.blade.php`, `_form_card_end.blade.php`, `_marketing_panel.blade.php`, `_social_login.blade.php` |

---

## Phase 4 — Booking & Checkout Flows (NEXT)

Conversion-critical transaction screens.

| Flow | Files |
|---|---|
| Property booking | `properties/booking/checkout.blade.php`, `payment.blade.php`, `confirmation.blade.php`, `_partials/_booking-stepper.blade.php` |
| Event booking | `events/booking/checkout.blade.php` |
| Product checkout | `products/checkout.blade.php` |
| Auto inquiry | `autos/inquiry/confirmation.blade.php` |

---

## Design Tokens Reference

```css
--primary-color         /* warm orange */
--primary-color-rgb     /* for rgba() use */
--primary-dark          /* darker orange hover */
--text-dark: #1C1917    /* near-black warm */
--font-heading          /* DM Serif Display */
--font-main             /* Plus Jakarta Sans */
```

**Recurring fixes per file:**
1. `glass-surface` → remove class; add `.my-card { background: #fff; border: 1.5px solid rgba(15,23,42,.07); }` in CSS
2. `fw-800` on headings → DM Serif via CSS (or `font-family: var(--font-heading); font-weight: 400`)
3. `rounded-pill` badges → `rounded-2`, natural case text
4. `shadow-lg` → remove or replace with `0 10px 28px rgba(28,25,23,.1)`
5. `text-danger` geo icons → `lc-geo-icon`
6. ALL CAPS button text → natural case
7. Verify with Playwright after each phase
