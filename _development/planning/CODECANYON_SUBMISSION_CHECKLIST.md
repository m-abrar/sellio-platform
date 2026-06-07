# Sellio — CodeCanyon Submission Checklist

Last updated: 2026-06-07  
Use this as the single pre-upload tracker. Check items as you complete them; re-run automated sections before each release.

**Related docs:** `documentation/reviewer/` (ships in ZIP) · `_development/audits/backend/00_strategic/QA_REVIEW_2026-06-07.md`

---

## Progress at a glance

| Phase | Status |
|-------|--------|
| A — Automated QA | Mostly done |
| B — Manual install & deploy | Not started |
| C — Critical-path browser QA | Not started |
| D — Payments & subscriptions | Partial |
| E — Storefront themes (52) | Static only |
| F — Buyer-facing quality | Open questions |
| G — Distribution ZIP | Not started |
| H — Envato listing assets | Drafts only |

---

## A — Automated QA (re-run before upload)

- [x] PHPUnit full suite — `cd apps/backend && php artisan test` (259/259 on 2026-06-07)
- [x] Playwright admin E2E — `cd apps/backend && npm run test:browser` (48/48 on 2026-06-07)
- [ ] Playwright installer E2E — `npm run test:browser:installer:setup && npm run test:browser:installer`
- [x] `composer audit` — see `documentation/reviewer/PACKAGE_AUDIT_2026-06-07.md`
- [x] `npm audit` (seller + buyer) — see `documentation/reviewer/NPM_AUDIT_2026-06-07.md`
- [ ] Re-run all of the above on the exact commit you will ZIP

---

## B — Fresh install & deployment

Test on a **clean machine** (VPS, fresh Docker, or VM) — not your daily dev database.

### Installer

- [ ] Upload/extract distribution ZIP to empty web root
- [ ] Web installer completes without PHP errors (`/install`)
- [ ] Database connection step succeeds (MySQL 8+)
- [ ] Admin account creation works
- [ ] `installed.lock` is created; `/install` is blocked after install
- [ ] Post-install: delete or restrict `public/install/` per README checklist
- [ ] `php artisan storage:link` documented and works
- [ ] Queue worker + cron docs verified (if features depend on them)

### Environment

- [ ] `.env.example` has sane production defaults (`LOG_LEVEL=info`, `APP_DEBUG=false`)
- [ ] `APP_KEY` generated on install; sessions persist after login
- [ ] Mail driver documented (SMTP / log) for password reset and notifications

### Seed / demo data

- [ ] `migrate:fresh --seed` (or installer seed option) populates all verticals
- [ ] Demo credentials match `apps/backend/README.md` §4
- [ ] Partner demo user has active subscription after seed
- [ ] Stripe/PayPal gateway keys survive demo re-seed (see F7)

---

## C — Critical-path browser QA

Run manually in Chrome/Firefox. Log issues in `_development/planning/TODO.md` or a dated note.

### Admin (`/admin`)

- [ ] Login with seeded admin
- [ ] Dashboard widgets show data (not all zeros)
- [ ] Create + edit listing in each vertical: property, auto, product, event, service, job, classified
- [ ] Media upload on blog / listing edit pages
- [ ] User, role, permission management
- [ ] Partner applications + moderation queue
- [ ] Withdrawals approve/reject flow
- [ ] Reports pages (payments, bookings, properties) with date filters
- [ ] Email template edit (no PHP crash)
- [ ] Settings save (site logo, URLs, payment gateways)
- [ ] Impersonate partner → lands on React seller URL
- [ ] Impersonate buyer → lands on React buyer URL

### Laravel storefront (Blade)

- [ ] Home page loads; CMS content renders
- [ ] Property search (check-in/out date validation)
- [ ] Property detail → rental booking → Stripe checkout → confirmation
- [ ] Product detail → cart → checkout → confirmation
- [ ] Event detail → ticket booking → checkout → confirmation
- [ ] Auto / job / service / classified detail pages (no 500s, images load)
- [ ] Auth: login, register, forgot/reset password
- [ ] Blog list + detail (sanitized HTML displays correctly)

