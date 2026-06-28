# Theme Completion Plan: `services/marketplace`

**Priority:** #17 — Local services marketplace; most feature-complete Phase 2 theme
**Theme path:** `apps/storefront/src/themes/services/marketplace/`
**Audit score:** 7.5/10 — excellent booking flow and CMS integration; primary gaps are inline styles across components and missing provider verification badge

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, ConsultationConfirmationPage, Layout
- Components: MarketplaceHeader (CMS MenuNav + MenuActionButtons; hamburger implemented), SmCategoryCard (active state), SmProviderCard (image/rating/price/badges), SmCategorySkeleton, SmProviderSkeleton, MarketplaceFooter
- Live API via `fetchServicesHome` + demo fallback via `resolveServicesFailure`
- `useThemeContent` for: hero, search bar, categories title, providers title, all 3 How It Works steps (title + description), testimonials title, CTA section (title, description, both CTAs)
- Full filter system: search query, category, location, price range, star rating — all server-triggered
- **Stateful booking modal** with proper form (name, date, contact, requirements); form fields correctly have `htmlFor`/`id` pairs ✓
- `DynamicTestimonials` with 3 fallback testimonials
- Footer: `FooterCol` uses `useMenu` + `MenuLink` + `useMenuTitle` with fallback links — best CMS footer integration in Phase 2
- Footer copyright: dynamic year ✓
- Social links: conditional (filtered by empty string) ✓
- `CatalogSyncAlert` for API errors; shimmer skeleton loading

---

## Gaps & Issues to Fix

### 1. Missing Feature: Provider Verification Badge

The "Verified Provider" badge is listed as the primary gap. The theme already has a "TOP PRO" badge for featured providers; the verification badge is a separate trust signal for identity-verified providers.

**In `SmProviderCard`:**

```tsx
const isVerified = isDynamic && (service.professional?.is_verified || service.status?.is_verified);

{isVerified && (
  <div className="sm-verified-badge" aria-label="Verified provider">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
    Verified
  </div>
)}
```

- [ ] Add `isVerified` check reading `service.professional?.is_verified` or `service.status?.is_verified`
- [ ] Render `.sm-verified-badge` below the provider name
- [ ] Add `.sm-verified-badge { display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; font-weight: 700; color: var(--sm-primary); background: var(--sm-primary-light); padding: 0.15rem 0.5rem; border-radius: 20px; }` to `styles.css`

---

### 2. `MarketplaceHeader` — Missing `aria-expanded` + Logo Inline Style

**Missing `aria-expanded` (line 38–47):**

```tsx
<button className={`sm-hamburger ...`} onClick={...} aria-label="Toggle Navigation">
```

- [ ] Add `aria-expanded={isOpen}`

**Logo link inline style (line 32):**

```tsx
<a href={...} style={{ color: 'inherit', textDecoration: 'none' }}>
```

- [ ] Add `.sm-logo-link { color: inherit; text-decoration: none; }` to `styles.css`; replace inline style with `className="sm-logo-link"`

---

### 3. `SmCategoryCard` — Active State → CSS Class + Keyboard Accessibility

**Active state (line 82):**

```tsx
style={active ? { borderColor: 'var(--sm-primary)', background: 'var(--sm-primary-light)' } : {}}
```

- [ ] Replace with `className={`sm-category-card${active ? ' sm-category-card--active' : ''}`}`
- [ ] Add `.sm-category-card--active { border-color: var(--sm-primary); background: var(--sm-primary-light); }` to `styles.css`

**Card title (line 99):** `<h5 style={{ fontWeight: 700, margin: 0, fontSize: '1.05rem' }}>`
- [ ] Create `.sm-category-title { font-weight: 700; margin: 0; font-size: 1.05rem; }` in `styles.css`

**Keyboard accessibility:** The card `<div>` has `onClick` but no `role="button"` or `tabIndex`.
- [ ] Add `role="button"` + `tabIndex={0}` + `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}`

---

### 4. `SmProviderCard` — Heavy Inline Styles + Hardcoded Strings

**Hardcoded strings:**

