# Theme Completion Plan: `jobs/tech`

**Priority:** #18 — Developer-focused job board; terminal UI aesthetic is a genuine differentiator
**Theme path:** `apps/storefront/src/themes/jobs/tech/`
**Audit score:** 7/10 — distinctive tech identity; primary gaps are missing mobile nav, dangerouslySetInnerHTML, inline styles throughout Page.tsx, and hardcoded filter labels

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, ApplicationConfirmationPage, Layout
- Components: TechHeader (CMS MenuNav + MenuUtilityNav + MenuActionButtons), TechJobCard, TechFooter (FooterMenuColumn × 2 ✓ + footer bottom nav via CMS MenuNav)
- Live API via `fetchJobsHome` + demo fallback via `resolveJobsFailure`
- `useThemeContent` for: hero title/highlight/description, search placeholder/button label, filter section titles (stack, type, location), collection count label, empty state text, explore-all label
- Filter system: tech stack tag pills (8 predefined stacks), job type checkboxes (full-time/contract/freelance), location checkboxes (remote worldwide/US-CA/EMEA) — all client-side
- Sort: Latest / Highest Paid (by salary numeric extraction)
- **Terminal-inspired UI**: `$` prompt in search box, `grep`-style placeholder, monospace fonts throughout — a distinctive identity
- `CatalogSyncAlert` for API errors

---

## Gaps & Issues to Fix

### 1. `Page.tsx` — `dangerouslySetInnerHTML` for `@keyframes pulse`

Lines 373–378:

```tsx
<style dangerouslySetInnerHTML={{ __html: `
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
`}} />
```

- [ ] Move to `styles.css` as `@keyframes jtPulse { ... }` (prefixed to avoid conflicts)
- [ ] Update the shimmer skeleton class to use `animation: jtPulse 1.5s infinite ease-in-out`
- [ ] Remove the `<style dangerouslySetInnerHTML>` element

---

### 2. `TechHeader` — No Mobile Nav Toggle