### React dashboards

- [ ] Seller (`/dashboard/partner`): login, property CRUD, map pin, listing counters
- [ ] Seller: events, products, autos, services, jobs, classifieds list pages
- [ ] Buyer (`/dashboard/user`): orders, bookings, profile/settings

---

## D — Payments & webhooks (sandbox)

- [ ] Stripe: publishable + secret keys in admin settings (or `.env`)
- [ ] Stripe: property booking charge succeeds in test mode
- [ ] Stripe: product/event checkout succeeds in test mode
- [ ] Stripe: partner subscription checkout activates plan in DB
- [ ] Stripe webhook: `checkout.session.completed` / `payment_intent.succeeded` on **public URL** (not just `stripe listen` locally)
- [ ] PayPal: sandbox credentials configured (if shipped in demo)
- [ ] PayPal: webhook or return-url fulfillment verified
- [ ] Failed payment stored; booking/order not confirmed on failure
- [ ] CSRF excluded for `webhooks/*` (regression check after deploy)

---

## E — Storefront themes (52 themes)

Static audit done 2026-05-26 — **live browser pass still required.**  
Reference: `_development/documentation/THEME_QA_AUDIT_REPORT.md`

### Minimum before submit (spot-check)

- [ ] One theme per vertical (8): autos, classifieds, ecommerce, events, jobs, properties, services, unifieds
- [ ] Homepage renders live API data (not only static fallback)
- [ ] Product/detail page per vertical — no console errors
- [ ] Mobile + desktop layout — no overlap/clipping

### Full pass (recommended)

- [ ] All **52** theme homepages — color, typography, responsive
- [ ] All **52** product/detail pages — data wiring, empty states
- [ ] **7** explore pages: `autos_luxury`, `autos_modern`, `events_corporate`, `jobs_startup`, `properties_classic`, `properties_luxury`, `unifieds_minimal`
- [ ] **2** cart pages: `properties_classic`, `unifieds_minimal`
- [ ] Classify **36** themes with static fallback/mock TSX — document accepted vs fix
- [ ] Storefront build/typecheck passes after any theme fixes

### Per-theme matrix (copy row per theme)

| Theme | Home | Detail | Explore | Cart | Mobile | Console clean |
|-------|------|--------|---------|------|--------|---------------|
| _(add rows)_ | | | | | | |

---

## F — Buyer-facing quality (open investigations)

From `_development/planning/TODO.md` — verify and check when confirmed.

- [ ] **F1** Admin + frontend Blade views use `__()` / `@lang` for user-facing strings (or document English-only)
- [ ] **F2** All registered events/listeners fire (registration, booking, payment, notification paths)
- [ ] **F3** Email templates send correctly (test SMTP or Mailhog): welcome, booking, order, password reset
- [ ] **F4** Laravel frontend home uses `pagecontent()` / CMS like other pages (or document intentional static hero)
- [x] **F5** Impersonation routes to correct React portal (`url_partner` / `url_user`) — `AdminImpersonateTest`
- [ ] **F6** Blade audit: no raw `@php` blocks, excessive inline CSS/JS in views (move to assets where needed)
- [ ] **F7** Permissions enforced beyond roles (spot-check gated routes + policies)
- [x] **F8** No third-party image hotlinks in `apps/` (Unsplash removed — re-grep before ZIP)
- [ ] **F9** Code comments written for marketplace buyers, not session-specific notes
- [ ] **F10** Stripe keys persist across `migrate:fresh --seed` / demo refresh (seed or env fallback)

---

## G — Distribution ZIP

Exclude `_development/`, `.cursor/`, `node_modules/`, `.env`, test artifacts.  
Include `documentation/reviewer/`, `Documentation/`, `apps/`, `packages/`, root `CHANGELOG.md`.

