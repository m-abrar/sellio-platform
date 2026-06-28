# Theme Completion Plan: `events/festival`

**Priority:** #24 — Live festival platform; magenta/neon aesthetic, stage lineup grid already implemented
**Theme path:** `apps/storefront/src/themes/events/festival/`
**Audit score:** 7/10 — same structural pattern as `events/creative`; primary gaps are stage schedule + ticket pricing components, all the same inline-style and accessibility issues, and hero secondary CTA button fully inline

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, Layout (likely — not confirmed)
- Components: FestivalHeader (hamburger ✓), StageLineupCard, AtmosphereHUD, NexusFooter (FooterMenuColumn × 3 ✓)
- Live API via `fetchEventsHome` + `resolveEventsFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `useThemeContent` for: hero eyebrow/title/description/both CTAs, collection eyebrow/title/description, CTA eyebrow/title/highlight/description/button, footer brand/description/copyright
- `useThemeMedia` for hero background image ✓
- `ctaHighlight` pattern for inline keyword highlighting in CTA title ✓
- Skeleton cards use CSS classes — clean ✓
- `CatalogSyncAlert` ✓

---

## Gaps & Issues to Fix

### 1. Primary Missing Features: Stage Schedule + Ticket Pricing

The main plan calls for "Lineup grid + stage schedule + ticket pricing component." The lineup grid (the `StageLineupCard` event grid) is implemented. The other two are missing.

**Ticket Pricing Section (homepage addition):**

A tiered pricing display inserted before the CTA section. CMS-driven via `useThemeContent`:

```tsx
const pricingEyebrow = useThemeContent('pricing.eyebrow', 'Tickets & Passes');
const pricingTitle   = useThemeContent('pricing.title', 'Get Access.');

