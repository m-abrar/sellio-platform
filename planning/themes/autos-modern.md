# Theme Completion Plan: `autos/modern`

**Priority:** #19 — EV/modern-focused auto dealer; bold hero and filter bar already implemented
**Theme path:** `apps/storefront/src/themes/autos/modern/`
**Audit score:** 7/10 — distinctive EV identity and clean filter system; gaps are inline styles throughout components, hardcoded strings, and a compare section that needs upgrading to a real spec table

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, Layout
- Components: ModernHeader (hamburger + `aria-expanded` ✓), ModernCarCard, CompareItem, ModernBrandGrid, ModernFooter (FooterMenuColumn × 3 ✓ + social MenuNav ✓), CarCardSkeleton
- Live API via `fetchVehiclesHome` + `CatalogSyncAlert` for errors (no demo fallback path shown; check for `resolveVehiclesFailure`)
- `useThemeContent` for: hero title/description/CTAs, search placeholder, collection title, compare title/CTA, brands title, tech section title + 2 features (title, description, secondary text)
- `useThemeMedia` for tech feature images and hero background image
- **Hero background**: conditional `backgroundImage` style only when `heroBgImage` set ✓
- **Bold filter bar**: 4 selects (brand from API, category from API, price range, year YEAR_OPTIONS) + keyword input + search button → `router.push` to `/explore` ✓
- **Compare section**: 3 `CompareItem` cards side by side; middle card highlighted; conditional (only shown when ≥3 vehicles)
- **Brand grid**: `ModernBrandGrid` with logo or 2-letter monogram fallback ✓
- **Tech features section**: 2 image+copy rows (AI Driving, EV Powertrains)
- **Dynamic copyright year** ✓ (`const year = new Date().getFullYear()`)
- `ModernHeader`: `aria-expanded={isOpen}` ✓

---

## Gaps & Issues to Fix

### 1. Primary Missing Feature: Spec Comparison Table Upgrade

The current compare section shows 3 vehicle *cards* side by side (`CompareItem` = title + stats string + price + button). This is a visual improvement over `autos/classic` but not a true spec comparison. The differentiator that earns the "compare" section its own heading should be a tabular spec breakdown:

| Spec         | Vehicle A   | Vehicle B   | Vehicle C   |
|---|---|---|---|
| Price        | $42,500     | $68,000     | $35,900     |
| Year         | 2023        | 2024        | 2022        |
| Engine       | 2.0L Turbo  | Electric    | 3.5L V6     |
| Drivetrain   | AWD         | AWD         | RWD         |
| Transmission | Auto        | Single-spd  | Auto        |
| Fuel Type    | Petrol      | Electric    | Petrol      |
| Condition    | New         | New         | Used        |

**Implementation:**

- [ ] Create `CompareTable` component inside `components/index.tsx`
- [ ] Accept `vehicles: Vehicle[]` prop (max 3), render `<table>` with `role="table"`
- [ ] Row headers from `useThemeContent` keys: `compare.spec_price`, `compare.spec_year`, `compare.spec_engine`, `compare.spec_drivetrain`, `compare.spec_transmission`, `compare.spec_fuel`, `compare.spec_condition`
- [ ] Use `formatVehiclePrice`, `getConditionLabel`, `getVehicleSpecLabel` from `vehicle-utils` for values
- [ ] If a spec field is null/empty, render `'—'`
- [ ] Add `.md-compare-table`, `.md-compare-table-header`, `.md-compare-table-row`, `.md-compare-td`, `.md-compare-th` to `styles.css`
- [ ] Replace the current `md-compare-grid` block in `Page.tsx` with `<CompareTable vehicles={vehicles.slice(0, 3)} />` — keep `CompareItem` for a "quick look" row above the table, or remove it in favor of the table

---

### 2. `Page.tsx` — Inline Styles

**Compare CTA row (line 308):**
```tsx
<div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
```
→ `.md-compare-cta-row { text-align: center; margin-top: 2.5rem; }` in `styles.css`

