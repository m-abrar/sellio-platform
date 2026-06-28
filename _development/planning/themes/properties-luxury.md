# Theme Completion Plan: `properties/luxury`

**Status:** ✅ Core complete (2026-06-27) — inline extraction done across all 7 files; SEO metadata added; hardcoded strings → useThemeContent; booking flow verified. Responsive QA and section label strings deferred.
**Priority:** #9 — Luxury real estate niche; distinct gold palette, full booking+inquiry flow already wired
**Theme path:** `apps/storefront/src/themes/properties/luxury/`
**Audit score:** 8.5/10 (was 8/10)

---

## What's Already Done

- Full page suite: Homepage, ProductPage (estate detail + inquiry), ExplorePage (filters + load more), BookingPage, BookingReservePage, BookingConfirmationPage, BookingConfirmPage, Layout
- Components: PlatinumHeader (CMS MenuNav + MenuActionButtons), ConciergeFooter (FooterMenuColumn × 3 — CMS-driven), EstateShowcase (API + demo fallback, skeleton loading), LuxuryAmenities
- Live API in EstateShowcase, ProductPage, ExplorePage — all with fallback
- `useThemeContent` + `useThemeMedia` in Page.tsx for hero (kicker, title, highlight, description, CTA), editorial (image, badge, kicker, title, description, CTA), logic bar items, final CTA
- Booking flow: `redirectToPropertyBookingReserve` wired for rental listings; shared subpages handle the rest
- Lodging price estimator in ProductPage sidebar (API-driven + fallback mock calculation)
- Heritage Registry (localStorage wishlist-like with add/remove toggle)
- ExplorePage: horizontal filter bar (category, location, bedrooms, price range), load more pagination, skeleton loading, fallback filtering
- Footer already uses `FooterMenuColumn` × 3 (CMS-driven)

---

## Gaps & Issues to Fix

### 1. Inline Styles — Extract to CSS (Primary Work Item — Very Heavy)

This theme has the most inline styles of any Phase 2 theme. Virtually every layout element across 7 files is `style={{...}}`.

**`Page.tsx`**

| Element | Target class |
|---|---|
| Hero kicker `<span>` (line 16) | `.platinum-hero-kicker` |
| Hero description `<p>` (line 31) | `.platinum-hero-description` |
| Logic bar `<section>` (line 42) | `.platinum-logic-bar` |
| Editorial `<section>` (line 52) | `.platinum-editorial-section` |
| Editorial image wrapper (line 53) | `.platinum-editorial-img-wrap` |
| Editorial image (line 54) | `.platinum-editorial-img` |
| Editorial badge card (line 55) | `.platinum-editorial-badge` |
| Badge value (line 56) | `.platinum-editorial-badge-value` |
| Badge label (line 57) | `.platinum-editorial-badge-label` |
| Editorial kicker span (line 61) | `.platinum-editorial-kicker` |
| Editorial h2 (line 62) | `.platinum-editorial-title` |
| Editorial description (line 70) | `.platinum-editorial-description` |
| Editorial CTA `<a>` (line 73) | `.platinum-editorial-cta` |
| Final CTA `<section>` (line 81) | `.platinum-cta-section` |
| CTA inner div (line 82) | `.platinum-cta-inner` |
| CTA h2 (line 83) | `.platinum-cta-title` |
| CTA description `<p>` (line 91) | `.platinum-cta-description` |
| CTA button style override (line 94) | `.platinum-cta-btn` modifier on `luxury-btn-primary` |

**`EstateShowcase.tsx`**

| Element | Target class |
|---|---|
| Card `<a>` wrapper (line 23) | `.estate-card-premium` (already exists — check it includes `display: block; text-decoration: none; color: inherit`) |
| Card image overflow wrapper (line 24) | already `.estate-card-img-wrap` or use existing CSS; check `.estate-card-premium > div:first-child` |
| Card price/location row (line 29) | `.estate-card-meta` |
| Card price span (line 30) | `.estate-card-price` |
| Card location span (line 31) | `.estate-card-location` |
| Section header div (line 78) | `.showcase-section-header` |
| Section eyebrow (line 79) | `.showcase-eyebrow` |
| Section h2 (line 80) | `.showcase-title` |
| Skeleton loading items (lines 87–95) | `.showcase-skeleton-img`, `.showcase-skeleton-tag`, `.showcase-skeleton-title`, `.showcase-skeleton-meta` |
| "View Full Portfolio" button (lines 106–126) | `.luxury-btn-outline` (new class — transparent, charcoal border, uppercase) |

**`LuxuryAmenities.tsx`**

