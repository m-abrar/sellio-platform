SKIP THIS THEME DEVELOPMENT FOR NOW, MOVE TO NEXT ONE

# Theme Completion Plan: `ecommerce/b2b`

**Priority:** #2 — B2B marketplace sells at premium on CodeCanyon; strong feature set
**Theme path:** `apps/storefront/src/themes/ecommerce/b2b/`
**Audit score:** 9/10 (feature-complete) — but currently branded entirely for Aadab International

---

## What's Already Done

- Full page suite: Homepage, ProductPage, ExplorePage, QuotePage, BlogPage, AboutPage, ContactPage
- API integration with fallback in Page.tsx, ProductPage.tsx, ExplorePage.tsx
- `useThemeContent` for hero headline, description, CTAs, and RFQ section copy
- RFQ system: "Add to enquiry list" → `localStorage` → `/quote` flow
- Hierarchical category tree with expand/collapse in ExplorePage
- Skeleton loading states on explore grid and category sidebar
- Mobile hamburger nav panel with overlay
- Topbar with phone/WhatsApp shortcut
- Pre-footer CTA band and multi-column footer
- BlogPage with search + category filter tabs
- Tab panel on ProductPage (Description / Specifications / Quote Details)
- Gallery thumbnails with active-image switching on ProductPage
- 3,721 lines of CSS — comprehensive coverage

---

## Critical Issue — De-brand from Aadab International

The theme was built using Aadab International (aadab.biz) as a live reference client. Every hardcoded label, image path, phone number, address, and piece of content refers to that specific company. **Aadab is a separate client website and must not appear in the CodeCanyon product.**

This is the only blocker to submission. Everything below traces exactly what to change.

---

## Gaps & Issues to Fix

### 1. Aadab-Specific Assets — Replace or Rename

These filenames expose the client relationship and the images are not generic enough for a template product.

| File | Action |
|---|---|
| `assets/aadab-logo.webp` | Replace with a generic SVG text logo or neutral placeholder; update import in `components.tsx` |
| `assets/aadab-international-section-01.webp` | Rename to `assets/section-manufacturing-01.webp`; update import in `Page.tsx` |
| `assets/aadab-international-section-02.webp` | Rename to `assets/section-manufacturing-02.webp`; update import in `Page.tsx` |
| `assets/surgical-instruments-01.jpg` | Rename to `assets/product-sample-01.jpg` |
| `assets/ring-forceps.jpg` | Rename to `assets/product-sample-02.jpg` |
| `assets/surgical-instruments-02.jpg` | Rename to `assets/product-sample-03.jpg` |
| `assets/surgical-instrument-workshop.jpg` | Rename to `assets/workshop-01.jpg` |

- [ ] Rename all seven assets and update all import paths

---

### 2. `Page.tsx` — Hardcoded Aadab Data to Replace

**Exhibition banner (lines 27–31)**

The `exhibitionNews` object is Aadab-specific and hardcoded:
```ts
const exhibitionNews = {
  title: 'WHX Dubai 2026',           // specific trade show
  body:  'Aadab International will exhibit...',
  cta:   'Register interest',
};
```

- [ ] Wrap in `useThemeContent`: `news.event_name`, `news.event_body`, `news.event_cta`
- [ ] Default to a generic trade show placeholder: `'Industry Exhibition 2026'`

**`legacyFeatures` (lines 33–40)**

Hardcoded as Aadab milestones: "Since 1942", "Third Generation", "Bone Surgery", "OEM Ready". These are Aadab company history, not generic B2B content.

- [ ] Move to `useThemeContent` keys: `features.1.code`, `features.1.line_one`, etc.
- [ ] Change defaults to generic B2B propositions: `'Since [Year]'`, `'Export Ready'`, `'Custom Supply'`, `'OEM / Private Label'`, `'Global Delivery'`, `'Quality Certified'`

**`heroRecords` (lines 42–47)**

