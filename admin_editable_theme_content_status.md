# Admin-Editable Theme Content Status

Last updated: 2026-05-25

This tracks storefront themes converted to the structured theme-content slot system used by `/admin/content`.

Definition of complete: the theme has admin-editable homepage slots wired through the storefront, fallback defaults in `apps/storefront/src/lib/theme-content-defaults.ts`, and seeded/admin defaults in the backend content registry.

## Summary

| Status | Count |
| :--- | ---: |
| Complete | 17 |
| Pending | 35 |
| Total seeded themes | 52 |

## Complete

| Vertical | Theme Key | Theme |
| :--- | :--- | :--- |
| Autos | `autos_classic` | Autos Classic / Dealer |
| Autos | `autos_electric` | Autos Electric / Green Cars |
| Autos | `autos_luxury` | Autos Luxury / Premium |
| Autos | `autos_modern` | Autos Modern / Showcase |
| Autos | `autos_used` | Autos Used / Marketplace |
| Classifieds | `classifieds_general` | Classifieds General / Marketplace |
| Ecommerce | `ecommerce_fashion` | Ecommerce Fashion |
| Events | `events_classic` | Events Classic |
| Events | `events_corporate` | Events Corporate |
| Events | `events_creative` | Events Creative |
| Events | `events_festival` | Events Festival / Outdoor |
| Events | `events_music` | Events Music / Concert |
| Jobs | `jobs_corporate` | Jobs Corporate / Professional |
| Jobs | `jobs_startup` | Jobs Startup / Modern |
| Jobs | `jobs_tech` | Jobs Tech / IT |
| Properties | `properties_classic` | Properties Classic |
| Services | `services_marketplace` | Services Marketplace / Freelance |

## Pending

| Vertical | Theme Key | Theme |
| :--- | :--- | :--- |
| Classifieds | `classifieds_deals` | Classifieds Deals / Bargain |
| Classifieds | `classifieds_elite` | Classifieds Elite |
| Classifieds | `classifieds_local` | Classifieds Local / Community |
| Classifieds | `classifieds_modern` | Classifieds Modern / Card Style |
| Classifieds | `classifieds_premium` | Classifieds Premium |
| Ecommerce | `ecommerce_default` | Ecommerce Standard |
| Ecommerce | `ecommerce_electronics` | Ecommerce Electronics |
| Ecommerce | `ecommerce_luxury` | Ecommerce Luxury |
| Jobs | `jobs_blue_collar` | Jobs Blue-Collar / Local |
| Jobs | `jobs_freelance` | Jobs Freelance / Gig Economy |
| Jobs | `jobs_modern` | Jobs Modern |
| Properties | `properties_commercial` | Properties Commercial Real Estate |
| Properties | `properties_investment` | Investment / ROI Focused |
| Properties | `properties_luxury` | Properties Luxury |
| Properties | `properties_map` | Properties Map View |
| Properties | `properties_modern` | Properties Modern |
| Properties | `properties_neighborhood` | Neighborhood Focused |
| Properties | `properties_platinum` | Properties Platinum |
| Properties | `properties_rental` | Properties Rental / Vacation |
| Properties | `properties_showcase` | Single Property Showcase |
| Properties | `properties_unified` | Properties Unified / All-in-One |
| Properties | `properties_urban` | Properties Urban |
| Properties | `properties_vacation` | Properties Vacation |
| Services | `services_corporate` | Services Corporate / Agency |
| Services | `services_creative` | Services Creative / Studio |
| Services | `services_health` | Services Health & Wellness |
| Services | `services_local` | Services Home / Local |
| Unified | `unifieds_classic` | Universal Classic |
| Unified | `unifieds_default` | Universal Default |
| Unified | `unifieds_interactive` | Universal Interactive |
| Unified | `unifieds_marketplace` | Universal Marketplace |
| Unified | `unifieds_mega` | Universal Mega |
| Unified | `unifieds_minimal` | Universal Minimal |
| Unified | `unifieds_modern` | Universal Modern |
| Unified | `unifieds_standard` | Universal Standard |

## Update Rules

- Move a theme from Pending to Complete only after storefront hooks, frontend defaults, backend defaults, and admin slot visibility are all in place.
- Keep this file in sync when adding new seeded themes to `apps/backend/database/seeders/ThemeSeeder.php`.
- This file tracks admin-editable content slots only. API-backed listing/product status is tracked separately in `dynamic_themes_report.md`.
