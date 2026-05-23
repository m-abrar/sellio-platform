# Dynamic Theme Conversion Status Report

This report documents the status of dynamic conversion across the Sellio storefront monorepo. It details which templates, layouts, and components have been successfully migrated from static mock markup to live, stateful React components integrated with the Laravel API database.

---

## 📊 Summary of Converted Themes

Out of the available industry verticals in the codebase, **fifteen themes** have been converted to fully dynamic templates:

| Vertical | Theme Key / Directory | Conversion Status | Dynamic Views Implemented |
| :--- | :--- | :--- | :--- |
| **Autos** | `autos_luxury` (`autos/luxury`) | **100% Dynamic** | Homepage Showroom, Explore Catalog, Product details |
| **Autos** | `autos_modern` (`autos/modern`) | **100% Dynamic** | Showroom Homepage, Faceted Catalog Explore, Product Single Details & Specs |
| **Jobs** | `jobs_startup` (`jobs/startup`) | **100% Dynamic** | Homepage Showcase, Explore Console, Product Job details |
| **Properties** | `properties_classic` (`properties/classic`) | **100% Dynamic** | Homepage, Explore Page, Product details, Cart Page |
| **Properties** | `properties_luxury` (`properties/luxury`) | **100% Dynamic** | Homepage Curated Showcase, Explore Ledger, Product Provenance details |
| **Services** | `services_marketplace` (`services/marketplace`) | **100% Dynamic** | Homepage Directory, Faceted Filters, Bookings Modal |
| **Events** | `events_corporate` (`events/corporate`) | **100% Dynamic** | Homepage Summit Showcase, Explore Finder Console, Ticket Reservation Product Page |
| **E-commerce** | `ecommerce_electronics` (`ecommerce/electronics`) | **100% Dynamic** | Homepage Hardware Showroom, Product details page |
| **E-commerce** | `ecommerce_fashion` (`ecommerce/fashion`) | **100% Dynamic** | Homepage Lookbook capsule, Product details, Bespoke measurement request form |
| **Unified** | `unifieds_minimal` (`unifieds/minimal`) | **100% Dynamic** | Homepage, Explore Page, Product details |
| **Classifieds** | `classifieds_deals` (`classifieds/deals`) | **100% Dynamic** | Homepage Flash Feed, Product Single Bargain details |
| **Classifieds** | `classifieds_modern` (`classifieds/modern`) | **100% Dynamic** | Homepage catalog grid, dynamic category pills, dynamic Product Details & Booking drawer |
| **Classifieds** | `classifieds_elite` (`classifieds/elite`) | **100% Dynamic Listings** | Homepage dynamic grid & featured spotlight acquisitions carousel |
| **Classifieds** | `classifieds_premium` (`classifieds/premium`) | **100% Dynamic Listings** | Homepage dynamic catalog grid, categories selection dropdown, location & price range filters |
| **Classifieds** | `classifieds_general` (`classifieds/general`) | **100% Dynamic** | Homepage listings grid, category select dropdown sidebar, pickup/delivery filters, and Product details page |
| **Classifieds** | `classifieds_local` (`classifieds/local`) | **100% Dynamic** | Homepage listings grid, category ribbon, radius picker map pins, and Product details page |

All other themes within `autos` (except `autos_luxury` and `autos_modern`), `classifieds` (except `classifieds_deals`, `classifieds_modern`, `classifieds_elite`, `classifieds_premium`, `classifieds_general`, and `classifieds_local`), and remaining sub-themes of `properties` are currently **static prototypes** containing hardcoded mockup variables.

---

## 🛠 Detailed Breakdown of Converted Views

### 1. Autos Modern Theme (`autos_modern`)
The athletic, high-tech dark and electric-blue storefront vertical is fully dynamic:
* **Showroom Homepage (`Page.tsx`)**:
  - Dynamically fetches available vehicle listings on mount (`api.getVehicles({ per_page: 6 })`).
  - Populates brand and category selects dynamically from the API sidebar response metadata.
  - Links filter states to a search router that redirects users cleanly to `/explore` with active parameters appended.
  - Implements head-to-head model comparisons and beautiful Poppins-styled pulse loading skeletons.