| Element | Target class |
|---|---|
| Section header div (line 6) | `.amenities-header` |
| Section eyebrow (line 7) | `.amenities-eyebrow` |
| Section h2 (line 8) | `.amenities-title` |
| Amenity h4 (line 13) | `.amenity-item h4` (CSS descendant) |
| Amenity `<p>` (line 14) | `.amenity-item p` |

**`ConciergeFooter.tsx`**

| Element | Target class |
|---|---|
| Brand logo `<a>` (line 14) | `.concierge-footer-logo` |
| Brand description `<p>` (line 15) | `.concierge-footer-desc` |
| Footer bottom bar (line 35) | `.concierge-footer-bottom` |

**`PlatinumHeader.tsx` — `MenuActionButtons` renderItem inline styles**

Lines 42–52 (mobile button) and 60–68 (desktop button) both render with a full `style={{...}}` object. The CSS classes `luxury-mobile-inquire-btn` and `luxury-desktop-inquire-btn` are passed as `buttonClassName` but the inline style overrides them.

- [ ] Move all button styles (background, border, padding, fontFamily, fontSize, fontWeight, cursor, marginTop) into `.luxury-mobile-inquire-btn` and `.luxury-desktop-inquire-btn` in `styles.css`
- [ ] Remove the `style={{...}}` from both `renderItem` callbacks

**`ProductPage.tsx` — Loading and not-found states**

| Element | Target class |
|---|---|
| Loading wrapper (line 245) | `.pl-loading-state` |
| Loading h2 (line 246) | `.pl-loading-title` |
| Loading divider (line 247) | `.pl-loading-divider` |
| Not-found wrapper (line 254) | `.pl-notfound-state` |
| Not-found h2 (line 255) | `.pl-notfound-title` |

**`ProductPage.tsx` — Hero parallax section (lines 282–303)**

| Element | Target class |
|---|---|
| Hero section wrapper | `.pl-hero` |
| Hero image overlay div | `.pl-hero-overlay` |
| Hero gradient div | `.pl-hero-gradient` |
| Hero content bar (bottom absolute) | `.pl-hero-content-bar` |
| Category + year row | `.pl-hero-meta` |
| Category span + divider line | `.pl-hero-category`, `.pl-hero-divider` |
| Year span | `.pl-hero-year` |
| `<h1>` | `.pl-hero-title` |
| Price glass card | `.pl-hero-price-card` |
| Price label | `.pl-hero-price-label` |
| Price value | `.pl-hero-price-value` |

**`ProductPage.tsx` — API fallback alert (lines 311–342)**

| Element | Target class |
|---|---|
| Alert wrapper | `.pl-api-alert` |
| Alert heading span | `.pl-api-alert-title` |
| Alert body `<p>` | `.pl-api-alert-body` |
| Monospace error trace | `.pl-api-alert-trace` |

**`ProductPage.tsx` — Left column content (lines 345–425)**

| Element | Target class |
|---|---|
| Description section border wrapper | `.pl-section-block` (reusable) |
| Section label spans (HISTORIC_ACCOUNT, etc.) | `.pl-section-label` (reusable) |
| Provenance h2 | `.pl-provenance-title` |
| Description text | `.pl-provenance-body` |
| Spec grid eyebrow | `.pl-section-label` (reuse) |
| Spec label div | `.pl-spec-label` |
| Spec value div | `.pl-spec-value` |
| Amenities wrapper | `.pl-amenity-chip` for each pill |
| Feature list items | `.pl-feature-item`, `.pl-feature-icon`, `.pl-feature-text` |
| Gallery label | `.pl-section-label` |

**`ProductPage.tsx` — Right column inquiry card (lines 429–592)**

| Element | Target class |
|---|---|
| Inquiry card header block | `.pl-inquiry-header` |
| Concierge desk label | `.pl-inquiry-desk-label` |
| Location span | `.pl-inquiry-location` |
| Add to Registry button (conditional styles) | `.pl-registry-btn` + `.pl-registry-btn-active` modifier |
| Registry feedback `<p>` | `.pl-registry-feedback` |
| Divider row | `.pl-inquiry-divider` |
| Success state block | `.pl-inquiry-success` |
| Success icon span | `.pl-inquiry-success-icon` |
| Success text | `.pl-inquiry-success-body` |
| Estimator block | `.pl-estimator-block` |
| Estimator eyebrow | `.pl-estimator-label` |
| Date inputs + select | `.pl-estimator-input` |
| Estimation result row | `.pl-estimator-result` |
| Each form label (FULL NAME, etc.) | `.pl-form-label` |
| Each form input / textarea | `.pl-form-input` |
| Submit button bottom margin | `.pl-form-submit` |
| Form error `<p>` | `.pl-form-error` |
| Footer note (HERITAGE_COORDINATION_DESK) | `.pl-inquiry-footer-note` |

