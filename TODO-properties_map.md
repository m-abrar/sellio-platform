## Completed

- [x] Fixed `MapHeader` in `components/index.tsx`: logo `<div>MAPNEXUS</div>` → `<a href={themeLink('/')}>MAPNEXUS</a>` using `usePropertyThemeLink`.
- [x] Fixed `MapHUD` in `components/index.tsx`: HUD overlay labels `SPATIAL_COORDINATES` → `Location` and `DISTRICT_INTEGRITY` → `Coverage` — these were visible on the map canvas as a dark glass card.
- [x] Fixed `Page.tsx` sidebar defaults: `UNITS` → `listings`; `FILTER|PRICE|TYPE` → `Filter|Price|Type`; `END_OF_REGISTRY` → `End of results`; error state raw `{propertyError}` → static buyer-friendly message.
- [x] Fixed ThemeSeeder `properties_map`: all 9 values updated to match cleaned defaults (`Registry Nodes` → `Properties`, `UNITS` → `listings`, `Empty Property Registry` → `No listings yet`, `END_OF_REGISTRY` → `End of results`, offline kicker/title cleaned up).
- [x] Identified orphaned component files (`SpatialSyncBar.tsx`, `CartographicGrid.tsx`, `MapHeader.tsx`) not exported from `components/index.tsx` — not used in any rendered path; left in place.
- [x] Verified: `npm.cmd run lint` (0 errors), `/preview/properties_map` HTTP 200.
- [x] Added real Leaflet map canvas (OpenStreetMap tiles via CDN) replacing the CSS grid mock. Map loads client-side with no API key required.
- [x] Wired map pins to actual listing data — each pin shows the real price, carries the property address as a hover tooltip, and clicking a pin highlights + scrolls to the matching card in the sidebar.
- [x] Added working price and type filter chips to the sidebar: price ranges (All / <$1M / $1M–$3M / $3M+) and listing type (All Types / Buy / Rent) filter the visible listings and map pins. A Clear button appears when any filter is active.
- [x] Replaced `MenuNav`/`MenuActionButtons` in `MapHeader` with `useMenu` + static fallback nav (Browse, Buy, Rent, New Listings). A hardcoded "Search Map" CTA button is always visible on desktop and in the mobile drawer.
- [x] Fixed `ProductPage.tsx`: removed all internal language ("Registry node", "Spatial Node", "synchronized from the Sellio catalog", "Inquiry logged") → buyer-facing copy; "Request Site Visit" → "Request a Viewing"; improved coordinates display format; added bedrooms/bathrooms to specs panel.
- [x] Cleaned `GeographicFooter.tsx`: removed "high-fidelity geographical distribution node" and all SPATIAL/SYSTEMS/NETWORK jargon; wired all footer links to `themeLink`; copyright `MAP_NODE_SYSTEMS. SPATIAL_INTEGRITY_VERIFIED` → `© 2026 Sellio. All rights reserved.`
- [x] Added CSS: `.pm-card-active` (gold highlight when pin clicked), `.pm-filter-chip` / `.pm-filter-chip-active` (functional filter chips), `.pm-pin-bubble` (Leaflet marker style), `.pm-map-tooltip` (dark tooltip), Leaflet control dark-theme overrides, full `.pm-footer-*` styles, `.pm-cta-btn` header button.
- [x] Fixed sidebar empty state — replaced generic `prop-listing-state`/`prop-listing-kicker` (blue accent) with `pm-empty-state`/`pm-empty-kicker` using `var(--pm-gold)`. Icon, kicker, message, and "Clear filters" action button now match the dark gold theme.
- [x] Finished single property page: added full image gallery with thumbnail strip, hero image with title/price overlay, key facts strip (beds/baths/area/parking/year), 2-column layout (description + specs | sticky inquiry panel), and mini Leaflet map showing the property's exact location when coordinates are available.
- [x] Fixed all `var(--pm-accent, #60a5fa)` (blue) → `var(--pm-gold)` across the detail page CSS; background changed from `#0b1220` → `var(--pm-obsidian)` for visual consistency. Added `overflow-y: auto` so the detail page scrolls inside the fixed-height layout wrapper.
- [x] Verified: `npm.cmd run lint` (0 errors).

## Open

single property page has multiple vertical scrolbars, fix it.

address is showing TBA, fix it

the map should load according to coordinates of the available properties, to cover all of them, in respect with left sidebar too.

