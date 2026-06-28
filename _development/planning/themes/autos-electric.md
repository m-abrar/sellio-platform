# Theme Completion Plan: `autos/electric`

**Priority:** #25 — EV marketplace; neon green/blue dark theme; EV compare table already implemented
**Theme path:** `apps/storefront/src/themes/autos/electric/`
**Audit score:** 5/10 — Core EV UI is there (filter bar, compare table, charging section, sustainability grid); held back by `<style jsx>` injection, dead fallback code, heavy inline styles, and brand-hardcoded EV spec logic

---

## What's Already Done

- `ElectricHeader`: hamburger toggle, `MenuNav`, `MenuActionButtons`
- `EVCard` grid with EV-specific specs (range, battery, charging speed)
- Full EV compare table (feature column + up to 3 EV columns dynamically built from `compareList`)
- Filter bar: brand (from API), range, price, charging speed (4 select dropdowns)
- Charging network section with checklist
- Sustainability `IconBox` grid
- `resolveVehiclesFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `CatalogSyncAlert` ✓
- `ElectricFooter` with `FooterMenuColumn × 3` ✓
- `useThemeContent` for: hero title/highlight/description/CTAs, filters title, collection title/highlight, empty state × 3, compare title/highlight, charging title/highlight/description/CTA, sustainability title/highlight

---

## Gaps & Issues to Fix

### 1. Primary Issue: EV Spec Data Quality

**`translateVehicleToEV` brand-matching (lines 43–55):** Assigns hardcoded specs by matching brand name in title string:
```ts
if (car.title.toLowerCase().includes('tesla')) { range = "330 Miles"; battery = "75 kWh"; charge = "250 kW"; }
else if (car.title.toLowerCase().includes('rivian')) { ... }
else if (car.title.toLowerCase().includes('lucid')) { ... }
```
This creates brittle brand-specific logic and ships with real brand names baked in.

- [ ] Replace brand-name matching with deterministic generic logic (use `car.id` + modular arithmetic for variation, already done for the else branch)
- [ ] Use `car.specs?.range`, `car.specs?.battery_capacity`, `car.specs?.charge_rate` from Vehicle spec fields when available; fall back to deterministic defaults
- [ ] Remove references to specific manufacturer names from computation logic

**`FALLBACK_CLASSIFIEDS` (lines 27–32): Dead code — never used**

The local array with Tesla/Rivian/Kia/Lucid is declared but the actual fallback goes through `resolveVehiclesFailure(allowDemo, 'electric')` (line 130). The constant is dead.
- [ ] Delete `FALLBACK_CLASSIFIEDS` (lines 27–32)

**Map placeholder text (line 366):**
```tsx
<span style={{ fontSize: '3rem' }}>🗺️ Map Placeholder</span>
```
This ships as visible placeholder text.
- [ ] Replace with a static map embed placeholder styled via CSS, with `aria-hidden="true"` on the icon span
- [ ] Add `useThemeContent('charging.map_caption', '')` for any caption overlay

---

### 2. `<style jsx global>` Anti-pattern

`Page.tsx` lines 390–394:
```tsx
<style jsx global>{`
  @keyframes ev-shimmer-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .45; }
  }
`}</style>
```
- [ ] Move `@keyframes ev-shimmer-pulse` to `styles.css`
- [ ] Remove `<style jsx global>` block from Page.tsx

---

### 3. `ElectricHeader` — Missing `aria-expanded`

Hamburger button (lines 21–30): no `aria-expanded` attribute.
- [ ] Add `aria-expanded={isOpen}` to the hamburger `<button>`

---

### 4. `ElectricFooter` — Inline Styles + Copyright Bug

**Footer copyright bug (line 95):**
```ts
useThemeContent('footer.copyright', '2026 Sellio. All rights reserved.')
```
Missing `©` symbol AND hardcoded year. The component then renders `&copy; {footerCopyright}` which prepends `©` from the HTML entity — but when a CMS admin customizes the default string, they'll see `© 2026` from the entity + their custom string. Pattern is confusing.
- [ ] Change default to `''`; render `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

**Footer brand section grid (line 99):**
```tsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
```
→ `.ev-footer-grid` CSS class

**Logo link (line 101):** `style={{ display: 'block', marginBottom: '1rem' }}` → add to `.ev-footer-logo`

**Footer description (line 104):** `style={{ fontSize: '0.9rem', opacity: 0.75, marginBottom: '1.5rem' }}` → `.ev-footer-desc`

**Footer bottom (line 137):**
```tsx
<div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', opacity: 0.5 }}>
```
→ `.ev-footer-bottom` CSS class

**FooterMenuColumn × 3 (lines 115–135):** All use `titleStyle={{ marginBottom: '1rem', fontWeight: 600 }}` → add `margin-bottom: 1rem; font-weight: 600;` to `.ev-text-green` in footer context, or add `.ev-footer-col-title` class

---

### 5. `EVCard` — Inline Styles + Accessibility

