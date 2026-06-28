# Theme Completion Plan: `classifieds/general`

**Priority:** #13 — General classifieds; chat widget is a genuine differentiator; solid filter + favorites UX
**Theme path:** `apps/storefront/src/themes/classifieds/general/`
**Audit score:** 7/10 — functional core; primary gaps are missing breadcrumb/saved-search features, mobile nav, and minor inline styles

---

## What's Already Done

- Full page suite: Homepage (catalog + sidebar), ProductPage, InquiryConfirmationPage, Layout
- Components: GeneralHeader (CMS MenuUtilityNav + MenuActionButtons), ListingCard, GeneralFooter (CMS MenuNav footer bar)
- Live API via `fetchClassifiedsHome` + `resolveClassifiedsFailure` demo fallback
- `useThemeContent` for: sidebar titles, filter labels, collection headings, sort labels, empty state text, load more labels, chat placeholder
- Category sidebar with pills (API-driven + fallback to `GENERAL_DEMO_CATEGORIES`)
- Filters: local pickup checkbox, delivery checkbox, price range slider
- Sort: newest, price ASC, price DESC
- **Floating chat widget** — simulates seller messaging with mock 1.2s response
- Favorites/save toggle on each listing card
- `CatalogSyncAlert` for API errors
- Shimmer loading skeleton
- Client-side pagination (load more by 12)

---

## Gaps & Issues to Fix

### 1. New Feature: Category Filter Breadcrumb

When a category is selected, display a breadcrumb above the listing grid showing the path. Currently the heading changes to "{category} Showcase" but there's no breadcrumb navigation.

```tsx
// Insert above .cg-grid-header when selectedCategory !== 'all'
<nav className="cg-breadcrumb" aria-label="Category breadcrumb">
  <button type="button" onClick={() => setSelectedCategory('all')}>All Listings</button>
  <span className="cg-breadcrumb-sep" aria-hidden="true">›</span>
  <span>{categories.find(c => c.id === selectedCategory)?.name}</span>
</nav>
```

- [ ] Add `.cg-breadcrumb`, `.cg-breadcrumb-sep` to `styles.css`
- [ ] Insert the breadcrumb in `Page.tsx` above `.cg-grid-header` when `selectedCategory !== 'all'`
- [ ] The "All Listings" button in the breadcrumb calls `setSelectedCategory('all')` to navigate back

---

### 2. New Feature: Saved Search UI

A "Save this search" button below the filter sidebar that stores the current filter state to localStorage and shows a "Saved searches" panel with restore options.

**Save search button:**

```tsx
<button className="cg-save-search-btn" onClick={handleSaveSearch}>
  ⭐ {useThemeContent('search.save_label', 'Save this search')}
</button>
```

**Saved searches panel:**

```tsx
{savedSearches.length > 0 && (
  <div className="cg-saved-searches">
    <div className="cg-sidebar-title">{useThemeContent('search.saved_title', 'Saved Searches')}</div>
    {savedSearches.map((saved, i) => (
      <button key={i} className="cg-saved-search-pill" onClick={() => restoreSavedSearch(saved)}>
        {saved.label}
      </button>
    ))}
  </div>
)}
```

- [ ] Add `savedSearches` state (array of `{ label, filters }` objects)
- [ ] `handleSaveSearch`: saves current filter state to `localStorage.getItem('cg_saved_searches')` with a generated label (e.g. "{category} under ${maxPrice}")
- [ ] `restoreSavedSearch`: restores `selectedCategory`, `maxPrice`, `localPickupOnly`, `includesDelivery` from saved object
- [ ] Add `cg-save-search-btn`, `cg-saved-searches`, `cg-saved-search-pill` classes to `styles.css`

---

### 3. `GeneralHeader` — No Mobile Nav Toggle

The header uses `MenuUtilityNav` and `MenuActionButtons` but has no hamburger toggle for mobile. At narrow widths the nav links will overflow or be hidden.

- [ ] Add `[isNavOpen, setIsNavOpen]` state
- [ ] Add hamburger button with `aria-label="Toggle navigation"` and `aria-expanded={isNavOpen}`
- [ ] Wrap `<div className="cg-nav">` with conditional `cg-nav-open` class
- [ ] Add `.cg-hamburger`, `.cg-hamburger-bar`, `.cg-hamburger-open`, `.cg-nav-open` to `styles.css`

