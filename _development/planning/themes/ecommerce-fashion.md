# Theme Completion Plan: `ecommerce/fashion`

**Priority:** #8 — Strong editorial identity; full cart/checkout flow already wired
**Theme path:** `apps/storefront/src/themes/ecommerce/fashion/`
**Audit score:** 8/10 — feature-complete, but `ProductPage.tsx` is almost entirely inline styles

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, CartPage, CheckoutPage, CheckoutConfirmationPage, CheckoutConfirmPage
- Components: RunwayHeader (hamburger + CMS nav), AtelierFooter, EditorialLookCard, TrendHUD
- Live API integration in Page.tsx with demo fallback (`FALLBACK_COLLECTION`) and `CatalogSyncAlert`
- `useThemeContent` + `useThemeMedia` for hero (eyebrow, title, CTA, image), collection, philosophy quote, header brand/season, footer brand/description
- Full cart + checkout flow delegating to shared `EcommerceCartPage`, `EcommerceCheckoutPage`, etc.
- ProductPage: gallery thumbnails with active switching, size selector, bespoke fitting form with localStorage, add-to-cart, tab panel (Details / Reviews / Care), suggested looks section
- Skeleton loading on homepage collection grid
- 792 CSS lines

---

## Gaps & Issues to Fix

### 1. `ProductPage.tsx` — Extract Inline Styles (Primary Work Item)

Almost every element in `ProductPage.tsx` uses `style={{...}}` directly. The shared cart/checkout pages use `classPrefix="ef"` — all `ef-` CSS is in `styles.css`. The product detail page needs the same treatment.

**Loading state (lines 266–283)**

```tsx
<div style={{ minHeight: '80vh', display: 'flex', ... }}>
  <style dangerouslySetInnerHTML={{ __html: `@keyframes efSpinnerRotate { ... } .ef-loading-spinner { ... }` }} />
  <div className="ef-loading-spinner" />
  <div className="ef-mono" style={{ marginTop: '2.5rem', opacity: 0.5 }}>LOADING_ATELIER_NODE</div>
</div>
```

- [ ] Move `@keyframes efSpinnerRotate` and `.ef-loading-spinner` to `styles.css` — remove `<style dangerouslySetInnerHTML>`
- [ ] Create `.ef-detail-loading` wrapper class; add `.ef-detail-loading-label` for the mono label

**Not-found state (lines 288–293)**

```tsx
<div style={{ textAlign: 'center', padding: '8rem 2rem' }}>
  <h2 style={{ fontFamily: 'var(--ef-serif)', fontSize: '2rem' }}>Garment not found</h2>
  <p style={{ opacity: 0.6, margin: '1rem 0 2rem' }}>...</p>
  <a ... style={{ textDecoration: 'none' }}>Browse lookbook</a>
</div>
```

- [ ] `.ef-detail-notfound`, `.ef-detail-notfound h2`, `.ef-detail-notfound p`

**Back-link (lines 319–337)**

Full inline style on `<a>` tag (fontFamily, fontWeight, fontSize, letterSpacing, textTransform, display, alignItems, gap, color, textDecoration).

- [ ] `.ef-detail-back`

**Product detail grid (line 340)**

```tsx
<section className="ef-section" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '8rem', paddingTop: '2rem', paddingBottom: '10rem' }}>
```

- [ ] Move grid columns, gap, and padding into `.ef-detail-grid` (rename from `ef-section` or add a modifier)

**Main image block (lines 344–363)**

| Element | Target class |
|---|---|
| Image container div | `.ef-detail-media` |
| `<img>` inside | `.ef-detail-media img` |
| Atelier number badge | `.ef-detail-atelier-badge` |

**Specs blueprint block (lines 380–402)**

| Element | Target class |
|---|---|
| Section wrapper | `.ef-detail-specs-section` |
| `<h3>` "Atelier Garment Blueprint" | `.ef-detail-specs-title` |
| Specs grid | `.ef-detail-specs-grid` |
| Each spec label | `.ef-detail-spec-label` |
| Each spec value | `.ef-detail-spec-value` |