The header uses `className="jt-nav d-none d-md-flex"` (Bootstrap-style utility classes that may not exist in this theme's CSS). On narrow widths, the nav and action buttons have no mobile fallback — they're simply invisible.

- [ ] Add `[isOpen, setIsOpen]` state
- [ ] Add hamburger button with `aria-label="Toggle navigation"` and `aria-expanded={isOpen}`
- [ ] Wrap nav content with conditional `.jt-nav-open` class
- [ ] Remove `d-none d-md-flex` utility class from `MenuNav` (these don't exist in the theme CSS)
- [ ] Add `.jt-hamburger`, `.jt-hamburger-bar`, `.jt-hamburger-open`, `.jt-nav-open` to `styles.css`
- [ ] Desktop: hamburger is hidden; nav + utility links show at ≥768px

---

### 3. `TechHeader` — Header Actions Div Inline Style

Line 28: `<div style={{ display: 'flex', gap: '1rem' }}>` wrapping `MenuUtilityNav` + `MenuActionButtons`.

- [ ] Create `.jt-header-actions { display: flex; gap: 1rem; }` in `styles.css`

---

### 4. `TechFooter` — Inline Styles + Copyright Year

**Inline styles:**

| Element | Target class |
|---|---|
| Outer footer grid div (line 89) | `.jt-footer-grid` (add `display: grid; grid-template-columns: ...; gap: 3rem; margin-bottom: 3rem` to CSS) |
| Footer logo `<a>` (line 91) | `.jt-footer-logo` (add `margin-bottom: 1rem; display: block`) |
| Footer description `<p>` (line 94) | `.jt-footer-desc` |
| Footer bottom div (line 111) | `.jt-footer-bottom` |
| Footer bottom nav link renderItem (line 118) | `.jt-footer-bottom-link` (add `color: var(--jt-text-muted); text-decoration: none`) |

**Copyright year (line 85):**

```ts
const copyright = useThemeContent('footer.copyright', '© 2026 Sellio. All rights reserved.');
```

- [ ] Change default to `''`
- [ ] Render: `{copyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`

---

### 5. `Page.tsx` — Inline Styles to Extract

**Page wrapper (line 170):** `.jt-layout-base` class exists — move `padding: 0 6% 8rem; max-width: 1400px; margin: 0 auto` to CSS

**Hero section:**

| Element | Target class |
|---|---|
| Hero subtitle `marginTop: 2rem` (line 174) | Add to `.jt-hero-subtitle` CSS |
| Search box `marginTop: 3.5rem` (line 176) | Add to `.jt-search-box` CSS |
| Search `$` prompt div (line 177) | `.jt-search-prompt` |
| Search button `margin: 0.25rem` (line 191) | Add `margin: 0.25rem` to `.jt-search-input + .jt-btn` or `.jt-search-btn` CSS |

**Sidebar:**

| Element | Target class |
|---|---|
| Stack section wrapper (line 213) | `.jt-sidebar-section` |
| Stack tags wrapper (line 215) | `.jt-tag-group` |
| Stack tag active state (lines 221–226) | `.jt-tag--active { background: var(--jt-purple); color: white; border-color: var(--jt-purple); cursor: pointer; font-weight: 700; }` |
| Type/location section wrappers (lines 235, 275) | `.jt-sidebar-section` |
| All 6 filter `<label>` elements (lines 237–311) | `.jt-filter-label { display: block; color: var(--jt-text-muted); margin-bottom: 0.75rem; cursor: pointer; font-size: 0.9rem; }` |
| All 6 `<input type="checkbox">` elements | `.jt-filter-checkbox { accent-color: var(--jt-purple); margin-right: 0.5rem; }` |

**Main content:**

| Element | Target class |
|---|---|
| Results header div (line 317) | `.jt-results-header` |
| Results count div (line 318) | `.jt-results-count` |
| Count span `fontWeight: 800` (line 319) | Add `font-weight: 800` to `.jt-text-purple` CSS |
| Sort `<select>` (line 322) | `.jt-sort-select` |
| Loading skeleton cards (lines 345–350) | `.jt-job-card--loading { height: 140px; opacity: 0.6; background: var(--jt-bg-light); animation: jtPulse 1.5s infinite ease-in-out; }` |
| Job card link `<a>` (line 355) | `.jt-job-link` |
| Empty state container (line 361) | `.jt-empty-state` |
| Empty state h4 (line 362) | `.jt-empty-title` |
| Empty state p (line 363) | `.jt-empty-desc` |
| Explore all button row (line 367) | `.jt-explore-row` |

---

### 6. `TechJobCard` — Inline Style + Emoji Icons + Hardcoded "Apply"

**Inline styles:**

- Card outer div cursor (line 55): `style={{ cursor }}` → add `cursor: pointer` to `.jt-job-card` CSS (always; the `onClick` handler is the deciding factor)
- Job time div (line 74): `style={{ fontSize: '0.8rem', color: 'var(--jt-text-muted)' }}` → `.jt-job-time`

**Emoji icons in job meta (lines 69–71):**

```tsx
<span>📍 {location}</span>
<span>💼 {type}</span>
<span>💰 {salary}</span>
```

- [ ] Add `aria-hidden="true"` to each emoji span, or replace with inline SVG icons:

```tsx
<span><span aria-hidden="true">📍</span> {location}</span>
```

**Hardcoded "Apply" text (line 75):**

- [ ] Add `applyLabel` prop to `TechJobCard` (default `'Apply'`), or have `TechJobCard` call `useThemeContent('card.apply_label', 'Apply')` internally
- [ ] Update all call sites to pass the label if using a prop

---

### 7. `Page.tsx` — Hardcoded Filter Labels + Sort Options

**Filter checkbox labels:**

| String | Suggested key |
|---|---|
| `'Full-Time'` | `filters.type_full_time` |
| `'Contract'` | `filters.type_contract` |
| `'Freelance'` | `filters.type_freelance` |
| `'Remote Worldwide'` | `filters.loc_remote_worldwide` |
| `'Remote US/CA'` | `filters.loc_remote_us` |
| `'Remote EMEA'` | `filters.loc_remote_emea` |

**Sort options:**

- `'Latest'` → `useThemeContent('sort.latest', 'Latest')`
- `'Highest Paid'` → `useThemeContent('sort.highest_paid', 'Highest Paid')`

**Tech stack tags** (the 8-item array on line 216): These are fairly universal tech names and can remain hardcoded in code (they represent actual filter values, not UI copy). If desired, a `useThemeContent('filters.stack_tags', 'React,Next.js,...')` split approach could make them CMS-configurable. Not strictly required.

---

### 8. Mobile Fallback Styling (The Primary Original Gap)

The original plan flags "terminal UI needs mobile fallback styling." This covers two areas:

**Header (already captured in §2):** Add hamburger toggle — the most pressing gap.

**Page layout:** The sidebar + main content split (`.jt-layout`) needs to stack on mobile:
```css
@media (max-width: 767px) {
  .jt-layout { flex-direction: column; }
  .jt-sidebar { width: 100%; border-right: none; border-bottom: 1px solid var(--jt-border); }
}
```

**Search box:** At 375px, the `$` prompt + input + button should remain usable. May need to stack vertically.

**Filter sidebar tag group:** Stack tag pills wrap correctly on mobile (flex-wrap should handle it).

---

### 9. `ProductPage.tsx` + `ApplicationConfirmationPage.tsx` — Not Yet Audited

- [ ] Read `ProductPage.tsx` — check for inline styles, hardcoded text, and form label/input accessibility on the application form
- [ ] Read `ApplicationConfirmationPage.tsx` — verify it reads from the application snapshot and has a meaningful confirmation summary

---

### 10. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Header**: after adding hamburger, verify nav opens correctly on mobile
- [ ] **Sidebar + main layout** (`.jt-layout`): verify sidebar stacks above or collapses on mobile
- [ ] **Tech stack tags** (`.jt-tag-group`): verify pills wrap correctly
- [ ] **Filter checkbox labels**: verify touch targets are ≥44px
- [ ] **Search box**: verify `$` prompt + input + button layout at 375px
- [ ] **Job card grid** (`.jt-job-list`): verify cards are readable at narrow widths
- [ ] **Sort select**: verify it doesn't overflow on mobile

---

### 11. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using job title and company name
- [ ] `ApplicationConfirmationPage`: add title ("Application Submitted")

---

## Completion Checklist Summary

```
dangerouslySetInnerHTML REMOVAL
  [ ] Move @keyframes pulse → @keyframes jtPulse in styles.css
  [ ] Remove <style dangerouslySetInnerHTML> from Page.tsx

MOBILE NAV (Primary Original Gap)
  [ ] Add hamburger toggle to TechHeader
  [ ] aria-expanded + aria-label on hamburger button
  [ ] Remove d-none d-md-flex utility from MenuNav
  [ ] Add .jt-hamburger, .jt-hamburger-bar, .jt-nav-open to styles.css

HEADER
  [ ] Header actions div: style → .jt-header-actions CSS

FOOTER
  [ ] Footer grid, logo, desc, bottom div → CSS classes
  [ ] Footer bottom nav link: style → CSS class
  [ ] Copyright year: dynamic fallback

PAGE.TSX INLINE STYLES → CSS CLASSES
  [ ] Page wrapper: move to .jt-layout-base CSS
  [ ] Hero subtitle + search box marginTop → CSS
  [ ] Search prompt div → .jt-search-prompt
  [ ] Search button margin → CSS
  [ ] Sidebar sections → .jt-sidebar-section
  [ ] Stack tag group → .jt-tag-group
  [ ] Stack tag active state → .jt-tag--active CSS
  [ ] Filter labels × 6 → .jt-filter-label CSS
  [ ] Checkboxes × 6 → .jt-filter-checkbox CSS
  [ ] Results header, count, sort select → CSS classes
  [ ] Loading skeletons → .jt-job-card--loading
  [ ] Job link → .jt-job-link
  [ ] Empty state → CSS classes
  [ ] Explore row → .jt-explore-row

TECHJOBCARD
  [ ] Cursor → add to .jt-job-card CSS
  [ ] Time div → .jt-job-time CSS
  [ ] Emoji meta icons: add aria-hidden="true"
  [ ] "Apply" text → useThemeContent or prop

HARDCODED STRINGS → useThemeContent
  [ ] Filter checkbox labels × 6
  [ ] Sort option labels × 2

MOBILE LAYOUT
  [ ] .jt-layout: sidebar stacks above main on mobile
  [ ] .jt-sidebar: full-width on mobile
  [ ] Search box: responsive at 375px
  [ ] Tag pills: verify flex-wrap

PAGES NOT YET AUDITED
  [ ] ProductPage.tsx
  [ ] ApplicationConfirmationPage.tsx

RESPONSIVE
  [ ] Full layout at 375px, 768px, 1280px

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (job title + company)
  [ ] ApplicationConfirmationPage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage + filters | Good useThemeContent; dangerouslySetInnerHTML; heavy inline styles in sidebar + main |
| `components/index.tsx` — TechHeader | Site nav | CMS nav ✓; NO hamburger mobile toggle; header actions inline |
| `components/index.tsx` — TechJobCard | Job listing card | Clean; emoji meta icons; "Apply" hardcoded; time inline |
| `components/index.tsx` — TechFooter | Footer | FooterMenuColumn × 2 ✓; brand section inline; copyright year |
| `ProductPage.tsx` | Job detail + application | Not audited |
| `ApplicationConfirmationPage.tsx` | Post-application | Not audited |
| `ExplorePage.tsx` | Job browse | Not audited |
| `styles.css` | Styles | Will grow substantially after extraction |