**Tech feature 2 layout (lines 345, 350):** The "feature 2" row reverses the image/copy order using `style={{ order: 2 }}` and `style={{ order: 1 }}`:
```tsx
<div className="md-feature-copy" style={{ order: 2 }}>
<div style={{ order: 1 }}>
```
→ Use CSS `:nth-child(2)` selectors on `.md-feature-row:nth-child(2) .md-feature-copy { order: 2; }` and `.md-feature-row:nth-child(2) > div:last-child { order: 1; }` — or use modifier class `.md-feature-row--reversed` and add the reversed-order CSS there

**Compare skeleton blocks (lines 291–293):**
```tsx
<div className="md-skeleton md-skeleton-block" style={{ height: '18px', width: '60%', margin: '0 auto 0.75rem' }} />
<div className="md-skeleton md-skeleton-block" style={{ height: '14px', width: '80%', margin: '0 auto 1rem' }} />
<div className="md-skeleton md-skeleton-block" style={{ height: '36px', width: '55%', margin: '0 auto' }} />
```
→ `.md-skeleton-compare-title`, `.md-skeleton-compare-desc`, `.md-skeleton-compare-btn` CSS classes

---

### 3. `Page.tsx` — Hardcoded Strings → `useThemeContent`

| String | Suggested key |
|---|---|
| `'Next-Gen Mobility'` eyebrow (line 128) | `hero.eyebrow` |
| `'Vehicles'` stat label (line 141) | `hero.stat_vehicles` |
| `'Brands'` stat label (line 145) | `hero.stat_brands` |
| `'Categories'` stat label (line 149) | `hero.stat_categories` |
| `'Search'` button (line 222) | `search.button_label` |
| `'Showroom'` eyebrow (line 235) | `collection.eyebrow` |
| `'Hand-picked electric...'` subtitle (line 238) | `collection.subtitle` |
| `'Side by Side'` compare eyebrow (line 278) | `compare.eyebrow` |
| `'Compare specs, pricing...'` compare subtitle (line 281) | `compare.subtitle` |
| `'Partners'` brands eyebrow (line 320) | `brands.eyebrow` |
| `'Shop by manufacturer...'` brands subtitle (line 322) | `brands.subtitle` |
| `'Innovation'` tech eyebrow (line 329) | `tech.eyebrow` |

**Filter select default option labels:**

| String | Suggested key |
|---|---|
| `'Brand / Make'` (line 164) | `filter.brand_default` |
| `'Category'` (line 179) | `filter.category_default` |
| `'Price Range'` (line 193) | `filter.price_default` |
| `'Year'` (line 204) | `filter.year_default` |
| `'Under $30,000'` (line 194) | `filter.price_under_30k` |
| `'$30,000 - $60,000'` (line 195) | `filter.price_30k_60k` |
| `'$60,000 - $100,000'` (line 196) | `filter.price_60k_100k` |
| `'$100,000 & Above'` (line 197) | `filter.price_100k_plus` |

---

### 4. `BrandLogo` — Inline Styles + Emoji

**Lines 16, 18:**
```tsx
<span style={{ color: 'var(--md-accent)' }} aria-hidden="true">⚡</span>
{firstWord}{' '}
<span style={{ color: 'var(--md-accent)' }}>{restWords.join(' ')}</span>
```

- [ ] Create `.md-logo-accent { color: var(--md-accent); }` in `styles.css`
- [ ] Replace both `style={{ color: 'var(--md-accent)' }}` with `className="md-logo-accent"`
- [ ] `aria-hidden="true"` on the lightning bolt is correct ✓

---

### 5. `ModernCarCard` — Inline Styles + Hardcoded Strings + Link Structure

**Link inline styles (lines 91, 101):** Two separate `<Link>` wrappers (image and title+specs) both use `style={{ textDecoration: 'none', color: 'inherit' }}`.

- [ ] Add `text-decoration: none; color: inherit;` to `.md-car-card a` or create `.md-car-link` class in `styles.css`

**Hardcoded strings:**

- `'MSRP'` (line 116): → `useThemeContent('card.price_label', 'MSRP')` or pass as prop from Page.tsx
- `'View Details'` (line 118): → `useThemeContent('card.view_details_label', 'View Details')` or prop

