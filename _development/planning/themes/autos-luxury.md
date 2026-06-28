# Theme Completion Plan: `autos/luxury`

**Priority:** #10 — Luxury auto dealer niche; finance estimator is a genuine differentiator
**Theme path:** `apps/storefront/src/themes/autos/luxury/`
**Audit score:** 8.5/10 — strong features; ProductPage has heavy inline styles and zero `useThemeContent`

---

## What's Already Done

- Full page suite: Homepage, ProductPage (vehicle detail + financing + VIP inquiry), ExplorePage, InquiryConfirmationPage, Layout
- Components: LuxuryHeader (CMS MenuNav + MenuActionButtons — clean, no inline styles), LuxuryCarCard, LuxuryFooter (FooterMenuColumn × 3 — CMS-driven)
- Live API via `fetchVehiclesHome`, `fetchVehicleDetail`, with demo fallback via `resolveVehiclesFailure` / `resolveVehicleFailure`
- `useThemeContent` + `useThemeMedia` extensively used in Page.tsx for hero, search, collection, showcase, brands, testimonials headings
- `DynamicTestimonials` on homepage
- `CatalogSyncAlert` on both Page.tsx and ProductPage
- **Finance/lease estimator** — sliders for down payment %, interest APR, loan term with live monthly payment calculation (real differentiator)
- VIP showroom viewing inquiry form (name, email, phone, date, time) → `submitVehicleInquiry` → `redirectToVehicleInquiryConfirmation`
- Related vehicles section on ProductPage
- `LiveChatWidget` on ProductPage
- Filter bar (brand, price range, year, category) → routes to ExplorePage with query params

---

## Gaps & Issues to Fix

### 1. Inline Styles — Extract to CSS

Moderate volume — most of `LuxuryHeader` is already CSS-clean. The heaviest files are `ProductPage.tsx` and `components/index.tsx`.

**`components/index.tsx` — LuxuryFooter**

| Element | Target class |
|---|---|
| Footer grid (lines 99–105) | `.lx-footer-grid` |
| Brand logo `<a>` (line 107) | `.lx-footer-logo` |
| Brand description `<p>` (line 110) | `.lx-footer-desc` |
| `FooterMenuColumn` `titleStyle` (lines 117, 122, 127) | Replace inline `titleStyle` prop with `titleClassName="lx-footer-col-title"` |
| Footer bottom bar (lines 134–143) | `.lx-footer-bottom` |

**`components/index.tsx` — LuxuryCarCard**

| Element | Target class |
|---|---|
| Image overflow wrapper (line 65) | `.lx-car-img-wrap` |
| Specs `<p>` (line 70) | `.lx-car-specs` |
| Price/action row (line 73) | `.lx-car-meta` |
| "View Details" button size override (line 78) | `.lx-car-detail-btn` (or handle via `.lx-car-body .lx-btn-outline`) |

**`Page.tsx`**

| Element | Target class |
|---|---|
| Hero description `<p>` (line 122) | `.lx-hero-description` |
| Hero CTA row (line 125) | `.lx-hero-actions` |
| Filter bar search button `flex: 1` (line 197) | `.lx-filter-submit` |
| Skeleton loading grid (line 216) | `.lx-skeleton-grid` |
| Skeleton card body (lines 218–227) | `.lx-skeleton-card`, `.lx-skeleton-img`, `.lx-skeleton-title`, `.lx-skeleton-subtitle`, `.lx-skeleton-meta` |
| "View All" wrapper (line 254) | `.lx-collection-footer` |
| "View All" button size override (line 255) | handled via `.lx-collection-footer .lx-btn` |
| Exclusive Showcase section dark bg (line 262) | `.lx-showcase-section` |
| Showcase section title color (line 263) | `.lx-showcase-section .lx-section-title` |
| Showcase image (line 266) | `.lx-showcase-img` |
| Showcase heading size (line 269) | `.lx-showcase-heading` |
| Showcase subtitle (line 270) | `.lx-showcase-subtitle` |
| Showcase description (line 271) | `.lx-showcase-description` |
| Brand links (lines 285–290) | `.lx-brand-item` already exists; add `color` and `text-decoration` to the CSS class |
| `DynamicTestimonials` `sectionStyle + titleStyle` (lines 298–303) | `.lx-testimonials-section` and `.lx-testimonials-title` — pass as class props instead of style props |

**`ProductPage.tsx` — Loading and not-found states**

