# Sellio Public Frontend — Design & Polish Plan

> Platform: Laravel 12 / Blade · Design tokens: `--primary-color: #E05F2C`, `--text-dark: #1C1917`, `--font-heading: DM Serif Display`, `--font-main: Plus Jakarta Sans`
> Last updated: 2026-06-24 (session 2)

---

## 0 · Design System Fundamentals

### Established Pattern Hierarchy
| Level | Where used | Background | Pattern |
|---|---|---|---|
| **1 — Hero** | Homepage hero | `#1C1917` | Dot grid (28px, 38% white) + orange glow 12% |
| **2 — Inner page hero** | Contact, FAQ, About, Terms, Privacy | `#1C1917` via `.hero-section--dark` + `.page-hero-strip` or `.about-hero` | Sparser dot grid (44px, 18% white) + glow 7% — subordinate to Level 1 |
| **3 — Secondary dark** | CTA bands, Auth panels | `#1C1917` via `.dark-brand-panel` | Two faint glows only (7% + 4%), NO dot grid |
| **4 — Light surface** | Cards, sidebars | `#fff` | None |
| **5 — Tinted surface** | Listing banners, stat blocks | Warm orange tint ~5% | None |

> **Rule:** Level 1 and Level 2 use the same `.hero-section--dark` class. The sparser dot grid on Level 2 is applied via `.page-hero-strip.hero-section--dark::before` and `.about-hero.hero-section--dark::before` overrides in `style.css`. The homepage hero (no additional class) retains the full 28px/38% grid.

### Typography Scale (Blade front-end)
- **Display** — `font-family: DM Serif Display`, `font-weight: 400`, `letter-spacing: -0.03em`
- **Body** — `Plus Jakarta Sans`, size `0.9375rem`, line-height `1.65`
- **Labels** — `0.65rem`, `font-weight: 700`, `text-transform: uppercase`, `letter-spacing: 0.06em`
- **Gradient accent on dark** — `linear-gradient(125deg, #E05F2C 25%, #fbbf24 100%)` text-clip, `font-style: italic`

### CSS Class Conventions
| Class | Purpose |
|---|---|
| `.hero-section--dark` | Full dark hero (Level 1/2). Has `::before` with dot grid + glow. |
| `.dark-brand-panel` | Secondary dark section (Level 3). Faint glows only, no dot grid. |
| `.listing-page-banner` | All listing page headers — warm tinted card with icon + count. |
| `.page-hero-strip` | Inner page hero container — padding only, relies on `.hero-section--dark` for colour. |
| `.page-hero-title` | Title on dark heroes — white, DM Serif, clamp 2–3rem. |
| `.page-hero-accent` | Gradient text span inside titles on dark heroes. |
| `.page-hero-subtitle` | Subtitle on dark heroes — `rgba(255,255,255,.65)`. |

---

## 1 · Global Components

### 1.1 Navigation Header
**File:** `frontend/_layouts/_app.blade.php`, `frontend/_partials/_header.blade.php`

| Item | Status | Issue | Fix |
|---|---|---|---|
| Logo display | ✅ | — | — |
| Desktop nav links | ✅ | — | — |
| CTA buttons (Login / Post Listing) | ✅ | — | — |
| Mobile hamburger | ⚠️ | Unknown if hamburger opens a proper offcanvas/drawer | Verify drawer is styled correctly with brand tokens |
| Sticky behaviour on scroll | ⚠️ | Needs verification — does background turn white on scroll? | Ensure backdrop-blur + border-bottom on scroll |
| Active state on current page | ⚠️ | Not verified | Add `.active` state with primary-colour underline |
| Notification bell (auth) | ⚠️ | Not yet audited | — |

### 1.2 Footer
**File:** `frontend/_partials/_footer.blade.php`

| Item | Status | Issue | Fix |
|---|---|---|---|
| Privacy/Terms links | ✅ Fixed | Had stale `#` values in DB/cache | Done |
| Company column links | ✅ Fixed | PHP match fall-through returning `#` | Done |
| Newsletter form | ⚠️ | Not yet audited — does it post? | Verify route + success state |
| Social icons | ⚠️ | Only renders if settings configured — show placeholder row if not | Add a note or default icon set |
| Copyright year | ✅ | Uses `date('Y')` dynamically | — |
| Mobile stacking | ⚠️ | Not verified at 375px | Test column collapse order |

