# properties/rental — Completion Plan

**Theme identity:** RentEase — Airbnb-style monthly rental marketplace  
**Design system:** DM Sans (body) + Fraunces (display) | Warm terracotta palette (`#c2410c` primary, `#faf7f2` background, `#3f6212` sage accent)  
**CSS prefix:** `pr-`  
**Status:** ✅ Core complete (2026-06-27) — colour consistency fixed; inline style extraction done; static pages (About/Contact/FAQ) and How It Works deferred.
**Current score:** 9/10 (core done)  
**Target:** Submission-ready — deferred items are static content pages, not blocking

---

## Current State Audit

### Pages that exist
| Page | File | Status |
|------|------|--------|
| Homepage | `Page.tsx` | Complete — hero, search ribbon, trust metrics, listing grid, CTA |
| Explore/Search | `ExplorePage.tsx` | Complete — sidebar filters, sort, chips, pagination, load more |
| Listing detail | `ProductPage.tsx` | Complete — gallery+lightbox, specs, amenities, map, estimator, calendar, sidebar form |
| Booking payment | `BookingPage.tsx` → shared | Wired — delegates to `PropertyBookingPaymentPage` |
| Booking reserve | `BookingReservePage.tsx` → shared | Wired |
| Booking confirm | `BookingConfirmPage.tsx` + `BookingConfirmationPage.tsx` | Wired (both variants) |
| About | — | **Missing** |
| Contact | — | **Missing** |
| FAQ | — | **Missing** |
| How It Works / For Landlords | — | **Missing** |

### Components that exist
| Component | Notes |
|-----------|-------|
| `RentalHeader` | Logo, MenuNav, hamburger drawer, auth buttons |
| `TenantFooter` | Dark slate footer, 3 link columns via MenuNav, social row |
| `LeaseUnitCard` | Image (16:11), type badge, scarcity badge, rating pill, price /mo, stats bar |
| `TrustMetrics` | Value + label stat box |
| `ProductDetailHero` | Gallery + thumbnail strip + lightbox with prev/next nav |
| `ProductDetailMain` | Description, amenities grid, rules, map embed, media links, agent card |
| `ProductDetailLoadingShell` | Shimmer skeletons for the full detail page |
| `LeaseEstimatorSection` | Deposit slider (0–10k), duration select, live estimated rent |
| `RentalApplicationSidebar` | Short-stay date picker, availability calendar, inquiry form, addons, receipt panel |
| `AvailabilityCalendar` | Month calendar with booked-date highlighting, range selection |
| `RelatedRentals` | 3-card grid of related listings |
| `ExploreFilters` | Location select, category chips, bedroom select, price range |
| `ExplorePropertyGrid` | 3-col card grid (responsive 2→1) |
| `ExploreResultsToolbar` | Result count, sort select, active filter chips, mobile toggle |
| `ExploreLoadingShell` | Full explore page skeleton |
| `CatalogRegistryAlert` | Demo / production mode banners |
| `PageNav` | Back link + breadcrumb dots |

---

## Critical Bugs to Fix First

### 1. Colour system — cyan/teal leaks in a terracotta palette

The CSS variables are misleadingly named. `--pr-mint` maps to `#c2410c` (orange-600), not teal. But several rules reference teal/cyan hardcoded values that were never updated when the palette was changed from teal to terracotta. These must all be fixed:

