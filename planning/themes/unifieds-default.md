# Theme Completion Plan: `unifieds/default`

**Priority:** #4 — Highest buyer pool (multi-vertical), strong base, significant feature gap vs Laravel version
**Theme path:** `apps/storefront/src/themes/unifieds/default/`
**Audit score:** 7.5/10 — Architecture is solid, but homepage is a skeleton compared to the Laravel version

---

## Source of Truth for This Plan

The Laravel public homepage at `apps/backend/resources/views/frontend/unifieds/` is the feature-complete reference.
Key files to study before implementing anything:
- `frontend/unifieds/index.blade.php`
- `frontend/unifieds/_partials/_index-section-hero.blade.php`
- `frontend/unifieds/_partials/_index-body.blade.php`
- `frontend/unifieds/_partials/_hero_search_forms.blade.php`
- `frontend/unifieds/_partials/_index-cta.blade.php`

---

## What's Already Done

- Full page suite: `Page.tsx`, `ExplorePage.tsx`, `ProductPage.tsx`, `CartPage.tsx`, `BookingReservePage.tsx`
- `fetchAllVerticals()` in `shared/multiVertical.ts` — fetches all 7 verticals in parallel, normalises to `ExploreListing[]`
- `ExplorePage`: vertical chip filter, search input, category dropdown, sort, load-more pagination
- `OriginHeader`: dynamic `MenuNav`, cart badge, hamburger, `useThemeContent('site_name')`
- `InstitutionalFooter`: dynamic columns via `FooterMenuColumn`, social links, dynamic copyright year
- `CoreFeatures`, `GlobalTrust` components exist (but need quality pass — see below)
- Proper `useThemeContent` / `useThemeMedia` usage for hero copy

---

## Gap Analysis — Feature by Feature

### Hero Section (`Page.tsx`)

| Feature | Laravel | Storefront | Gap |
|---|---|---|---|
| Tabbed vertical search | ✅ Per-vertical forms with tailored fields | ❌ No search in hero at all | **Major** |
| AI / Smart Search tab | ✅ NL input, voice, recent + trending chips | ❌ Missing | **Major** |
| Hero image mosaic | ✅ 4-up grid from live listings across verticals | ⚠️ Single static `hero.image` | Medium |
| Trust strip with live stats | ✅ `totalListingsCount`, verticals count, 3 badges | ⚠️ Hardcoded 4-word trust bar | Medium |
| Vertical count stat | ✅ Rendered live | ✅ Done | — |

### Homepage Body Sections (`Page.tsx`)

| Section | Laravel | Storefront | Gap |
|---|---|---|---|
| Vertical module cards grid | ✅ One card per enabled vertical + listing count | ❌ Missing | **Major** |
| Featured Properties section | ✅ 3 items, PropertyCard with beds/baths/price | ⚠️ Merged into single flat grid | Medium |
| Latest Autos section | ✅ 4 items, AutoCard, dark bg | ⚠️ Merged into single flat grid | Medium |
| Latest Products section | ✅ 4 items, ProductCard | ⚠️ Merged into single flat grid | Medium |
| Events section | ✅ 4 items, EventCard with date badge | ⚠️ Merged into single flat grid | Medium |
| Jobs + Classifieds split panel | ✅ Side-by-side: job list + classified mini cards | ❌ Missing layout | **Major** |
| Services category cards | ✅ Category icon + title + description + CTA | ❌ Missing | **Major** |
| Popular Categories section | ✅ Taxonomy chip grid with icons | ❌ Missing | Medium |
| Featured Locations section | ✅ Location pills with geo icons | ❌ Missing | Medium |
| "How It Works" section | ✅ 4 numbered steps: Browse→Connect→Transact→Review | ❌ Missing | Medium |
| Seller CTA section | ✅ "Post a listing" + "Create account" + live stats | ⚠️ Generic "Browse" CTA only | Medium |
| Blog section | ✅ 3 latest posts | ❌ Missing (lower priority) | Low |

### ExplorePage (`ExplorePage.tsx`)

