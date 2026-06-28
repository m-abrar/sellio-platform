# Theme Completion Plan: `jobs/blue_collar`

**Priority:** #27 — Trades/blue-collar job board; industrial dark/yellow aesthetic
**Theme path:** `apps/storefront/src/themes/jobs/blue_collar/`
**Audit score:** 6/10 — Good demo fallback and API integration; Page.tsx has strong `useThemeContent` coverage and solid accessibility patterns (`aria-labelledby` throughout); held back by hardcoded logo, hardcoded trade categories, hardcoded copyright, and missing certification badge

---

## What's Already Done

- `BlueCollarHeader`: hamburger, `MenuNav`, `MenuActionButtons` (both mobile + desktop)
- `BlueCollarJobCard`: title, company, location, type, wage, time display
- `BlueCollarFooter` with `FooterMenuColumn × 2` ✓
- Hero with search bar (2 inputs redirect to explore on focus)
- Trades grid (6 categories)
- Jobs listing grid with sort select
- Load more CTA button
- Employer CTA section
- `resolveJobsFailure` demo fallback ✓ + `useDemoFallbackAllowed` ✓
- `CatalogSyncAlert` ✓
- `aria-labelledby` on all major sections ✓ — standout accessibility pattern
- `useThemeContent` for: hero title/desc, trades title, jobs title/load-more label, CTA title/desc/button

---

## Gaps & Issues to Fix

### 1. Primary Missing Feature: Certification Badge Section

The main plan specifies a "Certification badge" section. Blue-collar platforms need trust signals around worker credentials: OSHA certification, electrician license, CDL, etc.

Proposed: a section between the jobs grid and employer CTA showing recognized certifications.

- [ ] Create `CertificationBadge` component: icon + label + issuing body
- [ ] Add "Recognized Certifications" section to `Page.tsx` between jobs and CTA
- [ ] `useThemeContent` keys: `certs.title`, `certs.description`, `certs.badge_N_label` × 5-6 (OSHA, CDL, Electrician License, Forklift, Plumbing, Welding)
- [ ] CSS: `.jbc-certs-section`, `.jbc-certs-grid`, `.jbc-cert-badge`, `.jbc-cert-icon`, `.jbc-cert-label`
- [ ] Emit badges as text + CSS icon shape (avoid emoji — icons without explicit `aria-hidden` are accessibility issues)

---

### 2. Brand Logo — Hardcoded, Not in `useThemeContent`

Both header AND footer hardcode the brand name directly in JSX:

**Header (components/index.tsx line 17):**
```tsx
<a href={themeLink('/')} className="jbc-logo">
  Trades<span>Work</span>
</a>
```

**Footer (components/index.tsx line 100–102):**
```tsx
<a href={themeLink('/')} className="jbc-logo" style={{ marginBottom: '1.5rem', display: 'block' }}>
  Trades<span>Work</span>
</a>
```

Neither uses `useThemeContent`.

- [ ] Add `const brandLabel = useThemeContent('header.brand_label', 'TradesWork')` to both `BlueCollarHeader` and `BlueCollarFooter`
- [ ] Render with: `{brandLabel}` (or split on a highlight character if a styled second word is desired)
- [ ] Remove hardcoded `Trades<span>Work</span>` from both

---

### 3. `BlueCollarHeader` — Missing `aria-expanded`

Hamburger button (lines 21–29): no `aria-expanded`.
- [ ] Add `aria-expanded={isOpen}` to the hamburger `<button>`

---

### 4. `MenuActionButtons renderItem` — Inline Styles

Both mobile (line 47) and desktop (line 59) `renderItem` callbacks use `<Link>` wrappers with inline styles:
```tsx
<Link href={...} style={{ textDecoration: 'none', width: '100%' }} onClick={onNavigate}>
<Link href={...} style={{ textDecoration: 'none' }} onClick={onNavigate}>
```
- [ ] Add `.jbc-action-link { text-decoration: none; }` and `.jbc-action-link--mobile { width: 100%; }` CSS classes

---

### 5. Hardcoded Strings → `useThemeContent`

**Trade categories (Page.tsx lines 89–92):**
```tsx
{['Construction', 'Manufacturing', 'Transportation', 'Maintenance', 'Warehousing', 'Energy'].map((trade) => (
  <a href={themeLink('/explore')} key={trade} className="jbc-trade-link">{trade}</a>
))}
```
→ `useThemeContent('trades.category_list', 'Construction|Manufacturing|Transportation|Maintenance|Warehousing|Energy')` pipe-split

