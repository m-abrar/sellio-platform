# Theme Completion Plan: `events/music`

**Priority:** #7 — Festival/music platforms; strong visual identity, booking flow already wired
**Theme path:** `apps/storefront/src/themes/events/music/`
**Audit score:** 8.5/10 — feature-complete, but 473 CSS lines for 7 pages means heavy inline styles throughout

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, BookingPage, BookingReservePage, BookingConfirmationPage, BookingConfirmPage
- Components in use: SonicHeader, VoltageFooter, LineupGrid, PulseExperience
- Live API integration in Page.tsx and ProductPage.tsx with demo fallback and `CatalogSyncAlert`
- `useThemeContent` + `useThemeMedia` throughout: hero, metrics bar, lineup labels, experience section, footer, brand label
- Booking flow: `redirectToEventBookingReserve` wired in ProductPage; shared subpages handle the rest
- ExplorePage delegates to shared `EventsExplorePage` component with music-specific card renderer
- Hamburger nav with mobile open/close in SonicHeader
- CMS menu integration: `MenuNav`, `FooterMenuColumn`, `MenuActionButtons`
- Skeleton loading states on homepage lineup grid

---

## Gaps & Issues to Fix

### 1. Dead Code — Delete Three Components

None of these are exported from `components/index.ts` or imported anywhere:

**`MusicHeader.tsx`** — Legacy header with hardcoded `SELLIO_SOUND.` logo, `href="#"` nav links, and a fully inline-styled `GET_ACCESS` button. Replaced by `SonicHeader.tsx`.

**`MusicFooter.tsx`** — Legacy footer with hardcoded `SELLIO_SOUND` logo, `© 2026 SELLIO_SOUND_FESTIVAL. ALL RIGHTS RESERVED.`, `POWERED_BY_STYLETIME_ENGINE` tagline, and non-functional `<span>` links. Replaced by `VoltageFooter.tsx`.

**`ArtistPoster.tsx`** — A card component with `artist-poster` class, exported from its own file but not from `components/index.ts` and not used anywhere in the theme.

- [ ] Delete `MusicHeader.tsx`
- [ ] Delete `MusicFooter.tsx`
- [ ] Delete `ArtistPoster.tsx`

---

### 2. Inline Styles — Move to CSS Classes (Primary Work Item)

CSS is only **473 lines** for a 7-page theme. Almost all visual layout is written as `style={{...}}` in JSX. Below are the specific extractions needed.

**`Page.tsx`**

| Element | Current approach | Target class |
|---|---|---|
| Hero overlay (line 93) | `style={{ position: absolute, inset: 0, background: rgba(0,0,0,0.7), backdropFilter: blur... }}` | `.sonic-hero-overlay` |
| Hero inner wrapper (line 94) | `style={{ position: relative, zIndex: 2 }}` | `.sonic-hero-inner` |
| Hero eyebrow (line 95) | Full `style={{...}}` with font, color, letterSpacing | `.sonic-hero-eyebrow` |
| Hero description (line 104) | `style={{ maxWidth, margin, fontSize, color, lineHeight }}` | `.sonic-hero-description` |
| Hero CTA row (line 107) | `style={{ display: flex, gap, marginTop, justifyContent, flexWrap }}` | `.sonic-hero-actions` |
| Secondary CTA `<a>` (lines 110–114) | Full inline button style (border, color, padding, borderRadius, boxShadow...) | `.sonic-btn-outline` |
| Metrics bar section (line 120) | `style={{ padding, display, justifyContent, alignItems, background, border, color, fontSize, fontWeight, letterSpacing }}` | `.sonic-metrics-bar` |
| Metrics left group (line 126) | `style={{ display: flex, gap }}` | `.sonic-metrics-left` |
| Lineup section header (line 133) | `style={{ padding, textAlign }}` | `.sonic-lineup-header` |
| Lineup eyebrow (line 134) | `style={{ fontSize, fontWeight, color, letterSpacing, textTransform }}` | `.sonic-section-eyebrow` |
| Lineup h2 (line 135) | `style={{ fontFamily, fontSize, fontWeight, marginTop, textTransform, letterSpacing }}` | `.sonic-lineup-title` |
| Support section (line 186) | `style={{ padding, textAlign }}` | `.sonic-support-header` |
| Gallery section (line 196) | `style={{ padding }}` | `.sonic-gallery-section` |
| Gallery h2 (line 197) | `style={{ fontFamily, fontSize, fontWeight, textAlign, marginBottom, textTransform, color, textShadow }}` | `.sonic-gallery-title` |
| Gallery grid (line 198) | `style={{ display: grid, gridTemplateColumns, gap }}` | `.sonic-gallery-grid` |
| Gallery item (line 200) | `style={{ borderRadius, overflow, border, transition }}` | `.sonic-gallery-item` |
| Gallery image (line 201) | `style={{ width, height, objectFit }}` | handled by `.sonic-gallery-item img` |
| CTA section (line 208) | `style={{ padding, textAlign, position, overflow }}` | `.sonic-cta-section` |
| CTA glow (line 209) | `style={{ position: absolute, radial-gradient... }}` | `.sonic-cta-glow` |
| CTA h2 (line 210) | `style={{ fontFamily, fontSize, fontWeight, marginBottom, letterSpacing, textTransform, lineHeight }}` | `.sonic-cta-title` |
| CTA description (line 218) | `style={{ maxWidth, margin, fontSize, color, lineHeight }}` | `.sonic-cta-description` |