| Issue | Detail |
|---|---|
| All header text hardcoded | "Marketplace directory", "Explore the catalog" etc. — not using `useThemeContent` |
| Suspense fallback is a plain `<p>` | `<p>Loading explore...</p>` — should be a skeleton shell |
| No location filter | Laravel has per-vertical location selects |
| Vertical-specific filter fields | Currently just one flat `<select>` for category — no per-vertical tailored fields |
| Empty state strings hardcoded | "No matches", "No listings matched your filters." |

### Components (`components/index.tsx`)

| Component | Issues |
|---|---|
| `CoreFeatures` | Emoji icons (🛍️ ⚡ 📊); all text hardcoded; inline styles everywhere — not using `useThemeContent` or CSS classes |
| `GlobalTrust` | 4 plain monospaced text labels, no icons, hardcoded strings |

---

## Implementation Plan

### Step 1 — Hero: Tabbed Vertical Search

**File:** `Page.tsx` + new component `components/HeroSearchModule.tsx`

The hero currently has two CTAs. Replace the static CTA group with the full search module.

**`HeroSearchModule` component structure:**
```
<div class="ud-hero-search-module">
  <ScrollableTabStrip>              ← one tab per VERTICALS array + "Smart Search" first
    - Smart Search tab (default active)
    - Properties tab
    - Autos tab
    - Products tab
    - Services tab
    - Jobs tab
    - Events tab
    - Classifieds tab
  </ScrollableTabStrip>

  <div class="ud-hero-search-card">
    <SmartSearchPane />             ← default active panel
    <PropertiesSearchPane />
    <AutosSearchPane />
    <ProductsSearchPane />
    <ServicesSearchPane />
    <JobsSearchPane />
    <EventsSearchPane />
    <ClassifiedsSearchPane />
  </div>
</div>
```

**Per-vertical search form fields** (mirror Laravel `_hero_search_forms.blade.php`):

| Vertical | Main input placeholder | Filter 1 | Filter 2 | Filter 3 |
|---|---|---|---|---|
| Properties | "Address, city, or ZIP…" | Location select | Buy/Rent select | Category select |
| Autos | "Make, brand, or model…" | Location select | Category select | Transmission select |
| Products | "Products, brands…" | Category select | Location select | Min/Max price pair |
| Services | "What service do you need?" | Location select | Category select | Min/Max price pair |
| Jobs | "Job title or company…" | Location select | Workplace type | Category select |
| Events | "Events, workshops, venues…" | Location select | Category select | Date input |
| Classifieds | "Electronics, furniture…" | Location select | Category select | Min/Max price pair |

**Each form submits** to `themeLink('/explore?vertical=X&q=...&location=...&category=...')` — all params as URL query strings, no form POST.

**API data needed for filter dropdowns:** The `fetchAllVerticals` result already returns categories per vertical. For locations, the existing `sidebar.categories` approach on per-vertical catalog calls should expose location data — check `catalog.ts` in the shared folder. Fetch once on mount, populate all select dropdowns.

**Tab switching:** Pure React state — `activeTab` string, no jQuery/Bootstrap. Tab strip arrows needed only if `VERTICALS.length > 5` on mobile. Use `overflow-x: auto; scrollbar-width: none` on the strip.

**Checklist:**
- [ ] Create `components/HeroSearchModule.tsx` with tab strip + search card
- [ ] Create per-vertical search pane components (one each, can be in same file)
- [ ] Fetch location + category data per vertical on mount (reuse `multiVertical.ts` fetcher or a light per-vertical call from `shared/catalog.ts`)
- [ ] Wire each form's submit to `router.push(themeLink('/explore?vertical=X&...'))` 
- [ ] Add `ud-hero-search-module` CSS block to `styles.css`
- [ ] Add scrollable tab strip with left/right arrow buttons (show/hide based on overflow)

---

### Step 2 — Hero: Smart Search (AI) Pane

**File:** `components/SmartSearchPane.tsx`

This is a significant feature. The Laravel implementation calls `route("smart-search.parse")` (POST, CSRF-protected). The Next.js version calls the backend API.

