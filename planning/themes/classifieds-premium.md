# Theme Completion Plan: `classifieds/premium`

**Priority:** #30 (Phase 4) — Premium/business acquisition classifieds; gold/navy professional aesthetic
**Theme path:** `apps/storefront/src/themes/classifieds/premium/`
**Audit score:** 8/10 — The cleanest Phase 4 theme by far. Filter sidebar, shimmer cards, grid/list toggle, and featured/ordinary split are all CSS-class-based. Primary concerns are partial component audit (PremiumHeader/PremiumCard/PremiumFooter in separate files), hardcoded pagination, and a few scattered inline blocks.

---

## What's Already Done

- `PremiumHeader`, `PremiumCard`, `PremiumFooter` (in separate component files — not yet read)
- Sidebar filter form with proper `<form>` + `<label>` + CSS classes: category, location, price range (min/max inputs) ✓
- "Apply Filters" and "Clear Refinements" controls with `onSubmit` form handler ✓
- Featured vs. ordinary listings split ✓
- Grid / List view toggle ✓
- Shimmer skeleton loading — CSS classes only ✓
- `resolveClassifiedsFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `PREMIUM_DEMO_CATEGORIES` from shared `fallback-data.ts` ✓
- `CatalogSyncAlert` ✓
- `isMounted` cleanup in `useEffect` ✓
- `useThemeContent` for: featured header title/empty, membership title/subtitle/button label, toolbar labels × 4, empty state × 2
- Dynamic category building from API `sidebar.categories` ✓, with fallback label mapping

---

## Gaps & Issues to Fix

### 1. Component Files Not Yet Audited

The `components/index.tsx` re-exports from separate files:
```ts
export * from './components';
export { CuratedListingCard } from './CuratedListingCard';
export { DiamondFooter } from './DiamondFooter';
export { EliteHeader } from './EliteHeader';
```

This looks like shared code with `classifieds/elite`. The Page.tsx imports `PremiumHeader`, `PremiumCard`, `PremiumFooter` from `./components` (probably a `./components.tsx` or `./components/` directory). These haven't been read yet.

- [ ] Read `PremiumHeader` source — check for `aria-expanded`, inline styles, `useThemeContent`
- [ ] Read `PremiumCard` source — check for inline styles, hardcoded strings, accessible attributes
- [ ] Read `PremiumFooter` source — check for inline styles, `useThemeContent`, copyright year
- [ ] Determine whether `EliteHeader`/`DiamondFooter` are re-used here and if they share any state

---

### 2. Hardcoded Pagination

Page.tsx lines 440–444:
```tsx
<div className="cp-pagination">
  <button className="cp-page-btn cp-active">1</button>
  <button className="cp-page-btn">2</button>
  <button className="cp-page-btn">3</button>