**Redundant `onClick`:** Card outer div has `onClick={onClick}` but Page.tsx wraps each card in `<a href={...}>`. The `onClick` prop is never passed from Page.tsx — `onClick` is undefined. Remove from component interface.

**Emoji icons (lines 67–76):** `⚡`, `🔋`, `🔌` spans have no `aria-hidden="true"`
- [ ] Add `aria-hidden="true"` to all three emoji spans

**`EVCard` body inline styles (lines 67–76):** Three `ev-spec` rows each have an inline-styled icon span:
```tsx
<span className="ev-text-green" style={{ marginRight: '8px' }}>⚡</span>
```
- [ ] Add `margin-right: 8px` to `.ev-spec .ev-text-green` in CSS; remove `style={{ marginRight: '8px' }}`

---

### 6. `IconBox` — Inline Styles + Hardcoded Content

**Component (lines 82–88):** `<h5>` has mixed `className + style`; `<p>` inline:
```tsx
<h5 className="ev-text-green" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h5>
<p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}>{desc}</p>
```
- [ ] Add `margin-bottom: 0.5rem; font-weight: 600;` to `.ev-icon-box h5` in CSS
- [ ] Add `opacity: 0.7; font-size: 0.9rem; margin: 0;` to `.ev-icon-box p` in CSS

**Sustainability section hardcoded (Page.tsx lines 382–386):**
```tsx
<IconBox icon="🌱" title="Zero Emissions" desc="Contribute to a cleaner planet..." />
<IconBox icon="💻" title="Smart Tech Integration" desc="Over-the-air updates..." />
<IconBox icon="💰" title="Lower Costs" desc="Significantly reduced fuel..." />
<IconBox icon="☀️" title="Renewable Charging" desc="Options to filter..." />
```
All 4 titles and descriptions → `useThemeContent`; icons → `useThemeContent` (emoji) or CSS:

| Suggested key | Default |
|---|---|
| `sustainability.item_1_icon` | `'🌱'` |
| `sustainability.item_1_title` | `'Zero Emissions'` |
| `sustainability.item_1_desc` | `'Contribute to a cleaner planet with every mile driven.'` |
| ... × 4 | |

---

### 7. `Page.tsx` — Inline Styles

**Hero description `p` (line 192):** `style={{ fontSize, marginBottom, opacity, lineHeight }}` → `.ev-hero-description`

**Hero CTA row `div` (line 195):** `style={{ display, gap }}` → `.ev-hero-cta-row`

**Hero CTA buttons (lines 196–197):** `style={{ padding, fontSize }}` on both → `.ev-hero-cta-btn` CSS modifier

**Alert slots (lines 203, 208):** `style={{ margin: '2rem 5% 0' }}` → `.ev-alert-slot` CSS

**Filter title wrapper (line 215):** `style={{ width: '100%', marginBottom: '1rem' }}` → `.ev-filter-title-row`

**Filter section h2 (line 216):** `style={{ fontSize, fontWeight }}` → `.ev-filter-title`

**EV card link wrappers (line 295):** `style={{ textDecoration, color, display }}` → `.ev-card-link`

**Skeleton cards (lines 274–283):** 4 cards × 6 inline elements each. All → CSS classes:
- `.ev-card-skeleton { height: 420px; animation: ev-shimmer-pulse 1.5s infinite; }` (already will have keyframes moved)
- `.ev-skeleton-img { height: 250px; background-color: rgba(255,255,255,0.05); }`
- `.ev-skeleton-body { padding: 1.5rem; }` + `.ev-skeleton-line` variants

**Empty state (lines 286–291):** Fully inline → `.ev-empty-state`, `.ev-empty-icon`, `.ev-empty-title`, `.ev-empty-desc`

**Divider `hr` elements (lines 303, 343, 372):** All inline `style={{ borderTop, opacity, margin }}` → `.ev-divider`

**Compare section EV columns (line 327):** `style={{ borderRight: ... }}` — dynamic based on whether it's the last column. Use CSS `:last-child` selector instead:
```css
.ev-compare-col:last-child { border-right: none; }
```
- [ ] Remove inline `borderRight` from EV column divs; use CSS

**Compare section feature column (line 315):** `style={{ borderRight: '1px solid var(--ev-accent-green)' }}` → `.ev-compare-col--feature { border-right: 1px solid var(--ev-accent-green); }`

**Compare header link (line 330):** `style={{ textDecoration, color, display }}` → `.ev-compare-header-link`

**Charging section layout (line 347):** `style={{ display: grid, gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}` → `.ev-charging-grid`

**Charging title (line 349):** `style={{ textAlign: 'left', marginBottom: '1.5rem' }}` → `.ev-charging-grid .ev-section-title`

**Charging description (line 354):** `style={{ fontSize, marginBottom, lineHeight, opacity }}` → `.ev-charging-desc`

**Charging checklist wrapper (line 357):** `style={{ display, flexDirection, gap, marginBottom }}` → `.ev-charging-list`

**Charging checklist items (lines 358–360):** `style={{ display, alignItems, gap }}` → `.ev-charging-list-item`