// Tier N: name, price, description, features (pipe-split), and CTA label
const tier1Name  = useThemeContent('pricing.tier_1_name', 'General Admission');
const tier1Price = useThemeContent('pricing.tier_1_price', '$129');
// ... tier 2 (VIP) and tier 3 (Platinum)
```

- [ ] Create `TicketTierCard` component in `components/index.tsx`
- [ ] Add pricing section to `Page.tsx` between the festival grid and the CTA section
- [ ] `useThemeContent` keys: `pricing.eyebrow`, `pricing.title`, and per-tier: `pricing.tier_N_name`, `pricing.tier_N_price`, `pricing.tier_N_desc`, `pricing.tier_N_features`, `pricing.tier_N_cta_label` × 3 tiers
- [ ] Middle tier (VIP) highlighted with magenta border/badge
- [ ] Add `.eff-pricing-section`, `.eff-pricing-grid`, `.eff-tier-card`, `.eff-tier-card--featured`, `.eff-tier-name`, `.eff-tier-price`, `.eff-tier-features`, `.eff-tier-cta` to `styles.css`

**Stage Schedule Section (optional — on ProductPage):**

A day-by-day or stage-by-stage schedule for specific events. Best implemented on `ProductPage.tsx`:

- [ ] Read `ProductPage.tsx` — check if a schedule/lineup section exists
- [ ] If missing: add a `StageSchedule` component showing time slots and acts in a timeline layout

---

### 2. `FestivalHeader` — Missing `aria-expanded` + Inline Styles + `vibeSyncStyle` Constant

**Missing `aria-expanded` (lines 31–40):** Same pattern as `events/creative`.
- [ ] Add `aria-expanded={isOpen}` to the hamburger button

**Logo link inline style (line 27):**
```tsx
<a href={...} className="eff-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
```
- [ ] Add `text-decoration: none; color: inherit;` to `.eff-logo` CSS

**`vibeSyncStyle` JS constant (lines 11–16):** Same pattern as `events/creative` `experimentModeStyle`:
```tsx
const vibeSyncStyle = {
  fontSize: '0.65rem',
  border: '1px solid var(--eff-magenta)',
  color: 'var(--eff-magenta)',
  cursor: 'pointer',
} as const;
```
Used spread in both `MenuActionButtons` `renderItem` blocks (lines 60, 76).

- [ ] Create `.eff-vibe-btn` CSS class: `font-size: 0.65rem; border: 1px solid var(--eff-magenta); color: var(--eff-magenta); cursor: pointer;`
- [ ] Create `.eff-vibe-btn--mobile { padding: 1rem 2rem; text-align: center; margin-top: 2rem; width: 100%; }` and `.eff-vibe-btn--desktop { padding: 0.5rem 2rem; }`
- [ ] Remove `vibeSyncStyle` JS constant; replace with className on both renderItem divs
- [ ] Link outer wrappers: `style={{ textDecoration: 'none', ... }}` (lines 57, 73) → `.eff-header-link { text-decoration: none; }` or move decoration to child element

---

### 3. `Page.tsx` — Hero: Significant Inline Styles

**Hero content wrapper (line 104):** `style={{ position: 'relative', zIndex: 2 }}` → `.eff-hero-content { position: relative; z-index: 2; }` in CSS

**Hero eyebrow (line 105):** `style={{ marginBottom: '3rem', color: 'white' }}` → add to `.eff-hero .eff-mono` or `.eff-hero-eyebrow` CSS

**Hero description `<p>` (line 114):**
```tsx
style={{ marginTop: '5rem', fontSize: '1.5rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: '700px', margin: '5rem auto 0', fontWeight: 300 }}
```
→ `.eff-hero-description` CSS class

**Hero buttons row (line 117):**
```tsx
style={{ marginTop: '7rem', display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap' }}
```
→ `.eff-hero-buttons` class already exists — add CSS properties

**Hero secondary CTA button (lines 119–134):** Entire button style inline — 11 CSS properties including background, border, color, padding, fontWeight, textTransform, cursor, fontFamily, fontSize, letterSpacing, textDecoration, display:
- [ ] Create `.eff-btn-ghost` CSS class with all these properties in `styles.css`
- [ ] Replace the long `style={{...}}` with `className="eff-btn-ghost"`

---

### 4. `Page.tsx` — Registry Section Inline Styles

**Registry section header row (line 148):**
```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8rem' }} className="eff-section-header">
```
→ `.eff-section-header` class exists — add CSS properties

**Registry eyebrow (line 150):** `style={{ marginBottom: '1.5rem' }}` → add to `.eff-section-header .eff-mono` in CSS

**Registry title (line 151):** `style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)' }}` → `.eff-registry-title` CSS class

**Registry title last-line highlight (line 155):** `style={{ color: 'var(--eff-magenta)' }}` → `.eff-text-magenta { color: var(--eff-magenta); }` CSS class

**Registry desc div (line 160):**
```tsx
style={{ textAlign: 'right', maxWidth: '400px', fontSize: '1.1rem', color: 'var(--eff-grey)', lineHeight: 1.8, fontWeight: 300 }}
```
→ `.eff-registry-desc` CSS class

**Alert slots (lines 167, 172):** `style={{ gridColumn: '1 / -1' }}` → add `grid-column: 1 / -1` to `.eff-alert-slot` CSS

---

### 5. `Page.tsx` — CTA Section: All Inline

The entire CTA section (line 204–223) is inline:

```tsx
<section style={{ marginTop: '20rem', padding: '15rem 8%', background: '#050505', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at center, ...)' }}></div>
  <div style={{ position: 'relative', zIndex: 1 }}>
    <div className="eff-mono" style={{ marginBottom: '4rem' }}>
    <h2 style={{ fontSize: 'clamp(...)', marginBottom: '4rem' }}>
    ... <span style={{ color: 'var(--eff-magenta)' }}>
    <p style={{ maxWidth: '800px', margin: '0 auto 8rem', fontSize: '1.5rem', ... }}>
    <a style={{ padding: '2rem 8rem', display: 'inline-block', textDecoration: 'none' }}>
```

- [ ] Move to `.eff-cta-section { margin-top: 20rem; padding: 15rem 8%; background: #050505; ... }` CSS class
- [ ] `.eff-cta-overlay { position: absolute; inset: 0; background: radial-gradient(...); }`
- [ ] `.eff-cta-content { position: relative; z-index: 1; }`
- [ ] `.eff-cta-eyebrow { margin-bottom: 4rem; }` (on `.eff-mono` in this context)
- [ ] `.eff-cta-title { font-size: clamp(3.5rem, 8vw, 7.5rem); margin-bottom: 4rem; }`
- [ ] `.eff-text-magenta { color: var(--eff-magenta); }` (same class from §4)
- [ ] `.eff-cta-description { max-width: 800px; margin: 0 auto 8rem; font-size: 1.5rem; color: var(--eff-grey); line-height: 1.8; font-weight: 300; }`
- [ ] `.eff-btn-primary--block { padding: 2rem 8rem; display: inline-block; text-decoration: none; }`

**Spacer div (line 225):** `<div style={{ height: '15rem' }}></div>` → remove; use `padding-bottom: 15rem` on `.events-festival-theme` or last section in CSS

---

### 6. Hardcoded Strings → `useThemeContent`

**AtmosphereHUD (Page.tsx lines 141–143):**

| String | Suggested key |
|---|---|
| `'Global Attendees'` | `hud.stat_1_label` |
| `'500K+'` | `hud.stat_1_value` |
| `'Festival Stages'` | `hud.stat_2_label` |
| `'142'` | `hud.stat_2_value` |
| `'Satisfaction Rate'` | `hud.stat_3_label` |
| `'99%'` | `hud.stat_3_value` |

**AtmosphereHUD colors (lines 141–143):** The `color` prop is passed as literal CSS var strings. Consider:
- Option A: Keep as-is (allows per-stat color customization — acceptable)
- Option B: Add `useThemeContent('hud.stat_N_color', 'var(--eff-magenta)')` for each — makes it CMS-configurable

**Empty state (Page.tsx lines 186–189):**

| String | Suggested key |
|---|---|
| `'No Events Yet'` kicker | `empty.kicker` |
| `'No live events are published yet.'` | `empty.title` |
| `'Add event records in the admin panel...'` | `empty.description` |

**StageLineupCard (components/index.tsx line 104):** `'Get Tickets →'` hardcoded
→ Accept `ticketsLabel` prop; pass from Page.tsx with `useThemeContent('card.tickets_label', 'Get Tickets →')`

---

### 7. `StageLineupCard` — Inline Styles

**Card overlay (line 99):**
```tsx
style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4rem', background: 'linear-gradient(to top, #000 0%, transparent 100%)' }}
```
→ `.eff-card-content` class exists — add CSS properties

**Date div (line 100):** `style={{ marginBottom: '1.5rem', color: 'var(--eff-magenta)' }}` → `.eff-card-date` CSS class

**Title h3 (line 101):**
```tsx
style={{ fontSize: '2.5rem', fontWeight: 900, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-2px', color: 'white' }}
```
→ `.eff-card-title` CSS class

**Action row (line 103):** `style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}` → `.eff-card-action` class exists — add CSS properties

**Action text (line 104):** `style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px', color: 'white' }}` → `.eff-action-text` class exists — add CSS properties

**Action line (line 105):** `style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.3)' }}` → `.eff-action-line` class exists — add CSS properties

---

### 8. `AtmosphereHUD` — All Inline Styles

**Outer div (line 112):** `style={{ textAlign: 'center' }}` → `.eff-hud-block` class exists — add CSS

**Value div (line 113):**
```tsx
style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 900, color: color, marginBottom: '0.5rem', letterSpacing: '-5px' }}
```
The `color` must stay inline (dynamic prop). Move all other properties to `.eff-hud-value` CSS class:
```css
.eff-hud-value { font-size: clamp(3rem, 7vw, 5rem); font-weight: 900; margin-bottom: 0.5rem; letter-spacing: -5px; }
```
Keep `style={{ color: color }}` for the dynamic color only.

**Label div (line 114):** `style={{ opacity: 0.4, fontSize: '0.65rem', color: 'white' }}` → `.eff-hud-label` CSS class

---

### 9. `NexusFooter` — Inline Styles + Copyright Year

Identical pattern to `VibrantFooter` in `events/creative`:

| Element | Action |
|---|---|
| Footer logo link (line 131) | `.eff-footer-logo` CSS class |
| Footer description `<p>` (line 132) | `.eff-footer-desc` CSS class |
| FooterMenuColumn `renderTitle` × 3 (lines 139, 147, 155) | `.eff-footer-col-title { color: var(--eff-magenta); margin-bottom: 3.5rem; }` + use class |
| Footer bottom copyright (line 162) | `.eff-footer-copyright { opacity: 0.2; font-size: 0.65rem; color: white; }` |
| Social `renderItem` span (line 169) | `.eff-footer-social-link` CSS class |
| Social `renderItem` link (line 170) | `.eff-footer-social-link a { color: inherit; text-decoration: none; }` |

**Copyright year (line 125):** `'© 2026 Sellio. All rights reserved.'` hardcoded default
- [ ] Change default to `''`; render `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

---

### 10. `ProductPage.tsx` — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check for:
  - Stage schedule / lineup display (acts, times, stages)
  - Ticket pricing tiers
  - Inline styles, hardcoded strings, accessibility
- [ ] If stage schedule is missing on ProductPage: implement as described in §1

---

### 11. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Hero** (`ef-hero`): full-screen background image + text — verify text readable at 375px; avoid text-over-light-image contrast issues
- [ ] **Hero buttons** (`eff-hero-buttons`): flex-wrap is set — verify two buttons stack on mobile
- [ ] **Atmosphere HUD** (`eff-hud-section`): 3 stats → verify wrap at tablet/mobile
- [ ] **Festival lineup grid** (`ef-festival-grid`): verify 1–2 columns on mobile; card overlay readable on small screens
- [ ] **Ticket pricing grid** (new): verify 1 column on mobile with featured tier highlighted
- [ ] **CTA section**: `padding: 15rem 8%` → verify not oversized on mobile (may need responsive padding reduction)
- [ ] **Footer grid** (`eff-footer-grid`): verify column collapse on mobile

---

### 12. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using event title and date
- [ ] `ExplorePage`: add title ("Browse Festival Events")

---

## Completion Checklist Summary

```
NEW FEATURES
  [ ] TicketTierCard component: 3 pricing tiers (GA, VIP, Platinum)
  [ ] Ticket pricing section in Page.tsx (before CTA)
  [ ] useThemeContent keys: pricing section title + tier N × 3 (name, price, desc, features, CTA)
  [ ] CSS: .eff-pricing-section, .eff-pricing-grid, .eff-tier-card, .eff-tier-card--featured
  [ ] Audit ProductPage for stage schedule; add StageSchedule if missing

HEADER
  [ ] Add aria-expanded={isOpen} to hamburger
  [ ] Logo link: inline style → CSS (.eff-logo)
  [ ] vibeSyncStyle JS constant → .eff-vibe-btn + modifier CSS classes
  [ ] Link wrappers: inline text-decoration → CSS

PAGE.TSX — HERO INLINE STYLES → CSS CLASSES
  [ ] Hero content wrapper → .eff-hero-content
  [ ] Hero eyebrow → CSS
  [ ] Hero description → .eff-hero-description
  [ ] Hero buttons row → .eff-hero-buttons CSS
  [ ] Hero secondary CTA → .eff-btn-ghost (11 properties)

PAGE.TSX — REGISTRY INLINE STYLES → CSS CLASSES
  [ ] Registry header row → .eff-section-header CSS
  [ ] Registry eyebrow margin → CSS
  [ ] Registry title font-size → .eff-registry-title
  [ ] Registry title highlight → .eff-text-magenta CSS
  [ ] Registry desc → .eff-registry-desc
  [ ] Alert slots → .eff-alert-slot grid-column CSS

PAGE.TSX — CTA SECTION ALL INLINE → CSS CLASSES
  [ ] CTA section → .eff-cta-section CSS
  [ ] CTA overlay → .eff-cta-overlay CSS
  [ ] CTA content wrapper → .eff-cta-content CSS
  [ ] CTA eyebrow, title, highlight, desc, button → CSS classes
  [ ] Spacer div → padding-bottom on wrapper; remove div

HARDCODED STRINGS → useThemeContent
  [ ] AtmosphereHUD: labels × 3, values × 3
  [ ] Empty state: kicker, title, description
  [ ] StageLineupCard 'Get Tickets →' → prop from Page.tsx

STAGELINEUPCARD
  [ ] Card overlay → .eff-card-content CSS
  [ ] Date div → .eff-card-date CSS
  [ ] Title h3 → .eff-card-title CSS
  [ ] Action row, text, line → CSS (classes exist; add properties)

ATMOSPHEREHUD
  [ ] Value div: move non-color properties → .eff-hud-value CSS
  [ ] Label div → .eff-hud-label CSS

NEXUSFOOTER
  [ ] Logo link → .eff-footer-logo CSS
  [ ] Description → .eff-footer-desc CSS
  [ ] FooterMenuColumn renderTitle × 3 → .eff-footer-col-title CSS
  [ ] Footer bottom copyright → .eff-footer-copyright CSS
  [ ] Copyright: dynamic year fallback
  [ ] Social renderItem → .eff-footer-social-link CSS

PAGES NOT YET AUDITED
  [ ] ProductPage.tsx

RESPONSIVE
  [ ] Hero: text readable on mobile
  [ ] Hero buttons: stack on mobile
  [ ] CTA section: padding reduction on mobile
  [ ] Ticket pricing: 1 col on mobile
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
| `Page.tsx` | Homepage | Good useThemeContent; hero + registry + CTA all inline; HUD values hardcoded |
| `components/index.tsx` — FestivalHeader | Site nav | Hamburger ✓; missing aria-expanded; logo inline; vibeSyncStyle JS constant |
| `components/index.tsx` — StageLineupCard | Event card | All body inline; 'Get Tickets →' hardcoded |
| `components/index.tsx` — AtmosphereHUD | Stat display | All inline; dynamic color prop (acceptable) |
| `components/index.tsx` — NexusFooter | Footer | FooterMenuColumn × 3 ✓; brand section inline; copyright year |
| `ProductPage.tsx` | Event detail | Not audited — stage schedule + ticket pricing check |
| `ExplorePage.tsx` | Event browse | Not audited |
| `styles.css` | Styles | Will grow significantly |