</div>
```
Three hardcoded buttons — not dynamic. Clicking 2 or 3 does nothing.

- [ ] Implement a simple pagination state: `const [page, setPage] = useState(1)`
- [ ] Pass `page` to `fetchClassifiedsHome({ page })` on `useEffect` change
- [ ] Render page buttons based on total returned (or a page count from API response)
- [ ] OR: change to "Load More" pattern if API doesn't return total count

---

### 3. "Clear Refinements" Button — Inline Style

Page.tsx lines 297–301:
```tsx
<button 
  type="button" 
  onClick={handleResetFilters}
  style={{ background: 'transparent', border: 'none', color: 'var(--cp-teal)', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', padding: '4px 0' }}
>
  Clear Refinements
</button>
```
→ `.cp-clear-btn { background: transparent; border: none; color: var(--cp-teal); font-size: 0.8rem; font-weight: 700; cursor: pointer; text-transform: uppercase; padding: 4px 0; }`

---

### 4. Empty State — Inline Styles

Page.tsx lines 417–421:
```tsx
<div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--cp-border)' }}>
  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.8rem' }}>💼</span>
  <h5 style={{ fontWeight: 800 }}>{emptyTitle}</h5>
  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{emptyDescription}</p>
</div>
```
→ `.cp-empty-state`, `.cp-empty-icon`, `.cp-empty-title`, `.cp-empty-desc` CSS classes

**Empty briefcase emoji (line 418):** `💼` no `aria-hidden="true"`
- [ ] Add `aria-hidden="true"` to the `<span>`

---

### 5. Featured Empty State — Inline Style

Page.tsx line 343:
```tsx
<p style={{ color: '#64748b', fontStyle: 'italic', marginBottom: '3rem' }}>{featuredHeaderEmpty}</p>
```
→ `.cp-featured-empty { color: #64748b; font-style: italic; margin-bottom: 3rem; }`

---

### 6. Loading Shimmer Container Wrappers — Partial Inline

Featured shimmer wrapper (line 326): `style={{ marginBottom: '3rem' }}` on the shimmer grid → add `margin-bottom: 3rem` to `.cp-grid-featured--loading` CSS

Shimmer card height (line 328): `style={{ height: '350px' }}` → add to `.cp-shimmer-card--featured { height: 350px; }` CSS

---

### 7. Search Button — Emoji Without `aria-hidden`

Page.tsx line 232:
```tsx
<button className="cp-search-btn">
  🔍 Find Opportunity
</button>
```
→ Wrap emoji in `<span aria-hidden="true">🔍</span> Find Opportunity`

---

### 8. Category Label Mapping — Hardcoded Category Names

Page.tsx lines 126–130:
```tsx
if (catSlug === 'tech') label = 'Technology & SaaS';
else if (catSlug === 'retail') label = 'Real Estate & Retail';
else if (catSlug === 'hospitality') label = 'Hospitality & F&B';
else if (catSlug === 'manufacturing') label = 'Logistics & Industry';
```
Four hardcoded label translations for API category slugs.
- [ ] Move category label mapping to a `CATEGORY_LABEL_MAP` constant in `fallback-data.ts` (same place as `PREMIUM_DEMO_CATEGORIES`)
- [ ] Or accept that these are UI polish labels and keep with a comment

---

### 9. Architecture Note — Relationship with `classifieds/elite`

The main plan flags: "Overlaps heavily with `elite` — rebrand as auction-specific or cut entirely."

The `components/index.tsx` imports `EliteHeader` and `DiamondFooter` from `classifieds/elite` — confirming code sharing. After reading PremiumHeader/Card/Footer (§1), decide:
- If `premium` merely re-skins `elite` with different CSS: consider merging into one theme with a CSS theme variable switch
- If `premium` has distinct functionality (featured split, sidebar filter, grid/list toggle): keep separate, ensure visual differentiation in CSS

---

### 10. ProductPage + ExplorePage — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check for business acquisition detail, offer form, due diligence section
- [ ] Read `ExplorePage.tsx` — check search and filter UX

---

## Completion Checklist Summary

```
AUDIT UNREAD COMPONENTS
  [ ] Read PremiumHeader — aria-expanded, inline styles, useThemeContent
  [ ] Read PremiumCard — inline styles, hardcoded strings, accessibility
  [ ] Read PremiumFooter — inline styles, copyright year, useThemeContent

PAGINATION
  [ ] Implement dynamic page state + fetchClassifiedsHome({page})
  [ ] OR change to 'Load More' pattern

PAGE.TSX — INLINE STYLES → CSS
  [ ] 'Clear Refinements' button → .cp-clear-btn
  [ ] Empty state → .cp-empty-state + child classes
  [ ] Featured empty → .cp-featured-empty
  [ ] Loading shimmer wrapper marginBottom → CSS
  [ ] Shimmer card featured height → CSS

ACCESSIBILITY
  [ ] 💼 emoji aria-hidden in empty state
  [ ] 🔍 emoji aria-hidden in search button

CATEGORY LABEL MAP
  [ ] Move to fallback-data.ts constant

ARCHITECTURE DECISION
  [ ] Compare premium vs elite visually
  [ ] If near-duplicate: decide merge vs. differentiate

PAGES NOT AUDITED
  [ ] ProductPage.tsx
  [ ] ExplorePage.tsx
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Cleanest of Phase 4; pagination hardcoded; a few inline blocks |
| `components/index.tsx` | Re-export hub | Re-exports from elite + separate premium component files |
| `PremiumHeader` (separate file) | Nav | Not yet read |
| `PremiumCard` (separate file) | Listing card | Not yet read |
| `PremiumFooter` (separate file) | Footer | Not yet read |
| `ProductPage.tsx` | Listing detail | Not audited |
