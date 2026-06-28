# unifieds/marketplace — Completion Plan

**Theme identity:** MarketHub — all-in-one multi-vertical marketplace  
**Design system:** Inter (single font) | Blue/Orange palette (`#0d6efd` / `#fd7e14`) | Frosted-glass header | Radial gradient background  
**CSS prefix:** `um-`  
**Wrapper class:** `market-hub-wrapper`  
**Current score:** 8.5/10 — broadest buyer pool, cleanest multi-vertical architecture; needs static pages, 8 code-level bugs fixed, and one visual identity strengthening pass  
**Target:** Submission-ready 9/10+

---

## Current State Audit

### Pages that exist
| Page | File | Status |
|------|------|--------|
| Homepage | `Page.tsx` | Complete — hero, sync bar, category blocks, market grid, trending listings, trust + testimonials, final CTA |
| Explore | `ExplorePage.tsx` | Complete — vertical tabs w/ counts, category chips, search/sort/category, 7-API grid, load more |
| Listing detail | `ProductPage.tsx` | Complete — works across ALL 7 verticals, image, specs, chips, owner panel, add-to-cart |
| Cart | `CartPage.tsx` → shared | Wired |
| Checkout | `CheckoutPage` → shared `UnifiedCheckoutPage` | Wired |
| Checkout confirm | `CheckoutConfirmationPage` + `CheckoutConfirmPage` → shared | Wired |
| About | — | **Missing** |
| Contact | — | **Missing** |
| FAQ | — | **Missing** |
| Sell / Partner | — | **Missing** (hero promo card teases it) |

### Components that exist
| Component | Notes |
|-----------|-------|
| `MarketplaceHeader` | Gradient logo mark + name, compact pill search, flat MenuNav, hamburger, auth buttons |
| `MarketplaceFooter` | Dark footer with logo, brand description, 7 vertical chip links, 3 footer menu columns, social nav, back-to-top button, live year |
| `MarketGrid` | 7-card icon grid, each card fetches live count via `api.get*({per_page:1})`, color-coded per vertical |
| `LiquidSyncBar` | 4-feature trust bar: Verified Sellers, Secure Checkout, Fresh Listings Daily, Multi-vertical Search |

### What's architecturally excellent (do not change)
- `Promise.allSettled` pattern across 7 APIs — graceful per-vertical degradation
- `ExploreListing` normalized type merging all verticals to a common card shape
- `fetchMarketplaceDetail(vertical, slug)` routing one function across all 7 vertical APIs
- Hero live listing count from all 7 APIs simultaneously, shown in meta strip
- Testimonials section: pulls from API, falls back to curated image — smart
- `addProductToCart` wired in the product detail page, with live cart count via `useUnifiedCartCount`
- Category highlight blocks fetch first image from live API and fall back to static theme images

---

## Bugs to Fix

### Bug 1: Properties category has same colour as Products in `marketCategories`

In `components/index.tsx` lines 23–107, `marketCategories[1]` (Properties) has:
```ts
color: '#0d6efd',
bg: 'rgba(13,110,253,0.1)',
```
This is identical to Products (blue). The `MarketGrid` renders both with indistinguishable blue icons.

**Fix:** Give Properties a distinct colour. Recommended: green (real estate convention) or teal.
```ts
{ title: 'Properties', color: '#059669', bg: 'rgba(5,150,105,0.1)', ... }
```
Already-assigned colours: Products=blue, Autos=cyan(`#0891b2`), Services=green(`#198754`), Jobs=orange, Events=purple, Classifieds=red.
Properties→ emerald (`#059669`) fills the gap; Services can stay green since they are visually different (icon distinguishes them).

### Bug 2: Star ratings in testimonials use `*` (asterisk) not `★`

