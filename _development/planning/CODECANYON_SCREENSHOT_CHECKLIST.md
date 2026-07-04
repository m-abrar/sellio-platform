# Sellio CodeCanyon Screenshot Checklist

Use this checklist for the CodeCanyon item gallery, product tour, documentation, and reviewer material.

## Required Screenshots

> **Capture prerequisite:** Run the final migrated and fully seeded MySQL demo database. Confirm the storefront APIs return HTTP 200 with populated records and that no `OFFLINE BACKUP MODE`, loading state, broken media, or debug output is visible before checking an item off.

- [ ] **Unified marketplace homepage** — Capture `unifieds_marketplace` with the hero, vertical categories, featured listings, and marketplace navigation visible.
- [ ] **Ecommerce storefront** — Show a polished product grid, category navigation, filters, and realistic seeded products.
- [ ] **Product details** — Include the image gallery, price, product information, seller details, and primary purchase action.
- [ ] **Checkout** — Show the cart summary, customer/address fields, totals, and available payment methods without exposing real credentials.
- [ ] **Property marketplace** — Capture `properties_modern` or `properties_map` with realistic listings, filters, and map or discovery content.
- [ ] **Admin dashboard** — Show platform statistics, charts, recent activity, and the main administration navigation.
- [ ] **Admin listing management** — Include the listing table, search, filters, statuses, bulk actions, and row actions.
- [ ] **Admin create/edit listing** — Show a complete listing form with category fields, pricing, location, and media uploader.
- [ ] **Seller dashboard** — Capture revenue, orders or enquiries, listing performance, and recent activity.
- [ ] **Seller listing management** — Show the seller-facing listing table and its create, edit, status, and action controls.
- [ ] **Buyer dashboard** — Include purchases or bookings, enquiries, favourites, messages, and account navigation.
- [ ] **Web installer** — Capture a polished requirements, database configuration, or installation-complete step.

## Recommended Supplementary Screenshots

- [ ] Theme selector showing multiple included storefront themes.
- [ ] Multi-vertical collage covering classifieds, jobs, vehicles, services, events, properties, and ecommerce.
- [ ] Booking or event-ticket checkout flow.
- [ ] Real-time buyer and seller messaging.
- [ ] Responsive storefront at a mobile viewport.
- [ ] Mobile application home screen and listing detail screen.
- [ ] Branding, theme, or platform customization settings.
- [ ] Buyer documentation homepage.

## Capture Standards

- [ ] Capture desktop screenshots at `1440x900` or `1600x1000`.
- [ ] Use one consistent viewport across the main item-gallery images.
- [ ] Use realistic seeded data with polished titles, prices, locations, images, and account names.
- [ ] Keep the same demo brand, currency, locale, and visual identity throughout the set.
- [ ] Hide browser bookmarks, developer tools, debug bars, local filesystem paths, notifications, and unrelated tabs.
- [ ] Never expose API keys, payment secrets, personal information, private email addresses, or real customer data.
- [ ] Wait for images, maps, charts, fonts, and API content to finish loading before capture.
- [ ] Check every screenshot for broken images, loading indicators, empty states, clipped text, and console overlays.
- [ ] Prefer clean full-page or focused feature captures; avoid excessive browser chrome and large empty areas.
- [ ] Export sharp PNG files before creating compressed marketplace JPG versions.
- [ ] Use short, consistent filenames such as `01-unified-marketplace.png` and `02-admin-dashboard.png`.
- [ ] Confirm every screenshot matches the final submitted build and live demo.

## Suggested Final Gallery Order

1. Unified marketplace homepage
2. Admin dashboard
3. Ecommerce storefront and product details
4. Multi-vertical marketplace collage
5. Seller dashboard
6. Buyer dashboard
7. Listing management and editor
8. Checkout and payments
9. Property marketplace
10. Responsive web and mobile application
11. Theme customization
12. Installer and documentation

The repository submission checklist requires at least 5–8 screenshots. For Sellio's scope, prepare 10–12 strong item-gallery images and retain the supplementary captures for the product tour and documentation.
