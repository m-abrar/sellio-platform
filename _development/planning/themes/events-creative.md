# Theme Completion Plan: `events/creative`

**Priority:** #23 — Experimental arts/creative events; distinctive monochrome + lime aesthetic
**Theme path:** `apps/storefront/src/themes/events/creative/`
**Audit score:** 7/10 — solid CMS integration and clean skeletons; primary gaps are missing artist showcase section, heavy component inline styles, PulseHUD hardcoded stats, and missing `aria-expanded` on hamburger

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, Layout (likely — not confirmed)
- Components: CreativeHeader (hamburger ✓), ArtisanEventCard, PulseHUD, VibrantFooter (FooterMenuColumn × 3 ✓)
- Live API via `fetchEventsHome` + `resolveEventsFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `useThemeContent` for: hero eyebrow/title/description/CTA, collection eyebrow/title/description, lab eyebrow/title/description/capabilities (pipe-split ✓), sync title/description/CTA, footer brand/description/copyright
- Skeleton cards use only CSS classes — clean ✓
- `CatalogSyncAlert` ✓
- Event registry grid with linked cards
- Lab manifesto section with capabilities grid (pipe-split from `useThemeContent`)
- Sync/contact box with explore CTA

---

## Gaps & Issues to Fix

### 1. Primary Missing Feature: Artist/Speaker Showcase Section

The homepage flows: hero → Pulse HUD → event registry → lab manifesto. There is no artist/performer showcase, which is the primary visual differentiator the main plan calls for.

**Implementation:**

Add a new `ArtistCard` component and a showcase section between the event registry and the lab manifesto:

```tsx
// components/index.tsx
export const ArtistCard = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <div className="evc-artist-card">
    <div className="evc-artist-img-wrap">
      <img src={image} alt={name} className="evc-artist-img" loading="lazy" />
    </div>
    <div className="evc-label evc-artist-role">{role.toUpperCase()}</div>
    <h3 className="evc-artist-name">{name}</h3>
  </div>
);
```

```tsx
// Page.tsx
const artistsEyebrow = useThemeContent('artists.eyebrow', 'Featured Artists');
const artistsTitle   = useThemeContent('artists.title', 'This Season.');
const artist1Name    = useThemeContent('artists.artist_1_name', 'Aya Nakamura');
const artist1Role    = useThemeContent('artists.artist_1_role', 'Experimental Audio');
// ... × 4 artists total
```

- [ ] Create `ArtistCard` component in `components/index.tsx`
- [ ] Add `useThemeContent` keys: `artists.eyebrow`, `artists.title`, and per-artist: `artists.artist_N_name`, `artists.artist_N_role`, `artists.artist_N_image` × 4
- [ ] Add artists section to `Page.tsx` between the event registry and the lab section
- [ ] Add `.evc-artists-section`, `.evc-artists-header`, `.evc-artists-grid`, `.evc-artist-card`, `.evc-artist-img-wrap`, `.evc-artist-img`, `.evc-artist-role`, `.evc-artist-name` to `styles.css`
- [ ] Grid: 4 columns on desktop, 2 on tablet, 1 on mobile

---

### 2. Hero Visual Lift

The hero is text-only with a `evc-hero-glow` decorative element. The main plan calls for a "colorful hero." Consider:

- [ ] Add `useThemeMedia('hero.background_image', '')` — conditionally apply as a background image with a dark overlay if set
- [ ] OR add a `useThemeMedia('hero.image', '')` for a right-column visual element (artwork/event poster placeholder)
- [ ] Add CSS for `.evc-hero-visual` column if using image layout

---

### 3. `CreativeHeader` — Missing `aria-expanded` + Inline Styles

**Missing `aria-expanded` (lines 31–40):**
```tsx
<button 
  className={`evc-hamburger ${isOpen ? 'evc-hamburger-open' : ''}`}
  onClick={() => setIsOpen(!isOpen)}
  aria-label="Toggle Navigation"
