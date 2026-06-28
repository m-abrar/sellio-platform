# Theme Completion Plan: `jobs/startup`

**Priority:** #6 — Tech startup job boards in high demand; equity visualization is a strong differentiator
**Theme path:** `apps/storefront/src/themes/jobs/startup/`
**Audit score:** 8.5/10 — feature-complete, but most layout is inline styles rather than CSS classes

---

## What's Already Done

- Full page suite: Homepage, ProductPage (job detail), ExplorePage, ApplicationConfirmationPage
- Components: GrowthHeader, NetworkFooter, OpportunityGrid/OpportunityCard, MissionControlSection
- Live API integration in all pages with demo fallback and `CatalogSyncAlert`
- `useThemeContent` used for hero, stats, mission section, and footer content
- Application form with auth flow: login / register / submit in one panel
- Equity visualization: progress bar rendering equity range on job detail sidebar
- "Load more" infinite scroll pagination on ExplorePage
- Filter sidebar: category, location, workplace type, experience level — all API-driven
- CMS menu integration: header uses `MenuNav`, footer uses `FooterCol` with CMS menus + fallback
- Tag cloud (tech stack) on job detail page
- Related jobs section on job detail page
- Skeleton loading states on OpportunityGrid

---

## Gaps & Issues to Fix

### 1. Inline Styles — Move to CSS Classes (Primary Work Item)

The CSS file has only **569 lines** for a 5-page theme with multiple components. Almost all layout is written as `style={{...}}` directly in JSX. This:
- Makes the theme impossible to customise via CSS overrides
- Inflates component files with visual noise
- Breaks the CodeCanyon convention buyers expect

The work is straightforward: extract each `style={{...}}` block into a named class in `styles.css`. Below are the specific locations.

**`Page.tsx`**

| Section | Current | Target class |
|---|---|---|
| Eyebrow span (line 76) | `style={{ fontFamily, fontSize, color, letterSpacing... }}` | `.growth-hero-eyebrow` |
| Hero description (line 85) | `style={{ maxWidth, fontSize, color, lineHeight... }}` | `.growth-hero-description` |
| CTA button row (line 88) | `style={{ display: flex, gap }}` | `.growth-hero-actions` |
| Trust band section (line 98) | `style={{ padding, display, justifyContent, background, borderTop... }}` | `.growth-trust-band` |
| Stats section (line 105) | `style={{ padding, display, justifyContent, gap }}` | `.growth-stats-row` |
| Each stat div (lines 106–117) | `style={{ textAlign: center }}` | `.growth-stat-item` |
| Stat value (lines 107, 111, 115) | `style={{ fontSize, fontWeight, color, fontFamily }}` | `.growth-stat-value` |
| Stat label (lines 108, 112, 116) | `style={{ fontSize, color, fontWeight, letterSpacing, marginTop }}` | `.growth-stat-label` |
| CTA section (line 135) | `style={{ padding, textAlign, position, overflow }}` | `.growth-cta-section` |
| CTA glow (line 136) | `style={{ position: absolute... radial-gradient... }}` | `.growth-cta-glow` |
| CTA heading (line 137) | `style={{ fontSize, fontWeight, fontFamily, marginBottom, letterSpacing }}` | `.growth-cta-heading` |
| CTA description (line 145) | `style={{ maxWidth, margin, fontSize, color }}` | `.growth-cta-description` |

**`MissionControlSection.tsx`**

| Element | Target class |
|---|---|
| Section wrapper | `.growth-mission-section` |
| Two-column grid | `.growth-mission-grid` |
| Copy column | `.growth-mission-copy` |
| Eyebrow span | `.growth-mission-eyebrow` |
| Heading | `.growth-mission-heading` |
| Description | `.growth-mission-description` |
| Metric grid | `.growth-mission-metrics` |
| Visual column | `.growth-mission-visual` |
| Corner bracket (top-left) | `.growth-mission-corner` |
| Image container | `.growth-mission-img-wrap` |

**`ProductPage.tsx`**

