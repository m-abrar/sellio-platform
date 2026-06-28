# Theme Completion Plan: `properties/modern`

**Priority:** #1 — Highest market demand (real estate), highest base quality (9/10)
**Theme path:** `apps/storefront/src/themes/properties/modern/`
**Audit score:** 9/10 — mostly production-ready, specific gaps documented below

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, BookingPage, BookingReservePage, BookingConfirmationPage, BookingConfirmPage
- 42 custom components across all pages
- Live API integration with proper demo fallback pattern
- Availability calendar with rental/sale mode switching
- Inquiry form with full validation and submission
- Mobile hamburger nav with body scroll lock
- Explore page with filters, pagination, filter chips, sort, and URL sync
- Skeleton loading shells for both explore and detail pages
- Dynamic menu system via `MenuNav` / `FooterMenuColumn` components

---

## Gaps & Issues to Fix

### 1. Dead Code — Remove These Files

These components exist in the folder but are **not exported and not used** anywhere. They appear to be leftovers from an earlier design iteration.

- [x] **Delete** `components/LifestyleHeader.tsx`
  - Has hardcoded brand name `"SELLIO_SAGE"` and `href="#"` placeholder nav links
- [x] **Delete** `components/SageFooter.tsx`
  - Hardcoded cities (Los Angeles, New York, London, Tokyo), inline styles instead of CSS, hardcoded "2026 Sellio Sage"
- [x] **Delete** `components/PropertyBentoCard.tsx`
  - Unused component, no CSS for it, prop interface is incomplete

---

### 2. Hardcoded Strings — Wrap in `useThemeContent`

These strings are visible to end users but bypass the theme content system, so store owners cannot customise them.

**`Page.tsx` — Homepage**

| Location | Hardcoded string | Suggested key |
|---|---|---|
| Line 134 | `"Live market snapshot"` | `hero.panel_kicker` |
| Line 145 | `"Archive"` | `hero.panel_archive_label` |
| Line 146 | `"Sale + rent"` | `hero.panel_archive_value` |
| Line 149 | `"Details"` | `hero.panel_details_label` |
| Line 150 | `"Photos, map, specs"` | `hero.panel_details_value` |
| Line 154 | `"Browse homes for sale"` | `hero.panel_cta_label` |
| Line 268 | `"View rentals"` | `cta.secondary_label` |
| Lines 163–165 | Feature band: 3 cards with hardcoded title + description | `features.1.title`, `features.1.description`, etc. |

- [x] Wrap all 8 items above in `useThemeContent(key, defaultValue)`

**`components/CivicFooter.tsx` — Footer**

- [x] Logo text `"URBAN."` → `useThemeContent('brand.name', 'URBAN.')`
- [x] Footer tagline paragraph (hardcoded copy) → `useThemeContent('footer.tagline', ...)`
- [x] `"Browse available properties"` CTA → `useThemeContent('footer.cta_label', ...)`
- [x] `"2026 Sellio Urban. All rights reserved."` → `useThemeContent('footer.copyright', ...)` + dynamic year
- [x] `"Verified property search..."` sub-line → `useThemeContent('footer.sub_tagline', ...)`

**`components/UrbanHeader.tsx` — Header**

- [x] Logo text `"URBAN."` → `useThemeContent('brand.name', 'URBAN.')`

**`ProductPage.tsx` — Property Detail**

- [x] `"Not found"` kicker → `useThemeContent('detail.not_found_kicker', 'Not found')`
- [x] `"Property could not be loaded"` heading → `useThemeContent('detail.not_found_title', ...)`
- [x] Error paragraph fallback text → `useThemeContent('detail.not_found_description', ...)`
- [x] `"Browse properties"` back-link → `useThemeContent('detail.not_found_cta', ...)`

---

### 3. Image Optimisation

All listing images use raw `<img>` tags. For a marketplace with dynamic external image URLs, this is acceptable, but `loading="lazy"` should be consistently applied and images should have meaningful `alt` text.

- [ ] `components/ExplorePropertyGrid.tsx` — verify `alt` is the listing title (not empty string)
- [ ] `components/GalleryGrid.tsx` — first image (index 0) is above the fold; remove `loading="lazy"` on it, keep on rest
- [ ] `components/ProductDetailHero.tsx` — main hero image has no `loading` attribute; add `loading="eager"` explicitly
- [ ] `components/AgentProfileCard.tsx` — avatar `alt=""` is correct (decorative), no change needed

---

### 4. Footer Copyright Year

- [x] `CivicFooter.tsx` line 43: `"2026 Sellio Urban."` — replace hardcoded year with `{new Date().getFullYear()}`

---

### 5. Shared Booking Pages — Verify CSS Coverage

The four booking pages delegate to shared components using `classPrefix="pm"`. Verify the shared CSS in `apps/storefront/src/themes/properties/shared/subpages.css` covers all `pm-` prefixed class names used.

- [ ] Confirm `pm-booking-*` classes exist in `subpages.css`
- [ ] Confirm `pm-confirm-*` classes exist in `subpages.css`
- [ ] Manually walk through booking flow: ProductPage → BookingReservePage → BookingPage → BookingConfirmationPage → BookingConfirmPage

---

### 6. Accessibility

