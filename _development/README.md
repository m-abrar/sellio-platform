# Development Workspace

This folder holds **internal development assets** that are not part of the CodeCanyon submission package. The submission-ready product lives at the repository root.

## Layout

| Folder | Contents |
|--------|----------|
| `planning/` | TODO trackers, roadmaps, status reports |
| `audits/` | Backend audit trails (`.audit`) |
| `documentation/` | Theme audits, QA reports, completion plans (buyer docs stay in `/documentation`) |
| `docs/` | Misc dev notes and roadmaps |
| `reference-library/` | Theme blueprint HTML/Blade references |
| `storefront/` | Next.js storefront work-in-progress (not shipped) |
| `mobile/` | Expo / React Native prototype (not shipped) |
| `test-scripts/` | Ad-hoc PHP debugging scripts (PHPUnit suite stays in `apps/backend/tests`) |
| `listing-drafts/` | Alternate listing-description HTML drafts |
| `temp/` | Local logs and scratch files |
| `ide/` | Editor config (`.cursor`, `.vscode`) |
| `ci/` | GitHub Actions workflows |

## Restoring dev tooling locally

```bash
# IDE settings (optional)
cp -r _development/ide/cursor .cursor
cp -r _development/ide/vscode .vscode

# CI workflows (optional)
cp -r _development/ci/github .github

# Next.js storefront (optional)
cp -r _development/storefront/app apps/storefront

# Mobile prototype (optional)
cp -r _development/mobile/app apps/mobile
```
