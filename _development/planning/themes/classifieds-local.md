# Theme Completion Plan: `classifieds/local`

**Priority:** #14 — Neighborhood classifieds; interactive Leaflet map is a strong product differentiator
**Theme path:** `apps/storefront/src/themes/classifieds/local/`
**Audit score:** 7.5/10 — feature-rich map + filtering; primary gaps are missing community board section, heavy inline styles in footer/gallery, and form accessibility

---

## What's Already Done

- Full page suite: Homepage (map + sidebar), ProductPage, InquiryConfirmationPage, Layout
- Components: LocalHeader (CMS MenuNav + MenuActionButtons), LocalCard, LocalFooter (FooterMenuColumn × 2 + conditional social links with dynamic year)
- **Interactive Leaflet map** with:
  - Marker clustering via `leaflet.markercluster`
  - Price-label pins that highlight when a card is focused
  - "Fit Results" / "My Location" mode toggle with GPS
  - Haversine distance sort when GPS location is enabled
  - User location marker with "You are here" tooltip
  - Map popup on pin click with listing details and CTA links
- Live API via `fetchClassifiedsHome` + empty state on failure
- `useThemeContent` for: panel title, alerts title, empty state text, expand radius label
- Category pills (API sidebar or derived from listing categories)
- Radius filter: 2mi, 5mi, 10mi toggle
- Sort: distance, price ASC, newly listed
- Panel search (title, neighborhood, category)
- Neighborhood highlights panel (top 2 listings as alert cards)
- Shimmer skeleton loading
- `CatalogSyncAlert` for API errors
- ProductPage: gallery (prev/next + dots + thumbnails), spec grid, seller card, inquiry form, `LiveChatWidget`, related listings

---

## Gaps & Issues to Fix

### 1. New Feature: Community Board Section

The primary missing feature for this theme. A community board shows neighborhood announcements, local events, or notices — a differentiator from the generic classifieds theme.

**Insert below the Neighborhood Highlights panel in the sidebar:**

```tsx
<div className="cl-community-board">
  <h5 className="cl-alerts-heading">{useThemeContent('community.title', 'Community Board')}</h5>
  {[1, 2, 3].map((i) => {
    const title = useThemeContent(`community.post_${i}_title`, '');
    const body = useThemeContent(`community.post_${i}_body`, '');
    if (!title) return null;
    return (
      <div key={i} className="cl-community-post">
        <span className="cl-community-post-dot" aria-hidden="true" />
        <div>
          <p className="cl-community-post-title">{title}</p>
          {body && <p className="cl-community-post-body">{body}</p>}
        </div>
      </div>
    );
  })}
</div>
```

- [ ] Add default content for `community.post_1_title`: `'🏘️ Weekend Market — Saturday 9am-1pm'`
- [ ] Add default content for `community.post_2_title`: `'🚜 Free bulk item pickup — sign up by Friday'`
- [ ] Add default content for `community.post_3_title`: `'📢 HOA Meeting — next Tuesday 7pm'`
- [ ] Add `.cl-community-board`, `.cl-community-post`, `.cl-community-post-dot`, `.cl-community-post-title`, `.cl-community-post-body` to `styles.css`
- [ ] Add `aria-hidden="true"` to emoji in default content titles, or use text-only defaults

---

### 2. `LocalFooter` — Nearly All Inline Styles

`components/index.tsx` lines 148–198 are almost entirely inline styles. The footer has `FooterMenuColumn` usage (good) but the surrounding wrapper, brand section, description, social links, and bottom bar are all inline.

| Element | Target class |
|---|---|
| Outer flex wrapper (line 148) | `.cl-footer-inner` |
| Brand section div (line 149) | `.cl-footer-brand` |
| Logo `<a>` (line 150) | `.cl-footer-logo` (probably already in `.cl-logo` — add `margin-bottom`, `display: inline-flex`) |
| Logo icon span (line 151) | `.cl-logo-icon` — move `color` and `animation` to CSS |
| Footer description `<p>` (line 156) | `.cl-footer-desc` |
| Social links div (line 159) | `.cl-social-row` |
| Social icon `<a>` (line 169) | `.cl-social-link` |
| Footer links section div (line 178) | `.cl-footer-nav-section` |
| Footer bottom div (line 195) | `.cl-footer-bottom` |

