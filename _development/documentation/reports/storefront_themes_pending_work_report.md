# Storefront Themes — Pending Work Report

**Project:** Sellio — Next.js storefront (`apps/storefront`)  
**Report date:** 2026-05-31  
**Scope:** All seeded themes **except** the `unifieds/*` vertical (8 themes) and `properties/unified`  
**References:** `ThemeSeeder.php`, `THEME_MASTER_INVENTORY.md`, `dynamic_themes_report.md`, `documentation/theme_catalog.md`, `admin_editable_theme_content_status.md`

---

## Executive summary

| Metric | Count | Notes |
| :--- | ---: | :--- |
| Themes in scope | 43 | 52 seeded − 8 `unifieds/*` − `properties/unified` |
| Baseline complete (Page + Layout + ProductPage + API on homepage) | 43 | Per `dynamic_themes_report.md` (2026-05-26) |
| Admin-editable homepage slots | 43 | Per `admin_editable_theme_content_status.md` |
| Dedicated `ExplorePage` | 6 | classic, luxury, **modern** (properties); autos luxury/modern; events corporate; jobs startup |
| Dedicated `CartPage` | 1 | `properties_classic` only (non-unified) |
| Themes with heavy static/mock fallback on primary paths | ~32 | Unconditional `FALLBACK_*` / `STATIC_*` / synthetic metrics |
| Archetype-complete (catalog spec met) | ~3 | Mostly `properties_classic`; partial luxury/rental/vacation |

**Baseline** (API homepage + product detail) is done across the registry. **Completion** in this report means archetype fidelity, route parity, production-safe fallbacks, and backend submission for forms — not merely “API import exists.”

---

## Cross-cutting pending work (all verticals)

Apply to every theme unless noted:

1. **Explore route** — `/explore` falls back to a generic warning unless the theme exports `ExplorePage` from `index.ts`. Decide per vertical whether to build theme-native explore or accept homepage-only discovery.
2. **Cart route** — `/cart` needs `CartPage` export. Today only `properties_classic` has this outside `unifieds/*`.
3. **Inquiry / booking / apply forms** — Most themes persist to `localStorage` and use `alert()` for validation. Wire to Laravel inquiry/booking/application endpoints.
4. **Demo fallbacks** — Only `properties_classic` gates mock catalogs via `useDemoFallbackAllowed` / preview env. Other themes often show `FALLBACK_*` data on empty API without a demo gate (misleading in production).
5. **Product detail depth** — Seven properties themes share a thin template (single image, text specs, localStorage form). Enrich with `property.media` galleries, `related_properties`, and vertical-specific blocks.
6. **QA** — Live browser pass per theme: `?theme={key}`, `/preview/{key}`, homepage loading/empty/error, product slug miss, explore/cart if exported, mobile layout.
7. **Build** — Run storefront typecheck/build after route or fallback changes.

---

## Properties vertical (12 themes)

Skipped: `properties_unified`.

### `properties_classic` — ~85% complete

**Present:** Page, Layout, ProductPage, ExplorePage, CartPage, `catalog.ts`, demo-gated fallbacks.  
**API:** `api.getProperties` with filters/pagination, `api.getPropertyDetails`, `api.calculateLodgingPrice`, sidebar meta.

| # | Task |
| ---: | :--- |
| 1 | Submit inquiry/cart dossier to backend API (replace `localStorage` in CartPage/ProductPage) |
| 2 | Replace `alert()` validation with inline UI |
| 3 | Multi-image gallery from `property.media` on ProductPage |
| 4 | Motion: skeleton → fade-in cards per catalog motion spec |
| 5 | Optional: dedupe ExplorePage vs Page catalog logic while keeping silo isolation |

---

### `properties_modern` — ~90% complete (2026-05-31)

**Delivered:** `ExplorePage` with filters/pagination via `catalog.ts`; hero search → `/explore?q=`; glass bento `ProductPage` with gallery thumbs, spec bar, related structures, rental price estimate; demo-gated `fallback-data.ts`; homepage uses live catalog API.

| # | Remaining task |
| ---: | :--- |
| 1 | Wire inquiry form to Laravel property inquiry API (still localStorage in preview) |
| 2 | Optional: add `hero.search_placeholder` to theme-content defaults/seeder |
| 3 | Browser QA on `/preview/properties_modern`, `/explore`, `/product/{slug}` |

---

### `properties_luxury` — ~74%

