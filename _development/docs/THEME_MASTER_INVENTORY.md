# Sellio Theme Master Inventory

Status: 52/52 storefront theme folders present and aligned with `ThemeSeeder`.

Last verified: 2026-05-24

---

## Source Of Truth

- Seeder registry: `apps/backend/database/seeders/ThemeSeeder.php`
- Storefront implementations: `apps/storefront/src/themes`
- Dynamic conversion tracker: `dynamic_themes_report.md`
- Theme runtime resolver: `apps/storefront/src/lib/theme.ts`

The storefront loads themes by converting a database `theme_key` into a folder path:

- `properties_luxury` -> `properties/luxury`
- `unifieds_default` -> `unifieds/default`

Theme overrides are supported through `/preview/{theme_key}/...`, `?theme={theme_key}`, and the persisted `theme` cookie.

---

## Progress Summary

| Metric | Count | Notes |
| :--- | ---: | :--- |
| Seeded themes | 52 | Registered by `ThemeSeeder` |
| Storefront folders | 52 | All seeded keys have matching theme folders |
| API-backed themes | 52 | Themes with live `api.*` usage in `.tsx` files |
| Static / mostly static themes remaining | 0 | All seeded themes have homepage listing API integration |
| Round 1 listings dynamic | 52 | Homepage listing grid wired to live API |
| Product detail pages (`ProductPage.tsx`) | 52 | All themes export `ProductPage` from `index.ts` |

---

## Unified Vertical (8 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `unifieds_default` | `unifieds/default` | Yes | Yes |
| `unifieds_standard` | `unifieds/standard` | Yes | Yes |
| `unifieds_classic` | `unifieds/classic` | Yes | Yes |
| `unifieds_modern` | `unifieds/modern` | Yes | Yes |
| `unifieds_mega` | `unifieds/mega` | Yes | Yes |
| `unifieds_interactive` | `unifieds/interactive` | Yes | Yes |
| `unifieds_minimal` | `unifieds/minimal` | Yes | Yes |
| `unifieds_marketplace` | `unifieds/marketplace` | Yes | Yes |

## Properties Vertical (13 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `properties_classic` | `properties/classic` | Yes | Yes |
| `properties_modern` | `properties/modern` | Yes | Yes |
| `properties_luxury` | `properties/luxury` | Yes | Yes |
| `properties_platinum` | `properties/platinum` | Yes | Yes |
| `properties_urban` | `properties/urban` | Yes | Yes |
| `properties_rental` | `properties/rental` | Yes | Yes |
| `properties_vacation` | `properties/vacation` | Yes | Yes |
| `properties_map` | `properties/map` | Yes | Yes |
| `properties_unified` | `properties/unified` | Yes | Yes |
| `properties_commercial` | `properties/commercial` | Yes | Yes |
| `properties_showcase` | `properties/showcase` | Yes | Yes |
| `properties_neighborhood` | `properties/neighborhood` | Yes | Yes |
| `properties_investment` | `properties/investment` | Yes | Yes |

## Autos Vertical (5 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `autos_classic` | `autos/classic` | Yes | Yes |
| `autos_modern` | `autos/modern` | Yes | Yes |
| `autos_used` | `autos/used` | Yes | Yes |
| `autos_luxury` | `autos/luxury` | Yes | Yes |
| `autos_electric` | `autos/electric` | Yes | Yes |

## Events Vertical (5 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `events_classic` | `events/classic` | Yes | Yes (R1) |
| `events_creative` | `events/creative` | Yes | Yes (R1) |
| `events_corporate` | `events/corporate` | Yes | Yes |
| `events_music` | `events/music` | Yes | Yes (R1) |
| `events_festival` | `events/festival` | Yes | Yes (R1) |

## Services Vertical (5 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `services_corporate` | `services/corporate` | Yes | Yes |
| `services_marketplace` | `services/marketplace` | Yes | Yes |
| `services_creative` | `services/creative` | Yes | Yes (R1) |
| `services_local` | `services/local` | Yes | Yes (R1) |
| `services_health` | `services/health` | Yes | Yes (R1) |

## Jobs Vertical (6 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `jobs_corporate` | `jobs/corporate` | Yes | Yes (R1) |
| `jobs_startup` | `jobs/startup` | Yes | Yes |
| `jobs_tech` | `jobs/tech` | Yes | Yes |
| `jobs_modern` | `jobs/modern` | Yes | Yes (R1) |
| `jobs_blue_collar` | `jobs/blue_collar` | Yes | Yes (R1) |
| `jobs_freelance` | `jobs/freelance` | Yes | Yes (R1) |

## Classifieds Vertical (6 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `classifieds_general` | `classifieds/general` | Yes | Yes |
| `classifieds_modern` | `classifieds/modern` | Yes | Yes |
| `classifieds_local` | `classifieds/local` | Yes | Yes |
| `classifieds_deals` | `classifieds/deals` | Yes | Yes |
| `classifieds_premium` | `classifieds/premium` | Yes | Yes |
| `classifieds_elite` | `classifieds/elite` | Yes | Yes |

## Ecommerce Vertical (4 Themes)

| Theme Key | Folder | Frontend Folder | API Backed |
| :--- | :--- | :---: | :---: |
| `ecommerce_default` | `ecommerce/default` | Yes | Yes |
| `ecommerce_b2b` | `ecommerce/b2b` | Yes | Yes |
| `ecommerce_luxury` | `ecommerce/luxury` | Yes | Yes |
| `ecommerce_fashion` | `ecommerce/fashion` | Yes | Yes |
| `ecommerce_electronics` | `ecommerce/electronics` | Yes | Yes |

---

## Documentation Notes

- This file tracks registry and folder parity plus API-backed status.
- `dynamic_themes_report.md` tracks conversion detail and the remaining delivery plan.
- "API Backed" means at least one theme `.tsx` file directly calls the shared API client. It does not guarantee that every view in the theme is fully dynamic.