Also: `FooterMenuColumn` uses `titleStyle={{...}}` on lines 182–190 — same issue as other themes.

- [ ] Move all above inline styles to `styles.css`
- [ ] Replace `FooterMenuColumn titleStyle` prop with `titleClassName="cl-footer-col-title"` and add the style to CSS

---

### 3. Footer Social Links — JS Hover Handlers

`components/index.tsx` lines 170–171:

```tsx
onMouseEnter={(e) => { el.style.background = 'var(--cl-primary-blue)'; el.style.color = 'white'; el.style.borderColor = 'var(--cl-primary-blue)'; }}
onMouseLeave={(e) => { el.style.background = ''; el.style.color = 'var(--cl-text-muted)'; el.style.borderColor = 'var(--cl-border)'; }}
```

- [ ] Remove `onMouseEnter` / `onMouseLeave` handlers
- [ ] Add to `styles.css`: `.cl-social-link:hover { background: var(--cl-primary-blue); color: white; border-color: var(--cl-primary-blue); }`

---

### 4. `LocalHeader` — Inline Styles + No Mobile Nav

**Inline styles:**

`components/index.tsx` lines 49–53:

```tsx
<div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
  <a href={homeHref} className="cl-logo">
    <span className="cl-logo-icon" style={{ color: 'var(--cl-primary-blue)', animation: 'none' }}>
```

- [ ] Create `.cl-header-left` class for the outer flex div
- [ ] Move `color` and `animation` override to `.cl-logo-icon` CSS rule

**Missing mobile nav:**

The header has `MenuNav` + `MenuActionButtons` but no hamburger toggle for mobile widths.

- [ ] Add `[isNavOpen, setIsNavOpen]` state
- [ ] Add hamburger button with `aria-label="Toggle navigation"` and `aria-expanded={isNavOpen}`
- [ ] Wrap `<div className="cl-nav-panel">` with conditional `cg-nav-open` → `cl-nav-open` class
- [ ] Add `.cl-hamburger`, `.cl-hamburger-bar`, `.cl-nav-open` to `styles.css`

---

### 5. `LocalCard` — Inline Styles + Keyboard Accessibility

**Inline styles (lines 117–127):**

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'center' }}>
  <img ... style={{ width: '26px', height: '26px', objectFit: 'cover' }} />
  <div className="cl-avatar" style={{ fontSize: '0.75rem', width: '26px', height: '26px' }}>
  <button ... style={{ width: '26px', height: '26px', ... backgroundColor: '#f1f5f9', ... }}>
```

- [ ] Create `.cl-card-right-col` for the outer flex div
- [ ] Move `objectFit` to `.cl-avatar img` CSS rule; move `fontSize`, `width`, `height` to `.cl-avatar` CSS
- [ ] Move all button styles to `.cl-action-btn` CSS class

**Keyboard accessibility:**

Line 100: `<div className="cl-card-listing" onClick={onClick}>` — clickable div is not keyboard-reachable.

- [ ] Add `role="button"`, `tabIndex={0}`, and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}` to the card div
- [ ] Add `aria-pressed={isFocused}` to communicate the focused/highlighted state

**Contact button: `title` → `aria-label`:**

Line 123: `title="Contact Seller"` — `title` is not reliably announced by screen readers.

- [ ] Replace `title="Contact Seller"` with `aria-label="Contact seller about this listing"`

---

### 6. `Page.tsx` — Inline Styles to Extract

| Element | Target class |
|---|---|
| Alert icon span (line 436) | `.cl-alert-icon` (add `display: flex; align-items: center; color: var(--cl-primary-green)`) |
| Empty state icon span (line 461) | `.cl-empty-icon` (add `display: flex; justify-content: center; color: var(--cl-primary-blue)`) |
| Panel footer spacer div (line 500) | `.cl-panel-footer-spacer` (add `height: 1.5rem; flex-shrink: 0`) |
| Map popup action links × 2 (lines 574–577) | `.cl-popup-btn` — add `text-decoration: none` to CSS |
| Popup avatar img (line 567) | `.cl-popup-poster-avatar` — add `object-fit: cover` |