| Element | Target class |
|---|---|
| Loading wrapper (line 167) | `.lx-loading-state` |
| Loading heading (line 169) | `.lx-loading-title` |
| Loading skeleton bar (line 170) | already uses `.lx-skeleton` — add margin/width to `.lx-loading-bar` |
| Not-found wrapper (line 178) | `.lx-notfound-state` |
| Not-found error `<p>` (line 181) | `.lx-notfound-message` |

**`ProductPage.tsx` — Hero section (lines 199–223)**

The hero reuses `.lx-hero` but adds many inline overrides. Create ProductPage-specific variants:

| Element | Target class |
|---|---|
| Hero section (height, bg-attachment, display, alignItems, padding) | `.lx-detail-hero` (keep `.lx-hero` for homepage) |
| Hero gradient overlay | `.lx-detail-hero-overlay` |
| Hero content bar | `.lx-detail-hero-content` |
| Vehicle title `<h1>` | `.lx-detail-title` |
| Make/model subtitle `<p>` | `.lx-detail-subtitle` |
| Price panel (text-align: right) | `.lx-detail-price-panel` |
| "Acquisition Valuation" label | `.lx-detail-price-label` |
| Price value `<span>` | `.lx-detail-price-value` |

**`ProductPage.tsx` — Main details section (lines 234–291)**

| Element | Target class |
|---|---|
| 2-column grid wrapper (line 234) | `.lx-detail-grid` |
| Section heading "Provenance & Specifications" (line 238) | `.lx-detail-section-title` |
| Description `<p>` (line 239) | `.lx-detail-description` |
| Spec sheet grid (line 244) | `.lx-spec-sheet` (new, replacing the inline grid) |
| Each spec tile | `.lx-spec-tile` (dedicated class — do NOT reuse `.lx-testimonial-card`) |
| Spec label `<small>` | `.lx-spec-label` |
| Spec value `<span>` | `.lx-spec-value` |

**`ProductPage.tsx` — Finance calculator (lines 294–375)**

| Element | Target class |
|---|---|
| Calculator card wrapper | `.lx-finance-calc` |
| Calculator heading | `.lx-finance-calc-title` |
| Sliders row | `.lx-finance-sliders` |
| Slider label row (flex, space-between) | `.lx-slider-header` |
| Slider value badge | `.lx-slider-value` |
| Range input | `.lx-range` (add `accent-color: var(--lx-gold)` in CSS) |
| Term selector row | `.lx-term-row` |
| Term label | `.lx-term-label` |
| Term button row | `.lx-term-buttons` |
| Result bar (flex, space-between, border-top) | `.lx-finance-result` |
| Monthly rate label | `.lx-finance-result-label` |
| Monthly rate amount | `.lx-finance-result-amount` |
| Disclaimer `<small>` | `.lx-finance-disclaimer` |

**`ProductPage.tsx` — VIP Desk sidebar (lines 380–479)**

| Element | Target class |
|---|---|
| Sidebar card | `.lx-vip-desk` |
| Card heading | `.lx-vip-desk-title` |
| Card intro `<p>` | `.lx-vip-desk-intro` |
| Form wrapper | `.lx-vip-form` |
| Each form label | `.lx-form-label` |
| Each input `width + box-sizing` | `.lx-form-input` (add to `styles.css`, applies to `.lx-select` inside form) |
| Date + time 2-column grid | `.lx-form-date-row` |
| Submit button size override | `.lx-vip-submit` |
| Privacy note | `.lx-vip-privacy` |

**`ProductPage.tsx` — Related section (lines 487–488)**

| Element | Target class |
|---|---|
| Related section (borderTop, backgroundColor) | `.lx-related-section` |
| Related heading color | `.lx-related-section .lx-section-title` |

---

### 2. Copyright Year Hardcoded

`components/index.tsx` line 142:

```tsx
© 2026 Sellio. All rights reserved.
```

- [ ] Replace with `useThemeContent('footer.copyright', '')` and render `{copyright || \`© ${new Date().getFullYear()}. All rights reserved.\`}`

---

### 3. `ProductPage.tsx` — Zero `useThemeContent` Calls

No user-visible string in ProductPage goes through `useThemeContent`. Store owners can't localise or rebrand any of these labels.

