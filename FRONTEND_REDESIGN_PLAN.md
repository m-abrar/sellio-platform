# Frontend Public Views — Redesign Plan

**Status: Phases 0–6 committed. See "Remaining Items" at bottom for outstanding fixes found during verification.**

Goal: Remove all glassmorphism and establish the editorial design system built on the homepage:
- **DM Serif Display** weight-400 for headings, titles, numbers
- **Plus Jakarta Sans** for body
- Warm orange `--primary-color`, `--text-dark: #1C1917` for near-black
- Clean white cards with `border: 1.5px solid rgba(15,23,42,.07)`, no `backdrop-filter`
- Badges: `rounded-2`, natural case (never `rounded-pill`, never ALL CAPS)
- Primary CTAs: `btn-primary` / `btn-header-cta`; secondary: `btn-outline-secondary fw-semibold`

---

## ✅ Phase 0 — Homepage (COMPLETE)

> **Verified:** `unifieds/_partials/`, `blogs/_partials/`, `frontend/_partials/_footer.blade.php` — zero `glass-surface`, `btn-primary-theme`, or `text-primary-color` found.
>
> **Two badge issues found in card partials (not fixed in this phase):**
> - `blogs/_partials/_card.blade.php:13` — category badge still `rounded-pill fw-bold` → should be `rounded-2 fw-semibold`
> - `events/_partials/_card-event.blade.php:23` — price/free badge still `rounded-pill fw-800` → should be `rounded-2 fw-semibold`
>
> These are on card image overlays and slipped through Phase 0 scope. Logged in **Remaining Items**.

| Section | File(s) |
|---|---|
| Hero | `unifieds/_partials/_index-hero.blade.php` |
| Discovery module cards | `unifieds/_partials/_index-body.blade.php` |
| Section heading system | `public/frontend/css/style.css` global rule |
| Property card | `unifieds/_partials/_property-card.blade.php` |
| Auto card | `unifieds/_partials/_auto-card.blade.php` |
| Event card | `unifieds/_partials/_event-card.blade.php` |
| Blog card | `blogs/_partials/_card.blade.php` |
| Careers & Classifieds split | `unifieds/_partials/_index-body.blade.php`, `_job-list-item.blade.php`, `_classified-mini-card.blade.php` |
| Service category cards | `unifieds/_partials/_index-body.blade.php` |
| Taxonomy chips & Location pills | `unifieds/_partials/_index-body.blade.php` |
| CTA section | `unifieds/_partials/_index-cta.blade.php` |
| Footer | `frontend/_partials/_footer.blade.php` |

---

## ✅ Phase 1 — Detail Pages (COMPLETE)

> **Verified:** All listed detail page files — zero `glass-surface`, `btn-primary-theme`, `text-primary-color` found.
>
> **One shared partial was out of scope and not cleaned:**
> - `frontend/_partials/_reviews.blade.php` — this global reviews widget is used on every detail page but was not included in Phase 1 scope. Found: `rounded-pill` on submit button (line 94) and login button (line 103), `fw-800` on body labels (lines 2, 50, 76, 80), `rounded-5` on form card (line 75). Logged in **Remaining Items**.
>
> **One services partial missed:**
> - `services/show/partials/_service_list_quotable.blade.php:30` — `btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold` → should be `btn btn-sm btn-outline-secondary rounded-2 px-3 fw-semibold`. Logged in **Remaining Items**.
>
> **Intentional remaining uses of `rounded-pill`:**
> - Price overlay chips on card images (`bg-dark bg-opacity-75 text-white rounded-pill`) in `_auto_card`, `_classified_card`, `_property_card`, `_products_card` — pill shape on dark photo overlays is intentional.
> - Mobile back button (`btn-glass-back ... rounded-pill`) in all breadcrumb partials — pill-shaped mobile navigation chip is intentional.
> - Progress bar track (`progress flex-grow-1 rounded-pill`) in `_reviews.blade.php` — structural, not a badge.
> - Cart notification dot (`badge rounded-pill bg-danger`) in `_header.blade.php` — notification dot badge is always pill-shaped by convention.
> - Location pills (`location-pill rounded-pill`) in `_index-body.blade.php` — these are named location pills, intentional.