**Present:** Page, Layout, ProductPage, ExplorePage, `EstateShowcase`, lodging price API.  
**Gaps:** `FALLBACK_ESTATES` duplicated in 3 files; unconditional fallback on empty API; single hero image (no parallax gallery).

| # | Task |
| ---: | :--- |
| 1 | Parallax / multi-photo gallery from `property.media` |
| 2 | Gate fallbacks like classic (`useDemoFallbackAllowed`) |
| 3 | Concierge form → API (remove `alert`) |
| 4 | ExplorePage: categories/locations from API sidebar |
| 5 | Map `theme.variables['--color-accent']` to live theme config |

---

### `properties_platinum` — ~58%

**Present:** Asymmetric showcase grid, `ShowcaseCard`, `StatisticsNode`.  
**Gaps:** Thin ProductPage; stats from `useThemeContent` defaults only; no differentiation from luxury.

| # | Task |
| ---: | :--- |
| 1 | Editorial ProductPage (provenance, multi-image) |
| 2 | ExplorePage with asymmetric grid at scale |
| 3 | Live stats from `property.variables` EAV |
| 4 | Spec-bar with icon components |
| 5 | Backend inquiry |

---

### `properties_urban` — ~55%

**Present:** Brutalist cards, `StructuralStat`.  
**Gaps:** `BrutalistUnitCard` uses `alert` instead of navigation; no district filters.

| # | Task |
| ---: | :--- |
| 1 | Link cards to `/product/{slug}` |
| 2 | Replace alert CTAs with routes/forms |
| 3 | City/district filters on `api.getProperties` |
| 4 | Urban detail: floor plan / transit from `property.variables` |
| 5 | ExplorePage |

---

### `properties_rental` — ~68%

**Present:** Lease cards, `translateProperty` rent shim, `calculateLodgingPrice`, lease estimator UI.  
**Gaps:** **No `ScarcityBadge` from `stock_count`** (catalog requirement); synthetic ratings; sale→rent price hack.

| # | Task |
| ---: | :--- |
| 1 | `ScarcityBadge` from `property.stock_count` |
| 2 | Lease terms from `property.variables` EAV |
| 3 | Availability calendar API |
| 4 | Gate `FALLBACK_RENTALS` to demo mode |
| 5 | Submit lease applications to backend |

---

### `properties_vacation` — ~70%

**Present:** Retreat bento, lodging pricing, category ribbons.  
**Gaps:** No blocked-date calendar; `minimum_rental_days` not enforced; Unsplash fallbacks.

| # | Task |
| ---: | :--- |
| 1 | Availability calendar integration |
| 2 | Enforce min/max stay from property fields |
| 3 | Photo carousel on ProductPage |
| 4 | Demo-gate Unsplash fallbacks |
| 5 | Backend booking confirmation |

---

### `properties_map` — ~38% (highest properties debt)

**Present:** Map-styled UI, sidebar list from API, HUD components.  
**Gaps:** **`pm-map-mock` placeholder** — no Leaflet/Google Maps; hardcoded `MapPriceMarker` positions; filters/zoom inert.

| # | Task |
| ---: | :--- |
| 1 | Integrate Leaflet or Google Maps |
| 2 | MarkerCluster from `property.location.latitude/longitude` |
| 3 | Sync list selection ↔ map pan/highlight |
| 4 | Wire FILTER/PRICE/TYPE to API query params |
| 5 | Embedded mini-map on ProductPage |

---

### `properties_commercial` — ~65%

**Present:** Asset registry, `translateProperty` for asset types, audit form UI.  
**Gaps:** Cap rate/NOI synthetic; fake SHA256 receipts; Unsplash assets.

| # | Task |
| ---: | :--- |
| 1 | Map commercial EAV (`cap_rate`, `zoning`, `occupancy`) from API |
| 2 | Replace id-based status heuristics |
| 3 | Backend audit/lead API |
| 4 | ExplorePage with institutional filters |
| 5 | Demo-gate `FALLBACK_ASSETS` |

---

### `properties_showcase` — ~57%

**Present:** Cinematic cards, curator stats.  
**Gaps:** Provenance → `alert`; thin ProductPage; no video/multi-slide hero.

| # | Task |
| ---: | :--- |
| 1 | Cinematic ProductPage (gallery/video) |
| 2 | Provenance from `property.variables` URLs |
| 3 | Replace alert CTAs |
| 4 | CuratorStats from API aggregates |
| 5 | ExplorePage for curated collections |

