# Admin Dashboard E2E Test Report

**Project:** Sellio — Admin Dashboard (`http://127.0.0.1:8000/admin`)  
**Report date:** 2026-05-31  
**Related plans:** [admin_dashboard_e2e_database_test_plan.md](../admin_dashboard_e2e_database_test_plan.md), [admin_page_test_matrix.md](../admin_page_test_matrix.md)

---

## Executive summary

The admin dashboard E2E database test plan was executed phase by phase using PHPUnit feature tests (SQLite in-memory via `phpunit.xml`) and Playwright browser tests (against the local dev server + MySQL).

| Suite | Tests | Result | Assertions / notes |
|-------|------:|--------|--------------------|
| PHPUnit `tests/Feature/Admin/` | 100 | **All passed** | 490 assertions, 1 risky |
| Playwright `tests/Browser/Admin/` | 41 | **All passed** (last full run) | Includes CRUD, verticals, system, menu |
| Playwright vertical + menu subset | 9 | **All passed** (verified after server restart) | Menu load/add/reorder, auto/classified/job create |

Several production bugs were discovered and fixed during test development. Failures observed in later re-runs were environmental (stale `php artisan serve` returning 500 after cache optimization), not regressions in application code.

---

## PHPUnit feature tests

**Command:**

```bash
cd apps/backend && php artisan test tests/Feature/Admin/
```

**Last verified result:** 100 passed, 1 risky, 490 assertions (~154s)

### Test classes (21 files)

| File | Focus |
|------|-------|
| `AdminRoutesSmokeTest.php` | All resolvable admin GET routes return successful responses |
| `AdminCategoryCrudTest.php` | Category CRUD |
| `AdminProductCrudTest.php` | Product CRUD |
| `AdminBlogCrudTest.php` | Blog CRUD |
| `AdminPageCrudTest.php` | Page CRUD |
| `AdminTaxonomyCrudTest.php` | Tags, types, brands, locations |
| `AdminBillingCrudTest.php` | Plans, subscriptions, orders, payments |
| `AdminListingVerticalCrudTest.php` | Property, auto, classified listing CRUD |
| `AdminVerticalCrudTest.php` | Event, service, job, plan, ticket, user CRUD |
| `AdminFinancialExtrasTest.php` | Addons, line items, booking line items |
| `AdminExtendedResourcesTest.php` | Transactions, email templates, property bookings, newsletter, settings, gallery |
| `AdminCmsOperationsTest.php` | CMS pages, content, themes, menus |
| `AdminSystemResourcesTest.php` | Permissions, payment gateways, reports |
| `AdminSystemMaintenanceTest.php` | Maintenance/status pages, cache/config/route/view clear, media regen queue, optimize |
| `AdminMenuOperationsTest.php` | Menu add via `new_items`, reorder via `menu_structure`, update/delete items |
| `AdminIndexFiltersTest.php` | Broad index filters + gallery/newsletter pagination |
| `AdminRelationshipTest.php` | Model relationships and form dependencies |
| `AdminDashboardMetricsTest.php` | Dashboard metric endpoints |
| `AdminPermissionsTest.php` | Role/permission gates |
| `AdminLogGateTest.php` | Activity log access control |

### Risky test

- **`AdminRoutesSmokeTest`** — `all resolvable admin get routes return successful responses`  
  Marked risky because test code or tested code did not close an output buffer. Does not indicate a functional failure.

### Infrastructure

- **Trait:** `tests/Concerns/InteractsWithAdmin.php` — `RefreshDatabase`, admin login helper, `AdminTestSeeder`
- **Seeder:** `database/seeders/AdminTestSeeder.php` — deterministic admin user, sample records per module
- **Admin credentials (tests):** `admin@sellio-platform.test` / `admin123`

---

## Playwright browser tests

**Command (uses Playwright webServer unless skipped):**

```bash
cd apps/backend && npm run test:browser
```

**Against an already-running server:**

```powershell
cd apps/backend
$env:PW_SKIP_WEBSERVER=1
npx playwright test tests/Browser/Admin/
```

**Last full run:** 41 passed (~6 min)

### Spec files (6 files)

| Spec | Tests | Coverage |
|------|------:|----------|
| `admin-smoke.spec.ts` | 2 | Dashboard load, core index pages |
| `admin-dashboard.spec.ts` | 2 | Command center after login, login validation |
| `admin-crud.spec.ts` | 9 | Category/product CRUD, delete confirm, settings, email templates, mobile viewport, subscriptions index |
| `admin-extras.spec.ts` | 8 | Addons, gallery upload/replace/delete, blog, menu load/add/sync/reorder |
| `admin-system.spec.ts` | 9 | Permissions, payment gateways, reports, maintenance/status, cache purge, storage link, gallery delete |
| `admin-vertical.spec.ts` | 11 | Property/event/auto/classified/job create + index smoke for jobs/services/autos/classifieds |

### Vertical + menu subset (9 tests)

Verified after dev-server restart:

```powershell
$env:PW_SKIP_WEBSERVER=1
npx playwright test tests/Browser/Admin/admin-vertical.spec.ts tests/Browser/Admin/admin-extras.spec.ts -g "reorder|auto|classified|job|menu"
```