### 1a. Property — Sale Detail
Partials cleaned: `sale/_header`, `_summary_features`, `_amenities`, `_contact_agent_sidebar`, `_contact_form_sidebar`, `_contact_form_inline`, `_neighborhood`, `_scores`, `_mortgage_calculator`, `_policies`, `_tours_and_documents`, `_description`, `_breadcrumbs`, `_gallery`, `_related`, `_map`

### 1b. Property — Vacation Rental Detail
Partials cleaned: `vr/_header`, `_summary_features`, `_amenities`, `_sidebar`, `_sidebar-booking`, `_sidebar-host`, `_sidebar-actions`, `_availability_calendar`, `_seasonal_prices`, `_reviews`, `_local_guide`, `_rules`, `_sticky_footer_cta` + shared partials

### 1c. Property — Default Detail
`properties/show/default-property-detail.blade.php`

### 1d. Auto — Vehicle Detail
Partials cleaned: `_header`, `_breadcrumbs`, `_quick_specs`, `_features`, `_specifications_table`, `_finance_calculator`, `_description`, `_map`, `_related_autos`, `_test_drive_request`

### 1e. Product — Physical Detail
Partials cleaned: `_product_header`, `_item_description`, `_related_products`, `_breadcrumbs`

### 1f. Services — Three Variants
`services/show/bookable.blade.php`, `consultation.blade.php`, `quotable.blade.php`
Partials cleaned: `_header`, `_listing_header`, `_breadcrumbs`, `_quick_specs`, `_operating_hours`, `_location_map`, `_service_list_bookable`, `_simple_feature_list`, `_gallery_carousel`, `_related_services`, `_reviews_section`, `sidebar/_consultation_sidebar`

### 1g. Job — Detail + Application
`jobs/show/job-detail.blade.php`, `partials/_header`, `_description`, `_breadcrumbs`, `jobs/application/show.blade.php`

### 1h. Event — Detail
`events/show/` partials: `_breadcrumbs`, `_speaker_modal`, `events/booking/checkout.blade.php`

### 1i. Classified — Detail
`classifieds/show/show.blade.php`, `partials/_breadcrumbs`, `_item_description`, `_related_seller_items`

### 1j. Blog Post — Detail
`blogs/show/show.blade.php`, `partials/_breadcrumbs`, `_related_seller_items`

---

## ✅ Phase 2 — Index / Browse Pages (COMPLETE)

> **Verified:** All index and browse page files — zero `glass-surface`, `btn-primary-theme`, `text-primary-color` found across `unifieds/`, `properties/`, `autos/`, `products/`, `services/`, `jobs/`, `events/`, `classifieds/`, `blogs/`.
>
> **Intentional uses of `btn-outline-primary` (not `-theme`) found in two places:**
> - `unifieds/_partials/_section-empty-state.blade.php` — uses Bootstrap's standard `btn-outline-primary`. Correct.
> - `products/_partials/_card.blade.php:84` — `btn-outline-primary btn-sm rounded-2 fw-semibold`. Correct pattern.
>
> **`evc-glass-surface` class in `events/_partials/_card-event.blade.php`:** The CSS rule (style.css line 3656) was updated in Phase 2 to `background: #fff; border: 1.5px solid rgba(15,23,42,.07)` — no backdrop-filter remains. Markup kept as-is; only CSS was changed.

| Page | File |
|---|---|
| Properties index | `properties/index.blade.php` |
| Autos index | `autos/index.blade.php` |
| Products index + search | `products/index.blade.php`, `search.blade.php` |
| Services index | `services/index.blade.php` |
| Jobs index | `jobs/index.blade.php` |
| Events index | `events/index.blade.php` |
| Classifieds index + search | `classifieds/index.blade.php`, `search.blade.php` |
| Blog index + search | `blogs/index.blade.php`, `search.blade.php` |
| Unifieds index | `unifieds/index.blade.php` |
| Category / Brand / Tag / Type pages | `unifieds/categories/show.blade.php`, `brands/show.blade.php`, `tags/show.blade.php`, `types/show.blade.php` |
| Partner profile | `unifieds/partners/show.blade.php`, `partners/show.blade.php` |

