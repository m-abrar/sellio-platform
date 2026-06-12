# Theme Finalization Priority - 2026-06-12

## Purpose

This list ranks Sellio's 52 storefront themes in the recommended order for final polishing before CodeCanyon submission.

The order is based on expected marketplace selling impact, not literal theme-by-theme sales, because the themes are bundled inside Sellio rather than sold as separate CodeCanyon items.

## Market Signals Used

- Ecommerce / multivendor products show the broadest CodeCanyon demand.
- Real estate / property products show strong Laravel-specific demand.
- Job portal and classifieds products have proven demand, but less breadth than ecommerce and real estate.
- Autos, events, and services add differentiation and demo breadth, but should be finalized after the highest-demand verticals unless a specific theme is already nearly perfect.
- Unified marketplace themes matter because they communicate Sellio's overall platform value in the first demo impression.

## Finalization Order

| Rank | Theme Key | Vertical | Priority | Reason |
| ---: | --- | --- | --- | --- |
| 1 | `unifieds_marketplace` | Unified | P0 | **Polished 2026-06-12.** Best overall CodeCanyon positioning: shows Sellio as a broad marketplace platform. |
| 2 | `ecommerce_default` | Ecommerce | P0 | **Polished 2026-06-12.** Core ecommerce buyer expectation; now reads as a complete retail storefront. |
| 3 | `ecommerce_fashion` | Ecommerce | P0 | Fashion ecommerce is highly visual and strong for screenshots. |
| 4 | `ecommerce_electronics` | Ecommerce | P0 | Electronics is a common marketplace/demo category with strong commercial appeal. |
| 5 | `properties_modern` | Properties | P0 | Real estate Laravel scripts have strong proven demand; modern should be the safest showcase. |
| 6 | `properties_luxury` | Properties | P0 | High visual impact for listing screenshots and demo browsing. |
| 7 | `properties_rental` | Properties | P0 | Rental/booking angle adds monetizable depth beyond simple listings. |
| 8 | `properties_map` | Properties | P0 | Map-first real estate search is a major buyer expectation. |
| 9 | `unifieds_default` | Unified | P0 | Fallback/default theme must be polished because it is the first safety net. |
| 10 | `unifieds_modern` | Unified | P0 | Strong general-purpose demo candidate. |
| 11 | `classifieds_modern` | Classifieds | P1 | Classified marketplace is a close fit for CodeCanyon buyers. |
| 12 | `classifieds_general` | Classifieds | P1 | Baseline classified ads flow should be stable and familiar. |
| 13 | `classifieds_premium` | Classifieds | P1 | Adds a higher-end classified demo option. |
| 14 | `classifieds_local` | Classifieds | P1 | Local marketplace positioning is practical and easy for buyers to understand. |
| 15 | `jobs_modern` | Jobs | P1 | Job board products have proven demand; modern should be the primary jobs showcase. |
| 16 | `jobs_corporate` | Jobs | P1 | Corporate recruiting is the safest commercial jobs angle. |
| 17 | `jobs_tech` | Jobs | P1 | Tech hiring has strong visual and business relevance. |
| 18 | `services_marketplace` | Services | P1 | Service marketplace fits Sellio's multi-vertical promise. |
| 19 | `services_corporate` | Services | P1 | Practical for agencies and B2B buyers. |
| 20 | `autos_modern` | Autos | P1 | Modern vehicle marketplace should be the primary autos showcase. |
| 21 | `autos_used` | Autos | P1 | Used-car marketplace is practical and broadly understandable. |
| 22 | `events_classic` | Events | P1 | Baseline event listing/booking should be stable. |
| 23 | `events_corporate` | Events | P1 | Corporate events are commercially useful and less niche than music/festival. |
| 24 | `properties_classic` | Properties | P2 | Familiar real estate layout; useful but less exciting than modern/luxury/map. |
| 25 | `properties_vacation` | Properties | P2 | Good visual appeal; secondary after rental/map. |
| 26 | `properties_commercial` | Properties | P2 | Useful business niche; less broad than residential/rental. |
| 27 | `properties_investment` | Properties | P2 | Strong niche for investors; polish after core property themes. |
| 28 | `properties_showcase` | Properties | P2 | Screenshot-friendly but less workflow-heavy. |
| 29 | `properties_platinum` | Properties | P2 | Premium variant; useful once luxury is solid. |
| 30 | `properties_urban` | Properties | P2 | Nice lifestyle variant; secondary priority. |
| 31 | `properties_neighborhood` | Properties | P2 | Useful differentiation, but not a primary sales driver. |
| 32 | `properties_unified` | Properties | P2 | Good platform bridge; after stronger property demos. |
| 33 | `ecommerce_luxury` | Ecommerce | P2 | High visual value, but narrower than default/fashion/electronics. |
| 34 | `unifieds_mega` | Unified | P2 | Strong for mega marketplace feel; check complexity carefully. |
| 35 | `unifieds_standard` | Unified | P2 | Practical general variant. |
| 36 | `unifieds_classic` | Unified | P2 | Useful fallback style, lower visual differentiation. |
| 37 | `unifieds_interactive` | Unified | P2 | Differentiator; polish after core reliability themes. |
| 38 | `unifieds_minimal` | Unified | P2 | Nice aesthetic variant, but less sales-critical. |
| 39 | `classifieds_deals` | Classifieds | P2 | Good for bargain marketplace demos. |
| 40 | `classifieds_elite` | Classifieds | P2 | Premium variant; less essential than modern/general/premium/local. |
| 41 | `jobs_startup` | Jobs | P2 | Appealing niche, but after modern/corporate/tech. |
| 42 | `jobs_freelance` | Jobs | P2 | Useful gig-work angle; secondary. |
| 43 | `jobs_blue_collar` | Jobs | P2 | Good differentiation; narrower market. |
| 44 | `services_local` | Services | P2 | Practical local-services angle. |
| 45 | `services_creative` | Services | P2 | Good visual theme; less broad than marketplace/corporate. |
| 46 | `services_health` | Services | P2 | Niche and trust-sensitive; polish later. |
| 47 | `autos_luxury` | Autos | P2 | Very screenshot-friendly, but niche. |
| 48 | `autos_electric` | Autos | P2 | Trendy, but narrower than modern/used. |
| 49 | `autos_classic` | Autos | P3 | Nice niche variant; lower sales urgency. |
| 50 | `events_music` | Events | P3 | Visually strong, niche compared with event booking baseline. |
| 51 | `events_festival` | Events | P3 | Good visual niche; finalize late. |
| 52 | `events_creative` | Events | P3 | Useful variant, but likely lowest immediate sales impact. |