| Section | Target class |
|---|---|
| Loading state wrapper | `.growth-loading-state` |
| Not-found state wrapper | `.growth-notfound-state` |
| Detail header inner (breadcrumb row) | `.growth-detail-breadcrumb` |
| Company logo + title row | `.growth-detail-title-row` |
| Company logo box | `.venture-logo-box` |
| Main content panel | `.growth-detail-description` |
| Spec grid cards (title + value) | already `.growth-spec-title` / `.growth-spec-value` — verify CSS exists |
| Tags section | `.growth-detail-tags` |
| Tag items | `.growth-tag-chip` |
| Financial package label | `.growth-sidebar-section-label` |
| Salary display | `.growth-salary-value` |
| Salary period | `.growth-salary-period` |
| Equity bar wrapper | `.growth-equity-bar-wrap` |
| Equity bar fill | `.growth-equity-bar-fill` |
| Related jobs section | `.growth-related-section` |
| Related jobs grid | `.growth-related-grid` |

**`NetworkFooter.tsx`**

| Element | Target class |
|---|---|
| Logo + description column | `.network-footer-brand` |
| Footer description paragraph | `.network-footer-desc` |
| Social icon row | `.network-footer-social` |
| Individual social icon link | `.network-footer-social-btn` |
| Footer bottom bar | `.network-footer-bottom` |
| Copyright text | `.network-footer-copyright` |
| "Built for Builders." tagline | `.network-footer-tagline` |

**`ExplorePage.tsx`**

| Element | Target class |
|---|---|
| Explore header block | `.growth-explore-header` |
| Explore eyebrow | `.growth-explore-eyebrow` |
| Explore heading | `.growth-explore-heading` |
| Explore description | `.growth-explore-description` |
| Load more button row | `.growth-load-more-row` |

- [ ] Extract all inline styles listed above into named CSS classes in `styles.css`
- [ ] After extraction, verify each class name is present in `styles.css` and visually matches the original

---

### 2. Dead Code — Delete `VentureCard.tsx`

`components/VentureCard.tsx` defines a `VentureCard` component with its own `venture-card`, `venture-logo`, `venture-title` etc. classes. Nothing in the theme imports or renders it — the actual job cards are `OpportunityCard` in `OpportunityGrid.tsx`. It's a leftover from an earlier design iteration.

- [ ] Delete `components/VentureCard.tsx`
- [ ] Remove its export from `components/index.ts`

---

### 3. Hardcoded Strings — Wrap in `useThemeContent`

**`Page.tsx` trust band (line 100)**

```tsx
<span>New Roles Daily</span>
```

One of the four trust band spans is hardcoded while the other three use `useThemeContent`.

- [ ] Add `useThemeContent('trust.new_roles_text', 'New Roles Daily')` and use it

**`ExplorePage.tsx` explore header (lines 146–154)**

The explore page heading and description are hardcoded inline:
```tsx
<div ...>Discover Opportunities</div>
<h1 ...>Venture Catalog.</h1>
<p ...>Search and filter thousands of roles...</p>
```

- [ ] Wrap in `useThemeContent`: `explore.eyebrow`, `explore.heading`, `explore.description`

**`ProductPage.tsx` section labels (multiple lines)**

| Hardcoded string | Suggested key |
|---|---|
| `"Mission Overview"` (line 249) | `detail.mission_heading` |
| `"Role Specifications"` (line 257) | `detail.specs_heading` |
| `"Tech Stack"` (line 282) | `detail.tags_heading` |
| `"Financial Package"` (line 309) | `detail.compensation_label` |
| `"Initialize Growth Node"` (line 333) | `detail.apply_heading` |
| `"Submit your candidate node details..."` (line 335) | `detail.apply_description` |
| `"Related Nodes."` (line 411) | `detail.related_heading` |

- [ ] Wrap all seven strings in `useThemeContent` with the suggested keys and current text as defaults

**`NetworkFooter.tsx` tagline (line 109)**

```tsx
<span style={{ color: 'rgba(255,255,255,0.2)' }}>Built for Builders.</span>
```

Hardcoded; not in `useThemeContent`.