* **Faceted Explore Console (`ExplorePage.tsx`)**:
  - Advanced search console synchronizing Keywords, Brand, Category, Location, Price ranges, and Year ranges with Next.js router query parameters.
  - Supports dynamic infinite "Load More" pagination appending catalog records statefully.
* **Product Details & Calculator (`ProductPage.tsx`)**:
  - Retrieves detailed vehicle spec sheets by URL slug (`api.getVehicleDetails(slug)`).
  - Renders a specification dashboard (make, model, year, transmission, engine, drivetrain, mileage, and warranty).
  - Integrates an interactive "Secure Your Ride" booking drawer that collects customer details and premium upgrades (e.g. *Premium Ceramic Coating*, *Winter Tires Pack*, *AI Performance Tuning*), persisting orders to `LocalStorage` under `sellio_autos_modern_orders`.
  - Implements a high-precision monthly lease calculator adjusting values based on selected customizations, down payment ratio, and APR interest.

### 2. Properties Luxury Theme (`properties_luxury`)
The Platinum Estate elite edition now features a fully cohesive live-database workflow:
* **Homepage Curated Showcase (`components/EstateShowcase.tsx`)**:
  - Stateful Client component loading dynamic residences on mount (`api.getProperties({ per_page: 6 })`).
  - Sleek pointer hover zooms, fleur-de-lis specifications, and deep navigation to detail paths.
* **The Exploration Ledger (`ExplorePage.tsx`)**:
  - Synchronizes dynamic filtering criteria (Bedroom count, HSL categories, locations, price brackets, and search terms) directly with browser search parameters (`?q=...&loc=...`).
  - Scoped horizontal filter bar with thin gold outlines and Montserrat typography.
  - Centered stateful "Load More Assets" dynamic pagination.
* **Manorial Provenance Details (`ProductPage.tsx`)**:
  - Pulls listing-specific provenance accounts by URL slug (`api.getPropertyDetails(slug)`).
  - Floating acquisition valuation badges and custom image zoom galleries.
  - Sticky reserving Inquiry Desk with localized heritage catalog collectors (`localStorage`).
  - Dynamic daily lodging seasonal rate estimator querying `api.calculateLodgingPrice()`.

### 3. Properties Classic Theme (`properties_classic`)
The Classic sovereign heritage vertical contains the complete standard dynamic catalog:
* **Homepage View (`Page.tsx`)**: Queries top listings dynamically, maps amenities, and links directly to products.
* **Search Directory (`ExplorePage.tsx`)**: Complete listing directory with dynamic search and sorting filters.
* **Single Product Details (`ProductPage.tsx`)**: Dynamic parallax hero backdrop details page with date rate calculators.
* **Registry Inquiry Desk (`CartPage.tsx`)**: Captures collected heritage listings stored in local storage and manages bulk inquiry dispatches.

### 4. Unifieds Minimal Theme (`unifieds_minimal`)
The streamlined, minimal generic theme operates dynamically for quick deployments:
* **Homepage View (`Page.tsx`)**: Renders clean product collections.
* **Catalogue Search (`ExplorePage.tsx`)**: Simple grid lists supporting keyword queries.
* **Product Details (`ProductPage.tsx`)**: Basic checkout structures and asset spec breakdowns.

### 5. Autos Luxury Theme (`autos_luxury`)
The Elite Showroom edition operates fully dynamically with live-database assets:
* **Showroom Showcase (`Page.tsx`)**: Queries top luxury vehicle assets on mount (`api.getVehicles({ per_page: 6 })`) with sleek redirects.
* **Explore Catalog Showcase (`ExplorePage.tsx`)**: Multi-faceted filter system (brand, categories, locations, price tiers, and keyword inputs) fully synced to Next.js query parameters.
* **Product Provenance Page (`ProductPage.tsx`)**: High-contrast details view showcasing VIN codes, drivetrain specs, an interactive leasing rate estimator, and LocalStorage-backed VIP reservation desk (`sellio_autos_luxury_inquiries`).

### 6. Jobs Startup Theme (`jobs_startup`)
The high-growth cyberpunk style startup ledger vertical works dynamically with the recruiting database API:
* **Showcase Dashboard (`Page.tsx`)**: Renders active open venture positions (`api.getJobs({ per_page: 6 })`) with clear links to applications.
* **Exploration Console (`ExplorePage.tsx`)**: Features advanced facets (keyword query, Category selector, Node Location selector, Workplace architecture, and Experience tiers) completely synced to Next.js routing parameters. Supports pagination via the "SYNC_MORE_NODES" dynamic loading control.
* **Venture Node Details (`ProductPage.tsx`)**: Integrates transparent compensation meters (annual salary bracket & equity shares with localized progress meters), detailed spec listings, dynamic related positions grids, and a stateful LocalStorage talent concierge dispatch board (`sellio_jobs_startup_applications`).

