# Theme Completion Plan: `autos/used`

**Priority:** #26 — Used car marketplace; orange/blue/white palette; strong `useThemeContent` coverage already
**Theme path:** `apps/storefront/src/themes/autos/used/`
**Audit score:** 5.5/10 — Good CMS coverage and page structure; held back by inline styles throughout, hardcoded data arrays, and the primary missing vehicle history section

---

## What's Already Done

- `UsedHeader`: hamburger toggle, `MenuNav`, `MenuActionButtons`
- `UsedCarCard` with mileage, location, dealer display
- `DealerLogo` grid × 6
- `StepCard` "How It Works" 3-step grid
- `UsedFooter` with `FooterMenuColumn × 3` ✓
- Faceted filter bar: make/brand, price, mileage, location (4 dropdowns, dynamically populated from API)
- Deal of the Week section with `useThemeMedia` for deal image ✓
- `resolveVehiclesFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `CatalogSyncAlert` ✓
- `useThemeContent` for: hero title/desc/CTAs, all 4 filter labels, clear label, collection title/count label, empty state × 3, deal section (all 8 fields), dealers title/desc, all 3 how-it-works titles and descriptions

---

## Gaps & Issues to Fix

### 1. Primary Missing Feature: Vehicle History Section

The main plan specifies adding a vehicle history section. Used car buyers rely on carfax-style verification signals. This section would show:

- Report source badge (Carfax / AutoCheck / dealer inspection)
- Key history signals: previous owners, accident-free, service records, etc.
- CMS-driven via `useThemeContent` (pipe-split for list items)

Proposed placement: between the "Deal of the Week" and "Trusted Dealers" sections.

- [ ] Create `VehicleHistoryBadge` component: shows icons for key history categories
- [ ] Add "Vehicle History Reports" section to `Page.tsx` with `useThemeContent` for title and feature items
- [ ] CSS: `.us-history-section`, `.us-history-grid`, `.us-history-badge`, `.us-history-badge-icon`, `.us-history-badge-label`
- [ ] Keys: `history.title`, `history.description`, `history.badge_N_label` × 4-5 (no-accidents, 1-owner, service-records, dealer-inspected, clean-title)

---

### 2. `UsedHeader` — Missing `aria-expanded`

Hamburger button (lines 27–35): no `aria-expanded`.
- [ ] Add `aria-expanded={isOpen}` to the hamburger `<button>`

---

### 3. `ShimmerCard` (defined in Page.tsx, lines 89–98) — All Inline

The `ShimmerCard` component is defined inside `Page.tsx` instead of `components/index.tsx`, and is fully inline:
```tsx
<div className="us-car-card us-shimmer-pulse" style={{ minHeight: '380px', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
  <div style={{ height: '220px', backgroundColor: '#e2e8f0' }}></div>
  <div style={{ padding: '1.5rem' }}>
    <div style={{ height: '20px', backgroundColor: '#e2e8f0', borderRadius: '4px', width: '75%', marginBottom: '0.75rem' }}></div>
    ...
  </div>
</div>
```
- [ ] Move `ShimmerCard` to `components/index.tsx`
- [ ] Add CSS: `.us-skeleton-img { height: 220px; background-color: #e2e8f0; }` and `.us-skeleton-line` variants
- [ ] Remove all `style={{...}}` from `ShimmerCard`; add min-height/border/overflow to `.us-car-card.us-shimmer-pulse`

---

### 4. Hardcoded Data Arrays → `useThemeContent`

**DealerLogo names (Page.tsx lines 381–386):**
```tsx
<DealerLogo name="AutoWorld" rating={4.8} />
<DealerLogo name="City Motors" rating={4.1} />
<DealerLogo name="Honest Used Cars" rating={5.0} />
<DealerLogo name="Zoom Motors" rating={3.6} />
<DealerLogo name="Prime Autos" rating={4.7} />
<DealerLogo name="Elite Drives" rating={4.9} />
```
Six hardcoded dealer names and ratings.
- [ ] Replace with `useThemeContent('dealers.list', 'AutoWorld|4.8|City Motors|4.1|Honest Used Cars|5.0|Zoom Motors|3.6|Prime Autos|4.7|Elite Drives|4.9')` pipe-split pattern
- [ ] Parse into name/rating pairs (every 2 tokens)

**Deal section list items (Page.tsx lines 368–370):**
```tsx
<li>⏱️ Only 15,000 Miles</li>
<li>📅 Model Year 2021</li>
<li>⛽ Great MPG & Resilient Specs</li>
```
→ `useThemeContent('deal.feature_list', '⏱️ Only 15,000 Miles|📅 Model Year 2021|⛽ Great MPG & Resilient Specs')` pipe-split + `aria-hidden="true"` on emoji

**`UsedCarCard` "View Details" (components/index.tsx line 71):** Hardcoded in the hover overlay span.
→ Accept `viewLabel` prop; pass `useThemeContent('card.view_details_label', 'View Details')` from Page.tsx

---

### 5. `Page.tsx` — Inline Styles

**Hero CTA row (line 223):** `style={{ display, gap, flexWrap, justifyContent }}` → `.us-hero-cta-row`

**Hero secondary CTA (line 225):** `style={{ color: 'white', borderColor: 'white' }}` → `.us-btn-outline--light { color: white; border-color: white; }` or add modifier class

**Filter card header (lines 231–234):** `style={{ display, justifyContent, alignItems, marginBottom }}` → `.us-filter-header`

**Filter section title (line 232):** `style={{ margin: 0, fontSize: '1.25rem' }}` → `.us-filter-title`

**Clear filters button (lines 235–239):** `style={{ background, border, color, cursor, fontWeight, fontSize }}` → `.us-clear-btn`

**Filter labels × 4 (lines 245, 258, 272, 287):** Each has `style={{ fontSize, fontWeight, color, display, marginBottom }}` → `.us-filter-label`

**Listings header (lines 316–321):** `style={{ display, justifyContent, alignItems, marginBottom, flexWrap, gap }}` → `.us-listings-header`

**Listings title (line 317):** `style={{ margin: 0, textAlign: 'left' }}` → `.us-section-title--left`

**Listings count span (line 318):** `style={{ color, fontWeight, fontSize }}` → `.us-listings-count`

**Empty state (lines 330–335):** Fully inline block → `.us-empty-state`, `.us-empty-icon`, `.us-empty-title`, `.us-empty-desc`

**Deal section container (line 348):** `style={{ backgroundColor: 'white' }}` → use `.us-section.us-bg-white` CSS modifier

**Deal card image wrapper (line 352):** `style={{ position: 'relative', minHeight: '300px' }}` → `.us-deal-img-wrapper`

**Deal card image (lines 353–358):** `style={{ width, height, objectFit, position, top, left }}` → `.us-deal-img`

**Deal card content div (line 359):** `style={{ padding, display, flexDirection, justifyContent }}` → `.us-deal-content`

**Deal title (line 360):** `style={{ fontSize, marginBottom }}` → `.us-deal-title`

**Deal description (line 361):** `style={{ color, marginBottom, fontSize }}` → `.us-deal-desc`

**Deal price row (lines 362–365):** `style={{ display, alignItems, gap, marginBottom }}` → `.us-deal-price-row`

**Deal price (line 363):** `style={{ fontSize }}` → `.us-deal-price`

**Deal original price (line 364):** `style={{ color, textDecoration, fontSize }}` → `.us-deal-original-price`

**Deal feature list (line 366):** `style={{ listStyle, padding, margin, color, lineHeight }}` → `.us-deal-list`

**Deal CTA (line 371):** `style={{ width: '100%' }}` → `.us-btn--full`

**Dealers description (line 379):** `style={{ textAlign, color, marginBottom, fontSize }}` → `.us-dealers-desc`

**How it works section (line 391):** `style={{ backgroundColor: 'white' }}` → `.us-section.us-bg-white`

---

### 6. `UsedCarCard` — Inline Styles

**Image (line 68):** `style={{ height: '220px', width: '100%', objectFit: 'cover' }}` → add to `.us-car-img` in CSS

**Dealer row (line 79):** `style={{ marginTop, display, alignItems, gap }}` → `.us-car-dealer`

**Dealer icon span:** `🏪` no `aria-hidden="true"` → add it

**Dealer icon style (line 80):** `style={{ fontSize: '0.9rem' }}` → add to `.us-car-dealer-icon` CSS

**Dealer name (line 81):** `style={{ color, fontSize, fontWeight }}` → add to `.us-car-dealer-name` CSS

---

### 7. `DealerLogo` — All Inline

```tsx
<div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', fontWeight: 700, color: '#555', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
<div style={{ color: '#ffd700', fontSize: '0.9rem' }}>
```
- [ ] Add `.us-dealer-name-box { height: 60px; display: flex; align-items: center; ... }` CSS
- [ ] Add `.us-dealer-rating { color: #ffd700; font-size: 0.9rem; }` CSS

---

### 8. `StepCard` — Inline Styles

**Title (line 101):** `style={{ marginBottom: '1rem' }}` → add to `.us-step-card h4`

**Description (line 102):** `style={{ color: '#666', lineHeight: 1.6 }}` → add to `.us-step-card p`

---

### 9. `UsedFooter` — Inline Styles + Copyright Bug

**Footer grid (line 114):** `style={{ display: grid, gridTemplateColumns, gap, marginBottom }}` → `.us-footer-grid`

**Brand section h4 (line 116):** `style={{ fontSize, marginBottom }}` → `.us-footer-logo-heading`

**Brand description (line 119):** `style={{ color, lineHeight }}` → `.us-footer-desc`

**`FooterMenuColumn` column 3 `renderTitle` (line 138–140):**
```tsx
renderTitle={() => (
  <h6 className="us-text-orange us-fw-bold" style={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}>Connect With Us</h6>
)}
```
→ Use `titleClassName="us-text-orange us-fw-bold"` + add `margin-bottom: 1.5rem; text-transform: uppercase;` to `.us-footer-col-title` CSS

**`FooterMenuColumn × 1, 2` (lines 121–131):** Both use `titleStyle={{ marginBottom: '1.5rem', textTransform: 'uppercase' }}` → same CSS class fix

**Social wrapper (line 143):** `style={{ marginBottom: '1.5rem' }}` → `.us-footer-social-wrapper`

**Footer email (line 154):** `style={{ color: 'rgba(255,255,255,0.7)' }}` → `.us-footer-email`

**Footer bottom (line 157):**
```tsx
<div style={{ borderTop, paddingTop, textAlign, color, fontSize }}>
```
→ `.us-footer-bottom`

**Copyright bug (line 110):** `useThemeContent('footer.copyright', '2026 Sellio. All rights reserved.')` — missing `©` same as `autos/electric`.
- [ ] Change default to `''`; render `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

---

### 10. Pages Not Yet Audited

- [ ] `ProductPage.tsx` — check for vehicle history integration, seller contact form, financing
- [ ] `ExplorePage.tsx` — check for search and filter UX

---

## Completion Checklist Summary

```
PRIMARY FEATURE
  [ ] VehicleHistoryBadge component + history section in Page.tsx
  [ ] useThemeContent keys for history section title + badge labels × 4-5
  [ ] CSS: us-history-section, us-history-grid, us-history-badge

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger

SHIMMERCARD
  [ ] Move to components/index.tsx
  [ ] All inline → CSS classes

HARDCODED DATA → useThemeContent
  [ ] DealerLogo names × 6 → pipe-split
  [ ] Deal list items × 3 → pipe-split
  [ ] UsedCarCard 'View Details' → prop

USEDCARCARD
  [ ] img inline → .us-car-img CSS
  [ ] Dealer row → .us-car-dealer CSS
  [ ] Dealer icon aria-hidden
  [ ] Dealer name inline → CSS

DEALERLOGO
  [ ] Name box → CSS class
  [ ] Rating → CSS class

STEPCARD
  [ ] h4 marginBottom → CSS
  [ ] p color/lineHeight → CSS

PAGE.TSX — INLINE STYLES → CSS CLASSES
  [ ] Hero CTA row → .us-hero-cta-row
  [ ] Hero secondary CTA → .us-btn-outline--light
  [ ] Filter header → .us-filter-header
  [ ] Filter title → .us-filter-title
  [ ] Clear btn → .us-clear-btn
  [ ] Filter labels × 4 → .us-filter-label
  [ ] Listings header → .us-listings-header
  [ ] Listings count → .us-listings-count
  [ ] Empty state → CSS classes
  [ ] Deal image wrapper + image → CSS
  [ ] Deal content, title, desc, price row → CSS
  [ ] Deal list → .us-deal-list
  [ ] Dealers desc → CSS
  [ ] Section bg-white → CSS modifier

FOOTER
  [ ] Footer grid → .us-footer-grid
  [ ] Brand heading → CSS
  [ ] Desc → .us-footer-desc
  [ ] FooterMenuColumn × 3: titleStyle → CSS class
  [ ] Social wrapper → CSS
  [ ] Email → CSS
  [ ] Footer bottom → .us-footer-bottom
  [ ] Copyright: dynamic year

PAGES NOT AUDITED
  [ ] ProductPage.tsx
  [ ] ExplorePage.tsx
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good `useThemeContent` coverage; heavy inline styles; ShimmerCard defined inline |
| `components/index.tsx` — UsedHeader | Nav | Missing `aria-expanded` |
| `components/index.tsx` — UsedCarCard | Vehicle card | img + dealer row inline |
| `components/index.tsx` — DealerLogo | Dealer display | Fully inline |
| `components/index.tsx` — StepCard | Process steps | Partial inline |
| `components/index.tsx` — UsedFooter | Footer | Inline grid + copyright bug |
| `ProductPage.tsx` | Car detail | Not audited |
