## Completed

- [x] Renamed this checklist to `TODO-unifieds_marketplace.md`.
- [x] Refined `/preview/unifieds_marketplace/explore` hero into a single useful hero surface instead of the previous two-column split.
- [x] Rewrote explore hero copy to be end-user friendly.
- [x] Replaced the card footer label `Api Listing` with `Verified listing`.
- [x] Added a Products vertical and corrected product listings like `Smart Home Executive Hub Pro` so they no longer appear under Properties.
- [x] Added chunked explore rendering with a Load more flow.
- [x] Aligned explore result totals with the vertical counts.
- [x] Added useful fallback primary menu links for the unified marketplace theme.
- [x] Removed the dummy flash from `Start with a category.` by showing loading skeletons until API categories arrive.
- [x] Upgraded the home hero cards to use a cross-vertical listing feed instead of product-only cards.
- [x] Added Products to the home search, quick links, category cards, top-category grid, and footer chips.
- [x] Hid hero-card descriptions visually and polished the price treatment.
- [x] Verified `Start with a category.` and `Explore top categories` use real API totals on the hydrated preview.
- [x] Reworked trending card labels from generic `Featured` to actual vertical labels like Product, Property, Auto, and Service.
- [x] Included Products in the home hero total so the homepage and explore inventory totals align.
- [x] Reused backend-managed menus in the footer and polished the footer brand/logo treatment.
- [x] Confirmed company name and logo are driven by editable theme content (`site_name`, `site_logo`, `hide_site_name`).
- [x] Normalized the header and footer company-name sizing.
- [x] Changed explore listing loading to true API chunks: the page now renders the first fetched chunk, and `Load more listings` requests the next API page instead of revealing preloaded hidden cards.
- [x] Added dedicated marketplace detail URLs for products, properties, autos, services, jobs, events, and classifieds.
- [x] Updated marketplace home and explore cards so every vertical opens its own detail URL instead of falling back to filtered Explore searches.
- [x] Reworked the unified marketplace detail page to fetch and present vertical-specific data, metadata, owner/provider context, and product-only cart actions.
- [x] Verified the current storefront changes with `npm.cmd run lint` and `npm.cmd run build`.

## Still pending

### Unified marketplace

- [ ] Review the new marketplace detail URLs in browser for final visual QA:
  `/preview/unifieds_marketplace/products/{slug}`, `/properties/{slug}`, `/autos/{slug}`, `/services/{slug}`, `/jobs/{slug}`, `/events/{slug}`, and `/classifieds/{slug}`.
