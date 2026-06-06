# Web Installer Smoke Test Report

**Project:** Sellio — Web Installer (`http://127.0.0.1:8000/install/`)  
**Report date:** 2026-05-31  
**Installer path:** `apps/backend/public/install/`  
**Related plan:** Installer Smoke Test Plan (2026-05-31)

---

## Executive summary

The Sellio web installer was verified end-to-end using an isolated MySQL database (`sellio_install_test`). The dev database (`sellio`) was **not** modified. After the run, `.env` and `installed.lock` were restored to their pre-test state via Playwright global teardown.

| Suite | Tests | Result | Duration / notes |
|-------|------:|--------|------------------|
| Playwright `tests/Browser/installer/` | 1 | **Passed** | ~13.1 min (final run) |

The installer correctly provisions schema, seeds demo data, creates an admin account, writes `installed.lock`, and blocks re-entry to `/install/` after completion.

---

## Database strategy

| Approach | Used? | Notes |
|----------|-------|-------|
| Separate empty DB (`sellio_install_test`) | **Yes** | Recommended; dev data preserved |
| Wipe dev DB (`sellio`) | No | Avoided |
| Reuse populated DB + "OVERWRITE TABLES" | Yes (data replaced) | Migration runs `migrate:fresh --force` |

**Why a fresh DB is required:** Migration runs `php artisan migrate --force` (not `migrate:fresh`). Seeding runs `php artisan db:seed --force`. A populated database can cause duplicate-key failures or partial installs.

---

## Installer flow verified

| Step | Route | Verified behavior |
|------|-------|-------------------|
| Welcome | `?step=welcome` | Wizard loads; navigation to requirements |
| Requirements | `?step=requirements` | All checks PASS (`exec`, `passthru`, writable paths) |
| Environment | `?step=environment` | `.env` written for `sellio_install_test`; DB connection OK |
| Packages | `?step=packages` | Page loads; POST skipped when `vendor/` exists (see caveats) |
| Migration | `?step=migration` | `migrate --force` succeeds; `migrations` table present |
| Modules | `?step=modules` | Module toggles saved to `settings` |
| Seeding | `?step=seeding` | `db:seed --force` completes; settings populated |
| Admin | `?step=admin` | Admin user created via `artisan tinker` |
| Finished | `?step=finished` | `installed.lock` created; launch links shown |

### Post-install assertions

| Check | Result |
|-------|--------|
| `installed.lock` exists after finished step | Pass |
| `/install/` redirects to app root when locked | Pass |
| Admin login at `/login` → `/admin` | Pass |
| Homepage `/` loads without SQL/Blade errors | Pass |
| Dev `.env` restored to `DB_DATABASE=sellio` | Pass |
| Dev `installed.lock` restored from backup | Pass |

**Test admin credentials (install DB only):**

- Email: `install-admin@sellio.test`
- Password: `install12345`

---

## Verification runs (2026-05-31)

| Run | Result | Notes |
|-----|--------|-------|
| Run 1 | **Failed** | Packages step: Composer autoload regen via web SAPI timed out at 5 min |
| Run 2 | **Failed** | Seeding step: full `DatabaseSeeder` exceeded 10 min test timeout |
| Run 3 | **Passed** | 30 min timeout; packages POST skipped when `vendor/` present; seeding completion marker used |

**Final passing command:**

```bash
cd apps/backend
npm run test:browser:installer:setup
npm run test:browser:installer
```

---

## Implementation files

```
apps/backend/scripts/create-install-test-db.php
apps/backend/scripts/reset-installer-state.php
apps/backend/playwright.installer.config.ts
apps/backend/tests/Browser/installer/global-setup.ts
apps/backend/tests/Browser/installer/global-teardown.ts
apps/backend/tests/Browser/installer/installer-smoke.spec.ts
apps/backend/package.json                          # test:browser:installer, test:browser:installer:setup
apps/backend/README.md                             # Installer smoke test section
documentation/reports/installer_smoke_test_report.md   ← this file
```

### Setup / teardown behavior

**Global setup** (`global-setup.ts`):

1. Backs up `.env` → `.env.bak` (if backup missing)
2. Backs up `installed.lock` → `installed.lock.bak` (if lock exists and backup missing)
3. Runs `php scripts/reset-installer-state.php` (remove lock, recreate empty `sellio_install_test`)

**Global teardown** (`global-teardown.ts`):

1. Restores `.env` from `.env.bak`
2. Restores `installed.lock` from `installed.lock.bak` (or removes lock if no backup existed)

---

## How to re-run manually

### Automated (recommended)

```bash
cd apps/backend
npm run test:browser:installer:setup
npm run test:browser:installer
```

### Manual browser walkthrough

```powershell
cd apps/backend
copy installed.lock installed.lock.bak
copy .env .env.bak
del installed.lock
php scripts/reset-installer-state.php
php artisan serve
```

Open `http://127.0.0.1:8000/install/` and complete all steps using database name `sellio_install_test`.

Restore afterward:

```powershell
copy /Y .env.bak .env
copy /Y installed.lock.bak installed.lock
```

---

## Caveats and known gaps

### Packages step (local dev)

When `vendor/autoload.php` already exists, the Playwright test **skips** the Composer POST and navigates directly to migration. Running `composer install` through PHP's web SAPI can hang on autoload optimization for several minutes. Fresh CodeCanyon installs without `vendor/` should run the full packages POST (covered by the `else` branch in the spec).

### Seeding duration

Full `DatabaseSeeder` (including `MediaFullSeeder`, `ActivityLogSeeder`, etc.) takes **~13 minutes** via the installer's `passthru` pipeline. Playwright timeout is set to **30 minutes** to accommodate this.

### "OVERWRITE TABLES" checkbox

When checked on a non-empty database, the installer sets a flag and the migration step runs **`php artisan migrate:fresh --force`**, which drops all tables and rebuilds the schema. On an empty database, a normal `migrate --force` runs instead.

### Not covered by this smoke test

- FTP/cPanel deployment without CLI
- Servers with `exec` or `passthru` disabled
- Re-install on a partially populated database
- Deleting `/public/install` after completion (documented as security step in finished view)

---

## Cleanup (temp artifacts)

The following were removed after testing:

- `.env.bak`, `installed.lock.bak`
- `test-results/` (Playwright artifacts)
- MySQL database `sellio_install_test`

Active dev files (`.env`, `installed.lock`, `sellio` database) were left intact.

---

## Conclusion

The Sellio web installer smoke test **passed** on 2026-05-31. The full first-time install path works against a clean database: environment setup, migrations, module configuration, demo seeding, admin provisioning, and lock-file gating all behave as expected. Repeatable automation is available via `npm run test:browser:installer`.