**Sort option text — wrap in `useThemeContent`:**

Lines 383–387:

```tsx
<option value="distance">Distance: Closest</option>
<option value="price-asc">Price: Low to High</option>
<option value="new">Newly Listed</option>
```

- [ ] Wrap each in `useThemeContent('sort.distance', 'Distance: Closest')` etc.

---

### 7. Map Popup Close Button — Missing `aria-label`

`Page.tsx` line 557:

```tsx
<button type="button" className="cl-popup-close" onClick={() => setFocusedItemId(null)}>×</button>
```

- [ ] Add `aria-label="Close listing preview"` to the close button

---

### 8. `ProductPage.tsx` — Gallery Controls All Inline

The gallery is a significant feature but all controls are inline-styled:

**Gallery navigation arrows (lines 178–185):**

Both prev/next buttons: fully inline (position, left/right, top, transform, background, color, border, borderRadius, width, height, cursor, display, alignItems, justifyContent, fontSize).

- [ ] Create `.cl-gallery-arrow`, `.cl-gallery-arrow--prev`, `.cl-gallery-arrow--next` CSS classes

**Gallery dot indicators (lines 186–196):**

Container div + each dot button fully inline. Dot width changes based on active state.

- [ ] Create `.cl-gallery-dots`, `.cl-gallery-dot`, `.cl-gallery-dot--active` CSS classes
- [ ] Active vs inactive width difference: use CSS `width: 20px` on `.cl-gallery-dot--active` and `width: 7px` on `.cl-gallery-dot`
- [ ] Conditional class: `className={`cl-gallery-dot${i === galleryIndex ? ' cl-gallery-dot--active' : ''}`}`

**Thumbnail strip (lines 201–212):**

Outer strip div inline + each thumbnail button inline with conditional border.

- [ ] Create `.cl-gallery-thumbs`, `.cl-gallery-thumb`, `.cl-gallery-thumb--active` CSS classes

---

### 9. `ProductPage.tsx` — Remaining Inline Styles

| Element | Target class |
|---|---|
| `cl-product-main-img-wrap` (line 166) | Remove `position: relative` inline — add to `.cl-product-main-img-wrap` CSS |
| Spec value span with PinIcon (line 226) | `.cl-spec-value--geo` (add `display: flex; align-items: center; gap: 0.3rem`) |
| Product meta row badge with PinIcon (line 254) | `.cl-product-badge--geo` (same) |
| Seller badge span (line 277) | `.cl-product-seller-badge` — add `display: inline-flex; align-items: center; gap: 0.3rem` to CSS |
| Booking drawer heading (line 284) | `.cl-booking-drawer-title` — add `display: flex; align-items: center; gap: 0.5rem` to CSS |
| Related card link (line 362) | `.cl-related-card` — add `text-decoration: none; color: inherit; display: block` to CSS |
| Related distance span (line 371) | `.cl-related-distance` — add `display: inline-flex; align-items: center; gap: 0.2rem` to CSS |
| Shimmer block overrides (lines 148–150) | `.cl-shimmer-title-lg { height: 32px; width: 70%; }`, `.cl-shimmer-price-lg { height: 40px; width: 30%; }`, `.cl-shimmer-body-lg { height: 150px; }` |

---

### 10. `ProductPage.tsx` — Form Labels Missing `htmlFor` / `id`

Lines 299–333: All 4 form fields have `<label className="cl-booking-label">` without `htmlFor`, and inputs without `id`.

- [ ] Add `id` + `htmlFor` pairs:
  - `buyer-name` (name input)
  - `buyer-email` (email input)
  - `buyer-offer` (price offer input)
  - `buyer-notes` (notes textarea)

---

### 11. `ProductPage.tsx` — Hardcoded Fallback Description

Line 263–264:

```tsx
{item.description ||
  `This item is listed by a verified neighbor in the ${item.neighborhood} area. Perfect for local pickup and secure face-to-face neighborhood handovers.`}
```