In `Page.tsx`:
```tsx
<span key={i} className={i < (t.rating ?? 5) ? 'um-star-on' : 'um-star-off'}>*</span>
```
`*` is an asterisk, not a star. Fix:
```tsx
<span key={i} className={i < (t.rating ?? 5) ? 'um-star-on' : 'um-star-off'} aria-hidden="true">★</span>
```
Add CSS:
```css
.um-star-on  { color: var(--um-orange); }
.um-star-off { color: var(--um-border); }
```

### Bug 3: Cart notice class typo in `ProductPage.tsx` (line ~563)

```tsx
<p className="uni-detail-cart-notice">
```
Should be `um-detail-cart-notice`. This class likely has no CSS applied, making the notice unstyled.

**Fix:** Rename to `um-detail-cart-notice` and add CSS:
```css
.um-detail-cart-notice {
  color: var(--um-muted);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
.um-detail-cart-notice a { color: var(--um-blue); font-weight: 700; }
```

### Bug 4: Copyright symbol — `(c)` not `©`

In `MarketplaceFooter`:
```tsx
<span>(c) {currentYear} {siteName}. All rights reserved.</span>
```
**Fix:** Replace `(c)` with `&copy;` or `©`.

### Bug 5: Category highlight loading skeleton has no shimmer

The loading state for the category highlight blocks:
```tsx
<div className="um-category-highlight um-category-highlight-loading" key={category.title}>
```
The `.um-category-highlight-loading` class likely has no shimmer animation.