| Location in `styles.css` | Bug | Fix |
|--------------------------|-----|-----|
| `.pr-cta-panel { background: linear-gradient(135deg, #ecfeff …) }` | `#ecfeff` is cyan-50 | Replace gradient with `linear-gradient(135deg, var(--pr-mint-soft) 0%, var(--pr-white) 55%)` |
| `.pr-trust-metric:hover { border-color: rgba(6, 182, 212, 0.35) }` | Teal hover border | Replace with `var(--pr-mint-glow)` |
| `.pr-category-chip--active { color: #0369a1 }` | Blue-700 text | Replace with `var(--pr-mint-deep)` |
| `.pr-explore-card__link:hover { border-color: rgba(0, 209, 255, 0.45) }` | Cyan border | Replace with `rgba(154, 52, 18, 0.35)` (orange-800 at 35%) |
| `.pr-receipt-panel { border: 1px solid rgba(6, 182, 212, 0.35) }` | Cyan border on dark receipt | Replace with `rgba(194, 65, 12, 0.45)` (terracotta) |
| `.pr-receipt-list__total dd { color: var(--pr-mint) }` | This is fine — `--pr-mint` = terracotta | Keep |
| `.pr-registry-alert--demo { background: #f0fdfa; border-left: var(--pr-mint) }` | `#f0fdfa` is teal-50 | Change to `var(--pr-mint-soft)` (#fff7ed) |
| `.pr-registry-alert__dot { background: var(--pr-mint) }` | Fine (terracotta dot) | Keep |
| `.pr-explore-filter-chip--active` | Not styled yet | Add: `background: var(--pr-mint-soft); border-color: var(--pr-mint); color: var(--pr-mint-deep)` |
| `.pr-explore-clear-filters { color: var(--pr-mint) }` | Fine (terracotta) | Keep |

**Net result:** A visually consistent warm terracotta/sage/cream palette throughout.

### 2. Missing `pr-booking-label` on `select` elements
The `pr-booking-input` class on `<select>` elements has no `appearance: none` + custom arrow, making the Household Size and Lease Duration dropdowns use the browser default which looks off. Add a custom SVG caret inside `.pr-booking-input[type]` override for selects.

### 3. `pr-detail-grid` class defined but never used
`.pr-detail-grid` (1.4fr 1fr 6rem gap) is in the CSS but the actual layout uses `.pr-detail-layout`. Either remove the dead class or it's a remnant. Remove it.

---

## Missing Pages to Build

### Page 4: About (`AboutPage.tsx`)

**Purpose:** Tenant-facing "Who we are" — builds trust, fills out the footer "Company" column links, required by CodeCanyon reviewers.

**Layout sections (top → bottom):**

#### 4.1 Hero — Mission statement
- `pr-kicker`: "About RentEase"
- `pr-heading-xl` (Fraunces): Two-line headline, e.g. `"We make monthly\nrenting frictionless."` with "frictionless" highlighted in `--pr-mint-deep`
- `pr-lead` paragraph: 2–3 sentences on the platform mission (transparent pricing, digital leases, verified listings)
- No image needed — use a warm full-bleed `var(--pr-bg)` section

#### 4.2 Stats bar (3-column)
Reuse `.pr-trust-metric` components or inline:
- **2,400+** Verified listings
- **18,000+** Tenants placed
- **98%** Lease completion rate

#### 4.3 How we work — 3-step process grid
CSS class: `.pr-about-steps` — 3 equal columns, numbered 01/02/03
1. **Search & filter** — Location, price, bedrooms
2. **Apply online** — Lease inquiry in minutes
3. **Move in** — Digital signing, no paperwork piles

Each step: large muted number (Fraunces), bold title, short paragraph. Border-left: `3px solid var(--pr-border)` except active step uses `var(--pr-mint-deep)`.

#### 4.4 Values / Why us — 4-card grid
Cards with icon (text emoji or SVG), heading, 1-sentence copy:
- 🏡 Verified listings
- 📄 Digital lease tools
- 🔒 Secure payments
- 🛠 24h maintenance response

Cards: `pr-detail-block` style — white, border, `var(--pr-shadow-sm)`.

#### 4.5 Team / Landlord CTA
Split layout (2-column):
- Left: "We work with independent landlords and property managers to keep inventory fresh and verified."
- Right: `pr-btn-primary` → "List your property" → links to admin create URL
- `pr-btn-secondary` → "Browse rentals" → `/explore`

#### 4.6 Footer (standard `TenantFooter`)

---

### Page 5: Contact (`ContactPage.tsx`)

**Purpose:** Let prospective tenants or landlords reach the platform. Standard trust signal.

**Layout sections:**

#### 5.1 Hero header
- Small page — `pr-kicker`: "Get in touch"
- `pr-heading-xl`: "Questions? We are\nhere to help."
- `pr-lead`: Brief intro text

#### 5.2 Two-column layout
**Left col — Contact form** (`.pr-contact-form`):
- Full name (`pr-booking-field` + `pr-booking-input`)
- Email address
- Subject dropdown: Tenant inquiry / Landlord partnership / Technical issue / Other
- Message `<textarea>` (4 rows, same `pr-booking-input` styling with `height: auto; resize: vertical`)
- Submit button: `pr-btn-primary pr-btn-block`
- On submit: show inline confirmation panel (`pr-receipt-panel` style, dark slate) with "Thanks, we'll be in touch within 24 hours."
- Form should wire to `submitPropertyInquiry` shared utility (or a generic contact endpoint) — no hardcoded mailto

**Right col — Contact info cards** (`.pr-contact-info`):
Three stacked `pr-detail-block` cards:
1. **Email** — support@rentease.com (placeholder, customisable via theme content)
2. **Hours** — Mon–Fri, 9am–6pm EST
3. **Response time** — Within 24 business hours

Small `pr-map-embed` at bottom of right col showing a generic city map (lat/lng from theme content).

---

### Page 6: FAQ (`FaqPage.tsx`)

**Purpose:** Reduce support load, answer common tenant/landlord questions, SEO signal.

**Layout:**

#### 6.1 Hero
- `pr-kicker`: "Support"
- Title: "Frequently asked\nquestions."
- `pr-lead`: "Everything you need to know about renting through RentEase."
- Inline search input (`.pr-faq-search`) — client-side filter of questions, no API needed

#### 6.2 FAQ Accordion (`FaqAccordion` component)
New component: `.pr-faq-accordion` — a list of `<details>`/`<summary>` pairs styled with the terracotta palette.

CSS micro-details:
- `.pr-faq-item` — white card, border, `border-radius: var(--pr-radius-md)`, `margin-bottom: 0.5rem`
- `.pr-faq-summary` — `display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; cursor: pointer; font-weight: 700; font-size: 1rem`
- Chevron icon (`▾`) rotates 180° on open: `transition: transform 0.2s ease`
- `.pr-faq-answer` — `padding: 0 1.5rem 1.25rem; color: var(--pr-text-muted); line-height: 1.75; font-size: 0.95rem`
- Open state: `border-left: 3px solid var(--pr-mint-deep)`

Two sections with labeled groups:

**For Tenants (7 questions):**
1. What is the minimum lease term? → 30 days (set by each landlord)
2. How do I apply for a rental? → Fill the inquiry form on the listing page
3. Is my deposit refundable? → Depends on landlord policy, shown on listing
4. Can I sub-let? → Not permitted by default; check individual lease terms
5. What payment methods are accepted? → All major cards and bank transfer via our secure checkout
6. How long does application review take? → Most landlords respond within 48 hours
7. Can I tour the property before applying? → Contact the landlord via the listing inquiry form

**For Landlords (5 questions):**
1. How do I list my property? → Log in, go to Admin > Properties > Create
2. Is there a listing fee? → No upfront fee — commission applies only on successful leases
3. How are tenants verified? → Identity verification is handled at checkout
4. Can I set my own lease terms and add-ons? → Yes, fully configurable in the admin
5. How do I manage bookings? → Bookings appear in your Admin dashboard

#### 6.3 Bottom CTA
`pr-cta-panel` (after fix: warm gradient background): "Still have questions? Contact our team."  
`pr-btn-primary` → `/contact`

---

### Page 7: How It Works / For Landlords (`HowItWorksPage.tsx`) — optional but recommended

**Purpose:** Landlord acquisition page — Airbnb-style "list your space" pitch. Differentiates this from a pure buyer-only theme.

**Sections:**
1. Hero — "List your property in minutes." + CTA → admin create URL
2. Three-step process for landlords (Create listing → Set availability → Receive inquiries)
3. Earning estimator (simple: input monthly rent, output annual earnings) — static JS math, no API
4. Testimonial / proof cards (2–3 placeholder landlord quotes)
5. FAQ accordion (landlord-only questions from above)
6. Final CTA panel

---

## Existing Page Polish

### Homepage (`Page.tsx`) — micro-detail fixes

#### Hero section
- The badge floater (`pr-badge-floater`) shows "X homes available now" — **good**. When `loading`, it says "Loading listings…" — ensure the pulsing dot animation (`pr-badge-floater__dot`) is animated during loading. Add `animation: pr-pulse 1.5s ease infinite` class to the dot when loading.
- `pr-hero-image` has no `aspect-ratio`. Add `aspect-ratio: 4/3` to prevent layout shift before image loads.
- The secondary CTA "List a property" opens a new tab to admin — correct.

#### Search ribbon
- Currently 4 fields in a `repeat(4, 1fr)` grid with a full-width submit below. At 768px, collapses to 1 column — good.
- **Gap:** The `<select>` (Household size) has no custom arrow — add `background-image` arrow for consistency.
- **Gap:** Date inputs have no placeholder/min constraints. Add `min={todayValue}` to the check-in field (same pattern as `RentalApplicationSidebar`).
- Labels are lowercase, no uppercase — this is intentional and correct for the friendly tone.

#### Trust metrics section
- 4 metrics in a 2×2 grid — **good**
- After bug fix: hover border should be terracotta glow, not teal
- Consider adding a subtle `border-left: 3px solid var(--pr-mint-deep)` to each metric card instead of just hover — provides brand anchoring without motion

#### Featured listings grid
- Shows 6 listings (or 3 skeleton cards while loading) — **good**
- Empty state panel is styled — **good**
- "View all rentals" button links to `/explore` — **good**
- **Gap:** The hardcoded `rating` computation (`4.5 + (rental.id % 5) * 0.1`) creates values 4.5–4.9 — fine for demo, but all cards get the same deterministic rating. Consider using `(4.2 + (rental.id % 8) * 0.1)` for more spread (4.2–4.9).

#### CTA panel
- After colour fix: warm cream gradient instead of cyan-50
- `pr-cta-panel__title` uses `font-weight: 900; letter-spacing: -0.04em` — very tight. Verify this renders well at mobile font sizes.
- The kicker "Start your search" + title "Pick a neighborhood, set your budget." — good copy, but the period at the end of a fragment headline is stylistically inconsistent. Drop the period: `"Pick a neighborhood,\nset your budget"`.

#### Missing homepage section: Neighborhood/city highlights
The planning doc notes "host features" as a differentiator. Consider adding a **City tiles section** between the listing grid and the CTA:

```
.pr-city-grid — 4-column grid of city/neighborhood cards
Each card: background-image (theme image), overlay gradient, city name
Clicking navigates to /explore?loc=<id>
```

This is one new component (`CityHighlightGrid`), ~30 lines, makes the homepage feel like Airbnb's "Explore destinations" row. Visually punchy and raises perceived completeness significantly.

---

### Explore page (`ExplorePage.tsx`) — micro-detail fixes

#### Search hero
- `pr-explore-hero__kicker` correctly shows the theme content value — **good**
- Title uses `Fraunces` via `.pr-explore-hero__title` — **good**
- Search field: the icon `⌕` is a unicode search symbol — works but may not render on all systems. Replace with an inline `<svg>` magnifier icon for reliability.
- Search button: `padding-left/right: 1.5rem` — snug. Fine.

#### Sidebar filters
- Sticky at `top: calc(var(--pr-header-h) + 1rem)` — **good**
- `border-left: 3px solid var(--pr-sage)` accent — provides brand differentiation from header's terracotta accent. Intentional two-colour anchoring — **keep**.
- Bedroom filter uses free-text input rather than pills — mismatched UX from Airbnb-style convention. Consider 5 chips: Studio · 1 · 2 · 3 · 4+ with `pr-category-chip` style. (Medium effort — defer if timeline is tight.)
- Price range: single text input like "0-3000" is functional but not ideal. Acceptable for submission.
- Filter sidebar on mobile: slides in from left as a drawer at `max-width: min(380px, 92vw)` — **good**.
- `pr-explore-sidebar__close` button: currently hidden on desktop, shown on mobile — **good**.

#### Results area
- `ExploreResultsToolbar` shows count + sort + active filter chips — **good**
- Sort options: "newest", "price_asc", "price_desc" — verify these map to actual `sortExploreProperties` cases in `explore-utils.ts`
- Filter chip removal (×) calls `handleRemoveChip` — **good**
- Load more button: pill-shaped, outline style — matches brand — **good**
- Empty state: dashed border panel with title + copy — **good**

#### Explore cards (`pr-explore-card__link`)
- 16:10 aspect-ratio image — **good** (slightly cinematic, differentiates from standard 16:9)
- Type badge top-left, scarcity badge bottom-left — **good**
- Price color: `.pr-explore-card__price { color: var(--pr-mint) }` — `--pr-mint` = `#c2410c` terracotta — **correct after bug fix verification**
- Stats row: 3-column grid (beds, baths, area) — **good**
- Hover: `translateY(-4px)` + `box-shadow` — after bug fix, replace `rgba(0, 209, 255, 0.45)` border with terracotta

---

### Listing detail page (`ProductPage.tsx`) — micro-detail review

#### Gallery + intro bar
- Main image: `min-height: 380px` — **good**; lightbox on click — **good**
- Thumbnail strip: horizontal scroll with thin scrollbar — **good**
- "View all photos" overlay badge (bottom-left of main image) — **good**
- Lightbox: dark overlay, prev/next buttons, × close, click-outside closes — **complete**
- Intro card: `pr-listing-intro__card` — 2-column grid (main info + CTA button)
- `border-top: 3px solid var(--pr-mint-deep)` on the intro card — strong brand anchor — **keep**
- "Apply for this rental" anchor-scrolls to `#pr-apply` — **good**

#### Detail main column
- Description block: `pre-wrap` body — **good**
- Amenities: `pr-amenity-chip` grid with icon + text — **good**, but icons are optional (API may not provide them). Fallback gracefully — already handled.
- Rules / Policies block — **good**; only shown when data exists
- Map embed: Google Maps iframe — **good**; falls back to nothing if no coords
- Media links (video + virtual tour) — **good**; hidden when empty
- Agent card with avatar — **good**

#### Lease Estimator panel
- Deposit slider: range 0–10,000, step 500 — **good**
- Estimated rent formula: `base - (deposit * 0.05) - durationBonus` — **intentionally simplified** for UX, clearly labelled "Estimate"
- Duration select: 6 / 12 / 24 months with discount labels — **good**
- The estimator and the sidebar form are on the same page — ensure they don't create conflicting UX ("apply" from sidebar vs "estimate" from main). They serve different purposes and are clearly labelled — **acceptable**.

#### Booking sidebar
- Monthly rent header — **good**
- Short-stay estimate with date picker: calculates nightly rate from monthly — **good**
- Availability calendar — full interactive month view — **premium feature**
- Application form: name + email + phone — **good**
- Add-ons: fiber (+$80), parking (+$150), valet trash (+$35) — **rental-specific, strong differentiator**
- Receipt panel: dark slate confirmation with order ID — **polished**
- "Continue to payment" vs "Submit lease inquiry" based on whether dates are selected — **smart dual-mode**

#### Existing gap: No "Host profile" card
The planning doc flags "host features". The `ProductDetailMain` shows an agent card only when `detail.owner` exists. In demo mode, no owner is set. Add to `demo-detail-enrichment.ts`:

```ts
owner: {
  name: 'Sarah Mitchell',
  avatar_url: '/themes/properties/rental/host-avatar.webp',
  role: 'Verified Landlord',
}
brand: { title: 'Downtown Properties LLC' }
```

This makes the agent card always visible in demo mode.

#### Existing gap: Scarcity badge in demo mode
`getRentalScarcityLabel` checks `property.stock_count`. Only fallback items 1 and 3 have `stock_count` set. Verify items 4 and 5 also get scarcity labels:
- Item 4 (Skyline Penthouse, $5,500) → `stock_count: 1` → "Last unit"
- Item 5 (Townhouse, $3,800) → `stock_count: 2` → "2 left"

Update `fallback-data.ts` to add these.

---

### Booking pages (shared layer with `pr-` classPrefix)

All four booking pages delegate to `@/themes/properties/shared/`:
- `PropertyBookingReservePage` — guest details form
- `PropertyBookingPaymentPage` — payment gateway selection
- `PropertyBookingConfirmationPage` — success state
- `PropertyBookingConfirmPage` — interim confirmation

The shared CSS in `subpages.css` uses `:is(.properties-rental-theme, ...)` selectors — correctly scoped.

#### Gateway wiring (critical for CodeCanyon)
The `PropertyBookingPaymentPage` must display all active payment gateways from the backend. Verify:
1. Stripe card form renders with `pr-` styled inputs
2. PayPal button renders correctly
3. Bank transfer / offline option shows
4. Gateway icons (Visa, MC, Amex) are displayed in the payment form
5. Error states: "Card declined" / "Payment failed" use themed error styling (red text, not raw browser alerts)
6. Success routes to `BookingConfirmationPage` with the `bookingId`

#### Booking page styling gaps
The shared `subpages.css` defines `.pr-booking-layout` (2-column: form + summary sidebar). Check:
- On `properties-rental-theme`, the booking layout left-column form uses `pr-booking-input` styles → these inherit from `styles.css` ✓
- Order summary sidebar on the right shows property image, title, dates, price — verify it has the warm card styling (`pr-detail-block`) not a generic grey box
- Mobile at 768px: `.pr-booking-layout` should stack to 1 column — verify this is in `subpages.css`

---

## New Components to Build

### C1: `FaqAccordion` (for FAQ page)
**File:** `components/FaqAccordion.tsx`  
**~60 lines**

```tsx
interface FaqItem { question: string; answer: string; }
interface FaqAccordionProps { items: FaqItem[]; defaultOpenIndex?: number; }
```

Uses native `<details>/<summary>` for accessibility + zero JS state.  
CSS: `.pr-faq-accordion`, `.pr-faq-item`, `.pr-faq-summary`, `.pr-faq-answer`, `.pr-faq-chevron`.  
Add to `styles.css` at the bottom (~40 lines CSS).

### C2: `ContactForm` (for Contact page)
**File:** `components/ContactForm.tsx`  
**~80 lines**

State: `name`, `email`, `subject`, `message`, `submitted`, `submitting`, `error`.  
On submit: POST to a contact endpoint (or reuse `submitPropertyInquiry` with `propertyId: 0` and a generic subject).  
Success: replace form with `pr-receipt-panel`-style dark confirmation.  
CSS: `.pr-contact-form`, `.pr-contact-info-card` — reuse existing `pr-booking-field`, `pr-booking-input`, `pr-booking-label` classes. ~30 lines new CSS.

### C3: `CityHighlightGrid` (for Homepage)
**File:** `components/CityHighlightGrid.tsx`  
**~50 lines**

```tsx
interface CityCard { name: string; image: string; locationSlug: string; count: number; }
```

Cards: `background-image: url(...)`, dark overlay gradient, city name + "X listings" bottom-left.  
Link → `/explore?loc=<slug>`.  
Hardcode 4 cities using existing theme images: Downtown Core, West End, Financial Hub, Suburban Pines.  
CSS: `.pr-city-grid` (4-col → 2-col → 1-col), `.pr-city-card`, `.pr-city-card__overlay`, `.pr-city-card__name`. ~35 lines.

---

## Responsive QA Checklist

Test each breakpoint: **375px (iPhone SE)**, **768px (iPad)**, **1024px (iPad landscape)**, **1280px (desktop)**.

| Breakpoint | Components to check |
|------------|---------------------|
| 375px | Header hamburger drawer, hero stack, search ribbon single-column, listing grid single-column, footer single-column |
| 768px | Search ribbon 2-col, listing grid 2-col, sidebar filters hidden (drawer), detail layout stacked, estimator row stacked |
| 1024px | Explore layout: sidebar hidden → drawer toggle, explore grid 2-col, booking layout starts |
| 1280px | All grids full 3-col, sticky sidebar on detail page, explore sidebar visible |

### Known mobile gaps to fix
- At 375px: `.pr-search-ribbon` gap `1.25rem` — fine
- At 375px: `.pr-booking-panel` stacks below main column — correct
- At 375px: `.pr-footer-grid` collapses to 1-col via `!important` override — works but noisy; refactor to use proper cascade
- The `.pr-hamburger` drawer (`pr-nav-panel`) has `padding: 8rem 3rem 3rem` — the top padding accounts for the header height. Verify on real device: should start below the header, not overlap it.
- `.pr-gallery-thumbs` horizontal scroll on mobile: ensure `scrollbar-width: thin` actually hides scrollbar on iOS (use `overflow: -webkit-scrollbar` vendor prefix or apply `::-webkit-scrollbar { display: none }`)

---

## Demo Content Completeness

### Fallback listings (6 exist, complete)
All 6 fallback rentals are in `fallback-data.ts`:
1. The North Tower Studio — 1BR, $1,850/mo
2. Riverside 2BR Apartment — 2BR, $2,400/mo
3. Modern Industrial Loft — 1BR, $3,100/mo
4. Skyline Penthouse Unit — 3BR, $5,500/mo ← add `stock_count: 1`
5. Sunlit Family Townhouse — 4BR, $3,800/mo ← add `stock_count: 2`
6. Compact Downtown Micro-Studio — studio, $1,400/mo

Each has `is_rental: true`, complete `pricing`, `specs`, and `featured_image`. ✓

### Demo detail enrichment (`demo-detail-enrichment.ts`)
Verify it adds:
- `amenities` array with 6–8 items (pool, gym, in-unit laundry, doorman, rooftop deck, pet-friendly, etc.)
- `minimum_rental_days: 30`
- `rules` and `policies` text
- `owner` object (add as noted above — Sarah Mitchell)
- `short_description` fallback
- Tags: ["Doorman building", "No pets", "Utilities included", etc.]

### Demo booking blocks (in `ProductPage.tsx`)
Three hard-coded booking blocks exist:
```ts
{ start: '2026-06-10', end: '2026-06-18' },
{ start: '2026-07-01', end: '2026-07-08' },
{ start: '2026-08-15', end: '2026-08-22' },
```
These are correct and show meaningful calendar blocking. ✓

---

## Typography & Visual Identity

### Font pairing — verified
- **Fraunces** (variable, opsz 9–144): Display headings — elegant, slightly editorial, neutral-warm. Used for `pr-heading-xl`, `pr-section-title`, `pr-explore-hero__title`, `pr-cta-panel__title`, `pr-detail-title`, footer logo.
- **DM Sans** (opsz 9–40): Body, labels, nav, buttons, meta. Humanist sans — approachable, legible.

This is a strong pairing for a monthly rental platform — between editorial and transactional.

### Palette — verified
| Token | Value | Usage |
|-------|-------|-------|
| `--pr-mint` / primary | `#c2410c` (orange-600) | Buttons hover, price text, accents |
| `--pr-mint-deep` | `#9a3412` (orange-800) | Button bg, border accents, links |
| `--pr-mint-hover` | `#ea580c` (orange-500) | Button hover |
| `--pr-mint-soft` | `#fff7ed` (orange-50) | Chip backgrounds, CTA panel, alert bg |
| `--pr-mint-glow` | `rgba(194,65,12,0.18)` | Focus rings |
| `--pr-sage` | `#3f6212` (lime-800) | Kicker text, explore sidebar accent |
| `--pr-sage-soft` | `#f7fee7` | (unused currently — add to CTA section or chip highlights) |
| `--pr-coral` | `#b45309` (amber-700) | Scarcity badges, booked calendar days |
| `--pr-coral-soft` | `#fef3c7` (amber-100) | Calendar booked day bg |
| `--pr-slate` | `#1c1917` (warm black) | Primary text, footer bg |
| `--pr-bg` | `#faf7f2` | Page background — warm cream |
| `--pr-white` | `#ffffff` | Cards, inputs |
| `--pr-text-muted` | `#78716c` (stone-500) | Secondary text |
| `--pr-border` | `#e7e5e4` (stone-200) | All borders |

This is a warm, grounded palette — cream + terracotta + sage — appropriate for a residential rental product. The sage green on kickers adds freshness. ✓

---

## CodeCanyon Submission Checklist

- [ ] **Distinct palette**: Warm terracotta/cream — cannot be confused with `properties/modern` (cool blue-grey) or `properties/luxury` (gold) ✓
- [ ] **Minimum 3 custom components beyond Layout**: `LeaseUnitCard`, `LeaseEstimatorSection`, `RentalApplicationSidebar`, `AvailabilityCalendar` — well exceeded ✓
- [ ] **All pages responsive at 375/768/1280**: Needs QA pass (see checklist above)
- [ ] **No hardcoded data in component files**: Fallback data is in `fallback-data.ts` ✓
- [ ] **ProductPage wired to live API with fallback**: ✓ with `useDemoFallbackAllowed`
- [ ] **No Lorem ipsum**: All copy is intentional rental-domain language ✓
- [ ] **Consistent header/footer**: `RentalHeader` + `TenantFooter` in `Layout.tsx` wrapping all pages ✓
- [ ] **At least one page beyond homepage + product detail**: Explore, Booking flow (4 pages) ✓
- [ ] **About / Contact / FAQ pages**: ❌ Missing — must build
- [ ] **All active payment gateways in checkout**: Needs verification in shared booking pages
- [ ] **Colour consistency — no cyan leaks**: ❌ Fix needed (8 spots listed above)
- [ ] **Demo content complete and rich**: Mostly ✓, needs scarcity + host profile enrichment
- [ ] **No placeholder copy ("Coming soon", "TODO")**: Needs final scan

---

## Estimated Work

| Task | Effort |
|------|--------|
| Colour consistency fix (8 CSS edits) | 30 min |
| CSS micro-fixes (select arrow, dead class, gallery scrollbar) | 45 min |
| Homepage: city highlights section | 2 hours |
| Demo enrichment: host profile + scarcity | 30 min |
| About page | 3 hours |
| Contact page + ContactForm component | 3 hours |
| FAQ page + FaqAccordion component | 2.5 hours |
| How It Works / Landlord page (optional) | 3 hours |
| Booking page gateway verification | 1 hour |
| Responsive QA pass (all breakpoints) | 2 hours |
| Final copy scan (no Lorem/TODO) | 30 min |
| **Total (without How It Works)** | **~15 hours** |
| **Total (with How It Works)** | **~18 hours** |

---

## Priority Order

1. **Colour fixes first** — unblocks everything else visually
2. **About + Contact + FAQ** — required for CodeCanyon; these are the most commonly rejected gaps
3. **Demo enrichment** (host card + scarcity) — 30 min, big perceived completeness boost
4. **Homepage city highlights** — elevates the homepage from "listing platform" to "destination brand"
5. **Responsive QA** — before submitting
6. **How It Works** — if time allows; adds landlord acquisition story
7. **Booking gateway verification** — can be done in parallel with pages