**API endpoint to use:** `POST /api/v1/smart-search/parse` with body `{ q: string }`.
Expected response: `{ module: string, summary: string, redirect_url: string }`.

**Features to implement:**

- [ ] Cycling placeholder (typewriter effect through example searches) — pure JS `setInterval` in a `useEffect`
- [ ] Thinking indicator (3-dot pulse animation) while fetch is in-flight
- [ ] Summary panel: shows module badge + parsed summary sentence after response
- [ ] Auto-redirect: progress bar fills over 2.2s then `window.location.href = redirect_url`
- [ ] "Go now" button to skip the countdown
- [ ] Recent searches: `GET /api/v1/smart-search/recents` → render clickable chips; `POST /api/v1/smart-search/recents/clear` with `{ q }` to remove individual
- [ ] Trending searches: `GET /api/v1/smart-search/trending` → render read-only chips
- [ ] Voice search: `window.SpeechRecognition || window.webkitSpeechRecognition` — if unavailable, hide mic button; on transcript → populate input → run search

**Smart search examples** (cycling placeholder): fetch from backend or use hardcoded array for initial render; backend can override via theme content.

**CSS needed:** `.ud-ai-thinking-dot` pulse animation, `.ud-ai-redirect-bar` width transition, `.ud-ai-summary-panel` reveal animation, `.ud-ai-recent-chip` chip styles, `.ud-ai-mic-btn` listening state.

---

### Step 3 — Hero: Image Mosaic

**File:** `Page.tsx` — replace `ud-hero-img-wrapper` block

Currently renders one static `hero.image`. Replace with a 2-column asymmetric mosaic of live listing images.

**Logic:**
1. After `fetchAllVerticals` resolves, collect one image each from: properties, autos, events, services (in that order of priority)
2. Render as 2-column grid: column A = tall+short, column B = short+tall (mirror)
3. If fewer than 4 images available: fill remaining slots with `<div class="ud-mosaic-placeholder" />`
4. First image: `loading="eager"`, rest `loading="lazy"`

**CSS:** `.ud-hero-mosaic`, `.ud-hero-mosaic__col`, `.ud-hero-mosaic__col--offset`, `.ud-hero-mosaic__item--lg`, `.ud-hero-mosaic__item--sm`

