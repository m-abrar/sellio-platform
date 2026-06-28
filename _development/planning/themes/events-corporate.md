# Theme Completion Plan: `events/corporate`

**Priority:** #12 — Corporate conferences and summits niche; clean ARIA handling, strong design
**Theme path:** `apps/storefront/src/themes/events/corporate/`
**Audit score:** 8/10 — feature-functional; primary gaps are hardcoded speaker/agenda data, missing sponsor row, and heavy inline styles

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, BookingPage, BookingReservePage, BookingConfirmationPage, BookingConfirmPage, Layout
- Components: Header (CMS MenuNav + MenuActionButtons), Footer (FooterNavColumn using `useMenu` + `MenuLink`; social links via `useThemeContent`), SpeakerCard, AgendaItem, EventCard, ShimmerCard
- Live API in Page.tsx via `fetchEventsHome`
- `useThemeContent` for all section headings, eyebrows, CTA labels, footer fields
- Client-side filtering (search, category, location, genre) from API results
- Dynamic stats bar (live event count, category count, city count from API)
- Featured event hero card (first API event, with fallback text)
- Social links in footer — correctly conditional (only shown if `useThemeContent` value is non-empty)
- Good ARIA: `aria-labelledby` on sections, `aria-label` on filter inputs, `role="status"` on empty state
- `CatalogSyncAlert` for API errors
- ShimmerCard skeleton loading
- Smooth scroll to agenda section on secondary CTA click

---

## Gaps & Issues to Fix

### 1. Hardcoded `speakers` Array — Wrap in `useThemeContent` / `useThemeMedia`

`Page.tsx` lines 45–50: 4 speakers with name, role, company, image are a static hardcoded array.

```ts
const speakers = [
  { name: 'Dr. Sarah Chen', role: 'Chief AI Officer', company: 'Nexus Logic', image: '/themes/events/corporate/1.webp' },
  ...
];
```

- [ ] Replace with `useThemeContent` / `useThemeMedia` per speaker:
  - `speakers.1.name`, `speakers.1.role`, `speakers.1.company`, `speakers.1.image` × 4 speakers
- [ ] Fallback to the current static values
- [ ] Pass each speaker's `useThemeMedia` image through `useThemeMedia('speakers.1.image', '/themes/events/corporate/1.webp')`

---

### 2. Hardcoded `agenda` Array — Wrap in `useThemeContent`

`Page.tsx` lines 52–57: 4 agenda sessions with time, title, speaker, track hardcoded.

```ts
const agenda = [
  { time: '09:00 AM', title: 'Opening Keynote: ...', speaker: 'Dr. Sarah Chen', track: 'KEYNOTE' },
  ...
];
```

- [ ] Wrap in `useThemeContent` per session:
  - `agenda.1.time`, `agenda.1.title`, `agenda.1.speaker`, `agenda.1.track` × 4 sessions
- [ ] Fall back to current values

---

### 3. New Component: `SponsorRow`

The original plan lists "sponsor row" as a missing component. Add between the stats bar and the events catalog section.

**Structure:**

```tsx
<section className="ecc-sponsor-row" aria-label="Event sponsors">
  <div className="ecc-sponsor-label">Supported by</div>
  <div className="ecc-sponsor-logos">
    {[1,2,3,4,5].map(i => {
      const logo = useThemeMedia(`sponsors.logo_${i}`, '');
      const url = useThemeContent(`sponsors.url_${i}`, '');
      const name = useThemeContent(`sponsors.name_${i}`, '');
      if (!logo && !name) return null;
      const inner = logo
        ? <img src={logo} alt={name} className="ecc-sponsor-img" />
        : <span className="ecc-sponsor-name">{name}</span>;
      return url
        ? <a key={i} href={url} className="ecc-sponsor-item" target="_blank" rel="noopener noreferrer">{inner}</a>
        : <div key={i} className="ecc-sponsor-item">{inner}</div>;
    })}
  </div>
</section>
```