---

### `properties_neighborhood` — ~54%

**Present:** Community cards, `LocalInsightHUD`.  
**Gaps:** School/commute/safety metrics are static `useThemeContent`; no radius search.

| # | Task |
| ---: | :--- |
| 1 | Neighborhood metadata from `property.variables` |
| 2 | Location radius filter on listings API |
| 3 | Functional local guides section |
| 4 | School district / walk score visualization |
| 5 | Rich ProductPage + backend inquiry |

---

### `properties_investment` — ~42% (critical catalog gap)

**Present:** Portfolio cards, `YieldAnalyticsHUD`.  
**Gaps:** **Yield computed from `property.id`**, not API; **no ROI calculator**; **no performance tables/charts**; CTAs inert.

| # | Task |
| ---: | :--- |
| 1 | ROI calculator bound to financial EAV fields |
| 2 | Performance tables + mini-charts (time-series API) |
| 3 | Replace synthetic yield with real investment metadata |
| 4 | Wire investment CTAs to forms/API |
| 5 | ExplorePage with sort by yield/cap rate/asset class |

---

## Autos vertical (5 themes)

| Theme key | Est. % | Explore | Top completion plan |
| :--- | ---: | :---: | :--- |
| `autos_classic` | 60 | No | Finance/spec comparison UI; reduce 28 fallback refs; related vehicles from API; fix card navigation |
| `autos_modern` | 65 | Yes | Remove `STATIC_VEHICLES_MAP` primary path on ProductPage; API-only related cars; finance calculator; explore filters (make/model/year) |
| `autos_luxury` | 68 | Yes | Dark-mode polish; spec comparison; API fallbacks gated; dealership inquiry API |
| `autos_used` | 58 | No | High-density grid filters; vehicle history from variables; ExplorePage; fallback cleanup |
| `autos_electric` | 55 | No | Replace map placeholder; SOC/range indicators from EAV; remove unconditional `FALLBACK_CLASSIFIEDS`; charging-station map optional |

**Vertical tasks:** Spec-comparison component per theme (siloed); finance calculator on luxury/modern; explore parity for classic/used/electric.

---

## Events vertical (5 themes)

| Theme key | Est. % | Explore | Top completion plan |
| :--- | ---: | :---: | :--- |
| `events_classic` | 70 | No | Ticket tier selector from API variants; countdown to `starts_at`; calendar export |
| `events_creative` | 72 | No | Poster hero video/animation; artist lineup from related listings |
| `events_corporate` | 68 | Yes | Agenda table from variables; booking API; explore: date/venue filters |
| `events_music` | 65 | No | Immersive hero media; lineup grid; ticket tiers |
| `events_festival` | 62 | No | Multi-day schedule UI; map/stage plan; reduce alert() CTAs (5) |

**Vertical tasks:** Countdown timers; ticket tier UI; `alert` → modal/forms; backend ticket hold/checkout stub.

---

## Services vertical (5 themes)

| Theme key | Est. % | Explore | Top completion plan |
| :--- | ---: | :---: | :--- |
| `services_corporate` | 72 | No | Appointment calendar widget; quote form → API |
| `services_marketplace` | 58 | No | Provider comparison; 12 fallback refs; cart-like multi-service quote |
| `services_creative` | 70 | No | Portfolio grid from `property.media`; booking calendar |
| `services_local` | 72 | No | Radius search; map of providers; quote API |
| `services_health` | 65 | No | Provider credentials from EAV; HIPAA-style disclaimer blocks; appointment API |

**Vertical tasks:** “Request a quote” and booking calendars wired to backend; explore for marketplace/local.

---

## Jobs vertical (6 themes)

| Theme key | Est. % | Explore | Top completion plan |
| :--- | ---: | :---: | :--- |
| `jobs_corporate` | 70 | No | Salary range filters on API; one-click apply → application API |
| `jobs_startup` | 68 | Yes | Remove static mock primary path on ProductPage error; equity block from variables; explore salary/remote filters |
| `jobs_tech` | 55 | No | Reduce 26 fallback refs; skills/tags from API; apply form → API |
| `jobs_modern` | 68 | No | Application progress UI; filter chips |
| `jobs_blue_collar` | 72 | No | Location/shift filters; replace 8× `alert` with forms |
| `jobs_freelance` | 68 | No | Project-based listing cards; proposal submit API |

**Vertical tasks:** Application submission endpoint; salary filters on explore; remove offline “static node” messaging from happy path.