Four stat cards: "Est. 1942", "40+", "catalog", "OEM" — Aadab-specific values.

- [ ] Wrap in `useThemeContent`: `stats.1.label`, `stats.1.value`, `stats.1.detail`, etc.
- [ ] Defaults: `'Founded'`, `'Est. [Year]'`, `'Established manufacturer'`; `'Markets'`, `'40+'`, `'Export destinations worldwide'`; etc.

**`heroCapabilities` (lines 55–59)**

Three chips: "Orthopedic range", "OEM export supply", "Factory quotation" — domain-specific.

- [ ] Wrap in `useThemeContent`: `capabilities.1.title`, `capabilities.1.detail`, etc.
- [ ] Defaults: `'Product range'`, `'OEM supply'`, `'Factory quotation'`

**Hero spec line (line 262)**

```tsx
<p className="b2b-hero-spec-line">Laser marking / passivation / export packing / repeat supply programs</p>
```

- [ ] Wrap in `useThemeContent('hero.spec_line', 'Custom marking / export packing / repeat supply programs')`

**`heroSliderProducts` (lines 49–53)**

Product names (`T.C. Pin Cutter`, `Surgical Scissors`, `Bone Holding Forceps`) and Aadab image assets for the rotating showcase. Also links to `imgSliderCutters`, etc.

- [ ] Rename asset files (`home-slider-cutters.webp` → `home-slider-product-01.webp`, etc.)
- [ ] Update import names and references in the array
- [ ] Change product names to generic: `'Product Type A'`, `'Product Type B'`, `'Product Type C'` — or remove the name entirely if it's just visual

**`categories` array (lines 74–102)**

27 hardcoded surgical instrument category names and counts, with `/aadab/categories/` image URLs that only resolve on the Aadab site:
```ts
{ name: 'Wire Twisting Forceps T.C.', count: 7, image: '/aadab/categories/wire-twisting-forceps-t.c.jpg' },
```

- [ ] Remove this entire hardcoded array — categories should come from the live API only
- [ ] Replace the category showcase section render with: if API categories are available, show them; if not (demo mode), show a `b2b-category-placeholder` grid of 6–8 blank cards with skeleton styling
- [ ] The `<section className="b2b-category-showcase">` currently maps `categories` (the local const); wire it to the API `products`/`categories` state loaded in the `useEffect` or pass them as props

**`featuredProducts` (lines 104–111)**

6 hardcoded Aadab SKUs with `/aadab/products/` image URLs:
```ts
{ sku: '13-844-01', desc: 'Synovcetomy Rongeur...', image: '/aadab/products/13-844-01.jpg' },
```

- [ ] Replace with API-driven featured products: take first 6 from `products` state (already loaded)
- [ ] The Featured Articles section should map real API products, same as `B2BProductCard` in ExplorePage

**`normalizeHeroTitle` (lines 61–70)**

Normalizes Aadab-specific legacy title strings. Not needed in a generic theme.

- [ ] Delete this function and its call on line 218. Use `title` from `useThemeContent` directly.

**Factory visit section (lines 355–395)**

Two hardcoded YouTube links to the actual Aadab factory video:
```ts
href="https://www.youtube.com/watch?v=jdYh_CcNDOs"
```
And alt text:
```ts
alt="Aadab International orthopedic instrument factory tour"
```

- [ ] Wrap YouTube URL in `useThemeContent('factory.video_url', '')` — render the section only if value is non-empty
- [ ] Change alt text to `useThemeContent('factory.video_alt', 'Factory tour video')` and the aria-label similarly

**Image alt text (line 282–284)**

```tsx
<img src={aadabImages.inspection} alt="Aadab International orthopedic instruments" />
<img src={aadabImages.instruments} alt="Aadab International surgical instrument manufacturing" />
```

- [ ] Change to generic: `alt="Manufacturing quality inspection"` and `alt="Finished product inventory"`

