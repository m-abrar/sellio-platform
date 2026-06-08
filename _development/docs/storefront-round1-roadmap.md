# Storefront Round 1 Roadmap

Goal: baseline **2 themes per vertical** (16 total).

## Definition of done

- Preview loads (`?theme=` and `/preview/{key}/`)
- Home: live API, loading / empty / error, mobile OK
- Product: slug fetch, 404, vertical CTA
- Explore + Cart where required (Unifieds + Ecommerce)
- Demo data only when API is down or `NEXT_PUBLIC_DEMO_FALLBACK=true`
- Browser QA at desktop + ~390px

## Phase order

1. Unifieds — `unifieds_minimal`, `unifieds_default` ✅
2. Properties — `properties_rental`, `properties_modern` ✅
3. Ecommerce — `ecommerce_default`, `ecommerce_luxury` ✅
4. Autos — `autos_modern`, `autos_luxury` ✅
5. Events — `events_corporate`, `events_classic` ✅
6. Jobs — `jobs_startup`, `jobs_corporate` ✅
7. Services — `services_marketplace`, `services_local` ✅
8. Classifieds — `classifieds_local`, `classifieds_general` ✅

## Shared utilities (Unifieds)

- `apps/storefront/src/themes/unifieds/shared/useUnifiedThemeLink.ts`
- `apps/storefront/src/themes/unifieds/shared/demo-fallback.ts`
- `apps/storefront/src/themes/unifieds/shared/cart.ts`
- `apps/storefront/src/themes/unifieds/shared/product-utils.ts`
- `apps/storefront/src/themes/unifieds/shared/useUnifiedCart.ts`
- `apps/storefront/src/themes/unifieds/shared/useUnifiedCartCount.ts`
- `apps/storefront/src/themes/unifieds/shared/menu-utils.ts`

## Shared utilities (Properties)

- `apps/storefront/src/themes/properties/shared/usePropertyThemeLink.ts`
- `apps/storefront/src/themes/properties/shared/demo-fallback.ts`

Clone these patterns for other verticals in later phases.

## Shared utilities (Ecommerce)

- `apps/storefront/src/themes/ecommerce/shared/useEcommerceThemeLink.ts`
- `apps/storefront/src/themes/ecommerce/shared/demo-fallback.ts`
- `apps/storefront/src/themes/ecommerce/shared/catalog.ts`
- `apps/storefront/src/themes/ecommerce/shared/fallback-data.ts`
- `apps/storefront/src/themes/ecommerce/shared/CatalogSyncAlert.tsx`
- Cart reuses `apps/storefront/src/themes/unifieds/shared/cart.ts` (`sellio_cart` storage key)

## Shared utilities (Autos)

- `apps/storefront/src/themes/autos/shared/useAutosThemeLink.ts`
- `apps/storefront/src/themes/autos/shared/demo-fallback.ts`
- `apps/storefront/src/themes/autos/shared/catalog.ts`
- `apps/storefront/src/themes/autos/shared/fallback-data.ts`
- `apps/storefront/src/themes/autos/shared/vehicle-utils.ts`
- `apps/storefront/src/themes/autos/shared/CatalogSyncAlert.tsx`

## Shared utilities (Events)

- `apps/storefront/src/themes/events/shared/useEventsThemeLink.ts`
- `apps/storefront/src/themes/events/shared/demo-fallback.ts`
- `apps/storefront/src/themes/events/shared/catalog.ts`
- `apps/storefront/src/themes/events/shared/fallback-data.ts`
- `apps/storefront/src/themes/events/shared/event-utils.ts`
- `apps/storefront/src/themes/events/shared/CatalogSyncAlert.tsx`

## Shared utilities (Jobs)

- `apps/storefront/src/themes/jobs/shared/useJobsThemeLink.ts`
- `apps/storefront/src/themes/jobs/shared/demo-fallback.ts`
- `apps/storefront/src/themes/jobs/shared/catalog.ts`
- `apps/storefront/src/themes/jobs/shared/fallback-data.ts`
- `apps/storefront/src/themes/jobs/shared/job-utils.ts`
- `apps/storefront/src/themes/jobs/shared/CatalogSyncAlert.tsx`

## Shared utilities (Services)

- `apps/storefront/src/themes/services/shared/useServicesThemeLink.ts`
- `apps/storefront/src/themes/services/shared/demo-fallback.ts`
- `apps/storefront/src/themes/services/shared/catalog.ts`
- `apps/storefront/src/themes/services/shared/fallback-data.ts`
- `apps/storefront/src/themes/services/shared/service-utils.ts`
- `apps/storefront/src/themes/services/shared/CatalogSyncAlert.tsx`

## Shared utilities (Classifieds)

- `apps/storefront/src/themes/classifieds/shared/useClassifiedsThemeLink.ts`
- `apps/storefront/src/themes/classifieds/shared/demo-fallback.ts`
- `apps/storefront/src/themes/classifieds/shared/catalog.ts`
- `apps/storefront/src/themes/classifieds/shared/fallback-data.ts`
- `apps/storefront/src/themes/classifieds/shared/listing-utils.ts`
- `apps/storefront/src/themes/classifieds/shared/CatalogSyncAlert.tsx`

## Rework notes (2026-06-08)

### Unifieds
- Centralized cart read/write/add and cart badge syncing
- Theme-aware nav defaults now include Cart for `unifieds_minimal` and `unifieds_default`
- Removed hardcoded preview URLs, alert-based CTAs, and fake `$980` pricing
- Product pages show inline add-to-cart feedback with View cart link
- Explore pages share sort typing, price formatting, and API error states

### Properties
- Shared `usePropertyThemeLink` and demo-fallback policy for rental + modern
- `properties_rental`: List property CTA links to admin create flow (no alert)
- `properties_modern`: theme links via MenuProvider; product/home API error parity with rental

### Ecommerce
- Shared catalog fetch + demo fallback products for default and luxury
- Added themed Explore + Cart pages; removed hardcoded `/preview/` URLs
- Product pages use shared cart helpers with inline “View cart” feedback
- Theme-aware links on home grids, hero CTAs, and luxury header logo

### Autos
- Shared catalog fetch, demo fallback policy, and theme-aware links for modern + luxury
- Explore pages use shared vehicle utils; empty states instead of silent fallback grids
- Product inquiry forms use inline validation (no `alert()`); `CatalogSyncAlert` on demo mode

### Events
- Shared catalog fetch, demo fallback policy, and theme-aware links for corporate + classic
- Corporate Explore uses shared filters; booking/RSVP forms use inline validation
- Classic repertoire grid links via `useEventsThemeLink`; patron CTA shows inline confirmation

### Jobs
- Shared catalog fetch, demo fallback policy, and theme-aware links for startup + corporate
- Startup Explore uses shared filters; application forms use inline validation
- Corporate home grid links via `useJobsThemeLink`; demo sample jobs when API is down in preview

### Services
- Shared catalog fetch, demo fallback policy, and theme-aware links for marketplace + local
- Marketplace booking modal uses inline errors; provider cards link via `useServicesThemeLink`
- Local service grid and product booking forms follow the same demo policy and validation pattern

### Classifieds
- Shared catalog fetch, demo fallback policy, and theme-aware links for local + general
- Local map/list split uses inquiry navigation instead of alert-based messaging
- General sidebar chat widget retained; inquiry forms use inline validation
