# Frontend Public Views — Redesign Plan

**Status: ALL COMPLETE — verified clean as of commit 056c0427.**

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

## ✅ Phase 3 — Auth Pages (COMPLETE)

> **Verified:** Auth templates live at `resources/views/auth/` (not `frontend/auth/`). Two `text-primary-color` usages were found and fixed:
> - `auth/_partials/_marketing_panel.blade.php:20` — fixed: `text-primary`
> - `auth/_partials/_form_card_start.blade.php:13` — fixed: `text-primary`
>
> All other auth files verified clean.

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

## ✅ Phase 4 — Booking & Checkout Flows (COMPLETE)

> **Verified:** All checkout and confirmation flows clean. One missed button was found and fixed:
> - `properties/booking/confirmation.blade.php:95` — "Contact Host" `btn-white rounded-pill fw-800` → `btn-outline-secondary rounded-2 fw-semibold`
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

## ✅ Phase 7 — Property Detail Page Layout

### A. Macro Page Layout (DOM Order)

The current DOM order on both pages:

```
breadcrumbs slot (full-width):
  [title + badges + location] ←→ [price card]

detail-page__grid:
  main (~65% wide):                  sidebar (~35% wide):
    gallery — constrained here   │    contact / booking form
    summary features grid        │    agent card
    content sections...          │
```

**The gallery is inside the main column.** It is never full-width — the sidebar sits alongside it. A property gallery is the most emotionally compelling element on the page; rendering it at 65% of the viewport is the biggest layout mistake on either page.

**Recommended structure** (requires touching `detail-shell.blade.php` and both page files):

```
detail-page__breadcrumbs:
  breadcrumb nav only (no title, no price)

gallery slot — NEW, renders full-width before the grid split
  full-bleed across both columns, edge-to-edge in the card

detail-page__grid:
  main:                                │ sidebar:
    title block                        │ contact form (sale)
      h1 title                         │ booking widget (VR)
      badges row                       │
      location line                    │
      price (inline, not a box)        │
      key facts bar (1-line strip)     │
    content sections...                │

detail-page__related
```

**Why each change:**

- **Gallery full-width:** hero images should span the full card width. The sidebar belongs alongside the *text* content, not alongside the photography.
- **Title in main column (below gallery):** with the gallery as a full-width hero, the title naturally reads after the visual "wow." This is the Airbnb / Rightmove premium pattern — gallery first, identity row second.
- **Price inline in the left column:** the right-floated price box currently competes visually with the sidebar contact/booking form. Once those two are in adjacent columns they fight for the eye. Move price to the left column, directly under the title, with a clear typographic hierarchy (`display-5` price, `text-muted small` label). The sidebar form is the *action* — the price is supporting *information*.
- **Key facts bar replaces feature-card grid:** the current `key-features-grid` of icon boxes is heavy for above-fold placement. Replace with a single horizontal strip: `4 Bedrooms · 3 Bathrooms · 2,400 sq ft · Built 2015`. Reads in one glance, takes one line.

**Files to change:**
- `components/frontend/detail-shell.blade.php` — add a `$gallery` slot that renders between breadcrumbs and the main/sidebar grid
- `properties/show/sale-property-detail.blade.php` — move `_gallery` include into the new `<x-slot:gallery>`, move `_header` out of `<x-slot:breadcrumbs>` and into the top of `<x-slot:main>`
- `properties/show/vacation-property-detail.blade.php` — same gallery slot move; same header move
- `properties/show/partials/sale/_header.blade.php` — restructure: remove the right-float price box, add price inline below location, keep left column only
- `properties/show/partials/sale/_summary_features.blade.php` — replace icon-card grid with a key facts horizontal bar
- `properties/show/partials/vr/_header.blade.php` — same: remove right-float price, add price inline, integrate share/save actions here
- `properties/show/partials/vr/_summary_features.blade.php` — replace 2×2 tile grid with a key facts horizontal bar

---

### B. Title, Location & Price Area (within-area fixes)

---

#### Sale — `sale/_header.blade.php`