---

## ⚠️ Phase 3 — Auth Pages (INCOMPLETE)

> **Verified:** Auth templates live at `resources/views/auth/` (not `frontend/auth/`). Grep found 2 remaining `text-primary-color` usages:
> - `auth/_partials/_marketing_panel.blade.php:20` — icon uses `text-primary-color`
> - `auth/_partials/_form_card_start.blade.php:13` — logo/brand text uses `text-primary-color`
>
> All other auth files appear clean. These 2 need a fix — logged in **Remaining Items**.

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
| Shared auth partials | `_form_card_start`, `_form_card_end`, `_marketing_panel`, `_social_login` |

---

## ⚠️ Phase 4 — Booking & Checkout Flows (MOSTLY COMPLETE)

> **Verified:** All checkout and confirmation flows are clean except one:
> - `properties/booking/confirmation.blade.php:95` — "Contact Host" button is `btn btn-white btn-sm fw-800 shadow-sm w-100 mt-3 border rounded-pill py-2` → should be `btn btn-outline-secondary btn-sm fw-semibold w-100 mt-3 rounded-2 py-2`. Logged in **Remaining Items**.
>
> All other flows (events, products, jobs, autos, property visit) verified clean.

| Flow | Files |
|---|---|
| Property booking | `properties/booking/checkout.blade.php`, `payment.blade.php`, `confirmation.blade.php`, `_partials/_booking-header.blade.php`, `_booking-stepper.blade.php`, `_payment_details.blade.php` |
| Property visit | `properties/visits/confirmation.blade.php` |
| Event booking | `events/booking/checkout.blade.php`, `confirmation.blade.php`, `_partials/_booking-header.blade.php`, `_booking-stepper.blade.php`, `_attendee_form.blade.php`, `_payment_options.blade.php`, `_order_summary.blade.php` |
| Event tickets | `events/tickets/index.blade.php` |
| Product cart / checkout / success | `products/cart.blade.php`, `checkout.blade.php`, `success.blade.php`, `_partials/_checkout-header.blade.php`, `_checkout-stepper.blade.php` |
| Auto inquiry | `autos/inquiry/confirmation.blade.php` |
| Job application | `jobs/application/show.blade.php`, `confirmation.blade.php`, `partials/_description.blade.php`, `_mobile_cta.blade.php`, `_application_sidebar.blade.php` |
| Shared checkout partials | `_partials/_checkout_success_hero.blade.php`, `_checkout_payment_panel.blade.php` |

---

## ✅ Phase 5 — Remaining Detail / Show Partials (COMPLETE)

> **Verified:** All listed files clean — zero `glass-surface`, `btn-primary-theme`, `text-primary-color` found.

| Vertical | Files |
|---|---|
| Autos | `autos/show/partials/_details_main.blade.php`, `_finance_calculator.blade.php`, `1_details_main.blade.php` |
| Products | `products/show/partials/_related_products.blade.php` |
| Properties | `properties/show/partials/sale/_contact_form_inline.blade.php`, `_scores.blade.php`, `_mortgage_calculator.blade.php`, `_tours_and_documents.blade.php`, `_related.blade.php`, `vr/_reviews.blade.php`, `vr/_sidebar.blade.php` |
| Services | `services/show/partials/_simple_feature_list.blade.php`, `_gallery_carousel.blade.php`, `_related_services.blade.php`, `_service_list_bookable.blade.php`, `_operating_hours.blade.php`, `_location_map.blade.php` |
| Events | `events/show/partials/_speaker_modal.blade.php` |
| Classifieds | `classifieds/show/partials/_related_seller_items.blade.php` |
| Blogs | `blogs/show/partials/_related_seller_items.blade.php` |

---

## ✅ Phase 6 — Final Token Pass (COMPLETE)

