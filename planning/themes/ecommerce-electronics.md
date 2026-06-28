# Theme Completion Plan: `ecommerce/electronics`

**Priority:** #20 — PC components / gaming hardware; dark tech aesthetic is solid
**Theme path:** `apps/storefront/src/themes/ecommerce/electronics/`
**Audit score:** 6.5/10 — distinctive visual identity and functional mini cart; significant code quality gaps: style tag injection, fallback data in Page component, heavy footer inline styles, missing hamburger `aria-expanded`, no spec comparison table

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, CartPage, CheckoutPage, Layout
- Components: ElectronicsHeader (hamburger, mini cart panel), ProductCard, SpecFeature, ElectronicsFooter (FooterMenuColumn × 2 ✓)
- Live API via `fetchProductsCatalog` + `resolveProductsFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `useThemeContent` for: hero badge/title/description/CTAs, trending title, promo title/description/CTA, peripherals title, footer brand/description/newsletter fields/copyright
- `useThemeMedia` for hero image and promo image
- **Mini cart panel**: `role="dialog"` ✓, `aria-modal="true"` ✓, `aria-expanded={cartOpen}` ✓, item count + remove ✓
- Footer newsletter: `useThemeContent` keys for all labels ✓
- `CatalogSyncAlert` for both demo and production errors ✓

---

## Gaps & Issues to Fix

### 1. `<style>` Tag Injection in Page.tsx (Lines 132–139)

```jsx
<div className="ecommerce-electronics-wrapper">
  <style>{`
    @keyframes elPulse { ... }
    .el-pulse { animation: elPulse 1.5s ease-in-out infinite; }
  `}</style>
```

This injects a `<style>` tag into the React tree — same problem as `dangerouslySetInnerHTML`, causing SSR/hydration mismatches and global style pollution.

- [ ] Move `@keyframes elPulse` and `.el-pulse` to `styles.css`
- [ ] Remove the `<style>{...}</style>` element from Page.tsx JSX
- [ ] Remove the outer `<div className="ecommerce-electronics-wrapper">` if its only purpose was to scope the injected style

---

### 2. Fallback Data in Page.tsx — Move to `fallback-data.ts`

`FALLBACK_TRENDING_PRODUCTS` (lines 11–16) and `FALLBACK_PERIPHERAL_PRODUCTS` (lines 18–23) are hardcoded in the Page component file. The pattern requires fallback data to live in `fallback-data.ts`.

- [ ] Create `apps/storefront/src/themes/ecommerce/electronics/fallback-data.ts`
- [ ] Move both arrays there as named exports
- [ ] Import from `./fallback-data` in Page.tsx

---

### 3. `CATEGORY_LABELS` Round-Robin Workaround — Fix

Line 25: `const CATEGORY_LABELS = ["Graphics Cards", "Processors", ...]` is used as `CATEGORY_LABELS[index % CATEGORY_LABELS.length]` to fake a category label for API products. This assigns categories by position, not by actual product data.

- [ ] Replace `const categoryStr = CATEGORY_LABELS[index % CATEGORY_LABELS.length]` with `const categoryStr = p.category?.title || p.tags?.[0] || 'Electronics'` in `mapApiProductToFrontend`
- [ ] Remove the `CATEGORY_LABELS` constant

---

### 4. Primary Missing Feature: Spec Comparison Panel

The main plan calls for a "spec comparison table." For electronics, this is a side-by-side component spec breakdown — e.g., comparing 3 GPUs or 3 CPUs by VRAM, clock speed, TDP, socket, and price.

**Implementation (CMS-driven demo section):**

- [ ] Create `SpecComparePanel` component
- [ ] Accept 3 product slots, each reading from `useThemeContent`:
  - `compare.product_1_name`, `compare.product_1_price`, and spec rows `compare.product_1_spec_N_value` × 6
  - Same keys for products 2 and 3
  - Row labels: `compare.spec_1_label` through `compare.spec_6_label`
- [ ] Render as an HTML `<table>` with `role="table"`, spec labels in first column, values in columns 2–4
- [ ] Default spec labels: `'VRAM'`, `'Clock Speed'`, `'TDP'`, `'Interface'`, `'Memory Type'`, `'Price'`
- [ ] Default product names: three GPUs from the fallback product list
- [ ] Add a "compare" section ID below the promo banner in Page.tsx
- [ ] Add `.el-compare-panel`, `.el-compare-table`, `.el-compare-col-header`, `.el-compare-row`, `.el-compare-td`, `.el-compare-highlight` to `styles.css`

---

### 5. `ElectronicsHeader` — Missing `aria-expanded`

Lines 39–48: Hamburger button is missing `aria-expanded`:

```tsx
<button
  className={`el-hamburger ${isOpen ? 'el-hamburger-open' : ''}`}
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Toggle Navigation"
  type="button"
