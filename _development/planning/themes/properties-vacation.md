# Theme Completion Plan: `properties/vacation`

**Priority:** #21 — Airbnb-style vacation rental platform; editorial feel with live date filtering
**Theme path:** `apps/storefront/src/themes/properties/vacation/`
**Audit score:** 7.5/10 — very clean homepage and CMS integration; primary gaps are missing ProductPage features (host profile, amenity icons, booking calendar), heavy `RetreatBentoCard` inline styles, and footer inline styles

---

## What's Already Done

- Full page suite: Homepage, (ProductPage, ExplorePage, Layout — not yet audited)
- Components: VacationHeader (hamburger ✓), RetreatBentoCard, ExperienceStats, EscapeFooter (FooterMenuColumn × 3 ✓)
- Live API via `fetchVacationCatalogPage` (no demo fallback — check if needed)
- `useThemeContent` for: hero/grid/philosophy/CTA sections, trust items (pipe-separated split ✓)
- `useThemeMedia` for philosophy image
- **Search form**: where-to input, check-in/check-out date inputs, budget select — all `htmlFor`/`id` pairs ✓
- Category pill filter built from live API data + client-side price filter
- `ShimmerCard` with CSS classes only — no inline styles ✓
- Philosophy section with live dynamic stats (retreat count, unique location count)
- Trust bar from `useThemeContent` with pipe-split ✓
- CTA section with smooth scroll to listing grid

---

## Gaps & Issues to Fix

### 1. Primary Missing Features: Host Profile, Amenity Icons, Booking Calendar

These three features are all expected to be on `ProductPage.tsx` (the retreat detail page) and have not yet been audited. They represent the most important remaining work.

**Host Profile** — a "Meet Your Host" section with photo, name, bio, member since, and response rate. Reads from `property.host` API data with `useThemeContent` defaults for demo.

Expected implementation:
```tsx
<section className="pv-host-section">
  <h2 className="pv-host-heading">{hostTitle}</h2>
  <div className="pv-host-card">
    <img src={property.host?.avatar || hostAvatarDefault} alt={property.host?.name || hostName} className="pv-host-avatar" />
    <div className="pv-host-info">
      <h3 className="pv-host-name">{property.host?.name || hostName}</h3>
      <p className="pv-host-bio">{property.host?.bio || hostBio}</p>
      <p className="pv-host-stats">{hostResponseRate} · {hostMemberSince}</p>
    </div>
  </div>
</section>
```

**Amenity Icons** — a grid of visual amenity badges below the property description. Uses icons (SVG or emoji with `aria-hidden`) + label for each amenity (Pool, WiFi, Kitchen, Parking, A/C, Hot Tub, etc.). Reads from `property.features` array or `useThemeContent` defaults.

Expected implementation:
```tsx
<section className="pv-amenities">
  <h2 className="pv-amenities-title">{amenitiesTitle}</h2>
  <div className="pv-amenities-grid">
    {amenities.map((amenity) => (
      <div key={amenity.label} className="pv-amenity-item">
        <span aria-hidden="true" className="pv-amenity-icon">{amenity.icon}</span>
        <span>{amenity.label}</span>
      </div>
    ))}
  </div>
</section>
```

**Booking Calendar** — a date range picker with availability visualization on the retreat detail page. An upgrade from the homepage's plain `<input type="date">`. Should show blocked/available dates and compute total nights and pricing.

- [ ] Read `ProductPage.tsx` — confirm whether host profile, amenity icons, and booking calendar are implemented
- [ ] If missing: implement all three as described above
- [ ] If partially implemented: fill the gaps

---

### 2. `VacationHeader` — Missing `aria-expanded` + Inline Styles

**Missing `aria-expanded` (lines 19–28):**
```tsx
<button 
  className={`pv-hamburger ${isOpen ? 'pv-hamburger-open' : ''}`}
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Toggle Navigation"
  id="pv-hamburger-toggle"
>
```
- [ ] Add `aria-expanded={isOpen}`

**Logo link inline styles (lines 15–17):**
```tsx
<a href={...} className="pv-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
  ESCAPE<span style={{ color: 'var(--pv-coral)' }}>Node</span>
</a>
```
- [ ] Add `text-decoration: none; color: inherit;` to `.pv-logo` CSS
- [ ] Create `.pv-logo-accent { color: var(--pv-coral); }` in `styles.css`; replace `style={{ color: 'var(--pv-coral)' }}` with `className="pv-logo-accent"`