**Link duplication note:** The card has 3 links to the same URL (image, title+specs, button). This creates extra tab stops. Consider wrapping the whole card in one link and hiding the button from the tab order, or accepting the current pattern as a minor accessibility concern.

---

### 6. `CompareItem` — Inline Style + Hardcoded String

**Button style (line 150):**
```tsx
style={{ width: '100%', boxSizing: 'border-box' }}
```
→ Add `width: 100%; box-sizing: border-box;` to `.md-compare-item .md-btn` CSS

**Hardcoded `'Full Specs'` (line 148):**
→ Accept `viewLabel` prop defaulting to `'Full Specs'`; pass from Page.tsx with `useThemeContent('compare.view_label', 'Full Specs')`

---

### 7. `ModernBrandGrid` — Inline Style on Logo `<img>`

**Line 179:**
```tsx
style={{ maxHeight: '42px', maxWidth: '100%', objectFit: 'contain' }}
```
→ `.md-brand-logo { max-height: 42px; max-width: 100%; object-fit: contain; }` in `styles.css`

---

### 8. `ModernFooter` — Inline Styles + `titleStyle` → `titleClassName`

**Footer logo link (line 210):**
```tsx
style={{ marginBottom: '1rem', display: 'inline-flex' }}
```
→ `.md-footer-logo { margin-bottom: 1rem; display: inline-flex; }` in `styles.css`

**Footer description `<p>` (line 213):**
```tsx
style={{ fontSize: '0.92rem', lineHeight: 1.65, margin: 0 }}
```
→ `.md-footer-desc { font-size: 0.92rem; line-height: 1.65; margin: 0; }` in `styles.css`

**FooterMenuColumn `titleStyle` (lines 218, 224, 231):**
```tsx
titleStyle={{ color: 'white', fontWeight: 700, marginBottom: '1.25rem', fontSize: '0.95rem' }}
```
- [ ] Replace all 3 with `titleClassName="md-footer-col-title"`
- [ ] Add `.md-footer-col-title { color: white; font-weight: 700; margin-bottom: 1.25rem; font-size: 0.95rem; }` to `styles.css`

**Social links wrapper (line 234):**
```tsx
<div style={{ marginTop: '0.5rem' }}>
```
→ `.md-footer-social { margin-top: 0.5rem; }` in `styles.css`

---

### 9. `CarCardSkeleton` — Inline Styles

All skeleton sizes are inline (lines 254–261):
```tsx
<div className="md-car-card" style={{ pointerEvents: 'none' }}>
<div className="md-skeleton md-skeleton-block" style={{ height: '210px' }} />
<div className="md-skeleton md-skeleton-block" style={{ height: '20px', width: '72%', marginBottom: '0.65rem' }} />
<div className="md-skeleton md-skeleton-block" style={{ height: '14px', width: '55%', marginBottom: '1rem' }} />
<div className="md-skeleton md-skeleton-block" style={{ height: '26px', width: '42%' }} />
```

- [ ] Add `.md-car-card--loading { pointer-events: none; }` to `styles.css`; replace `style={{ pointerEvents: 'none' }}` with `className="md-car-card md-car-card--loading"`
- [ ] Add `.md-skeleton-car-img`, `.md-skeleton-car-title`, `.md-skeleton-car-desc`, `.md-skeleton-car-price` CSS classes with the respective dimensions
- [ ] Replace inline style props on each skeleton div

---

### 10. `ProductPage.tsx` — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check for inline styles, `useThemeContent` coverage, form label/input accessibility on any inquiry/test-drive form, and vehicle spec display

---

### 11. Demo Fallback — Verify Pattern