**Fix:** Add to `styles.css`:
```css
.um-category-highlight-loading {
  animation: um-shimmer 1.5s ease-in-out infinite;
  background: linear-gradient(90deg, #f0f4fc 25%, #e8eef8 50%, #f0f4fc 75%) !important;
  background-size: 200% 100% !important;
  cursor: default;
  pointer-events: none;
}
.um-category-highlight-loading img,
.um-category-highlight-loading div,
.um-category-highlight-loading span,
.um-category-highlight-loading strong,
.um-category-highlight-loading h3,
.um-category-highlight-loading p {
  visibility: hidden;
}
@keyframes um-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Bug 6: Owner panel copy is too developer-facing

In `ProductPage.tsx`:
```tsx
<p>This record is synchronized from the active Sellio {detail.label.toLowerCase()} catalog.</p>
```
End-users should not see "synchronized from Sellio catalog." 

**Fix:**
```tsx
<p>This listing is managed by {detail.ownerLabel} through {siteName || 'MarketHub'}.</p>
```
Or just: `<p>Verified and published on MarketHub.</p>`

### Bug 7: Hero search category select has no custom styling

The `um-hero-search-filter` wrapper contains a `<select>` with no styling beyond browser default — inconsistent with the polished search bar design.

**Fix:** Add to `styles.css`:
```css
.um-hero-search-filter {
  align-items: center;
  border-right: 1px solid var(--um-border);
  display: flex;
  flex-shrink: 0;
  padding: 0 0.75rem;
  position: relative;
}
.um-hero-search-filter select {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--um-ink);
  cursor: pointer;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 700;
  outline: none;
  padding: 0.95rem 1.5rem 0.95rem 0;
}
.um-hero-search-divider {
  display: none; /* was used as visual divider — now handled by border-right */
}
```

### Bug 8: Non-product vertical detail page — action label is weak

For jobs, events, services, properties, autos, classifieds — the `actionLabel` is always:
- `"Browse jobs"` / `"Browse events"` / `"Browse services"` / etc.

And the CTA navigates to `/explore?vertical=jobs`. This is circular — you just came from a job listing and it sends you back to the jobs list. The intent for jobs should be "Apply" and for events "Get tickets."

**Fix:** Map better action labels per vertical:
```ts
// In productToDetail / each toDetail function:
jobs:        actionLabel: 'Apply for role',    actionHref: `/jobs/${job.slug}/apply` (or inquiry page)
events:      actionLabel: 'Get tickets',       actionHref: event.ticketing?.url || '/explore?vertical=events'
services:    actionLabel: 'Book this service', actionHref: `/services/${service.slug}/book`
properties:  actionLabel: 'View full listing', actionHref: `/properties/${property.slug}`
autos:       actionLabel: 'View full listing', actionHref: `/autos/${vehicle.slug}`
classifieds: actionLabel: 'Contact seller',    actionHref: `/classifieds/${classified.slug}/contact`
```
If the sub-vertical pages don't exist in the marketplace theme, fall back to `/explore?vertical=X` for now — but the label should still be more specific than "Browse X."

---

## Missing Pages to Build

### Page 1: About (`AboutPage.tsx`)

**URL:** `/about`  
**Purpose:** Brand trust + "why MarketHub" for both buyers and sellers

**Layout sections:**

#### 1.1 Hero — Mission
- Kicker: `"About MarketHub"` (`.um-section-kicker`)
- H1: `"One marketplace. Every category."` — no highlight effect needed, let the typography carry it
- Lead paragraph: 2 sentences — "MarketHub connects buyers and sellers across products, properties, vehicles, services, jobs, events, and classifieds from a single unified storefront."
- Two CTAs: `um-btn-primary` → "Browse marketplace" + `um-btn-secondary` → "Become a seller"

#### 1.2 Stats bar — 4-column
Same layout as the trust section in `Page.tsx` (`.um-trust-metrics` style):
- **7** verticals available
- **100%** verified seller IDs  
- **1** cart for every vertical
- **Daily** fresh inventory

#### 1.3 How it works — 3-step vertical timeline
Three steps in a left-bordered vertical timeline:
1. **Browse** — Search across all 7 verticals in one place
2. **Discover** — Filter by category, vertical, and price  
3. **Checkout** — One cart, one payment, every category

CSS: `.um-about-timeline` — each step has a numbered dot + title + copy. Border-left in `--um-blue` on each step item.

#### 1.4 Verticals grid — 7-card showcase
Reuse the `marketCategories` data but as larger content cards showing:
- Icon (from existing SVGs)
- Category name
- One-line description
- "Browse [category]" link in category colour

CSS: `.um-about-verticals` — 4-col on desktop, 2-col tablet, 1-col mobile. Card: white, border, `border-radius: var(--um-radius)`, hover: lift + blue border.

#### 1.5 Trust features — expanded version of `LiquidSyncBar`
4 expanded cards (not icons only — include paragraph copy):
1. **Verified sellers** — Every seller goes through ID verification before listing. Buyers can see verification badges on every listing.
2. **Unified checkout** — One cart, one checkout, one order history — regardless of whether you buy a product, book a service, or buy tickets.
3. **Fresh daily inventory** — New listings added across all 7 verticals every day. Search returns live catalog data.
4. **Buyer protection** — All transactions are secured through our encrypted checkout. Contact support if your purchase isn't as described.

#### 1.6 CTA panel
Match `um-final-cta` style: `"Start browsing the MarketHub marketplace today."` + `um-btn-primary` → `/explore`

---

### Page 2: Contact (`ContactPage.tsx`)

**URL:** `/contact`

#### 2.1 Hero
- Kicker: `"Support"`
- H1: `"How can we help?"`
- Lead: 1 sentence — "Reach out with buyer questions, seller inquiries, or partnership requests."

#### 2.2 Two-column layout

**Left col — Contact form** (`.um-contact-form`):
Fields using `um-` input styling:
- Name
- Email
- Topic select: Buyer support / Seller onboarding / Technical issue / Partnership / Other
- Message textarea (5 rows)
- Submit `um-btn-primary` "Send message"

On submit: form disappears, show a dark confirmation panel (`.um-contact-receipt`):
```
✓ Message received
We'll get back to you within 24 hours. Reference: #CM-XXXXXX
```

Form wires to the backend contact/inquiry endpoint or falls back to local storage (same pattern as other themes' inquiry forms).

**Right col — Contact info** (`.um-contact-info`):
Three stacked cards:
1. **Email**: support@markethub.com ← theme content fallback
2. **Response time**: Within 24 business hours
3. **Seller inquiries**: partnerships@markethub.com

**Also on right:** Vertical quick-links:
Small list: "Have a question about a specific vertical?" with links to explore pages per vertical.

---

### Page 3: FAQ (`FaqPage.tsx`)

**URL:** `/faq`

#### 3.1 Hero
- Kicker: `"Help center"`
- H1: `"Frequently asked questions"`
- Search input (client-side filter of questions, no API) — styled with `um-header-search` style

#### 3.2 FAQ Accordion (new component: `FaqAccordion`)

Use native `<details>/<summary>` for accessibility. Separate sections for Buyers and Sellers.

**Buyer FAQs (8 questions):**
1. What can I buy on MarketHub? → Products, properties, autos, services, jobs, events, and classifieds from one platform.
2. How do I search across all verticals? → Use the search bar at the top. Filter by vertical to narrow results.
3. Is there one checkout for everything? → Yes — add any listing to cart and check out once.
4. How do I know sellers are verified? → All sellers go through ID verification. Look for the Verified badge.
5. What payment methods are accepted? → All major credit and debit cards. Bank transfer for high-value items.
6. Can I return a purchased item? → Returns depend on the seller's policy shown on each listing.
7. How do I contact a seller? → Use the inquiry form on the listing page.
8. Are event tickets refundable? → Refund policies are set per event by the organizer.

**Seller FAQs (6 questions):**
1. How do I list on MarketHub? → Log in, go to Admin → Create Listing, pick your vertical.
2. Which verticals can I list in? → All 7: Products, Properties, Autos, Services, Jobs, Events, Classifieds.
3. Is there a listing fee? → No upfront fee. Platform commission applies on completed transactions.
4. How do buyers find my listing? → Listings appear in both vertical-specific and unified search results.
5. How do I manage orders and inquiries? → Through your Admin dashboard under Orders and Inquiries.
6. Can I list in multiple verticals? → Yes, you can have active listings across all verticals simultaneously.

#### 3.3 Categories sidebar (optional, if FAQ list is long)
Tabbed section titles: "For Buyers" | "For Sellers" — click scrolls to anchor.

#### 3.4 Bottom CTA
`"Still have questions?"` + `um-btn-primary` → `/contact`

---

### Page 4: Sell / Become a Seller (`SellPage.tsx`) — recommended

**URL:** `/sell`  
**Purpose:** The hero has `"Post once. Sell across every vertical."` promo card — there should be a landing page for that CTA.

#### 4.1 Hero
- Kicker: `"For sellers"`
- H1: `"Reach buyers across every category in one listing."` 
- Lead: 2 sentences on the proposition: single listing, 7 discovery verticals, unified cart checkout.
- Primary CTA: `"Create your first listing"` → admin create URL
- Secondary CTA: `"See the marketplace"` → `/explore`

#### 4.2 How listing works (3 steps)
1. Create listing — choose your vertical, upload images, set price
2. Get discovered — appears in unified search and vertical-specific browse pages
3. Receive orders — orders, inquiries, and bookings arrive in your dashboard

#### 4.3 Vertical chooser
7 cards (one per vertical) showing:
- Vertical name + icon
- What kind of listings it takes
- Example: "Products — Retail goods, electronics, furniture, gear"
- Link: "List a product →"

CSS: `.um-sell-verticals` — 4-col grid on desktop, 2-col tablet.

#### 4.4 Seller benefits
4 benefit cards: No upfront fees · Global reach · Unified checkout · Dashboard analytics

#### 4.5 Final CTA
Full-width `um-final-cta` style: `"Ready to reach buyers?"` + `"Start selling"` button → admin URL.

---

## Existing Page Polish

### Homepage — micro-details

#### Hero section
- `um-hero-meta` shows live total listings, category count, avg rating — **excellent**, keep
- `um-hero-quick-cats` is a nav of 7 category links below the search bar — good UX anchor
- The featured carousel shows 3 listing cards + 1 promo card ("Seller boost") — **the promo card** currently links to `/explore` but should link to `/sell` once that page is built
- The carousel's `um-feature-card-primary` (first card) is larger — `grid-area` priority style; verify this renders correctly in all grid configurations
- Loading state: falls back to `fallbackListings` (3 hardcoded items) — **good**

#### Category blocks section (7 highlight images)
- Loading state has shimmer bug (Bug 5 above) — fix
- `um-category-highlight__count` display: uses `'—'` (em dash) as fallback when count isn't loaded yet. This is cosmetically inconsistent. During loading, show nothing rather than `'—'`:
  ```tsx
  {category.count !== '—' && category.count !== '-' && <strong>{category.count}</strong>}
  ```

#### MarketGrid section
- Properties icon card has same blue colour as Products (Bug 1 above) — fix
- The `MarketGrid` component fetches all 7 live counts on mount via `Promise.allSettled` — **good architecture**
- The count badges show per-card with category-specific color — looks polished

#### Trending listings section
- Uses `displayListings` (live or fallback, max 6) — **good**
- Skeleton loading with 3 skeleton cards — **good**
- Error state when `listingError && liveListings.length === 0` — **good**

#### Trust section
- Dynamic: shows `um-testimonial-stack` if testimonials loaded, falls back to trust image — **clever**
- Star rating uses asterisks (Bug 2 above) — fix
- Live metrics (total listings, verticals, avg rating, "1 cart") — impressive

#### Final CTA
- Glow blobs (`um-cta-glow-a` + `um-cta-glow-b`) add visual interest — verify they don't cause horizontal overflow on mobile
- 4 trust chips with inline SVGs — **polished**
- `um-cta-btn-outline` for secondary action — check this class is actually styled (if not, add its CSS)

---

### Explore page — micro-details

#### Vertical tabs (`um-explore-verticals`)
- 8 tabs (All + 7 verticals), each with count and cue text — **very good**
- Active state: `is-active` class — ensure CSS has `.um-explore-vertical.is-active { ... }` with blue or orange highlight
- On mobile, this strip likely needs horizontal scroll — verify `overflow-x: auto; white-space: nowrap` is applied

#### Command bar (`um-explore-command`)
- 3 controls: search input, category select, sort select
- The `category` select is populated from live API categories — categories deduplicated across all 7 verticals
- **Gap:** The command bar has no custom arrow on selects — needs `appearance: none` + `background-image` caret (same fix as Bug 7 for the hero select)

#### Listing grid (`um-explore-grid`)
- 3-col grid of `um-explore-card` elements
- Each card: image (16:10 aspect ratio), vertical badge overlay, category + price meta, title, description, "Verified listing" + action label footer
- Loading: 6 `um-explore-card-loading` skeletons — **good**
- Empty state: `"No listings match these filters"` with reset button — **good**

#### Load more
- Pagination by incrementing `?page=N` — URL updates so shareable — **good**
- "Showing X of Y available listings" count below load-more button — **good**

#### Alert for partial failures
- `um-explore-alert` shows when some verticals fail but others succeed — **good design** for a multi-source page

---

### Product detail page — micro-details

#### Layout
- `um-detail-grid` — 2-column: image left, panel right
- Image: full-height, object-cover — **good**
- `um-detail-media-badge` overlay shows vertical label (Product/Property/Auto etc.) — **good**

#### Detail panel
- `um-detail-kicker` shows `um-mono` text + `LISTING_{id}` — the `um-mono` class is referenced in the CSS but check it's defined (should be a monospace font, probably `font-family: monospace; font-size: 0.75rem; letter-spacing: 0.1em`)
- Chips row (`um-detail-chip-row`) — **good** for contextual labels
- Specs grid (`um-detail-specs`) — 4 rows of label + value pairs — **good**
- Owner panel (`um-detail-owner-panel`) — fix developer copy (Bug 6)

#### Add to cart (products only)
- `addProductToCart` from shared cart utility — **wired**
- Cart notice with typo (Bug 3) — fix
- Non-product verticals show a link button instead of "Add to cart" — **correct**

#### Skeleton + error states
- Skeleton: 5 shimmer lines — good enough
- Error: `LISTING_UNAVAILABLE` monospace code + title + description + "Return to marketplace" CTA — **polished**

---

## New CSS to Add

### 1. Missing `.um-cta-btn-outline` styles
The `Page.tsx` uses `um-cta-btn-outline` for the secondary CTA:
```tsx
<a className="um-cta-btn-outline" href={themeLink('/explore')}>
  Post a listing
