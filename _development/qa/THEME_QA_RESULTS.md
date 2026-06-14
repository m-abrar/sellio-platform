# Theme QA Results — 2026-06-14

All 52 storefront themes checked against the quality checklist.
Status: **COMPLETE**

Legend: ✅ Pass | ⚠️ Issue found & fixed | ❌ Issue found, needs fix | ➖ N/A

---

## Summary of Global Fixes

The following patterns were found and fixed across multiple themes:

| Issue | Files Fixed |
|---|---|
| `themeLink('')` → `themeLink('/')` (homepage link) | 20+ files across all verticals |
| `router.push(themeLink('/product/…'))` → `<a href>` wrapper | classifieds/premium, classifieds/local, classifieds/deals, classifieds/elite, jobs/tech, autos/used, autos/electric, autos/classic, ecommerce/fashion, ecommerce/electronics, properties/luxury |
| Internal language in buyer-facing copy | jobs/tech (BACK_TO_CONSOLE, OPPORTUNITY NODE), jobs/startup (BACK_TO_CONSOLE, Node Registry Error, RESET_CONSOLE, console filter copy) |
| `PremiumCard` interface: `onViewDetails: () => void` → `viewDetailsHref: string` | classifieds/premium/components |
| `ProductCard` interface: `onClick?: () => void` → `href?: string` | ecommerce/electronics/components |

---

## Results Table

| Rank | Theme Key | Language | Copyright | Header Logo | Footer Logo | Dead Links | Empty State | Error State | useRouter Nav | Lint | Status |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | unifieds_marketplace | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 2 | ecommerce_default | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 3 | ecommerce_fashion | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ Pass |
| 4 | ecommerce_electronics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ Pass |
| 5 | properties_modern | ✅ | ✅ | ✅ | ✅ | ➖ Orphaned | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 6 | properties_luxury | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ Pass |
| 7 | properties_rental | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 8 | properties_map | ✅ | ✅ | ⚠️ Fixed | ✅ | ➖ Orphaned | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 9 | unifieds_default | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 10 | unifieds_modern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 11 | classifieds_modern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 12 | classifieds_general | ✅ | ✅ | ✅ | ✅ | ➖ Orphaned | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 13 | classifieds_premium | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ Pass |
| 14 | classifieds_local | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ Pass |
| 15 | jobs_modern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 16 | jobs_corporate | ✅ | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 17 | jobs_tech | ⚠️ Fixed | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ Pass |
| 18 | services_marketplace | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ⚠️ | ✅ Pass |
| 19 | services_corporate | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 20 | autos_modern | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 21 | autos_used | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ Pass |
| 22 | events_classic | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 23 | events_corporate | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 24 | properties_classic | ✅ | ✅ | ✅ | ➖ Orphaned | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 25 | properties_vacation | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 26 | properties_commercial | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 27 | properties_investment | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 28 | properties_showcase | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 29 | properties_platinum | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 30 | properties_urban | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 31 | properties_neighborhood | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 32 | properties_unified | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 33 | ecommerce_luxury | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 34 | unifieds_mega | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 35 | unifieds_standard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 36 | unifieds_classic | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 37 | unifieds_interactive | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 38 | unifieds_minimal | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 39 | classifieds_deals | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ Pass |
| 40 | classifieds_elite | ✅ | ✅ | ✅ | ✅ | ➖ Orphaned | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ Pass |
| 41 | jobs_startup | ⚠️ Fixed | ✅ | ✅ | ✅ | ➖ Orphaned | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ Pass |
| 42 | jobs_freelance | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 43 | jobs_blue_collar | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 44 | services_local | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 45 | services_creative | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 46 | services_health | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ | ✅ Pass |
| 47 | autos_luxury | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 48 | autos_electric | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ✅ | ✅ Pass |
| 49 | autos_classic | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ Fixed | ⚠️ Fixed | ✅ | ✅ Pass |
| 50 | events_music | ✅ | ✅ | ✅ | ✅ | ➖ Orphaned | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 51 | events_festival | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |
| 52 | events_creative | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Pass |

---

## Lint Result

```
✖ 10 problems (0 errors, 10 warnings)
```

All 10 warnings are pre-existing unused `eslint-disable` directives in:
- `properties/classic/Page.tsx` (2 warnings)
- `properties/modern/ExplorePage.tsx` (1 warning)
- `properties/rental/ExplorePage.tsx` (1 warning)
- `services/marketplace/Page.tsx` (4 warnings)

No lint errors introduced by QA fixes.

---

## Per-Theme Detail

### themes with ⚠️ fixes applied

**classifieds_premium**
- `Page.tsx`: `homeHref={themeLink('')}` → `homeHref={themeLink('/')}` (PremiumHeader)
- `ProductPage.tsx`: removed `useRouter`/`handleBackNavigation`; fixed `homeHref={themeLink('')}` and `<a href={themeLink('')}>`
- `components/components.tsx`: `PremiumCard` prop `onViewDetails: () => void` → `viewDetailsHref: string`; button → `<a href>`

**classifieds_local**
- `Page.tsx`: removed `useRouter`; fixed `homeHref={themeLink('')}`; `onMessageClick: router.push(...)` → `location.href`
- `ProductPage.tsx`: removed `useRouter`; fixed `<a href={themeLink('')}>`
- `ExplorePage.tsx`: fixed `homeHref={themeLink('')}` and `<a href={themeLink('')}>`

