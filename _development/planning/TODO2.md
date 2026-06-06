# TODO2 — Initiative Status

**Last verified:** 2026-06-06 (`php artisan test` — 237 passed)

**Overall:** All code initiatives complete. Only manual Stripe production enablement remains.

---

## Option A — Quick polish

| Item | Status | Notes |
|------|--------|-------|
| Admin sidebar logo filter | ✅ **Done** | `.brand-image` keeps `opacity: 1` only — no `hue-rotate` / `brightness` on the logo (`apps/backend/public/admin-assets/style.css`) |
| Seller settings “Coming Soon” | ✅ **Done** | `apps/seller/src/pages/settings/SettingsPage.tsx` is wired to Laravel `getProfile` / `updateProfile` API |
| `setTimeout` post-save navigation | ✅ **Done** | `CreateProduct.tsx` and `CreateEvent.tsx` call `navigate()` immediately after save (no delayed redirect) |

---

## Option B — Buyer panel

| Item | Status | Notes |
|------|--------|-------|
| Booking creation redirect | ✅ **By design** | `bookingApi.ts` intentionally redirects buyers to the Laravel storefront checkout — not a broken API |
| Cancellation + reviews | ✅ **Done** | Cancel + review endpoints wired; review submission uses numeric `reviewable_id` (slug bug fixed) |
| Profile location + preferences | ✅ **Done** | `users` location + `preferences` (JSON); `PUT /api/dashboard/user/profile` persists notification / 2FA / billing prefs |
| `toActivity()` / review modal IDs | ✅ **Done** | Buyer activity + review modal use `property.id` for `reviewable_id` |
| Tests | ✅ **Passing** | `BuyerDashboardApiTest` — 5 tests (profile, cancel, review, avatar upload, bookings index) |

---

## Option C — Storefront regression (Laravel Blade)

| Item | Status | Notes |
|------|--------|-------|
| Property booking store → payment | ✅ **Done** | `LaravelPublicStorefrontTest::test_property_booking_store_creates_pending_booking_and_redirects_to_payment` |
| Checkout step-1 copy assertions | ✅ **Done** | Stay Details / Enhance Your Stay match current Blade copy |
| Core booking + payment flows | ✅ **Passing** | Property, product, and event checkout/payment/confirmation tests green |
| Storefront polish batch | ✅ **Done** | Cart subtotal fix, detail-page polish, shared checkout payment partials, auth redesign, gallery 404 fix, step-3 success hero, step-2 thumb dedupe, event confirmation dedupe — see `TODO.md` (through commit `7068b79`) |
| Full backend suite | ✅ **Passing** | **237 tests** (`php artisan test`, 2026-06-06) |

---

## Option D — Stripe subscription billing (seller)

| Item | Status | Notes |
|------|--------|-------|
| Checkout API | ✅ **Done** | `GET /api/dashboard/partner/subscriptions/checkout?plan_id=X` |
| `SubscriptionCheckoutService` | ✅ **Done** | Creates Stripe Checkout Session for partner plans |
| Webhook fulfillment | ✅ **Done** | `checkout.session.completed` with `purpose=partner_subscription` |
| Seller memberships UI | ✅ **Done** | Redirects to Stripe when gateway active; direct subscribe fallback for demo |
| Tests | ✅ **Passing** | `PartnerSubscriptionCheckoutTest` — 6 tests |
| Production enablement | ⏳ **Manual** | Activate Stripe in admin, add keys, point webhooks to `/webhooks/stripe` |

---

## Admin — User roles

| Item | Status | Notes |
|------|--------|-------|
| `/admin/users` assigned roles column empty | ✅ **Done** | Root cause: 339/362 users had no Spatie `model_has_roles` rows (factory/seed users created without `assignRole()`). Fixed with `User::created` auto-assign (`admin` / `partner` / `user` from flags), `displayRoleNames()` fallback in index view, `UserRoleAssignmentSeeder` backfill, and final seeder pass at end of `DatabaseSeeder` |
| Role assignment on fresh seed | ✅ **Done** | `UserRoleAssignmentSeeder` runs after foundation seeders and again after all relational seeders so late-created users are covered |
| Tests | ✅ **Passing** | `AdminRelationshipTest::test_factory_created_user_receives_default_role` + existing admin user store role test |

---

## Environment notes

| Item | Status | Notes |
|------|--------|-------|
| Dev database | ✅ **`sellio` (MySQL)** | `.env` → `APP_ENV=local`, `DB_DATABASE=sellio` |
| Test database | ✅ **Isolated** | PHPUnit uses sqlite `:memory:` (`phpunit.xml`); `.env.testing` defines `sellio_testing` if needed |
| Stale config cache | ⚠️ **Watch** | If `php artisan about` shows `testing` / sqlite while `.env` says `local`, run `php artisan optimize:clear` and restart `artisan serve` |

---

## Out of scope (unchanged)

- Next.js storefront (`apps/storefront`) — skipped per project direction
- CodeCanyon distribution / subscription ledger UI — tracked separately in `TODO.md` if needed

---

## Remaining action (manual only)

1. **Stripe production** — enable gateway in admin, set live keys, configure webhook endpoint `/webhooks/stripe`
2. **Optional** — run `php artisan db:seed --class=UserRoleAssignmentSeeder` on any environment that was seeded before the role-assignment fixes
