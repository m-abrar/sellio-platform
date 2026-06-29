## Completed

- [x] Removed internal/protocol language from hero, badge, stats, collection, offline, empty, and CTA copy (see `THEME_FINALIZATION_PRIORITY_2026-06-12.md` → `unifieds_default` for the full list of replaced strings).
- [x] Fixed hardcoded stats labels (`LIVE LISTINGS`, `ACTIVE CATEGORIES`, `IN STOCK NOW` → sentence case).
- [x] Fixed product fallback description to plain buyer-facing copy.
- [x] `CoreFeatures`: removed `onClick={() => alert(...)}` from all three feature cards; replaced dev-speak features with real buyer-facing features; fixed kicker copy.
- [x] `GlobalTrust` bar: replaced protocol-style labels with plain trust signals (Secure Payments, Verified Sellers, Fast Delivery, Multi-Vertical Platform).
- [x] `InstitutionalFooter`: logo linked to homepage via `useUnifiedThemeLink`; description and copyright cleaned.
- [x] ThemeSeeder `unifieds_default` section updated to match all cleaned code defaults.
- [x] Verified `npm.cmd run lint` (0 errors), `/preview/unifieds_default` HTTP 200.

### 2026-06-16 rescan + multi-vertical pass

A rescan found the 2026-06-13 pass only touched `Page.tsx` and part of `components/index.tsx`; `ExplorePage.tsx`, `ProductPage.tsx`, and `CartPage.tsx` still had the original dev-speak/protocol copy, and the theme only ever loaded the `products` vertical despite being the unified/fallback theme. Fixed:

