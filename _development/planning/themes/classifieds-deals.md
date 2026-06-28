# Theme Completion Plan: `classifieds/deals`

**Priority:** #22 — Flash deals / bargain classifieds; countdown timer and urgency UI already implemented
**Theme path:** `apps/storefront/src/themes/classifieds/deals/`
**Audit score:** 6/10 — feature-complete visual experience; significant code quality gaps: `dangerouslySetInnerHTML`, `Math.random()` hydration issue, fully inline `DealCardSkeleton`, hardcoded sidebar sellers, logo name inconsistency, and accessibility gaps throughout

---

## What's Already Done

- Full page suite: Homepage, ProductPage, Layout (ExplorePage not confirmed)
- Components: CountdownTimer ✓ (real ticking countdown), DealsHeader (search, category ribbon from MenuNav), DealCard (countdown per card, follow toggle, claim button), DealsFooter (FooterMenuColumn × 2 ✓, newsletter form with success state ✓)
- Live API via `fetchClassifiedsHome` + `resolveClassifiedsFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `useThemeContent` for: trending tag, ends label, section titles/subtitles, sort label, load more labels, flash sale widget, ad widget, hero carousel slides × 3 (all fields)
- Auto-playing hero carousel (8s interval) with prev/next buttons + dot indicators (aria-labels ✓)
- **Hot Bargains grid**: filtered to ≥42% discount
- **Limited Deals**: search + category + sort + load more pagination
- **Sidebar**: flash sale widget with CountdownTimer, featured sellers follow board, sponsored ad slot
- `CatalogSyncAlert` ✓

---

## Gaps & Issues to Fix

### 1. `dangerouslySetInnerHTML` for `@keyframes cdShimmerGrid` (Lines 210–215)

```jsx
<style dangerouslySetInnerHTML={{ __html: `
  @keyframes cdShimmerGrid { ... }
`}} />
```

- [ ] Move `@keyframes cdShimmerGrid` to `styles.css`
- [ ] Remove the `<style dangerouslySetInnerHTML>` element
- [ ] Remove the outer `<div className="classifieds-deals-wrapper">` if only used to scope the style

---

### 2. `DealCardSkeleton` — Fully Inline (Lines 11–35)

The skeleton card is entirely inline, including a shimmer gradient animation div:

```tsx
<div className="cd-deal-card" style={{ border: '1px solid rgba(231,29,54,0.2)' }}>
  <div style={{ height: '180px', backgroundColor: '#1f2937', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', ..., animation: 'cdShimmerGrid 1.5s infinite' }} />
  </div>
  <div className="cd-card-body" style={{ backgroundColor: '#111827' }}>
    <div style={{ height: '1.25rem', backgroundColor: '#374151', ... }} />
    <div style={{ height: '1rem', backgroundColor: '#374151', ... }} />
    <div style={{ height: '2.5rem', backgroundColor: '#1f2937', ... }} />
  </div>
</div>
```

- [ ] Add `.cd-skeleton-card { border: 1px solid rgba(231,29,54,0.2); }` to `styles.css`
- [ ] Add `.cd-skeleton-img-wrap { height: 180px; background: #1f2937; position: relative; overflow: hidden; }` to CSS
- [ ] Add `.cd-skeleton-shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(231,29,54,0.15), transparent); animation: cdShimmerGrid 1.5s infinite; }` to CSS
- [ ] Add `.cd-skeleton-body { background: #111827; }` to CSS
- [ ] Add `.cd-skeleton-title-line`, `.cd-skeleton-meta-line`, `.cd-skeleton-btn-line` CSS classes
- [ ] Replace all inline style props with these classes

---

### 3. `DealCard` — `Math.random()` Hydration Bug

**Lines 181–182:**
```tsx
const randomHours = Math.floor(Math.random() * 8) + 2;
const randomMinutes = Math.floor(Math.random() * 59);
```

`Math.random()` called during render produces different values server-side vs client-side, causing React hydration mismatch errors.

- [ ] Remove `Math.random()` from component render path
- [ ] Accept `expiresAt?: number` (Unix timestamp) or `countdownHours?: number` prop instead
- [ ] In Page.tsx, pass a deterministic value based on listing ID (e.g., `(parseInt(deal.id) % 6) + 2` hours) or a fixed end-of-day timestamp
- [ ] Remove the `randomHours`/`randomMinutes` variables entirely

---

### 4. Logo Name Inconsistency

The header logo (line 96–98) reads **"DealFinder"** while the footer logo (line 265) reads **"DealDash"** — two different brand names for the same theme.

- [ ] Standardize via `useThemeContent('header.brand_primary', 'Deal')` + `useThemeContent('header.brand_secondary', 'Finder')` in both `DealsHeader` and `DealsFooter`
- [ ] Use the same values for both header and footer logo rendering

---

### 5. `DealsHeader` — Inline Styles + Hardcoded Strings + Accessibility

**Header top bar wrapper (line 77):**
```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
```
→ `.cd-header-top-left { display: flex; align-items: center; gap: 8px; }` in CSS

**Topbar promo text in MenuNav renderItem (line 84):**
```tsx
🔥 {item.title.toUpperCase()}: UP TO 80% OFF CLEARANCE ITEMS
```
The `🔥` prefix and `': UP TO 80% OFF CLEARANCE ITEMS'` suffix are hardcoded.
- [ ] Wrap suffix in `useThemeContent('header.promo_suffix', ': UP TO 80% OFF CLEARANCE ITEMS')`
- [ ] Add `aria-hidden="true"` to the `🔥` span or remove in favor of CSS `:before` content

**`'ENDS IN:'` text (line 90):** Hardcoded → `useThemeContent('header.ends_in_label', 'ENDS IN:')`

**Search form accessibility:**
- [ ] `<input type="text">` has no `aria-label` or `<label>` → add `aria-label="Search deals"`
- [ ] `'Search deals, bargains, tech, fashion...'` placeholder → `useThemeContent('search.placeholder', '...')`
- [ ] `'Search'` button text → `useThemeContent('search.button_label', 'Search')`
- [ ] Search bar emoji `<span>` (line 101): `🔍` has no `aria-hidden` → add `aria-hidden="true"`

**Search input inline emoji style (line 101):**
```tsx
<span style={{ fontSize: '1.1rem', color: 'var(--cd-text-muted)', userSelect: 'none' }}>🔍</span>
```
→ `.cd-search-icon { font-size: 1.1rem; color: var(--cd-text-muted); user-select: none; }`

**Category ribbon emoji chain (line 153):** The long ternary that prepends category emojis (`📂 All Deals`, `🔥 Trending Now`, etc.) needs restructuring:
- [ ] Replace nested ternary with an `iconMap` object: `{ 'All Deals': '📂', 'Trending Now': '🔥', ... }`
- [ ] Render: `<span aria-hidden="true">{iconMap[item.title] || ''}</span> {item.title}`
- [ ] This also removes the accessibility issue of emoji mixing into link text

**`MenuActionButtons` post-deal icon (line 127):** `<span>➕</span>` has no `aria-hidden` → add `aria-hidden="true"`

---

### 6. `Page.tsx` — Inline Styles to Extract

**Hero slide `display: 'flex'` (line 244):** Part of dynamic `style={{ transform: '...', display: 'flex' }}` — the transform must stay inline (dynamic), but `display: flex` can move to CSS:
→ Add `display: flex` to `.cd-hero-slide` CSS; remove from inline style

**`cd-pulse-dot` margin (line 249):** `style={{ marginRight: '8px' }}` → add `margin-right: 8px` to `.cd-pulse-dot` CSS

**Trending tag label `<span>` (line 250):**
```tsx
style={{ fontWeight: 800, textTransform: 'uppercase', color: 'var(--cd-primary-red)', fontSize: '0.9rem' }}
```
→ `.cd-trending-label` CSS class

**Hero CTA button (lines 266–272):**
```tsx
style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem', boxShadow: '0 8px 24px rgba(231, 29, 54, 0.3)', textDecoration: 'none', display: 'inline-block' }}
```
→ `.cd-hero-cta-btn` modifier CSS class (combined with `.cd-btn-post`)

**Section emoji spans (lines 321, 359):** `style={{ fontSize: '1.5rem' }}` on `🔥` and `⏰`
→ `.cd-section-emoji { font-size: 1.5rem; }` CSS class

**Hot Bargains subtitle (line 324):**
```tsx
<span style={{ color: 'var(--cd-primary-red)', fontWeight: 800, fontSize: '0.85rem' }}>
```
→ `.cd-section-badge` CSS class

**Hot Bargains empty state (line 331):**
```tsx
<div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '2rem', color: 'var(--cd-text-muted)' }}>
```
→ `.cd-empty-inline` CSS class

**Deal card link wrappers (lines 336, 399):** `style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}` → `.cd-deal-link` CSS class

**Sort bar count div (line 380):** `style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--cd-text-muted)' }}` → `.cd-filter-count` CSS class

**Empty state (lines 391–394):**
```tsx
<div style={{ textAlign: 'center', padding: '4rem 1rem', color: '...' }}>
  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🔍</span>
  <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>No Deals Found</h3>
```
→ `.cd-empty-state`, `.cd-empty-icon`, `.cd-empty-title` CSS classes; `🔍` → `aria-hidden="true"` wrapper

**Flash sale description (line 443):**
```tsx
style={{ fontSize: '0.8rem', margin: '0 0 1rem', opacity: 0.9 }}
```
→ `.cd-flash-desc` CSS class

---

### 7. Hardcoded Strings → `useThemeContent`

**Page.tsx:**

| String | Suggested key |
|---|---|
| `'No Hot Bargains currently live...'` | `empty.hot_bargains` |
| `'Showing N of M deals'` — `'deals'` suffix | `collection.deals_label` |
| Sort options: `'🔥 Highest Discount'`, `'💵 Price: Low to High'`, `'💵 Price: High to Low'` | `sort.by_discount`, `sort.by_price_low`, `sort.by_price_high` |
| `'No Deals Found'` empty state title | `empty.no_deals_title` |
| `"We couldn't find any bargains..."` | `empty.no_deals_desc` |

**Hero carousel images (lines 135, 145, 155):** Currently using `useThemeContent` for image URLs — should use `useThemeMedia`:
- [ ] Change `useThemeContent('hero.slide_N.image', 'https://...')` → `useThemeMedia('hero.slide_N.image', '/themes/classifieds/deals/hero_N.webp')` for each slide
- [ ] Add local fallback images to `/public/themes/classifieds/deals/` (copies of the Unsplash images)

**components/index.tsx:**

| String | Suggested key |
|---|---|
| `'ENDS IN:'` (header top) | `header.ends_in_label` |
| `'UP TO 80% OFF CLEARANCE ITEMS'` promo suffix | `header.promo_suffix` |
| Search placeholder | `search.placeholder` |
| `'Search'` button | `search.button_label` |
| `'SALE!'` badge text | `card.sale_badge` |
| `'Snag This Deal ⚡'` button | `card.cta_label` |
| `'Claimed ✓'` button | `card.claimed_label` |
| `'Follow'` / `'Following'` on card | `card.follow_label`, `card.following_label` |
| `'Never Miss a Bargain'` footer heading | `footer.newsletter_title` |
| Newsletter description in footer | `footer.newsletter_desc` |
| Subscribed success message | `footer.subscribed_message` |

---

### 8. `DealCard` — Inline Styles + Accessibility Fixes

**Top seller badge (line 217):**
```tsx
<span style={{ marginLeft: '4px', color: '#10b981', fontWeight: 800 }}>✓</span>
```
→ `.cd-top-seller-check { margin-left: 4px; color: #10b981; font-weight: 800; }` in CSS; `✓` → `<span aria-label="Top Seller">`

**Follow button (line 222):**
```tsx
style={{ fontSize: '0.65rem', padding: '2px 8px' }}
```
→ `.cd-card-follow-btn` CSS modifier

**Seller `👤` icon (line 216):** No `aria-hidden` → add `aria-hidden="true"` or replace with a CSS `:before` icon

**`onClick` on card outer div (line 187):** The card is already wrapped in `<a>` in Page.tsx — this `onClick` fires but never causes navigation (no `role="button"`, no `href`). Remove it and rely on the `<a>` wrapper.

**`Math.random()` (§3 above)** already addresses this.

---

### 9. Hardcoded Sidebar Featured Sellers

**Lines 456–462:**
```tsx
[
  { name: "Gadget Guru", rating: "⭐⭐⭐⭐⭐ (240 reviews)", initial: "G" },
  { name: "Fashion Finds", rating: "⭐⭐⭐⭐ (198 reviews)", initial: "F" },
  ...
]
```

- [ ] Move to `useThemeContent` as pipe-separated values: `useThemeContent('sellers.list', 'Gadget Guru|Fashion Finds|Home Essentials|LensMaster|KickZilla').split('|')`
- [ ] Ratings: `useThemeContent('sellers.ratings', '5|4|5|5|4').split('|')` (simpler than full strings)
- [ ] Follow/unfollow labels: `useThemeContent` keys already described in §7

---

### 10. `DealsFooter` — Inline Styles + Accessibility

**Logo highlight span (line 265):**
```tsx
<span className="cd-logo-highlight" style={{ padding: '2px 8px' }}>Deal</span>
```
→ Add `padding: 2px 8px` to `.cd-logo-highlight` CSS

**Newsletter description `<p>` (line 285):**
```tsx
<p className="cd-footer-desc" style={{ marginBottom: '1rem' }}>
```
→ Add `margin-bottom: 1rem` to `.cd-footer-desc + .cd-newsletter-form` or add `.cd-footer-newsletter-desc` modifier

**Subscribed success `<div>` (lines 287–289):**
```tsx
<div style={{ color: 'var(--cd-secondary-yellow)', fontWeight: 700, fontSize: '0.9rem' }}>
  ✓ Subscribed successfully! Ready for epic deals.
</div>
```
- [ ] Move styles to `.cd-subscribed-msg` CSS
- [ ] Add `role="status"` for screen reader announcement
- [ ] Text → `useThemeContent`

**Newsletter email input (line 294):** No `aria-label` → add `aria-label="Email address"`

**Copyright year (line 307):** `&copy; 2026 DealDash Marketplace.` — hardcoded year
- [ ] Use `const year = new Date().getFullYear()` and render `&copy; {year} DealDash Marketplace. All rights reserved.`
- [ ] Brand name `'DealDash'` → `useThemeContent` for consistency with header

---

### 11. Hero Carousel Accessibility

- [ ] Add `role="region"` + `aria-label="Featured Deals Carousel"` to `.cd-hero-container`
- [ ] Add `aria-roledescription="slide"` + `aria-label="{slide.title} (slide N of M)"` to each `.cd-hero-slide`
- [ ] Add `aria-current="true"` to the active dot indicator button
- [ ] Add `aria-live="polite"` region to announce the current slide title to screen readers when auto-rotating

---

### 12. Hero Images → Local Assets

**Lines 135, 145, 155:** Hero slide images reference external Unsplash URLs directly via `useThemeContent`. These should be:
- [ ] Changed from `useThemeContent` to `useThemeMedia` for CMS media management
- [ ] Default values changed to local `/public/themes/classifieds/deals/` paths instead of `unsplash.com`

---

### 13. `ProductPage.tsx` + `ExplorePage.tsx` — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check deal listing detail, seller profile section, inline styles, accessibility
- [ ] Confirm or audit `ExplorePage.tsx` if it exists

---

### 14. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Header top bar**: promo text + timer — verify wrap/overflow on mobile
- [ ] **Search form** (`.cd-search-bar`): input + button — verify full-width on mobile
- [ ] **Category ribbon** (`.cd-category-ribbon`): verify horizontal scroll on mobile
- [ ] **Hero carousel** (`.cd-hero-container`): single-column on mobile; image hidden on small screens (`d-none d-lg-flex` — these may be Bootstrap utilities that don't exist in this theme)
- [ ] **Main container** (`.cd-main-container`): deals grid + sidebar → verify sidebar collapses below on mobile
- [ ] **Hot Bargains grid** (`.cd-deals-grid`): verify 1–2 columns on mobile
- [ ] **Flash sale widget** CountdownTimer: verify readable size on mobile
- [ ] **Footer grid** (`.cd-footer-grid`): verify column collapse on mobile

---

### 15. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using deal title and discount
- [ ] `ExplorePage`: add title ("Browse All Deals")

---

## Completion Checklist Summary

```
STYLE INJECTION REMOVAL
  [ ] Move @keyframes cdShimmerGrid to styles.css
  [ ] Remove <style dangerouslySetInnerHTML> from Page.tsx

DEAL CARD SKELETON
  [ ] All inline styles → CSS classes

MATH.RANDOM() HYDRATION FIX
  [ ] Replace Math.random() with deterministic countdown values
  [ ] Accept countdownHours prop in DealCard

LOGO CONSISTENCY
  [ ] Unify brand name via useThemeContent in DealsHeader + DealsFooter

DEALSHEADER
  [ ] Header top bar wrapper → CSS class
  [ ] Promo suffix → useThemeContent
  [ ] 'ENDS IN:' → useThemeContent
  [ ] Search input: add aria-label
  [ ] Search placeholder + button → useThemeContent
  [ ] Search icon span: add aria-hidden
  [ ] Search icon inline style → CSS
  [ ] Category emoji chain → iconMap + aria-hidden spans
  [ ] Post-deal CTA icon: add aria-hidden

PAGE.TSX INLINE STYLES → CSS CLASSES
  [ ] Slide display:flex → CSS
  [ ] Pulse dot margin → CSS
  [ ] Trending label → .cd-trending-label
  [ ] Hero CTA button overrides → CSS
  [ ] Section emoji spans → .cd-section-emoji
  [ ] Hot Bargains subtitle → .cd-section-badge
  [ ] Empty inline div → .cd-empty-inline
  [ ] Deal link wrappers → .cd-deal-link
  [ ] Filter count div → .cd-filter-count
  [ ] Empty state → CSS classes
  [ ] Flash sale desc → .cd-flash-desc

HARDCODED STRINGS → useThemeContent
  [ ] Sort options × 3
  [ ] Empty state messages × 3
  [ ] 'deals' count suffix
  [ ] Hero images: useThemeContent → useThemeMedia + local assets
  [ ] Card labels: SALE, CTA, Claimed, Follow, Following
  [ ] Footer: newsletter title, desc, success message

SIDEBAR SELLERS
  [ ] Move seller names/ratings to useThemeContent (pipe-split)

DEALCARD
  [ ] Top seller badge → CSS + aria-label
  [ ] Follow button → CSS
  [ ] Seller icon → aria-hidden
  [ ] Remove redundant onClick on card div

DEALSHEADER + DEALSFOOTER
  [ ] Newsletter input: add aria-label
  [ ] Subscribed message: add role="status"; inline → CSS
  [ ] Logo span padding → CSS
  [ ] Newsletter desc margin → CSS
  [ ] Copyright: dynamic year + useThemeContent brand name

CAROUSEL ACCESSIBILITY
  [ ] role="region" + aria-label on container
  [ ] aria-roledescription="slide" on each slide
  [ ] aria-current="true" on active dot
  [ ] aria-live region for auto-rotation

PAGES NOT YET AUDITED
  [ ] ProductPage.tsx
  [ ] ExplorePage.tsx (confirm it exists)

RESPONSIVE
  [ ] Hero image: confirm responsive hiding works
  [ ] Sidebar: stacks below on mobile
  [ ] Category ribbon: horizontal scroll
  [ ] Footer: column collapse

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + discount)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + listings | dangerouslySetInnerHTML; DealCardSkeleton inline; heavy inline styles; hardcoded sellers; Math.random hydration bug |
| `components/index.tsx` — CountdownTimer | Timer | Clean and functional ✓ |
| `components/index.tsx` — DealsHeader | Site nav + search | Emoji chain in category ribbon; search no aria-label; header top bar inline; ENDS IN hardcoded |
| `components/index.tsx` — DealCard | Deal card | Math.random; top seller badge inline; follow btn inline; onClick redundant |
| `components/index.tsx` — DealsFooter | Footer | FooterMenuColumn × 2 ✓; newsletter form ✓; logo inconsistent; copyright year; subscribed state inline |
| `ProductPage.tsx` | Deal detail | Not audited |
| `ExplorePage.tsx` | Deal browse | Not audited / may not exist |
| `styles.css` | Styles | Will need keyframes + skeleton + all extracted classes |