**Issue 1 — Badge row before the `h1` (lines 6–26 before line 28)**
The featured/category/type/new-listing badges appear *before* the property title. The user reads classification labels before knowing what the property is called. The `h1` is the primary entry point — badges are supporting metadata.

Recommended order inside the left column:
```
breadcrumbs → h1 → badge row → location line
```
Move the `<div class="d-flex flex-wrap ...gap-2 mt-3 mb-3">` block (lines 6–26) to after the `<h1>` (lines 28–30) and before the `<p>` location line (lines 32–37).

**Issue 2 — Specs duplicated between header and summary features**
The price box on the right (lines 47–62) shows Beds | Baths | Size as a compact three-stat row. `_summary_features.blade.php` immediately below the gallery shows the same three plus Parking and Year Built as full feature cards. The buyer sees beds/baths/area **twice** within a few hundred pixels.

Fix: Remove the stat row inside the price box entirely (the `<div class="d-flex justify-content-lg-end gap-3 border-top ...">` block, lines 47–62). The price box becomes price-label + price-figure only. `_summary_features.blade.php` is the single spec source.

**Issue 3 — Price label terminology (line 43)**
`"Investment Amount"` reads like a financial product, not a home. `"Guide Price"` is UK estate-agent jargon. Use `"Asking Price"` — universal, plain language.

**Issue 4 — `icon-circle-theme` on the geo icon (lines 33–35)**
A circle-background container on a supporting metadata line is decorative noise. The VR header uses a plain icon. Standardise to a plain `bi-geo-alt-fill text-muted` inline with the address text — no wrapper div.

**Issue 5 — `fw-800` on the `h1` (line 28)**
DM Serif Display has no weight-800 variant. The browser synthesises fake bold or does nothing. The heading weight is set via `--font-heading` in CSS. Remove `fw-800`; weight-400 is the correct editorial weight for a display serif.

---

#### Sale — `sale/_summary_features.blade.php`

**Issue 6 — Wrong icon for bedrooms (line 7)**
`bi-house-door` is the listing/home icon, not a bedroom. Use `bi-door-open` (closest to a room entry) or another icon that reads as sleeping space rather than the whole building.

---

#### VR — `vr/_header.blade.php`

**Issue 7 — Rating badge is `bg-dark text-white` (lines 19–23)**
A solid dark chip commands as much visual weight as the price. The rating is a trust signal, not a primary element. Replace with a lightweight inline treatment:
```html
<span class="d-flex align-items-center gap-1 text-dark fw-semibold small">
    <i class="bi bi-star-fill text-warning" style="font-size:.75rem"></i>
    {{ $averageRating }}
    <span class="text-muted fw-normal">({{ $reviewCount }})</span>
</span>
```

**Issue 8 — [Share] and [Save] in the price column (lines 51–58)**
On mobile the layout stacks: left column (title/location) then right column (price + share/save). Share and Save appear below the price, detached from the listing they refer to. Move them into the left column after the location/rating row — they act on the *listing*, not the *price*.

**Issue 9 — Geo icon class inconsistency (line 27)**
Sale header uses `icon-circle-theme` (circle container); VR header uses `lc-geo-icon` (plain custom class). Standardise both to a plain `bi-geo-alt-fill text-muted` with no wrapper (see Issue 4 above).

---

#### VR — `vr/_summary_features.blade.php`

**Issue 10 — `tiny text-uppercase fw-bold` on tile labels (line 17)**
`text-uppercase` produces ALL CAPS labels, violating the established rule (natural case everywhere). Change to `small fw-semibold text-muted`.

---

### B. Section Layout

The buyer/guest decision journey:
**"What does it look like?" → "What does it have?" → "Where is it?" → "What's the neighbourhood like?" → "Can I afford / book it?"**

Both pages diverge from this mental model in specific ways.

---

### Sale property (`sale-property-detail.blade.php`)

**Current section order:**
1. Gallery
2. Summary features (price, beds, area)
3. The Space (description)
4. Amenities
5. **Location Overview** ← map + policies bundled together ⚠️
6. Local Neighbourhood & Lifestyle (neighborhood text + scores, 2-col)
7. Digital Assets & Tours

**Issues:**