**Logo text hardcoded:**
- [ ] Wrap in `useThemeContent('header.brand_label', 'ESCAPENode')`; split at a natural boundary (e.g., last word or last N chars) for the accent span

**MenuActionButtons `renderItem` inline styles (lines 44, 53):**
- Mobile: `style={{ padding: '1rem 3rem', fontSize: '0.8rem', marginTop: '2rem', width: '100%' }}` → `.pv-btn-primary--mobile`
- Desktop: `style={{ padding: '0.8rem 2rem', fontSize: '0.75rem', boxShadow: 'none' }}` → `.pv-btn-primary--desktop`

---

### 3. `RetreatBentoCard` — Heavy Inline Styles + Hardcoded Strings + Accessibility

**Inline styles — entire card body (lines 68–77):**

| Element | Target class |
|---|---|
| Card body outer div (`padding: 3rem`) | `.pv-card-body` |
| `'Verified Retreat'` div (margin, color) | `.pv-card-verified-label` |
| Title h3 (font, size, weight, margin, line-height) | `.pv-card-title` |
| Location div (font-size, color, margin) | `.pv-card-location` |
| Footer row div (flex, border-top, padding-top) | `.pv-card-footer` |
| Price div (font-size, weight, color) | `.pv-card-price` |
| `/night` span (font-size, color, weight) | `.pv-card-price-period` |

**Hardcoded strings:**
- `'Verified Retreat'` (line 69) → `useThemeContent('card.verified_label', 'Verified Retreat')` or prop
- `'Book Now →'` (line 75) → `useThemeContent('card.cta_label', 'Book Now →')` or prop
- `'/night'` (line 74) → `useThemeContent('card.price_period', '/night')` or prop

**`onClick` on card div (line 61):** The card is wrapped in `<a>` in Page.tsx (line 294) — the `onClick` prop on the card div is unused/redundant.
- [ ] Remove the `onClick` prop from `RetreatBentoCard`

**Prop type `any` (line 60):** `({ title, location, price, rating, image, onClick }: any)`
- [ ] Replace `any` with a proper interface matching the `VacationRetreatCard` shape

**Star rating `★ {rating}` (line 65):** The `★` character has no `aria-hidden`.
- [ ] Change to `<span aria-hidden="true">★</span> {rating}` or add `aria-label={`Rated ${rating} out of 5`}` on the container

---

### 4. `ExperienceStats` — All Inline Styles

**Lines 83–86:**
```tsx
<div style={{ textAlign: 'center' }} className="pv-stat-item">
  <div style={{ fontSize: '4rem', fontFamily: '...', fontWeight: 900, color: '...', marginBottom: '1rem' }} className="pv-stat-value">{value}</div>
  <div className="pv-mono" style={{ color: '...', fontSize: '0.65rem' }}>{label}</div>
</div>
```

The `.pv-stat-item` and `.pv-stat-value` classes already exist — move all inline styles to CSS:
- [ ] `.pv-stat-item { text-align: center; }` in CSS
- [ ] `.pv-stat-value { font-size: 4rem; font-family: var(--pv-font-serif); font-weight: 900; color: var(--pv-azure); margin-bottom: 1rem; }` in CSS
- [ ] Add `.pv-stat-label { color: var(--pv-text-muted); font-size: 0.65rem; }` class; replace `style={...}` on the label div

---

### 5. `EscapeFooter` — Heavy Inline Styles + Copyright Year

**Footer grid (line 93):**
```tsx
<div className="pv-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '8rem' }}>
```
→ Move `display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 8rem` to `.pv-footer-grid` CSS

**Footer logo link (line 95):**
```tsx
style={{ color: 'white', fontSize: '2.5rem', marginBottom: '3rem', textDecoration: 'none' }}
```
→ `.pv-footer-logo { color: white; font-size: 2.5rem; margin-bottom: 3rem; text-decoration: none; }`

**Footer description `<p>` (line 96):**
```tsx
style={{ opacity: 0.5, lineHeight: 2, fontSize: '0.95rem', maxWidth: '400px' }}
```
→ `.pv-footer-desc { opacity: 0.5; line-height: 2; font-size: 0.95rem; max-width: 400px; }`

**FooterMenuColumn `renderTitle` inline styles (lines 102, 108, 114):**
```tsx
renderTitle={(title) => <div className="pv-mono" style={{ color: 'var(--pv-sand)', marginBottom: '3rem' }}>{title}</div>}
```
- [ ] Create `.pv-footer-col-title { color: var(--pv-sand); margin-bottom: 3rem; }` in CSS
- [ ] Change renderTitle to `(title) => <div className="pv-mono pv-footer-col-title">{title}</div>` on all 3 columns