- [ ] Confirm `resolveVehiclesFailure` / `useDemoFallbackAllowed()` pattern is used when API fails (or explain why not — the current code sets `apiError` and shows `CatalogSyncAlert` but doesn't load demo vehicles)
- [ ] If demo fallback is missing: add `import { resolveVehiclesFailure } from '@/themes/autos/shared/catalog'` and call it in the `else` branch

---

### 12. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Hero** (`md-hero`): verify headline size + stat row wraps cleanly at 375px
- [ ] **Filter form** (`md-filter-section`): 4 selects + keyword input + button in a row → verify stack/wrap on mobile; touch targets ≥44px on selects
- [ ] **Featured grid** (`md-featured-grid`): verify 1 column on mobile, 2 on tablet
- [ ] **Compare grid** (`md-compare-grid`): 3 columns → verify scrollable or 1 column on mobile
- [ ] **Compare spec table** (new): sticky first column for spec labels on mobile
- [ ] **Brand grid** (`md-brand-grid`): verify tile wrap on mobile
- [ ] **Tech feature rows** (`md-feature-row`): image + copy side by side → stacked on mobile
- [ ] **Footer grid** (`md-footer-grid`): verify column collapse on mobile

---

### 13. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using vehicle title, year, and price
- [ ] `ExplorePage`: add title ("Browse Vehicles")

---

## Completion Checklist Summary

```
NEW FEATURE
  [ ] CompareTable component: tabular spec breakdown (7 rows × 3 vehicles)
  [ ] useThemeContent keys for all spec row labels
  [ ] Replace CompareItem grid with CompareTable in Page.tsx (or show both)

INLINE STYLES → CSS CLASSES — Page.tsx
  [ ] Compare CTA row → .md-compare-cta-row
  [ ] Feature 2 order reversal → .md-feature-row--reversed CSS
  [ ] Compare skeleton blocks → CSS classes

INLINE STYLES → CSS CLASSES — components/index.tsx
  [ ] BrandLogo accent spans → .md-logo-accent
  [ ] ModernCarCard link wraps → CSS (.md-car-card a or .md-car-link)
  [ ] CompareItem btn → CSS (.md-compare-item .md-btn)
  [ ] ModernBrandGrid logo img → .md-brand-logo
  [ ] ModernFooter logo link → .md-footer-logo
  [ ] ModernFooter description → .md-footer-desc
  [ ] FooterMenuColumn titleStyle → titleClassName="md-footer-col-title"
  [ ] Social links wrapper → .md-footer-social
  [ ] CarCardSkeleton: all inline → CSS classes

HARDCODED STRINGS → useThemeContent
  [ ] Hero: eyebrow, stat labels × 3, search button
  [ ] Collection: eyebrow + subtitle
  [ ] Compare: eyebrow + subtitle + view label
  [ ] Brands: eyebrow + subtitle
  [ ] Tech: eyebrow
  [ ] Filter: brand/category/price/year defaults + price range labels × 4
  [ ] Card: 'MSRP' + 'View Details' labels

DEMO FALLBACK
  [ ] Verify resolveVehiclesFailure pattern; add if missing

PAGES NOT YET AUDITED
  [ ] ProductPage.tsx

RESPONSIVE
  [ ] Filter bar: wrap on mobile
  [ ] Compare grid: scroll or stack on mobile
  [ ] Compare spec table: sticky label column on mobile
  [ ] Tech feature rows: stack on mobile
  [ ] Footer grid: column collapse

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + year + price)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + filter form | Good useThemeContent coverage; compare CTA + feature order inline; eyebrows + subtitles hardcoded |
| `components/index.tsx` — ModernHeader | Site nav | Hamburger ✓; aria-expanded ✓; CMS nav ✓ |
| `components/index.tsx` — BrandLogo | Logo sub-component | Accent spans inline; emoji aria-hidden ✓ |
| `components/index.tsx` — ModernCarCard | Vehicle card | Link wraps inline; 'MSRP'+'View Details' hardcoded; 3 links to same URL |
| `components/index.tsx` — CompareItem | Compare card | Btn style inline; 'Full Specs' hardcoded |
| `components/index.tsx` — ModernBrandGrid | Brand tile grid | Logo img inline |
| `components/index.tsx` — ModernFooter | Footer | FooterMenuColumn × 3 ✓; brand section inline; titleStyle instead of titleClassName |
| `components/index.tsx` — CarCardSkeleton | Loading skeleton | All inline |
| `ProductPage.tsx` | Vehicle detail | Not audited |
| `ExplorePage.tsx` | Vehicle browse | Not audited |
| `styles.css` | Styles | Will grow significantly after extraction |
