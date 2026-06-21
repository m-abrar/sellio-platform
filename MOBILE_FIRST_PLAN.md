# Mobile-First Conversion Plan — Sellio

## Current State Assessment

The dashboards were **responsive but desktop-first**: base styles targeted desktop layouts, with responsive overrides for smaller screens. The storefront has 50+ theme CSS files, each with their own responsive breakpoints already built in. The mobile app (React Native) is native and needs no changes.

**Scope**: 3 web apps — `buyer`, `seller`, `storefront`

**Out of scope**: `apps/mobile` (React Native), `apps/backend` (Laravel/AdminLTE admin panel)

---

## What Was Already In Place (Before This Sprint)

- **Buyer**: Viewport meta tag, Tailwind responsive prefixes (`sm:`, `md:`, `lg:`), sidebar with hamburger menu and backdrop overlay
- **Seller**: Complete mobile nav system — full-screen overlay menu (slide up from bottom), bottom nav bar with 5 items, desktop sidebar only shows at `lg:`
- **Storefront**: Each of the 50+ themes has its own `styles.css` with `@media` breakpoints (hamburger at 1024px, single-column grids at 768px)
- **Checkout CSS**: Already has `@media (max-width: 640px)` single-column gateway grid

---

## Phase 1 — Audit (Complete)