---

## 2 · Homepage

**File:** `frontend/unifieds/index.blade.php` → includes `_index-section-hero` + `_index-body`

### 2.1 Hero Section
**Status: ✅ Strong**

- Dark `#1C1917` background, dot grid, orange glow — authoritative first impression
- Multi-tab search filter (Properties, Vehicles, Events, Services, Jobs, Products)
- Gradient headline with italic accent

**Remaining gaps:**
- Hero sub-copy: Verify it's driven by `page_content()` not hardcoded
- Tab keyboard navigation — check `aria-selected` + focus ring on tab controls
- Mobile: Search filter tabs may overflow at 375px — verify horizontal scroll or wrap

### 2.2 Body Sections
**Files:** `frontend/unifieds/_partials/_index-body.blade.php`

| Section | Status | Notes |
|---|---|---|
| Featured properties strip | ⚠️ | Check if heading + "View all" link uses brand tokens |
| Featured vehicles strip | ⚠️ | Same as above |
| Upcoming events strip | ⚠️ | Card design uses `evc-card` — review for consistency |
| Latest jobs | ⚠️ | Was using old cover-photo card — now fixed in listing, verify home strip uses new layout |
| Featured services | ⚠️ | Not verified |
| Blog highlights | ⚠️ | Not verified |
| "Why Sellio" / value prop section | ⚠️ | Likely plain text — add icon grid or feature cards |
| Category grid / vertical picker | ⚠️ | If present, verify 8 verticals are shown with icons and correct routes |
| Stats band (sellers, listings etc.) | ⚠️ | Not verified — should use DM Serif large number + label |
| CTA band at bottom | ⚠️ | Should use `.dark-brand-panel` (Level 3), NOT `.hero-section--dark` |

---

## 3 · Auth Flow

**Layout:** `frontend/_layouts/_guest.blade.php` — Bootstrap row wrapper, no padding

### Auth Page Status

| Page | File | Status | Layout | Issue |
|---|---|---|---|---|
| Login | `auth/login.blade.php` | ✅ Done | Split `col-lg-5` dark + `col-lg-7` form | — |
| Register | `auth/register.blade.php` | ✅ Done | Split `col-lg-5` dark + `col-lg-7` form | — |
| Forgot Password | `auth/forgot-password.blade.php` | ✅ Good as-is | `auth-solo` single column | Single column is correct for utility step |
| Reset Password | `auth/reset-password.blade.php` | ✅ Good as-is | `auth-solo` single column | Same — no marketing panel needed mid-flow |
| Verify Email | `auth/verify-email.blade.php` | ✅ Good as-is | `auth-solo` with icon | Email icon + resend button is appropriate |
| Confirm Password | `auth/confirm-password.blade.php` | ⚠️ Not audited | `auth-solo` assumed | Check form styling matches auth tokens |
| Partner Login | `auth/login-partner.blade.php` | ⚠️ Not audited | Unknown | May need same split layout as main login |
| Partner Register | `auth/register-partner.blade.php` | ⚠️ Not audited | Unknown | May need same split layout |

**Shared auth notes:**
- `auth.css` defines all form controls, icon groups, social buttons — already consistent
- All single-column (`auth-solo`) pages have correct `auth-solo-topbar` with logo + back link
- Font used for headings inside auth pages uses `var(--font-heading)` — verify it loads correctly in the guest layout

---

## 4 · Static / Informational Pages

### 4.1 About
**File:** `frontend/pages/about.blade.php`
**Status: ✅ Complete redesign done**

- Dark hero: `about-hero hero-section--dark` — solid `#1C1917` + sparser dot grid (Level 2). No photo in hero (photo is stock only).
- Vertical chip grid for 8 verticals (right column, desktop only)
- Two CTA buttons in hero (Join for Free / Get in Touch)
- 4-column stats band
- Mission section with Pexels photo
- 6 feature cards with coloured top accents
- Story split section
- CTA band: photo background (Pexels team photo, 93%/88% overlay so stock image reads as warm texture only, not identifiable). Replaced `.dark-brand-panel`.

