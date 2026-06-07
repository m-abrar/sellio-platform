# Distribution prep — automated plan

Last updated: 2026-06-07

Use this when preparing a **fresh-server test package** or a **CodeCanyon ZIP** without manual copy/paste.

**Cursor Agent:** use the project skill `.cursor/skills/prepare-distribution/SKILL.md` when packaging, verifying the bundle, or editing `scripts/prepare-distribution.mjs`.

## One command (from repo root)

```bash
npm run prepare:distribution
```

Variants:

| Command | What it does |
|---------|----------------|
| `npm run prepare:distribution` | Full package + builds backend/seller/buyer assets |
| `npm run prepare:distribution:quick` | Package only, no `npm run build` (faster) |
| `npm run prepare:distribution:zip` | Full package + `distribution.zip` |

Custom output directory:

```bash
node scripts/prepare-distribution.mjs --output D:/sellio-staging
```

## What the script does automatically

1. **Creates** `distribution/` (or your `--output` path), wiping any previous run
2. **Copies** submission roots: `apps/`, `documentation/`, `Documentation/`, `introduction/`, `listing-description/`, `CHANGELOG.md`, `README.md`, `LICENSE` (Envato CodeCanyon commercial notice — **not** MIT/open source; excludes `packages/` — dev-only, not deployed)
3. **Excludes** dev/heavy paths: `_development/`, `.cursor/`, `.git/`, all `node_modules/`, all `vendor/`, `.env*`, `installed.lock`, test caches, `*.zip`
4. **Clears** runtime artifacts in the copy: Laravel bootstrap cache, logs, compiled views, `public/hot`, `public/storage`
5. **Clears** `apps/backend/storage/app/public/` except `settings/` (logo + favicon) — skips dev-uploaded media (~1.3 GB locally); demo seed repopulates the rest on install
6. **Copies** theme WebP bundle from `_development/storefront/app/public/themes/` → `apps/backend/public/themes/`
7. **Downloads** `composer.phar` into `apps/backend/` (for cPanel / no global Composer)
8. **Builds** (unless `--skip-build`):
   - `apps/backend` → `public/build/`
   - `apps/seller` → `dist/`
   - `apps/buyer` → `dist/`
9. **Writes** `SERVER-DEPLOY.md` and `DISTRIBUTION-MANIFEST.json` in the output folder

Your **source repo is never modified** (no `installed.lock` removal in dev).

## LICENSE file (required)

Root `LICENSE` and `apps/backend/LICENSE` must both state that Sellio is **paid CodeCanyon / Envato Market** software — proprietary, governed by the buyer's Regular or Extended license. **Never** ship MIT, GPL, or other open-source license text for Sellio itself.

After editing `LICENSE`, rebuild the distribution so `distribution/LICENSE` and `distribution/apps/backend/LICENSE` are updated.

## After the script finishes

1. Upload the entire `distribution/` folder to a clean VPS or cPanel
2. Point the web root to `apps/backend/public`
3. Open `/install` or follow `SERVER-DEPLOY.md` CLI steps
4. Run checklist section **B** in `CODECANYON_SUBMISSION_CHECKLIST.md`

## Optional: ZIP for upload

```bash
npm run prepare:distribution:zip
```

Produces `distribution.zip` next to the repo root.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build step fails | Run `npm run prepare:distribution:quick`, fix npm errors in the app, re-run full build |
| `composer.phar` download blocked | Run script again on a network-connected machine; or upload global Composer on server |
| Themes missing warning | Ensure `_development/storefront/app/public/themes/` exists locally |
| Seeder images missing on server | They live in `apps/backend/database/seeders/images/` — confirm copied (391 files locally) |
| `Vite manifest not found` on server | Upload `apps/backend/public/build/` (run `npm run build` in `apps/backend`, or use full `prepare:distribution` — not `:quick`) |

## Related

- `.cursor/skills/prepare-distribution/SKILL.md` — Cursor agent skill (workflow + verification)
- `.cursor/rules/distribution.mdc` — packaging invariants for the script
- `CODECANYON_SUBMISSION_CHECKLIST.md` — section G (Distribution ZIP), section B (Fresh install)
- `scripts/prepare-distribution.mjs` — implementation