- [ ] Extract mosaic images from `fetchAllVerticals` result (one per vertical, pick first with non-placeholder image)
- [ ] Build `HeroMosaic` sub-component inside `Page.tsx`
- [ ] Add CSS classes and media queries (hide mosaic on mobile/tablet — `display: none` below `lg` breakpoint, same as Laravel's `d-none d-lg-flex`)
- [ ] Keep `useThemeMedia('hero.image')` as fallback override — if set, use single image layout instead of mosaic

---

### Step 4 — Hero Trust Strip (Live Stats)

**File:** `Page.tsx` — update `GlobalTrust` component or replace inline

Currently `GlobalTrust` is 4 static monospaced strings. Replace with a proper trust strip that shows live data.

**New trust strip content:**
- Stat: `{inventoryTotal.toLocaleString()}+ Active Listings` (from `fetchAllVerticals` result)
- Stat: `{VERTICALS.length} Verticals` (static)
- Separator
- Badge: `✓ Verified Sellers` (SVG checkmark icon, not emoji)
- Badge: `🔒 Secure Checkout` (SVG lock icon)
- Badge: `👁 Free to Browse` (SVG eye icon)

- [ ] Update `GlobalTrust` in `components/index.tsx` to accept `listingCount` and `verticalCount` props
- [ ] Pass live values from `Page.tsx` after data loads
- [ ] Replace emoji/text badges with SVG icons
- [ ] Wrap badge labels in `useThemeContent` keys

---

### Step 5 — Vertical Module Cards Grid ("Explore the Marketplace")

**File:** `Page.tsx` — new section between hero and per-vertical sections

A grid of cards, one per vertical, each showing:
- Live listing count (from `fetchAllVerticals` totals)
- Vertical label
- "active listings" sub-label
- SVG icon per vertical
- Link to `/explore?vertical=X`

**Layout:** 2 columns on mobile, 4 on tablet/desktop. Cards are links.

```tsx
// Vertical icon map (SVG, not emoji)
const VERTICAL_ICONS: Record<Vertical, ReactNode> = {
  properties: <BuildingIcon />,
  autos: <CarIcon />,
  products: <BagIcon />,
  services: <WrenchIcon />,
  jobs: <BriefcaseIcon />,
  events: <CalendarIcon />,
  classifieds: <TagIcon />,
};
```

- [ ] Create `VerticalModuleCards` component (can live in `components/index.tsx`)
- [ ] Accept `totals: Partial<Record<Vertical, number>>` as prop
- [ ] Render a CSS grid of module cards
- [ ] Add SVG icons (no emoji, no external icon library — inline SVG)
- [ ] "Post Listing" link in section header → `themeLink('/listing')` or partner registration URL from `useThemeContent('links.post_listing', '/listing')`
- [ ] Wrap section heading/description in `useThemeContent`
- [ ] CSS: `.ud-module-card`, `.ud-module-count`, `.ud-module-label`, `.ud-module-stat`, `.ud-module-icon`

---

### Step 6 — Per-Vertical Featured Sections

**File:** `Page.tsx` — replace the current single `ud-listings-grid` with dedicated per-vertical sections

Currently the homepage fetches all verticals at `per_page: 1` and shows 6 generic cards. Replace with dedicated sections.

**New data fetching strategy:**

```ts
// In Page.tsx useEffect — fetch each vertical independently
const [propertiesListings, setPropertiesListings] = useState<ExploreListing[]>([]);
const [autosListings, setAutosListings] = useState<ExploreListing[]>([]);
const [productsListings, setProductsListings] = useState<ExploreListing[]>([]);
const [eventsListings, setEventsListings] = useState<ExploreListing[]>([]);
const [jobsListings, setJobsListings] = useState<ExploreListing[]>([]);
const [classifiedsListings, setClassifiedsListings] = useState<ExploreListing[]>([]);
const [servicesCategories, setServicesCategories] = useState<Category[]>([]);
```

Use `fetchAllVerticals({ per_page: 4 })` once, then split by `listing.vertical`. This avoids 7 separate API calls — `fetchAllVerticals` already does them all in parallel and returns interleaved results. Post-process the array by vertical.

**Sections to build:**

#### 6a — Featured Properties (3 cards)
`PropertyCard` component:
- Image (tall aspect ratio, lazy)
- Price badge (top-right)
- Category/type badge (For Sale / For Rent)
- Title
- Beds · Baths · Area specs (from `ExploreListing.description` parsing, or pass raw Property object)
- Location string
- "View property" link

Note: `ExploreListing` already has `price`, `title`, `image`, `category`. For beds/baths, consider extending `ExploreListing` with an optional `specs` field — set it in `propertyToListing()` in `multiVertical.ts`.

#### 6b — Latest Autos (4 cards)
`AutoCard` component:
- Image
- Price
- Title (Year · Make · Model)
- Mileage + transmission badges
- "View vehicle" link
- Section background: dark (`section-dark` equivalent)

#### 6c — Latest Products (4 cards)
Reuse or adapt the existing `ud-listing-card` — products are already well-handled. Show 4, link to `/explore?vertical=products`.

#### 6d — Events (4 cards)
`EventCard` component:
- Date badge (month + day, large, top-left of image)
- Image
- Title
- Location
- Ticket price or "Free"
- "View event" link

Date info: currently in `ExploreListing` this is lost. Add `date?: string` field to `ExploreListing` and populate from `eventToListing()` using `event.schedule?.starts_at`.

#### 6e — Jobs + Classifieds Split Panel (side-by-side)
**Left: Jobs** as a list (not cards):
- Company logo (small, 32px)
- Job title
- Company name · Location
- Salary range or "Apply now"
- Employment type badge (Remote / Hybrid / On-site)

**Right: Classifieds** as 2-column mini-card grid:
- Image (square)
- Title (clamped 2 lines)
- Price

```tsx
<section className="ud-split-panel-section">
  <div className="ud-split-panel">
    <JobsPanel jobs={jobsListings.slice(0, 4)} />
    <ClassifiedsPanel classifieds={classifiedsListings.slice(0, 4)} />
  </div>
</section>
```

#### 6f — Services Category Cards
Services differ from other verticals: show **category cards** rather than individual listings (mirrors Laravel which uses `$serviceCategories`).

Since `fetchAllVerticals` returns `sidebar.categories` for services — use those.

`ServiceCategoryCard`:
- Category icon (from `category.icon` or a fallback map of service category name → SVG)
- Category title
- Short description (fallback: "Find verified experts")
- Link to `/explore?vertical=services&category={category.slug}`
- 4 cards, 2-col mobile / 4-col desktop

If no service categories, fall back to showing 4 service listing cards (same generic card as products).

**Checklist:**
- [ ] Extend `ExploreListing` with optional `specs?: { beds?: string; baths?: string; area?: string; mileage?: string; transmission?: string }` and `date?: string`
- [ ] Update `propertyToListing()`, `vehicleToListing()`, `eventToListing()` in `multiVertical.ts` to populate these new fields
- [ ] Create `PropertyCard`, `AutoCard`, `EventCard` components in `components/index.tsx`
- [ ] Create `JobListItem` and `ClassifiedMiniCard` components
- [ ] Create `ServiceCategoryCard` component
- [ ] Build `JobsClassifiedsSplitPanel` layout component
- [ ] Update `Page.tsx` to pass split data to each section
- [ ] Add section-level `useThemeContent` for all heading/description/CTA text
- [ ] CSS: all new card classes, `.ud-split-panel`, `.ud-jobs-list`, `.ud-classifieds-grid`

---

### Step 7 — Popular Categories + Featured Locations

**File:** `Page.tsx` — new section after per-vertical sections

**Data source:**
- Categories: already returned by `fetchAllVerticals` — deduplicated in the result. Filter to top 8 by count (or just first 8).
- Locations: currently not returned. Two options:
  - Option A: Add a separate `GET /api/v1/locations?featured=1` call (cleanest)
  - Option B: Skip locations for now, render categories only

**Categories chip grid (2-col mobile / 4-col desktop):**
```tsx
<a href={themeLink(`/explore?category=${cat.slug}`)} className="ud-taxonomy-chip">
  <span className="ud-taxonomy-icon"><CategoryIcon /></span>
  <span>{cat.title}</span>
</a>
```

**Locations pill strip:**
```tsx
<a href={themeLink(`/explore?location=${loc.slug}`)} className="ud-location-pill">
  <GeoIcon /> {loc.title}
</a>
```

- [ ] Build `PopularCategoriesSection` component
- [ ] Build `FeaturedLocationsSection` component (only if `GET /api/v1/locations` is available — check backend routes)
- [ ] Side-by-side: categories (col 7/12) + locations (col 5/12) on desktop, stacked on mobile
- [ ] Wrap all heading/desc text in `useThemeContent`
- [ ] CSS: `.ud-taxonomy-chip`, `.ud-taxonomy-icon`, `.ud-location-pill`

---

### Step 8 — "How It Works" Section

**File:** `Page.tsx` — before the final CTA

4 numbered steps, mirrors `frontend/unifieds/_partials/_index-body.blade.php` "hiw-section".

```tsx
const HOW_IT_WORKS_STEPS = [
  { step: '01', icon: <SearchIcon />, title: 'Browse', description: 'Search thousands of verified listings across every category.' },
  { step: '02', icon: <ChatIcon />,   title: 'Connect',  description: 'Message sellers directly, ask questions, and negotiate terms.' },
  { step: '03', icon: <ShieldIcon />, title: 'Transact', description: 'Complete your purchase securely through our trusted checkout.' },
  { step: '04', icon: <StarIcon />,   title: 'Review',   description: 'Leave feedback to help other buyers and reward great sellers.' },
];
```

All text via `useThemeContent('hiw.step_1_title', 'Browse')` etc.

- [ ] Create `HowItWorks` component in `components/index.tsx`
- [ ] Inline SVG icons (no emoji, no external library)
- [ ] All 4 step titles and descriptions wrapped in `useThemeContent`
- [ ] CSS: `.ud-hiw-section`, `.ud-hiw-card`, `.ud-hiw-step-num`, `.ud-hiw-icon-wrap`

---

### Step 9 — Seller CTA Section (Update)

**File:** `Page.tsx` — update existing `ud-final-cta` section

Currently just a buyer-facing "Browse the catalog" button. Replace with seller-focused dual-CTA + stats column (mirror of Laravel's `_index-cta.blade.php`).

**Layout:** Two-column on desktop, stacked on mobile.
- Left column (copy + buttons):
  - Eyebrow: "Start selling"
  - Headline: "Your next listing is one click away."
  - Sub: "Join thousands of sellers reaching verified buyers."
  - Primary: "Post a listing" → `useThemeContent('cta.post_listing_url', '/listing')`
  - Secondary: "Create free account" → `useThemeContent('cta.register_url', '/register')`
- Right column (live stats):
  - `{inventoryTotal}+ Active Listings`
  - `{VERTICALS.length} Categories`
  - `4.8★ Seller Rating` (hardcoded or `useThemeContent`)

All copy via `useThemeContent`.

- [ ] Restructure `ud-final-cta` HTML to two-column layout
- [ ] Add `ud-cta-stats` column with live values passed from Page.tsx state
- [ ] CSS: `.ud-cta-stats`, `.ud-cta-stat`, `.ud-cta-actions`

---

### Step 10 — ExplorePage Cleanup

**File:** `ExplorePage.tsx`

- [ ] Wrap "Marketplace directory", "Explore the catalog", page description in `useThemeContent`
- [ ] Wrap empty state strings in `useThemeContent`
- [ ] Wrap "No matches", "No listings matched your filters." in `useThemeContent`
- [ ] Replace `<Suspense fallback={<p>Loading explore...</p>}>` with a proper `ExploreLoadingShell` skeleton (similar to `properties/modern/components/ExploreLoadingShell.tsx`)
- [ ] Add location filter: `<select>` populated from the locations returned by `fetchAllVerticals` (already in result via `sidebar`)
- [ ] Pass location filter into `fetchAllVerticals({ location: selectedLocation, ... })`
- [ ] Wrap "Search", "All categories", "Sort by", option labels in `useThemeContent`
- [ ] "Back to home" link in empty state should be `useThemeContent('explore.empty_cta', 'Back to home')`

---

### Step 11 — CoreFeatures Quality Pass

**File:** `components/index.tsx` — `CoreFeatures` component

Current issues:
- Emoji icons (🛍️ ⚡ 📊) — not acceptable for a premium product
- All text hardcoded arrays — not customisable
- Inline styles — bypassing theme CSS system

- [ ] Replace emoji with inline SVG icons (ShoppingBagIcon, LightningIcon, BarChartIcon)
- [ ] Move all feature text to `useThemeContent`:
  - `features.section_kicker`, `features.section_title`
  - `features.1.title`, `features.1.description`
  - `features.2.title`, `features.2.description`
  - `features.3.title`, `features.3.description`
- [ ] Remove all inline styles — move to `styles.css` as `.ud-feature-card-premium`, `.ud-feature-icon`, `.ud-feature-grid`, `.ud-features-header`

---

## File-by-File Change Summary

| File | Changes |
|---|---|
| `Page.tsx` | Add: tabbed search module, mosaic hero, live trust strip, vertical module cards, 6 per-vertical sections, categories + locations section, how it works, updated seller CTA. Remove: current single flat listing grid |
| `ExplorePage.tsx` | useThemeContent for all strings, skeleton fallback, location filter, ExploreLoadingShell |
| `components/index.tsx` | Update: `CoreFeatures` (SVG icons, useThemeContent, remove inline styles), `GlobalTrust` (live stats props, SVG badges). Add: `HeroSearchModule`, `SmartSearchPane`, `VerticalModuleCards`, `PropertyCard`, `AutoCard`, `EventCard`, `JobListItem`, `ClassifiedMiniCard`, `ServiceCategoryCard`, `JobsClassifiedsSplitPanel`, `PopularCategoriesSection`, `FeaturedLocationsSection`, `HowItWorks`, `ExploreLoadingShell` |
| `shared/multiVertical.ts` | Add optional `specs` and `date` fields to `ExploreListing`; populate in `propertyToListing`, `vehicleToListing`, `eventToListing` |
| `styles.css` | Add CSS for all new components (currently 1,654 lines — expect to reach ~2,800) |
| `index.ts` | No changes needed |

---

## New Components Checklist

```
HERO SEARCH MODULE
  [ ] HeroSearchModule (tab strip + search card wrapper)
  [ ] SmartSearchPane (AI/NL search with voice, recents, trending)
  [ ] PropertiesSearchPane
  [ ] AutosSearchPane
  [ ] ProductsSearchPane
  [ ] ServicesSearchPane
  [ ] JobsSearchPane
  [ ] EventsSearchPane
  [ ] ClassifiedsSearchPane

HERO ENHANCEMENTS
  [ ] HeroMosaic (4-up listing images)
  [ ] Update GlobalTrust (live props + SVG badges)

DISCOVERY SECTIONS
  [ ] VerticalModuleCards
  [ ] PropertyCard
  [ ] AutoCard
  [ ] EventCard
  [ ] JobListItem
  [ ] ClassifiedMiniCard
  [ ] JobsClassifiedsSplitPanel
  [ ] ServiceCategoryCard
  [ ] PopularCategoriesSection
  [ ] FeaturedLocationsSection
  [ ] HowItWorks

QUALITY FIXES
  [ ] CoreFeatures (SVG icons, useThemeContent, CSS classes)
  [ ] ExploreLoadingShell

EXPLORE PAGE
  [ ] useThemeContent wrapping (all visible strings)
  [ ] Location filter
  [ ] Skeleton loading fallback
```

---

## API Dependencies to Verify

Before implementing, confirm these endpoints exist and return the expected shape:

| Endpoint | Used for | Verified? |
|---|---|---|
| `GET /api/v1/properties?per_page=3` | Featured properties section | — |
| `GET /api/v1/vehicles?per_page=4` | Latest autos section | — |
| `GET /api/v1/events?per_page=4` | Upcoming events section | — |
| `GET /api/v1/jobs?per_page=4` | Jobs split panel | — |
| `GET /api/v1/classifieds?per_page=4` | Classifieds split panel | — |
| `GET /api/v1/services/categories` or `sidebar.categories` | Service category cards | — |
| `GET /api/v1/locations?featured=1` | Featured locations section | — |
| `POST /api/v1/smart-search/parse` | Smart search AI tab | — |
| `GET /api/v1/smart-search/recents` | Recent searches chips | — |
| `POST /api/v1/smart-search/recents/clear` | Clear recent search | — |
| `GET /api/v1/smart-search/trending` | Trending searches chips | — |

All vertical catalog endpoints are already confirmed working (used by `fetchAllVerticals`).

---

## Implementation Order

Do these in sequence — each step builds on the previous:

1. `shared/multiVertical.ts` — extend `ExploreListing` type with `specs` + `date` (no UI yet, enables all card components)
2. `styles.css` — add all CSS class stubs (lets you build UI without guessing class names)
3. New card components: `PropertyCard`, `AutoCard`, `EventCard`, `JobListItem`, `ClassifiedMiniCard`, `ServiceCategoryCard`
4. `Page.tsx` — swap flat listing grid for per-vertical sections (Steps 5 + 6)
5. `Page.tsx` — add categories/locations section + How It Works + updated CTA (Steps 7–9)
6. `HeroMosaic` + trust strip update (Step 3 + 4)
7. `HeroSearchModule` + per-vertical search panes (Step 1) — most complex, do last
8. `SmartSearchPane` with AI + voice (Step 2) — depends on backend endpoint confirmation
9. `ExplorePage.tsx` cleanup (Step 10) — independent, can do anytime
10. `CoreFeatures` quality pass (Step 11) — independent, can do anytime