>
```

- [ ] Add `aria-expanded={isOpen}`

---

### 6. `SpecFeature` — Inline Styles + Emoji Icon Accessibility

**Inline styles (lines 221–222):**

```tsx
<h4 className="el-tech-font" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h4>
<p style={{ color: 'var(--el-text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>{desc}</p>
```

- [ ] Add `.el-spec-title { font-size: 1.25rem; margin-bottom: 0.5rem; }` to `styles.css`; replace inline `style` with `className="el-tech-font el-spec-title"`
- [ ] Add `.el-spec-desc { color: var(--el-text-muted); line-height: 1.6; font-size: 0.95rem; }` to `styles.css`; replace inline `style` on `<p>`

**Emoji icons (lines 168–170, via `SpecFeature icon` prop):**

The `icon` prop value (`⚡`, `🛡️`, `🚀`) is rendered in `<div className="el-spec-icon">{icon}</div>` with no accessibility handling:

- [ ] Add `aria-hidden="true"` to the `.el-spec-icon` div
- [ ] Or wrap emoji in `<span aria-hidden="true">{icon}</span>` inside the component

**Hardcoded SpecFeature content in Page.tsx (lines 168–170):**

```tsx
<SpecFeature icon="⚡" title="Overclocked Out-of-Box" desc="Every component is stress-tested..." />
<SpecFeature icon="🛡️" title="3-Year Warranty Plus" desc="Extended coverage..." />
<SpecFeature icon="🚀" title="Same-Day Dispatch" desc="Order by 4 PM EST..." />
```

- [ ] Wrap all strings in `useThemeContent`:
  - `spec.1.title`, `spec.1.desc`, `spec.2.title`, `spec.2.desc`, `spec.3.title`, `spec.3.desc`
  - Icons can remain hardcoded (they're visual decoration, not content)

---

### 7. `Page.tsx` — Inline Styles to Extract

**Hero badge (line 147):**
```tsx
style={{ position: 'relative', top: 0, left: 0, display: 'inline-block', marginBottom: '1.5rem' }}
```
→ `.el-badge--hero { display: inline-block; margin-bottom: 1.5rem; }` (the `position/top/left` with zero values are no-ops)

**Hero image `<img>` (line 162):**
```tsx
style={{ width: '100%', filter: 'drop-shadow(0 0 30px rgba(0, 229, 255, 0.3))' }}
```
→ `.el-hero-img { width: 100%; filter: drop-shadow(0 0 30px rgba(0, 229, 255, 0.3)); }` in `styles.css`

**Promo background (line 218):** `style={{ backgroundImage: \`url(${promoImage})\` }}` — dynamic URL, must stay inline ✓

**API error alert wrappers (lines 174, 179):**
```tsx
<div style={{ margin: '0 5% 2rem' }}>
```
→ `.el-alert-slot { margin: 0 5% 2rem; }` in `styles.css`

**Loading skeleton divs (lines 191–196, 228–234):** Each skeleton card has 6 fully inline skeleton elements × 2 sections = 12 inline skeleton divs total.

→ Add CSS classes:
- `.el-skeleton-card-img { height: 200px; ... }`
- `.el-skeleton-card-category { height: 12px; width: 40%; ... }`
- `.el-skeleton-card-title { height: 20px; width: 80%; ... }`
- `.el-skeleton-card-footer { display: flex; justify-content: space-between; ... }`
- `.el-skeleton-price { height: 24px; width: 30%; ... }`
- `.el-skeleton-add-btn { height: 40px; width: 40px; ... }`

**Empty state (lines 203–206):**

```tsx
<div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', border: '...', borderRadius: '8px' }}>
  <p style={{ color: 'var(--el-text-muted)' }}>No products available yet.</p>
  <a href={...} className="el-btn el-btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
```

→ `.el-empty-state`, `.el-empty-desc` CSS classes; adjust `.el-btn` display/margin in context

**Empty state hardcoded text:**

- [ ] `'No products available yet. Publish inventory in the admin.'` → `useThemeContent('empty.message', '...')`
- [ ] `'Browse catalog'` → `useThemeContent('empty.cta_label', 'Browse catalog')`

---

### 8. `ElectronicsFooter` — Heavy Inline Styles + Copyright + Newsletter

**Footer outer grid (line 240):**
```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
```
→ `.el-footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-bottom: 3rem; }`

**Footer logo link (line 242):** `style={{ marginBottom: '1rem', display: 'inline-block' }}` → `.el-footer-logo { margin-bottom: 1rem; display: inline-block; }`

**Footer description `<p>` (line 246):** `style={{ color: '...', fontSize: '0.9rem', lineHeight: 1.6 }}` → `.el-footer-desc`

**FooterMenuColumn `titleStyle` (lines 252, 259):**
```tsx
titleStyle={{ marginBottom: '1.5rem', color: 'white' }}
```
These already use `titleClassName="el-tech-font"` but still pass `titleStyle`. 
- [ ] Add `.el-footer-col-title { margin-bottom: 1.5rem; color: white; }` to `styles.css`
- [ ] Change to `titleClassName="el-tech-font el-footer-col-title"` on both columns; remove `titleStyle`

**Newsletter section heading h5 (line 264):** `style={{ marginBottom: '1.5rem', color: 'white' }}` → `className="el-tech-font el-footer-col-title"`

**Newsletter description (line 265):** `style={{ color: '...', fontSize: '0.9rem', marginBottom: '1rem' }}` → `.el-footer-newsletter-desc`

**Newsletter email input (line 267):** `style={{ background: ..., border: ..., padding: ..., color: ..., ... }}` → `.el-newsletter-input`

**Newsletter subscribe button (line 268):** `style={{ background: ..., border: ..., padding: ..., ... }}` → `.el-newsletter-btn`

**Newsletter form wrapper (line 266):** `style={{ display: 'flex' }}` → `.el-newsletter-form { display: flex; }`

**Footer bottom (line 272):** `style={{ textAlign: ..., paddingTop: ..., borderTop: ..., color: ..., fontSize: ... }}` → `.el-footer-bottom`

**Copyright year (line 236):**
```ts
const copyright = useThemeContent('footer.copyright', '2026 Sellio. All rights reserved.');
```
Two bugs: hardcoded year and missing `©` symbol in default.
- [ ] Change default to `''`
- [ ] Render: `{copyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

**Newsletter form accessibility (lines 266–268):**
- [ ] Wrap in `<form onSubmit={handleSubscribe}>`
- [ ] Add `aria-label="Email address"` or `<label htmlFor="el-newsletter-email">` + `id="el-newsletter-email"` on input
- [ ] Add `type="submit"` on subscribe button
- [ ] Add `[email, setEmail]` and `[subscribed, setSubscribed]` state; on success show `<p role="status">Subscribed! Check your inbox.</p>`

---

### 9. `Page.tsx` — Other Hardcoded Strings

| String | Suggested key |
|---|---|
| `'View Specs'` hero secondary CTA links to `/explore` — misleading label | `hero.secondary_cta_label` (already from useThemeContent — just update default or redirect) |
| Promo section: none hardcoded (all useThemeContent) ✓ | — |

---

### 10. Search Bar — Cosmetic Issue

Lines 34–36: The header search bar renders `<span aria-hidden="true">Search</span>` as a decorative label above the input. This is unusual — the `placeholder` prop already provides the input hint. The visible "Search" span is redundant.

- [ ] Remove the `<span aria-hidden="true">Search</span>` and keep only the `<input>` with `aria-label="Search"` (or retain a visible `<label>`)

---

### 11. `ProductPage.tsx` — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check for inline styles, add-to-cart flow, spec display, and image gallery

---

### 12. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Header**: verify mini cart panel is full-screen overlay on mobile; search bar remains usable
- [ ] **Hero section** (`.el-hero`): image + text side by side → verify text appears above image on mobile; image fills width
- [ ] **Spec features row** (`.el-spec-row`): 3 items in a row → verify wrap or stack on mobile
- [ ] **Product grid** (`.el-grid`): verify 1–2 columns on mobile
- [ ] **Promo section** (`.el-promo-section`): verify readable at 375px; background image position
- [ ] **Spec comparison table** (new): sticky spec label column on mobile
- [ ] **Footer grid**: verify `auto-fit minmax(200px)` collapses to 1 column on mobile; newsletter input + button stay horizontal or stack

---

### 13. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using product title and price
- [ ] `ExplorePage`: add title ("Browse Components & Peripherals")

---

## Completion Checklist Summary

```
STYLE INJECTION REMOVAL
  [ ] Move @keyframes elPulse + .el-pulse to styles.css
  [ ] Remove <style> tag from Page.tsx JSX
  [ ] Remove outer wrapper div if no longer needed

FALLBACK DATA
  [ ] Create fallback-data.ts; move FALLBACK_TRENDING + FALLBACK_PERIPHERAL there
  [ ] Fix CATEGORY_LABELS: use p.category?.title from API

NEW FEATURE
  [ ] SpecComparePanel: 3-column spec comparison table
  [ ] useThemeContent keys: compare.spec_N_label × 6, product M spec N × 3 products
  [ ] styles.css: .el-compare-panel + table classes

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger button
  [ ] Remove redundant <span aria-hidden="true">Search</span>

SPECFEATURE
  [ ] Inline h4 + p styles → CSS classes
  [ ] Emoji icon div: add aria-hidden="true"
  [ ] Hardcoded title + desc × 3 → useThemeContent

PAGE.TSX INLINE STYLES → CSS CLASSES
  [ ] Hero badge → .el-badge--hero CSS
  [ ] Hero img → .el-hero-img CSS
  [ ] Alert slot wrappers → .el-alert-slot CSS
  [ ] Loading skeleton divs × 12 → CSS classes
  [ ] Empty state → .el-empty-state CSS
  [ ] Empty state text + CTA → useThemeContent

FOOTER
  [ ] Footer grid → .el-footer-grid CSS
  [ ] Footer logo link → .el-footer-logo CSS
  [ ] Footer description → .el-footer-desc CSS
  [ ] FooterMenuColumn titleStyle → titleClassName="el-tech-font el-footer-col-title"
  [ ] Newsletter: desc, input, button, form wrapper → CSS classes
  [ ] Footer bottom → .el-footer-bottom CSS
  [ ] Copyright year: dynamic fallback; add © symbol

NEWSLETTER FORM ACCESSIBILITY
  [ ] Wrap in <form onSubmit>
  [ ] Add aria-label on email input
  [ ] Button type="submit"
  [ ] Add success state

PAGES NOT YET AUDITED
  [ ] ProductPage.tsx

RESPONSIVE
  [ ] Header + mini cart: full-screen on mobile
  [ ] Hero: stack on mobile
  [ ] Spec features row: wrap on mobile
  [ ] Product grid: 1-2 col mobile
  [ ] Compare table: sticky label col on mobile
  [ ] Footer grid: collapse on mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + price)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Style tag injection; fallback data in file; CATEGORY_LABELS workaround; loading skeletons + empty state inline |
| `components/index.tsx` — ElectronicsHeader | Site nav + mini cart | Mini cart ✓; hamburger missing aria-expanded; search span redundant |
| `components/index.tsx` — ProductCard | Product card | Clean — no inline styles ✓ |
| `components/index.tsx` — SpecFeature | Feature callout row | Inline h4 + p; emoji no aria-hidden; titles hardcoded |
| `components/index.tsx` — ElectronicsFooter | Footer | FooterMenuColumn × 2 ✓; brand section + newsletter all inline; copyright year bug |
| `ProductPage.tsx` | Product detail | Not audited |
| `ExplorePage.tsx` | Product browse | Not audited |
| `fallback-data.ts` | Fallback data | Does not exist yet — needs creation |
| `styles.css` | Styles | Will grow significantly after extraction |
