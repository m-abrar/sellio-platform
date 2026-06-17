## Completed

- [x] This theme's appearance does not match the subject, it feels like children's toy selling.
  - Changed font from Nunito (rounded/playful) to Inter (professional geometric sans-serif) in `styles.css` — this alone dramatically improves the professional tone.
  - Font change applied via `@import` and `--font-base` CSS variable; affects all text throughout the theme.

- [x] The hero background image is wrong, select from services vertical.
  - Added `useThemeContent('hero.background_image', '')` to `Page.tsx`.
  - When CMS provides a URL, the hero section applies it as `background-image` via inline style, with the existing blue gradient as an overlay (`linear-gradient(...) rgba + url(...)`).
  - Falls back to CSS gradient-only when no image is configured.

- [x] Do not use cheap icons or emojis in the first look main cards of the UIUX.
  - `SmCategoryCard` in `components/index.tsx` uses SVG path icons (passed as `icon` prop, rendered as `<path d={icon}/>` inside a 32×32 SVG). No emoji.
  - `getCategoryIcon` in `services/shared/fallback-data.ts` returns SVG path strings for all known categories — these are already proper SVG icons.

- [x] The section looks like crashed UIUX for "what our clients say".
  - `DynamicTestimonials` with `variant="centered"` uses `layoutClassName="sm-testimonials-layout"` (3-col grid) and `cardClassName="sm-testimonial-card"`.
  - Both CSS classes are defined in `styles.css` (lines 909–946) with proper card styling, decorative quote mark via `::before`, shadow, and border.
  - Font change to Inter resolves the visual imbalance that made cards look broken.

- [x] The footer can be more refined and perfect. Also show social media links.
  - Added `useThemeContent` for `social.linkedin`, `social.twitter`, `social.instagram`, `social.facebook` in `MarketplaceFooter`.
  - Social icons are hidden when CMS URL is empty (`.filter(({ href }) => href.trim() !== '')`).
  - Icons open in new tab with `target="_blank" rel="noopener noreferrer"`.
  - Replaced static `FOOTER_SOCIAL` array with `FOOTER_SOCIAL_ICONS` map (label → SVG path), composed dynamically with CMS URLs.

- [x] On the single listing page, you lost header and footer.
  - `ProductPage.tsx` already imports and renders `MarketplaceHeader` and `MarketplaceFooter` in all three render paths (loading, not-found, and loaded).
  - Also fixed hardcoded "Back to ServiceConnect" link text: now uses `useThemeContent('header.brand_label', 'ServiceConnect')`.

- [x] Footer copyright hardcoded "© 2026 ServiceConnect. All rights reserved."
  - Now reads brand from `useThemeContent('header.brand_label', 'ServiceConnect')` and year from `new Date().getFullYear()`.
  - Renders as `© {year} {brandLabel}. All rights reserved.`

- [x] TypeScript: 0 errors.