| Hardcoded string | Suggested key |
|---|---|
| `"Acquisition Valuation"` | `detail.price_label` |
| `"Provenance & Specifications"` | `detail.specs_heading` |
| Spec tile labels (9 entries: Production Year, Odometer Mileage, Engine Architecture, Transmission Type, Drivetrain System, Exterior Finish, Fuel Economy, Condition Score, VIP Warranty) | `detail.spec_year`, `detail.spec_mileage`, `detail.spec_engine`, `detail.spec_transmission`, `detail.spec_drivetrain`, `detail.spec_color`, `detail.spec_economy`, `detail.spec_condition`, `detail.spec_warranty` |
| `"🧮 Elite Financing Estimator"` heading | `detail.finance_heading` |
| `"Down Payment"`, `"Interest Rate (APR)"`, `"Loan Term Period"`, `"Estimated Monthly Rate"` | `finance.down_payment_label`, `finance.apr_label`, `finance.term_label`, `finance.rate_label` |
| Disclaimer text | `finance.disclaimer` |
| `"⚜️ Showroom VIP Desk"` | `detail.vip_heading` |
| VIP Desk description | `detail.vip_description` |
| Form field labels (Full Name, Email Address, Phone Contact, Viewing Date, Time Preference) | `form.name_label`, `form.email_label`, `form.phone_label`, `form.date_label`, `form.time_label` |
| `"Schedule Private Viewing"` button | `form.submit_label` |
| Privacy note | `form.privacy_note` |
| `"Related Masterpieces"` | `detail.related_heading` |

- [ ] Add `useThemeContent` imports and calls for all strings above in `ProductPage.tsx`

---

### 4. Emoji in Component Code

Line 302: `"🧮 Elite Financing Estimator"` and line 389: `"⚜️ Showroom VIP Desk"`.

- [ ] Remove emoji from the hardcoded default strings (move to `useThemeContent` defaults, where store owners can keep or remove them)
- [ ] Alternatively replace with small SVG icons for consistency with the theme's premium aesthetic

---

### 5. Typo in ProductPage.tsx (line 393)

```tsx
"Register for a private private viewing of this vehicle asset."
```

"private private" is a typo.

