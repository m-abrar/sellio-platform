# Dynamic Theme Conversion Status Report

Last verified: 2026-05-24

This report tracks which Sellio storefront themes have moved from static prototype markup toward live, API-backed React views. It should be read together with `apps/storefront/THEME_MASTER_INVENTORY.md`, which tracks the full seeded theme registry.

---

## Current Summary

| Metric | Count |
| :--- | ---: |
| Seeded themes in `ThemeSeeder` | 52 |
| Matching storefront theme folders | 52 |
| API-backed themes found in source scan | 52 |
| Static / mostly static themes remaining | 0 |
| Round 1 listings dynamic (homepage grid only) | 52 |
| Round 2 product detail pages complete | 52 |
| Round 2 remaining (product detail) | 0 |

Definition: "API-backed" means the theme contains direct `api.*` usage in `.tsx` source files. Some API-backed themes may still need view parity work, polish, error-state review, and full QA.

---

## API-Backed Themes

| Vertical | Theme Key | Folder | Current Dynamic Surface |
| :--- | :--- | :--- | :--- |
| Autos | `autos_classic` | `autos/classic` | Homepage and product details use vehicle API data |
| Autos | `autos_electric` | `autos/electric` | Homepage and product details use vehicle API data |
| Autos | `autos_luxury` | `autos/luxury` | Homepage, explore, and product details use vehicle API data |
| Autos | `autos_modern` | `autos/modern` | Homepage, explore, and product details use vehicle API data |
| Autos | `autos_used` | `autos/used` | Homepage and product details use vehicle API data |
| Classifieds | `classifieds_deals` | `classifieds/deals` | Homepage and product details use classifieds API data |
| Classifieds | `classifieds_elite` | `classifieds/elite` | Homepage and product details use classifieds API data |
| Classifieds | `classifieds_general` | `classifieds/general` | Homepage and product details use classifieds API data |
| Classifieds | `classifieds_local` | `classifieds/local` | Homepage and product details use classifieds API data |
| Classifieds | `classifieds_modern` | `classifieds/modern` | Homepage and product details use classifieds API data |
| Classifieds | `classifieds_premium` | `classifieds/premium` | Homepage and product details use classifieds API data |
| Ecommerce | `ecommerce_electronics` | `ecommerce/electronics` | Homepage and product details use product API data |
| Ecommerce | `ecommerce_default` | `ecommerce/default` | Homepage listing section and product details use product API data |
| Ecommerce | `ecommerce_fashion` | `ecommerce/fashion` | Homepage and product details use product API data |
| Ecommerce | `ecommerce_luxury` | `ecommerce/luxury` | Homepage listing section and product details use product API data |
| Events | `events_corporate` | `events/corporate` | Homepage, explore, and product details use events API data |
| Events | `events_classic` | `events/classic` | Homepage Repertoire grid + product details use events API (Round 2) |
| Events | `events_creative` | `events/creative` | Homepage Registry grid + product details use events API (Round 2) |
| Events | `events_music` | `events/music` | Homepage Core Lineup grid + product details use events API (Round 2) |
| Events | `events_festival` | `events/festival` | Homepage Neon Stages grid + product details use events API (Round 2) |
| Jobs | `jobs_startup` | `jobs/startup` | Homepage, explore, and product details use jobs API data |
| Jobs | `jobs_tech` | `jobs/tech` | Homepage and product details use jobs API data |
| Jobs | `jobs_corporate` | `jobs/corporate` | Homepage job listing grid + product details use jobs API (Round 2) |
| Jobs | `jobs_modern` | `jobs/modern` | Homepage curated job grid + product details use jobs API (Round 2) |
| Jobs | `jobs_blue_collar` | `jobs/blue_collar` | Homepage Latest Openings grid + product details use jobs API (Round 2) |
| Jobs | `jobs_freelance` | `jobs/freelance` | Homepage Popular Gigs grid + product details use jobs API (Round 2) |
| Properties | `properties_classic` | `properties/classic` | Homepage, explore, product details, and cart use property/lodging API data |
| Properties | `properties_commercial` | `properties/commercial` | Homepage and product details use property API data |
| Properties | `properties_luxury` | `properties/luxury` | Showcase, explore, and product details use property/lodging API data |
| Properties | `properties_rental` | `properties/rental` | Homepage and product details use property/lodging API data |
| Properties | `properties_vacation` | `properties/vacation` | Homepage and product details use property/lodging API data |
| Properties | `properties_modern` | `properties/modern` | Homepage Structure Grid + product details use property API (Round 2) |
| Properties | `properties_platinum` | `properties/platinum` | Homepage Bento Showcase grid + product details use property API (Round 2) |
| Properties | `properties_urban` | `properties/urban` | Homepage Registry Node Units grid + product details use property API (Round 2) |
| Properties | `properties_map` | `properties/map` | Homepage sidebar registry list + product details use property API (Round 2) |
| Properties | `properties_unified` | `properties/unified` | Homepage High-Fidelity Inventory grid + product details use property API (Round 2) |
| Properties | `properties_showcase` | `properties/showcase` | Homepage Curated Properties Showcase + product details use property API (Round 2) |
| Properties | `properties_neighborhood` | `properties/neighborhood` | Homepage Neighborly Homes grid + product details use property API (Round 2) |
| Properties | `properties_investment` | `properties/investment` | Homepage Asset Performance grid + product details use property API (Round 2) |
| Services | `services_corporate` | `services/corporate` | Homepage listing section and product details use services API data |
| Services | `services_marketplace` | `services/marketplace` | Homepage provider grid + product details use services API (Round 2) |
| Services | `services_creative` | `services/creative` | Homepage Top Creatives grid + product details use services API (Round 2) |
| Services | `services_local` | `services/local` | Homepage Popular Services grid + product details use services API (Round 2) |
| Services | `services_health` | `services/health` | Homepage Practitioner Registry grid + product details use services API (Round 2) |
| Unified | `unifieds_classic` | `unifieds/classic` | Homepage listing section and product details use product API data |
| Unified | `unifieds_default` | `unifieds/default` | Homepage listing section and product details use product API data |
| Unified | `unifieds_interactive` | `unifieds/interactive` | Homepage listing section and product details use product API data |
| Unified | `unifieds_mega` | `unifieds/mega` | Homepage listing section and product details use product API data |
| Unified | `unifieds_marketplace` | `unifieds/marketplace` | Homepage listing section and product details use product API data |
| Unified | `unifieds_minimal` | `unifieds/minimal` | Homepage, explore, and product details use product/category API data |
| Unified | `unifieds_modern` | `unifieds/modern` | Homepage listing section and product details use product API data |
| Unified | `unifieds_standard` | `unifieds/standard` | Homepage listing section and product details use product API data |

