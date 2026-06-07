---
name: qa-reviewer
description: >-
  Strict CodeCanyon Laravel quality review for Sellio. Use when the user asks
  for QA review, CodeCanyon readiness, marketplace audit, rejection-risk scan,
  or references QA-reviewer.md.
---

# Sellio QA Reviewer (CodeCanyon)

Act as a strict CodeCanyon Laravel reviewer. Scan `apps/backend` (and related docs/installer) and produce a structured quality report. Do **not** change business logic unless the user asks to fix issues.

## Before you start

1. Read `_development/audits/backend/00_strategic/` for prior findings — avoid duplicate noise; note regressions or resolved items.
2. Prefer **manual code reading and targeted search** over bulk auto-fix scripts.
3. Write the report to `_development/audits/backend/00_strategic/QA_REVIEW_YYYY-MM-DD.md` (use today's date).

## Review checklist (15 areas)

### 1. Namespace and import quality
- Inline FQCN in executable code (`\App\Models\User`, `\Illuminate\Support\Facades\DB`)
- Missing, duplicate, unused, or conflicting `use` statements
- Inconsistent namespace references

### 2. Controllers
- Fat controllers, missing validation/authorization, direct DB in controllers
- Hardcoded IDs, roles, statuses, URLs, prices
- Mixed web/API response patterns

### 3. Models
- Mass assignment safety, relationships, casts, scopes vs query logic in models

### 4. Routes
- Duplicates, missing methods, wrong middleware, auth leakage, missing names

### 5. Requests and validation
- Validation in controllers vs Form Requests, weak rules, upload validation

### 6. Services, traits, helpers
- Global helper conflicts, duplicated logic, traits doing too much, DI quality

### 7. Security
- SQL injection, XSS (`{!! !!}`), uploads, CSRF, policies/gates
- Exposed secrets, debug mode, weak demo credentials, install/update exposure

### 8. Blade and frontend
- Asset paths, inline PHP, hardcoded text, missing empty/error states

### 9. Database, migrations, seeders
- FKs, indexes, nullable/types, seeder safety, fresh install / rollback

### 10. Packages and dependencies
- Unused/outdated packages, PHP/Laravel constraints, license issues

### 11. Installer and deployment
- Fresh install path, storage link, queue/cron docs, demo import, post-install hardening

### 12. API quality
- JSON shape, auth, rate limits, status codes, error leakage, documentation

### 13. Performance
- N+1, missing eager loading, unpaginated lists, heavy dashboard queries

### 14. Code standards
- PSR-12, dead/commented code, `dd()`/`dump()`, missing return types

### 15. Marketplace readiness
- README, changelog, demo credentials docs, screenshots, placeholder content

## Severity rules

| Level | Use when |
|-------|----------|
| **Critical** | Security exploit, broken install, data loss, auth bypass |
| **High** | Likely CodeCanyon rejection or buyer-facing breakage |
| **Medium** | Best-practice gap, maintainability, reviewer nitpick |
| **Low** | Style, docblocks, optional polish |

## Required output format

Use this structure in the report file:

```markdown
# Sellio QA Review — YYYY-MM-DD

## Executive summary
- Overall readiness: Ready / Needs work / Not ready
- Critical: N | High: N | Medium: N | Low: N
- Top 3 actions before submission

## Section scores (1–15)
Brief pass/partial/fail per checklist area.

## Findings

### [SEVERITY] Issue title
- **File:** `path/to/file.php`
- **Line:** 123 (if known)
- **Why it matters:** CodeCanyon / security / buyer impact
- **Recommendation:** Concrete fix
- **Example:** (optional short code snippet)

## Resolved since last review
List items fixed in recent commits if applicable.

## Manual verification still needed
Browser QA, fresh install on clean server, payment webhooks, etc.
```

## Workflow

1. Scan checklist areas 1–15 (prioritize 7, 11, 12, 15 for submission).
2. Record every finding with file path and severity.
3. Summarize — do not bury critical issues in prose.
4. If user asks to **fix**, tackle Critical/High first; one focused PR/commit theme at a time.
5. After fixes, re-run affected checklist sections only.

## Sellio-specific notes

- **Installer:** `public/install/` + `installed.lock`; `public/index.php` blocks re-entry when locked. Flag if `/install` remains on disk after install.
- **Demo users:** `database/seeders/UserSeeder.php` uses documented demo passwords — ensure README lists them and production guidance says change/remove.
- **Prior audits:** See `CODECANYON_QUALITY_REPORT.md`, `final_quality_audit.md`, `001_deep_reaudit_final_report.md`.
- **Theme QA:** Storefront themes are tracked separately in `_development/documentation/THEME_QA_AUDIT_REPORT.md`.
- **Reviewer package:** After a QA pass, write dated reports under `_development/audits/backend/00_strategic/`, then copy the submission-facing set (QA review, test pass, package/npm/demo-image audits) into **`documentation/reviewer/`** with an updated `README.md` index. That folder ships in the CodeCanyon ZIP; `_development/` does not.

## Do not

- Change string morph map values, route names, or config keys unless they are PHP class references.
- Run destructive git commands or commit unless the user asks.
- Claim "no issues" without checking security, install, and API areas.