---

### 4. `GeneralFooter` — Copyright Year Bug

`components/index.tsx` lines 105–121:

```ts
const footerDescription = useThemeContent('footer.description', '2026 Sellio. All rights reserved.');
// renders as:
<p>© {footerDescription}</p>
// → "© 2026 Sellio. All rights reserved."
```

Two problems: (1) the `useThemeContent` key is `footer.description` but it contains copyright text — confusing semantic. (2) `footerDescription` starts with `2026` so `©` is prepended, resulting in `© 2026 Sellio.`

- [ ] Change key to `footer.copyright` with default `''`
- [ ] Render: `{copyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}` (no manual © prefix — include it in the content)
- [ ] Also consider adding a proper footer description field (`footer.description`) separate from copyright

---

### 5. Inline Styles to Extract

**`Page.tsx`**

| Element | Target class |
|---|---|
| Price range value span (line 270) | `.cg-range-value` |
| "Clear filters" button (lines 287–299) | `.cg-btn-clear` (with all its styles) |
| Sort header row (line 327) | `.cg-sort-row` |
| Sort label span (line 328) | `.cg-sort-label` |
| Sort `<select>` (lines 333–334) | `.cg-select` (already has className — add padding/border/radius to CSS) |
| Empty state emoji block (line 361) | `.cg-empty-icon` |
| Empty state heading (line 362) | `.cg-empty-title` |
| Empty state paragraph (line 363) | `.cg-empty-desc` |
| Listing link `<a>` (line 369) | `.cg-listing-link` (or add to `.cg-card` parent rule: `a { text-decoration: none; color: inherit; display: block; }`) |
| Load more row (line 387) | `.cg-load-more-row` |
| Load more button `minWidth` (line 392) | add `min-width: 220px` to `.cg-btn-outline` or `.cg-load-more-btn` |
| Chat message timestamp (lines 422–424) | `.cg-chat-timestamp` |

**`components/index.tsx` — GeneralHeader**

- Line 30: Search icon span inline → `.cg-search-icon` CSS class
- [ ] Replace emoji `🔍` with inline SVG search icon (or keep emoji with `aria-hidden="true"`)

**`components/index.tsx` — GeneralFooter**

- Line 119: `<p>` inline (color, fontSize, marginTop, fontWeight) → `.cg-footer-copyright`

**`components/index.tsx` — ListingCard**

- Line 67: `style={{ cursor: 'pointer' }}` → add `cursor: pointer` to `.cg-card` CSS

---

### 6. Emoji Icons — Add `aria-hidden` or Replace with SVG

Multiple places use emoji as icons without screen-reader hiding:

| Location | Emoji | Fix |
|---|---|---|
| `GeneralHeader` logo icon (line 25) | `📦` | `aria-hidden="true"` on `.cg-logo-icon` |
| `GeneralHeader` search icon (line 30) | `🔍` | Replace with SVG or add `aria-hidden="true"` |
| `Page.tsx` filter checkboxes (lines 254, 261) | `📍 📦` | `<span aria-hidden="true">📍</span>` |
| `Page.tsx` empty state (line 361) | `📦` | `aria-hidden="true"` on the span |
| `Page.tsx` sort options (line 335–337) | `🕒 💵 💵` | `aria-hidden` on emoji in option text (or use text-only options) |
| `ListingCard` seller avatar (line 79) | `👤` | `.cg-seller-avatar` — add `aria-hidden="true"` |
| `ListingCard` action buttons (lines 87, 95) | `✉️ ♥/♡` | Both buttons have `title` attributes — add `aria-label` instead and hide emoji with `aria-hidden` |

---

### 7. Chat Widget Accessibility

The floating chat widget (`cg-chat-widget`) has accessibility gaps:

- [ ] Add `role="dialog"` and `aria-label="Chat with seller"` to `.cg-chat-widget`
- [ ] Add `aria-label="Close chat"` to the close button (`×`)
- [ ] Change `id="cg-chat-body"` to also have `role="log"` and `aria-live="polite"` for screen reader announcements
- [ ] Move keyboard focus into the chat widget when it opens (focus the input field)

---

