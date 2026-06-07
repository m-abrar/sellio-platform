---
name: prepare-distribution
description: >-
  Build Sellio CodeCanyon / fresh-server distribution packages via
  scripts/prepare-distribution.mjs. Use when the user asks to prepare,
  build, package, or ZIP distribution/, distribution-fresh/, or
  distribution.zip; update distribution rules; or verify what ships in
  the submission bundle.
---

# Sellio Distribution Prep

Prepare a **fresh-server test package** or **CodeCanyon ZIP** from the monorepo. The source repo is never modified — all work happens in the output folder.

## Before you start

1. Read `.cursor/rules/distribution.mdc` for packaging invariants (especially `storage/app/public/settings/`).
2. Read `_development/planning/DISTRIBUTION_PREP_PLAN.md` for the full operational plan.
3. For submission readiness, cross-check section **G** in `_development/planning/CODECANYON_SUBMISSION_CHECKLIST.md`.

## Run the build (repo root)

| Command | Use when |
|---------|----------|
| `npm run prepare:distribution` | Default — full package + backend/seller/buyer builds |
| `npm run prepare:distribution:quick` | Package only (`--skip-build`); faster iteration |
| `npm run prepare:distribution:zip` | Full package + `distribution.zip` at repo root |

Custom output:

```bash
node scripts/prepare-distribution.mjs --output D:/sellio-staging
```

Portal URLs (written into seller/buyer `public/config.js` and `.env.production`):

```bash
node scripts/prepare-distribution.mjs \
  --api-url https://example.com/api \
  --storefront-url https://example.com \
  --seller-url https://seller.example.com \
  --buyer-url https://buyer.example.com
```

Env equivalents: `DISTRIBUTION_API_URL`, `DISTRIBUTION_STOREFRONT_URL`, `DISTRIBUTION_SELLER_URL`, `DISTRIBUTION_BUYER_URL`.

## What the script does

1. Wipes and recreates `distribution/` (or `--output` path)
2. Copies: `apps/`, `documentation/`, `Documentation/`, `introduction/`, `listing-description/`, `CHANGELOG.md`, `README.md`, `LICENSE` (Envato CodeCanyon commercial notice — not MIT)
3. Excludes: `_development/`, `.cursor/`, `.git/`, all `node_modules/`, all `vendor/`, `.env*`, `installed.lock`, test caches, `*.zip`, `packages/`
4. Clears runtime artifacts in the copy: bootstrap cache, logs, compiled views, `public/hot`, `public/storage`
5. **Storage rule:** skips dev media under `backend/storage/app/public/` except `.gitignore` and `settings/**`; runs `ensureBrandSettingsInDistribution()` for `logo.png` + `favicon.ico`
6. Copies theme WebP bundle: `_development/storefront/app/public/themes/` → `apps/backend/public/themes/`
7. Downloads `composer.phar` into `apps/backend/`
8. Builds (unless `--skip-build`): backend → `public/build/`, seller/buyer → `dist/`
9. Writes `SERVER-DEPLOY.md` and `DISTRIBUTION-MANIFEST.json`

## Packaging invariants (never violate)

### Always ship `storage/app/public/settings/`

- Default `logo.png` and `favicon.ico` — branding works before demo seed runs
- Source priority: repo `storage/app/public/settings/` → fallback `database/seeders/images/`
- `prepare-distribution.mjs` must call `ensureBrandSettingsInDistribution()` after cleaning artifacts

### Never ship other dev media

- Path: `distribution/apps/backend/storage/app/public/` — keep `.gitignore` and `settings/` only
- Local dev runs can produce 10k+ files (~1.3 GB); demo seed recreates CMS media on install (`MediaFullSeeder`, `PageContentMediaSeeder`)

### Script must

1. Skip copying under `backend/storage/app/public/` except `.gitignore` and `settings/**`
2. Clear `storage/app/public/` after copy but **preserve** `settings/`
3. Run `ensureBrandSettingsInDistribution()` if logo/favicon missing

When editing `scripts/prepare-distribution.mjs`, verify these three behaviors still hold, then rebuild.

### LICENSE must be CodeCanyon / Envato (not MIT)

