# Theme Completion Plan: `services/creative`

**Priority:** #29 (Phase 4) — Freelance creative services marketplace; dark gradient aesthetic
**Theme path:** `apps/storefront/src/themes/services/creative/`
**Audit score:** 6.5/10 — Masonry portfolio grid and creatives grid are distinctive; held back by two hardcoded data arrays, no actual pricing table despite the section being named "pricing", and heavily inline components

---

## What's Already Done

- `CrtvHeader`: hamburger, `MenuNav`, `MenuActionButtons` (mobile + desktop)
- `CrtvCategoryCard`, `CrtvCreativeCard`, `CrtvPortfolioItem`, `CrtvFooter`
- `FooterMenuColumn × 3` in footer ✓
- Masonry portfolio grid (6 hardcoded items — see §3)
- `DynamicTestimonials` integration ✓
- Creatives listing grid with skeletons + empty state (CSS classes) ✓
- `resolveServicesFailure` demo fallback ✓
- `CatalogSyncAlert` ✓
- `useThemeContent` for: hero title/desc/CTAs, categories title, creatives title, showcase title, CTA title/desc/button

---

## Gaps & Issues to Fix

### 1. Primary Missing Feature: Pricing Table

The section with `id="pricing"` (line 130) is actually the "Top Creatives" grid — it's misleadingly named. There is no actual pricing table showing freelancer tiers or platform fees.

The main plan specifies a "pricing table." This should be a platform/tier pricing section:
- Free / Professional / Agency tiers (or similar)
- Price per tier, feature list, CTA

- [ ] Create `PricingTierCard` component in `components/index.tsx`
- [ ] Add a "Platform Plans" section above the CTA banner with 3 tiers
- [ ] Rename `id="pricing"` on the creatives section to `id="creatives"` (update `scrollToCreatives` references)
- [ ] `useThemeContent` keys: `pricing.title`, `pricing.tier_N_name`, `pricing.tier_N_price`, `pricing.tier_N_description`, `pricing.tier_N_features` (pipe-split), `pricing.tier_N_cta_label` × 3 tiers
- [ ] CSS: `.crtv-pricing-section`, `.crtv-pricing-grid`, `.crtv-pricing-card`, `.crtv-pricing-card--featured`, `.crtv-tier-price`, `.crtv-tier-features`, `.crtv-tier-cta`

---

### 2. `CrtvHeader` — Missing `aria-expanded`

Hamburger button (lines 21–29): no `aria-expanded`.
- [ ] Add `aria-expanded={isOpen}` to the hamburger `<button>`

---

### 3. Hardcoded Data Arrays → `useThemeContent`

**`categories` array (Page.tsx lines 14–21):**
```tsx
const categories = [
  { title: 'Graphic Design', rate: 'From $100', icon: '🎨' },
  { title: 'Writing & Content', rate: 'Copywriting, SEO', icon: '✍️' },
  { title: 'Photography', rate: 'Events, Products', icon: '📸' },
  { title: 'Web Development', rate: 'Full Stack, CMS', icon: '💻' },
  { title: 'Music & Audio', rate: 'Sound Design', icon: '🎵' },
  { title: 'Marketing', rate: 'Social Media', icon: '📈' },
];
```
→ `useThemeContent('categories.list', 'Graphic Design|From $100|🎨|Writing & Content|Copywriting, SEO|✍️|...')` — 3-token pipe-split per category (title|rate|icon), 6 categories = 18 tokens

Or per-item keys: `categories.item_N_title`, `categories.item_N_rate`, `categories.item_N_icon` × 6

**`portfolios` array (Page.tsx lines 23–30):**
```tsx
const portfolios = [
  { title: 'Modern UI Kit', category: 'Graphic Design', image: '/themes/services/creative/11.webp' },
  { title: 'Brand Identity', category: 'Branding', image: '/themes/services/creative/12.webp' },
  ...
];
```
→ Per-item `useThemeContent` + `useThemeMedia`:

| Key | Default |
|---|---|
| `portfolio.item_1_title` | `'Modern UI Kit'` |
| `portfolio.item_1_category` | `'Graphic Design'` |
| `portfolio.item_1_image` | `useThemeMedia('portfolio.item_1_image', '/themes/services/creative/11.webp')` |
| ... × 6 | |

**`DynamicTestimonials` title (Page.tsx line 197):** `title="Trusted by Clients & Creatives"` hardcoded
→ `useThemeContent('testimonials.title', 'Trusted by Clients & Creatives')`

---

### 4. `Page.tsx` — Inline Styles

**Hero description `p` (line 97):** `style={{ fontSize, marginBottom, opacity }}` → `.crtv-hero-desc`