**RFQ section hardcoded heading (line 328–329)**

```tsx
<h2>Instruments for every discipline.</h2>
<p>Pattern, size, steel grade, finish, and marking are confirmed...</p>
```

- [ ] Wrap in `useThemeContent('categories.heading', 'Products for every application.')` and `useThemeContent('categories.subheading', ...)`

---

### 3. `components.tsx` — Hardcoded Aadab Content

**`B2BHeader` meta span (line 38)**

```tsx
<span className="b2b-header-meta">Orthopedic instruments Manufacturers <br/> & Exporters</span>
```

- [ ] Replace with `useThemeContent('header.meta_label', 'B2B Wholesale & Export Supply')`

**`B2BTopbar` (lines 131–148)**

Four hardcoded values:

| Line | Hardcoded | Fix |
|---|---|---|
| 131 | `"Sialkot, Pakistan"` | `useThemeContent('contact.city', 'Your City')` |
| 133 | `"Est. 1942"` | `useThemeContent('contact.est_label', 'Est. [Year]')` |
| 135 | `"Orthopedic instruments manufacturer & exporter"` | `useThemeContent('contact.tagline', 'Manufacturer & Exporter')` |
| 138–141 | `href="https://wa.me/923304819191"`, `+92 330 481 9191` | `useThemeContent('contact.whatsapp_number', '')` — only render the WhatsApp link if the value is non-empty |

**`B2BFooter` description (line 159)**

```ts
const description = 'We focus on meticulous craftsmanship, delivering our products that expertly blend the intricate structures of bones...'
```

Hardcoded, references bone surgery. Not in `useThemeContent`.

- [ ] Replace with `useThemeContent('footer.description', 'We focus on quality craftsmanship, delivering products that meet the precise requirements of our export buyers.')`

**`B2BFooter` pre-footer headings (lines 168–169)**

```tsx
<h2>Send your orthopedic instrument list.</h2>
<p>We will review the pattern, quantity, finish, marking, packing, and export details before quoting.</p>
```

- [ ] Wrap in `useThemeContent('footer.prefooter_heading', 'Send your product requirements.')` and `useThemeContent('footer.prefooter_body', ...)`

**`B2BFooter` trust badges (lines 185–187)**

```tsx
<span className="b2b-trust-badge">Orthopedic instruments</span>
<span className="b2b-trust-badge">Private label enquiries</span>
<span className="b2b-trust-badge">Reusable stainless steel</span>
```

- [ ] Wrap in `useThemeContent`: `footer.badge_1`, `footer.badge_2`, `footer.badge_3`
- [ ] Defaults: `'B2B & Wholesale'`, `'Private Label'`, `'Export Ready'`

---

### 4. `AboutPage.tsx` — Replace Aadab Company Story

The entire page is Aadab International's company narrative: founded 1942, third generation, Sialkot, orthopedic instruments.

- [ ] Replace kicker `'About Aadab International'` with `useThemeContent('about.kicker', 'About Us')`
- [ ] Replace `<h1>` with `useThemeContent('about.heading', 'Decades of manufacturing excellence.')`
- [ ] Replace intro paragraph with `useThemeContent('about.intro', 'We manufacture and export [products] for importers, distributors, and OEM buyers worldwide.')`
- [ ] Replace `values` array entries: titles and body copy contain "Aadab International" (line 27) — change to generic: `'Direct from the manufacturer'` body should not name the company
- [ ] Replace `processSteps` — content is generic enough (Send list → Review → Quotation → Dispatch) and can stay; just don't name Aadab
- [ ] Stats block (lines 60–64): `"1942"`, `"3rd Gen"`, `"40+"`, `"OEM"` — wrap in `useThemeContent`: `about.stat_1_value`, etc.

---

### 5. `ContactPage.tsx` — Remove Real Address and Phone

