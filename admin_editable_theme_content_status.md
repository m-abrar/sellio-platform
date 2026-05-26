# Admin-Editable Theme Content Status

Last updated: 2026-05-26
Last reconciled: 2026-05-26 by workspace scan against `ThemeSeeder.php` and `apps/storefront/src/themes`.

This tracks storefront themes converted to the structured theme-content slot system used by `/admin/content`.

Definition of complete: the theme has admin-editable homepage slots wired through the storefront, fallback defaults in `apps/storefront/src/lib/theme-content-defaults.ts`, and seeded/admin defaults in the backend content registry.

## Summary

| Status | Count |
| :--- | ---: |
| Complete | 52 |
| Pending | 0 |
| Total seeded themes | 52 |

Latest verification: all 52 seeded theme folders remain present and tracked as admin-editable content complete.

## Complete Themes

| Vertical | Count |
| :--- | ---: |
| Autos | 5 |
| Classifieds | 6 |
| Ecommerce | 4 |
| Events | 5 |
| Jobs | 6 |
| Properties | 13 |
| Services | 5 |
| Unifieds | 8 |

## Pending

No pending admin-editable theme-content conversions.

## Current Caveat

This report tracks admin-editable homepage/content slots only. It does not certify route parity, live browser QA, explore/cart coverage, seller portal API completion, or removal of all static fallback data. Those are tracked separately in `dynamic_themes_report.md` and `documentation/seller_portal_completion_plan.md`.

## Update Rules

- Move a theme from Pending to Complete only after storefront hooks, frontend defaults, backend defaults, and admin slot visibility are all in place.
- Keep this file in sync when adding new seeded themes to `apps/backend/database/seeders/ThemeSeeder.php`.
- This file tracks admin-editable content slots only. API-backed listing/product status is tracked separately in `dynamic_themes_report.md`.