- Root `LICENSE` and `apps/backend/LICENSE` state that Sellio is **paid commercial software** on CodeCanyon
- Governed by the buyer's **Regular** or **Extended** Envato license — links to official terms included
- **Never** ship MIT, GPL, or open-source license text for Sellio itself (third-party deps keep their own licenses)
- Post-build: confirm `distribution/LICENSE` does not contain "MIT License"

## Post-build verification

After a successful run, confirm:

```
distribution/
├── LICENSE                             # Envato CodeCanyon notice (not MIT)
├── apps/backend/LICENSE                # same notice
├── apps/backend/public/build/          # Vite manifest present (unless --skip-build)
├── apps/backend/storage/app/public/
│   ├── .gitignore
│   └── settings/logo.png, favicon.ico  # both exist
├── apps/seller/dist/                   # unless --skip-build
├── apps/buyer/dist/                    # unless --skip-build
├── SERVER-DEPLOY.md
└── DISTRIBUTION-MANIFEST.json
```

Also verify **absent** from the output:

- `_development/`, `.cursor/`, `.git/`, `node_modules/`, `vendor/`, `.env`, `installed.lock`
- Dev-uploaded files under `storage/app/public/` outside `settings/`
- Real API secrets or `.env` files

Quick checks (adjust path if using `--output`):

```bash
# settings branding present
ls distribution/apps/backend/storage/app/public/settings/

# no stray dev media (should only show .gitignore + settings)
ls distribution/apps/backend/storage/app/public/

# no secrets
rg -l "\.env" distribution/ --glob '!*.md'

# LICENSE is commercial CodeCanyon (must NOT say MIT License)
rg "MIT License" distribution/LICENSE distribution/apps/backend/LICENSE
# expect: no matches
```

## After the script finishes

1. Upload entire `distribution/` (or `distribution.zip`) to a clean VPS/cPanel
2. Point web root to `apps/backend/public`
3. Run web installer at `/install` or follow `SERVER-DEPLOY.md`
4. Run checklist section **B** (Fresh install) in `CODECANYON_SUBMISSION_CHECKLIST.md`

Production deploy with separate subdomains: upload `apps/backend` to main site; upload only `apps/seller/dist/` and `apps/buyer/dist/` contents to their subdomain roots (see `SERVER-DEPLOY.md` §6).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build step fails | Run `:quick`, fix npm errors in the failing app, re-run full build |
| `composer.phar` download blocked | Re-run on a networked machine; or use global Composer on server |
| Themes missing warning | Ensure `_development/storefront/app/public/themes/` exists locally |
| Seeder images missing on server | Confirm `apps/backend/database/seeders/images/` copied (~391 files) |
| `Vite manifest not found` on server | Use full `prepare:distribution` (not `:quick`); verify `public/build/` |
| Output folder locked (Windows) | Script renames to `distribution.stale-*`; close Explorer/antivirus locks |

## When modifying the script or rules

1. Update `.cursor/rules/distribution.mdc` if packaging rules change
2. Update `_development/planning/DISTRIBUTION_PREP_PLAN.md` if workflow/commands change
3. Re-run `npm run prepare:distribution` and verify post-build checklist above
4. Sync section **G** in `CODECANYON_SUBMISSION_CHECKLIST.md` if submission contents change

## Do not

- Copy `_development/`, `.env`, `installed.lock`, or local `storage/app/public/` media into the bundle
- Modify the source repo's `installed.lock` or `.env` as part of packaging
- Ship `:quick` output to buyers without a separate build step for `public/build/` and portal `dist/` folders
- Replace `LICENSE` with MIT, GPL, or other open-source terms — Sellio is a paid CodeCanyon product
- Commit `distribution/` or `distribution.zip` unless the user explicitly asks

## Related files

- `scripts/prepare-distribution.mjs` — implementation
- `.cursor/rules/distribution.mdc` — Cursor rule (auto-applies on script paths)
- `_development/planning/DISTRIBUTION_PREP_PLAN.md` — detailed plan
- `_development/planning/CODECANYON_SUBMISSION_CHECKLIST.md` — sections B and G
