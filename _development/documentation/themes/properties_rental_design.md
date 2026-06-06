# RentEase — `properties_rental` design system

This theme is **not** a variant of `properties_modern` (Urban Node). Do not reuse its glass toolbars, skyline cyan palette, side-by-side listing bento, or frosted explore chrome.

**Implementation:** `apps/storefront/src/themes/properties/rental/`

## Brand

- **Name:** RentEase (monthly rentals marketplace)
- **Tone:** Warm, clear, trustworthy — editorial rental magazine, not tech “protocol” UI
- **Audience:** Tenants comparing monthly leases and landlords listing units

## Tokens (`styles.css` → `.properties-rental-theme`)

| Token | Role |
|-------|------|
| `--pr-bg` / `--pr-bg-hero` | Sand `#faf7f2` page background |
| `--pr-slate` | Ink `#1c1917` body text |
| `--pr-mint*` | **Terracotta** brand (`#c2410c` …) — name kept for CSS stability |
| `--pr-sage` | Secondary accent `#3f6212` (eyebrows, filter sidebar stripe) |
| `--pr-font-display` | Fraunces — headings only |
| `--pr-font` | DM Sans — UI, body, labels |
| `--pr-radius-*` | Tight: 6–14px (not large pill radii) |
| `--pr-header-h` | 72px sticky header |
| `--pr-content-max` | 1180px |

## Typography

- **Display:** `.pr-heading-xl`, `.pr-section-title`, `.pr-detail-title`, `.pr-explore-hero__title` → Fraunces, 700
- **Eyebrow:** `.pr-kicker` / `.pr-mono` → sage, sentence case, no heavy uppercase tracking
- **Highlight:** `.pr-text-highlight` → terracotta in titles

## Layout patterns (use these class names)

### Page navigation — `PageNav` / `.pr-page-nav`

- Back link as **plain text** (`← …`), terracotta on hover
- Breadcrumbs: `.pr-crumbs` with **`·`** separators
- **No** frosted toolbar card, **no** pill back button

### Home search — `.pr-search-ribbon`

- White bar, **4px terracotta left border**, 4-column grid on desktop
- **No** `backdrop-filter` glass panel

### Listing detail — `.pr-listing-hero`

1. `.pr-listing-gallery` — full-width gallery + thumb strip  
2. `.pr-listing-intro` — connected bar below gallery, terracotta top border  
3. `.pr-listing-intro__card` — 2-column grid: main copy + CTA  

**Not** `pr-detail-bento` (modern side-by-side gallery + glass summary).

### Detail / explore content

- Main blocks: `.pr-detail-block` — flat white cards, light border
- Sidebar: `.pr-booking-panel` — sticky via `.pr-detail-sidebar`
- Explore filters: `.pr-explore-sidebar` — white panel, **sage left stripe**

### Cards — `.pr-rent-card`

- Image top, stats footer
- Hover: **terracotta left border**, subtle lift — not cyan glow

### Buttons

- `.pr-btn-primary` — terracotta fill, **square-ish** radius (`--pr-radius-sm`)
- `.pr-btn-secondary` — white + border, no pill shape

## Components map

| Component | Path |
|-----------|------|
| `PageNav` | `components/PageNav.tsx` |
| `RentalHeader` / `TenantFooter` | `components/index.tsx` |
| `ExplorePage` | `ExplorePage.tsx` |
| `ProductPage` | `ProductPage.tsx` |
| Detail kit | `components/detail/*` |

## Hooks & content

- All `useThemeContent` / `useThemeMedia` calls must be at the **top** of page components (never inside JSX branches). See `Page.tsx`.
- CMS defaults: `PROPERTIES_RENTAL_HOME` in `theme-content-defaults.ts`

## Do / Don’t

| Do | Don’t |
|----|--------|
| Sand backgrounds, terracotta CTAs | Cyan/skyline gradients (`#06b6d4`, `#0ea5e9`) |
| Fraunces + DM Sans | Plus Jakarta / Outfit + Inter (modern stack) |
| Stacked listing hero | Modern `pm-detail-bento` split |
| `pr-page-nav` + dot crumbs | `pr-detail-toolbar` frosted card + `›` only in modern |
| Flat shadows | Heavy mint glow, `backdrop-filter` panels |
| Copy: “rental”, “lease”, “monthly” | “Node”, “protocol”, “Urban” jargon |

## Preview routes

- Home: `/preview/properties_rental`
- Explore: `/preview/properties_rental/explore`
- Detail: `/preview/properties_rental/product/{slug}`