- [x] Header/footer brand: replaced hardcoded `CORE`+`ORIGIN` text with `useThemeContent('site_name', 'Sellio')` (matches the pattern already used by `unifieds_marketplace`), so the brand is admin-editable instead of a leftover internal codename.
- [x] `Page.tsx` hero default title: `'The Core of\nDistribution.'` → `'Everything you need,\nall in one place.'`; highlight updated to match.
- [x] `Page.tsx` hero image alt text: `"Analytics Core Dashboard"` → `"Marketplace listings preview"`.
- [x] `components/index.tsx` `CoreFeatures` heading: `Engineered for Scaling.` → `Built for buyers and sellers.`
- [x] `CartPage.tsx`: `CORE_CART` → `Your cart`; `EMPTY_CART` → `Empty cart`; empty-state copy no longer says "catalog records".
- [x] Added `themes/unifieds/default/multiVertical.ts`: fetches and normalizes listings/detail data across all 7 verticals (products, properties, autos, services, jobs, events, classifieds), modeled on the working pattern already proven in `unifieds_marketplace`.
- [x] `ExplorePage.tsx` rewritten to load and filter listings across all 7 verticals (not just products), with vertical filter chips, while fixing every leftover dev-speak string (`CORE_DIRECTORY`, `Explore Catalog Records`, "synchronized from the Sellio core registry", `records indexed`, `Default Registry`, `Loading records...`, `EMPTY_RESULTS`, `Back to core feed`, `View Record`).
- [x] `ProductPage.tsx` rewritten to accept a `vertical` prop (matching the route contract from `MarketplaceDetailRoute`/`/products`, `/properties`, `/autos`, `/services`, `/jobs`, `/events`, `/classifieds`) and render any vertical's detail via `multiVertical.ts`, fixing `RECORD_UNAVAILABLE`, `Back to Core Feed`, `Live catalog record`, the `Record` spec label, `ADDING RECORD`, and `RELATED_REGISTRY`. The old products-only "related listings" section was dropped rather than ported, since making it vertical-aware wasn't worth the added complexity for a "more like this" strip.
- [x] `Page.tsx` homepage "Featured Listings" section now pulls a mixed sample across all 7 verticals instead of products only; the third stat card (`In stock now`, which didn't apply to non-product verticals) was replaced with `Marketplace verticals` (count of verticals = 7).
- [x] Added `.ud-explore-verticals` / `.ud-explore-vertical-chip` styles to `styles.css` for the new vertical filter chips.
- [x] Synced `ThemeSeeder`'s `unifieds_default` section (hero title/highlight, empty-state description) with the new code defaults, then re-ran `php artisan db:seed --class=ThemeSeeder` so the local DB's theme content rows (which still had stale text from before *any* polish pass) actually reflect the new copy.
- [x] Verified `npm.cmd run lint` (0 errors), `npx tsc --noEmit` (0 errors), and `/`, `/explore`, `/product/[slug]`, `/properties/[slug]` all return HTTP 200 with the new copy and no leftover dev-speak strings.

### 2026-06-16 footer fix + switcher delay

- [x] Diagnosed "footer is unbalanced and unfinished": `database/seeders/data/theme_menus/unifieds.php` had all 3 `unifieds_default` footer columns (`RESOURCES`/`PRODUCTS`/`COMPANY`) sharing the exact same dev-speak link set (`Registry System`, `Features Node`, `Analytics Hub`, `Secure Protocol`), all pointing to dead `#` anchors, plus a social row using `tm_social_os()` (`INSTAGRAM`, `LINKEDIN`, `X_OS`).
- [x] Replaced with 3 distinct, real columns: `Company` (About `/about`, Blog `/blog`, Contact `/contact`), `Marketplace` (Explore listings `/explore`, Your cart `/cart`, Checkout `/checkout`), `Support` (Terms of service, Privacy policy, Cookie policy); switched social row to `tm_social_standard()` (Instagram/LinkedIn/Twitter).
- [x] Re-ran `php artisan db:seed --class=MenuSeeder` and `--class=MenuItemSeeder`, then `php artisan cache:clear` (menu structure is cached with `Cache::rememberForever` in `MenuService.php`, so the reseed wasn't visible until the cache was cleared). Verified the new footer copy renders on `/` and the old duplicated dev-speak links are gone.

### 2026-06-16 header/footer premium polish

- [x] Root cause of the "too basic" header: the CTA button used class `ud-btn-primary`, which was never defined anywhere in `styles.css` (only `core-btn-primary` exists) — the header button had been rendering with zero styling (browser-default button) the whole time. Fixed the class name to `core-btn-primary ud-btn-header` and added a compact `.ud-btn-header` modifier.
- [x] Logo: replaced the plain text wordmark with a logo mark (gradient icon square with the site's first initial + wordmark), using `.ud-logo-mark` / `.ud-logo-icon` / `.ud-logo-text`.
- [x] Header bar: added a soft elevation shadow (`box-shadow`) on top of the existing blur/border for more depth.
- [x] Nav links: added icon support (cart items now show a cart icon) and fixed `.ud-nav-link` to lay out icon + label with `inline-flex`.
- [x] Header CTA: added a trailing arrow icon for a more deliberate, premium call-to-action feel.
- [x] Mobile nav drawer: added a `.ud-nav-backdrop` dimmed overlay behind the drawer (click to close) — previously the drawer had no backdrop at all.
- [x] Same root-cause bug existed in the footer: `.ud-footer-bottom`, `.ud-footer-socials`, and `.ud-footer-link-group` were all referenced in JSX but never defined in `styles.css` (only mobile-only overrides existed for the first two, and the link list relied on un-reset `<ul>` defaults — meaning default browser bullet points on a dark footer). Added real base styles for all three.
- [x] "Move the copyright to a separate row": `.ud-footer-bottom` now stacks as its own column with a top divider and clear spacing — the social row sits above the copyright line as a distinct row instead of both being unstyled, undifferentiated block elements.
- [x] "Can we show social media icons": social footer links (Instagram/LinkedIn/Twitter) now render real SVG icons in circular buttons (`.ud-footer-social-link`) instead of plain text labels.
- [x] Copyright line now uses the dynamic `site_name` and current year instead of a hardcoded "© 2026 Sellio".
- [x] Verified `npm.cmd run lint` (0 errors), `npx tsc --noEmit` (0 errors), and `/` HTTP 200 with the new logo mark, header button styling, arrow icon, and footer social icons all present in the rendered HTML.

### 2026-06-16 listing interaction forms (jobs / autos / services / classifieds)

Scoping discussion confirmed: implement inquiry/apply for jobs, autos, services, classifieds now (all of this already had working, reusable infra elsewhere in the codebase); defer properties/events booking (needs a brand-new `BookingReservePage` subpage — no shared form exists, bigger lift) and live chat (zero frontend, no realtime transport wired anywhere in the repo) to separate follow-ups.

- [x] Extended `multiVertical.ts`'s `VerticalDetail` to carry the raw `vehicle`/`job`/`service`/`classified` records (alongside the existing `product`) so the detail page can call the real per-vertical submit APIs.
- [x] Added `themes/unifieds/default/InteractionForms.tsx` with four inline forms: `JobApplyForm` (reuses `useJobApplyFlow` from `themes/jobs/shared`, including its auth-gate UI), `VehicleInquiryForm` (calls `submitVehicleInquiry`), `ServiceConsultationForm` (calls `submitServiceConsultation`), `ClassifiedInquiryForm` (calls `submitClassifiedInquiry`) — all reusing existing, already-proven submit functions rather than hitting the API client directly.
- [x] `ProductPage.tsx` now renders the matching form per vertical instead of a generic "Browse properties/autos/services/jobs/classifieds" link; properties/events keep the generic link for now (booking deferred).
- [x] Added 3 new shared, theme-reusable confirmation pages (matching the existing `UnifiedCheckoutConfirmationPage` pattern): `UnifiedInquiryConfirmationPage` (shared by autos + classifieds, since both route through `/inquiry/confirmation/[id]`), `UnifiedApplicationConfirmationPage` (jobs, `/application/confirmation/[id]`), `UnifiedConsultationConfirmationPage` (services, `/consultation/confirmation/[id]`), plus matching sessionStorage snapshot utils (`inquiry-confirmation.ts`, `application-confirmation.ts`, `consultation-confirmation.ts`). Exported all 3 from `unifieds_default/index.ts`. Before this, these routes would have silently fallen back to another vertical's theme (`classifieds/local`, `jobs/modern`, `services/marketplace` per `lib/theme-pages.ts`'s global fallbacks) — not broken, but a jarring visual theme-switch on confirmation.
- [x] Added `.ud-inquiry-form` and related CSS (label/input/textarea/error/auth-toggle) to `styles.css`, matching the existing `--ud-azure`/`--ud-card`/`--ud-border` design tokens.
- [x] Verified `npm.cmd run lint` (0 errors) and `npx tsc --noEmit` (0 errors).
- [x] Browser-verified end-to-end with Playwright: filled and submitted the vehicle inquiry form on a real listing → real backend record created → redirected to `/inquiry/confirmation/181` → confirmation page rendered correctly inside the unifieds_default shell with the right listing title and reference number. Also confirmed the jobs detail page correctly shows the sign-in gate when logged out. Zero console/network errors in both flows.

## Open

- [x] Properties/events booking: needs a new `BookingReservePage` subpage (date/time picker, payment confirmation).
  - Added `property?: Property` and `event?: EventListing` fields to `VerticalDetail` in `multiVertical.ts`; `propertyToDetail()` and `eventToDetail()` now populate them.
  - Added `PropertyBookingForm` to `InteractionForms.tsx`: check-in/check-out date inputs + guests + name/email, redirects to `/booking/reserve?property_id=...`.
  - Added `EventBookingForm` to `InteractionForms.tsx`: reads `event.ticket_data` for first occurrence + ticket type, shows quantity + name/email, redirects to `/booking/reserve?event_id=...`. Falls back to "Browse events" link when no ticket data is available.
  - `ProductPage.tsx` now renders `PropertyBookingForm` / `EventBookingForm` instead of the generic "Browse" link for those verticals.
  - Created `unifieds/default/BookingReservePage.tsx`: detects `event_id` param to delegate to `EventBookingReservePage`, otherwise delegates to `PropertyBookingReservePage`.
  - Exported `BookingReservePage` from `unifieds/default/index.ts`.
  - Added `BookingReservePage`, `BookingPage`, `BookingConfirmationPage`, `BookingConfirmPage` to the `unifieds` vertical fallback in `theme-pages.ts`.
  - TypeScript: 0 errors.
- [x] Live chat: `LiveChatWidget` component added to `unifieds/default` product pages; auth-gated (inline login/register), opens/finds conversation via new `POST /dashboard/user/messages/start` backend endpoint (maps vertical+listing_id to partner user_id via model lookup), loads thread, sends messages, polls every 5 s for updates. Shown below the primary interaction form for all verticals except `products`. CSS classes `ud-chat-*`. Real-time push deferred for storefront (Echo / Next.js runtime not yet wired); polling covers the gap.

### 2026-06-29 UI polish pass

**Laravel auth (backend)**
- [x] Login screen: removed `fw-800` faux-bold from the DM Serif Display heading on the dark marketing panel (font only ships at weight 400).
- [x] Login screen: reversed the `.auth-split-marketing .text-gradient` direction — was `white → orange` (bleached out start on dark bg); now `orange → white` for a proper warm-lift effect.

**Hero section**
- [x] Remove the border/outline around the 4-card group on the right column — removed the `0 0 0 1px rgba(255,255,255,0.07)` inset ring from `.ud-hero-mosaic` box-shadow.
- [x] Fix z-index issue on the live listings count — added `z-index: 2` to `.ud-floating-badge` so it always sits above the mosaic (`z-index: 1`).
- [x] Replace the smart search icon — swapped the generic 5-pointed star polygon for a 4-pointed diamond sparkle + secondary sparkle + accent dot (the modern AI-feature icon language used by Gemini/Copilot/Apple Intelligence).
- [x] Smart search sparkle icon was reused in 4 places — replaced: tab keeps sparkle (identity), input prefix → wand icon, submit button → arrow icon, hint line → icon removed.
- [x] Redesign all search forms — replaced the flat white SaaS card with a dark glass panel (backdrop-filter blur, `rgba(8,14,31,0.88)`); inputs and filter selects converted to white-on-dark glass fields; submit button upgraded to gradient blue with glow; all AI panel sub-elements (thinking panel, summary, chips, hint) adapted to dark glass; active tab now seamlessly merges with card.
- [x] Events search filter: replaced the native `<input type="date">` with a custom dark-glass datepicker — month navigation, dimmed past days, today highlighted, `position: fixed` to escape the hero's `overflow: hidden`.

**Hero — deep AI-template patterns (2026-06-29 audit)**
- [x] **Background grid overlay** — removed `.origin-hero::before` (72×72px white line grid). Hero background now shows only the existing radial gradients — clean, deep, no template noise.
- [x] **Eyebrow badge** — replaced generic blue pill + monospace "MULTI-VERTICAL MARKETPLACE" with a loose row of 4 concrete vertical chips (Properties · Autos · Jobs · Events) + "+3 more". No pill, no glowing dot, no monospace.
- [x] **Floating badge** — replaced monospace "LIVE" + isolated huge number + monospace "LIVE LISTINGS" with a premium data widget: left azure accent stripe, clean "Live now" label in body font, `214+` with superscript plus, "active listings" in muted body text, separator, and 3 sub-chips (Properties · Autos · +5 more).
- [ ] **Header navigation labels** ("Registry / Features / Analytics / Enterprise") — B2B SaaS labels with no relevance to a consumer/seller marketplace. Replace with marketplace-appropriate nav: Browse, Sell, How it Works, and one more relevant item (Pricing, Blog, etc.).
- [ ] **Mosaic listing cards** — the 4 image cards in the right column are pure image crops with zero listing context. Add subtle category/type badge overlays (e.g. "Property", "Autos", bottom-left chip) so they read as real marketplace listings rather than stock-photo placeholders. On hover, a micro listing title + price could surface.

**Browse Categories section**
- [ ] Full redesign to premium UIUX — current layout reads as a dated AI-generated template.

**Properties section**
- [ ] Audit the For Sale / For Rent badge — verify it reflects the listing's actual `listing_type` value.
- [ ] Elevate the section to premium UIUX — card design, typography hierarchy, and spacing all feel too basic.

**Careers + Top Deals dual-column row**
- [ ] Both sections sit side-by-side in a single row but look unfinished — mismatched heights, unbalanced proportions. Redesign as a cohesive paired layout with equal dimensions and an aesthetic, premium feel.

**Popular Categories section**
- [ ] Wire up real data — currently appears to use static/placeholder content; fetch live category data from the API.
- [ ] Add icons per category and any supporting detail (listing count, etc.) to lift it from placeholder to a premium, finished design.

**Simple Process section**
- [ ] Current design reads as a generic AI-generated "how it works" template. Redesign from scratch — handcrafted, visually interesting, and unique. Should feel considered and premium, not boilerplate.

**Why Choose Us section**
- [ ] Current design reads as a generic AI-generated feature grid. Redesign from scratch — handcrafted, visually interesting, and unique. Should feel considered and premium, not boilerplate.

**CTA — Sell on the Marketplace**
- [ ] Audit for AI-generated / generic design patterns. Redesign as a handcrafted, excellent CTA — compelling, visually distinctive, and conversion-focused.

 Eyebrow badge ("MULTI-VERTICAL MARKETPLACE") — monospace pill + glowing dot + all-caps = textbook AI-template eyebrow. Replace with something considered (vertical chips, trust signal line, or distinctive kicker).
 Floating badge ("LIVE • 214 • LIVE LISTINGS") — plain dark rectangle with dev-speak monospace label. Redesign as a premium data widget with richer typography and intentional layout.
 Header nav labels ("Registry / Features / Analytics / Enterprise") — B2B SaaS labels. Replace with marketplace-appropriate nav (Browse, Sell, How it Works, etc.).
 Mosaic listing cards — pure image crops with no listing context. Add subtle category/type badge overlays so they read as real marketplace listings, not stock-photo placeholders.