# Admin Dashboard E2E Database Test Plan

## Goal

Build a repeatable end-to-end test matrix for `http://127.0.0.1:8000/admin` where every admin page is verified at three levels:

1. Page loads without 500, 403, or Blade errors.
2. UI actions work: list, search/filter, create, edit, delete, status updates, and uploads where relevant.
3. Database state matches the UI action: rows created, updated, soft-deleted, related records attached, and filters reflect real table data.

## Phase 1: Build The Route-To-Table Matrix

Create an inventory from:

- `apps/backend/routes/*.php`
- `apps/backend/app/Http/Controllers/Admin`
- `apps/backend/resources/views/admin`
- `apps/backend/database/migrations`
- `apps/backend/database/seeders`

For each admin module, record:

| Area | Pages | Main Table(s) | Actions |
|---|---|---|---|
| Dashboard | dashboard, ecommerce dashboard | users, listings, payments, bookings, subscriptions | read-only metrics |
| Users | index, show, create, edit | users, roles, permissions | CRUD, impersonation |
| Listings | index, edit redirect, delete | products, properties, autos, events, jobs, services, classifieds | filter, edit, delete |
| Products | index, create, edit | products, categories, brands, locations, media | CRUD |
| Properties | index, create, edit | properties, bookings, visits, amenities, media | CRUD |
| Autos | index, create, edit | autos, brands, categories, locations | CRUD |
| Events | index, create, edit | events, event_occurrences, ticket_types | CRUD |
| Jobs | index, create, edit | joblistings, applications | CRUD |
| Services | index, create, edit | services, service_packages, quotes | CRUD |
| Classifieds | index, create, edit | classified_ads | CRUD |
| Bookings | global/property/event/service | property_bookings, event_bookings, service_appointments | status/read/delete |
| Payments | index, create/edit | payments, payment_gateways, transactions | CRUD/status |
| Transactions | index, create, edit | transactions, transaction_lines | CRUD |
| Reports | bookings, payments, properties | bookings/payments/properties | filters/export |
| CMS | pages, blogs, content, menus, themes | pages, blogs, menus, themes, page_contents | CRUD/edit |
| Taxonomy | categories, tags, types, brands, features, amenities, locations | matching tables | CRUD |
| Support | tickets, inquiries, subscribers | tickets, ticket_messages, inquiries, newsletter_subscribers | read/status/reply/delete |
| System | settings, languages, roles, permissions, maintenance/status | settings, languages, roles, permissions | edit/config |

## Phase 2: Prepare Test Database

Use a separate testing database, not the dev database.

Recommended setup:

- `.env.testing`
- Run `php artisan migrate:fresh --seed --env=testing`
- Seed one known admin user.
- Seed one known record per module.
- Seed related records needed by forms: categories, locations, brands, users, plans, gateways, and similar dependencies.

Each test should either:

- Use `RefreshDatabase`, or
- Snapshot the database before a full Playwright run and reset after.

## Phase 3: Smoke Test Every Admin URL

Automated browser smoke test:

- Login as admin.
- Visit every named admin GET route.
- Assert status is OK.
- Assert no Laravel exception page.
- Assert no visible `Undefined variable`, `Trying to access`, `SQLSTATE`, `MethodNotAllowed`, or similar error text.
- Assert sidebar/header renders.
- Assert page title or main heading exists.

This catches many random dashboard bugs quickly.

## Phase 4: CRUD E2E Per Table

For every table-backed admin module:

1. Visit index page.
2. Confirm seeded database row appears in table.
3. Use search/filter if available.
4. Open create page.
5. Submit valid form.
6. Assert success flash.
7. Assert database row exists.
8. Open edit page.
9. Change one or two fields.
10. Assert database row changed.
11. Delete/archive row.
12. Assert row deleted or soft-deleted as expected.

Example modules to cover first:

- users
- categories
- tags
- types
- brands
- locations
- products
- properties
- autos
- events
- jobs
- services
- classifieds
- blogs
- pages
- advertisements
- plans
- subscriptions
- payments
- transactions
- tickets

## Phase 5: Relationship Tests

These are where dashboards often break.

Test that related data saves and displays correctly:

- Product belongs to category, brand, and location.
- Property has amenities, fees, seasonal prices, and media.
- Event has occurrences and ticket types.
- Service has packages.
- User has role/permissions.
- Subscription belongs to user and plan.
- Payment links to payable model.
- Menus have nested menu items.
- Listings point to correct vertical models.

Database assertions should check both parent and pivot/child tables.

## Phase 6: Dashboard Metrics Verification

For each dashboard card, chart, and table:

- Seed known counts and amounts.
- Visit dashboard.
- Assert displayed number equals database calculation.
- Test empty database state.
- Test mixed statuses: pending, active, cancelled, completed, and failed.
- Test module toggles if dashboard widgets depend on enabled modules.

This is important because dashboards can render visually while showing wrong totals.

## Phase 7: Filters, Pagination, Sorting

For each index page:

- Create 3 to 5 records with different statuses, categories, and dates.
- Test filters return only matching rows.
- Test search by name, title, email, or order number.
- Test pagination does not drop filters.
- Test empty result state.
- Assert query params survive page navigation.

## Phase 8: Permissions And Roles

Test as:

- Super admin
- Admin with limited permission
- Non-admin authenticated user
- Guest

For each protected admin route:

- Guest redirects to login.
- Non-admin gets denied or redirected.
- Limited admin can only access allowed pages/actions.
- Super admin can access all pages.

## Phase 9: Browser-Level Checks

Use Playwright for real interaction:

- Form validation messages.
- Modals and delete confirmations.
- File/image upload widgets.
- Rich text editors.
- Date pickers.
- Dynamic rows like event occurrences or line items.
- Menu drag/reorder if present.
- Responsive admin layout at desktop and mobile widths.

## Phase 10: Error Logging Gate

After each test run, fail the suite if Laravel logs contain new errors:

- `storage/logs/laravel.log`
- 500 responses
- SQL errors
- missing view/route errors
- permission errors
- deprecation warnings if noisy enough to matter

## Suggested Test Stack

Use both:

- Laravel PHPUnit or Pest for fast route/database tests.
- Playwright for real browser E2E.

Suggested folder shape:

```text
apps/backend/tests/Feature/Admin/
  AdminRoutesSmokeTest.php
  AdminCrudTest.php
  AdminDashboardMetricsTest.php
  AdminPermissionsTest.php

apps/backend/tests/Browser/Admin/
  admin-smoke.spec.ts
  admin-crud.spec.ts
  admin-dashboard.spec.ts
```

## Execution Order

1. Inventory all admin routes and map them to tables.
2. Create testing database and deterministic seed data.
3. Add smoke test for every GET admin page.
4. Add CRUD tests for core modules.
5. Add dashboard metric tests.
6. Add relationship and permission tests.
7. Add Playwright tests for JavaScript-heavy pages.
8. Fix failures module by module.

## First Deliverable

Generate an `admin_page_test_matrix.md` file from the repo, listing every admin page, route, controller, Blade view, table, and required test cases.