**Right column panel (lines 407–648)**

| Element | Target class |
|---|---|
| Sticky wrapper | `.ef-detail-info-panel` |
| Catalog mono label (line 411) | `.ef-detail-catalog-label` |
| `<h1>` title (lines 412–413) | `.ef-detail-title` |
| Price display (lines 417–426) | `.ef-detail-price` |
| Description `<p>` (lines 430–436) | `.ef-detail-desc` |
| Add-to-cart button wrapper | already uses `ef-btn-primary`; add bottom margin via `.ef-detail-cart-btn` |
| Cart notice `<p>` (lines 449–453) | `.ef-detail-cart-notice`; cart link via `.ef-detail-cart-link` |
| Size section wrapper | `.ef-detail-size-section` |
| Size label | `.ef-detail-size-label` |
| Size button row | `.ef-detail-size-row` |
| Each size button | `.ef-size-btn`; active state `.ef-size-btn-active` |
| Bespoke section wrapper | `.ef-detail-bespoke` |
| Bespoke header row (dot + h3) | `.ef-detail-bespoke-header` |
| Success state block | `.ef-detail-bespoke-success` |
| Success icon | `.ef-detail-bespoke-success-icon` |
| Success heading + body | `.ef-detail-bespoke-success h4`, `.ef-detail-bespoke-success p` |
| Bespoke form | `.ef-bespoke-form` |
| Measurements grid | `.ef-bespoke-measurements` |
| Each input label | `.ef-bespoke-label` |
| Each input / textarea | `.ef-bespoke-input` (add to `styles.css`) |
| Submit button wrapper | already `ef-btn-primary`; margin via `.ef-bespoke-submit` |
| Form error | `.ef-bespoke-error` |

**Suggested looks section (lines 701–721)**

| Element | Target class |
|---|---|
| Section wrapper | `.ef-detail-suggestions` |
| Header row (flex, space-between) | `.ef-detail-suggestions-header` |
| Eyebrow mono label | `.ef-detail-suggestions-eyebrow` |
| Heading h2 | `.ef-detail-suggestions-title` |
| Season label (opacity 0.3) | `.ef-detail-suggestions-season` |
| Grid | `.ef-detail-suggestions-grid` |
| Each link wrapper | `.ef-detail-suggestions-link` |

- [ ] Extract all inline styles in `ProductPage.tsx` into the CSS classes above in `styles.css`

---

### 2. `ProductPage.tsx` — `dangerouslySetInnerHTML` Spinner

The loading state injects `@keyframes efSpinnerRotate` and `.ef-loading-spinner` via `dangerouslySetInnerHTML` (lines 267–279).

- [ ] Move both rules into `styles.css`
- [ ] Remove the `<style dangerouslySetInnerHTML>` block entirely

---

### 3. `ProductPage.tsx` — Hardcoded `SUGGESTED_LOOKS` Array

Lines 114–118:

```ts
const SUGGESTED_LOOKS = [
  { title: "Silk Drape Blazer", price: "$1,250.00", slug: "silk-drape-blazer", image: "/themes/ecommerce/fashion/11.webp" },
  ...
];
```

These are 3 hardcoded demo products. In a real store they would show wrong items.

- [ ] Replace with the first 3 items from `products` state (already loaded by the useEffect)
- [ ] Fall back to the current hardcoded array only when `useFallback` is true and `products` is empty

---

### 4. `Page.tsx` — Hardcoded Strings

**Hero editorial sidebar (lines 169–183)**

```tsx
<div className="ef-mono">Runway note</div>
<p>A calm editorial storefront for statement silhouettes...</p>
<strong>Limited accessories</strong>
<strong>Ready-to-wear edit</strong>
<a ...>View full archive</a>
```