**Hero CTA row (line 100):** `style={{ display, gap, justifyContent, flexWrap }}` → `.crtv-hero-cta-row`

**Hero primary CTA (line 101):** `style={{ padding, fontSize }}` → `.crtv-btn-lg` modifier

**Hero secondary CTA (line 104):** `style={{ padding, fontSize }}` → same `.crtv-btn-lg`

**Search bar filter button (line 116):** `style={{ background: '#6c757d', color: 'white' }}` → `.crtv-btn-filter`

**Category card `<button>` wrappers (line 123):**
```tsx
style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'inherit' }}
```
→ `.crtv-category-btn { background: none; border: none; padding: 0; cursor: pointer; text-align: inherit; }`

**CTA banner h2 (line 203):** `style={{ fontSize, fontWeight, marginBottom }}` → `.crtv-cta-title`

**CTA banner description (line 204):** `style={{ fontSize, marginBottom, opacity }}` → `.crtv-cta-desc`

**CTA banner button (line 205):** `style={{ background, color, padding, fontSize, fontWeight }}` → `.crtv-btn--white`

---

### 5. `CrtvCategoryCard` — Inline Styles

```tsx
<h5 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h5>
<p style={{ fontSize: '0.85rem', color: 'var(--crtv-text)', opacity: 0.7, margin: 0 }}>{rate}</p>
```
→ `.crtv-category-card h5 { font-weight: 800; margin-bottom: 0.5rem; }` and `.crtv-category-card p { ... }`

**Emoji icons** (`🎨`, `✍️`, `📸`, `💻`, `🎵`, `📈`) — hardcoded and no `aria-hidden`. Since these are pulled from `useThemeContent` (after §3 fix), they'll be user-configurable. Still need `aria-hidden="true"` on the icon element.

---

### 6. `CrtvCreativeCard` — All Inline Body

```tsx
<div style={{ display: 'flex', alignItems: 'center' }}>
  <img src={image} alt={name} className="crtv-avatar" />
  <div>
    <h5 style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{name}</h5>
    <p style={{ color, opacity, fontSize, marginBottom }}>{title}</p>
    <span style={{ background: '#ffc107', color: '#121212', padding, borderRadius, fontSize, fontWeight }}>★ {rating}</span>
  </div>
</div>
<div style={{ marginTop, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#198754' }}>{rate}</span>
  <span className="crtv-btn crtv-btn-gradient" style={{ padding, fontSize }}>View Profile</span>
</div>
```
- [ ] Add `.crtv-card-header { display: flex; align-items: center; }` CSS
- [ ] Add `.crtv-card-name { font-weight: 800; margin-bottom: 0.25rem; }` CSS
- [ ] Add `.crtv-card-title { ... }` CSS
- [ ] Add `.crtv-card-rating { background: #ffc107; color: #121212; ... }` CSS
- [ ] Add `.crtv-card-footer { margin-top: ...; display: flex; ... }` CSS
- [ ] Add `.crtv-card-rate { font-weight: 800; font-size: 1.2rem; color: #198754; }` CSS
- [ ] `'View Profile'` hardcoded → accept prop → `useThemeContent('card.view_profile_label', 'View Profile')` from Page.tsx
- [ ] `★` rating character — no `aria-hidden` on the star glyph

---

### 7. `CrtvPortfolioItem` — Overlay Inline

```tsx
<div className="crtv-portfolio-overlay">
  <h5 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.5rem' }}>{title}</h5>
  <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Category: {category}</p>
</div>
```
→ `.crtv-portfolio-overlay h5 { font-weight: 800; margin-bottom: 0.5rem; font-size: 1.5rem; }` CSS

**`'Category: '` label hardcoded** → accept `categoryLabel` prop → `useThemeContent('portfolio.category_label', 'Category')` from Page.tsx

---

### 8. `CrtvFooter` — Inline Styles + Copyright

**Logo link (line 105):** `<a href={...} className="crtv-logo" style={{ color: 'white' }}>` → add `color: white` to `.crtv-footer .crtv-logo` CSS

**Footer description (line 106):** `style={{ marginTop: '1rem', fontSize: '0.9rem', lineHeight: 1.6 }}` → `.crtv-footer-desc`

**Footer grid (line 103):** `style={{ display: grid, gridTemplateColumns, gap, marginBottom }}` → `.crtv-footer-grid`

**`FooterMenuColumn × 3` (lines 108–125):** All use `titleStyle={{ color: 'white', marginBottom: '1.5rem', fontWeight: 800 }}` → `titleClassName="crtv-footer-col-title"` + CSS class