> **Verified:** Full grep of all frontend views for `glass-surface`, `text-primary-color`, `bg-glass-light`, `bg-glass-surface`, `glass-input`, `btn-primary-theme`, `btn-outline-primary-theme` returns:
> - 1 file: `evc-glass-surface` in `events/_partials/_card-event.blade.php` — markup intentionally kept; CSS is clean (see Phase 2 note)
> - 1 file: `text-primary-color` in `products/show/partials/_styles_extra.blade.php` — this is the CSS *class definition* `.text-primary-color { color: var(--primary-color) }`, not a usage. Intentionally kept.
>
> All other tracked tokens: fully removed.

| Token | Replacement | Files affected |
|---|---|---|
| `btn-primary-theme` | `btn-primary` | 3 files |
| `btn-outline-primary-theme` | `btn-outline-secondary fw-semibold` | 2 files |
| `text-primary-color` (usages) | `text-primary` | 25 files |
| `bg-glass-light` | `bg-light` / `bg-white` | 6 breadcrumb files + 4 partials |
| `glass-input` | removed | job application form |
| Badge `rounded-pill` | `rounded-2` | event order summary |

---

## ✅ Remaining Items (found during verification — now fixed)

All items below were found during the Phase 0–6 verification pass and fixed in a follow-up commit.

| File | Line | Fix applied |
|---|---|---|
| `auth/_partials/_marketing_panel.blade.php` | 20 | `text-primary-color` → `text-primary` |
| `auth/_partials/_form_card_start.blade.php` | 13 | `text-primary-color` → `text-primary` |
| `properties/booking/confirmation.blade.php` | 95 | `btn-white fw-800 rounded-pill` → `btn-outline-secondary fw-semibold rounded-2` |
| `services/show/partials/_service_list_quotable.blade.php` | 8 | "Best Value" badge `fw-bold uppercase` → `fw-semibold` natural case |
| `services/show/partials/_service_list_quotable.blade.php` | 30 | `btn-outline-primary rounded-pill fw-bold` → `btn-outline-secondary rounded-2 fw-semibold` |
| `frontend/_partials/_reviews.blade.php` | 75 | `border rounded-5 bg-white shadow-sm` → `bg-white border rounded-4` |
| `frontend/_partials/_reviews.blade.php` | 80 | `fw-800 uppercase tracking-wider` label → `fw-semibold` |
| `frontend/_partials/_reviews.blade.php` | 94 | `btn-primary rounded-pill fw-800` → `btn-primary px-5` |
| `frontend/_partials/_reviews.blade.php` | 103 | `btn-dark rounded-pill` → `btn-dark` |
| `blogs/_partials/_card.blade.php` | 13 | Category badge `rounded-pill fw-bold backdrop-blur-sm` → `rounded-2 fw-semibold` |
| `events/_partials/_card-event.blade.php` | 23 | Price badge `rounded-pill fw-800 shadow-sm border-white` → `rounded-2 fw-semibold` |

---

## Design Token Reference

| Old token | New token | Notes |
|---|---|---|
| `glass-surface` | `bg-white border` | Add `rounded-4` when radius needed |
| `bg-glass-light` | `bg-light` or `bg-white` | `bg-white` for breadcrumbs; `bg-light` for inner cards |
| `bg-glass-surface-dark` | `bg-dark` | Mobile sticky bars |
| `glass-input` | *(remove)* | Plain `form-control` is sufficient |
| `text-primary-color` | `text-primary` | Bootstrap utility |
| `btn-primary-theme` | `btn-primary` | |
| `btn-outline-primary-theme` | `btn-outline-secondary fw-semibold` | |
| `rounded-pill` (badges) | `rounded-2 fw-semibold` | Natural case text |
| `rounded-pill` (breadcrumbs) | `rounded-3` | Desktop `<ol>` container only |
| `shadow-deep` / `shadow-lg` | remove | Let border do the work |

**CSS custom properties in use:**
```css
--primary-color         /* warm orange */
--primary-color-rgb     /* for rgba() */
--primary-dark          /* darker orange hover */
--text-dark: #1C1917    /* near-black warm */
--font-heading          /* DM Serif Display */
--font-main             /* Plus Jakarta Sans */
```









-----------------------

Additional Feedback


in the hero section, please show 4 cards instead of 3.



the search forms tabs, i think the pills design feel like unfinished. can you double check?



property detail page:
Lifestyle & Accessibility, recheck for readiblity, design crash, use playwright.