- [ ] Create `SponsorRow` in `components/index.tsx`
- [ ] Insert between the hero stats bar (line 201) and the catalog section (line 203) in `Page.tsx`
- [ ] Add `.ecc-sponsor-row`, `.ecc-sponsor-label`, `.ecc-sponsor-logos`, `.ecc-sponsor-item`, `.ecc-sponsor-img`, `.ecc-sponsor-name` to `styles.css`

---

### 4. Hardcoded Strings Not in `useThemeContent`

**`Page.tsx`**

| Hardcoded string | Suggested key |
|---|---|
| Hero description (line 122) | `hero.description` |
| `"5,000+"` social proof count (line 144) | `hero.delegate_count` |
| `"delegates registered this season"` (line 144) | `hero.delegate_label` |
| `"FEATURED EVENT"` badge (line 152) | `hero.featured_badge` |
| `"Register Now →"` featured card CTA (line 179) | `hero.featured_cta` |
| Fallback featured card date `"Sep 15–17, 2026"` (line 163) | `hero.fallback_date` |
| Fallback featured card title `"Global Engineering Summit"` (line 167) | `hero.fallback_title` |
| Fallback featured card location `"San Francisco, CA"` (line 173) | `hero.fallback_location` |
| `"Showing X events"` results meta (line 265) | not strictly needed — can remain dynamic |

- [ ] Add `useThemeContent` calls for all strings above
- [ ] For the featured event card fallbacks, use `useThemeContent` defaults

---

### 5. Footer Copyright Year Hardcoded

`components/index.tsx` line 133:

```ts
const copyright = useThemeContent('footer.copyright', '© 2026 SummitPro. All rights reserved.');
```

Hardcoded year in default.

- [ ] Change default to `''` and render: `{copyright || \`© ${new Date().getFullYear()} SummitPro. All rights reserved.\`}`

---

### 6. Inline Styles — Extract to CSS

**`Page.tsx`**

| Element | Target class |
|---|---|
| Primary CTA Link `textDecoration: none` (line 125) | `.ecc-hero-buttons a` or `.ec-btn-primary` — add `text-decoration: none` to CSS |
| Avatar stack `zIndex` (line 140) | `.ecc-avatar-stack-img:nth-child(n)` — use CSS nth-child, or set z-index in CSS loop |
| Catalog section `paddingBottom: 4rem` (line 203) | `.ecc-section--catalog` modifier |
| Catalog header `textAlign, marginBottom` (line 204) | `.ecc-section-header` |
| Catalog h2 (line 207–211) | `.ecc-section-title` (reusable) |
| Empty state buttons row (line 286) | `.ecc-empty-actions` |
| "VIEW FULL CATALOG" link `textDecoration` (line 299) | `.ec-btn-primary` — add to CSS |
| Speakers section header (lines 308–315) | `.ecc-section-header` (same as catalog) |
| Speakers h2 (lines 310–315) | `.ecc-section-title` (same class) |
| Agenda section `background, borderRadius` (line 325) | `.ecc-section--agenda` modifier |
| Agenda header row (lines 326–327) | `.ecc-agenda-header` (already has className — verify CSS exists) |
| Agenda h2 (lines 330–334) | `.ecc-section-title` |
| Agenda description (lines 336–337) | `.ecc-agenda-intro` (already has className — verify CSS) |
| Agenda CTA row `textAlign, marginTop` (line 347) | `.ecc-agenda-cta-row` |
| Agenda CTA Link `textDecoration, display` (line 348) | `.ec-btn-outline` — add to CSS |
| Final CTA section `textAlign: center` (line 354) | `.ecc-section--cta` modifier |
| CTA inner div `maxWidth, margin` (line 355) | `.ecc-cta-inner` |
| CTA h2 (lines 357–362) | `.ecc-section-title` (or `.ecc-cta-title` for size variant) |
| CTA highlight `<span>` `color: var(--ecc-blue)` (line 363) | `.ecc-hero-highlight` (already used in hero — check if same class) |
| CTA description (lines 367–368) | `.ecc-cta-desc` |
| CTA button `padding, fontSize, textDecoration, display` (line 370) | `.ecc-cta-btn` modifier on `.ec-btn-primary` |

