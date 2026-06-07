# Sellio QA Reviewer

Strict CodeCanyon Laravel quality review for the Sellio backend.

## How to run

**In Cursor:** Ask the agent to run a QA review, or say *"use the qa-reviewer skill"*. The skill lives at `.cursor/skills/qa-reviewer/SKILL.md`.

**Output:** Reports are written to:

`_development/audits/backend/00_strategic/QA_REVIEW_YYYY-MM-DD.md`

**Latest report:** [`QA_REVIEW_2026-06-07.md`](audits/backend/00_strategic/QA_REVIEW_2026-06-07.md)

## Related audits

| Document | Purpose |
|----------|---------|
| `audits/backend/00_strategic/CODECANYON_QUALITY_REPORT.md` | UI/code quality baseline |
| `audits/backend/00_strategic/final_quality_audit.md` | Layer-by-layer critical fixes |
| `audits/backend/00_strategic/001_deep_reaudit_final_report.md` | Production readiness re-audit |
| `documentation/THEME_QA_AUDIT_REPORT.md` | Storefront theme matrix |

---

## Review checklist

Act as a strict CodeCanyon Laravel reviewer. Scan the full Laravel project and create a detailed quality report for possible rejection issues, code quality issues, security risks, maintainability problems, and marketplace-readiness problems.

### 1. Namespace and Import Quality

* Inline fully-qualified classes like `\App\Models\User::class`
* Third-party classes used directly inside methods instead of `use` statements
* Duplicate imports
* Unused imports
* Wrong namespace paths
* Conflicting class aliases
* Missing `use` statements
* Inconsistent `App\path\path` references

### 2. Controllers

* Fat controllers with business logic
* Missing validation
* No try/catch where needed
* Direct DB queries that should be in services/repositories
* Repeated code
* Hardcoded IDs, roles, statuses, emails, URLs, or prices
* Poor response handling
* Missing authorization checks
* Mixed web/API response style

### 3. Models

* Missing `$fillable` or `$guarded`
* Unsafe mass assignment
* Missing relationships
* Wrong relationship names
* Query logic that should be scopes
* Missing casts for dates, booleans, JSON, money, status fields
* Accessors/mutators written poorly
* Hardcoded table names without reason

### 4. Routes

* Duplicate routes
* Unused routes
* Routes pointing to missing methods
* Wrong middleware
* Admin/vendor/user route leakage
* Missing auth protection
* Missing route names
* Inconsistent route file organization

### 5. Requests and Validation

* Validation written directly in controllers
* Missing Form Request classes
* Weak validation rules
* Missing unique/update-safe rules
* No file validation for uploads
* No max size or mime type checks
* Missing authorization logic in requests

### 6. Services, Traits, Helpers

* Global helper conflicts
* Large helper files
* Repeated logic across services
* Traits doing too much
* Static methods used unnecessarily
* Poor dependency injection
* Hidden side effects

### 7. Security

* SQL injection risk
* XSS risk in Blade files
* Unescaped output `{!! !!}`
* Unsafe file uploads
* Public access to private files
* Missing CSRF protection
* Missing authorization policies/gates
* Exposed `.env`, keys, tokens, credentials, or debug data
* `APP_DEBUG=true`
* Weak password or admin seed credentials
* Unprotected install/update routes

### 8. Blade and Frontend

* Broken asset paths
* Inline PHP inside Blade
* Repeated Blade code that should be components/partials
* Missing translations
* Hardcoded text
* Missing empty states
* Broken responsive layout
* Console errors
* Missing loading/error states
* Admin UI inconsistency

### 9. Database, Migrations, Seeders

* Migration errors
* Missing foreign keys
* Wrong nullable/default fields
* Poor column types
* Missing indexes
* Seeders with unsafe demo data
* Factories not working
* Rollback failure
* Fresh install failure

### 10. Package and Dependency Review

* Unused Composer packages
* Outdated or abandoned packages
* Wrong PHP/Laravel version constraints
* Missing required extensions
* NPM build errors
* Unused frontend packages
* License issues with third-party assets/packages

### 11. Installer and Deployment

* Fresh installation does not work
* Missing installation guide
* Storage link not handled
* Cache/config commands not documented
* Queue/cron setup missing
* File permissions not explained
* Demo import missing or broken
* Update guide missing

### 12. API Quality

* Inconsistent JSON responses
* Missing API validation
* Missing API authentication
* Missing rate limiting
* Poor status codes
* No API documentation
* Exposed internal errors

### 13. Performance

* N+1 queries
* Missing eager loading
* Large queries in loops
* No pagination
* Heavy dashboard queries
* No caching where useful
* Slow media loading
* Unoptimized images

### 14. Code Standards

* PSR-12 issues
* Inconsistent formatting
* Dead code
* Commented-out code
* Debug code like `dd()`, `dump()`, `ray()`, `console.log()`
* Unclear variable names
* Overly long methods/classes
* Missing return types where appropriate

### 15. Marketplace Readiness

* Documentation missing or weak
* Screenshots not matching actual product
* Demo credentials missing
* Changelog missing
* Version number missing
* License credits missing
* Sample data missing
* Support instructions missing
* Feature claims not working
* Incomplete modules
* Broken links
* Placeholder text/images still present

---

## Finding format

For each issue:

* File path
* Line number if possible
* Issue title
* Severity: Critical / High / Medium / Low
* Why it matters for CodeCanyon review
* Recommended fix
* Example corrected code if useful

Do not change business logic unless clearly necessary. Focus on CodeCanyon approval quality, Laravel best practices, security, clean code, and buyer trust.