### 7. Services Marketplace Theme (`services_marketplace`)
The premium teal-accented local professional service directory functions dynamically:
* **Showcase Homepage View (`Page.tsx`)**:
  - Dynamically fetches available professionals (`api.getServices()`) and populates category cards and professional providers.
  - Active search and facet selection variables (keyword searches, category badges, location, hourly/fixed price bands, and minimum ratings) synchronized to react states.
* **Hiring Concierge Modal (`components/index.tsx`)**:
  - Stateful slide-up glassmorphic modal collects booking name, contact details, date, and project specifications.
  - Saves completed bookings securely under client `LocalStorage` registry (`sellio_services_marketplace_bookings`).
  - Pre-built shimmering skeletons for categories and professional cards ensure visual fluidness during server wait times.

### 8. Events Corporate Theme (`events_corporate`)
The obsidian-and-blue executive convention directory vertical operates dynamically:
* **Summit Showcase Homepage (`Page.tsx`)**: Loads active summit listings dynamically on component mount (`api.getEvents()`), populating premium showcase cards. Features real-time filters by keyword, categories, locations, and pricing bands.
* **Seat & Pass Reservation details (`ProductPage.tsx`)**: Renders dynamically based on url slug (`api.getEventDetails()`). Implements General Admission vs. VIP pass selectors with automatic price adjustments, live seat availability counts, and stateful reservation processing persisting inside client `LocalStorage` registry (`sellio_events_corporate_registrations`).

### 9. E-commerce Electronics Theme (`ecommerce_electronics`)
The cyberpunk NeuralGear-themed high-fidelity computer hardware storefront vertical is fully dynamic:
* **Hardware Showroom Homepage (`Page.tsx`)**: Fetches active inventory components from the database (`api.getProducts()`) and dynamically maps them to trending hardware and professional peripherals sections. Custom assets mapping fall back gracefully based on item list sequence.
* **Rig Rigging & Ordering Console (`ProductPage.tsx`)**: Renders custom hardware specifications dynamically from URL slugs (`api.getProductBySlug()`). Features an interactive order volume selector, custom performance overclocking spec input dispatch forms, and localized client-side order list tracking using browser state and `LocalStorage` key (`sellio_ecommerce_electronics_orders`).

### 10. E-commerce Fashion Theme (`ecommerce_fashion`)
The minimal, high-end "ATELIER Runway" silent luxury catalog storefront vertical is fully dynamic:
* **Lookbook Showcase Homepage (`Page.tsx`)**: Fetches active inventory apparel items from the database (`api.getProducts()`) and dynamically maps them to the Lookbook 26 editorial registry. Features premium shimmer loading skeletons, active metadata counters, and a luxury oyster-cream styled warning console for Axios connection diagnostics errors.
* **Atelier Bespoke Fitting & Ordering details (`ProductPage.tsx`)**: Fetches individual luxury fashion pieces dynamically from URL slugs (`api.getProductBySlug()`). Features an interactive standard size selector (XS to XL), custom physical measurement inputs (height, chest, waist), bespoke tailoring request notes, and local client-side inquiry tracking in LocalStorage under the key `sellio_ecommerce_fashion_orders`.

### 11. Classifieds Deals Theme (`classifieds_deals`)
The energetic dark-and-red styled flash-sale storefront vertical is fully dynamic:
* **Flash Feed Homepage (`Page.tsx`)**: Fetches active classifieds dynamically (`api.getClassifieds({ per_page: 6 })`) with stateful mount handlers, glowing red shimmers, and the offline diagnostics panel fallback.
* **Single Bargain Details (`ProductPage.tsx`)**: Loads individual bargain details dynamically by URL slug (`api.getClassifiedDetails(slug)`). Displays conditions (rating stars and condition labels), dimensions, age, and warranty with dynamic fallbacks. Includes an interactive "Snag This Deal" checkout booking form persisting reservation logs to LocalStorage (`sellio_classifieds_deals_orders`) and a related deals carousel drawer.

