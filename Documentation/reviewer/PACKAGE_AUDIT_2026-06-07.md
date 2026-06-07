# Package & License Audit — 2026-06-07

Manual pass for CodeCanyon checklist §10 (Packages) and marketplace readiness.

## Executive summary

| Check | Status | Notes |
|-------|--------|-------|
| `composer audit` (direct + transitive) | **Pass (1 low residual)** | 25 advisories → 1 after dependency bumps |
| Production license compatibility | **Pass** | All prod deps MIT/BSD/Apache/ISC; dual-licensed Nette is transitive only |
| Root `CHANGELOG.md` | **Added** | See `/CHANGELOG.md` |
| Bundled frontend assets | **Pass** | Theme WebP + seeder paths documented; Unsplash removed from `apps/` — see `DEMO_IMAGE_AUDIT_2026-06-07.md` |

---

## Composer security audit

**Command:** `cd apps/backend && composer audit`

### Resolved (2026-06-07)

| Package | Severity | Action |
|---------|----------|--------|
| `dedoc/scramble` | Critical (RCE) | `0.13.20` → `0.13.26`; constraint `^0.13.22` |
| `laravel/framework` | Medium (CRLF email rule) | `12.43.1` → `12.61.1` |
| `phpunit/phpunit` | High (dev only) | `11.5.46` → `11.5.55` |
| `league/commonmark` | Medium | `2.8.0` → `2.8.2` (via framework) |
| `symfony/*` (mime, routing, process, yaml) | Low–High | Patched via framework / direct updates |
| `phpseclib/phpseclib` | High | `3.0.48` → `3.0.52` (Socialite transitive) |
| `paragonie/sodium_compat` | Medium | `2.4.0` → `2.5.0` |
| `psy/psysh` | Medium (dev/tinker) | `0.12.18` → `0.12.23` |

### Residual advisory

| Package | Severity | Reason | Mitigation |
|---------|----------|--------|------------|
| `firebase/php-jwt` `<7.0.0` | Low | `laravel/socialite ^5.24` requires `firebase/php-jwt ^6.4` | OAuth token verification only; monitor Socialite releases for JWT 7 support |

**Re-run before each release:** `composer audit` and `composer update --with-all-dependencies` on security branches.

---

## Direct production dependencies (`composer.json`)

| Package | License | Marketplace notes |
|---------|---------|-------------------|
| `laravel/framework` | MIT | Core framework |
| `laravel/sanctum` | MIT | API tokens |
| `laravel/socialite` | MIT | OAuth providers |
| `bavix/laravel-wallet` | MIT | Internal wallet ledger |
| `spatie/laravel-permission` | MIT | RBAC |
| `spatie/laravel-activitylog` | MIT | Admin audit trail |
| `spatie/laravel-medialibrary` | MIT | Media uploads |
| `jeroennoten/laravel-adminlte` | MIT | Admin UI shell (includes AdminLTE 3) |
| `dedoc/scramble` | MIT | OpenAPI docs; restrict `/docs/api` in production |
| `stripe/stripe-php` | MIT | Payments |
| `pusher/pusher-php-server` | MIT | Optional realtime |

All direct production dependencies use permissive open-source licenses compatible with redistribution in a commercial CodeCanyon item (buyer receives source; Envato license governs the product).

---

## Transitive license notes

| Package | License | Note |
|---------|---------|------|
| `nette/utils`, `nette/schema` | BSD-3-Clause **+ GPL-2.0/3.0** | Transitive via Laravel; used as library, not modified |
| `firebase/php-jwt` | BSD-3-Clause | Via Socialite |
| `league/commonmark` | BSD-3-Clause | Markdown rendering |
| `paragonie/sodium_compat` | ISC | Crypto compat layer |

No copyleft (AGPL/GPL-only) packages appear in the **production** `--no-dev` tree.

---

## Bundled assets (non-Composer)

| Asset | Location | License / action |
|-------|----------|------------------|
| AdminLTE 3 | `vendor/almasaeed2010/adminlte` | MIT |
| Bootstrap / Bootstrap Icons | `public/`, Blade layouts | MIT |
| Demo seed images | `database/seeders/images`, `public/themes/` | See `DEMO_IMAGE_AUDIT_2026-06-07.md`; local `/themes/` paths only in seeders |
| Theme preview (Unsplash) | Root `README.md` banner URL | GitHub preview only — replace in Envato distribution ZIP |

---

## NPM workspaces (seller / buyer dashboards)

**Status:** **Pass** (2026-06-07) — see `NPM_AUDIT_2026-06-07.md`. `npm audit fix` applied; 0 Critical/High/Moderate residual in both apps.

```bash
cd apps/seller && npm audit
cd apps/buyer && npm audit
```

---

## Recommendations

1. Add `composer audit` to CI (fail on Critical/High in production lockfile).
2. Pin Scramble docs route behind admin auth in production (`config/scramble.php` — already uses `RestrictedDocsAccess`).
3. Track `laravel/socialite` for `firebase/php-jwt` v7 compatibility.
4. Complete demo image provenance checklist before final CodeCanyon upload — see `DEMO_IMAGE_AUDIT_2026-06-07.md` (theme bundle copy + seeder folders remain manual).