>
```
- [ ] Add `aria-expanded={isOpen}`

**Logo link inline style (line 27):**
```tsx
<a href={...} className="evc-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
```
- [ ] Add `text-decoration: none; color: inherit;` to `.evc-logo` CSS; remove inline `style`

**`experimentModeStyle` constant (lines 11–16):** Used as spread `style={{ ...experimentModeStyle, ... }}` in both `MenuActionButtons` `renderItem` blocks (mobile + desktop). 

- [ ] Create `.evc-experiment-btn` CSS class: `font-size: 0.65rem; border: 1px solid var(--evc-lime); color: var(--evc-lime); cursor: pointer;`
- [ ] Create `.evc-experiment-btn--mobile { padding: 1rem 2rem; text-align: center; margin-top: 2rem; width: 100%; }` 
- [ ] Create `.evc-experiment-btn--desktop { padding: 0.5rem 1.5rem; }`
- [ ] Remove the `experimentModeStyle` JS constant
- [ ] Replace `style={{ ...experimentModeStyle, ... }}` with `className="evc-experiment-btn evc-experiment-btn--mobile"` and `"evc-experiment-btn evc-experiment-btn--desktop"` respectively

---

### 4. `Page.tsx` — Inline Styles to Extract

**Hero eyebrow label (line 79):** `style={{ marginBottom: '3rem' }}` → add to `.evc-hero .evc-label` or `.evc-hero-label` in CSS

**Hero title lime highlight (line 84):**
```tsx
<span style={{ color: 'var(--evc-lime)' }}>{line}</span>
```
→ `.evc-text-lime { color: var(--evc-lime); }` CSS class; used here and also in lab title (line 162) — add once, use both places

**Hero description `<p>` (line 88):**
```tsx
style={{ maxWidth: '750px', fontSize: '1.4rem', color: 'var(--evc-grey)', lineHeight: 1.8, marginTop: '4rem', fontWeight: 300 }}
```
→ `.evc-hero-description` CSS class

**Hero CTA wrapper (line 91):** `style={{ marginTop: '6rem' }}` → `.evc-hero-cta { margin-top: 6rem; }` in CSS

**Registry header row (lines 105–113):**
```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }}>
  <div className="evc-label" style={{ marginBottom: '1.5rem' }}>
  <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)' }}>
  <div style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1rem', color: '...', lineHeight: 1.8 }}>
```
→ `.evc-registry-header`, `.evc-registry-eyebrow`, `.evc-registry-title`, `.evc-registry-desc` CSS classes

**Alert slot spans (lines 117, 122):** `style={{ gridColumn: '1 / -1' }}` → add `grid-column: 1 / -1` to `.evc-alert-slot` CSS

**Lab section border-top (line 154):** `style={{ borderTop: '1px solid var(--evc-zinc)' }}` → `.evc-section--bordered { border-top: 1px solid var(--evc-zinc); }` modifier

**Lab content grid (line 155):**
```tsx
style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8rem', alignItems: 'center' }}
```
→ The `.evc-lab-content` class exists; add `display: grid; grid-template-columns: 1fr 1fr; gap: 8rem; align-items: center;` to CSS

**Lab eyebrow (line 157):** `style={{ marginBottom: '3rem' }}` → `.evc-lab-label { margin-bottom: 3rem; }` or target `.evc-lab-section .evc-label`

**Lab title heading (line 158):** `style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', marginBottom: '4rem' }}` → `.evc-lab-title` CSS class

**Lab title lime highlight (line 162):** Same `style={{ color: 'var(--evc-lime)' }}` → use `.evc-text-lime` (already created above)

**Lab description (line 166):**
```tsx
style={{ fontSize: '1.2rem', color: 'var(--evc-grey)', lineHeight: 1.8, marginBottom: '6rem', fontWeight: 300 }}
```
→ `.evc-lab-description` CSS class

**Lab capabilities grid (line 169):**
```tsx
style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}
```
→ `.evc-lab-capabilities` class exists; add CSS properties

**Capability items (line 171):**
```tsx
style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--evc-lime)', letterSpacing: '2px', fontFamily: 'var(--evc-mono)' }}
```
→ `.evc-capability-item` CSS class

**Sync box container (line 175):**
```tsx
style={{ background: '#111', border: '1px solid var(--evc-zinc)', padding: '6rem', borderRadius: '8px' }}
```
→ `.evc-sync-box` CSS class

**Sync title h3 (line 176):** `style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '2.5rem', color: 'white', letterSpacing: '-1.5px' }}` → `.evc-sync-title` CSS class

**Sync description (line 177):** `style={{ color: 'var(--evc-grey)', lineHeight: 1.8, marginBottom: '4rem' }}` → `.evc-sync-description` CSS class

**Sync CTA button (line 180):** `style={{ width: '100%', padding: '2rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}` → `.evc-btn-primary--block` modifier CSS class

**Spacer div (line 185):** `<div style={{ height: '10rem' }}></div>` → remove the div; add `padding-bottom: 10rem` to `.events-creative-theme` or the last section in CSS

---

### 5. Hardcoded Strings → `useThemeContent`

**PulseHUD values and labels (Page.tsx lines 98–100):**

| String | Suggested key |
|---|---|
| `'Active Events'` | `hud.stat_1_label` |
| `'84'` | `hud.stat_1_value` |
| `'Community Members'` | `hud.stat_2_label` |
| `'1,240'` | `hud.stat_2_value` |
| `'Satisfaction Rate'` | `hud.stat_3_label` |
| `'99.98%'` | `hud.stat_3_value` |