### 8. Mock Chat Response Text — `useThemeContent`

`Page.tsx` line 141–143:

```ts
text: `Hi! Yes, my ${activeChatListing.title} is still available. Would you like to schedule a quick meeting or coordinate delivery options?`
```

- [ ] Wrap the template string in `useThemeContent('chat.seller_greeting', 'Hi! Yes, my {title} is still available...')` with `{title}` placeholder substitution

---

### 9. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Header**: after adding hamburger, verify nav opens correctly on mobile
- [ ] **Layout** (`.cg-layout`): sidebar + main — verify sidebar moves to top on mobile or collapses
- [ ] **Category pills** (`.cg-category-list`): on mobile, verify pills wrap correctly
- [ ] **Chat widget**: at narrow widths, verify widget doesn't overflow the screen; may need `max-width: 100%; bottom: 0; right: 0; border-radius: 0` at small breakpoints
- [ ] **Card grid** (`.cg-grid`): verify 1–2 columns on mobile
- [ ] **Sort row**: verify label + select don't overflow on narrow widths

---

### 10. `ProductPage.tsx` + `ExplorePage.tsx` — Not Yet Audited

Quick audit recommended:

- [ ] Read `ProductPage.tsx` — check for inline styles, hardcoded strings, and whether the inquiry form has proper label/input associations
- [ ] Read `ExplorePage.tsx` — the homepage already has listing browsing; confirm ExplorePage adds value (may delegate to a shared component)

---

### 11. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` with listing title and price
- [ ] `InquiryConfirmationPage`: add title

---

## Completion Checklist Summary

```
NEW FEATURES
  [ ] Category breadcrumb: nav above listing grid when category selected
  [ ] Saved search: localStorage save/restore of current filter state

MOBILE NAV
  [ ] Add hamburger toggle to GeneralHeader
  [ ] Add aria-expanded + aria-label to hamburger button

FOOTER
  [ ] Fix footer.description → footer.copyright key
  [ ] Use dynamic year fallback

INLINE STYLES → CSS CLASSES
  [ ] Page.tsx: range value, clear-filters btn, sort row/label/select,
      empty state icon/title/desc, listing link, load-more row/btn, chat timestamp
  [ ] GeneralHeader: search icon → CSS class
  [ ] GeneralFooter: copyright paragraph → CSS class
  [ ] ListingCard: cursor: pointer → CSS class

EMOJI ICONS
  [ ] Add aria-hidden="true" to all decorative emoji spans
  [ ] Replace search icon emoji with SVG (or aria-hidden)
  [ ] Add aria-label to ListingCard action buttons (message, save)

CHAT WIDGET ACCESSIBILITY
  [ ] role="dialog", aria-label, aria-live="polite" on chat body
  [ ] aria-label on close button
  [ ] Focus trap: move focus to input when widget opens

CHAT MOCK RESPONSE
  [ ] Wrap seller greeting in useThemeContent

PRODUCT + EXPLORE PAGE
  [ ] Audit ProductPage.tsx for inline styles and hardcoded strings
  [ ] Confirm ExplorePage.tsx delegates or adds unique value

RESPONSIVE
  [ ] Mobile nav toggle
  [ ] Sidebar collapse on mobile
  [ ] Chat widget: full-width on narrow screens
  [ ] Card grid: 1-2 col mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + price)
  [ ] InquiryConfirmationPage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + browse + chat | Feature-rich; minor inline styles; breadcrumb + saved search missing |
| `components/UtilityHeader.tsx` (as GeneralHeader) | Site nav | CMS nav ✓; no mobile toggle; emoji search icon |
| `components/ListingGridCard.tsx` (as ListingCard) | Card | Clean; cursor inline; emoji action buttons need aria-label |
| `components/CommunityFooter.tsx` (as GeneralFooter) | Footer | CMS nav ✓; copyright key/year bug |
| `ProductPage.tsx` | Listing detail + inquiry | Not fully audited |
| `ExplorePage.tsx` | Browse page | Not audited — likely thin |
| `InquiryConfirmationPage.tsx` | Post-inquiry | Not audited |
| `Layout.tsx` | Theme shell | Minimal — correct |
| `styles.css` | Styles | Likely solid; needs breadcrumb + saved search + hamburger classes |