- [ ] Wrap in `useThemeContent('footer.tagline', 'Built for Builders.')`

---

### 4. `MissionControlSection.tsx` — Image and Alt Text

**External Unsplash default (line 17)**

```ts
const image = useThemeMedia('mission.image', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072');
```

The fallback is a third-party CDN URL. If Unsplash is unavailable or the URL expires, the section breaks silently.

- [ ] Add a local placeholder asset to `assets/` (a dark abstract or tech-themed image)
- [ ] Change the default to point to the local asset; keep `useThemeMedia` so store owners can still override it

**Alt text hardcoded (line 49)**

```tsx
<img src={image} alt="Space Tech" ... />
```

- [ ] Replace with `useThemeContent('mission.image_alt', 'Mission visual')`

---

### 5. `NetworkFooter.tsx` — Social Icon Links

All four social icons (LinkedIn, X, GitHub, Instagram) link to `href="#"` (line 94). They're non-functional placeholders.

- [ ] Replace each `href="#"` with `useThemeContent` keys: `social.linkedin_url`, `social.x_url`, `social.github_url`, `social.instagram_url`
- [ ] Default each to `''`; render the icon only if the value is non-empty
- [ ] Remove the inline `onMouseEnter`/`onMouseLeave` hover handlers — move hover styling to CSS (`:hover` rule on `.network-footer-social-btn`)

---

### 6. Footer Copyright Year

`NetworkFooter.tsx` line 74:

```ts
const footerCopyright = useThemeContent('footer.copyright', '© 2026 Sellio. All rights reserved.');
```

The default has a hardcoded year. A store owner who never sets this key will always see "2026".

- [ ] Change the default to `''` and render: `{footerCopyright || \`© ${new Date().getFullYear()}. All rights reserved.\`}`

---

### 7. Responsive Review (Test at 375px, 768px, 1280px)

Given the thin CSS, these areas are most likely to need fixes:

- [ ] **Homepage stats row**: `display: flex; gap: 8rem` with 3 stat blocks — will overflow at 375px; needs `flex-wrap: wrap` or a media query switching to a 2-column grid
- [ ] **Homepage trust band**: `display: flex; justifyContent: space-between` with 4 spans — will be very tight on mobile; needs wrapping or stacking
- [ ] **MissionControlSection**: `gridTemplateColumns: '1.2fr 1fr'` — needs a `@media` breakpoint to go single-column on mobile
- [ ] **ProductPage detail grid** (`.growth-details-grid`): sidebar below main on mobile — verify the CSS class has a stacking breakpoint
- [ ] **ProductPage spec grid** (`.growth-spec-grid`): 2×2 grid — verify it collapses to 1 column on 375px
- [ ] **ExplorePage layout** (`.growth-explore-layout`): sidebar + main — verify sidebar becomes a top filter bar or collapses on mobile
- [ ] **Related jobs section on ProductPage**: `gridTemplateColumns: 'repeat(3, 1fr)'` — needs 1-column on mobile (currently hardcoded via `style={{}}`)
- [ ] **OpportunityCard**: verify card minimum width is not set in a way that causes horizontal scroll

---

### 8. Accessibility

- [ ] **`ProductPage.tsx` auth/apply form** — `<label>` wraps `<input>` without `htmlFor`; this pattern is valid HTML but add `id` + `htmlFor` for explicit association to ensure screen reader compatibility
- [ ] **`OpportunityCard`** — the "APPLY" span (line 52) renders as `<span>` inside a `<Link>`. The link itself is the clickable element — the span is purely visual. This is correct; no change needed, but confirm the `Link` has sufficient accessible text (the job title is present in the card)
- [ ] **`MissionControlSection`** — image has `opacity: 0.3` (line 49); it's decorative in context but should have `aria-hidden="true"` if it conveys no information beyond decoration
- [ ] **`GrowthHeader`** — `MenuNav` and `MenuActionButtons` render navigation; confirm there's a `<nav>` landmark wrapping the menu

---

### 9. SEO Metadata

