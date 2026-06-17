## Completed

- [x] This theme is too basic and simple — make it premium and polished.
  - Added missing `.cl-footer`, `.cl-footer-links`, `.cl-footer-link` CSS: footer on ProductPage and ExplorePage now renders with proper background, border, and padding.
  - Added `.cl-avatar` CSS: seller initials circles now styled (indigo background, white text, circular).
  - Added `.cl-product-btn-reserve` CSS: "Send Message & Request Pickup" button on ProductPage now fully styled (blue, full-width, hover/disabled states).
  - Added `.cl-panel-search` + `.cl-panel-search-input` + `.cl-panel-search-clear` CSS: premium inline search bar in the listing panel.
  - Added `.cl-map-info-chip` CSS: floating count/area label at bottom of map.
  - Added panel inline search to Page.tsx (keyword-filters by title, neighborhood, category client-side).
  - Removed `<LocalFooter />` from inside the scrollable listing panel (wrong placement for map-split layout); added bottom padding spacer instead.
  - Added map info chip to the map view: shows live count + area label.
  - Fixed social media links in LocalFooter: now CMS-driven via `useThemeContent('social.facebook/twitter/instagram/nextdoor')`, icons hidden when URL is empty, open in new tab.
  - Fixed footer copyright to use CMS brand name + dynamic year.
  - TypeScript: 0 errors.

- [x] Scan for all dummy data, make everything dynamic.
  - `brand.name`, `header.post_cta`, `footer.description`, `footer.copyright`, `panel.title`, `alerts.title`, `empty.title`, `empty.description`, `radius.expand_label` all driven by `useThemeContent`.
  - Social links CMS-driven (above).
  - All listing data (cards, pins, categories, inventory totals) fetched live from API.


----------------

are you loading the actual map?

why are you missing the avatar?

apply only USA coordinates to classifieds, update the seeder and run



- [x] Cluster markers when many listings share a dense area.
  - Installed `leaflet.markercluster` + `@types/leaflet.markercluster`.
  - `placeMarkersOnMap` now creates a `L.markerClusterGroup` (radius 60px, custom icon) and adds all markers to it instead of directly to the map.
  - Cluster bubbles styled with `.cl-cluster-pin` (orange, circular, matching theme accent).
  - `handleFitResults` uses `cluster.getBounds()` instead of a manual feature group.
  - Spiderfy on max zoom so overlapping pins in dense areas spread out on click.
  - TypeScript: 0 errors.

- [x] Add switch option for "fit results" and "neighborhood (my location)" control.
  - Added map mode toggle buttons ("Fit Results" / "My Location") fixed above the map.
  - "My Location" calls `navigator.geolocation`; spinner shows while GPS is pending; mode only switches after GPS confirms.
  - Clicking "Fit Results" while GPS is pending cancels the in-flight request (`geoActiveRef`).
  - On GPS success: places a pulsing dot at user's coordinates, then `fitBounds` to include **both** the user's GPS location **and** all listing pins — so a demo visitor in Germany sees both their location and the USA seeded listings on the same view.
  - Sidebar listing sort switches to real Haversine distance from user's GPS when in location mode.
  - `mountedRef` guard prevents state updates if component unmounts during geolocation.
  - TypeScript: 0 errors.