**Footer bottom div (line 119):**
```tsx
style={{ marginTop: '10rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
```
→ Move to `.pv-footer-bottom` CSS (class already referenced)

**Copyright text (line 120):**
```tsx
<div className="pv-mono" style={{ opacity: 0.4, fontSize: '0.65rem' }}>© 2026 Sellio. All rights reserved.</div>
```
- [ ] Change to `useThemeContent('footer.copyright', '')` + dynamic fallback: `{copyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`
- [ ] Add `.pv-footer-copyright { opacity: 0.4; font-size: 0.65rem; }` to CSS; replace `style={...}`

**Social links wrapper (line 121):**
```tsx
<div style={{ display: 'flex', gap: '4rem' }} className="pv-footer-socials">
```
→ Move `display: flex; gap: 4rem` to `.pv-footer-socials` CSS

**Social links `renderItem` (lines 127–129):**
```tsx
<span className={className} style={{ opacity: 0.4, fontSize: '0.65rem', cursor: 'pointer' }}>
  <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
</span>
```
→ `.pv-social-link { opacity: 0.4; font-size: 0.65rem; cursor: pointer; }` and `.pv-social-link a { color: inherit; text-decoration: none; }`

---

### 6. `Page.tsx` — `renderMultilineTitle` Inline Style

**Line 39:**
```tsx
<span className={highlightClassName} style={{ color: 'var(--pv-azure)' }}>
```
The default `highlightClassName` is `'pv-italic'`. For the hero section, azure color is applied via inline style. The philosophy/CTA sections pass `'pv-italic pv-coral-text'` — `.pv-coral-text` handles color there.

- [ ] Create `.pv-azure-text { color: var(--pv-azure); }` in `styles.css`
- [ ] Change the `renderMultilineTitle` default parameter from `'pv-italic'` to `'pv-italic pv-azure-text'`
- [ ] Remove the `style={{ color: 'var(--pv-azure)' }}` inline from line 39

---

### 7. `Page.tsx` — Retreat Card Link Wrapper

**Line 294:**
```tsx
<a key={retreat.id} href={themeLink(`/product/${retreat.slug}`)} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
```
→ `.pv-retreat-link { text-decoration: none; color: inherit; display: block; }` in CSS

---

### 8. Hardcoded Strings → `useThemeContent`

**Search form labels and options:**

| String | Suggested key |
|---|---|
| `'Where to?'` label | `search.location_label` |
| `'Search city, region...'` placeholder | `search.location_placeholder` |
| `'Check In'` label | `search.check_in_label` |
| `'Check Out'` label | `search.check_out_label` |
| `'Budget / Night'` label | `search.budget_label` |
| `'All Budgets'` option | `search.budget_all` |
| `'Under $500/night'` | `search.budget_under_500` |
| `'$500 - $1,000/night'` | `search.budget_500_1000` |
| `'$1,000+/night'` | `search.budget_1000_plus` |
| `'Reset'` button | `search.reset_label` |

**Grid and filtering:**

| String | Suggested key |
|---|---|
| `'retreats in catalog'` suffix | `grid.inventory_suffix` |
| `'All Retreats'` category pill | `grid.category_all_label` |

**Empty state:**

| String | Suggested key |
|---|---|
| `'No retreats found'` | `empty.title` |
| `'We could not find...'` | `empty.description` |
| `'Clear filters'` | `empty.reset_label` |

**Philosophy stats labels (ExperienceStats):**

| String | Suggested key |
|---|---|
| `'Live Retreats'` | `stats.retreats_label` |
| `'Unique Locations'` | `stats.locations_label` |

---

### 9. Demo Fallback — Check Pattern

The current `useEffect` (lines 102–131) sets `apiError` and renders an empty grid on failure — no demo fallback products are loaded. The main plan says to use the demo fallback pattern.

- [ ] Verify whether `resolvePropertiesFailure` or equivalent exists in `properties/shared/catalog`
- [ ] If it does: import it and use it when the API fails (load demo properties)
- [ ] Create `fallback-data.ts` with a short array of demo `VacationRetreatCard` objects if no shared utility exists

---

### 10. `ProductPage.tsx` — Not Yet Audited (Primary Outstanding Work)

- [ ] Read `ProductPage.tsx`
- [ ] Confirm host profile section exists (photo, name, bio, response rate)
- [ ] Confirm amenity icons section exists (Pool, WiFi, Kitchen, etc. as icon + label)
- [ ] Confirm booking calendar or date range picker exists (not just `<input type="date">`)
- [ ] Check for inline styles, hardcoded strings, form label/input accessibility

