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
4. Autos — `autos_modern`, `autos_luxury`
5. Events — `events_corporate`, `events_classic`
6. Jobs — `jobs_startup`, `jobs_corporate`
7. Services — `services_marketplace`, `services_local`
8. Classifieds — `classifieds_local`, `classifieds_general`

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