| String | Fix |
|---|---|
| `'TOP PRO'` (line 128) | Already a badge class — wrap in `useThemeContent('card.top_pro_label', 'TOP PRO')` |
| `'View Profile'` (line 161) | `useThemeContent('card.view_profile_label', 'View Profile')` |
| `'Hire Now'` (line 174) | `useThemeContent('card.hire_label', 'Hire Now')` |
| `'120 reviews'` (line 158) | Use `service.reviews_count` from API or `useThemeContent('card.review_count', '4.9+')` |

**Inline styles to extract:**

| Element | Target class |
|---|---|
| Card outer div (line 137) | Add to `.sm-provider-card` CSS |
| Image wrap div (line 138) | `.sm-provider-img-wrap` |
| Title h5 (line 133) | `.sm-provider-title` (including `-webkit-line-clamp` in CSS — not as inline prop) |
| Body div (line 145) | `.sm-provider-body` |
| Category label p (line 151) | `.sm-provider-category` |
| Price p (line 152) | `.sm-provider-price` |
| Price type span (line 154) | `.sm-provider-price-type` |
| Rating p (line 157) | `.sm-provider-rating` |
| Review count span (line 158) | `.sm-provider-review-count` |
| Hire button (line 166) | Add `width: 100%` to `.sm-btn-primary.hire-btn` in CSS |

---

### 5. Skeleton Components — All Inline Styles

**`SmCategorySkeleton` (lines 181–184):**

- [ ] Create `.sm-skeleton-category` CSS class with height + border + overflow; move skeleton animation elements to CSS classes

**`SmProviderSkeleton` (lines 187–196):**

- [ ] Create `.sm-skeleton-provider`, `.sm-skeleton-provider-img`, `.sm-skeleton-provider-body` CSS classes
- [ ] Each shimmer element in the body → `.sm-skeleton-line`, `.sm-skeleton-line--wide`, `.sm-skeleton-line--narrow`, `.sm-skeleton-btn`

---

### 6. `MarketplaceFooter` — Inline Styles

**Brand section and bottom bar are inline (lines 293–329):**

| Element | Target class |
|---|---|
| Footer grid div (line 293) | `.sm-footer-grid` already exists — move `display: grid`, `gridTemplateColumns`, `gap`, `marginBottom` to CSS |
| Brand logo `<a>` (line 295) | `.sm-footer-logo` |
| Brand primary span (line 296) | `.sm-footer-logo-primary` |
| Brand secondary span (line 297) | `.sm-footer-logo-secondary` |
| Description `<p>` (line 299) | `.sm-footer-desc` |
| Email `<p>` (line 302) | `.sm-footer-email` |
| Social links div (line 304) | `.sm-footer-social-row` |
| Footer bottom div (line 323) | `.sm-footer-bottom` |
| Bottom legal links div (line 325) | `.sm-footer-legal` |
| Terms/Privacy link `<a>` (line 326–327) | `.sm-footer-link` already has class — remove `style={{ fontSize: '0.85rem' }}` inline |

**`FooterCol` internal styles (lines 252–253):**

- Line 252: `h6` inline (fontWeight, marginBottom, fontSize, color, textTransform, letterSpacing) → `.sm-footer-col-title`
- Line 253: `nav` inline (display, flexDirection, gap) → `.sm-footer-col-nav`

---

### 7. `Page.tsx` — Inline Styles to Extract

**Hero buttons row (line 255):** `style={{ display: 'flex', gap, flexWrap, justifyContent, marginTop }}` → `.sm-hero-actions`

**Filter bar search button (line 346):** `style={{ flex: 1, minWidth: '150px' }}` → add to `.sm-filter-btn` CSS

**Alert slot wrappers (lines 354, 359):** `style={{ padding: '0 5%' }}` → `.sm-alert-slot` padding in CSS

**Categories section `paddingTop` (line 365):** `style={{ paddingTop: '2rem' }}` → `.sm-section--categories` modifier

**Empty state reset button (line 418):** `style={{ marginTop: '1.5rem' }}` → `.sm-reset-btn` or add to `.sm-empty-state button` CSS

