# Theme Completion Plan: `properties/classic`

**Priority:** #11 — Classic real estate; the best-structured codebase of any Phase 2 theme
**Theme path:** `apps/storefront/src/themes/properties/classic/`
**Audit score:** 8.5/10 — high code quality; primary gaps are two `dangerouslySetInnerHTML` blocks, header inline styles, a newsletter bug, and two missing content components

---

## What's Already Done

- Full page suite: Homepage (catalog + filter sidebar + load more), ProductPage (full inquiry desk, registry/wishlist, rental estimator, booking flow), ExplorePage, BookingPage, BookingReservePage, BookingConfirmationPage, BookingConfirmPage, CartPage, Layout
- Components: HeritageHeader (CMS MenuNav + MenuUtilityNav + MenuActionButtons), LegacyFooter (FooterMenuColumn × 3 + social nav + newsletter form), FilterSidebar, ClassicEstateCard, CatalogRegistryAlert
- Dedicated `catalog.ts`, `fallback-data.ts`, `hooks/` — properly extracted from component files
- Live API via `fetchPropertyCatalogPage` + `resolveCatalogFailure` in Page.tsx; `api.getPropertyDetails` in ProductPage
- `useThemeContent` + `useThemeMedia` in Page.tsx (hero, collection, testimonials) and Footer
- `useThemeConfig` to toggle testimonials visibility
- Scroll-aware header that adds `.scrolled` class
- `DynamicTestimonials` integration with eyebrow/title
- ProductPage: CSS-clean hero section, breadcrumb nav, meta bar with `role="list"`, spec grid, amenities, features, gallery (with meaningful `alt` text + lazy loading), rental estimator, full inquiry form, "collect for inquiry" registry, related listings — all using CSS classes, no inline styles in the form or product body
- Booking flow: `redirectToPropertyBookingReserve` wired for rental listings

---

## Gaps & Issues to Fix

### 1. `Page.tsx` — `dangerouslySetInnerHTML` (Two Blocks)

**Block 1: Skeleton animation CSS (lines 240–256)**

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  .pc-skeleton-card { background: var(--pc-white); border: 1px solid var(--pc-border); ... }
  @keyframes pcPulse { 0% { opacity: 0.4; } 50% { opacity: 0.8; } 100% { opacity: 0.4; } }
  @media (min-width: 992px) {
    .pc-estate-grid-skeleton { grid-template-columns: repeat(2, 1fr) !important; }
  }
` }} />
```

- [ ] Move `.pc-skeleton-card`, `@keyframes pcPulse`, and the `@media (min-width: 992px)` grid breakpoint into `styles.css`
- [ ] Remove the `<style dangerouslySetInnerHTML>` element

**Block 2: Testimonials grid CSS (lines 309–323)**

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  .pc-testimonials-grid { display: grid; grid-template-columns: 1fr; gap: 3rem; ... }
  @media (min-width: 768px) { ... }
  @media (min-width: 1200px) { ... }
` }} />
```

- [ ] Move `.pc-testimonials-grid` and its responsive breakpoints into `styles.css`
- [ ] Remove the `<style dangerouslySetInnerHTML>` element

---

### 2. `Page.tsx` — Inline Styles to Extract

**Hero eyebrow (line 151)**

```tsx
<div className="pc-caps pc-hero-eyebrow" style={{ color: 'var(--pc-teal)', opacity: 0.4 }}>
```

- [ ] Add `color` and `opacity` to `.pc-hero-eyebrow` CSS rule

**Catalogue link (lines 185–192)**

```tsx
<a ... style={{ fontSize: '0.7rem', fontWeight: 900, letterSpacing: '2px', color: 'var(--pc-teal)', opacity: 0.55, textDecoration: 'none' }}>
```

- [ ] Create `.pc-hero-catalogue-link` class (already has `className`); add those styles to it in `styles.css`

**Collection section header (lines 219–228)**

```tsx
<div className="pc-caps pc-section-eyebrow" style={{ color: 'var(--pc-teal)', opacity: 0.4 }}>
<h2 className="pc-serif pc-section-title" style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}>
<p className="pc-collection-desc" style={{ textAlign: 'right', maxWidth: '350px', width: '100%', ... }}>
```

- [ ] Add these properties to `.pc-hero-eyebrow` and `.pc-section-eyebrow` in `styles.css` (color + opacity are the same rule; handle with a modifier or update the base class)
- [ ] Move `.pc-section-title` size/color into `styles.css`
- [ ] Add `.pc-collection-desc` class definition (already has `className`) to `styles.css`

**`DynamicTestimonials` inline style props (lines 301–303)**

```tsx
sectionStyle={{ paddingBottom: 'clamp(3rem, 6vw, 5rem)' }}
titleStyle={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-2px', color: 'var(--pc-teal)' }}
```

- [ ] Use class props instead: `sectionClassName` (add bottom padding to `.pc-section` or use a modifier), `titleClassName="pc-testimonials-title"` (add the title style to CSS)
- [ ] Remove the inline `sectionStyle` and `titleStyle` props