**Hardcoded checklist text (lines 358–360):**
```tsx
<div ...><span className="ev-text-green">✓</span> Real-time availability updates</div>
<div ...><span className="ev-text-green">✓</span> Integrated payment solutions</div>
<div ...><span className="ev-text-green">✓</span> Filter by plug type (CCS, NACS, CHAdeMO)</div>
```
→ `useThemeContent('charging.feature_1_label', 'Real-time availability updates')` etc. × 3

**Map placeholder container (line 365):**
```tsx
<div style={{ aspectRatio, background, border, borderRadius, display, alignItems, justifyContent, boxShadow }}>
```
→ `.ev-map-placeholder`

---

### 8. Hardcoded Strings → `useThemeContent`

| Location | String | Suggested key |
|---|---|---|
| Filter brand select | `'Brand (All)'` | `filters.brand_default_label` |
| Filter range select | `'Range (All)'`, `'Under 320 Miles'`, `'320+ Miles'` | `filters.range_*` |
| Filter price select | `'Price (All)'` + 3 options | `filters.price_*` |
| Filter charging select | `'Charging DC Rate (All)'` + 2 options | `filters.charge_*` |
| Sustainability items × 4 | see §6 | `sustainability.item_N_*` |
| Charging checklist × 3 | see §7 | `charging.feature_N_label` |

---

### 9. ProductPage.tsx — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check for full EV spec display, charging speed, range badges
- [ ] Verify EV spec table or spec list on product page

### 10. Responsive

- [ ] Compare table at 375px: `overflow-x: auto` wrapper needed (already may exist)
- [ ] Filter bar: 4 selects at 375px — verify they stack
- [ ] Charging grid: 2-column layout → 1 column on mobile

---

## Completion Checklist Summary

```
CRITICAL BUGS
  [ ] Delete FALLBACK_CLASSIFIEDS dead code (lines 27–32)
  [ ] Move @keyframes ev-shimmer-pulse to styles.css; remove <style jsx global>
  [ ] Fix copyright: dynamic year fallback; '©' from CSS not entity confusion

PRIMARY FEATURE
  [ ] Remove brand-name matching from translateVehicleToEV; use generic deterministic logic
  [ ] Replace '🗺️ Map Placeholder' with styled placeholder + useThemeContent caption
  [ ] Audit ProductPage.tsx for EV spec display completeness

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger

EVCARD
  [ ] Remove redundant onClick prop
  [ ] aria-hidden="true" on emoji icons (⚡, 🔋, 🔌)
  [ ] Move icon marginRight to CSS

ICONBOX
  [ ] h5 + p inline styles → CSS
  [ ] Sustainability titles × 4, descriptions × 4, icons × 4 → useThemeContent

FOOTER
  [ ] Footer grid → .ev-footer-grid CSS
  [ ] Logo link → .ev-footer-logo CSS
  [ ] Footer desc → .ev-footer-desc CSS
  [ ] Footer bottom → .ev-footer-bottom CSS
  [ ] FooterMenuColumn × 3: titleStyle → CSS class

PAGE.TSX — INLINE STYLES → CSS CLASSES
  [ ] Hero description → .ev-hero-description
  [ ] Hero CTA row → .ev-hero-cta-row
  [ ] Hero CTA button padding → .ev-hero-cta-btn
  [ ] Alert slots → .ev-alert-slot CSS
  [ ] Filter title wrapper + h2 → CSS
  [ ] EV card link wrappers → .ev-card-link
  [ ] Skeleton cards (all 4 × 6 elements) → CSS classes
  [ ] Empty state → CSS classes
  [ ] Divider hrs × 3 → .ev-divider
  [ ] Compare feature column → .ev-compare-col--feature
  [ ] Compare EV columns borderRight → CSS :last-child
  [ ] Compare header link → .ev-compare-header-link
  [ ] Charging section grid → .ev-charging-grid
  [ ] Charging title alignment → CSS
  [ ] Charging desc → .ev-charging-desc
  [ ] Charging list + items → CSS classes
  [ ] Map placeholder → .ev-map-placeholder

HARDCODED STRINGS → useThemeContent
  [ ] Filter dropdown labels and options (all selects)
  [ ] Charging checklist × 3
  [ ] Sustainability item titles, descs, icons × 4

RESPONSIVE
  [ ] Compare table overflow
  [ ] Filter bar mobile stacking
  [ ] Charging grid 1-col mobile
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Heavy inline styles; dead `FALLBACK_CLASSIFIEDS` code; `<style jsx>`; brand-matching logic |
| `components/index.tsx` — ElectricHeader | Nav | Missing `aria-expanded` |
| `components/index.tsx` — EVCard | Vehicle card | `onClick` redundant; emoji no `aria-hidden` |
| `components/index.tsx` — IconBox | Sustainability | Inline styles; data hardcoded |
| `components/index.tsx` — ElectricFooter | Footer | Fully inline; copyright bug |
| `ProductPage.tsx` | EV detail | Not audited |