**B-1. Policies inside "Location Overview" (lines 41–48)**
Policies (HOA rules, pet policy, disclosures) have nothing to do with where the property is. The heading "Location Overview" signals geography — then the user reads legal disclosures underneath the map. These belong in a separate section at the bottom.

**B-2. Virtual Tours last**
A 3D walkthrough or floor-plan video is a *decision* tool, not an appendix. Buyers who want it look for it early. Placing it after all neighbourhood text means many users never reach it.

**Recommended order:**
1. Gallery
2. Summary features
3. The Space (description)
4. Amenities
5. **Location** (map only — extract from current "Location Overview")
6. Local Neighbourhood & Lifestyle (neighborhood text + scores)
7. **Virtual Tours & Documents** ← promoted from position 7 to before disclosures
8. **Property Details & Disclosures** ← policies moved here, renamed

**Files to change:**
- `properties/show/sale-property-detail.blade.php` — reorder the sections inside `<div class="property-details-content mt-5">`
- Section 5 (line 41): keep only `@include('.._map')`, rename heading to "Location"
- Extract `@include('..._policies')` into a new section 8 at the bottom
- Move the `#tours` section (currently line 63) to position 7, before the new disclosures section

---

### Vacation rental (`vacation-property-detail.blade.php`)

**Current section order:**
1. Gallery
2. Summary features
3. About this getaway (description)
4. Amenities
5. Seasonal Rates
6. Availability Calendar
7. Local Guide (neighbourhood)
8. Livability & Accessibility (scores)
9. **Rules + mini-map in 2-col** ← map buried at position 9 of 9 ⚠️

**Issues:**

**B-3. Map buried at the bottom inside the Rules section (lines 54–64)**
On a rental page, *location* is a top-3 decision factor alongside price and dates. The map is a small widget inside a Rules container at the very end of the page. It should be its own section near the top of the long-content area.

**B-4. Seasonal Rates and Calendar are separate sections (5 and 6)**
These answer the same question: *"When can I go and what will it cost?"* A guest reads rates and immediately wants to check those dates. They belong under one "Rates & Availability" heading.

**B-5. Livability/Scores stranded between Local Guide and Rules (position 8)**
Scores (walkability, transit, noise) are neighbourhood context, not a bridge between guide and house rules. They belong attached to the Local Guide section.

**Recommended order:**
1. Gallery
2. Summary features
3. About this getaway (description)
4. Amenities
5. **Location** ← map as its own full-width section (extracted from rules)
6. **Rates & Availability** ← Seasonal Rates + Calendar merged
7. **Neighbourhood & Livability** ← Local Guide + Scores merged
8. House Rules ← rules only, map extracted

**Files to change:**
- `properties/show/vacation-property-detail.blade.php`
  - Lines 37–43 (seasonal-rates + calendar): wrap in single `<section id="rates">` with heading "Rates & Availability"
  - Lines 45–52 (local_guide + livability/scores): merge under `<section id="neighbourhood">` heading "Neighbourhood & Livability"
  - Lines 54–64 (rules section): remove `<div class="col-md-5">` mini-map column; rules become full-width
  - Add `<section id="location">` above the rates section with full-width `@include('.._map')` (use `map-container-wrapper`, not `map-container-sm`)

---

### ✅ Verification Fixes (committed after Phase 0–6 review)

All items below were found during the verification pass and fixed in a follow-up commit (`056c0427`).

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


hero section
the search forms tabs, i think the pills design feel like unfinished. can you double check?

in the hero section, are the 4 cards dynamic?

in the hero do you think the cards design somehow shows AI template? we need to get rid of ai templates


property detail page:
Lifestyle & Accessibility, recheck for readiblity, design crash, use playwright.

The sale property on the right column you have a date picker to schedule a visit that is too basic UIUX

Redesign these pages to follow our theme's design:

Agent Profile
Browse by Category 
Browse by Tag
Browse by Location, etc, etc.



http://192.168.0.112:8000/login
the login screen is not following the css design tokens, please fix it.




I think the classified sidebar widgets are still old design.



Let's also work on the partner profile page, testimonial category, location, tags, etcetera.



DONE
<header>
remove empty space here
<nav></nav>
</header>