---

### 3. `HeritageHeader.tsx` — Inline Styles on Action Buttons

**Logo `<a>` (lines 29–35)**

Full inline style (textDecoration, fontFamily, fontSize, fontWeight, color, letterSpacing, cursor, zIndex, position).

- [ ] Create `.pc-header-logo` class and move all these properties there

**Mobile right div (line 58)**

```tsx
<div className="pc-mobile-header-right" style={{ marginTop: '2rem' }}>
```

- [ ] Add `margin-top: 2rem` to `.pc-mobile-header-right` in `styles.css`

**Action buttons in `renderItem` (lines 71–83 and 103–113)**

Both the mobile and desktop `MenuActionButtons` `renderItem` callbacks use a full `style={{...}}` object (padding, fontSize, textDecoration, display, alignItems, justifyContent, marginTop, backgroundColor, color, border).

- [ ] Move all properties into `.pc-btn-primary` (which is already used as `linkClassName`) or a dedicated `.pc-header-action-btn` class
- [ ] Remove the `style={{...}}` from both `renderItem` callbacks

---

### 4. `HeritageHeader.tsx` — Missing `aria-expanded`

Line 38:

```tsx
<button className={`pc-hamburger ...`} onClick={...} aria-label="Toggle Navigation">
```

- [ ] Add `aria-expanded={isOpen}` to the hamburger button

---

### 5. `LegacyFooter.tsx` — Newsletter Form Bug

`handleNewsletterSubmit` (line 33–35):

```ts
const handleNewsletterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    window.location.href = themeLink('/cart');
};
```

The newsletter subscription form navigates to the cart page on submit. This is a logic error.

- [ ] Replace with a proper newsletter signup flow: either call an API endpoint (`api.subscribeNewsletter(email)`) or, if no endpoint exists, show an inline success message without navigation
- [ ] On success, show `<p role="status">Thank you for subscribing!</p>` and clear the email field

---

### 6. `LegacyFooter.tsx` — Copyright Year Hardcoded Default

Line 27:

```ts
const copyright = useThemeContent('footer.copyright', '© 2026 Sellio. All rights reserved.');
```

Default has a hardcoded year.

- [ ] Change default to `''` and render: `{copyright || \`© ${new Date().getFullYear()}. All rights reserved.\`}`

---

### 7. `ProductPage.tsx` — Form Labels Missing `htmlFor` / `id`

All 6 form fields in the inquiry form (lines 446, 455, 464, 495, 506, 518) use `<label>` without `htmlFor` and inputs without `id`.

- [ ] Add `id` + `htmlFor` pairs: `check-in-date`, `check-out-date`, `patron-guests`, `inquiry-name`, `inquiry-email`, `inquiry-message`
- [ ] Note: The footer newsletter form in `LegacyFooter.tsx` already has `id="pc-footer-email"` + `htmlFor` correctly — good reference pattern

---

### 8. New Components to Build — Agent Bio Page & Neighborhood Stats

The original plan noted these as the primary feature gaps for this theme:

**Agent Bio Page (`AgentBioPage.tsx`)**

A standalone page (route: `/agent/:id` or accessed from listings) that shows:

| Element | Content |
|---|---|
| Agent photo | `useThemeMedia('agent.photo', '/themes/properties/classic/agent.webp')` |
| Agent name, title, years of experience | `useThemeContent` keys |
| Specialties list (architectural period, region) | `useThemeContent` |
| Phone, email contact buttons | Link to `tel:` and `mailto:` from `useThemeContent` |
| Recent listings grid | Use `EstateCard` with filtered listings from `api.getProperties({ agent_id })` |
| Quote/testimonial | `useThemeContent` |

This page would be linked from property listing cards when the property has an `agent` field populated.

**Neighborhood Stats Component (`NeighborhoodStats.tsx`)**

An inline component for the ProductPage detail section that renders after the spec grid and before amenities:

| Element | Content |
|---|---|
| Walk score | API field `property.neighborhood?.walk_score` or `useThemeContent` fallback |
| Transit score | Same pattern |
| School rating | `property.neighborhood?.schools_rating` |
| Nearby landmarks (up to 3) | `property.neighborhood?.landmarks` |
| Distance to city center | `property.location?.distance_to_center` |

If the API doesn't return a `neighborhood` object, the component should not render (check before including it in the JSX).

- [ ] Create `components/AgentBioPage.tsx` (or a shared pattern via a route file) with the structure above
- [ ] Create `components/NeighborhoodStats.tsx` and integrate into ProductPage after the Architectural Registry spec grid (line 351)
- [ ] Export both from `components/index.tsx`

---

### 9. Minor Polish

**`Page.tsx` — "LOAD MORE ESTATES" button text (line 284)**

```tsx
{loadingMore ? 'Loading...' : 'LOAD MORE ESTATES'}
```