---

### 11. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Hero** (`pv-hero`): verify text remains readable at 375px; `pv-heading-xl` wraps cleanly
- [ ] **Search HUD** (`pv-search-hud`): 4 fields + reset button — verify stack/wrap on mobile; date inputs usable on touch
- [ ] **Trust bar** (`pv-trust-bar`): verify items wrap or scroll on mobile
- [ ] **Category pills** (`pv-category-ribbon`): verify horizontal scroll or wrap
- [ ] **Retreat grid** (`pv-retreat-grid`): verify 1 column on mobile; card body padding readable
- [ ] **Philosophy grid** (`pv-philosophy-grid`): image + text side by side → stack on mobile
- [ ] **Stats grid** (`pv-stats-grid`): 2 stats side by side → readable at 375px
- [ ] **Footer grid**: `2fr 1fr 1fr 1fr` → verify collapse to 1 column on mobile

---

### 12. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using retreat title and location
- [ ] `ExplorePage`: add title ("Browse Vacation Retreats")

---

## Completion Checklist Summary

```
PRIMARY FEATURES (ProductPage — not yet audited)
  [ ] Read ProductPage.tsx
  [ ] Host profile section: avatar, name, bio, response rate
  [ ] Amenity icons section: Pool, WiFi, Kitchen, etc. with aria-hidden icons
  [ ] Booking calendar/date-range picker with availability visualization

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger button
  [ ] Logo link: inline styles → CSS (.pv-logo, .pv-logo-accent)
  [ ] Logo text: useThemeContent brand label
  [ ] MenuActionButtons renderItem: inline styles → .pv-btn-primary--mobile/desktop

RETREATBENTOCARD
  [ ] Card body: all inline styles → CSS classes (.pv-card-body, -title, -location, -footer, -price, -verified-label)
  [ ] Remove unused onClick prop
  [ ] Replace any type with proper interface
  [ ] Star ★ character: add aria-hidden="true"
  [ ] Hardcoded 'Verified Retreat', 'Book Now →', '/night' → useThemeContent or prop

EXPERIENCESTATS
  [ ] All inline styles → CSS (.pv-stat-item, .pv-stat-value, .pv-stat-label)

ESCAPEFOOTER
  [ ] Footer grid → .pv-footer-grid CSS
  [ ] Footer logo link → .pv-footer-logo CSS
  [ ] Footer description → .pv-footer-desc CSS
  [ ] FooterMenuColumn renderTitle: style → pv-footer-col-title class on all 3
  [ ] Footer bottom div → .pv-footer-bottom CSS
  [ ] Copyright: dynamic year; hardcoded string → useThemeContent
  [ ] Social wrapper → .pv-footer-socials CSS
  [ ] Social renderItem: style → CSS

PAGE.TSX
  [ ] renderMultilineTitle: remove inline style; add .pv-azure-text class
  [ ] Retreat card link: style → .pv-retreat-link CSS

HARDCODED STRINGS → useThemeContent
  [ ] Search: location label/placeholder, check-in/out labels, budget label, options × 4, reset
  [ ] Grid: inventory suffix, all-category pill
  [ ] Empty state: title, description, reset label
  [ ] Stats: retreats label, locations label

DEMO FALLBACK
  [ ] Verify resolvePropertiesFailure pattern; add if missing

RESPONSIVE
  [ ] Search HUD: stack on mobile
  [ ] Retreat grid: 1 col mobile
  [ ] Philosophy: stack on mobile
  [ ] Footer grid: collapse on mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + location)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + filters | Very clean useThemeContent; search form labels/options hardcoded; renderMultilineTitle inline style; retreat link inline |
| `components/index.tsx` — VacationHeader | Site nav | Hamburger ✓; missing aria-expanded; logo inline |
| `components/index.tsx` — RetreatBentoCard | Retreat card | Heavy body inline; hardcoded labels; onClick redundant; prop typed as any |
| `components/index.tsx` — ExperienceStats | Stat display | All inline |
| `components/index.tsx` — EscapeFooter | Footer | FooterMenuColumn × 3 ✓; brand section inline; copyright hardcoded |
| `ProductPage.tsx` | Retreat detail | Not audited — primary feature work |
| `ExplorePage.tsx` | Retreat browse | Not audited |
| `styles.css` | Styles | 1,120 CSS lines already; will grow with class additions |