---

## Classifieds vertical (6 themes)

| Theme key | Est. % | Explore | Top completion plan |
| :--- | ---: | :---: | :--- |
| `classifieds_general` | 58 | No | Radius/location search; quick-chat stub; explore page |
| `classifieds_modern` | 55 | No | Resilient mock path (`resolving to resilient mockups`); high-density filters |
| `classifieds_local` | 58 | No | Geo radius; meetup safety UI; inquiry API |
| `classifieds_deals` | 55 | No | `FALLBACK_DEALS` gating; bargain badges from API |
| `classifieds_premium` | 58 | No | Vetting/offer forms → API; fallback cleanup |
| `classifieds_elite` | 50 | No | 20× `alert` debt; luxury components cleanup; diamond footer links |

**Vertical tasks:** Location radius on `api.getProperties`; seller messaging integration; unconditional fallback classification (all 6 themes).

---

## Ecommerce vertical (4 themes)

| Theme key | Est. % | Explore | Top completion plan |
| :--- | ---: | :---: | :--- |
| `ecommerce_default` | 75 | No | Variant selector polish; cart route decision; add-to-cart API |
| `ecommerce_luxury` | 75 | No | Premium variant UX; cart persistence |
| `ecommerce_fashion` | 60 | No | Remove `FALLBACK_COLLECTION` on empty DB; size/color variant matrix from API |
| `ecommerce_electronics` | 55 | No | Remove `getFallbackProduct` slug map; spec comparison table; related products from API |

**Vertical tasks:** First-class `CartPage` for default/luxury/fashion/electronics; variant selectors from product options API.

---

## Priority matrix (recommended order)

| Priority | Theme(s) | Reason |
| :---: | :--- | :--- |
| P0 | `properties_map`, `properties_investment` | Catalog archetype explicitly unmet |
| P0 | `properties_rental` | Missing `stock_count` scarcity badges |
| P1 | Thin ProductPage cluster (modern, urban, platinum, showcase, neighborhood, map) | Same template blocks vertical differentiation |
| P1 | `properties_classic` | Backend wiring unlocks inquiry pattern for all properties |
| P2 | `autos_modern`, `classifieds_*`, `ecommerce_electronics`, `ecommerce_fashion` | Heavy unconditional fallbacks |
| P2 | `jobs_tech`, `jobs_startup` | High fallback + apply flow |
| P3 | Explore rollout | 38 themes lack ExplorePage — batch by vertical after P0–P2 |
| P3 | Cart rollout | Ecommerce + properties inquiry themes |

---

## Per-theme QA checklist (copy for each preview)

- [ ] Loads via `?theme={theme_key}` and `/preview/{theme_key}`
- [ ] Homepage: loading, empty, error, live data (no mock on happy path in production)
- [ ] `/product/{slug}`: found, 404, gallery, related items
- [ ] `/explore` (if exported): filters, pagination
- [ ] `/cart` (if exported): line items, submit
- [ ] Forms post to API (not only `localStorage`)
- [ ] CSS scoped to theme root; no cross-theme leak
- [ ] Mobile + desktop layouts

---

## Skipped themes (out of scope)

| Theme key | Folder |
| :--- | :--- |
| `unifieds_default` | `unifieds/default` |
| `unifieds_standard` | `unifieds/standard` |
| `unifieds_classic` | `unifieds/classic` |
| `unifieds_modern` | `unifieds/modern` |
| `unifieds_mega` | `unifieds/mega` |
| `unifieds_interactive` | `unifieds/interactive` |
| `unifieds_minimal` | `unifieds/minimal` |
| `unifieds_marketplace` | `unifieds/marketplace` |
| `properties_unified` | `properties/unified` |

---

## Suggested next engineering pass

1. **Properties P0:** Map integration + investment ROI module + rental scarcity badges.  
2. **Shared pattern:** Extract *behavior* (not components) from `properties/classic/catalog.ts` and `useDemoFallbackAllowed` into per-theme copies per silo rules.  
3. **API contracts:** Document Laravel fields for investment yield, neighborhood scores, commercial cap rate, vehicle specs.  
4. **Route policy:** Product owner decision on mandatory Explore/Cart per vertical.  
5. **Browser QA:** Playwright smoke per vertical using `/preview/{theme_key}` (mirror admin E2E approach).

---

*Generated from workspace scan of `apps/storefront/src/themes` on 2026-05-31.*
