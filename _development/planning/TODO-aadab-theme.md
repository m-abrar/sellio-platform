# ecommerce_b2b Theme — TODO

Theme for Aadab International (aadab.biz) — orthopedic surgical instrument manufacturer & exporter, Sialkot, Pakistan.

---

## Home Page (`Page.tsx`)

- [ ] **Hero slider** — currently shows static images from `/assets/home-slider-*.webp`; wire up to CMS or replace with real aadab.biz hero photography
- [ ] **Hero stats bar** — product count is pulled live from the API; add category count and export destinations count as static values
- [ ] **Featured Products** — currently hardcoded with 6 Bone Rongeur SKUs; make the product list editable via theme content / admin (or expand to more categories)
- [ ] **Featured Products CTA** — "Enquire" links use `themeLink('/explore')`; link to individual product pages once catalog is synced
- [ ] **Category grid** — images for 4 categories are `null` (no CDN photo available); source or photograph: Gouges, Orthopedic Pins & Wires, Bone Saws & Oscillating Blades, Osteotomes
- [ ] **Exhibition banner** — `exhibitionNews` data is hardcoded; consider wiring to a CMS content key so it can be updated without a deploy
- [ ] **Factory visit section** — "Book a visit" CTA links to `/contact`; consider a dedicated tour/visit enquiry form

---

## Explore / Catalog Page (`ExplorePage.tsx`)

- [ ] Sync full 27-category aadab.biz catalog to Sellio admin (products + categories)
- [ ] Category sidebar filter — currently shows API categories; verify tree structure matches aadab.biz hierarchy
- [ ] Add category banner images to the sidebar filter (currently text-only)
- [ ] Default sort order — confirm "Newest first" is appropriate or switch to "Name A–Z" for an instrument catalog

---

## Product Page (`ProductPage.tsx`)

- [ ] Product image gallery — supports multiple images via `activeImage` state; ensure multi-image upload is used in admin for key SKUs
- [ ] "Request Quote" tab (`rfq` tab) — form is UI-only (`setNotice(true)` on submit); wire to backend quote endpoint or contact form
- [ ] Specifications tab — currently shows raw product attributes; format as a proper spec table (finish, steel grade, size, sterility)
- [ ] Related products section — not yet implemented; add 3–4 related SKUs from the same category

---

## Quote Page (`QuotePage.tsx`)

- [ ] Form is frontend-only (`setSubmitted(true)` on submit) — wire to backend contact/quote endpoint
- [ ] Add file upload field for instrument drawings / reference photos
- [ ] Pre-fill instrument list if user navigates from a product page

---

## Contact Page (`ContactPage.tsx`)

- [ ] Form is frontend-only (`setSubmitted(true)` on submit) — wire to backend
- [ ] Add Google Maps embed or static map image for Sialkot factory location
- [ ] Add LinkedIn / social links once aadab.biz social profiles are confirmed

---

## About Page (`AboutPage.tsx`)

- [ ] Replace placeholder process steps copy with finalized aadab.biz approved text
- [ ] Add real team/facility photography to the values or process section
- [ ] "Our story" section — currently using generic copy; add founding year context (Est. 1942)

---

## Blog / Resources Page (`BlogPage.tsx`)

- [ ] Blog posts are hardcoded static data; wire to Sellio CMS blog posts once content is published
- [ ] Add real author photo / bio for "Aadab International" posts
- [ ] Confirm slug routing works end-to-end with the blog detail page

---

## Components & Layout

- [ ] **Topbar WhatsApp number** (`components.tsx`) — `+92 330 481 9191` is hardcoded; move to theme content key
- [ ] **Footer copyright** — year is dynamic but brand name is hardcoded fallback; verify CMS key is set in admin
- [ ] **Mobile nav** — test hamburger menu on iOS Safari and Android Chrome
- [ ] **Header logo** — `aadab-logo.webp`; confirm final approved logo file is in place

---

## Assets

- [ ] Delete `apps/storefront/public/aadab/` — temporary folder created during image localisation; move images to a proper CDN or permanent asset pipeline before deleting
- [ ] `banner-exhibition.webp` — update before/after WHX Dubai 2026 (June 2026)
- [ ] `surgical-instrument-workshop.jpg` — used in factory visit section; confirm usage rights
- [ ] Source or commission hero photography to replace the current slider images

---

## Performance & SEO

- [ ] Add `<meta>` descriptions and Open Graph tags per page (currently using theme defaults)
- [ ] Lazy-load category grid images (27 images load on page mount)
- [ ] Compress `home-slider-*.webp` assets — check file sizes
- [ ] Add `alt` text review pass across all hardcoded images

---

## Done

- [x] Replace hardcoded 6-item category grid with real 27 aadab.biz categories
- [x] Increase category grid to 6 columns (27 items = 5 rows)
- [x] Build static Featured Products section (6 Bone Rongeurs with real CDN images)
- [x] Remove duplicate API-driven featured items section (`b2b-collection`)
- [x] Fix featured product card image cropping (`object-fit: contain`)
- [x] White background on featured product image containers
- [x] Redesign topbar (dark background, WhatsApp link, RFQ pill, full-width)
- [x] Polish exhibition banner (gradient background, grid overlay, pulsing dot, frosted CTA button)













The very last cta, what is this content about? Does it match our business model?
Send your orthopedic instrument list.
We will review the pattern, quantity, finish, marking, packing, and export details before quoting.



on the footer, please replace with this
We focus on meticulous craftsmanship, delivering our products that expertly blend the intricate structures of bones, biomechanical properties, and precision engineering.


replace the hero images with these
https://aadab.biz/wp-content/uploads/2024/10/aadab-international-section-01.webp
https://aadab.biz/wp-content/uploads/2024/10/aadab-international-section-02.webp



Download any 3rd party images to local storage


The advertisement banner design looks like a generic ai generated design, please fix it according to our theme.


the product cards and category cards are too basic and simple desings, please polish them.


anything in this theme, the layout UIUX, which looks like ai generated template, should be updated.