### Assets

- [x] Unsplash hotlinks removed from `apps/backend`, `apps/seller`, `apps/buyer`
- [ ] Theme WebP bundle copied to `apps/backend/public/themes/` (source: `_development/storefront/app/public/themes/`)
- [ ] `database/seeders/images/` — only redistributable images; add `ATTRIBUTION.txt` if required
- [ ] `public/images/` placeholders and fallbacks present
- [ ] No `.env` or real API secrets in ZIP
- [ ] `grep -ri "unsplash.com" apps/` → zero matches in shipped code

### Documentation in ZIP

- [x] `documentation/reviewer/README.md` index current
- [x] `documentation/reviewer/QA_REVIEW_2026-06-07.md`
- [x] `documentation/reviewer/TEST_PASS_2026-06-07.md`
- [x] `documentation/reviewer/PACKAGE_AUDIT_2026-06-07.md`
- [x] `documentation/reviewer/NPM_AUDIT_2026-06-07.md`
- [x] `documentation/reviewer/DEMO_IMAGE_AUDIT_2026-06-07.md`
- [ ] `Documentation/index.html` — install steps match actual installer
- [ ] `apps/backend/README.md` — demo creds, cron, queue, post-install security
- [ ] Envato ZIP README: replace external banner CDN with bundled image

### Pre-ZIP commands

```bash
cd apps/backend && php artisan test
cd apps/backend && composer audit
cd apps/backend && npm run test:browser
cd apps/seller && npm audit
cd apps/buyer && npm audit
```

- [ ] All commands pass on release commit
- [ ] `php artisan route:clear` noted in README if routes were cached during dev
- [ ] Version bumped in `CHANGELOG.md` — move `[Unreleased]` to `[1.0.x]` with date

---

## H — Envato listing (off-repo deliverables)

Drafts in `_development/listing-drafts/` — finalize before upload.

### Item page

- [ ] Title + short description (feature bullets, tech stack)
- [ ] Long description HTML (polished draft, no lorem ipsum)
- [ ] Category + tags (Laravel, marketplace, multi-vendor, etc.)
- [ ] Price tier decided
- [ ] **Screenshots** (min 5–8): admin dashboard, listing CRUD, storefront, checkout, seller React, buyer React, installer
- [ ] **Live demo URL** with seeded data + demo login notes in item description
- [ ] Changelog section on item page matches root `CHANGELOG.md`

### Reviewer notes (private / item comments)

- [ ] Demo admin / partner / buyer credentials
- [ ] PHP 8.2+, MySQL 8+, Node for asset build (if required)
- [ ] Known limitations (English-only, optional Google Maps key, etc.)

---

## I — Final sign-off

- [ ] No open **Critical** or **High** findings in latest QA review
- [ ] Fresh install + critical paths completed (sections B + C)
- [ ] Payments verified in sandbox (section D)
- [ ] Theme minimum spot-check done (section E)
- [ ] ZIP built and smoke-tested from extracted copy (section G)
- [ ] Listing page + demo live (section H)
- [ ] Tag release commit; keep reviewer docs date in sync

**When all sections are checked:** update `QA_REVIEW_YYYY-MM-DD.md` executive summary to **Ready** and copy to `documentation/reviewer/`.

---

## Quick commands reference

| Task | Command |
|------|---------|
| PHPUnit | `cd apps/backend && php artisan test` |
| Admin E2E | `cd apps/backend && npm run test:browser` |
| Installer E2E | `cd apps/backend && npm run test:browser:installer` |
| Composer audit | `cd apps/backend && composer audit` |
| Create testing DB | `cd apps/backend && php scripts/create-testing-db.php` |
| Stripe local forward | `stripe listen --forward-to http://127.0.0.1:8000/webhooks/stripe` |

---

## Issue log

| Date | Section | Issue | Status |
|------|---------|-------|--------|
| | | | |