**Hero search button (line 81):** `>Search</a>` — hardcoded
→ `useThemeContent('hero.search_button_label', 'Search')`

**Empty state (lines 127–131):**
```tsx
<div className="jbc-listing-kicker">No Jobs Yet</div>
<h3>No live jobs are published yet.</h3>
<p>Browse the explore page or add job records in the admin panel...</p>
<a ...>Explore jobs</a>
```
→ `useThemeContent` for kicker, title, description, and link label

**Sort options (lines 99–101):** `'Most Recent'`, `'Highest Wage'`, `'Closest to Me'` hardcoded
→ `useThemeContent('jobs.sort_recent_label', 'Most Recent')` etc.

**`BlueCollarJobCard` "View Job" button (line 89):** Hardcoded `'View Job'`
→ Accept `viewLabel` prop; pass `useThemeContent('card.view_label', 'View Job')` from Page.tsx

---

### 6. `BlueCollarFooter` — All Inline + Copyright Hardcoded

**Footer copyright** (line 123) — entirely hardcoded directly in JSX (not via `useThemeContent`):
```tsx
<div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', color: '#757575', fontSize: '0.85rem', textAlign: 'center', fontWeight: 500 }}>
  © 2026 Sellio. All rights reserved.
</div>
```
- [ ] Add `const footerCopyright = useThemeContent('footer.copyright', '')` to `BlueCollarFooter`
- [ ] Render `{footerCopyright || \`© ${new Date().getFullYear()} Sellio. All rights reserved.\`}`
- [ ] Move `borderTop`, `paddingTop`, `color`, `fontSize`, `textAlign`, `fontWeight` → `.jbc-footer-bottom` CSS class

**Footer grid (line 98):** `style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '3rem' }}` → `.jbc-footer-grid`

**Logo link (line 100):** `style={{ marginBottom: '1.5rem', display: 'block' }}` → `.jbc-footer-logo`

**Footer description (line 103):** `style={{ color: 'var(--jbc-text-muted)', fontWeight: 500, lineHeight: 1.6 }}` → `.jbc-footer-desc`

**`FooterMenuColumn` × 2 `renderTitle` callbacks (lines 107–109, 115–117):**
```tsx
renderTitle={(title) => (
  <h4 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>{title}</h4>
)}
```
→ Use `titleClassName="jbc-footer-col-title"` + add `.jbc-footer-col-title { text-transform: uppercase; font-weight: 900; margin-bottom: 1.5rem; font-size: 1.1rem; color: white; }` to `styles.css`

---

### 7. `Page.tsx` — Inline Styles

**Hero search button (line 81):** `style={{ border: 'none', margin: '4px', textDecoration: 'none' }}` → `.jbc-search-btn`

**Trades section `<section>` (line 86):** `style={{ backgroundColor: 'white' }}` → `.jbc-section.jbc-bg-white`

**Jobs section title (line 97):** `style={{ marginBottom: 0 }}` → add `margin-bottom: 0` to `.jbc-jobs-header .jbc-section-title` CSS

**Load more div (line 144):** `style={{ textAlign: 'center', marginTop: '3rem' }}` → `.jbc-load-more-row`

**Load more link (line 145):** `style={{ textDecoration: 'none' }}` → `.jbc-load-more-link { text-decoration: none; }`

**CTA description (line 151):** `style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 500 }}` → `.jbc-cta-desc`

**CTA link (line 152):** `style={{ fontSize: '1.25rem', padding: '1rem 3rem', textDecoration: 'none' }}` → `.jbc-cta-link`

**Empty state link (line 130):** `style={{ marginTop: '1.5rem', textDecoration: 'none', display: 'inline-block' }}` → `.jbc-empty-link`

---

### 8. `BlueCollarJobCard` — Inline Styles

**Action row (line 87):** `style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}` → `.jbc-card-action`

**"View Job" button (line 89):** `style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }}` → `.jbc-btn-sm` modifier

**Emoji icons:** `📍`, `⏱️`, `📅` — no `aria-hidden="true"`
- [ ] Add `aria-hidden="true"` to the icons; add `<span className="sr-only">Location:</span>` etc. for screen readers