- [ ] Wrap the fallback in `useThemeContent('product.fallback_description', 'This item is listed by a verified neighbor...')` with `{neighborhood}` as a substitution placeholder

---

### 12. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Map/sidebar layout** (`.cl-main-layout`): on mobile, the map should either collapse or move below the sidebar. The full-height side-by-side won't work at 375px.
- [ ] **LocalCard** (`.cl-card-listing`): verify card image, text, and avatar column display at narrow widths
- [ ] **Category pills** (`.cl-pills-container`): verify pills wrap correctly on mobile
- [ ] **Panel search + sort row**: verify inputs don't overflow
- [ ] **Map popup** (`.cl-map-popup`): verify popup is readable and doesn't overflow on narrow widths
- [ ] **ProductPage gallery**: at mobile, ensure prev/next arrows and thumbnails are tappable (adequate touch target size — min 44×44px)
- [ ] **ProductPage grid** (`.cl-product-main-grid`): verify gallery + details column stacks on mobile
- [ ] **Related listings grid** (`.cl-related-grid`): verify 2-column on mobile

---

### 13. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using listing title and neighborhood
- [ ] `InquiryConfirmationPage`: add title

---

## Completion Checklist Summary

```
NEW FEATURE
  [ ] Community board section in sidebar (3 CMS posts via useThemeContent)

FOOTER
  [ ] Extract all inline styles → CSS classes
  [ ] FooterMenuColumn: titleStyle → titleClassName
  [ ] Social links: remove JS hover handlers → CSS :hover rule

HEADER
  [ ] Extract logo-left-section inline style → .cl-header-left
  [ ] Extract logo icon inline style → .cl-logo-icon CSS
  [ ] Add hamburger toggle with aria-expanded

LOCALCARD
  [ ] Extract seller column inline styles → .cl-card-right-col + .cl-avatar + .cl-action-btn CSS
  [ ] Add role="button" + tabIndex={0} + onKeyDown to card div
  [ ] Add aria-pressed={isFocused}
  [ ] title → aria-label on contact button

PAGE.TSX INLINE STYLES
  [ ] Alert icon, empty icon, footer spacer, popup links, popup avatar

SORT LABELS
  [ ] Wrap sort option text in useThemeContent

MAP POPUP
  [ ] Add aria-label="Close listing preview" to close button

PRODUCTPAGE GALLERY
  [ ] Gallery arrows → CSS classes
  [ ] Gallery dots → CSS classes with .cl-gallery-dot--active modifier
  [ ] Thumbnail strip → CSS classes

PRODUCTPAGE OTHER INLINE STYLES
  [ ] position: relative on img wrap, spec value geo badges,
      seller badge, drawer heading, related card link, related distance span
  [ ] Shimmer overrides → CSS classes

PRODUCTPAGE FORMS
  [ ] Add id + htmlFor to all 4 form label/input pairs

PRODUCTPAGE STRINGS
  [ ] Fallback description → useThemeContent

RESPONSIVE
  [ ] Map/sidebar layout: mobile reflow
  [ ] LocalCard: narrow widths
  [ ] ProductPage gallery: touch target sizes
  [ ] ProductPage grid: stack on mobile
  [ ] Related listings: 2-col mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + neighborhood)
  [ ] InquiryConfirmationPage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + map | Feature-rich (Leaflet, clustering, GPS); minor inline styles |
| `components/index.tsx` — LocalHeader | Site nav | CMS nav ✓; inline flex wrapper; no mobile toggle |
| `components/index.tsx` — LocalCard | Listing card | Clean structure; inline seller column; not keyboard-accessible |
| `components/index.tsx` — LocalFooter | Footer | FooterMenuColumn × 2 ✓; social links ✓; nearly all else inline; JS hover handlers |
| `ProductPage.tsx` | Listing detail + inquiry | Gallery fully inline; form labels missing id/htmlFor; otherwise well structured |
| `InquiryConfirmationPage.tsx` | Post-inquiry | Not audited — likely thin |
| `ExplorePage.tsx` | Browse page | Not audited |
| `Layout.tsx` | Theme shell | Minimal — correct |
| `styles.css` | Styles | Solid; will grow significantly after extraction |