**`Page.tsx` — Remove `dangerouslySetInnerHTML` (lines 121–125)**

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  @media (max-width: 1024px) {
      .jt-metrics { display: none !important; }
  }
` }} />
```

Responsive CSS injected inline via `dangerouslySetInnerHTML`. This is an anti-pattern — it bypasses CSP, renders on every mount, and can't be overridden by theme CSS.

- [ ] Move this media query to `styles.css`
- [ ] Remove the `<style dangerouslySetInnerHTML>` element entirely

**`PulseExperience.tsx`**

| Element | Target class |
|---|---|
| Section grid (line 18) | `.pulse-experience-grid` |
| Copy column (line 19) | `.pulse-experience-copy` |
| Eyebrow span (line 20) | `.pulse-experience-eyebrow` |
| Stats row (line 27) | `.pulse-experience-stats` |
| Stat item (line 28 / 31) | `.pulse-stat-item` |
| Stat value (line 29 / 33) | `.pulse-stat-value` |
| Stat label (line 30 / 34) | `.pulse-stat-label` |
| Visual column (line 38) | `.pulse-experience-visual` |
| Corner decoration (line 39) | `.pulse-experience-corner` |
| Image container (line 40) | `.pulse-experience-img-wrap` |
| Callout overlay (line 43) | `.pulse-experience-callout` |
| Callout text (line 44) | `.pulse-experience-callout-text` |

**`VoltageFooter.tsx`**

| Element | Target class |
|---|---|
| Footer column grid (line 18) | `.voltage-footer-grid` |
| Brand column (line 19) | `.voltage-footer-brand` |
| Brand description (line 21) | `.voltage-footer-desc` |
| Column title `renderTitle` (lines 28, 36, 44) | `.voltage-footer-col-title` (pass as className instead of inline style) |
| Footer bottom bar (line 50) | `.voltage-footer-bottom` |
| Copyright text (line 51) | `.voltage-footer-copyright` |
| Social span (lines 58–60) | `.voltage-footer-social-item` |

**`ExplorePage.tsx` event card info items (lines 62–68)**

```tsx
<div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 900, marginBottom: '0.5rem' }}>
<div className="artist-name">{headliner.name}</div>
<div style={{ fontSize: '0.85rem', color: 'var(--neon-pink)', fontWeight: 800, marginTop: '1rem' }}>
```

The overlay gradient (line 70) is also inline.

- [ ] `.evm-card-event-title`, `.evm-card-date`, `.evm-card-gradient` → CSS classes

- [ ] Extract all inline styles listed above into named classes in `styles.css`

---

### 3. Hardcoded Strings — Wrap in `useThemeContent`

**`PulseExperience.tsx` stat block (lines 29–36)**

```tsx
<div ...>100%</div>
<div ...>Verified Access</div>
<div ...>Global</div>
<div ...>Event Network</div>
```

Four user-visible strings that bypass the content system.

- [ ] Wrap in `useThemeContent`: `experience.stat_1_value`, `experience.stat_1_label`, `experience.stat_2_value`, `experience.stat_2_label`