---

### 9. Hero title — Conditional rendering pattern

**Page.tsx lines 69–74:**
```tsx
{heroTitle.includes('Pays Off.') ? (
  <>
    {heroTitle.replace('Pays Off.', '')}
    <span>Pays Off.</span>
  </>
) : heroTitle}
```
This relies on a hardcoded substring to detect the highlight. This is brittle — a CMS admin changing the default copy breaks the effect.

- [ ] Add `const heroHighlight = useThemeContent('hero.highlight', 'Pays Off.')` and use the standard split/Fragment pattern used across other themes

---

### 10. Industrial Hero Section

The main plan also mentions an "industrial hero section (only 646 CSS lines)." The hero exists but relies on an overlay (`jbc-hero-overlay`) without a background image. To make it visually distinctive:

- [ ] Add `useThemeMedia('hero.background_image', '/themes/jobs/blue_collar/hero.webp')` 
- [ ] Apply as CSS background via inline style (the dynamic URL pattern — acceptable): `style={{ backgroundImage: \`url('${heroBg}')\` }}`

---

### 11. Pages Not Yet Audited

- [ ] `ProductPage.tsx` — job detail page; check for application form
- [ ] `ExplorePage.tsx` — advanced filtering

---

## Completion Checklist Summary

```
PRIMARY FEATURE
  [ ] CertificationBadge component
  [ ] Certifications section in Page.tsx (between jobs + CTA)
  [ ] useThemeContent keys: certs.title, certs.description, certs.badge_N_label × 5-6
  [ ] CSS: jbc-certs-section, jbc-certs-grid, jbc-cert-badge

BRAND LOGO
  [ ] useThemeContent('header.brand_label') in BlueCollarHeader
  [ ] useThemeContent('header.brand_label') in BlueCollarFooter
  [ ] Remove hardcoded Trades<span>Work</span> from both

HEADER
  [ ] aria-expanded={isOpen} on hamburger
  [ ] MenuActionButtons renderItem Link wrapper → CSS class

HARDCODED STRINGS → useThemeContent
  [ ] Trade categories × 6 → pipe-split
  [ ] Hero search button 'Search'
  [ ] Empty state: kicker, h3, p, link
  [ ] Sort options × 3
  [ ] BlueCollarJobCard 'View Job' → prop

FOOTER
  [ ] useThemeContent for copyright + dynamic year
  [ ] Footer grid → .jbc-footer-grid CSS
  [ ] Logo link → .jbc-footer-logo CSS
  [ ] Desc → .jbc-footer-desc CSS
  [ ] FooterMenuColumn × 2: renderTitle → titleClassName + CSS
  [ ] Footer bottom → .jbc-footer-bottom CSS

PAGE.TSX — INLINE STYLES → CSS
  [ ] Hero search button padding/border/decoration → .jbc-search-btn
  [ ] Trades section bg-white → CSS modifier
  [ ] Jobs section title marginBottom → CSS
  [ ] Load more row → .jbc-load-more-row
  [ ] Load more link → CSS
  [ ] CTA desc inline → .jbc-cta-desc
  [ ] CTA link inline → .jbc-cta-link
  [ ] Empty state link → CSS

BLUECOLLERJOBCARD
  [ ] Action row → .jbc-card-action CSS
  [ ] 'View Job' button padding → .jbc-btn-sm CSS
  [ ] aria-hidden on emoji icons (📍, ⏱️, 📅)

HERO TITLE
  [ ] useThemeContent('hero.highlight') for standard split pattern

HERO VISUAL
  [ ] useThemeMedia('hero.background_image') for industrial background

PAGES NOT AUDITED
  [ ] ProductPage.tsx
  [ ] ExplorePage.tsx
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good `useThemeContent` + `aria-labelledby`; trade categories hardcoded; sort/empty hardcoded |
| `components/index.tsx` — BlueCollarHeader | Nav | Hardcoded logo; missing `aria-expanded`; renderItem inline |
| `components/index.tsx` — BlueCollarJobCard | Job card | Action row inline; 'View Job' hardcoded; emoji no `aria-hidden` |
| `components/index.tsx` — BlueCollarFooter | Footer | Copyright fully hardcoded; grid inline; renderTitle × 2 inline |
| `ProductPage.tsx` | Job detail | Not audited |
