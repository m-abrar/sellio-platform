# Quality assurance — reviewer package

This folder is included in the **CodeCanyon submission bundle** so Envato reviewers can verify security remediation, dependency hygiene, and automated test coverage without digging through internal development files.

## Reviewer guide (start here)

**[index.html](./index.html)** — HTML guide for Envato reviewers: package map, installer steps, demo credentials, smoke-test path, test reproduction commands, and security summary. Styled consistently with the buyer documentation at [../index.html](../index.html).

## Contents (2026-06-07 pass)

| Document | Purpose |
|----------|---------|
| [QA_REVIEW_2026-06-07.md](./QA_REVIEW_2026-06-07.md) | Checklist-based QA summary (security, architecture, submission readiness) |
| [TEST_PASS_2026-06-07.md](./TEST_PASS_2026-06-07.md) | PHPUnit (259 tests) and Playwright admin E2E (48 tests) — commands and fixes |
| [PACKAGE_AUDIT_2026-06-07.md](./PACKAGE_AUDIT_2026-06-07.md) | Composer dependency audit and updates |
| [NPM_AUDIT_2026-06-07.md](./NPM_AUDIT_2026-06-07.md) | npm audit for seller and buyer React apps |
| [DEMO_IMAGE_AUDIT_2026-06-07.md](./DEMO_IMAGE_AUDIT_2026-06-07.md) | Demo/placeholder image policy (no third-party hotlinks in shipped UI) |

## How to reproduce tests

From the repository root:

```bash
# PHPUnit (SQLite, no MySQL required)
cd apps/backend && php artisan test

# Playwright admin E2E (requires MySQL + sellio_testing database)
cd apps/backend
php scripts/create-testing-db.php   # first time only
npm run test:browser
```

See [TEST_PASS_2026-06-07.md](./TEST_PASS_2026-06-07.md) for installer E2E and environment details.

## Related buyer documentation

End-user installation and configuration: [../index.html](../index.html)

Backend README (demo credentials, API limits, CMS trust model): [../../apps/backend/README.md](../../apps/backend/README.md)

## Internal vs submission copies

During development, full audit trails and deep-dive reports live under `_development/` (excluded from the distribution ZIP). Before each submission, curated summaries from that pass are copied here so reviewers receive a concise, self-contained QA pack.