Hardcoded.

- [ ] Wrap in `useThemeContent('collection.load_more_label', 'LOAD MORE ESTATES')` / `useThemeContent('collection.loading_label', 'Loading...')`

**`Page.tsx` — Filter/demo collection sub-label (line 220)**

```tsx
{useFallback ? 'Sample Properties // Preview' : 'The Collection // 01'}
```

The live label `'The Collection // 01'` is hardcoded.

- [ ] Move to `useThemeContent('collection.issue_label', 'The Collection // 01')`

---

### 10. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Filter sidebar** — at mobile, verify sidebar collapses or moves to top with visible filter controls. The `.pc-main-grid` should switch from sidebar+content to single-column
- [ ] **Property card grid** (`.pc-estate-grid`) — verify 1 column on 375px, 2 columns on ≥992px
- [ ] **Collection header** (`pc-section-header`): flex with text + description — verify they stack on mobile (description currently has `text-align: right` which needs to become `text-align: left` below the heading at mobile widths)
- [ ] **ProductPage detail grid** (`.pc-details-grid`) — verify sidebar stacks below content on mobile
- [ ] **ProductPage spec grid** (`.pc-specs-subgrid`) — verify 1-2 columns on mobile
- [ ] **Related listings** (`.pc-estate-grid`) — same check as homepage grid
- [ ] **Hero search bar** (`.pc-search-bar-frame`) — verify responsive widths

---

### 11. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using property title and location
- [ ] `ExplorePage`: add descriptive title
- [ ] Verify `Layout.tsx` doesn't conflict with page-level metadata

---

## Completion Checklist Summary

```
dangerouslySetInnerHTML REMOVAL (Page.tsx)
  [ ] Move skeleton CSS + pcPulse keyframes + breakpoint to styles.css
  [ ] Move .pc-testimonials-grid responsive CSS to styles.css

INLINE STYLES → CSS CLASSES (Page.tsx)
  [ ] pc-hero-eyebrow: add color + opacity to CSS class
  [ ] pc-hero-catalogue-link: add all properties to CSS class
  [ ] pc-section-eyebrow collection: color + opacity to CSS
  [ ] pc-section-title: size/color to CSS
  [ ] pc-collection-desc: textAlign, maxWidth, width, color etc to CSS
  [ ] DynamicTestimonials: remove sectionStyle + titleStyle; use class props

INLINE STYLES → CSS CLASSES (HeritageHeader.tsx)
  [ ] Logo → .pc-header-logo CSS class
  [ ] Mobile right div: marginTop to .pc-mobile-header-right CSS
  [ ] Both MenuActionButtons renderItem inline styles → CSS class

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger button

FOOTER BUGS
  [ ] Newsletter form: replace cart redirect with API call or success message
  [ ] Copyright year: dynamic fallback

PRODUCTPAGE ACCESSIBILITY
  [ ] Add id + htmlFor to all 6 form label/input pairs

NEW COMPONENTS
  [ ] AgentBioPage.tsx: photo, bio, specialties, contact, recent listings
  [ ] NeighborhoodStats.tsx: walk score, transit, schools, landmarks
  [ ] Integrate NeighborhoodStats into ProductPage after spec grid
  [ ] Export both from components/index.tsx

STRINGS → useThemeContent
  [ ] Page.tsx: load more label, collection issue label

RESPONSIVE
  [ ] Filter sidebar: mobile collapse/reflow
  [ ] pc-estate-grid: 1 col mobile, 2 col tablet
  [ ] Collection header: description text-align mobile
  [ ] ProductPage detail grid: sidebar stacks below
  [ ] Hero search bar

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + location)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + catalog | Good structure; 2× dangerouslySetInnerHTML; minor inline styles |
| `components/HeritageHeader.tsx` | Site nav | CMS nav ✓; logo + action buttons inline; missing aria-expanded |
| `components/LegacyFooter.tsx` | Footer | FooterMenuColumn × 3 ✓; newsletter form redirects to cart (bug); copyright year |
| `components/FilterSidebar.tsx` | Filter sidebar | Not audited — verify inline style volume |
| `components/ClassicEstateCard.tsx` | Property card | Not audited — check for inline styles |
| `components/CatalogRegistryAlert.tsx` | API alert | Delegates to alert pattern |
| `ProductPage.tsx` | Estate detail + inquiry | Best-structured ProductPage in Phase 2; form labels need id/htmlFor |
| `ExplorePage.tsx` | Catalog browse | Not fully audited |
| `CartPage.tsx` | Cart/inquiry list | Delegates to shared |
| `BookingPage.tsx`, etc. | Booking flow | Delegates to shared |
| `catalog.ts` | API + filter logic | Clean extraction |
| `fallback-data.ts` | Demo data | Properly extracted |
| `hooks/` | Link + demo hooks | Clean |
| `styles.css` | Styles | Solid; needs dangerouslySetInnerHTML rules moved in |