**`ProductPage.tsx` section headings and labels (lines 175, 182, 185, 176)**

| Hardcoded string | Suggested key |
|---|---|
| `"Performance Details"` (line 175) | `detail.info_heading` |
| `"Get Your Tickets"` (line 182) | `detail.ticket_heading` |
| `"Access reserved locally."` (line 185) | `detail.success_message` |
| Fallback description (line 176) | `detail.fallback_description` |

- [ ] Wrap all four in `useThemeContent`

---

### 4. `VoltageFooter.tsx` — Copyright Year

Line 51:

```tsx
<div ...>© 2026 Sellio. All rights reserved.</div>
```

Hardcoded year and brand name; not in `useThemeContent`.

- [ ] Replace with: `useThemeContent('footer.copyright', '')` and render `{copyright || \`© ${new Date().getFullYear()}. All rights reserved.\`}`

---

### 5. `LineupGrid.tsx` — Document the Static Demo Approach

The "Supporting Acts / Sonic Support" section renders 8 hardcoded artists (name, genre, image path) from a static array. This is intentional — there is no natural API concept of "supporting acts" separate from the event listings.

**Decision: keep it as curated demo content, but make the data editable.**

- [ ] Wrap each artist name, genre in `useThemeContent`: `lineup.artist_1_name`, `lineup.artist_1_genre`, etc.
- [ ] The image paths (`/themes/events/music/21.webp` through `28.webp`) are static assets in `public/themes/events/music/` — these are fine as-is for demo; wrap the image sources in `useThemeMedia` keys so store owners can swap them
- [ ] If no content keys are configured, default to the existing values

---

### 6. Booking Flow Verification

Layout.tsx imports `@/themes/events/shared/subpages.css`. BookingPage, BookingReservePage, BookingConfirmationPage, and BookingConfirmPage all delegate to shared components.

- [ ] Confirm `sonic-` CSS class prefix used by this theme matches what shared subpages CSS expects
- [ ] Walk through the full booking flow manually: ProductPage → BookingReservePage → BookingPage → BookingConfirmationPage → BookingConfirmPage
- [ ] Confirm back-links and completion routing are correct

---

### 7. Accessibility

**`ProductPage.tsx` form labels (lines 188–190)**

```tsx
<label>Name<input required type="text" ... /></label>
<label>Email<input required type="email" ... /></label>
<label>Tickets<input type="number" ... /></label>
```

Wrapping inputs in labels is valid HTML, but without `id`+`htmlFor` some screen readers don't correctly associate the label text. Also the label text is just `Name` / `Email` / `Tickets` — no `<span>` separation.

- [ ] Add `id` to each `<input>` and `htmlFor` to each `<label>`: `name-input`, `email-input`, `tickets-input`

**`PulseExperience.tsx` image (line 41)**

```tsx
<img src={image} alt="" style={{ ... opacity: 0.6 }} />
```

`alt=""` is correct for decorative images, but `aria-hidden="true"` should also be added.

- [ ] Add `aria-hidden="true"` to the experience section image

**`Page.tsx` metrics bar** (line 120)

Already has `aria-label="System Metrics"` — correct.

**`SonicHeader.tsx` hamburger toggle** (line 22)

Has `aria-label="Toggle Navigation"` — but `aria-expanded` is missing.

- [ ] Add `aria-expanded={isOpen}` to the hamburger button

---

### 8. Responsive Review (Test at 375px, 768px, 1280px)

With only 473 CSS lines and most layout inline, these areas need verification:

- [ ] **Hero section**: full-width background image; CTA row with `flex-wrap: wrap` — confirm buttons stack on mobile
- [ ] **Metrics bar**: has `.jt-metrics { display: none }` at 1024px (after moving to CSS) — confirm this hides correctly and the right BPM value still shows
- [ ] **Lineup grid** (`.lineup-grid`): verify CSS class defines responsive columns (2 on tablet, 1 on mobile)
- [ ] **PulseExperience**: `gridTemplateColumns: repeat(auto-fit, minmax(300px, 1fr))` — verify stacks cleanly on mobile and the corner decoration doesn't bleed out
- [ ] **Gallery grid**: `repeat(auto-fill, minmax(300px, 1fr))` — verify minimum one column on 375px
- [ ] **CTA section**: `padding: 15rem 6%` is very tall; on mobile this may push content far down — verify visual comfort
- [ ] **VoltageFooter**: `repeat(auto-fit, minmax(200px, 1fr))` — verify 4 columns collapse to 2/1 correctly on mobile
- [ ] **ProductPage**: `.sonic-detail-grid` sidebar layout — verify sidebar stacks below main on mobile