**`components/index.tsx` — Header**

| Element | Target class |
|---|---|
| Logo Link `textDecoration: none` (line 31) | `.ecc-logo-link` |
| Mobile action button inline (lines 63–66) | `.ecc-mobile-action-btn` — move width, borderRadius, padding, marginTop to CSS |
| Desktop action button Link `textDecoration` (line 76) | add `text-decoration: none` to `.ecc-desktop-btn a` |

**`components/index.tsx` — Footer**

| Element | Target class |
|---|---|
| Brand label div (line 150) | `.ecc-footer-brand-label` |
| Footer description `<p>` (line 151–153) | `.ecc-footer-desc` |
| Social links row (line 155) | `.ecc-social-row` |
| Social icon `<a>` (lines 158–160) | `.ecc-social-link` |
| Contact column label (line 172) | `.ecc-footer-col-label` (same pattern as FooterNavColumn label) |
| Contact column wrapper (line 173) | `.ecc-footer-contact` |
| Location span (line 175) | `.ecc-footer-location` |
| Footer bottom `alignItems` (line 180) | already `.ecc-footer-bottom` — add `align-items: center` to CSS |
| Copyright div (line 181) | `.ecc-footer-copyright` |
| "Built on Sellio" span (line 182) | `.ecc-footer-tagline` |

**`components/index.tsx` — FooterNavColumn**

- Line 111: `style={{ marginBottom, color }}` on column label → add to `.ecc-footer-col-label` CSS class

**`components/index.tsx` — SpeakerCard**

| Element | Target class |
|---|---|
| Name `<h3>` (line 198) | `.ecc-speaker-name` |
| Company div (line 199) | `.ecc-speaker-company` |
| Role div (line 200) | `.ecc-speaker-role` |

**`components/index.tsx` — AgendaItem**

| Element | Target class |
|---|---|
| Time mono div `fontSize: 0.85rem` (line 213) | `.ecc-agenda-time` |
| Track badge `<span>` (lines 216–224) | `.ecc-agenda-track-badge` |
| Session title `<h4>` (line 226) | `.ecc-agenda-title` |
| Speaker line (line 227) | `.ecc-agenda-speaker`, `.ecc-agenda-speaker-name` (highlighted span) |

**`components/index.tsx` — EventCard**

| Element | Target class |
|---|---|
| Link `textDecoration: none` (line 238) | `.ecc-event-card-link` or add to `.ecc-event-card` `<a>` rule |
| SVG icon color (lines 249, 253) | `.ecc-event-card-meta-item svg` — add `color: var(--ecc-blue)` to CSS |
| "VIEW DETAILS" span (line 260) | `.ecc-event-view-details` |

**`components/index.tsx` — ShimmerCard**

| Element | Target class |
|---|---|
| `ecc-shimmer-title` marginTop (line 271) | add `margin-top` to `.ecc-shimmer-title` CSS |
| `ecc-shimmer-meta` marginTop (line 272) | add to `.ecc-shimmer-meta` CSS |
| `ecc-shimmer-text` marginTop + width (lines 273–274) | add to `.ecc-shimmer-text` CSS; second instance → `.ecc-shimmer-text + .ecc-shimmer-text` rule |

---

### 7. Footer Social Links — JS Hover Handlers

`components/index.tsx` lines 159–160:

```tsx
onMouseEnter={(e) => { el.style.background = 'var(--ecc-blue)'; el.style.color = 'white'; ... }}
onMouseLeave={(e) => { el.style.background = ''; el.style.color = 'var(--ecc-text-muted)'; ... }}
```

- [ ] Remove `onMouseEnter`/`onMouseLeave` — replace with `.ecc-social-link:hover` CSS rule
- [ ] Add to `styles.css`: `.ecc-social-link:hover { background: var(--ecc-blue); color: white; border-color: var(--ecc-blue); }`

---

### 8. `Header` — Missing `aria-expanded`

`components/index.tsx` line 37:

```tsx
<button className={`ecc-hamburger ...`} onClick={...} aria-label="Toggle Navigation" id="ecc-hamburger-toggle">
```