</a>
```
Verify this class is styled. If not:
```css
.um-cta-btn-outline {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  color: #fff;
  font-weight: 800;
  min-height: 46px;
  padding: 0.95rem 1.45rem;
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s;
}
.um-cta-btn-outline:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.65);
}
```

### 2. `.um-mono` class definition
Used in the detail page (`um-detail-kicker`, `um-detail-state-code`). Define if missing:
```css
.um-mono {
  color: var(--um-muted);
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
```
Note: no monospace font is loaded via Google Fonts. Either add a Google Fonts import for a mono font, or use the system stack above and accept slight cross-browser variation. For a marketplace theme system mono stack is fine.

### 3. Star classes
```css
.um-star-on  { color: var(--um-orange); font-size: 1rem; }
.um-star-off { color: var(--um-border); font-size: 1rem; }
.um-testimonial-stars { display: flex; gap: 0.1rem; margin-bottom: 0.75rem; }
```

### 4. About, Contact, FAQ, Sell pages CSS
All static pages should reuse existing `um-` classes where possible. New classes needed:
```css
.um-about-timeline { ... }       /* vertical timeline steps */
.um-about-verticals { ... }      /* 4-col vertical showcase grid */
.um-contact-form { ... }         /* contact form panel */
.um-contact-info { ... }         /* right-col info cards */
.um-contact-receipt { ... }      /* success panel */
.um-faq-accordion { ... }        /* FAQ list */
.um-faq-item { ... }             /* individual FAQ */
.um-faq-summary { ... }          /* clickable summary */
.um-faq-answer { ... }           /* expanded content */
.um-sell-verticals { ... }       /* seller verticals grid */
```
Total new CSS for static pages: approximately 120–180 lines.

---

## Design System Verification

### Palette — confirmed
| Token | Value | Usage |
|-------|-------|-------|
| `--um-blue` | `#0d6efd` | Header search, secondary text-links, `um-btn-secondary` colour, focus rings |
| `--um-blue-dark` | `#0a58ca` | Button hover, logo mark gradient end |
| `--um-orange` | `#fd7e14` | Primary buttons, kicker dots, section kicker text, category icons |
| `--um-orange-dark` | `#d95f00` | Button hover shadow colour |
| `--um-ink` | `#172033` | All body text, headings |
| `--um-muted` | `#667085` | Nav links, secondary copy, meta text |
| `--um-soft` | `#f5f8fc` | Page background accents, nav hover bg |
| `--um-soft-blue` | `#eef5ff` | Unused currently — could use for active state backgrounds |
| `--um-card` | `#ffffff` | Card backgrounds |
| `--um-border` | `#dce5f1` | Card borders, input borders |
| `--um-shadow` | 22px 60px blue-tinted | Card hover shadows |
| `--um-shadow-soft` | 14px 40px blue-tinted | Default card shadows |
| `--um-radius` | `8px` | Most element border-radius |

**Logo:** Gradient text `--um-blue` → `--um-orange` (CSS `background-clip: text`) — distinctive dual-brand identity anchoring both primary colours in the logo. Keep.

**Background:** `radial-gradient(circle at 12% 10%, rgba(13,110,253,0.09), transparent 28rem)` + linear gradient from light blue-tinted to white. Very subtle — doesn't distract from listings.

### Font
- **Inter** only — no display pairing. This is the correct choice for a multi-vertical marketplace: max readability, neutral, trusted. The missing piece is that headings use `font-weight: 800` which works well with Inter's tight metrics.

### Missing: Dark mode / night mode badge
Some premium marketplace themes on CodeCanyon advertise "Dark mode included." The existing palette (`--um-ink: #172033` dark navy, `--um-soft: #f5f8fc` light) would lend itself well to a `prefers-color-scheme: dark` media query block. Not required for submission, but a differentiator.

---

## Responsive QA Checklist

Test at **375px**, **768px**, **1024px**, **1280px**.

### Homepage
| Breakpoint | What to check |
|------------|--------------|
| 375px | Hero: copy stacks above carousel; carousel becomes single-card; category quick-links wrap; hero meta reads as 1-col |
| 768px | Category highlight grid: 4→2 cols; MarketGrid: 7→4 or 3 cards; trending grid: 3→2 cards; trust section: stacks |
| 1024px | Navigation: hamburger appears; search bar maintains pill shape; hero: verify carousel breakpoint |
| 1280px | All grids full-width; sticky header; radial gradient visible |

### Explore page
| Breakpoint | What to check |
|------------|--------------|
| 375px | Vertical tabs: horizontal scroll on `um-explore-verticals`; command bar: stacks to 1-col; grid: 1-col |
| 768px | Grid: 2-col; command bar: 3-col still workable; vertical tabs: scroll |
| 1024px | 3-col grid; command bar inline; vertical tabs possibly wrap |

### Product detail
| Breakpoint | What to check |
|------------|--------------|
| 375px | Detail grid stacks to 1-col (image first, panel below); chips wrap; specs 2-col within stacked panel |
| 768px | May or may not need single col — check gap value |
| 1280px | 2-col grid with generous gap |

### Known gaps
- **Mobile hamburger drawer**: `um-nav-panel` needs `position: fixed; top: 0; right: -100%` or similar for proper drawer behavior. Currently defined with `display: none` on `.um-mobile-btn` — ensure the nav panel itself slides in (not just the button showing)
- **Explore vertical tabs**: if there's no `overflow-x: auto` on `.um-explore-verticals`, tabs will overflow on mobile — add horizontal scroll
- **Hero search category select on mobile**: confirm the category dropdown doesn't overflow the search bar on 375px

---

## Checkout / Cart / Gateway Verification

### Cart page (`CartPage.tsx`)
Delegates to `UnifiedCartPage` with `primaryButtonClass="um-btn-primary"`. Verify:
- Cart items display product images, titles, quantities, prices — rendered in `um-` colour tokens via CSS cascade
- "Proceed to checkout" button uses `um-btn-primary` (orange) — correct
- Empty cart state shows correctly with "Continue shopping" CTA

### Checkout page (`CheckoutPage`)
Delegates to `UnifiedCheckoutPage`. Verify:
- Form fields style match `um-` input styles from `shared/subpages.css`
- All active gateways display:
  - **Stripe** credit/debit card form with field theming
  - **PayPal** button renders
  - **Bank transfer** / offline option
  - **Gateway logos** (Visa, Mastercard, Amex) in the payment section
- Subtotal, shipping, total row calculation correct
- "Place order" button is `um-btn-primary` orange — check `shared/subpages.css` picks up the right variable

### Checkout confirmation
- Order ID displayed clearly
- "Continue shopping" CTA → `/explore`
- Verify `shared/subpages.css` uses `:is(.market-hub-wrapper)` scoping or the `um-` prefix throughout

---

## Demo Content / Fallback Quality

### Homepage fallback listings (3 items)
```ts
const fallbackListings: DisplayListing[] = [
  { title: 'Modern Penthouse',  badge: 'Property', price: '$3.5M',    image: '/themes/unifieds/marketplace/1.webp' },
  { title: 'Electric SUV',      badge: 'Auto',     price: '$55,000',  image: '/themes/unifieds/marketplace/10.webp' },
  { title: 'Photo Studio',      badge: 'Service',  price: 'From $299',image: '/themes/unifieds/marketplace/14.webp' },
];
```
These are clean and professional. ✓

### Category highlight fallbacks (7 items)
All use theme-specific images at `/themes/unifieds/marketplace/*.webp`. Good. Count defaults to `'-'` and `'—'` — fix (see Bug 5 / category section notes above).

### No fallback for zero-listing explore page
When all 7 APIs fail and `filteredProducts.length === 0`, the empty state shows. But there's no "demo mode" fallback like the properties themes have. This is acceptable for a multi-vertical theme (impossible to maintain fallback data for all 7 verticals), but consider adding 3–4 hardcoded listings to the empty state to illustrate what listings look like.

---

## CodeCanyon Submission Checklist

- [x] **Distinct palette**: Blue/orange on white with blue-tinted gradient — cannot be confused with `unifieds/default` (monochrome minimal) or any properties theme ✓
- [x] **Minimum 3 custom components**: `MarketplaceHeader`, `MarketGrid`, `LiquidSyncBar`, `MarketplaceFooter` — well exceeded ✓
- [x] **Responsive**: Needs QA pass (see checklist)
- [x] **No hardcoded data in component files**: Fallback data is in `fallbackListings` array at top of `Page.tsx` — acceptable ✓
- [x] **ProductPage wired to live API**: 7-vertical router in `fetchMarketplaceDetail` ✓
- [x] **No Lorem ipsum**: All copy is marketplace-domain language ✓
- [x] **Consistent header/footer**: `MarketplaceHeader` + `MarketplaceFooter` in `Layout.tsx` ✓
- [x] **Pages beyond homepage + detail**: Explore, Cart, Checkout (3 pages) ✓
- [ ] **About / Contact / FAQ pages**: ❌ Missing — must build
- [ ] **Sell page**: ❌ Missing — recommended
- [ ] **Bug fixes (8 items)**: ❌ Fix before submission
- [ ] **CSS verification** (`um-cta-btn-outline`, `um-mono`, star classes): ❌ Verify/add
- [ ] **Responsive QA**: ❌ Needs pass
- [ ] **Cart + checkout gateway verification**: ❌ Needs pass
- [ ] **Category highlight shimmer**: ❌ Fix loading state

---

## Estimated Work

| Task | Effort |
|------|--------|
| Bug fixes 1–8 (code edits) | 1.5 hours |
| CSS additions (missing classes, shimmer, stars) | 45 min |
| About page | 3 hours |
| Contact page | 2.5 hours |
| FAQ page + accordion component | 2.5 hours |
| Sell page (recommended) | 3 hours |
| Responsive QA + fixes | 2 hours |
| Cart/checkout gateway verification | 1 hour |
| Final copy scan | 30 min |
| **Total (without Sell page)** | **~13 hours** |
| **Total (with Sell page)** | **~16 hours** |

---

## Priority Order

1. **8 bug fixes** — Properties colour, star symbol, cart class typo, copyright, shimmer, owner copy, select styling, action labels
2. **CSS verification** — `um-cta-btn-outline`, `um-mono`, stars (30 min, unblocks visual review)
3. **About + Contact + FAQ pages** — CodeCanyon requirement; do these before QA
4. **Sell page** — Turns the "Post once" promo card into a real destination
5. **Responsive QA** — Final sweep at all breakpoints
6. **Checkout gateway verification** — Final functional check
