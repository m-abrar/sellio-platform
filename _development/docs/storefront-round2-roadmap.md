# Storefront Round 2 Roadmap

Goal: baseline the remaining **36 themes** by cloning Round 1 reference patterns per vertical.

Round 1 reference themes (do not re-baseline unless regressions found):

| Vertical | Reference(s) |
|----------|----------------|
| Unifieds | `unifieds_minimal` |
| Properties | `properties_rental`, `properties_modern` |
| Ecommerce | `ecommerce_default` |
| Autos | `autos_modern` |
| Events | `events_corporate` |
| Jobs | `jobs_startup` |
| Services | `services_marketplace` |
| Classifieds | `classifieds_local` |

## Definition of done (same as Round 1)

- Preview loads (`?theme=` and `/preview/{key}/`)
- Home: live API, loading / empty / error, mobile OK
- Product: slug fetch, 404, vertical CTA (cart / inquiry / apply / book)
- Explore + Cart where the reference theme has them
- Demo data only when API is down or `NEXT_PUBLIC_DEMO_FALLBACK=true`
- No hardcoded `/preview/{theme}/` URLs or `alert()` CTAs
- Browser QA at desktop + ~390px

## Phase order

| Phase | Vertical | Themes (6–11 each) | Clone from | Target |
|------:|----------|-------------------|------------|--------|
| **1** | Unifieds | 6 remaining | `unifieds_minimal` / `unifieds_default` | 22 / 52 |
| **2** | Properties | 11 remaining | `properties_rental` / `properties_modern` | 33 / 52 |
| **3** | Ecommerce | 2 (`fashion`, `electronics`) | `ecommerce_default` | 35 / 52 |
| **4** | Autos | 3 (`classic`, `used`, `electric`) | `autos_modern` | 38 / 52 |
| **5** | Events | 3 (`music`, `creative`, `festival`) | `events_corporate` | 41 / 52 |
| **6** | Jobs | 4 (`tech`, `modern`, `blue_collar`, `freelance`) | `jobs_startup` | 45 / 52 |
| **7** | Services | 3 (`corporate`, `creative`, `health`) | `services_marketplace` | 48 / 52 |
| **8** | Classifieds | 4 (`deals`, `elite`, `modern`, `premium`) | `classifieds_local` | 52 / 52 |

**Hard lifts (extra QA budget):** `classifieds_deals`, `classifieds_modern`, `ecommerce_fashion`, `ecommerce_electronics`, `properties_vacation`.

## Phase 1 — Unifieds ✅

Themes: `unifieds_classic`, `unifieds_interactive`, `unifieds_marketplace`, `unifieds_mega`, `unifieds_modern`, `unifieds_standard`.

Deliverables:

- Shared `UnifiedExplorePage` + `UnifiedCartPage` + `subpages.css`
- Theme-aware links on home grids and product pages
- Shared cart helpers + inline “View cart” feedback on product pages
- Remove alert-based CTAs; hero/footer CTAs route to `/explore`
- Explore + Cart exported on all six themes

**Progress:** 22 / 52 themes baselined (Round 1: 16 + Round 2 Phase 1: 6)

## Phase 2 — Properties ✅

Themes: `properties_classic`, `properties_commercial`, `properties_investment`, `properties_luxury`, `properties_map`, `properties_neighborhood`, `properties_platinum`, `properties_showcase`, `properties_unified`, `properties_urban`, `properties_vacation`.

Deliverables:

- Shared `usePropertyThemeLink`, `useDemoFallbackAllowed`, `property-utils` (`getPropertyPrice`, `getPropertyLocation`, `getPropertyImage`, `scrollToSection`)
- Theme-aware product/home links; admin create URL for list CTAs
- Inline form validation (`formError` / success states) — no `alert()` CTAs
- Removed hardcoded `/preview/properties_*` URLs
- Classic keeps `/listing/{slug}` via `useClassicListingLink`; luxury Explore + classic Cart preserved

**Progress:** 33 / 52 themes baselined (Round 1: 16 + Round 2 Phase 1: 6 + Phase 2: 11)

## Phase 3 — Ecommerce ✅

Themes: `ecommerce_fashion`, `ecommerce_electronics`.

Deliverables:

- Shared `EcommerceExplorePage` + `EcommerceCartPage` + `subpages.css` (ef/el prefixes)
- Theme-aware links on home grids and product pages
- Shared cart helpers + inline “View cart” feedback on product pages
- Demo fallback gated by `useDemoFallbackAllowed`; `CatalogSyncAlert` on home + product
- Hero CTAs route to `/explore`; Explore + Cart exported on both themes