- [ ] Verify the Next.js route for this theme exports a `metadata` object with `title` and `description`
- [ ] `ProductPage` should have `generateMetadata` using the job title and company name
- [ ] `ExplorePage` should have a descriptive title (e.g. "Browse Startup Jobs")

---

### 10. Minor Polish

**`Page.tsx` secondary CTA is duplicate** (line 92)

```tsx
<a href={themeLink('/explore')} className="growth-btn-outline">
  {heroSecondaryCta}
</a>
```

Both primary and secondary CTAs link to `/explore`. The secondary should link to a different destination (e.g. `/explore?workplace=remote`, or a jobs-by-category page) to give it meaning.

- [ ] Update secondary CTA href to `themeLink('/explore?workplace=remote')` or similar, or make it a `useThemeContent` URL key

**`ProductPage.tsx` success state emoji (line 342)**

```tsx
<div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
```

Emoji in component code. Acceptable for a startup-themed product but flag for the QA pass.

- [ ] Optionally replace with an SVG check/success icon to match the rest of the theme's icon style

---

## Completion Checklist Summary

```
INLINE STYLES → CSS CLASSES (primary work)
  [ ] Page.tsx: eyebrow, description, actions, trust band, stats row, stat items, CTA section
  [ ] MissionControlSection.tsx: all layout and visual elements
  [ ] ProductPage.tsx: loading/notfound states, detail header, title row, tags, compensation, equity bar, related section
  [ ] NetworkFooter.tsx: brand column, social row, bottom bar
  [ ] ExplorePage.tsx: explore header block

DEAD CODE
  [ ] Delete VentureCard.tsx
  [ ] Remove from components/index.ts

HARDCODED STRINGS → useThemeContent
  [ ] Page.tsx: trust.new_roles_text
  [ ] ExplorePage.tsx: explore.eyebrow, explore.heading, explore.description
  [ ] ProductPage.tsx: 7 section labels
  [ ] NetworkFooter.tsx: footer.tagline

MISSION SECTION
  [ ] Add local fallback asset; update useThemeMedia default
  [ ] mission.image_alt → useThemeContent

FOOTER
  [ ] Social icon hrefs → useThemeContent (× 4); hide if empty
  [ ] Move social hover effects to CSS :hover
  [ ] Copyright year → dynamic fallback

RESPONSIVE
  [ ] Stats row: flex-wrap on mobile
  [ ] Trust band: wrap/stack on mobile
  [ ] MissionControlSection: single-column breakpoint
  [ ] ProductPage detail grid: sidebar stacks below
  [ ] ProductPage spec grid: 1 column on 375px
  [ ] ExplorePage filter sidebar: collapse on mobile
  [ ] Related jobs grid: 1 column on mobile

ACCESSIBILITY
  [ ] Apply form: add id + htmlFor to all label/input pairs
  [ ] MissionControlSection image: add aria-hidden="true"
  [ ] Verify GrowthHeader nav landmark

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (job title + company)
  [ ] ExplorePage title

MINOR
  [ ] Secondary CTA href: differentiate from primary
  [ ] Success emoji: optionally replace with SVG icon
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Solid content; heavy inline styles to extract |
| `components/GrowthHeader.tsx` | Site nav | Clean; uses MenuNav + useThemeContent |
| `components/NetworkFooter.tsx` | Footer | Social icons placeholder; copyright year; tagline hardcoded |
| `components/MissionControlSection.tsx` | Mission/about section | External image URL; alt hardcoded; inline styles |
| `components/OpportunityGrid.tsx` | Job card grid + skeleton | Clean; OpportunityCard uses Link correctly |
| `components/VentureCard.tsx` | **DELETE** | Dead code — unused legacy card component |
| `ProductPage.tsx` | Job detail + apply form | Full auth flow; 7 hardcoded labels; inline styles throughout |
| `ExplorePage.tsx` | Search + filter | Solid; explore header not in useThemeContent |
| `ApplicationConfirmationPage.tsx` | Post-apply confirmation | Delegates to shared component — correct |
| `styles.css` | 569 lines | Thin; most layout is inline — needs class extraction |