**Remaining:**
- Pexels images are hotlinked — monitor if CDN blocks referrers; consider self-hosting or replacing with real company photos
- `page_content_string()` calls allow DB overrides — ensure keys are seeded or documented
- Stats band numbers (8 verticals, etc.) are hardcoded — make them DB-driven or at least constants
- CTA band photo: replace with real company photo when available (reduce overlay to ~65% to let it breathe)

### 4.2 Contact
**File:** `frontend/pages/contact.blade.php`
**Status: ✅ Done**

- `page-hero-strip hero-section--dark` strip with 3-channel frosted card (Chat / Email / Secure)
- Fixed: `bi-shield-check-fill` → `bi-shield-fill-check` (was missing icon)
- `page-hero-title/accent/subtitle` now from global `style.css` (no longer duplicated in push block)
- Placeholder text changed from "Configure in Admin" to helpful copy
- Form + info cards + response time + social links

**Remaining:**
- Social links block only shows if `setting('social_*')` is set — empty state is just absent
- Contact form route `contact.send` verified wired end-to-end ✅

### 4.3 FAQ
**File:** `frontend/pages/faq.blade.php`
**Status: ✅ Done**

- `hero-section--dark` strip with 3-stat panel (50+ Answers / 5 Categories / 24h Support)
- Category filter pills working via JS
- Accordion items with group headings

**Remaining:**
- Hardcoded FAQ content — needs to be DB-driven or at minimum use `page_content()` wrappers
- "Still need help?" sidebar card with headset icon is correct
- Quick links sidebar — verify all routes exist (some might 404 if content not seeded)

### 4.4 Terms of Service
**File:** `frontend/pages/terms.blade.php`
**Status: ✅ Dark hero done**

- `page-hero-strip page-hero-strip--compact hero-section--dark` — compact padding, white title
- `page-hero-title` size overridden to `clamp(1.75rem, 3.5vw, 2.5rem)` (smaller — appropriate for legal pages)
- `page-hero-title/subtitle` base styles now from global `style.css` (no longer duplicated in push block)