**Empty state (Page.tsx lines 136–139):**

| String | Suggested key |
|---|---|
| `'No Events Yet'` kicker | `empty.kicker` |
| `'No live events are published yet.'` | `empty.title` |
| `'Add event records in the admin panel...'` | `empty.description` |

**ArtisanEventCard (components/index.tsx):**
- `'Get Tickets →'` (line 103): → `useThemeContent('card.tickets_label', 'Get Tickets →')` or accept as prop
- `'2026'` hardcoded year in the status tag (line 98): → `new Date().getFullYear()`

---

### 6. `ArtisanEventCard` — Inline Styles + Accessibility

**Date label (line 99):**
```tsx
style={{ marginBottom: '1.5rem', fontSize: '0.55rem', color: 'var(--evc-grey)' }}
```
→ `.evc-card-date { margin-bottom: 1.5rem; font-size: 0.55rem; color: var(--evc-grey); }`

**Card title h3 (line 100):**
```tsx
style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '3.5rem', lineHeight: 1.1, letterSpacing: '-1.5px', color: 'white' }}
```
→ `.evc-card-title { font-size: 2.25rem; font-weight: 900; margin-bottom: 3.5rem; line-height: 1.1; letter-spacing: -1.5px; color: white; }`

**Card footer row (lines 102–105):**
```tsx
style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--evc-zinc)', paddingTop: '2.5rem' }}
```
→ `.evc-card-footer` class exists; add CSS properties

**Card arrow div (line 103):**
```tsx
style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--evc-lime)', letterSpacing: '2px' }}
```
→ `.evc-card-arrow` class exists; add CSS properties

**Card asterisk div (line 104):**
```tsx
style={{ fontSize: '1.5rem', opacity: 0.3 }}
```
→ `.evc-card-asterisk` class exists; add CSS properties
- [ ] Also add `aria-hidden="true"` to the `*` decorative character

**`◆` capability prefix (line 171):** Decorative symbol with no `aria-hidden`
- [ ] Add `aria-hidden="true"` to a wrapping `<span>` or use CSS `:before` content

---

### 7. `PulseHUD` — Inline Styles

**Value div (line 111):**
```tsx
style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'var(--evc-lime)', marginBottom: '1rem', letterSpacing: '-4px' }}
```
→ `.evc-hud-value { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 900; color: var(--evc-lime); margin-bottom: 1rem; letter-spacing: -4px; }` in CSS

**Label div (line 112):**
```tsx
style={{ fontSize: '0.6rem', color: 'var(--evc-grey)' }}
```
→ `.evc-hud-label { font-size: 0.6rem; color: var(--evc-grey); }` in CSS

---

### 8. `VibrantFooter` — Inline Styles + Copyright Year

**Footer logo link (line 129):**
```tsx
style={{ fontSize: '3rem', marginBottom: '3.5rem', display: 'block', textDecoration: 'none', color: 'inherit' }}
```
→ `.evc-footer-logo { font-size: 3rem; margin-bottom: 3.5rem; display: block; text-decoration: none; color: inherit; }` in CSS

**Footer description (line 130):**
```tsx
style={{ color: 'var(--evc-grey)', lineHeight: 2, fontSize: '1.1rem', maxWidth: '400px' }}
```
→ `.evc-footer-desc` CSS class

**FooterMenuColumn `renderTitle` inline style (lines 137, 144, 151):**
```tsx
renderTitle={(title) => <div className="evc-label" style={{ marginBottom: '3.5rem' }}>{title}</div>}
```
→ `.evc-footer-col-title { margin-bottom: 3.5rem; }` in CSS; change to `className="evc-label evc-footer-col-title"` on all 3 columns

**Footer bottom copyright (line 160):**
```tsx
style={{ opacity: 0.2, fontSize: '0.65rem' }}
```
→ `.evc-footer-copyright { opacity: 0.2; font-size: 0.65rem; }` in CSS

**Copyright year (line 123):** `'© 2026 Sellio. All rights reserved.'` hardcoded default
- [ ] Change default to `''`; render `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

**Social links `renderItem` (lines 167–169):**
```tsx
<span style={{ opacity: 0.2, fontSize: '0.65rem', cursor: 'pointer' }}>
  <a href={href} style={{ color: 'inherit', textDecoration: 'none' }}>{item.title}</a>