- [ ] `components/ProductInquirySection.tsx` — confirm every `<input>` and `<textarea>` has a corresponding `<label htmlFor>` (not just a placeholder)
- [ ] `components/GalleryGrid.tsx` — thumbnail images are clickable but have no keyboard handler; add `onKeyDown` for Enter/Space or switch to `<button>` wrappers
- [ ] `components/AvailabilityCalendar.tsx` — date cells should be keyboard-focusable with `role="button"` and `aria-label="[date]"`
- [ ] `components/ExploreFilters.tsx` — mobile filter panel open/close should trap focus when open

---

### 7. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] Hero market panel (`urban-hero-market-panel`) — verify it stacks below the copy text on mobile, not overlapping
- [ ] Feature band cards — 3 across on desktop, stacked on mobile
- [ ] Explore page: sidebar filters collapse to drawer on mobile — confirm drawer animation and close-on-refine work
- [ ] ProductPage gallery thumbnails — horizontal scroll on mobile
- [ ] `AvailabilityCalendar` — calendar grid on mobile (7-column grid should scroll or compress cleanly)
- [ ] Booking flow pages — full-width form on mobile

---

### 8. Missing Pages (Optional but Recommended)

These pages exist in `ecommerce/b2b` and are a selling point for enterprise buyers. Adding even a basic version significantly increases perceived value.

- [ ] `/contact` page — a simple contact form (can reuse `ProductInquirySection` pattern) with agency branding
- [ ] `/about` page — agency story, team section, trust badges

---

### 9. SEO Metadata

- [ ] Verify `Page.tsx` (or the Next.js `app/properties/page.tsx` route) exports a `metadata` object with `title`, `description`, and `openGraph`
- [ ] Verify `ProductPage` has dynamic metadata (property title + description) fed via `generateMetadata`
- [ ] Verify `ExplorePage` has a descriptive `<title>` for the search page

---

### 10. Minor Copy Polish

- [ ] `CivicFooter.tsx` — footer tagline says "since 2026" which is a placeholder year; update or make dynamic
- [ ] Hero market panel mini-grid rows ("Archive / Sale + rent", "Details / Photos, map, specs") — these feel like dev scaffolding; replace with real value props or wire to live stats

---

## Completion Checklist Summary

```
DEAD CODE
  [x] Delete LifestyleHeader.tsx
  [x] Delete SageFooter.tsx
  [x] Delete PropertyBentoCard.tsx

HARDCODED STRINGS
  [x] Page.tsx: 8 strings → useThemeContent
  [x] CivicFooter.tsx: 5 strings → useThemeContent
  [x] UrbanHeader.tsx: 1 string → useThemeContent
  [x] ProductPage.tsx: 4 error-state strings → useThemeContent

IMAGES
  [x] GalleryGrid.tsx: already shows images.slice(1) only — all lazy is correct
  [x] ProductDetailHero.tsx: add loading="eager" to main image
  [x] ExplorePropertyGrid.tsx: alt={item.title} + loading="lazy" already correct

FOOTER
  [x] Replace hardcoded copyright year with new Date().getFullYear()

BOOKING FLOW
  [ ] Verify pm-* CSS coverage in subpages.css
  [ ] Walk through full booking flow manually

ACCESSIBILITY
  [x] ProductInquirySection: implicit label wrappers — fully accessible ✓
  [x] GalleryGrid: thumbnails are <button> elements — keyboard accessible ✓
  [x] AvailabilityCalendar: aria-label on each date cell + aria-label on nav buttons
  [x] ExploreFilters: auto-focus close button on open + aria-modal on sidebar

RESPONSIVE
  [ ] 375px: hero panel, feature band, explore sidebar, gallery, calendar, booking
  [ ] 768px: same
  [ ] 1280px: same

OPTIONAL PAGES
  [ ] /contact page
  [ ] /about page

SEO
  [ ] Homepage metadata
  [ ] ProductPage dynamic metadata
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Has hardcoded strings — needs content wrapping |
| `ProductPage.tsx` | Property detail | Solid, minor hardcoded error strings |
| `ExplorePage.tsx` | Search/filter page | Solid |
| `BookingPage.tsx` | Payment page | Delegates to shared — verify CSS |
| `BookingReservePage.tsx` | Reserve page | Delegates to shared — verify CSS |
| `BookingConfirmationPage.tsx` | Booking confirmation | Delegates to shared — verify CSS |
| `BookingConfirmPage.tsx` | Booking confirmed | Delegates to shared — verify CSS |
| `Layout.tsx` | Theme shell | Minimal, correct |
| `components/UrbanHeader.tsx` | Site nav | Logo hardcoded — needs wrap |
| `components/CivicFooter.tsx` | Site footer | Multiple hardcoded strings |
| `components/LifestyleHeader.tsx` | **DELETED** | Removed unused legacy component |
| `components/SageFooter.tsx` | **DELETE** | Dead code |
| `components/PropertyBentoCard.tsx` | **DELETE** | Dead code |
| `components/ExploreFilters.tsx` | Sidebar filters | Verify focus trap |
| `components/AvailabilityCalendar.tsx` | Booking calendar | Verify keyboard access |
| `components/GalleryGrid.tsx` | Image gallery | Fix lazy-loading on hero image |
| `components/ProductDetailHero.tsx` | Detail hero | Fix eager loading |
| `components/ProductInquirySection.tsx` | Contact/inquiry form | Verify label pairing |
| `styles.css` | Theme styles (3,434 lines) | Good |
| `fallback-data.ts` | Demo data | Good |