**Footer bottom (line 127):** `style={{ borderTop, paddingTop, textAlign, opacity }}` → `.crtv-footer-bottom`

**Copyright (line 128):** `© 2026 Sellio. All rights reserved.` hardcoded directly in JSX
- [ ] Add `const footerCopyright = useThemeContent('footer.copyright', '')` to `CrtvFooter`
- [ ] Render `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

---

### 9. Section ID Cleanup

`scrollToCreatives()` (line 13–15) references `document.getElementById('pricing')`, but the section's actual purpose is showing creatives. The confusion: "Browse Creatives" CTA scrolls to a section called "pricing." After adding a real pricing section (§1), this needs cleanup.

- [ ] Rename `id="pricing"` on the creatives `<section>` to `id="creatives"`
- [ ] Update `scrollToCreatives` and `scrollToContact` to reference correct IDs
- [ ] Move new pricing section above CTA with its own anchor ID `id="pricing"`

---

### 10. Emoji Accessibility

Category icons and portfolio category labels contain emoji characters that need `aria-hidden="true"`:
- [ ] Wrap emoji in `<span aria-hidden="true">{icon}</span>` in `CrtvCategoryCard`
- [ ] `★` star in `CrtvCreativeCard` rating badge — `aria-hidden="true"` on the glyph span

---

### 11. Pages Not Yet Audited

- [ ] `ProductPage.tsx` — creative profile / service detail
- [ ] `ExplorePage.tsx`

---

## Completion Checklist Summary

```
PRIMARY FEATURE
  [ ] PricingTierCard component (3 tiers)
  [ ] Platform pricing section in Page.tsx (before CTA)
  [ ] useThemeContent keys: pricing title + tier N × 3 (name, price, desc, features, CTA)
  [ ] CSS: crtv-pricing-section, crtv-pricing-grid, crtv-pricing-card

HEADER
  [ ] aria-expanded on hamburger

HARDCODED DATA → useThemeContent
  [ ] categories × 6: title, rate, icon → useThemeContent (per-item or pipe-split)
  [ ] portfolios × 6: title, category, image → useThemeContent + useThemeMedia
  [ ] DynamicTestimonials title
  [ ] CrtvCreativeCard 'View Profile' → prop
  [ ] CrtvPortfolioItem 'Category: ' label → prop

SECTION IDs
  [ ] Rename id="pricing" → id="creatives" on creatives section
  [ ] Add id="pricing" to new pricing section
  [ ] Update scroll functions

PAGE.TSX — INLINE STYLES → CSS
  [ ] Hero desc → .crtv-hero-desc
  [ ] Hero CTA row → .crtv-hero-cta-row
  [ ] CTA button size → .crtv-btn-lg
  [ ] Filter button → .crtv-btn-filter
  [ ] Category button wrapper → .crtv-category-btn
  [ ] CTA banner title, desc, button → CSS classes

CRTVCATEGORYCARD
  [ ] h5 + p inline → CSS
  [ ] aria-hidden on emoji icons

CRTVCRATIVECARD (all inline)
  [ ] Card header, name, title, rating, footer, rate → CSS classes
  [ ] ★ aria-hidden
  [ ] 'View Profile' → prop

CRTVPORTFOLIOITEM
  [ ] Overlay h5 + p → CSS
  [ ] 'Category: ' label → prop

CRTVFOOTER
  [ ] Logo link color → CSS
  [ ] Desc → .crtv-footer-desc
  [ ] Footer grid → .crtv-footer-grid
  [ ] FooterMenuColumn × 3: titleStyle → CSS class
  [ ] Footer bottom → .crtv-footer-bottom
  [ ] Copyright: useThemeContent + dynamic year

ACCESSIBILITY
  [ ] aria-hidden on category emoji
  [ ] aria-hidden on ★ rating glyph

PAGES NOT AUDITED
  [ ] ProductPage.tsx
  [ ] ExplorePage.tsx
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | categories + portfolios hardcoded; section ID confusion; inline styles |
| `components/index.tsx` — CrtvHeader | Nav | Missing `aria-expanded` |
| `components/index.tsx` — CrtvCategoryCard | Category tile | Inline styles; emoji no aria-hidden |
| `components/index.tsx` — CrtvCreativeCard | Freelancer card | Entirely inline body; 'View Profile' hardcoded |
| `components/index.tsx` — CrtvPortfolioItem | Portfolio image | Overlay inline; 'Category:' hardcoded |
| `components/index.tsx` — CrtvFooter | Footer | Fully inline; copyright hardcoded |
| `ProductPage.tsx` | Service detail | Not audited |
