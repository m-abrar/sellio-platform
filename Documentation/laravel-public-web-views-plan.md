# Laravel Public Web Views Plan

## Summary

Build the standalone Laravel public website as a full-featured storefront with feature parity to the API clients. The first phase focuses on the public landing and exploration journey: visitors land on `/`, understand the marketplace, search across enabled modules, browse curated sections, and continue into module index/detail pages.

**Last reconciled:** 2026-06-03 (codebase scan + remediation pass).

## Status Overview

| Area | Status |
|------|--------|
| Phase 1 — Home & explore/index | **Mostly complete** |
| `laravel_blade` content scope | **Complete** |
| Module-aware discovery | **Complete** (blogs gating fixed 2026-06-03) |
| Module index standardization | **Complete** (products index include fixed 2026-06-03) |
| Global layout (header/footer) | **Complete** (footer newsletter added 2026-06-03) |
| Blade/theme decoupling | **Complete** |
| Automated tests | **Started** (`tests/Feature/LaravelPublicStorefrontTest.php`) |
| Phase 1.5 — Detail shell | **In progress** (see below) |
| Phase 2 — Checkout/auth/booking parity | **Not started** |

## Key Changes

- Make the homepage module-aware using `module_enabled(...)`, so disabled modules disappear from hero tabs, homepage sections, menus, and CTAs.
- Expand the unified home beyond the original four hero tabs to support all enabled public modules: properties, autos, products, services, jobs, events, classifieds, and blogs.
- Keep admin editing focused on Blade-relevant systems: `page_content(...)`, `@editable(...)`, `menu_items(...)`, logo/site settings, and Laravel public-view settings.
- Treat theme settings as Next.js-only. Laravel Blade views must not depend on active theme records, theme variables, or theme-specific rendering rules.
- Use a dedicated fixed Blade content scope (`laravel_blade`) so `page_content(...)` and inline editing remain stable without a Blade-specific backend Theme record.
- Keep layout controlled by code for consistency and quality; no drag/drop homepage builder in this phase.
- Preserve Laravel standalone behavior under `built_in_website` middleware, while keeping admins able to preview/edit Blade content.

## Implementation Changes

### Done

- **`HomeDataService`** — Public discovery provider with enabled-module filtering, counts, featured/trending, products/blogs, taxonomy.
- **Unified home** — Hero (`page_content`), dynamic module tabs/search, curated sections, empty states, category/location blocks.
- **Module index pages** — Shared `_page-heading`, `_filter-shell`, `_mobile-filter-button` on properties, autos, products, services, jobs, events, classifieds, blogs.
- **Global layout** — `main_header` menus (module-filtered), Post Listing CTA, footer columns, social links, newsletter block when `newsletter_enabled` is truthy (default on).
- **Blade decoupling** — `config/content.php`, `ContentService`, `MenuService`, admin bar scoped to `laravel_blade`; no Theme model usage in `resources/views/frontend`.
- **CSS** — `public/frontend/css/style.css` with hero mobile scroll, marketplace cards, `detail-page` layout rules.

### Phase 1.5 (beyond original plan — in progress)

- **`x-frontend.detail-shell`** component and migration of module show views (autos, properties, products, services, jobs, events, classifieds, blogs).
- Detail/checkout/booking flows still vary by vertical and are not fully unified.

### Pending / follow-up

- [ ] Manual responsive QA at desktop, tablet, mobile (hero tabs, filters, sticky CTAs).
- [ ] Expand `LaravelPublicStorefrontTest` for menu filtering and admin `@editable` visibility.
- [ ] Audit follow-ups from `apps/backend/.audit/03_ui_ux/005_frontend_blade_audit_report.md` (currency helper, logic out of Blade).
- [ ] Optional: seed `global.footer.newsletter_*` slots under `laravel_blade` in admin content defaults.
- [ ] Run `npm run build` in `apps/backend` after CSS changes when dependencies are installed.

## Test Plan

- [x] Public home route returns 200.
- [x] Products index renders product catalog (not classifieds).
- [x] Disabled module routes return 404.
- [x] `ContentService` reads `laravel_blade` scope.
- [x] `HomeDataService` omits blogs when `is_section.blogs` is off.
- [x] Footer newsletter respects `newsletter_enabled` setting.
- [ ] Module toggles reflected in hero tabs and `main_header` menus (manual or additional tests).
- [ ] `@editable` only for authorized admins with `frontend_edit` enabled.
- [ ] Theme changes do not alter Blade public views.
- [ ] Run full suite: `php artisan test` from `apps/backend`.

## Assumptions

- Laravel public web is a complete standalone storefront, not just a fallback.
- Phase 1 scope is homepage plus public explore/index pages, not a full redesign of every detail/checkout/auth page.
- All enabled modules are first-class in public discovery.
- Admins edit text and menus through existing content/menu systems; section ordering and layout remain code-controlled.
- Theme settings are reserved for the Next.js storefront.
- `page_contents.theme_key` is a content scope; default Blade scope is `laravel_blade`.

## Known Bugs (resolved)

| Issue | Resolution |
|-------|------------|
| `products/index.blade.php` included classifieds search | Fixed — now includes `frontend.products.search` |
| Blogs home section ignored `module_enabled('blogs')` | Fixed — view + `HomeDataService` |
| Footer lacked newsletter entry | Fixed — gated by `newsletter_enabled` (default `1`) |