### 12. Classifieds Modern Theme (`classifieds_modern`)
The premium orange-and-cyan grid feed modern classifieds storefront is converted:
* **Catalog Grid & Filters Homepage (`Page.tsx`)**:
  - Dynamically fetches available catalog items from database (`api.getClassifieds()`) in custom client-side mounts.
  - Dynamically builds categories selector pills from sidebar metadata, prepending "Everything".
  - Gracefully maps database model fields to custom card components with high-fidelity fallbacks.
  - Implements custom brand-aligned shimmering loading states during server latency intervals.
  - Features an integrated dashed orange connection failure resilience console showing Axios traceback diagnostics in details if the database server is offline.
  - Caps grid layouts at exactly **4 columns** on screens above `1200px` via `.cm-grid` in `styles.css` to prevent layout gaps.
  - Defaults starting `visibleCount` to **12** so pagination increments (`12 ➔ 16 ➔ 20 ➔ 24`) remain perfectly symmetrical across screen sizes.
  - Integrates client-side `useRouter` hooks mapping both direct card clicks and Quick View modal details escalations to `/product/[slug]`.
* **Product Details & Booking Drawer (`ProductPage.tsx`)**:
  - Fetches individual listing spec sheets by URL slug using `@sellio/api-client`'s `api.getClassifiedDetails(slug)`.
  - Designates a beautiful specifications matrix outlining item age, condition star ratings, stock limits, geolocalized pick-up cities, and warranty terms.
  - Implements an interactive slide-over secure booking drawer that computes purchase quantities and persists reservations in `LocalStorage` under `sellio_classifieds_modern_orders` with high-fidelity visual order references.
  - Displays category-matched related bargains.

### 13. Classifieds Elite Theme (`classifieds_elite`)
The ultra-exclusive high-end dark-gold classifieds storefront is converted to a dynamic listings feed:
* **Curated Vault Homepage (`Page.tsx`)**:
  - Dynamically populates Category Pills filter ribbon from response categories or data taxonomy, prepending private `"All Vaults"`.
  - Integrates the featured "Spotlight Acquisitions Carousel" drawing featured assets from backend dynamic queries (`api.getClassifieds()`).
  - Maps live models to elite custom cards showing certificate grades, vault numbers, geolocalized origin countries, and luxury prices.
  - Implements custom gold-pulsing loading shimmer grids during network load delays.
  - Displays a custom resilient dark-gold diagnostics console detailing Axios traceback exceptions if database services are offline.

### 14. Classifieds Premium Theme (`classifieds_premium`)
The boutique institutional-grade M&A corporate-teal classifieds vertical operates fully dynamically:
* **Marketplace Homepage & Refinements (`Page.tsx`)**:
  - Dynamically hydrates elite private business opportunities client-side via `api.getClassifieds()`.
  - Separates loaded listings dynamically to render `featuredItems` inside the premium blueprint header grid and standard listings inside the main feed.
  - Formats database prices, locations, and verification badges statefully.
  - Extracts and deduplicates category options from active catalog records dynamically, populating the refinements sidebar select control.
  - Employs custom corporate teal-pulsing loading shimmer skeletons to mask network latency.
  - Presents a resilient connection trace warning dashboard styled in corporate teal and dashed lines to capture detailed Axios exceptions when connection to the database server fails.
  - Caps widescreen desktop listing grids at exactly **4 columns** on resolutions above `1200px` to guarantee visual symmetry.
  - Leverages Next.js `useRouter` to map memorandum details and prospectus buttons to `/product/[slug]`.

### 15. Classifieds General Theme (`classifieds_general`)
The classic, versatile blue-themed ClasaFind storefront directory vertical is fully dynamic:
* **Directory Homepage & Refinements (`Page.tsx`)**:
  - Hydrates live classified listings dynamically on mount using client-side `api.getClassifieds()`.
  - Maps live models statefully to standard cards showing seller avatars, price tags, delivery parameters, and saved states.
  - Dynamically builds categories select ribbon options, prepending `"All Listings"` and assigning relevant emojis based on category slugs (📱, 🚗, 🏠, 🛋️, 👕, 🔧, 📦).
  - Integrates sidebar checkbox filters for `"Local pickup only"` and `"Includes delivery"` statefully with database columns.
  - Binds the price range slider to update maximum price boundaries in real-time.
  - Introduces elegant, light-blue-tinted pulsing shimmer cards to mask database latency.
  - Embeds a custom resilient warning panel styled in light-blue and dashed outlines, capturing detailed connection traceback logs (e.g. `DB_CONNECTION_REFUSED`) gracefully if the API server is offline.
  - Locks widescreen desktops above `1200px` to exactly **4 columns** via `.cg-grid` class to protect visual grid symmetry.
  - Retains full compatibility with the stateful sliding chat messenger widget.