</span>
```
→ `.evc-footer-social-link { opacity: 0.2; font-size: 0.65rem; cursor: pointer; }` + `.evc-footer-social-link a { color: inherit; text-decoration: none; }` in CSS

---

### 9. `ProductPage.tsx` — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check event detail layout, speaker list, schedule, inline styles, ticket/RSVP form accessibility
- [ ] If a speaker/performer section exists here, use it as a reference for the homepage artist showcase

---

### 10. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Hero** (`evc-hero`): verify `evc-heading-xl` wraps cleanly at 375px; description text readable
- [ ] **Pulse HUD** (`evc-hud-section`): 3 stats in a row → verify stack or 2+1 on mobile
- [ ] **Event registry grid** (`evc-artisan-grid`): verify 1 column on mobile; card body readable
- [ ] **Artist showcase** (new): 4 columns → 2 on tablet, 1 on mobile
- [ ] **Lab section** (`evc-lab-content`): `1fr 1fr` grid → stack on mobile; sync box readable at 375px
- [ ] **Lab capabilities** (`evc-lab-capabilities`): `1fr 1fr` → verify on mobile
- [ ] **Footer grid** (`evc-footer-grid`): verify column collapse on mobile

---

### 11. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using event title and date
- [ ] `ExplorePage`: add title ("Browse Creative Events")

---

## Completion Checklist Summary

```
NEW FEATURE
  [ ] ArtistCard component in components/index.tsx
  [ ] Artist showcase section in Page.tsx (between registry + lab)
  [ ] useThemeContent keys: artists.eyebrow/title + N_name/N_role/N_image × 4
  [ ] CSS: .evc-artists-section, grid, card, image, name, role

HERO VISUAL LIFT
  [ ] useThemeMedia('hero.background_image') or hero.image
  [ ] CSS for visual element if adding image layout

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger
  [ ] Logo link: inline style → CSS (.evc-logo)
  [ ] experimentModeStyle JS constant → .evc-experiment-btn + modifier CSS classes

PAGE.TSX INLINE STYLES → CSS CLASSES
  [ ] Hero: label margin, lime highlight → .evc-text-lime, description, CTA wrapper
  [ ] Registry: header row, eyebrow, title, desc → CSS classes
  [ ] Alert slot: grid-column → CSS
  [ ] Lab section: border-top, content grid, eyebrow, title, lime highlight, description, capabilities grid, capability items
  [ ] Sync box: container, title, description, CTA button → CSS
  [ ] Spacer div: remove; use padding-bottom on wrapper

HARDCODED STRINGS → useThemeContent
  [ ] PulseHUD labels × 3 + values × 3
  [ ] Empty state: kicker, title, description
  [ ] Card 'Get Tickets →' → useThemeContent or prop
  [ ] Card '2026' year → new Date().getFullYear()

ARTISANEVENTCARD
  [ ] Date label → .evc-card-date CSS
  [ ] Title h3 → .evc-card-title CSS
  [ ] Footer row → .evc-card-footer CSS
  [ ] Arrow div → .evc-card-arrow CSS
  [ ] Asterisk div → .evc-card-asterisk CSS + aria-hidden
  [ ] ◆ prefix → aria-hidden span

PULSEHUD
  [ ] Value div → .evc-hud-value CSS
  [ ] Label div → .evc-hud-label CSS

VIBRANTFOOTER
  [ ] Footer logo → .evc-footer-logo CSS
  [ ] Footer desc → .evc-footer-desc CSS
  [ ] FooterMenuColumn renderTitle → .evc-footer-col-title CSS on all 3
  [ ] Footer copyright div → .evc-footer-copyright CSS
  [ ] Copyright: dynamic year fallback
  [ ] Social renderItem: inline → CSS

PAGES NOT YET AUDITED
  [ ] ProductPage.tsx

RESPONSIVE
  [ ] PulseHUD: stack on mobile
  [ ] Artist showcase: 2 cols on tablet, 1 on mobile
  [ ] Lab content: stack on mobile
  [ ] Footer: column collapse

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (title + date)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good useThemeContent; heavy inline styles in every section; PulseHUD values hardcoded |
| `components/index.tsx` — CreativeHeader | Site nav | Hamburger ✓; missing aria-expanded; logo inline; experimentModeStyle JS object |
| `components/index.tsx` — ArtisanEventCard | Event card | All body inline; 'Get Tickets →' hardcoded; 2026 hardcoded year; decorative chars no aria-hidden |
| `components/index.tsx` — PulseHUD | Stat display | All inline |
| `components/index.tsx` — VibrantFooter | Footer | FooterMenuColumn × 3 ✓; brand section inline; copyright year |
| `ProductPage.tsx` | Event detail | Not audited |
| `ExplorePage.tsx` | Event browse | Not audited |
| `styles.css` | Styles | 639 lines currently — will grow significantly |