**classifieds_deals**
- `ProductPage.tsx`: removed `handleCardClick` (was `router.push`); wrapped DealCard in `<a href>` (router kept for category filter nav)

**classifieds_elite**
- `Page.tsx`: wrapped PremiumCard in `<a href>`; handler props kept as `() => void`
- `ProductPage.tsx`: removed `useRouter`/`handleBackNavigation`; fixed not-found button and back link; related cards wrapped in `<a href>`

**classifieds_general**
- `ProductPage.tsx`: fixed `<a href={themeLink('')}>`  → `themeLink('/')`

**jobs_corporate**
- `ProductPage.tsx`: fixed `themeLink('')` → `themeLink('/')`
- `components/index.tsx`: fixed header logo `themeLink('')` → `themeLink('/')`

**jobs_tech**
- `Page.tsx`: wrapped TechJobCard in `<a href>`; removed `onClick` prop
- `ProductPage.tsx`: removed `useRouter`; fixed not-found button (was "Back to Console" → "Back to Listings"); fixed back link (removed "BACK_TO_CONSOLE" / "OPPORTUNITY NODE // slug" internal language); related cards wrapped in `<a href>`

**jobs_startup**
- `ProductPage.tsx`: fixed not-found state ("Node Registry Error" → "Job Not Found", "BACK_TO_CONSOLE" → "Back to Jobs"); fixed back link text ("BACK_TO_CONSOLE" → "Back to Jobs")
- `ExplorePage.tsx`: fixed "RESET_CONSOLE" → "Reset Filters" (×2); fixed empty-state copy ("No active nodes matching query" → "No positions match your search", "console filters" → "filters")

**autos_used**
- `ExplorePage.tsx`: removed `useRouter`; wrapped UsedCarCard in `<a href>` via `renderVehicleCard`
- `Page.tsx`: removed `useRouter`; wrapped UsedCarCard in `<a href>`
- `ProductPage.tsx`: removed `useRouter`; fixed not-found button; fixed back button; wrapped related UsedCarCard in `<a href>`

**autos_electric**
- `Page.tsx`: removed `useRouter`/`handleCardClick`; wrapped EVCard in `<a href>` and compare-header div → `<a>`
- `ExplorePage.tsx`: removed `useRouter`; wrapped EVCard in `<a href>`

**autos_classic**
- `ExplorePage.tsx`: removed `useRouter`; wrapped ClassicCarCard in `<a href>`
- `Page.tsx`: removed `useRouter`; wrapped ClassicCarCard in `<a href>`
- `ProductPage.tsx`: removed `useRouter`; fixed not-found button; fixed back button; wrapped related ClassicCarCard in `<a href>`

**ecommerce_fashion**
- `ProductPage.tsx`: removed `useRouter`/`handleSuggestedClick`; wrapped EditorialLookCard in `<a href>`; back button → `<a href>`

**ecommerce_electronics**
- `components/index.tsx`: `ProductCard` prop `onClick?: () => void` → `href?: string`; outer `<div onClick>` → `<a href>`
- `Page.tsx`: `mapApiProductToFrontend` and `mapFallbackProduct`: `onClick: () => { window.location.href = ... }` → `href: themeLink('/product/${slug}')`

**properties_luxury**
- `ProductPage.tsx` (RelatedCard): `<div onClick>` → `<a href>`
- `ExplorePage.tsx` (EstateCard): removed `handleClick`; `<div onClick>` → `<a href>`
- `components/EstateShowcase.tsx` (EstateCard): removed `handleClick`; `<div onClick>` → `<a href>`

**properties_map / properties_urban / properties_unified / properties_showcase / properties_platinum / properties_neighborhood / properties_investment**
- `ProductPage.tsx` for each: `themeLink('')` → `themeLink('/')` (back link + error state link)

**services_marketplace / services_health / services_corporate / services_local / services_creative**
- `ProductPage.tsx` for each: `themeLink('')` → `themeLink('/')`
- `shared/ServiceConsultationConfirmationPage.tsx`: `homeHref={themeLink('')}` → `homeHref={themeLink('/')}`

**events_classic / events_corporate**
- `ProductPage.tsx` and `ExplorePage.tsx`: `themeLink('')` → `themeLink('/')`

**classifieds_shared**
- `ClassifiedInquiryConfirmationPage.tsx`: `homeHref={themeLink('')}` and `<a href={themeLink('')}>` → `themeLink('/')`

---

## Orphaned Components (href="#" dead links — no fix needed)

These components have `href="#"` placeholder nav links but are **not imported** in any Layout.tsx or active page — confirmed orphaned:

| File | Reason |
|---|---|
| `classifieds/elite/components/components.tsx` | Not exported from components/index.tsx, not used in Layout.tsx |
| `classifieds/general/components/CommunityFooter.tsx` | Not used in Layout.tsx (Layout uses GeneralFooter) |
| `classifieds/general/components/UtilityHeader.tsx` | Not used in Layout.tsx (Layout uses GeneralHeader) |
| `jobs/startup/components/RocketHeader.tsx` | Referenced only in its own file |
| `events/music/components/MusicHeader.tsx` | Referenced only in its own file |
| `properties/modern/components/LifestyleHeader.tsx` | Referenced only in its own file |
| `properties/map/components/GeographicFooter.tsx` | Referenced only in its own file |
| `properties/classic/components/LegacyFooter.tsx` | Exported but Layout.tsx uses Footer, not LegacyFooter |
