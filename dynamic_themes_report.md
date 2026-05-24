# Dynamic Theme Conversion Status Report

Last verified: 2026-05-24

This report tracks which Sellio storefront themes have moved from static prototype markup toward live, API-backed React views. It should be read together with `apps/storefront/THEME_MASTER_INVENTORY.md`, which tracks the full seeded theme registry.

---

## Current Summary

| Metric | Count |
| :--- | ---: |
| Seeded themes in `ThemeSeeder` | 52 |
| Matching storefront theme folders | 52 |
| API-backed themes found in source scan | 31 |
| Static / mostly static themes remaining | 21 |

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
| Events | `events_corporate` | `events/corporate` | Homepage, explore, and product details use events API data |
| Jobs | `jobs_startup` | `jobs/startup` | Homepage, explore, and product details use jobs API data |
| Jobs | `jobs_tech` | `jobs/tech` | Homepage and product details use jobs API data |
| Properties | `properties_classic` | `properties/classic` | Homepage, explore, product details, and cart use property/lodging API data |
| Properties | `properties_commercial` | `properties/commercial` | Homepage and product details use property API data |
| Properties | `properties_luxury` | `properties/luxury` | Showcase, explore, and product details use property/lodging API data |
| Properties | `properties_rental` | `properties/rental` | Homepage and product details use property/lodging API data |
| Properties | `properties_vacation` | `properties/vacation` | Homepage and product details use property/lodging API data |
| Services | `services_marketplace` | `services/marketplace` | Homepage uses services API data |
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

These themes have matching storefront folders but no direct `api.*` usage in their `.tsx` files at the time of this scan.

| Vertical | Remaining Themes | Count |
| :--- | :--- | ---: |
| Properties | `properties_modern`, `properties_platinum`, `properties_urban`, `properties_map`, `properties_unified`, `properties_showcase`, `properties_neighborhood`, `properties_investment` | 8 |
| Events | `events_classic`, `events_creative`, `events_music`, `events_festival` | 4 |
| Services | `services_corporate`, `services_creative`, `services_local`, `services_health` | 4 |
| Jobs | `jobs_corporate`, `jobs_modern`, `jobs_blue_collar`, `jobs_freelance` | 4 |
| Ecommerce | `ecommerce_luxury` | 1 |

Total remaining: 21 themes.

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

These are compact groups with clear existing API references.

1. `ecommerce_luxury`
2. `services_corporate`
3. `services_creative`
4. `services_local`
5. `services_health`

Recommended API families: product/category APIs for ecommerce; services/category/provider APIs for services.

### Phase 4: Complete Jobs And Events

These verticals should follow existing patterns from `jobs_startup`, `jobs_tech`, and `events_corporate`.

1. `jobs_corporate`
2. `jobs_modern`
3. `jobs_blue_collar`
4. `jobs_freelance`
5. `events_classic`
6. `events_creative`
7. `events_music`
8. `events_festival`

Recommended API families: jobs APIs and events APIs.

### Phase 5: Complete Remaining Properties Themes

Properties has the largest remaining block and should be handled after the patterns are stable.

1. `properties_modern`
2. `properties_platinum`
3. `properties_urban`
4. `properties_map`
5. `properties_unified`
6. `properties_showcase`
7. `properties_neighborhood`
8. `properties_investment`

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
- The previous dynamic report said fifteen dynamic themes while listing sixteen. The source scan now finds 31 API-backed themes.
- This report intentionally distinguishes "API-backed" from "fully QA-certified dynamic." The next pass should validate each API-backed theme view-by-view.
