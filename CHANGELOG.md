# Changelog

All notable changes to **Sellio** are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security

- Add `sanitize_rich_html()` helper; sanitize blog and product rich HTML on save and in storefront views.
- Sanitize CMS `PageContent` values on save (inline tags for text fields; extended tags for editor fields).
- Escape footer social menu titles; strip markup from `MenuItem` titles on save.
- Add API rate limiters (`api`, `api-auth`, `api-write`) with global and route-specific throttles.
- Bump backend dependencies to address `composer audit` findings (Laravel 12.61+, Scramble 0.13.26+, Symfony, PHPUnit, phpseclib, etc.).
- Harden API resources with `whenLoaded()` and expand listing eager loads (properties, autos, products, jobs, bookings, tickets).
- Restrict page builder to super-admin; sanitize builder HTML/CSS on save and storefront render.
- Harden web installer error visibility: disable `display_errors` after `installed.lock`; gate active install output with `INSTALLER_DEBUG` (defaults to local-only).
- Fix missing Admin vertical controller imports in `routes/admin.php`; clear stale route cache after route edits.
- Harden Playwright admin E2E: cookie sessions in `.env.testing`, shared auth setup, exclude installer from main browser suite.

### Added

- Root `CHANGELOG.md` and package/license audit report (`_development/audits/backend/00_strategic/PACKAGE_AUDIT_2026-06-07.md`).
- Demo image provenance audit (`DEMO_IMAGE_AUDIT_2026-06-07.md`) and NPM audit report (`NPM_AUDIT_2026-06-07.md`).
- README demo credentials table and post-install security checklist.
- Installer finished step: demo account panel and expanded security guidance.
- Unit tests for HTML sanitization, `PageContent` save behavior, API resource `whenLoaded()` guards, page builder sanitizers, and installer error reporting.

### Changed

- Replace inline FQCN references with `use` statements across the Laravel backend (~120 files).
- Stabilize demo seeding; preserve pending partner applications during re-seed.

## [1.0.0] - 2026-06-07

Initial marketplace submission baseline.

### Added

- **Backend (`apps/backend`)** — Laravel 12 monolith: multi-vertical marketplace (properties, autos, products, services, jobs, events, classifieds), admin panel, Blade storefront, REST API, web installer, Stripe/PayPal payments, RBAC, wallet, media library, themes, and page builder.
- **Seller dashboard (`apps/seller`)** — React partner panel for listings, orders, and subscriptions.
- **Buyer dashboard (`apps/buyer`)** — React buyer panel for orders, bookings, and settings.
- **Shared packages (`packages/`)** — TypeScript API client and shared types.
- **Documentation** — HTML buyer documentation, CodeCanyon introduction and listing pages.

### Fixed

- Storefront booking regressions and checkout follow-ups.
- Cart subtotal, product/event detail polish, and unified checkout payment partials.
- Stripe property booking and subscription checkout verification paths.
- Storefront theme fallbacks and buyer billing settings.

[Unreleased]: https://github.com/sellio/sellio/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/sellio/sellio/releases/tag/v1.0.0