```ts
const offices = [{
  city: 'Export Desk',
  address: '19/16 Club Road Cantt., Sialkot 51310, Pakistan',
  phone: '+92 330 481 9191',
  whatsapp: '923304819191',
}];
```

- [ ] Replace with `useThemeContent` keys: `contact.office_city`, `contact.office_address`, `contact.phone`, `contact.whatsapp`
- [ ] Defaults: `'Export Desk'`, `'[Company Address]'`, `''`, `''`
- [ ] Render phone/WhatsApp links only if the content value is non-empty

Business hours hardcoded:
```tsx
<p>Monday – Friday, 09:00 – 18:00 PKT</p>
```
- [ ] Wrap in `useThemeContent('contact.hours', 'Monday – Friday, 09:00 – 18:00')`

---

### 6. `BlogPage.tsx` — Remove Aadab Author Attribution

All 6 posts have `author: 'Aadab International'` and content specific to surgical instruments. Blog post content is demo copy — that's fine — but author attribution should not name the client.

- [ ] Change `author` in all `POSTS` entries from `'Aadab International'` to `'The Team'`
- [ ] Blog content (titles, excerpts) is generic B2B/export knowledge — acceptable demo copy, no change needed

**Missing blog detail page**

`BlogPage` links to `/blog/[slug]` but no `BlogDetailPage` file exists. Clicking any article is a dead link.

- [ ] Either add a `BlogDetailPage.tsx` with placeholder content (`Coming soon` state is acceptable for Phase 1), or remove the `href` from blog cards and make them non-navigable (`<article>` instead of `<a>`)

---

### 7. Explore Page — Pagination CSS Prefix Mismatch

`ExplorePage.tsx` uses `ef-pagination` and `ef-pagination-btn` CSS class names (lines 276–285), which are from the `ecommerce/fashion` theme's namespace, not `b2b`. The `b2b` styles.css likely doesn't define these.

- [ ] Search `styles.css` for `.ef-pagination` — if absent, either:
  - Add `.b2b-pagination` / `.b2b-pagination-btn` CSS and update the JSX, or
  - Confirm that `ef-pagination` is in a shared ecommerce CSS file that is also imported

---

### 8. Responsive Review (Test at 375px, 768px, 1280px)