* **Listing Details Page (`ProductPage.tsx`)**:
  - Fetches listing details dynamically by slug client-side using `api.getClassifiedDetails(slug)`.
  - Designates a beautiful specifications card displaying item condition rating, quantity available, shipping status, and local pickup availability.
  - Implements an interactive stateful inquiry form that automatically validates inputs and records details in client LocalStorage under `sellio_classifieds_general_orders` with visual success receipts.
  - Dynamically fetches and matches category-linked neighborhood bargains inside the related items section.

### 16. Classifieds Local Theme (`classifieds_local`)
The neighborhood-centric styled classifieds directory is 100% dynamic, integrating backend listings with interactive geo-location street grid pins and distance radiuses:
* **Neighborhood Homepage (`Page.tsx`)**:
  - Hydrates live neighborhood items on mount utilizing `api.getClassifieds()` client-side.
  - Dynamically extracts categories from response results, populating a clean horizontal ribbon category filter, prepending "All Nearby" with localized emojis (🚲, 🏡, 🧸, 🐾, 🏷️, 📍).
  - Translates database fields to local neighborhood cards showing seller initials, pricing, and distance metrics.
  - Formulates deterministic geo-coordinates from listing data/ID hashes to beautifully distribute active map pins across the simulated vector street grid mesh.
  - Links the distance radius picker (2 mi, 5 mi, 10 mi) statefully to dynamically filter both the map coordinate pins and list items.
  - Introduces pulsing light-blue shimmer loading card skeletons to mask database fetch latency.
  - Integrates a custom resilient warning panel styled in soft light-blue and dashed borders to capture Axios's exception traceback details if database server nodes are offline, loading simulated catalog seeds.
  - Leverages client-side routing to map catalog card click interactions to details paths `/product/[slug]`.
* **Neighborhood Product Details (`ProductPage.tsx`)**:
  - Fetches listing details dynamically by slug client-side using `api.getClassifiedDetails(slug)`.
  - Integrates a beautiful specifications card displaying condition level, proximity distance, exchange neighborhood, and item category.
  - Implements an interactive stateful inquiry and reservation form that automatically validates inputs and records details in client LocalStorage under `sellio_classifieds_local_orders` with visual success receipts.
  - Dynamically fetches and matches category-linked neighborhood bargains inside the related items section.

---

## 🛡 Monorepo Database-Offline Resilience Layer

To deliver a true premium experience, the storefront features a global glassmorphic **Database Resilience System** embedded directly into the Root Layout (`layout.tsx`):
- **Axios Exception Interception**: Any fatal Axios database exception, network connection refusal (`ECONNREFUSED`), or `503 Service Unavailable` status is captured gracefully at the root level within `src/lib/theme.ts`.
- **Layout Typo Resolution**: Fixed a severe core typo where the theme fallback layout targeted the non-existent `unified/default` path instead of the correct `unifieds/default` path, eliminating uncaught module-not-found crashes.
- **`<DatabaseOfflineResilience>` Overlay**: When an offline state is detected, a full-screen, high-fidelity obsidian glassmorphic overlay is rendered, presenting structured JSON diagnostic logs (e.g. `DB_CONNECTION_REFUSED`).
- **Interactive Control Board**:
  - **Attempt Reconnection**: Fires a stateful loading reload animation to attempt live-reconnect.
  - **Browse Offline Catalog Backups**: Gracefully dismisses the screen (persisting state via `sessionStorage` to prevent intrusive navigation loops) and boots the storefront into mock-driven offline simulation mode.
  - **Floating Micro-Badge**: Once dismissed, a gorgeous, pulsing neon-red floating pill remains visible in the corner of the viewport, enabling users to re-trigger the diagnostic screen or recheck connection at any time.
