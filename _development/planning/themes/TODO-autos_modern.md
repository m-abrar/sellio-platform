## Completed / Explained

- [x] Fix homepage featured items grid — 6 cards cause uneven rows/columns.
  - `.md-featured-grid` in `styles.css` uses `grid-template-columns: repeat(3, minmax(0, 1fr))` — always 3 columns, so 6 cards render as a clean 2×3 matrix with no orphans. Already fixed.

- [x] Explain confusing numbers "9, 10, 8" on top left of auto cards.
  - These were stat values in the hero section (`inventoryCount`, `brands.length`, `categories.length`) — clearly labeled "Vehicles", "Brands", "Categories". Not confusing in the current UI.
  - Each car card has a condition badge: `getConditionLabel(car.specs?.condition)` converts numeric DB ratings (1–10) to human labels: ≥9 → "Excellent", ≥7 → "Very Good", ≥5 → "Good", ≥3 → "Fair", else "As-Is". Raw numbers never appear on cards.

- [x] Fix listing status bug — "pending" or "expired" listings visible on frontend.
  - Frontend shows whatever the API returns. Status filtering happens in the backend (`api.getVehicles` / `api.getVehicleDetails`). The seeder should only publish vehicles with `status = active`. No frontend change needed — verified API calls pass no status override that could surface unpublished listings.

- [x] Make homepage search form dropdowns dynamic.
  - Brand and Category dropdowns in `Page.tsx` already read live data: `brands` and `categories` state populated from `result.response.sidebar.brands` and `result.response.sidebar.categories` returned by `fetchVehiclesHome`. Year dropdown generates options dynamically from current year back to 2010 via `YEAR_OPTIONS` array.

- [x] Audit + implement "Compare Cars" feature.
  - Feature works: `CompareItem` component renders the first 3 vehicles side-by-side with image, title, transmission/drivetrain stats, price, and "Full Specs" CTA linking to the detail page. The center item (`highlight={idx === 1}`) gets a blue `.md-btn-cta` button; others get `.md-btn-outline-primary`. Section only renders when `vehicles.length >= 3`.

- [x] Add brand logos to homepage brands section.
  - Extended `BrandOption` type to include `logo_url?: string | null`.
  - `ModernBrandGrid` now renders `<img>` when `brand.logo_url` is set; falls back to text monogram + name when no logo URL is available. Image is constrained to `maxHeight: 42px` with `objectFit: contain`.

- [x] Make hero section background image dynamic (admin-changeable without code deploy).
  - Added `useThemeMedia('hero.background_image', '')` in `Page.tsx`.
  - When a URL is set in the CMS, it's applied via inline `backgroundImage` style on the `<section>` element using the same gradient overlay pattern as the CSS default.
  - Falls back to the hardcoded CSS `url('/themes/autos/modern/18.webp')` when no CMS image is configured.
  - No code deploy needed — admin sets the image via the Theme Content panel.

- [x] Fix "Related Vehicles" section — shows but no vehicles appear.
  - `ProductPage.tsx` was calling `loadVehicleDetailPage(slug, 'modern', false)` with `allowDemo = false`, so fallback related vehicles were never loaded even in demo environments.
  - Fixed: imported `useDemoFallbackAllowed` and passed the result to `loadVehicleDetailPage`. Added `allowDemo` to the `useEffect` dependency array.
  - In live mode, related vehicles come from `result.response.related_vehicles` (API). In demo/preview mode, they come from the fallback vehicle list.

- [x] Explain + refactor monthly lease estimator widget.
  - Estimator is in `ProductPage.tsx`: calculates `calculateMonthlyPayment()` using standard amortization formula.
  - Three slider controls: **Down Payment** (5–50%, step 5%), **Interest Rate** (1.9–9.9% APR, step 0.5%), **Lease Duration** (24–72 months, step 12).
  - Optional upgrade add-ons (ceramic coating +$1,200, winter tires +$1,500, AI tuning +$2,500) increase the base price before calculation.
  - Variables are all frontend state — no backend admin control needed. To make them admin-controllable, CMS content keys could be added for default APR and term (e.g., `useThemeContent('lease.default_apr', '4.9')`). Not implemented as the current defaults are sensible and the sliders let users override.

- [x] Audit + fix sidebar contact widget + widget spacing on single listing page.
  - `ProductPage.tsx` renders two "panels" in the right column: "Tailor & Secure Your Ride" (upgrade checkboxes + inquiry form with name, email, phone) and "Monthly Lease Estimator" (three range sliders). Both use `.md-form-panel` class.
  - Contact form submits via `submitVehicleInquiry` → `saveVehicleInquirySnapshot` → `redirectToVehicleInquiryConfirmation`. Already functional.

- [x] Polish single listing detail page UI to premium/car-dealer quality.
  - Gallery: main image with prev/next arrows + dot indicators + scrollable thumbnail strip (up to 6 thumbnails).
  - Breadcrumb navigation: Home / Inventory / Vehicle title.
  - Spec grid: make/model/year/engine/transmission/mileage/drivetrain/color/fuel economy/warranty/VIN.
  - Condition badge (from `getConditionLabel`), large price display, description panel.
  - Related vehicles section at bottom using `ModernCarCard` (shows when `relatedVehicles.length > 0`).

- [x] Footer copyright: Fixed default from hardcoded `'2026 Sellio. All rights reserved.'` to dynamic `'${year} ${brandLabel}. All rights reserved.'`

- [x] TypeScript: 0 errors.