**How It Works step cards (lines 551–581):**

| Element | Target class |
|---|---|
| Step h4 (lines 551, 565, 579) | `.sm-step-title` |
| Step p (lines 552, 566, 580) | `.sm-step-desc` |
| Step arrow div (lines 554, 568) | `.sm-step-arrow` (already has className — add `display: flex; align-items: center; justify-content: center; color: var(--sm-border)` to CSS) |

**`DynamicTestimonials` `sectionStyle` (line 591):**

```tsx
sectionStyle={{ background: '#f0f4ff' }}
```

- [ ] Replace with `sectionClassName="sm-section--testimonials"` and add `.sm-section--testimonials { background: #f0f4ff; }` to `styles.css`

**CTA section (lines 623–630):**

| Element | Target class |
|---|---|
| CTA h2 (line 623) | `.sm-cta-title` |
| CTA p (line 624) | `.sm-cta-desc` |
| CTA buttons row (line 627) | `.sm-cta-actions` |

---

### 8. Booking Modal — Accessibility + Inline Styles

**Accessibility:**

- [ ] Add `role="dialog"` + `aria-labelledby="sm-modal-heading"` to `.sm-modal-container`
- [ ] Add `id="sm-modal-heading"` to `.sm-modal-title` h4
- [ ] Add `aria-label="Close booking modal"` to the close button (line 440: `<button className="sm-modal-close" onClick={...}>×</button>`)
- [ ] Move keyboard focus into the modal when it opens (focus the first input field)

**Inline styles inside the modal:**

| Element | Target class |
|---|---|
| Booking success container (line 446) | `.sm-modal-success` |
| Success icon div (line 447) | `.sm-modal-success-icon` |
| Success heading h4 (line 453) | `.sm-modal-success-title` |
| Success message p (line 454) | `.sm-modal-success-desc` |
| Service info div (line 460) | `.sm-modal-service-summary` |
| Service title div (line 461) | `.sm-modal-service-title` |
| Service category div (line 464) | `.sm-modal-service-category` |
| Modal footer last group (line 511) | `.sm-form-group--last { margin-bottom: 0; }` modifier |
| Cancel/Confirm buttons (lines 528–531) | Add `padding: 0.6rem 1.4rem` to `.sm-btn-secondary`, `.sm-btn-primary` in modal context |

---

### 9. Hardcoded Strings in Page.tsx — Wrap in `useThemeContent`

| String | Suggested key |
|---|---|
| `'Search'` button (line 349) | `search.button_label` |
| `'All Categories'` (line 294) | `filter.all_categories` |
| `'All Locations'` (line 311) | `filter.all_locations` |
| `'Any Price'` (line 327) | `filter.any_price` |
| Price range options text (lines 328–331) | `filter.price_under_50`, `filter.price_50_100`, etc. |
| `'Any Rating'` (line 339) | `filter.any_rating` |
| `'No categories published yet.'` (line 384) | `empty.no_categories` |
| `'No Providers Found'` (line 414) | `empty.no_providers_title` |
| `'Reset All Filters'` (line 428) | `empty.reset_label` |

---

### 10. `ConsultationConfirmationPage.tsx` — Audit

Not yet read. Quick audit to verify:

- [ ] Read `ConsultationConfirmationPage.tsx` — confirm it uses inquiry snapshot data to show a confirmation summary (name, service, date, booking ID)
- [ ] Confirm it has `metadata` export with a confirmation page title
- [ ] Check for any inline styles or hardcoded text

---

### 11. `ProductPage.tsx` — Audit

Not yet read.

- [ ] Read `ProductPage.tsx` — check for inline styles, `useThemeContent` coverage, and form label/input accessibility
- [ ] Verify the provider-level verification badge concept fits here too

---

### 12. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Filter bar** (`.sm-filter-bar`): 5 inputs in a row — verify wrap/stack on mobile
- [ ] **Category grid** (`.sm-category-grid`): verify 2–3 columns on mobile
- [ ] **Provider grid** (`.sm-provider-grid`): verify 1–2 columns on mobile
- [ ] **How It Works grid** (`.sm-step-grid`): 3 cards + 2 arrows — verify arrows hide/collapse on mobile; cards stack to 1 column
- [ ] **Booking modal** (`.sm-modal-container`): verify readable at 375px; full-width on mobile
- [ ] **Footer grid** (`.sm-footer-grid`): verify column collapse on mobile