- [ ] Fix to `"Register for a private viewing of this vehicle asset."` (this will be in `useThemeContent` default after issue #3 is resolved)

---

### 6. Brands Section — Use API Data

`Page.tsx` lines 285–290: 5 hardcoded brand links (Ferrari, Lamborghini, Mercedes, Rolls Royce, Porsche). `brands` state is already populated from the API sidebar response (lines 48–50, 70–74) and used for the filter dropdown.

- [ ] Render the brand grid from the `brands` state: `brands.slice(0, 5).map(b => <a href={themeLink('/explore?brand=' + b.title)}>...)`
- [ ] Fall back to the current 5 hardcoded brands only when `brands` is empty (demo mode)

---

### 7. `LuxuryHeader` — Missing `aria-expanded`

`components/index.tsx` line 22–31:

```tsx
<button aria-label="Toggle Navigation" id="lx-hamburger-toggle" ...>
```

- [ ] Add `aria-expanded={isOpen}` to the hamburger button

---

### 8. `ProductPage.tsx` — Form Accessibility

Lines 404, 417, 430, 444, 455: `<label style={{...}}>Full Name *</label>` — no `htmlFor`; inputs have no `id`.

- [ ] Add `id` + `htmlFor` pairs: `vip-name`, `vip-email`, `vip-phone`, `vip-date`, `vip-time`

**Range sliders** (lines 314–322, 333–341):

```tsx
<input type="range" min="0" max="80" step="5" ...>
```

No `aria-label` or `aria-valuetext`. Screen readers announce just the numeric value without context.

- [ ] Add `aria-label="Down payment percentage"` and `aria-label="Annual percentage rate"` to the respective range inputs

---

### 9. Showcase Image Alt Text

`Page.tsx` line 266:

```tsx
<img src={showcaseImage} style={{ width: '100%', borderRadius: '8px' }} alt="" />
```

`alt=""` treats it as decorative. The showcase image is featured content (e.g. a Ferrari 250 GTO).

- [ ] Change to `alt={showcaseHeading}` (already in `useThemeContent`) to give screen readers meaningful context

---

### 10. `lx-spec-tile` vs `lx-testimonial-card` Class Confusion

Lines 246–289: Each spec tile uses `className="lx-testimonial-card"` with inline style overrides. This class is semantically for testimonials and has testimonial-specific styling.

- [ ] Create `.lx-spec-tile` class in `styles.css` with the desired styling (border-left, background-color, padding)
- [ ] Replace `className="lx-testimonial-card"` on all 9 spec tiles with `className="lx-spec-tile"`

---

### 11. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Filter bar**: 4 selects + 1 button in a flex row — needs to stack or wrap on mobile; selects should take `width: 100%` at narrow breakpoints
- [ ] **ProductPage detail grid** (2fr 1fr): VIP sidebar should stack below content on mobile
- [ ] **Finance calculator sliders** (1fr 1fr): should stack on mobile (each slider taking full width)
- [ ] **Term buttons** (5 × `flex: 1` buttons): on 375px width this may be very tight — verify they remain readable or allow wrapping
- [ ] **Hero `background-attachment: fixed`** (parallax): `fixed` background attachment doesn't work on iOS. Add `@media (max-width: 768px) { .lx-detail-hero { background-attachment: scroll; } }`
- [ ] **Related vehicles grid** (`.lx-grid`): verify 1-column on mobile
- [ ] **Brand grid** (`.lx-brand-grid`): verify wraps on mobile

---

### 12. SEO Metadata

- [ ] Homepage: verify `metadata` export with title and description
- [ ] `ProductPage`: add `generateMetadata` using vehicle title, make, model, year
- [ ] `ExplorePage`: add descriptive title ("Browse Luxury Vehicles")
- [ ] `InquiryConfirmationPage`: add title

---

## Completion Checklist Summary

```
INLINE STYLES → CSS CLASSES
  [ ] LuxuryFooter: grid, logo, desc, footer bottom bar
  [ ] LuxuryCarCard: image wrap, specs p, meta row, detail btn
  [ ] FooterMenuColumn: replace titleStyle with titleClassName="lx-footer-col-title"
  [ ] Page.tsx: hero desc, hero actions, filter submit, skeleton grid+cards,
      collection footer, showcase section, showcase image/heading/subtitle/desc,
      brand links, testimonials section/title
  [ ] ProductPage.tsx: loading/notfound, detail hero, hero content/title/price,
      detail grid, section title, description, spec sheet (.lx-spec-tile),
      finance calculator card+sliders+term+result,
      VIP desk card+form labels+inputs+submit+privacy note, related section

COPYRIGHT YEAR
  [ ] LuxuryFooter: dynamic year with useThemeContent fallback

useThemeContent IN ProductPage.tsx
  [ ] Wrap all 20+ hardcoded strings (see table in section 3)
  [ ] Remove emoji from heading strings (move to content defaults)

TYPO FIX
  [ ] Line 393: "private private" → "private"

BRANDS SECTION
  [ ] Use `brands` state from API; fall back to hardcoded list when empty

lx-spec-tile CLASS
  [ ] Create .lx-spec-tile in styles.css
  [ ] Replace className="lx-testimonial-card" on all 9 spec tiles

ACCESSIBILITY
  [ ] LuxuryHeader: add aria-expanded={isOpen}
  [ ] ProductPage form: add id + htmlFor to 5 label/input pairs
  [ ] Range sliders: add aria-label to down payment and APR inputs
  [ ] Showcase image: change alt="" → alt={showcaseHeading}

RESPONSIVE
  [ ] Filter bar: wrap/stack on mobile
  [ ] ProductPage detail grid: single column on mobile
  [ ] Finance sliders: single column on mobile
  [ ] Term buttons: verify fit at 375px
  [ ] Detail hero: background-attachment scroll on iOS/mobile
  [ ] lx-grid: verify 1-column on mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (vehicle title + make/model/year)
  [ ] ExplorePage title
  [ ] InquiryConfirmationPage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good useThemeContent; moderate inline styles in showcase, skeleton, brand links |
| `components/index.tsx` — LuxuryHeader | Site nav | Clean — CMS menu, no inline styles; missing aria-expanded |
| `components/index.tsx` — LuxuryCarCard | Car card | Minor inline styles; `lx-testimonial-card` misuse on specs |
| `components/index.tsx` — LuxuryFooter | Footer | Footer grid inline; copyright year hardcoded |
| `ProductPage.tsx` | Vehicle detail + finance + inquiry | Feature-rich; zero useThemeContent; heavy inline styles; typo; spec tile class misuse |
| `ExplorePage.tsx` | Vehicle catalog + filters | Not yet fully audited — verify inline style volume |
| `InquiryConfirmationPage.tsx` | Post-inquiry confirmation | Delegates to shared — verify |
| `Layout.tsx` | Theme shell | Minimal — correct |
| `styles.css` | Styles | Will grow with ProductPage extraction; add lx-spec-tile, lx-finance-calc, etc. |
