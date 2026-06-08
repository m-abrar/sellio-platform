# Dynamic Theme Conversion Status Report

Last verified: 2026-06-08 (Round 1 — Events phase complete).

This report tracks which Sellio storefront themes have moved from static prototype markup toward live, API-backed React views. It should be read together with `apps/backend/database/seeders/ThemeSeeder.php`, which is the current seeded theme source of truth.

## Round 1 Progress (2 themes per vertical)

Target: **16 themes** baselined (2 × 8 verticals). Tracker: `_development/docs/storefront-round1-roadmap.md`.

| Vertical | Theme | Status | Notes |
| :--- | :--- | :---: | :--- |
| Unifieds | `unifieds_minimal` | ✅ | Theme-aware links, live empty/error states, Explore + Cart certified |
| Unifieds | `unifieds_default` | ✅ | Explore + Cart added; theme-aware links; cart badge in header |
| Properties | `properties_rental` | ✅ | Explore + booking flow; admin link for list CTA; demo fallback policy |
| Properties | `properties_modern` | ✅ | Theme-aware links; inquiry/rental sidebars; home + detail API error states |
| Ecommerce | `ecommerce_default` | ✅ | Explore + Cart; theme-aware links; demo fallback catalogue |
| Ecommerce | `ecommerce_luxury` | ✅ | Explore + Cart; luxury shell on subpages; shared cart |
| Autos | `autos_modern` | ✅ | Shared catalog + demo policy; Explore; inquiry CTA; theme-aware links |
| Autos | `autos_luxury` | ✅ | Luxury shell on subpages; shared catalog; inline form validation |
| Events | `events_corporate` | ✅ | Explore + delegate booking; shared catalog; theme-aware links |
| Events | `events_classic` | ✅ | Repertoire grid + RSVP; demo fallback policy; inline form validation |
| Jobs | `jobs_startup` | ⏳ | Pending |
| Jobs | `jobs_corporate` | ⏳ | Pending |
| Services | `services_marketplace` | ⏳ | Pending |
| Services | `services_local` | ⏳ | Pending |
| Classifieds | `classifieds_local` | ⏳ | Pending |
| Classifieds | `classifieds_general` | ⏳ | Pending |

**Completed:** 10 / 16

## Current Summary

| Metric | Count |
| :--- | ---: |
| Seeded themes in `ThemeSeeder` | 52 |
| Matching storefront theme folders | 52 |
| Theme folders with `Page.tsx` | 52 |
| Theme folders with exported `ProductPage` support | 52 |
| Theme folders with direct `api.*` usage in theme TSX files | 52 |
| Static / mostly static homepage themes remaining | 0 |
| Product detail pages remaining | 0 |
| Theme folders with `ExplorePage.tsx` | 12 |
| Theme folders with `CartPage.tsx` | 5 |
| Theme folders with static fallback/mock content in TSX | 36 |
| Round 1 baselined themes | 10 |

Definition: "API-backed" means the theme contains direct `api.*` usage in `.tsx` source files. This confirms live-data wiring exists, not that every route, interaction, empty state, fallback path, and visual breakpoint has been manually QA certified.

## Verified Complete Surfaces

- All 52 seeded storefront themes have a matching folder under `apps/storefront/src/themes`.
- All 52 themes have `Page.tsx`, `Layout.tsx`, `styles.css`, and an exported `ProductPage`.
- All 52 themes contain direct API usage in theme `.tsx` files.
- Homepage listing grids and product detail views are API-backed across the full seeded registry.

## Subroute Coverage

Only these themes currently provide dedicated explore route templates:

- `autos_luxury`
- `autos_modern`
- `ecommerce_default`
- `ecommerce_luxury`
- `events_corporate`
- `jobs_startup`
- `properties_classic`
- `properties_luxury`
- `properties_modern`
- `properties_rental`
- `unifieds_minimal`

Only these themes currently provide dedicated cart route templates:

- `ecommerce_default`
- `ecommerce_luxury`
- `properties_classic`
- `unifieds_default`
- `unifieds_minimal`

The shared app routes still include fallback warnings when the active theme does not export a route-specific template:

- `apps/storefront/src/app/product/[slug]/page.tsx`
- `apps/storefront/src/app/explore/[[...categorySlug]]/page.tsx`
- `apps/storefront/src/app/cart/page.tsx`

Product fallback should rarely be reached because all themes export `ProductPage`. Explore and cart fallback remains expected for themes without those subpages.

## Vertical Breakdown

| Vertical | Themes | API-backed | Product pages | Explore pages | Cart pages | Static fallback/mock content |
| :--- | ---: | ---: | ---: | ---: | ---: | ---: |
| Autos | 5 | 5 | 5 | 2 | 0 | 5 |
| Classifieds | 6 | 6 | 6 | 0 | 0 | 6 |
| Ecommerce | 4 | 4 | 4 | 0 | 0 | 2 |
| Events | 5 | 5 | 5 | 1 | 0 | 3 |
| Jobs | 6 | 6 | 6 | 1 | 0 | 5 |
| Properties | 13 | 13 | 13 | 2 | 1 | 12 |
| Services | 5 | 5 | 5 | 0 | 0 | 3 |
| Unifieds | 8 | 8 | 8 | 1 | 1 | 0 |

## Still Pending

- Decide whether every theme should have a first-class explore/catalog route, or whether app-level fallback is acceptable for themes that only expose homepage discovery.
- Decide whether every ecommerce/unified/property theme needs a first-class cart route, or whether cart support should stay limited to the themes with cart UX.
- Review the 36 themes with static fallback/mock records and classify each fallback as either acceptable offline resilience or debt to remove from the primary rendered path.
- Run live browser QA again for a representative set of homepage, product, explore, and cart routes after any route parity changes.
- Run storefront typecheck/build after route parity or fallback cleanup.

## QA Checklist Per Theme

- Theme loads through `?theme={theme_key}`.
- Theme loads through `/preview/{theme_key}`.
- Homepage renders live data, loading state, empty state, and offline state.
- Product route fetches by slug and handles missing records cleanly.
- Explore route works if the theme exports an explore/catalog experience.
- Cart route works if the theme exports cart UX.
- CSS remains scoped to the theme folder and does not leak into other themes.
- Static fallback content is not mistaken for live content in the primary happy path.
- Mobile and desktop layouts remain stable after live data substitution.

## Notes

- Previous versions of this report treated product detail completion and broader route parity as the same milestone. They are now separated.
- Previous versions reported all product details complete; the 2026-05-26 scan still supports that.
- Previous versions did not quantify explore/cart coverage; the current scan shows those are intentionally partial surfaces.
