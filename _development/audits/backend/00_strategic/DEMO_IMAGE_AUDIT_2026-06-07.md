# Demo Image Provenance Audit — 2026-06-07

CodeCanyon checklist §10 (license/assets) and §9 (seeders). Confirms demo media is distributable and hotlinked stock photos are removed from shipping code.

## Executive summary

| Area | Status | Notes |
|------|--------|-------|
| Backend PHP / Blade (`apps/backend`) | **Pass** | No `unsplash.com` URLs in application code; theme CMS defaults use bundled `/themes/...` paths |
| Seller dashboard (`apps/seller`) | **Pass** | Unsplash fallbacks replaced with inline SVG placeholders (`src/constants/placeholders.ts`) |
| Buyer dashboard (`apps/buyer`) | **Pass** | No Unsplash references |
| Theme preview WebP bundle | **Documented** | Lives under `_development/storefront/app/public/themes/`; deploy to `public/themes/` for Laravel storefront |
| Seeder listing photos | **Manual** | `MediaFullSeeder` reads `database/seeders/images/` — include only royalty-free assets in distribution ZIP |
| Root `README.md` banner | **Review** | GitHub preview uses external Unsplash CDN; replace or remove in Envato distribution package |

---

## Bundled theme assets

**Location (source):** `_development/storefront/app/public/themes/{vertical}/{theme}/*.webp`

**Runtime path:** `/themes/...` (served from Laravel `public/themes/` after storefront assets are copied or built into the backend public directory)

**License posture:** Demo theme images are synthetic/placeholder photography bundled for marketplace preview. They are redistributable as part of the Sellio item source. Buyers may replace them with their own media.

**ThemeSeeder / ContentController:** All default CMS image keys reference local `/themes/...` paths — no third-party CDN dependencies in seeded storefront content.

---

## Seeder media (`MediaFullSeeder`)

**Path:** `apps/backend/database/seeders/images/{ModelName}/`

**Behavior:** Attaches primary + optional gallery images to seeded listings (properties, events, autos, etc.). Gallery seeding is disabled by default in `MediaFullSeeder` (`$seedGalleryMedia = false`).

**Before submission:**

1. Ensure `database/seeders/images/` folders contain only images you have rights to redistribute.
2. Add a short `ATTRIBUTION.txt` per folder if any stock provider requires credit (Unsplash/Pexels license text).
3. If images are omitted from the ZIP to reduce size, document that buyers must supply their own demo photos or run without `MediaFullSeeder`.

---

## UI placeholders (no external photos)

| App | Mechanism |
|-----|-----------|
| Laravel Blade | `asset('images/placeholder.png')`, `images/fallbacks/default.jpg` |
| Seller React | SVG data-URI placeholders in `apps/seller/src/constants/placeholders.ts` |
| Spatie Media Library | `Gallery` model fallback `/images/placeholder.webp` |

---

## Pre-upload checklist

- [x] Remove Unsplash hotlinks from `apps/backend`, `apps/seller`, `apps/buyer`
- [ ] Copy theme WebP bundle into `apps/backend/public/themes/` for distribution (or document build step)
- [ ] Verify `database/seeders/images/` contents and optional `ATTRIBUTION.txt`
- [ ] Replace root `README.md` Unsplash banner URL in Envato ZIP (GitHub-only CDN link is acceptable for repo)
- [ ] Re-run after asset changes: `grep -r "unsplash.com" apps/` → expect zero matches in app code

---

## Related audits

- `PACKAGE_AUDIT_2026-06-07.md` — Composer licenses + NPM follow-up
- `NPM_AUDIT_2026-06-07.md` — React dashboard dependency scan