- [ ] Wrap in `useThemeContent`: `hero.sidebar_label`, `hero.sidebar_note`, `hero.side_image_1_note`, `hero.side_image_2_note`, `hero.archive_link_label`

**TrendHUD metrics (lines 190–193)**

```tsx
<TrendHUD label="Featured edit" value="03" />
<TrendHUD label="Returns" value="30D" />
<TrendHUD label="Shipping" value="Express" />
```

Three of four HUD tiles are hardcoded. The first (`productCountLabel`) is already API-driven.

- [ ] Wrap in `useThemeContent`: `metrics.featured_label`, `metrics.featured_value`, `metrics.returns_label`, `metrics.returns_value`, `metrics.shipping_label`, `metrics.shipping_value`

---

### 5. `AtelierFooter` — Hardcoded Content

**Copyright line (line 147)**

```tsx
<div className="ef-mono">2026 Sellio Atelier. All rights reserved.</div>
```

Hardcoded year.

- [ ] Replace with `useThemeContent('footer.copyright', '')` and render `{copyright || \`© ${new Date().getFullYear()}. All rights reserved.\`}`

**Footer link columns (lines 9–33)**

The `footerGroups` array defines 3 hardcoded navigation columns (Collections, Atelier, Client care). These don't pull from the CMS menu system, so a store owner can't customise them.

- [ ] Replace with `FooterMenuColumn` components (same pattern used in `VoltageFooter` for `events/music`) for `footer_column_1`, `footer_column_2`, `footer_column_3`, with the current `footerGroups` data as fallbacks

---

### 6. `EditorialLookCard` — Hardcoded "Ready to wear" Label

`components/index.tsx` line 99:

```tsx
<div className="ef-mono">Ready to wear</div>
```

This category label is hardcoded in the card and used on every product on the homepage and in the suggested looks section.

- [ ] Accept an optional `categoryLabel` prop with default `'Ready to wear'`
- [ ] In `Page.tsx`, pass the product's actual category name when available

---

### 7. Accessibility

**`RunwayHeader` — hamburger missing `aria-expanded`** (line 56)

```tsx
<button aria-label="Toggle Navigation" ...>
```

- [ ] Add `aria-expanded={isOpen}` to the hamburger button

**`ProductPage.tsx` — form labels not associated with inputs**

All six form inputs (height, chest, waist, name, email, notes) use `<label className="ef-mono" style={{...}}>` rendered as display text above the input, but they have no `htmlFor` and the inputs have no `id` attributes.

- [ ] Add `id` to each input and `htmlFor` to each label: `height-input`, `chest-input`, `waist-input`, `name-input`, `email-input`, `notes-input`

**`ProductPage.tsx` — tab panel role missing**

Tab buttons have `role="tab"` and `aria-selected`, but the content div (`.ef-detail-tab-panel`) has no `role="tabpanel"`.

- [ ] Add `role="tabpanel"` to `.ef-detail-tab-panel`; add `aria-labelledby` pointing to the active tab button

---

### 8. Responsive Review (Test at 375px, 768px, 1280px)

The ProductPage is almost entirely inline-styled, so these layouts will need explicit breakpoints once extracted to CSS:

- [ ] **Product detail grid** (1.1fr / 0.9fr): must stack to single column on mobile — image above, info below
- [ ] **Bespoke measurements row** (repeat(3, 1fr)): must collapse to single column on mobile
- [ ] **Suggested looks grid** (repeat(3, 1fr)): 1 column on mobile, 2 on tablet
- [ ] **Size button row**: should wrap on very narrow widths
- [ ] **Homepage collection grid** (`.ef-lookbook-grid`): verify 1 column on 375px
- [ ] **TrendHUD metrics grid**: verify 2×2 or single row on mobile
- [ ] **Footer**: verify 4-column footer collapses correctly

---

### 9. Cart / Checkout Flow — Verify Shared CSS Coverage

CartPage, CheckoutPage, CheckoutConfirmationPage, and CheckoutConfirmPage all use `classPrefix="ef"`. The shared components render `ef-` prefixed class names.