## Recommended Workflow

Finalize in batches:

1. **P0 themes:** ranks 1-10. These should be polished before any CodeCanyon submission screenshots are captured.
2. **P1 themes:** ranks 11-23. These should be reliable enough for reviewer/demo exploration.
3. **P2 themes:** ranks 24-48. These should avoid broken UI, broken routing, and obvious static-data leaks.
4. **P3 themes:** ranks 49-52. These can be lighter polish as long as they do not break the demo.

For each theme, verify:

- homepage layout and responsive behavior
- listing/explore page
- detail/product page
- live API data or clear demo fallback behavior
- theme-aware links under `/preview/{theme_key}`
- empty states
- no overlapping text/buttons
- no broken images
- no console/runtime errors

## Progress Notes

### `unifieds_marketplace` - Polished 2026-06-12

Reference concept checked:

`D:\Sellio\_development\reference-library\REFERENCE_LIBRARY\unified\marketplace`

Result:

- The previous implementation partially carried the structure, but the concept had drifted into a dark TradeNode/exchange style.
- The homepage has been realigned to the reference marketplace hub concept with a blue/orange palette, search integration, featured listing carousel, category blocks, trending item cards, top-rated seller trust section, and clear marketplace CTAs.
- Existing Sellio behavior was preserved: API-backed products, demo fallback listings, theme-aware preview links, shared unified explore/cart/checkout flow, and menu-driven header/footer.
- Verification passed with `npm.cmd run lint` and `npm.cmd run build` in `apps/storefront`.
- Second-pass cleanup fixed marketplace action buttons so header CTA menu items navigate correctly, removed one leftover sync-style sentence, and reverified `/preview/unifieds_marketplace` with HTTP 200.
- Preview stability fix: `getActiveTheme()` is now cached per request and preserves the requested preview theme as the offline fallback, preventing the page from rewrapping in `unifieds_default` if the active-theme API fails during preview.
- Live preview content fix: stale backend/theme default records for `unifieds_marketplace` were still serving the old Liquid Exchange hero/menu/footer copy. The frontend defaults, backend seeders, and current local DB records were updated to the MarketHub marketplace concept; `/preview/unifieds_marketplace` now returns no old Trade/Exchange hero or menu text.

### `ecommerce_default` - Polished 2026-06-12

Reference concept checked:

`D:\Sellio\_development\reference-library\REFERENCE_LIBRARY\ecommerce\default`

Result:

- The reference ecommerce default concept centers on familiar shop behavior: category/search browsing, square product cards, price overlays, featured/stock signals, product detail, cart, checkout, and seller/product metadata.
- The current Next storefront already had the core page structure, so the polish focused on buyer-facing credibility rather than a broad redesign.
- Homepage copy was changed from internal sync/protocol wording to clear retail language.
- Product cards were upgraded to match the reference intent with square media, price overlay, featured badge support, category/SKU metadata, stock state, and a clear product action.
- The explore directory now reuses the same ecommerce card pattern and cleaner buyer copy.
- Product detail and footer copy were cleaned to remove old protocol language and mojibake characters.
- CSS now uses named section classes for the category strip, collection section, newsletter block, and footer instead of brittle inline-style responsive selectors.
- Verification passed with `npm.cmd run lint`, `npm.cmd run build`, `/preview/ecommerce_default` HTTP 200, and `/api/themes/active` with `X-Theme-Key=ecommerce_default` HTTP 200.
- Second-pass cleanup removed the last defensive `href="#"` fallback from category ribbons and reverified `/preview/ecommerce_default` with HTTP 200.
- Preview stability fix: `getActiveTheme()` is now cached per request and preserves the requested preview theme as the offline fallback, preventing the hero from losing its theme wrapper/CSS after a refresh or transient API failure.
