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
2. Properties — `properties_rental`, `properties_modern`
3. Ecommerce — `ecommerce_default`, `ecommerce_luxury`
4. Autos — `autos_modern`, `autos_luxury`
5. Events — `events_corporate`, `events_classic`
6. Jobs — `jobs_startup`, `jobs_corporate`
7. Services — `services_marketplace`, `services_local`
8. Classifieds — `classifieds_local`, `classifieds_general`

## Shared utilities (Unifieds)

- `apps/storefront/src/themes/unifieds/shared/useUnifiedThemeLink.ts`
- `apps/storefront/src/themes/unifieds/shared/demo-fallback.ts`

Clone these patterns for other verticals in later phases.