**Progress:** 35 / 52 themes baselined (Round 1: 16 + Round 2: 19)

## Phase 4 — Autos ✅

Themes: `autos_classic`, `autos_used`, `autos_electric`.

Deliverables:

- Shared `AutosExplorePage` + extended `catalog.ts` / `fallback-data.ts` for classic, used, electric variants
- `CatalogSyncAlert` + `subpages.css` prefixes (`ac`, `us`, `ev`)
- Theme-aware links on home grids and product pages (`useAutosThemeLink`)
- Demo fallback gated by `useDemoFallbackAllowed`; production empty states when API fails and demo off
- Hero CTAs route to `/explore`; Explore exported on all three themes (no Cart — inquiry CTAs)
- Removed hardcoded `/preview/autos_*` URLs and `alert()` CTAs

**Progress:** 38 / 52 themes baselined (Round 1: 16 + Round 2: 22)

## Phase 5 — Events ✅

Themes: `events_music`, `events_creative`, `events_festival`.

Deliverables:

- Shared `EventsExplorePage` + extended `catalog.ts` / `fallback-data.ts` for music, creative, festival variants
- `CatalogSyncAlert` + `subpages.css` prefixes (`evm`, `evc`, `eff`)
- Theme-aware links on home grids and product pages (`useEventsThemeLink`)
- Demo fallback gated by `useDemoFallbackAllowed`; production empty states when API fails and demo off
- Hero/header CTAs route to `/explore`; Explore exported on all three themes
- Inline RSVP form validation; removed `alert()` CTAs and hardcoded preview URLs

**Progress:** 41 / 52 themes baselined (Round 1: 16 + Round 2: 25)

## Phase 6 — Jobs ✅

Themes: `jobs_tech`, `jobs_modern`, `jobs_blue_collar`, `jobs_freelance`.

Deliverables:

- Shared `JobsExplorePage` + extended `catalog.ts` / `fallback-data.ts` for tech, modern, blue_collar, freelance variants
- `CatalogSyncAlert` + `subpages.css` prefixes (`jt`, `jm`, `jbc`, `jf`)
- Theme-aware links on home grids and product pages (`useJobsThemeLink`)
- Demo fallback gated by `useDemoFallbackAllowed`; production empty states when API fails and demo off
- Hero/header CTAs route to `/explore`; Explore exported on all four themes (apply flow, no Cart)
- Inline application form validation; removed `alert()` CTAs and hardcoded preview URLs

**Progress:** 45 / 52 themes baselined (Round 1: 16 + Round 2: 29)

## Shared utilities (Round 2 additions)

- `apps/storefront/src/themes/unifieds/shared/useDemoFallbackAllowed.ts`
- `apps/storefront/src/themes/unifieds/shared/UnifiedExplorePage.tsx`
- `apps/storefront/src/themes/unifieds/shared/UnifiedCartPage.tsx`
- `apps/storefront/src/themes/unifieds/shared/subpages.css`
- `apps/storefront/src/themes/properties/shared/useDemoFallbackAllowed.ts`
- `apps/storefront/src/themes/properties/shared/property-utils.ts`
- `apps/storefront/src/themes/ecommerce/shared/EcommerceExplorePage.tsx`
- `apps/storefront/src/themes/ecommerce/shared/EcommerceCartPage.tsx`
- `apps/storefront/src/themes/ecommerce/shared/subpages.css`
- `apps/storefront/src/themes/autos/shared/AutosExplorePage.tsx`
- `apps/storefront/src/themes/autos/shared/fallback-data.ts` (classic / used / electric variants)
- `apps/storefront/src/themes/autos/shared/subpages.css` (ac / us / ev prefixes)
- `apps/storefront/src/themes/events/shared/EventsExplorePage.tsx`
- `apps/storefront/src/themes/events/shared/fallback-data.ts` (music / creative / festival variants)
- `apps/storefront/src/themes/events/shared/subpages.css` (evm / evc / eff prefixes)
- `apps/storefront/src/themes/jobs/shared/JobsExplorePage.tsx`
- `apps/storefront/src/themes/jobs/shared/fallback-data.ts` (tech / modern / blue_collar / freelance variants)
- `apps/storefront/src/themes/jobs/shared/subpages.css` (jt / jm / jbc / jf prefixes)