**Remaining:**
- Right column: add anchor-link table of contents panel (P2 #18)
- Last updated date hardcoded as `January 1, 2025` — make DB/config driven (P2 #19)

### 4.5 Privacy Policy
**File:** `frontend/pages/privacy-policy.blade.php`
**Status: ✅ Dark hero done**

- Same treatment as Terms applied
- Same remaining items (TOC sidebar P2 #18, date config P2 #19)

---

## 5 · Listing Pages (All 8 Verticals)

### 5.1 Shared Listing Banner
**File:** `frontend/_partials/_page-heading.blade.php`
**Status: ✅ Done**

All listing pages now render a warm-tinted banner with:
- Orange-tinted gradient background + brand border
- Icon in a coloured icon box
- Title (DM Serif) + subtitle
- Count card (number + label) on the right

### 5.2 Properties
**File:** `frontend/properties/search.blade.php`
**Status: ⚠️ Needs audit**

- Uses `listing-index` component — gets the new banner ✅
- Grid: `cards-3` (3-column)
- Has extensive active filter labels array (type, location, category, price, beds, baths, amenities, features)

**Card issues to investigate:**
- Property card (`unifieds/_partials/_property-card.blade.php`) — check if image aspect ratio is consistent
- Price display — verify currency symbol from settings
- "For Sale" vs "For Rent" badge — verify badge colour contrast

### 5.3 Vehicles / Autos
**File:** `frontend/autos/index.blade.php`
**Status: ⚠️ Needs audit**

- Uses `listing-index` — gets banner ✅
- Supports `$categoryTitle` override for category-filtered pages
- Grid: not specified (defaults to `cards-3`)

**Card issues:** `unifieds/_partials/_auto-card.blade.php` — not yet audited

### 5.4 Events
**File:** `frontend/events/index.blade.php`
**Status: ⚠️ Partially broken — separate legacy header not updated**

- Uses `listing-index` → gets new banner ✅
- BUT also has `events/_page_header_events.blade.php` — a plain `<h1>` in a white div — this may still render separately above the banner depending on routing
- `_card-event` uses `evc-card` CSS class — needs visual audit for consistency with other cards
- Date filter uses `flatpickr` — verify it's loaded and styled

**Fix required:**
- Verify `_page_header_events.blade.php` is not rendered on the main listing page (it may be a leftover partial)
- Audit `_card-event` card for font/colour consistency with other listing cards

### 5.5 Services
**File:** `frontend/services/index.blade.php`
**Status: ✅ Banner fixed**

- Uses `listing-index` with `grid="cards-2"` (2-column)
- `icon="bi-gear-fill"`

**Remaining:**
- `services/_partials/_card.blade.php` not yet audited — check for image-heavy design issues
- Service category filter sidebar — check filter pill styling

### 5.6 Jobs
**File:** `frontend/jobs/index.blade.php`
**Status: ✅ Card redesign done**

- `grid="list"` — single column full-width
- Old cover-photo vertical card → new horizontal layout with:
  - Company logo mark (52px with border)
  - Job title + company name + meta chips (location, type, workplace, category)
  - Right rail with salary + "View Job" button
- Old double `<div class="col">` wrapper bug fixed

**Remaining:**
- Verify `$job->employer->avatar_url` returns a proper URL and fallback image when null
- Verify `$job->salary_range_formatted` accessor exists and returns formatted string
- Verify `$job->workplace_label` accessor exists
- Mobile view: right rail hides at `<md` — verify the mobile card still shows salary somewhere

### 5.7 Products
**File:** `frontend/products/search.blade.php`
**Status: ⚠️ Banner fixed — card needs audit**

- Uses `listing-index` with toolbar slot (sort/view controls) — good
- `icon="bi-box-seam-fill"`
- Sidebar has categories, brands, price range

**Remaining:**
- Product card (`products/_partials/_card.blade.php`) — not yet audited for visual consistency
- Price display — currency + sale price handling
- "Add to cart" vs "View Product" CTA on card — verify which is used

### 5.8 Blog / Articles
**File:** `frontend/blogs/search.blade.php`
**Status: ⚠️ Banner fixed — card is decent but improvable**

- `icon="bi-journal-text"`, `grid` defaults to `cards-3`
- Blog card (`blogs/_partials/_card.blade.php`): image + category badge + title + excerpt + date/views + "Read →"
- Card is functional but uses `listing-card` generic class — check heading font usage

**Remaining:**
- Use DM Serif for card post titles (currently `fw-800` which uses Plus Jakarta Sans)
- Category badge: white bg with primary text — fine but could use vertical colour coding
- "Read →" link: primary colour text — correct

### 5.9 Classifieds
**File:** `frontend/classifieds/search.blade.php`
**Status: ⚠️ Not audited**

- Not yet inspected
- Has its own sidebar filter
- Card: `classifieds/_partials/_card.blade.php` — unknown

**Action required:** Full audit

### 5.10 Unifieds (Cross-vertical search)
**Files:** `frontend/unifieds/` (brands, categories, partners, tags, types show pages)
**Status: ⚠️ Not audited**

- These are taxonomy/brand hub pages
- `unifieds/_partials/_hero_search_forms.blade.php` — may have its own hero form
- Partners show page, brands show page — likely need the same dark hero treatment

---

## 6 · Detail / Show Pages

### 6.1 Property Detail
**File:** `frontend/properties/show/default-property-detail.blade.php`
**Status: ⚠️ Needs audit**

Structure:
- `detail-shell` component
- Breadcrumbs + `_header` partial
- Gallery section (photo strip)
- Description / Amenities / Map / Livability scores
- Sidebar: agent contact card

**Issues to investigate:**
- Gallery: verify it uses a lightbox (Swiper/Splide) and images resize properly
- Breadcrumb styling — verify it uses brand tokens not Bootstrap defaults
- Map section: Leaflet or Google Maps? — verify it renders + is accessible
- Livability scores panel — check colour coding (green/yellow/red) is legible
- CTA sidebar: "Contact Agent" button — verify it opens an enquiry form/modal
- Related listings section — check card design matches listing page cards
- Mobile: detail layout should stack at `<lg`

### 6.2 Vehicle / Auto Detail
**File:** Not found in glob — likely `autos/show/` directory
**Status: ⚠️ Not audited**

- Has `autos/show/partials/_gallery.blade.php` and `_header.blade.php`
- Need to audit for visual consistency with property detail

### 6.3 Service Detail (3 variants)
**Files:**
- `services/show/bookable.blade.php`
- `services/show/quotable.blade.php`
- `services/show/consultation.blade.php`

**Status: ⚠️ Not audited**

- Each has its own sidebar (booking form, quote request form, consultation form)
- `_listing_header.blade.php` — check if it uses old plain white style
- `_styles_extra.blade.php` — page-specific CSS, may be outdated

### 6.4 Event Detail
**File:** `events/show/` (not in glob, exists via routes)
**Status: ⚠️ Not audited**

- Has `_gallery.blade.php`, `_detail_head_extra.blade.php`, `_mobile_cta_footer.blade.php`
- Mobile CTA footer — verify it's sticky and doesn't clash with global footer
- Date/time display — verify timezone handling

### 6.5 Job Detail
**File:** `frontend/jobs/show/job-detail.blade.php`
**Status: ⚠️ Needs audit**

- Has separate `_header.blade.php`, `_description.blade.php`, `_application_sidebar.blade.php`
- Application sidebar: CTA to apply → links to application flow
- Must verify job header doesn't use the old cover-photo pattern (which was only in the listing card)

### 6.6 Product Detail
**File:** `frontend/products/show/` directory
**Status: ⚠️ Not audited**

- Has `_product_gallery.blade.php`, `_product_specs_table.blade.php`, `_scripts_extra.blade.php`
- Sidebar: `_seller_contact_card.blade.php`, `_pickup_location_card.blade.php`
- Gallery likely has main image + thumbnail strip
- Specs table — check for consistent typography

### 6.7 Blog Post Detail
**File:** `blogs/show/` (not in glob — exists via routes)
**Status: ⚠️ Not audited**

- Has sidebar: `blogs/show/partials/sidebar/_seller_contact_card.blade.php` — odd naming (blog shouldn't have seller contact, may be copy-paste from product)
- Content area — verify prose styles (h2/h3/p/blockquote) are readable

### 6.8 Classified Detail
**File:** `classifieds/show/` directory
**Status: ⚠️ Not audited**

- Has `_listing_gallery.blade.php` — plain `<img>` with thumbnail strip
- Gallery is basic (no lightbox evident) — could use upgrade

---

## 7 · Transaction / Conversion Flows

### 7.1 Property Booking
**Files:** `properties/booking/`
**Status: ⚠️ Not audited**

- Uses `booking-header page-title-section` — plain white header
- Multi-step booking (dates, guests, payment)?
- Payment integration (Stripe) — verify form fields + error handling

### 7.2 Event Booking / Ticket Purchase
**File:** `events/booking/`
**Status: ⚠️ Not audited**

- `booking/_partials/_booking-header.blade.php` — uses `page-title-section`, plain header
- Ticket quantity selection
- Payment flow

### 7.3 Product Cart
**File:** `frontend/products/cart.blade.php`
**Status: ⚠️ Not audited**

- Uses `page-title-section` — plain white header
- Line items, quantity controls, totals
- Proceed to checkout button

### 7.4 Product Checkout
**File:** `frontend/products/_partials/_checkout-header.blade.php`
**Status: ⚠️ Not audited**

- Has `_checkout_payment_scripts.blade.php` — Stripe JS integration
- 3-step flow likely: address → payment → confirmation
- Card input styling — verify Stripe Elements match brand tokens

### 7.5 Job Application
**Files:** `jobs/application/`
**Status: ⚠️ Not audited**

- `application/show.blade.php` — the application form
- Has `_description.blade.php`, `_application_sidebar.blade.php`, `_mobile_cta.blade.php`
- Form fields: name, email, cover letter, CV upload
- `_head_extra.blade.php` — page-specific CSS/JS

### 7.6 Service Quote / Booking
**Status: ⚠️ Not audited**

- Quotable services: quote request form in sidebar
- Bookable services: date/time picker + booking form
- Consultation services: schedule form

---

## 8 · Partner / Seller Area

**Status: Not in scope for public frontend audit**

The partner dashboard (listing management, bookings, analytics, payouts) is an authenticated area with its own layout and design system. Flagged for separate audit.

Partner auth pages (`login-partner.blade.php`, `register-partner.blade.php`) — **need to be audited and potentially upgraded to the same split dark-panel layout as main login/register**.

---

## 9 · Priority Execution Queue

### 🔴 P0 — Broken / Placeholder (must fix before any demo)

| # | Task | File(s) | Effort |
|---|---|---|---|
| ~~1~~ | ~~Terms + Privacy hero: add `hero-section--dark`~~ | ~~`pages/terms.blade.php`, `pages/privacy-policy.blade.php`~~ | ✅ Done |
| ~~2~~ | ~~Verify Events page doesn't render `_page_header_events.blade.php` twice~~ | ~~orphan file deleted~~ | ✅ Done |
| ~~3~~ | ~~Partner login/register: upgrade to split layout~~ | ~~`auth/_partials/_marketing_panel.blade.php`~~ | ✅ Done |
| ~~4~~ | ~~Contact form: verify `contact.send` route works end-to-end~~ | ~~Fully wired — route → FormRequest → ContactService → Mail::raw(). Upgrade path: replace Mail::raw() with a styled Mailable.~~ | ✅ Done |

### 🟠 P1 — Visually weak (important for client impression)

| # | Task | File(s) | Effort |
|---|---|---|---|
| ~~5~~ | ~~Audit + fix Classifieds listing card~~ | ~~`classifieds/_partials/_card.blade.php`~~ | ✅ Done — removed double col wrapper, fixed `btn-primary-light`, added hover transition, fixed timestamp |
| 6 | Blog post title: apply DM Serif font to `property-title` inside blog card | `blogs/_partials/_card.blade.php` + CSS | XS |
| 7 | Event card (`evc-card`) visual consistency audit | `events/_partials/_card-event.blade.php` | S |
| 8 | Job mobile card: salary not visible when right rail hidden at `<md` — show salary in main column on mobile | `jobs/_partials/_job-card.blade.php` | XS |
| 9 | Homepage body sections: audit strip headers, "View all" links, and CTA band | `unifieds/_partials/_index-body.blade.php` | M |
| 10 | Homepage stats band: verify DM Serif large numbers | Same file | XS |

### 🟡 P2 — Polish (improves quality significantly)

| # | Task | File(s) | Effort |
|---|---|---|---|
| 11 | Property detail: breadcrumb, gallery lightbox, sidebar CTA audit | `properties/show/` | M |
| 12 | Service detail: header, sidebar form, styles_extra audit | `services/show/` | M |
| 13 | Job detail: header + application sidebar | `jobs/show/job-detail.blade.php` | S |
| 14 | Product detail: gallery, specs table, seller sidebar | `products/show/` | M |
| 15 | Blog post detail: prose styles, sidebar naming issue (`_seller_contact_card`) | `blogs/show/` | S |
| 16 | Booking flows: header treatment (plain white → dark strip) | `properties/booking/`, `events/booking/` | S |
| 17 | Cart + Checkout: header treatment + Stripe Elements styling | `products/cart.blade.php`, checkout partials | M |
| 18 | Legal page sidebar: add anchor-link table of contents | `pages/terms.blade.php`, `pages/privacy-policy.blade.php` | S |
| 19 | Terms/Privacy: make "Last updated" date a config/DB setting | Both legal pages + config | XS |

### 🟢 P3 — Nice to have (elevates the product)

| # | Task | File(s) | Effort |
|---|---|---|---|
| 20 | Unifieds taxonomy pages (brands, categories, partners, tags) — dark hero strips | `unifieds/brands/show.blade.php` etc. | S |
| 21 | Footer: newsletter form backend connection + success state | Footer partial + controller | M |
| 22 | Nav: sticky scroll behaviour (backdrop-blur + border on scroll) | Layout + CSS | XS |
| 23 | Nav: active state for current route | Layout partial | XS |
| 24 | 404 / 500 error pages: verify they use brand styling not Laravel defaults | `errors/404.blade.php` | XS |
| 25 | Image optimisation: add `loading="lazy"` + `width/height` to all listing card images | All card partials | S |
| 26 | Accessibility: audit focus rings, aria labels, skip links, colour contrast ratios | All pages | L |
| 27 | Open Graph / meta: verify `og:image`, `og:description` on all detail pages | Layout + page files | S |
| 28 | Sitemap: verify all public routes are included | `routes/web.php` + sitemap package | S |

---

## 10 · Design Rules (Enforce Across All Work)

1. **Dark sections only appear at three levels** — hero (full grid+glow), inner page hero (same class, less height), secondary panels (`.dark-brand-panel`, faint glow only). Never mix levels.
2. **All page-level headers on dark pages use** `.page-hero-title` + `.page-hero-accent` + `.page-hero-subtitle` for consistent colour and sizing.
3. **Listing page headers always use** `.listing-page-banner` — never a custom white div.
4. **Card images use `aspect-ratio` containers** — never fixed pixel heights that break on resize.
5. **All forms follow the auth form pattern**: `.form-icon-group` wrapper, icon in `.input-icon`, password toggle in `.password-toggle`.
6. **Colours from tokens only** — never hardcode `#E05F2C` in new Blade files; always use `var(--primary-color)`.
7. **No inline CSS for structural layout** — only for per-item dynamic values (icon colours, accent colours from PHP arrays).
8. **DM Serif for all headings, display numbers, and editorial labels** — Plus Jakarta Sans for body only.
9. **AOS animations** — only on elements that are below the fold initially. Never on the first viewport's content.
10. **Pexels images** — hotlinked with `?auto=compress&cs=tinysrgb&w=800` params. Not for production; plan self-hosted or Cloudflare R2 storage for real deployment.

---

## 11 · Session Work — Completed Summary

### Session 1
| Completed | Files changed |
|---|---|
| Footer Privacy/Terms links | `_footer.blade.php`, DB cache cleared |
| Footer company column links | `MenuService.php`, cache cleared |
| About page full redesign | `pages/about.blade.php` |
| Login page split layout | `auth/login.blade.php`, `auth.css` |
| Register page split layout | `auth/register.blade.php` |
| `.dark-brand-panel` utility (Level 3) | `style.css` |
| About CTA band → `.dark-brand-panel` | `pages/about.blade.php` |
| Login/Register panel → `.dark-brand-panel` | Both auth files, `auth.css` |
| Contact page dark hero + channel card + placeholder fix | `pages/contact.blade.php` |
| FAQ page dark hero + stat panel | `pages/faq.blade.php` |
| All listing page banners | `_page-heading.blade.php`, `style.css` |
| Jobs listing card redesign (horizontal layout) | `jobs/_partials/_job-card.blade.php`, `style.css` |
| PageSeeder cleanup | `PageSeeder.php` |

### Session 2
| Completed | Files changed |
|---|---|
| About hero: migrated to `hero-section--dark` system (removed parallel CSS) | `pages/about.blade.php` |
| About CTA band: photo background (high overlay for stock image) | `pages/about.blade.php` |
| `page-hero-title/accent/subtitle` moved to global `style.css` (was duplicated in 4 pages) | `style.css`, `contact`, `faq`, `terms`, `privacy` |
| Inner-page hero dot grid subordinated: 44px/18% vs homepage 28px/38% | `style.css` |
| `hero-section--dark` background `!important` removed (was blocking `.about-hero` override) | `style.css` |
| Contact hero: `bi-shield-check-fill` → `bi-shield-fill-check` (missing icon fix) | `pages/contact.blade.php` |
| Classifieds card: removed double `col` wrapper, added `btn-primary-light`, hover transition, timestamp fix | `classifieds/_partials/_card.blade.php`, `style.css` |
| Partner auth: `.dark-brand-panel` applied, glow class removed | `auth/_marketing_panel.blade.php`, partner auth files |
| Events orphan partial deleted | `events/_page_header_events.blade.php` |