- [ ] Add `aria-expanded={isOpen}`

---

### 9. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] **Hero layout** (`ecc-hero-inner`): left text + right featured card — must stack on mobile (card below, text above)
- [ ] **Stats bar** (`ecc-hero-stats`): 3 stats in flex row — verify wraps or collapses to 3×1 on 375px
- [ ] **Speaker grid** (`ec-speaker-grid`): verify 1–2 columns on mobile
- [ ] **Agenda items**: time + content in a flex row — verify stacks correctly on mobile
- [ ] **Filter bar** (`ecc-explore-filters`): 1 text input + 3 selects in a row — verify wraps on mobile
- [ ] **Sponsor row** (new): logos in a flex wrap row — verify scales to 2 per row on mobile
- [ ] **Event card grid** (`ecc-explore-grid`): verify 1 column on 375px

---

### 10. SEO Metadata

- [ ] Homepage: verify `metadata` export
- [ ] `ProductPage`: add `generateMetadata` using event title and date
- [ ] `ExplorePage`: add descriptive title ("Browse Corporate Events & Summits")

---

## Completion Checklist Summary

```
NEW FEATURES
  [ ] SponsorRow component: useThemeMedia logos × 5, optional links
  [ ] Insert SponsorRow between hero stats and catalog section

HARDCODED DATA → useThemeContent / useThemeMedia
  [ ] speakers array: 4 × (name, role, company, image)
  [ ] agenda array: 4 × (time, title, speaker, track)
  [ ] hero.description
  [ ] hero.delegate_count, hero.delegate_label
  [ ] hero.featured_badge, hero.featured_cta
  [ ] hero.fallback_date, hero.fallback_title, hero.fallback_location

FOOTER COPYRIGHT
  [ ] Dynamic year fallback

INLINE STYLES → CSS CLASSES
  [ ] Page.tsx: catalog/speakers/agenda/cta section headers + titles,
      agenda description, agenda cta row, cta inner + desc + btn,
      empty state buttons row, CTA highlight span
  [ ] Header: logo link, mobile/desktop action buttons
  [ ] Footer: brand label, desc, social row, icon links,
      contact column, footer bottom, copyright, tagline
  [ ] FooterNavColumn: column label
  [ ] SpeakerCard: name, company, role
  [ ] AgendaItem: time, track badge, title, speaker
  [ ] EventCard: link, svg colors, view-details span
  [ ] ShimmerCard: marginTop on skeleton elements

SOCIAL LINKS
  [ ] Remove JS hover handlers → CSS :hover rule

HEADER
  [ ] Add aria-expanded={isOpen}

RESPONSIVE
  [ ] Hero: stack mobile (card below text)
  [ ] Stats bar: wrap on 375px
  [ ] Speaker grid: 1-2 col mobile
  [ ] Agenda items: stack on mobile
  [ ] Filter bar: flex-wrap
  [ ] Sponsor row: 2-col on mobile
  [ ] Event card grid: 1-col on mobile

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata (event title + date)
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Good useThemeContent for headings; speakers + agenda hardcoded; heavy inline styles in section headers/CTAs |
| `components/index.tsx` — Header | Site nav | CMS nav ✓; action buttons inline; missing aria-expanded |
| `components/index.tsx` — Footer | Footer | Social links via useThemeContent ✓; brand/desc/social inline; copyright year; JS hover handlers |
| `components/index.tsx` — SpeakerCard | Speaker display | Inline styles on all 3 text elements |
| `components/index.tsx` — AgendaItem | Schedule item | All inline; track badge fully inline |
| `components/index.tsx` — EventCard | Event listing card | Minor inline styles; link textDecoration |
| `components/index.tsx` — ShimmerCard | Skeleton loading | marginTop inline on shimmer elements |
| `ProductPage.tsx` | Event detail + booking | Not fully audited — check for inline styles |
| `ExplorePage.tsx` | Event catalog | Not fully audited |
| `BookingPage.tsx`, etc. | Booking flow | Delegate to shared |
| `styles.css` | Styles | Will grow after extraction |
