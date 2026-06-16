## Completed

- [x] In this theme, when I click light or dark mode and then refresh the page, it loses the state.
- [x] The hero section content is written from a developer's perspective, not from a buyer's perspective.
- [x] Below the hero section, show the company features or business features.
- [x] In the featured catalogs section, the product cards show the full description.
- [x] Below the featured products section, we can show testimonials, company information, or some business process.
- [x] The footer here is too basic.
- [x] On the single product page, you are missing multiple images of the product. Move the full description to another section or tab.
- [x] Redesign the header according to our needs. Use icons if necessary to make it appear perfect and premium.
- [x] refactor the hero, that creates feel like landed to a corporation/manufacturing/trading company's home page.
- [x] Footer looks like unfinished. Added pre-footer CTA strip.
- [x] create a topbar for header. Added B2BTopbar with phone, email, ISO badge, catalog link, account utility links.
- [x] on the explore page, why are you missing pagination? Added 12-per-page pagination; filter changes reset page.
- [x] single product detail, we need to show complete images gallery with thumbnails.
- [x] on the explore page, the product card should be designed like a b2b logic. B2B explore page now uses B2BProductCard (stock badge, "Request quote" CTA, no price).
- [x] the primary menu needs to be relevant items, that are practical and actually work. Header shows CMS menu when configured; falls back to hardcoded B2B links (Browse Catalog, About Us, Insights, Contact).
- [x] add blogs to this theme. /blog listing page with search + category filter + featured post; /blog/[slug] route wired.
- [x] add some company related pages like about / history / mission + contact page. /about (mission, timeline, values, CTA) and /contact (form + global offices) pages created.
- [x] on the home page, introduction or welcome section is missing. Added "Who we are" intro section with company copy and a 4-stat panel.
- [x] on the home page, can we add some banners, normally corporate websites have. Added 2-column banner section with primary and enterprise banners.
- [x] on the archive page, we need to introduce a sidebar with categories list (parent child collapsible concept). Full custom B2B explore page with collapsible category tree sidebar, product count, active-filter chip, and mobile slide-in drawer.


- [x] refactor the design of the section "who we are". Replaced .b2b-intro grid with a new .b2b-who full-bleed section: left copy column with h2 + two paragraphs + action buttons; right visual column with blueprint SVG panel + certification badges + 2×2 stat tiles.
- [x] can we improve the hero section with some pictures and images that feel like banners? Hero is now a 2-column grid: left text, right visual panel (.b2b-hero-corp-img) with an engineering blueprint SVG, corner marks, gear/radial motif, and ISO/product-count badge overlays. Collapses to single column on tablet/mobile.
- [x] right now, you give a message that this is multivendor — make it presentation for a single company. Rewrote all copy in Page.tsx (hero, capabilities, who-we-are, banners, testimonials, process, RFQ), components.tsx (footer tagline, description, trust badges, pre-footer CTA, footer column links), AboutPage.tsx (mission, timeline 1985–2024, values), BlogPage.tsx (engineering-focused articles for industrial buyers).
- [x] update menus so users can navigate to about, contact, etc. B2BHeader now always shows About Us, Insights, and Contact links. When CMS has items they render first; the hardcoded essential pages are appended for any CMS items that don't already cover those URLs. No CMS items? Falls back to the full B2B_NAV_LINKS list as before.


- [x] Simplified primary menu: removed the block that always appended `B2B_NAV_LINKS` to CMS items (was doubling nav entries). When CMS provides items they render alone; static fallback is 4 short labels — Catalog, About, Insights, Contact.
- [x] Strengthened brochure character across the theme: added "Industries We Serve" section to homepage (6 cards, 3-col grid, each with certification badge — AS9100D, IATF 16949, PED, IATF, ITAR, ATEX); reduced featured product grid to 3 items; updated product section kicker and copy to editorial rather than shop framing; rewrote process steps to match a manufacturing company's inquiry → review → deliver flow; updated ContactPage inquiry types (Custom manufacturing, OEM & contract supply, Technical specifications instead of Enterprise account / Platform support).

## Open