---

### 13. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using service title and provider name
- [ ] `ConsultationConfirmationPage`: add title ("Booking Confirmed")

---

## Completion Checklist Summary

```
NEW FEATURE
  [ ] Provider verification badge: .sm-verified-badge on SmProviderCard
  [ ] Read service.professional?.is_verified from API

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger button
  [ ] Logo link: inline style → .sm-logo-link CSS

SMCATEGORYCARD
  [ ] Active state: style → .sm-category-card--active CSS class
  [ ] Category title h5: inline style → .sm-category-title CSS
  [ ] Add role="button" + tabIndex + onKeyDown for keyboard access

SMPROVIDERCARD
  [ ] Hardcoded strings → useThemeContent: TOP PRO, View Profile, Hire Now
  [ ] "120 reviews" → dynamic count or useThemeContent
  [ ] Extract all body inline styles → CSS classes
  [ ] Provider title: move -webkit-line-clamp to CSS

SKELETON COMPONENTS
  [ ] SmCategorySkeleton: all inline → CSS classes
  [ ] SmProviderSkeleton: all inline → CSS classes

FOOTER
  [ ] Brand section: logo link, spans, desc, email → CSS classes
  [ ] Social row and footer bottom → CSS classes
  [ ] FooterCol: h6 title + nav → CSS classes

PAGE.TSX INLINE STYLES → CSS CLASSES
  [ ] Hero buttons row
  [ ] Filter search button
  [ ] Alert slot wrappers
  [ ] Categories section paddingTop
  [ ] Empty state reset button
  [ ] How It Works: step h4 + p + arrow div
  [ ] DynamicTestimonials: sectionStyle → sectionClassName
  [ ] CTA: title, desc, buttons row

BOOKING MODAL ACCESSIBILITY
  [ ] role="dialog" + aria-labelledby on container
  [ ] aria-label on close button
  [ ] Focus first input when modal opens

BOOKING MODAL INLINE STYLES
  [ ] Success state, service summary, modal footer buttons

STRINGS → useThemeContent
  [ ] Search button, filter options (all categories, all locations,
      any price, any rating), empty state messages

PAGES NOT YET AUDITED
  [ ] ConsultationConfirmationPage.tsx
  [ ] ProductPage.tsx

RESPONSIVE
  [ ] Filter bar: wrap on mobile
  [ ] Category grid: 2-3 col mobile
  [ ] Provider grid: 1-2 col mobile
  [ ] How It Works: arrows collapse on mobile
  [ ] Booking modal: full-width on mobile
  [ ] Footer grid: column collapse on mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (service title + provider)
  [ ] ConsultationConfirmationPage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + booking modal | Excellent useThemeContent; moderate inline styles; modal accessibility gaps |
| `components/index.tsx` — MarketplaceHeader | Site nav | CMS nav ✓; hamburger ✓; missing aria-expanded; logo link inline |
| `components/index.tsx` — SmCategoryCard | Category pill | Active state inline; title inline; not keyboard-accessible |
| `components/index.tsx` — SmProviderCard | Provider card | Hardcoded labels; heavy body inline; verification badge missing |
| `components/index.tsx` — SmCategorySkeleton | Skeleton | All inline |
| `components/index.tsx` — SmProviderSkeleton | Skeleton | All inline |
| `components/index.tsx` — FooterCol | Footer nav column | CMS + fallback ✓; title + nav inline |
| `components/index.tsx` — MarketplaceFooter | Footer | Brand section inline; dynamic year ✓; social conditional ✓ |
| `ProductPage.tsx` | Service detail | Not audited |
| `ConsultationConfirmationPage.tsx` | Booking confirmed | Not audited |
| `ExplorePage.tsx` | Service browse | Not audited |
| `styles.css` | Styles | Will grow with CSS class extractions |