**Buyer audit findings:**
- No persistent bottom nav on mobile; users had to open sidebar for every nav action
- `MessagesView` height used `100vh` (doesn't account for mobile browser chrome or bottom nav)
- `SettingsView` had `p-8` padding — too large on 375px
- No PWA meta (`theme-color`, manifest, apple-mobile-web-app-capable)
- Input `font-size` < 16px would trigger iOS viewport zoom
- No `touch-action: manipulation` on interactive elements (300ms tap delay)

**Seller audit findings:**
- Google Maps picker missing `gestureHandling: 'cooperative'` — map would hijack page scroll on mobile
- `MessagesPage` height used `100vh` without accounting for bottom nav (85px)
- No `accept` attribute on MediaStudio file input
- No PWA meta
- Same CSS touch fixes needed as buyer

**Storefront audit findings:**
- `globals.css` missing touch improvements
- No `viewport-fit=cover` (safe area insets for notched phones)
- Listing images had no `loading="lazy"` attribute

---

## Phase 2 — Buyer Dashboard (Complete)

### 2.1 BottomNav component — `apps/buyer/src/components/BottomNav.tsx` (new file)
- Persistent mobile bottom navigation bar (`lg:hidden`)
- 5 items: Home, Saved, Messages, Bookings, Settings
- Badge counts from `StatsContext` (messages, favorites, bookings)
- Active state indicator with animated underline dot
- `safe-bottom` class for notch/home-bar clearance on iPhone X+

### 2.2 App.tsx — `apps/buyer/src/App.tsx`
- Imported and rendered `<BottomNav />` at root level
- Main content bottom padding: `pb-20 lg:pb-8` (clears the 64px bottom nav on mobile)

### 2.3 Global CSS — `apps/buyer/src/index.css`
- `touch-action: manipulation` on buttons/links (eliminates 300ms tap delay)
- `-webkit-overflow-scrolling: touch` on scrollable containers
- `@media (max-width: 768px)` input font-size: 16px (prevents iOS viewport zoom)
- `env(safe-area-inset-bottom)` via `.safe-bottom` utility class

### 2.4 MessagesView — `apps/buyer/src/views/MessagesView.tsx`
- Height: `h-[calc(100dvh-204px)] md:h-[calc(100dvh-140px)]`
  - `dvh` instead of `vh` (accounts for mobile browser address bar)
  - 204px on mobile = original 140px + 64px bottom nav
- Added `loading="lazy"` to conversation avatars and context sidebar listing image

### 2.5 SettingsView — `apps/buyer/src/views/SettingsView.tsx`
- Content panel: `p-4 sm:p-8` (was `p-8`)
- Submit buttons: `w-full sm:w-auto` (full-width on mobile)

### 2.6 ListingCard — `apps/buyer/src/components/ListingCard.tsx`
- Added `loading="lazy"` to listing card images

### 2.7 PWA meta — `apps/buyer/index.html`
- `viewport-fit=cover` in viewport meta
- `theme-color` meta tag (#7c5cfc)
- `mobile-web-app-capable`, `apple-mobile-web-app-capable`
- `<link rel="manifest">` pointing to manifest.json

### 2.8 Manifest — `apps/buyer/public/manifest.json` (new file)
- `display: standalone`, `start_url: /`, orientation: portrait-primary

---

## Phase 3 — Seller Dashboard (Complete)

### 3.1 Google Maps — `apps/seller/src/components/forms/GoogleMapPicker.tsx`
- Added `gestureHandling: 'cooperative'` to Google Maps init options
- Prevents map from hijacking page scroll on mobile (user must pinch-zoom or use two fingers)

### 3.2 MessagesPage — `apps/seller/src/pages/messages/MessagesPage.tsx`
- Height: `h-[calc(100dvh-205px)] md:h-[calc(100dvh-120px)]`
- 205px on mobile = original 120px + 85px bottom nav

### 3.3 MediaStudio — `apps/seller/src/components/studio/MediaStudio.tsx`
- Added `accept="image/*"` to file input (mobile shows image gallery, not all files)

### 3.4 Global CSS — `apps/seller/src/index.css`
- Same touch improvements as buyer (touch-action, iOS zoom fix, -webkit-overflow-scrolling)

### 3.5 PWA meta — `apps/seller/index.html`
- Same PWA meta additions as buyer (theme-color: #6610f2)
- `<link rel="manifest">` added

### 3.6 Manifest — `apps/seller/public/manifest.json` (new file)
- `start_url: /dashboard`, display: standalone

### 3.7 Listing pages — seller (7 files)
- Added `loading="lazy"` to listing images in:
  - PropertiesPage, AutosPage, EventsPage, ProductsPage, ServicesPage, JobsPage, ClassifiedsPage

---

## Phase 4 — Storefront (Complete)

### Discovery: Themes are already self-contained and responsive
Each of the 50+ theme `styles.css` files already have:
- Hamburger menu shown at 1024px breakpoint
- Off-canvas slide-in navigation drawer
- Single-column grids at 768px
- Reduced padding on mobile
- Detail page responsive stacking

### 4.1 Global CSS — `apps/storefront/src/app/globals.css`
- `touch-action: manipulation` on buttons/links
- `@media (max-width: 768px)` input font-size: `max(16px, 1em)`
- `.safe-bottom` utility class

### 4.2 Viewport — `apps/storefront/src/app/layout.tsx`
- Added `export const viewport: Viewport` with:
  - `viewportFit: 'cover'` (safe area insets)
  - `themeColor: '#ffffff'`

### 4.3 Lazy loading — 11 theme files
Added `loading="lazy"` to listing/product images in:
- `unifieds/default/ExplorePage.tsx` + `Page.tsx`
- `unifieds/minimal/ExplorePage.tsx` + `Page.tsx`
- `unifieds/marketplace/ExplorePage.tsx` + `Page.tsx`
- `autos/electric/ProductPage.tsx`
- `classifieds/premium/ProductPage.tsx`
- `classifieds/general/ProductPage.tsx`
- `properties/modern/components/ExplorePropertyGrid.tsx`
- `properties/rental/components/explore/ExplorePropertyGrid.tsx`

---

## What Remains (Future Work)

### Testing (manual, no code change)
Test each app at:
- 375px — iPhone SE
- 390px — iPhone 14
- 768px — iPad
- 1024px — desktop breakpoint

Test gestures: tap, swipe, pinch-zoom (enable for maps).

### Lighthouse audit
Run Lighthouse mobile profile on each app, target ≥80 Performance score.

### Potential future improvements
- Seller: Pull-to-refresh on listing tables (requires JS touch event handling)
- Storefront: Consider `<Image>` from Next.js instead of raw `<img>` for automatic optimization
- Buyer: Service worker for offline support on the buyer dashboard
- All: Add `sizes` attribute to lazy-loaded images for responsive image delivery

---

## Progress Summary

| Phase | Status |
|---|---|
| Phase 1: Audit | ✅ Complete |
| Phase 2: Buyer dashboard | ✅ Complete |
| Phase 3: Seller dashboard | ✅ Complete |
| Phase 4: Storefront | ✅ Complete |
| Phase 5: Cross-cutting (lazy images, touch, PWA) | ✅ Complete |
| Testing + Lighthouse | ⏳ Manual step |