- [ ] Hero section: product slider + photo strip stack cleanly on mobile
- [ ] Exhibition banner: single column on mobile (banner image hides or stacks below text)
- [ ] Category showcase grid: 2 columns on mobile, 3–4 on desktop
- [ ] Featured products grid: 1 column on mobile
- [ ] Topbar: hides or collapses cleanly on mobile (currently visible — confirm it doesn't overflow)
- [ ] QuotePage form: two-column rows collapse to single column on mobile
- [ ] Blog grid: 1 column on mobile

---

### 9. Accessibility

- [ ] `QuotePage.tsx` — `<label>` wraps `<input>` with `<span>` inside; confirm screen readers associate the span text as the label (this pattern is valid but verify)
- [ ] `ExplorePage.tsx` — category tree `CategoryTreeItem` buttons have correct `aria-pressed` and `aria-expanded`; verify the tree landmark is correctly labelled
- [ ] `ProductPage.tsx` — tab panel `role="tablist"` / `role="tab"` / `aria-selected` pattern is correct; verify `role="tabpanel"` is present on the content div
- [ ] Gallery thumbnails use `<button>` with `aria-label` and `aria-pressed` — already correct

---

### 10. SEO Metadata

- [ ] Verify the Next.js route file for this theme exports a `metadata` object (or `generateMetadata`) with `title` and `description`
- [ ] ProductPage should have dynamic metadata: product `title` and `description` fed via `generateMetadata`
- [ ] ExplorePage should have a descriptive `<title>` for the catalog/search page

---

## Completion Checklist Summary

```
ASSETS
  [ ] Rename aadab-logo.webp → generic logo or SVG fallback
  [ ] Rename aadab-international-section-01.webp → section-manufacturing-01.webp
  [ ] Rename aadab-international-section-02.webp → section-manufacturing-02.webp
  [ ] Rename home-slider-cutters.webp → home-slider-product-01.webp
  [ ] Rename home-slider-scissors.webp → home-slider-product-02.webp
  [ ] Rename home-slider-forceps.webp → home-slider-product-03.webp
  [ ] Rename surgical/ring-forceps assets to generic names
  [ ] Update all import paths after renames

PAGE.TSX
  [ ] exhibitionNews → useThemeContent (3 keys)
  [ ] legacyFeatures → useThemeContent (6 × 3 keys)
  [ ] heroRecords → useThemeContent (4 × 3 keys)
  [ ] heroCapabilities → useThemeContent (3 × 2 keys)
  [ ] hero spec line → useThemeContent
  [ ] Delete normalizeHeroTitle function
  [ ] categories const → remove; wire to API categories from useEffect
  [ ] featuredProducts const → remove; use first 6 API products
  [ ] factory.video_url → useThemeContent; hide section if empty
  [ ] factory video alt text → useThemeContent
  [ ] Image alt text → generic strings
  [ ] Category section heading → useThemeContent

COMPONENTS.TSX
  [ ] B2BHeader meta span → useThemeContent('header.meta_label')
  [ ] B2BTopbar city → useThemeContent('contact.city')
  [ ] B2BTopbar est label → useThemeContent('contact.est_label')
  [ ] B2BTopbar tagline → useThemeContent('contact.tagline')
  [ ] B2BTopbar WhatsApp → useThemeContent('contact.whatsapp_number'); hide if empty
  [ ] B2BFooter description → useThemeContent('footer.description')
  [ ] B2BFooter pre-footer heading + body → useThemeContent
  [ ] B2BFooter trust badges × 3 → useThemeContent

ABOUTPAGE.TSX
  [ ] kicker, heading, intro → useThemeContent
  [ ] values[3].body → remove "Aadab International" name
  [ ] stats × 4 → useThemeContent

CONTACTPAGE.TSX
  [ ] address, phone, whatsapp → useThemeContent; hide links if empty
  [ ] business hours → useThemeContent

BLOGPAGE.TSX
  [ ] All post author values → 'The Team'
  [ ] Add BlogDetailPage or remove blog post links

EXPLORE PAGE
  [ ] Confirm ef-pagination CSS is defined (b2b or shared)

RESPONSIVE
  [ ] 375px: hero slider, banner, category grid, form rows
  [ ] 768px: same
  [ ] 1280px: same

ACCESSIBILITY
  [ ] ProductPage tab panel: add role="tabpanel"
  [ ] Verify QuotePage label/input association

SEO
  [ ] Homepage metadata
  [ ] ProductPage generateMetadata
  [ ] ExplorePage title
```

---

## File Reference

| File | Role | Status |
|---|---|---|
| `Page.tsx` | Homepage | Needs full Aadab de-brand; categories and featured products must go API-driven |
| `components.tsx` | Header, Footer, Topbar, ProductCard | Multiple hardcoded Aadab strings — wrap in useThemeContent |
| `ProductPage.tsx` | Product detail | Clean; tab panel needs `role="tabpanel"` |
| `ExplorePage.tsx` | Catalog + category filter | Clean; verify pagination CSS prefix |
| `QuotePage.tsx` | RFQ form | Clean — content is already generic |
| `BlogPage.tsx` | Resources / articles | Author attribution fix + blog detail page |
| `AboutPage.tsx` | Company story | Full de-brand; wire stats to useThemeContent |
| `ContactPage.tsx` | Contact + office | Remove real address/phone; useThemeContent |
| `Layout.tsx` | Theme shell | Not audited — likely minimal |
| `styles.css` | 3,721 lines | Comprehensive; verify ef-pagination coverage |
