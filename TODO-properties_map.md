## Completed

- [x] Fixed `MapHeader` in `components/index.tsx`: logo `<div>MAPNEXUS</div>` → `<a href={themeLink('/')}>MAPNEXUS</a>` using `usePropertyThemeLink`.
- [x] Fixed `MapHUD` in `components/index.tsx`: HUD overlay labels `SPATIAL_COORDINATES` → `Location` and `DISTRICT_INTEGRITY` → `Coverage` — these were visible on the map canvas as a dark glass card.
- [x] Fixed `Page.tsx` sidebar defaults: `UNITS` → `listings`; `FILTER|PRICE|TYPE` → `Filter|Price|Type`; `END_OF_REGISTRY` → `End of results`; error state raw `{propertyError}` → static buyer-friendly message.
- [x] Fixed ThemeSeeder `properties_map`: all 9 values updated to match cleaned defaults (`Registry Nodes` → `Properties`, `UNITS` → `listings`, `Empty Property Registry` → `No listings yet`, `END_OF_REGISTRY` → `End of results`, offline kicker/title cleaned up).
- [x] Identified orphaned component files (`SpatialSyncBar.tsx`, `CartographicGrid.tsx`, `MapHeader.tsx`) not exported from `components/index.tsx` — not used in any rendered path; left in place.
- [x] Verified: `npm.cmd run lint` (0 errors), `/preview/properties_map` HTTP 200.

## Open

