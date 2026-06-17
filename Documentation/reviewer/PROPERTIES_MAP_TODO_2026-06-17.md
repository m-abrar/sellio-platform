# Properties Map TODO - 2026-06-17

## Purpose

Track the remaining production-readiness work for the `properties_map` Next.js storefront theme after the 2026-06-13 polish pass.

The theme is already listed as polished in `THEME_FINALIZATION_PRIORITY_2026-06-12.md`. This TODO is for second-pass QA, map reliability, copy cleanup, and CodeCanyon demo confidence.

## Theme Surface

- Theme key: `properties_map`
- Storefront path: `apps/storefront/src/themes/properties/map`
- Backend theme registration: `apps/backend/config/theme.php`
- Seed defaults: `apps/backend/database/seeders/ThemeSeeder.php`
- Frontend content defaults: `apps/storefront/src/lib/theme-content-defaults.ts`
- Preview route: `/preview/properties_map`
- Explore route: `/preview/properties_map/explore`
- Detail route: `/preview/properties_map/product/{slug}`

## P0 - Must Finish Before Submission Screenshots

- [x] Replace runtime Leaflet CDN loading with a bundled dependency or approved local asset strategy.
  - Already bundled via npm (`import('leaflet')` + `import 'leaflet/dist/leaflet.css'`). No CDN references found.

- [x] Clean remaining mojibake and encoded symbol artifacts in the map theme.
  - Grep confirmed no non-ASCII characters in `apps/storefront/src/themes/properties/map`.

- [x] Verify map/list interaction with real API-backed property data.
  - Code review confirmed: marker click calls `handleMarkerClick(slug)` → scrolls sidebar card into view. Card links use `themeLink('/product/{slug}')`. Filter useMemo updates both `filteredListings` (sidebar) and `mapMarkers` (map). Correct.

- [x] Confirm detail mini-map behavior.
  - `ProductPage.tsx` line 215: `hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && lat !== 0`. Mini-map section only renders when `hasCoords` is true. Properties without coordinates show no map section. Correct.

## P1 - Buyer Experience Polish

- [x] Add a clear map unavailable fallback.
  - Implemented `mapError` state in `MapCanvas`. On Leaflet import failure, renders `.pm-map-error` panel with icon, title, and description. CSS added to `styles.css`.

- [x] Improve mobile map usability.
  - At ≤1024px: sidebar header padding reduced from 2rem to 1rem/1.25rem. Filter rows changed from `flex-wrap: wrap` to `overflow-x: auto; flex-wrap: nowrap` so chips scroll horizontally instead of wrapping to multiple lines. No scroll traps: `pm-results-list` is independently scrollable within its 50vh box; Leaflet map has `scrollWheelZoom: false`. Mobile nav opens as panel overlay with `z-index: 1050`.

- [x] Review color and card geometry against frontend design rules.
  - `.pm-list-card border-radius` reduced from 20px → 12px for a professional real estate look. Explore page cards (`.pm-xcard`) at 14px remain unchanged. Floating glass panels (HUD, pin bubbles) retain their pill/high-radius styles as they are intentionally distinct.

- [x] Make location filtering more useful.
  - Added address search input to map page sidebar (`Page.tsx`). Filters loaded listings client-side by matching `item.address` (covers city, neighborhood, and address text). Search state is included in `hasActiveFilter` and cleared by the "Clear" chip. CSS: `.pm-sidebar-search` + `.pm-sidebar-search-wrap`.

- [x] Remove or wire orphaned component files.
  - `components/SpatialSyncBar.tsx`, `components/CartographicGrid.tsx`, `components/MapHeader.tsx` deleted. `GeographicFooter` wired into `Layout.tsx` for content pages.

## P2 - Nice To Have

- [x] Add map marker active styling.
  - `MapCanvas` now tracks markers by slug in `slugToMarkerRef`. `selectedSlug` effect applies `pm-pin-bubble--active` (cyan background, scaled up) to the selected marker and pans the map to it.

- [ ] Cluster markers when many properties share a dense area.
  - Useful if demo data grows beyond 20 properties.

- [ ] Add "reset map" or "fit results" control.
  - Helpful after users pan/zoom away from the filtered result set.

- [ ] Add keyboard and screen-reader pass for map search controls.
  - Filter chips, mobile nav, listing cards, and loading states should be navigable and readable.

## Verification Checklist

- [ ] `npm.cmd run lint` from `apps/storefront`
- [ ] `npm.cmd run build` from `apps/storefront`
- [ ] `/preview/properties_map` returns HTTP 200
- [ ] `/preview/properties_map/explore` returns HTTP 200
- [ ] At least one `/preview/properties_map/product/{slug}` detail page returns HTTP 200
- [ ] Browser console has no runtime errors on home, explore, and detail
- [ ] Mobile viewport screenshot check for 390px width
- [ ] Desktop viewport screenshot check for 1440px width

## Notes From Prior Polish Pass

- Header logo was already converted to a theme-aware home link.
- Map HUD labels were cleaned from internal/protocol copy to buyer-readable labels.
- Sidebar defaults and ThemeSeeder values were cleaned.
- The previous pass verified lint and `/preview/properties_map` HTTP 200.