---

### 9. SEO Metadata

- [ ] Verify the Next.js route exports `metadata` with `title` and `description`
- [ ] `ProductPage` should use `generateMetadata` to populate event title and date in the page `<title>`
- [ ] `ExplorePage` should have a descriptive title ("Browse Music Events")

---

## Completion Checklist Summary

```
DEAD CODE
  [ ] Delete MusicHeader.tsx
  [ ] Delete MusicFooter.tsx
  [ ] Delete ArtistPoster.tsx

INLINE STYLES → CSS CLASSES (primary work)
  [ ] Page.tsx: hero overlay, inner wrapper, eyebrow, description, actions,
      secondary CTA button, metrics bar, metrics group, lineup/support headers,
      lineup/support titles, gallery section/grid/items, CTA section/glow/title/desc
  [ ] Remove <style dangerouslySetInnerHTML> block; move media query to styles.css
  [ ] PulseExperience.tsx: grid, copy column, eyebrow, stats row, stat items,
      visual column, corner, image wrap, callout
  [ ] VoltageFooter.tsx: grid, brand column, description, col titles, bottom bar,
      copyright, social items
  [ ] ExplorePage.tsx: event card title, date, gradient overlay

HARDCODED STRINGS → useThemeContent
  [ ] PulseExperience.tsx: 4 stat values and labels
  [ ] ProductPage.tsx: detail.info_heading, detail.ticket_heading,
      detail.success_message, detail.fallback_description

LINEUP GRID
  [ ] Wrap 8 × (name, genre) in useThemeContent
  [ ] Wrap 8 × image in useThemeMedia

FOOTER
  [ ] Copyright → dynamic year with useThemeContent fallback

BOOKING FLOW
  [ ] Confirm CSS prefix alignment with shared subpages.css
  [ ] Walk full booking flow manually

ACCESSIBILITY
  [ ] ProductPage form: add id + htmlFor to all label/input pairs
  [ ] PulseExperience image: add aria-hidden="true"
  [ ] SonicHeader hamburger: add aria-expanded={isOpen}

RESPONSIVE
  [ ] 375px: hero CTA wrap, metrics bar hide, lineup grid, experience grid,
      gallery grid, footer columns, detail sidebar
  [ ] 768px: same
  [ ] 1280px: same

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (event title + date)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Heavy inline styles; `dangerouslySetInnerHTML` style block to remove |
| `components/SonicHeader.tsx` | Site nav | Clean; add `aria-expanded` |
| `components/VoltageFooter.tsx` | Footer | Inline styles; hardcoded copyright year |
| `components/LineupGrid.tsx` | Supporting acts grid | Static demo data; wrap in useThemeContent/useThemeMedia |
| `components/PulseExperience.tsx` | Experience/about section | Inline styles; 4 hardcoded stat strings |
| `components/MusicHeader.tsx` | **DELETE** | Dead code — replaced by SonicHeader |
| `components/MusicFooter.tsx` | **DELETE** | Dead code — replaced by VoltageFooter |
| `components/ArtistPoster.tsx` | **DELETE** | Dead code — unused card component |
| `ProductPage.tsx` | Event detail + ticket form | Solid; 4 hardcoded labels; form accessibility gaps |
| `ExplorePage.tsx` | Event catalog | Delegates to shared; 3 inline card styles |
| `BookingPage.tsx` | Payment step | Delegates to shared — verify CSS alignment |
| `BookingReservePage.tsx` | Reserve step | Delegates to shared — verify CSS alignment |
| `BookingConfirmationPage.tsx` | Confirmation step | Delegates to shared — verify CSS alignment |
| `BookingConfirmPage.tsx` | Confirmed step | Delegates to shared — verify CSS alignment |
| `Layout.tsx` | Theme shell | Imports shared subpages.css — correct |
| `styles.css` | 473 lines | Very thin; will grow significantly after inline style extraction |