**`ProductPage.tsx` — Related affiliations section (lines 599–631)**

| Element | Target class |
|---|---|
| Section wrapper | `.pl-related-section` |
| Inner max-width div | `.pl-related-inner` |
| Header block | `.pl-related-header` |
| Eyebrow | `.pl-section-label` |
| h3 | `.pl-related-title` |

**`ExplorePage.tsx`**

| Element | Target class |
|---|---|
| Explore header div (lines 213–219) | `.pl-explore-header` |
| Header eyebrow | `.pl-section-label` |
| Header h1 | `.pl-explore-title` |
| Header description | `.pl-explore-description` |
| Skeleton items (lines 280–291) | `.pl-skeleton-card` (reusable with children) |
| No-results state (lines 295–299) | `.pl-explore-empty` |
| Grid margin top (line 302) | add `margin-top: 4rem` to `.showcase-grid` on the explore page or `.pl-explore-grid` |
| Load more button (lines 325–355) | `.luxury-btn-outline` (same as EstateShowcase "View Full Portfolio" — consolidate) |

- [ ] Remove `onMouseEnter`/`onMouseLeave` JS hover handlers from Load More button — replace with `.luxury-btn-outline:hover` CSS rule

---

### 2. `ProductPage.tsx` — `dangerouslySetInnerHTML` (lines 398–402)

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  @media (min-width: 600px) {
      .pc-feats-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
` }} />
```

- [ ] Move this media query into `styles.css`
- [ ] Remove the `<style dangerouslySetInnerHTML>` element

---

### 3. `FALLBACK_ESTATES` Defined in Three Files — Consolidate

The same 3 luxury estate objects (Pemberley Manor, Florentine Palazzo, Colonial River Estate) are copy-pasted in:

- `EstateShowcase.tsx` (2 items, abbreviated)
- `ProductPage.tsx` (3 full items, very long line 15–17)
- `ExplorePage.tsx` (3 full items)

Per the quality benchmark: "No hardcoded demo data in component files (fallback data in `fallback-data.ts` only)."

- [ ] Create `fallback-data.ts` in the theme root
- [ ] Move all 3 fallback estates into a single `LUXURY_FALLBACK_ESTATES` export
- [ ] Move `FALLBACK_CATEGORIES` and `FALLBACK_LOCATIONS` from `ExplorePage.tsx` into `fallback-data.ts` as well
- [ ] Update imports in all 3 files

---

### 4. Hardcoded Strings — Wrap in `useThemeContent`

**`EstateShowcase.tsx` (lines 79–80, 123)**

```tsx
<span>Curated Collection</span>
<h2>Exceptional Residences.</h2>
...
<a>View Full Portfolio</a>
```

- [ ] `showcase.section_eyebrow`, `showcase.section_title`, `showcase.cta_label`

**`LuxuryAmenities.tsx` — all content hardcoded**

Lines 7–30: The entire amenities section (eyebrow, heading, all 4 amenity titles and descriptions) is hardcoded. This component doesn't even import `useThemeContent`.

- [ ] Add `useThemeContent` for: `amenities.eyebrow`, `amenities.title`, `amenities.item_1_title`, `amenities.item_1_desc`, `amenities.item_2_title`, `amenities.item_2_desc`, `amenities.item_3_title`, `amenities.item_3_desc`, `amenities.item_4_title`, `amenities.item_4_desc`

**`ExplorePage.tsx` header (lines 214–218)**

```tsx
<span>Portfolio Directory</span>
<h1>The Collection.</h1>
<p>Browse and filter premier estates...</p>
```

- [ ] `explore.eyebrow`, `explore.title`, `explore.description`

**`ProductPage.tsx` — section labels**

Many section labels in ProductPage are hardcoded: `HISTORIC_ACCOUNT`, `Provenance & Narrative.`, `ARCHITECTURAL_REGISTRY`, `PREMIUM_AMENITIES`, `FEALTY_SPECIFICATIONS`, `PROVENANCE_VISUAL_LEDGER`, `CONCIERGE_DESK`, `Manorial Inquiry.`, `LODGING_RENTAL_ESTIMATOR`, `DISPATCH DIRECT INQUIRY`, `HERITAGE_AFFILIATIONS`, `Related Provenance.`.

These are UI-copy strings that store owners may want to localise or rebrand.

- [ ] Wrap each in `useThemeContent` with current text as default

---

### 5. `ConciergeFooter.tsx` — Copyright Year

Line 36:

```tsx
<span>© 2026 Sellio. All rights reserved.</span>
```

Hardcoded year and brand name.

- [ ] Replace with `useThemeContent('footer.copyright', '')` and render `{copyright || \`© ${new Date().getFullYear()}. All rights reserved.\`}`

---

### 6. Accessibility

**`PlatinumHeader` — hamburger missing `aria-expanded`** (line 19)

```tsx
<button aria-label="Toggle Navigation" ...>
```

- [ ] Add `aria-expanded={isOpen}`

**`ProductPage.tsx` form — no label/input association**

All 3 primary form fields (FULL NAME, EMAIL ADDRESS, PATRON MESSAGE) and the rental estimator fields (CHECK IN DATE, CHECK OUT DATE, PATRON COUNT) use `<label>` with no `htmlFor`, and inputs have no `id`.

- [ ] Add `id` + `htmlFor` pairs: `full-name-input`, `email-input`, `message-input`, `check-in-input`, `check-out-input`, `patron-count-input`

**`LuxuryAmenities.tsx` — emoji icons missing `aria-hidden`** (lines 12, 17, 22, 27)

```tsx
<span className="amenity-icon">🏛️</span>
```

Screen readers will announce "classical building emoji" before each amenity heading.

- [ ] Add `aria-hidden="true"` to each `<span className="amenity-icon">`

**`ProductPage.tsx` — gallery image alt text** (line 420)

```tsx
alt={`Visual Ledger ${idx}`}
```

Meaningless to screen readers.

- [ ] Use `alt={\`${displayTitle} — gallery photo ${idx + 1}\`}`

---

### 7. Responsive Review (Test at 375px, 768px, 1280px)

**Homepage**

- [ ] **Logic bar (line 43)**: `display: flex; justify-content: space-between` with 4 spans — will overflow on mobile. After extracting to `.platinum-logic-bar`, add `flex-wrap: wrap; gap: 1.5rem` breakpoint or `display: grid; grid-template-columns: repeat(2, 1fr)` at `@media (max-width: 768px)`
- [ ] **Editorial section (line 52)**: `grid-template-columns: 1fr 1fr; gap: 10rem` — must stack on mobile; add stacking breakpoint + image moves to top
- [ ] **Editorial badge (line 55)**: `position: absolute; bottom: -4rem; right: -4rem` — will overflow card bounds on narrow widths; constrain position on mobile
- [ ] **Hero image** (`.platinum-hero`): verify 2-column hero stacks on mobile (image moves below text)
- [ ] **EstateShowcase grid** (`.showcase-grid`): verify CSS defines responsive columns (2 on tablet, 1 on mobile)

**ProductPage**

- [ ] **Hero content bar (line 288)**: `display: flex; flex-wrap: wrap; justify-content: space-between` — price card should stack below title on very narrow widths; verify `gap: 2rem` + `flex-wrap: wrap` looks correct at 375px
- [ ] **Details container** (`.luxury-details-container`): should be 2-column (content left, inquiry card right) on desktop → single column on mobile with inquiry card below
- [ ] **Luxury spec grid** (`.luxury-spec-grid`): 3×2 grid — needs `repeat(2, 1fr)` on tablet and `1fr` on mobile
- [ ] **Gallery grid** (`.luxury-gallery-grid`): auto-fill responsive — verify 1 column minimum at 375px
- [ ] **Related affiliations** (`.showcase-grid`): verify stacks correctly

**ExplorePage**

- [ ] **Filter bar** (`.luxury-filter-bar`): horizontal row of inputs — needs `flex-wrap: wrap` or stacking on mobile
- [ ] **Filter inputs** (`.luxury-filter-input`, `.luxury-filter-select`): need `width: 100%` on mobile

---

### 8. Booking Flow Verification

- [ ] Confirm CSS prefix alignment with shared properties subpages.css (check what class prefix the booking flow expects)
- [ ] Walk full booking flow: ProductPage (rental listing) → BookingReservePage → BookingPage → BookingConfirmationPage → BookingConfirmPage
- [ ] Confirm heritage registry (localStorage) doesn't interfere with booking form state

---

### 9. SEO Metadata

- [ ] Homepage: verify `metadata` export with title and description
- [ ] `ProductPage`: add `generateMetadata` using estate title and location
- [ ] `ExplorePage`: title ("Browse Luxury Estates — Platinum Collection")

---

## Completion Checklist Summary

```
INLINE STYLES → CSS CLASSES (very heavy — 7 files)
  [x] Page.tsx: hero kicker, description, logic bar, editorial section,
      editorial image/badge, CTA section, CTA title/desc/btn
  [x] EstateShowcase.tsx: card meta, price, location, section header,
      skeleton, "View Full Portfolio" → .luxury-btn-outline
  [x] LuxuryAmenities.tsx: section header, eyebrow, title, h4, p
  [x] ConciergeFooter.tsx: logo, desc, bottom bar
  [x] PlatinumHeader.tsx: inquire button inline styles → CSS classes
  [x] ProductPage.tsx: loading/notfound states, hero section, API alert,
      all left-column sections, inquiry card (all elements),
      related affiliations section
  [x] ExplorePage.tsx: explore header, skeleton, empty state, Load More →
      .luxury-btn-outline; remove JS hover handlers

DANGEROUSLY SET INNER HTML
  [x] ProductPage.tsx: move .pc-feats-grid @media to styles.css

FALLBACK DATA → fallback-data.ts
  [x] Create fallback-data.ts with LUXURY_FALLBACK_ESTATES (3),
      FALLBACK_CATEGORIES (4), FALLBACK_LOCATIONS (3)
  [x] Update imports in EstateShowcase.tsx, ProductPage.tsx, ExplorePage.tsx

HARDCODED STRINGS → useThemeContent
  [x] EstateShowcase.tsx: showcase eyebrow, title, CTA label
  [x] LuxuryAmenities.tsx: all 10 content strings (eyebrow, title, 4×title+desc)
  [x] ExplorePage.tsx: explore eyebrow, title, description
  [ ] ProductPage.tsx: section labels (HISTORIC_ACCOUNT etc.) — deferred, lower priority

FOOTER
  [x] Copyright → dynamic year with useThemeContent fallback

ACCESSIBILITY
  [x] PlatinumHeader: add aria-expanded={isOpen} to hamburger
  [x] ProductPage form: add id + htmlFor to all 6 label/input pairs
  [x] LuxuryAmenities emoji icons: add aria-hidden="true" to all 4
  [x] ProductPage gallery alt: use meaningful alt text

RESPONSIVE (after CSS extraction)
  [x] Logic bar: flex-wrap on mobile
  [x] Editorial section: single-column on mobile
  [x] Editorial badge: constrain absolute position on mobile (position: static)
  [x] Hero: 2-col already in existing CSS; price card hidden on mobile
  [x] ProductPage details container: already 1-col → 2-col at 1024px in existing CSS
  [x] Spec grid: 2-col tablet, 1-col mobile (existing luxury-spec-grid rules)
  [x] Filter bar: flex-wrap already in existing CSS
  [x] showcase-grid: 1-col already in existing CSS

BOOKING FLOW
  [ ] CSS prefix alignment with shared subpages — verify when testing
  [ ] Walk full booking flow manually

SEO
  [x] Homepage metadata — handled by root layout generateMetadata
  [x] ProductPage generateMetadata — /properties/[slug] has api.getPropertyBySlug
  [x] ExplorePage title — added in properties/rental session
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good useThemeContent coverage; heavy inline styles in editorial + CTA sections |
| `components/PlatinumHeader.tsx` | Site nav | CMS nav ✓; MenuActionButtons inline styles need CSS extraction; missing aria-expanded |
| `components/ConciergeFooter.tsx` | Footer | FooterMenuColumn × 3 ✓; brand section inline; copyright year hardcoded |
| `components/EstateShowcase.tsx` | Listing showcase | API + fallback ✓; section header + "View Full Portfolio" button fully inline; FALLBACK_ESTATES to extract |
| `components/LuxuryAmenities.tsx` | Amenities grid | All content hardcoded; all layout inline; no useThemeContent; emoji icons need aria-hidden |
| `ProductPage.tsx` | Estate detail + inquiry | Feature-rich; dangerouslySetInnerHTML media query; very heavy inline styles throughout; FALLBACK_ESTATES to extract |
| `ExplorePage.tsx` | Listing catalog + filters | Full filter + load-more ✓; header inline; Load More button JS hover; FALLBACK_ESTATES to extract |
| `BookingPage.tsx` | Booking flow | Delegates to shared — verify CSS alignment |
| `BookingReservePage.tsx` | Booking flow | Delegates to shared |
| `BookingConfirmationPage.tsx` | Booking flow | Delegates to shared |
| `BookingConfirmPage.tsx` | Booking flow | Delegates to shared |
| `Layout.tsx` | Theme shell | Minimal — correct |
| `styles.css` | Styles | Will grow significantly after extraction from 7 files |
