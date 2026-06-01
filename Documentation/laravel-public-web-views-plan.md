# Laravel Public Web Views Plan

## Summary

Build the standalone Laravel public website as a full-featured storefront with feature parity to the API clients. The first phase will focus on the public landing and exploration journey: visitors land on `/`, understand the marketplace, search across enabled modules, browse curated sections, and continue into module index/detail pages.

## Key Changes

- Make the homepage module-aware using `module_enabled(...)`, so disabled modules disappear from hero tabs, homepage sections, menus, and CTAs.
- Expand the current unified home beyond the existing four hero tabs to support all enabled public modules: properties, autos, products, services, jobs, events, classifieds, and blogs where applicable.
- Keep admin editing focused on Blade-relevant systems: `page_content(...)`, `@editable(...)`, `menu_items(...)`, logo/site settings, and Laravel public-view settings.
- Treat theme settings as Next.js-only. Laravel Blade views should not depend on active theme records, theme variables, or theme-specific rendering rules.
- Use a dedicated fixed Blade content scope, for example `laravel_blade`, so `page_content(...)` and inline editing remain stable without creating a Blade-specific backend Theme record.
- Keep layout controlled by code for consistency and quality; do not add a full drag/drop homepage builder in this phase.
- Preserve Laravel standalone behavior under the existing `built_in_website` middleware, while keeping admins able to preview/edit Blade content.

## Implementation Changes

- Refactor `HomeDataService` into a clearer public discovery data provider:
  - Return only enabled module sections.
  - Include counts, featured/latest records, featured categories, and featured locations where available.
  - Add products and blogs to the home data if their models/routes are already available.
- Update `frontend.unifieds.index` and its partials:
  - Hero with editable headline, subtitle, badge, and quick search.
  - Dynamic module tabs/cards based on enabled modules.
  - Curated sections for featured/latest listings.
  - Category/location discovery blocks.
  - Empty states that still make the page feel alive when seed data is sparse.
- Standardize module index pages visually:
  - Consistent page heading, result count, filter sidebar/offcanvas, listing grid/list, empty state, and pagination.
  - Keep vertical-specific card/details behavior intact.
- Polish global layout:
  - Header navigation from `main_header`, filtered by enabled module.
  - Primary CTA remains "Post Listing" and points to seller portal setting.
  - Footer supports public exploration links, trust/company links, social links, and newsletter entry if configured.
- Decouple Blade views from theme settings:
  - Remove Blade reliance on active theme variables, active theme model data, and theme-driven CSS tokens.
  - Keep Laravel Blade styling in Blade/CSS assets owned by `apps/backend`.
  - Leave theme settings available for the Next.js storefront only.
- Introduce a Blade content-scope convention:
  - Treat `page_contents.theme_key` as a backwards-compatible storage column, but use it as a "content scope" for Blade pages.
  - Set the Laravel Blade public content scope to a fixed value such as `laravel_blade`.
  - Update `ContentService` so Blade web requests resolve `page_content(...)` against `laravel_blade`, not `request('themeKey')` or the active Theme model.
  - Keep admin content editing pointed at the same `laravel_blade` scope for Blade pages.
  - Do not create or require a backend `Theme` database record for Laravel Blade views.
- Tighten CSS for marketplace premium direction:
  - Keep modern, clean, trust-heavy styling.
  - Reduce fragile oversized glass effects where they hurt readability.
  - Ensure mobile layouts do not overlap, especially hero tabs, filters, cards, and sticky buttons.

## Test Plan

- Run Laravel route checks for public routes: `/`, module indexes, module detail routes where seeded data exists, auth links, cart/checkout entry where products are enabled.
- Verify module toggles:
  - Enabled modules appear on home/search/navigation.
  - Disabled modules disappear from public discovery.
  - Direct disabled module URLs return the existing 404 behavior.
- Verify admin-editable content:
  - `page_content(...)` fallback text renders for guests.
  - `@editable(...)` controls appear only for authorized admins.
- Verify Blade/Next.js separation:
  - Changing theme settings does not alter Laravel Blade public views.
  - Blade pages still render correctly using Laravel-owned CSS and settings.
- Verify Blade content scope:
  - Guest `page_content(...)` reads from the fixed `laravel_blade` scope.
  - Admin inline editing creates/updates records under `laravel_blade`.
  - Next.js theme settings remain unaffected.
- Verify responsive behavior manually at desktop, tablet, and mobile widths:
  - Header collapse works.
  - Hero search remains usable.
  - Filter offcanvas works.
  - Cards, buttons, and pagination do not overflow.
- Run backend tests or at minimum `php artisan test` after implementation.
- Run frontend asset build for Laravel, likely `npm run build` inside `apps/backend`, if dependencies are installed.

## Assumptions

- Laravel public web should be a complete standalone storefront, not just a fallback.
- First phase scope is homepage plus public explore/index pages, not a full redesign of every detail/checkout/auth page.
- All enabled modules should be first-class in public discovery.
- Admins should edit text and menus through existing content/menu systems; section ordering and layout remain code-controlled for now.
- Theme settings are reserved for the Next.js storefront and are no longer part of the Laravel Blade public-view contract.
- The existing `page_contents.theme_key` column remains in place for compatibility, but Blade code should treat it as a content scope rather than an active visual theme.
- The default Blade content scope should be `laravel_blade` unless the team later chooses a different fixed key.