---

## Remaining Static / Mostly Static Themes

All 52 seeded storefront themes now contain direct `api.*` usage in their `.tsx` files for at least the homepage listing grid (Round 1 scope).

**Properties vertical complete for Round 1** (2026-05-24): `properties_modern`, `properties_platinum`, `properties_urban`, `properties_map`, `properties_unified`, `properties_showcase`, `properties_neighborhood`, and `properties_investment` now have live homepage listing grids.

**Events vertical complete for Round 1** (2026-05-24): `events_classic`, `events_creative`, `events_music`, `events_festival` now have live homepage listing grids.

---

## Conversion Plan

### Phase 1: Establish A Repeatable Conversion Contract

Target: make each vertical follow the same minimum dynamic surface.

- Homepage: fetch and render live records for the vertical.
- Explore page: support search, category/type filters, location filters where relevant, price/sort controls, pagination or load-more.
- Product/details page: fetch by slug and render a complete record view with graceful fallbacks.
- Offline/error state: show branded diagnostics without crashing.
- Empty state: render a premium empty catalog view instead of static mock content.

### Phase 2: Finish High-Reuse Base Themes

Convert the generic themes first because they can act as reusable reference patterns for QA and smoke testing.

All unified themes are now API-backed for the phase-one listings and product-detail scope.

Recommended API family: product/category APIs, matching `unifieds_minimal`.

### Phase 3: Complete Commerce And Services Gaps

**Services vertical — Round 2 complete (2026-05-24).** All 5 services themes have homepage listing grids and product detail pages.

Recommended API families: services/category/provider APIs for services.

### Phase 4: Complete Jobs And Events

**Jobs and Events verticals — Round 2 complete (2026-05-24).** All jobs and events themes have homepage listing grids and product detail pages.

Recommended API families: jobs APIs and events APIs.

### Phase 5: Complete Remaining Properties Themes

**Properties vertical — Round 2 complete (2026-05-24).** All 13 properties themes have homepage listing grids and product detail pages.

Recommended API family: property APIs plus lodging price calculation where booking/date flows exist.

---

## QA Checklist Per Theme

- Theme loads through `?theme={theme_key}`.
- Theme loads through `/preview/{theme_key}`.
- Homepage renders live data, loading state, empty state, and offline state.
- Explore route works if the theme exposes an explore/catalog experience.
- Product route fetches by slug and handles missing records cleanly.
- CSS remains scoped to the theme folder and does not leak into other themes.
- No hardcoded mock records remain in the primary rendered path.
- Mobile and desktop layouts remain stable after live data substitution.

---

## Notes

- `apps/storefront/THEME_MASTER_INVENTORY.md` previously reported 50 themes, but the current seeder and folders contain 52.
- The previous dynamic report said fifteen dynamic themes while listing sixteen. The source scan now finds 52 API-backed themes.
**Properties vertical — Round 2 complete (2026-05-24).** All 13 properties themes now have live homepage listing grids and product detail pages.

**Round 2 complete (2026-05-24):** All 52 themes now have `ProductPage.tsx` with live API-backed product detail views. The final gap was `services_marketplace`, which received a provider detail page, homepage `/product/{slug}` links, and inquiry form wiring.

- **Round 1 complete (2026-05-24):** All 52 themes have homepage listing grids wired to live API data. ExplorePage/CartPage parity and full QA remain where applicable.