- [ ] Confirm `styles.css` contains all `ef-cart-*`, `ef-checkout-*`, `ef-confirm-*` class definitions used by the shared components
- [ ] Walk the full flow: ProductPage → CartPage → CheckoutPage → CheckoutConfirmationPage → CheckoutConfirmPage
- [ ] Verify the "Add to cart" → "View cart" → "Checkout" path works end-to-end in demo mode

---

### 10. SEO Metadata

- [ ] Verify the Next.js route exports a `metadata` object with `title` and `description`
- [ ] `ProductPage` should use `generateMetadata` to populate product title and price in the page `<title>`
- [ ] `ExplorePage` should have a descriptive title

---

## Completion Checklist Summary

```
INLINE STYLES → CSS CLASSES (primary work — ProductPage.tsx)
  [ ] Loading state: .ef-detail-loading, remove dangerouslySetInnerHTML spinner
  [ ] Not-found state: .ef-detail-notfound
  [ ] Back-link: .ef-detail-back
  [ ] Detail grid: .ef-detail-grid (columns + gap)
  [ ] Media block: .ef-detail-media, badge
  [ ] Specs section: .ef-detail-specs-section, title, grid, label, value
  [ ] Info panel: sticky wrapper, catalog label, title, price, desc
  [ ] Cart button + notice + link
  [ ] Size section: wrapper, label, row, .ef-size-btn + active state
  [ ] Bespoke section: wrapper, header, success state, form, measurements grid,
      labels, inputs, submit, error
  [ ] Suggestions section: wrapper, header, eyebrow, title, season, grid, links

HARDCODED STRINGS → useThemeContent
  [ ] Page.tsx: hero sidebar label, sidebar note, 2 editorial notes, archive link
  [ ] Page.tsx: 3 × TrendHUD (label + value)
  [ ] EditorialLookCard: accept categoryLabel prop

FOOTER
  [ ] Copyright → dynamic year with useThemeContent fallback
  [ ] Footer link columns → FooterMenuColumn with current data as fallback

SUGGESTED LOOKS
  [ ] Use first 3 API products; hardcoded array only in demo fallback

ACCESSIBILITY
  [ ] RunwayHeader: add aria-expanded={isOpen} to hamburger
  [ ] ProductPage form: add id + htmlFor to all 6 label/input pairs
  [ ] ProductPage tab panel: add role="tabpanel" + aria-labelledby

RESPONSIVE (after CSS extraction)
  [ ] Product detail grid → single column on mobile
  [ ] Bespoke measurements → single column on mobile
  [ ] Suggested looks → 1 col mobile, 2 col tablet
  [ ] Size buttons → wrap on narrow
  [ ] Homepage collection + metrics grid → verify

CART/CHECKOUT FLOW
  [ ] Confirm ef-* CSS covers shared cart/checkout class names
  [ ] Walk full purchase flow in demo mode

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (product title + price)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good structure; 5 hardcoded strings + 3 TrendHUD values to wrap |
| `components/index.tsx` | Header, Footer, cards | Footer columns hardcoded; copyright year; EditorialLookCard category hardcoded |
| `ProductPage.tsx` | Product detail | Feature-complete; nearly all layout is inline styles; `dangerouslySetInnerHTML` spinner; hardcoded SUGGESTED_LOOKS |
| `ExplorePage.tsx` | Catalog | Likely delegates to shared — verify |
| `CartPage.tsx` | Cart | Delegates to shared with `classPrefix="ef"` |
| `CheckoutPage.tsx` | Checkout | Delegates to shared with `classPrefix="ef"` |
| `CheckoutConfirmationPage.tsx` | Order review | Delegates to shared |
| `CheckoutConfirmPage.tsx` | Order confirmed | Delegates to shared |
| `Layout.tsx` | Theme shell | Minimal — correct |
| `styles.css` | 792 lines | Will grow significantly after ProductPage extraction |