| Test | Result |
|------|--------|
| menu architect page loads for seeded menu | Pass |
| can add and synchronize a new menu link | Pass |
| can reorder menu items and synchronize structure | Pass |
| jobs index loads | Pass |
| autos index loads | Pass |
| can create an auto from the admin form | Pass |
| classifieds index loads | Pass |
| can create a classified from the admin form | Pass |
| can create a job from the admin form | Pass |

### Auth helper

- **File:** `tests/Browser/Admin/helpers/admin-auth.ts`
- **Login URL:** `/login` → redirect to `/admin`
- **Helpers:** `loginAsAdmin()`, `assertNoServerErrors()`

---

## Production bugs fixed (discovered by tests)

| Area | Issue | Fix |
|------|-------|-----|
| **ClassifiedController** | Missing `Log` facade import caused 500 on create/update failure path | Added `use Illuminate\Support\Facades\Log;` |
| **ClassifiedManagementService** | Admin form omits `type_id` but DB column is NOT NULL | Default to first classified `Type`, fallback to any active type |
| **ClassifiedRequest** | Slug unique rule with empty route ID | Null-safe `$this->route('classified')?->id` |
| **Classified form** | `item_condition` options sent numeric values (`10`, `5`) vs validation `new\|used\|refurbished` | Form options changed to string values |
| **SaveLineItemRequest** | Validated `name` instead of `title` | Corrected field name |
| **FinancialService** | Missing template defaults | Added defaults |
| **NewsletterSubscriber** | `is_confirmed` not fillable; filter boolean cast | Model + filter fixes |
| **Addons index** | Blade referenced `$addon->title` | Changed to `$addon->name` |
| **PropertyManagementService** | Missing defaults for bedroom/bathrooms/guests; `is_sale` | Service defaults |
| **AutoRequest** | `city`/`country` required but form lacks fields | Made nullable; service defaults in `AutoManagementService` |
| **Earlier sessions** | Dashboard SQLite expressions, missing Blade views, model `$fillable`, slug/filters, union pagination, etc. | Multiple fixes across admin modules |

---

## Test fixes (non-production)

| File | Change |
|------|--------|
| `admin-crud.spec.ts` | Subscriptions index shows plan title (`Test Plan`), not subscription title (`Test Subscription`) |
| `AdminIndexFiltersTest.php` | Gallery pagination test: count unique card entries + pagination metadata instead of brittle filename/order assertions |

---

## Playwright conventions (vertical CRUD)

- Property, event, auto, classified, and job **store** actions redirect to **`/admin/{resource}/{id}/edit`**, not the index.
- Tests must `waitForURL(/\/edit/)` and assert `input[name="title"]` value.
- Gallery index displays **`file_name`**, not gallery title.
- **`Transaction` model** uses table **`ledger_transactions`**.

---

## Environment notes

### PHPUnit

- Uses in-memory SQLite configured in `phpunit.xml`.
- `RefreshDatabase` + `AdminTestSeeder` per test class.

### Playwright

- `playwright.config.ts` starts `php artisan serve` unless `PW_SKIP_WEBSERVER=1`.
- Browser tests hit the **dev MySQL** database (not SQLite).
- Live MySQL may require migration `2026_05_31_000001_create_admin_financial_support_tables` for addons tests.

### Dev server health

Running **`php artisan optimize`** during maintenance tests can break a long-running `php artisan serve` process. Recovery:

```bash
cd apps/backend
php artisan optimize:clear
php artisan serve --host=127.0.0.1 --port=8000
```

Symptoms when server is unhealthy: Playwright tests timeout at 60s on login/navigation; HTTP 500 on admin pages.

---

## Optional follow-ups (not yet implemented)

- Service vertical Playwright CRUD (PHPUnit service CRUD already covered)
- Browser test for `optimize` maintenance action (run last; follow with `optimize:clear`)
- True nestable drag-and-drop menu reorder in browser (PHPUnit menu reorder already covered)
- Resolve risky output-buffer warning in `AdminRoutesSmokeTest`

---

## Key file paths

```
documentation/admin_dashboard_e2e_database_test_plan.md
documentation/admin_page_test_matrix.md
documentation/reports/admin_dashboard_e2e_test_report.md   ← this file

apps/backend/tests/Feature/Admin/*.php
apps/backend/tests/Browser/Admin/*.spec.ts
apps/backend/tests/Browser/Admin/helpers/admin-auth.ts
apps/backend/tests/Concerns/InteractsWithAdmin.php
apps/backend/database/seeders/AdminTestSeeder.php
apps/backend/playwright.config.ts
```

---

## Session timeline (high level)

1. **PHPUnit phases 1–8** — Smoke, CRUD, relationships, metrics, permissions, filters, system resources, maintenance, menu ops. Reached 99→100 passing tests.
2. **Playwright expansion** — Vertical creates (property, event, auto, classified, job), extras (addons, gallery, blog, menu), system (cache, storage link, reports, gateways).
3. **Classified browser failure** — Root cause: missing `Log` import + missing `type_id` default. Fixed; classified create passes.
4. **Subscriptions browser failure** — Wrong assertion text; fixed to `Test Plan`.
5. **Gallery pagination PHPUnit failure** — Flaky assertions; fixed to count unique rendered cards.
6. **Re-run failures (task 657601)** — Stale dev server after optimize; resolved with `optimize:clear` + server restart; 9/9 vertical/menu tests pass.

---

*Generated from admin dashboard E2E test execution sessions. Re-run the commands above to refresh pass counts.*
