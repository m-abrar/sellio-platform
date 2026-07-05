# Sellio CodeCanyon Screenshot Checklist

Use this checklist for the CodeCanyon item gallery, product tour, documentation, and reviewer material.

## Required Screenshots

> **Capture prerequisite:** Run the final migrated and fully seeded MySQL demo database. Confirm the storefront APIs return HTTP 200 with populated records and that no `OFFLINE BACKUP MODE`, loading state, broken media, or debug output is visible before checking an item off.

- [x] **Unified marketplace homepage** — Captured as `_development/screenshots/codecanyon/01-unified-marketplace.png`.
- [x] **Ecommerce storefront** — Captured as `_development/screenshots/codecanyon/03-ecommerce-storefront.png`.
- [ ] **Product details** — Include the image gallery, price, product information, seller details, and primary purchase action.
- [ ] **Checkout** — Show the cart summary, customer/address fields, totals, and available payment methods without exposing real credentials.
- [x] **Property marketplace** — Captured as `_development/screenshots/codecanyon/10-property-marketplace.png`.
- [x] **Admin dashboard** — Captured as `_development/screenshots/codecanyon/02-admin-dashboard.png`.
- [x] **Admin listing management** — Captured as `_development/screenshots/codecanyon/07-admin-listing-management.png`.
- [x] **Admin create/edit listing** — Captured as `_development/screenshots/codecanyon/08-admin-listing-editor.png`.
- [x] **Seller dashboard** — Captured as `_development/screenshots/codecanyon/05-seller-dashboard.png`.
- [x] **Seller listing management** — Captured as `_development/screenshots/codecanyon/06-seller-listing-management.png`.
- [x] **Buyer dashboard** — Captured as `_development/screenshots/codecanyon/11-buyer-dashboard.png`.
- [x] **Web installer** — Captured as `_development/screenshots/codecanyon/12-web-installer.png`.

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
