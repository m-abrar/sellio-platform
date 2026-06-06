# Sellio Storefront: Theme Catalog & Design Specifications

This document outlines the visual strategy, UI/UX archetypes, and implementation plans for the 50 vertical-specific themes within the Sellio platform.

---

## 1. Global Design DNA
Every theme, regardless of its vertical, must adhere to these "Elite" standards:
- **Typography**: Responsive scales using Inter (base) and vertical-specific headings (Playfair, Montserrat, Outfit).
- **Surface Design**: Consistent use of glassmorphism, subtle borders (`#eee`), and high-depth shadows (`shadow-premium`).
- **Interactions**: CSS-only hover lifts, smooth scale transitions, and skeleton loaders for all dynamic content.
- **Responsiveness**: Mobile-first architecture with container queries for complex grids.

---

## 2. Vertical Master Archetypes

### A. Unified Series (8 Themes)
*Target: Multi-category marketplaces and general portals.*
- **Themes**: Default, Standard, Classic, Modern, Mega, Interactive, Minimal, Marketplace.
- **Key UI/UX**:
    - **Header**: Search-centric (global search bar prominence).
    - **Grid**: Modular "Bento" style boxes for diverse categories.
    - **Modern/Mega**: Feature hero carousels with 3D transition effects.
    - **Minimal**: High white space, monochromatic accents, "Quiet" UI.

### B. Properties Vertical (13 Themes)
*Target: Real Estate, Vacation Rentals, Commercial Property.*
- **Themes**: Classic, Modern, Luxury, Luxury 2, Urban, Rental, Vacation, Map, Unified, Commercial, Showcase, Neighborhood, Investment.
- **Key UI/UX**:
    - **Visuals**: Full-bleed property imagery, high-res gallery overlays.
    - **Utility**: Spec-bars (Beds/Baths/Sqft) with custom icons.
    - **Map View**: Interactive Leaflet/Google Maps integration for geolocation-first browsing.
    - **Investment**: ROI calculators and data-heavy tables with mini-charts.

### C. Autos Vertical (5 Themes)
*Target: Dealerships, Used Car Marketplaces, EV Showrooms.*
- **Themes**: Classic, Modern, Used, Luxury, Electric.
- **Key UI/UX**:
    - **Visuals**: Dark mode presets (especially for Luxury/Electric), sleek gradients.
    - **Utility**: Detailed spec-comparison tools, finance calculators.
    - **Electric**: Futurist typography (Orbitron) and neon-accented state-of-charge indicators.

### D. Events Vertical (5 Themes)
*Target: Concerts, Festivals, Corporate Conferences.*
- **Themes**: Classic, Creative, Corporate, Music, Festival.
- **Key UI/UX**:
    - **Visuals**: Bold, vibrant "Poster" style hero sections.
    - **Utility**: Ticket tier selectors, countdown timers, calendar integrations.
    - **Music/Festival**: Immersive video backgrounds and dynamic artist lineups.

### E. Services Vertical (5 Themes)
*Target: Agencies, Freelancers, Local Home Services.*
- **Themes**: Corporate, Marketplace, Creative, Local, Health.
- **Key UI/UX**:
    - **Visuals**: Bio-centric layouts (Face/Team shots), portfolio grids.
    - **Utility**: Appointment booking calendars and "Request a Quote" forms.

### F. Jobs Vertical (5 Themes)
*Target: Recruitment Portals, Tech Job Boards.*
- **Themes**: Corporate, Startup, Tech, Blue-Collar, Freelance.
- **Key UI/UX**:
    - **Visuals**: High-contrast readability, company logo prominence.
    - **Utility**: Salary range filters, "One-Click Apply" buttons, and application tracking progress bars.

### G. Classifieds Vertical (6 Themes)
*Target: Local Community Boards, Bargain Hubs.*
- **Themes**: General, Modern, Local, Deals, Premium, Elite.
- **Key UI/UX**:
    - **Visuals**: Efficient, high-density listing grids (more items per screen).
    - **Utility**: Location-based radius searches and "Quick-Chat" seller integration.

### H. Ecommerce Vertical (4 Themes)
*Target: Direct Retail, Fashion, Electronics.*
- **Themes**: Default, Luxury, Fashion, Electronics.
- **Key UI/UX**:
    - **Visuals**: Product-first photography, zoom-on-hover.
    - **Utility**: Advanced variant selectors (size/color/specs), floating "Add to Cart."

---

## 3. Aesthetic Variation Definitions
When we apply these modifiers to any vertical, they follow these rules:
- **Luxury**: Serif fonts (Playfair), Gold/Slate accents, generous padding, high-fidelity shadows.
- **Modern**: Sans-serif (Outfit/Inter), vibrant primary colors, large border-radii (24px+), glassmorphism.
- **Classic**: Traditional grids, system fonts, clear borders, conservative spacing.
- **Minimal**: 0.5px borders, grayscale palette, strictly functional iconography.

---

## 4. Implementation Roadmap

### Phase 1: Absolute Independence (Siloed Architecture)
To ensure maximum flexibility, every theme must be **100% self-contained**. 
- **No Shared Components**: A "Property Card" used in `properties/luxury` must not be shared with `properties/modern`. 
- **Local Logic**: Each theme folder must contain its own unique set of components, hooks, and localized styles.
- **Side-Effect Zero**: Modifications to one theme must have zero possibility of impacting any other theme.

### Phase 2: Theme-Specific Skinning
Implement the `Layout.tsx` and `Page.tsx` for each theme using its own local components.

### Phase 3: Interactive Refinement
Polish each theme individually with its own unique motion and interaction logic.

---

## 5. Vertical Deep Dives & Psychology

### A. Properties Vertical: "The Emotional Estate"
*Psychology: Trust, Aspiration, and Clarity.*

| Theme Key | Component Mechanics | Data Mapping (Laravel API) |
| :--- | :--- | :--- |
| `properties_luxury` | **Parallax Gallery**: Large-scale image transitions with gold-leaf borders. | `theme_variables['--color-accent']` maps to borders. |
| `properties_rental` | **Scarcity Badges**: "Only 2 left" indicators based on availability. | `property.stock_count` -> `ScarcityBadge` |
| `properties_map` | **Live Geolocation**: Real-time marker clusters on a custom-skinned map. | `property.lat/lng` -> `MarkerCluster` |

**Motion Principles**:
- **Entrance**: Fade-in with 20px upward slide for property cards.
- **Micro-interaction**: Image zoom on hover (scale 1.05) with a 0.5s ease-out.

---

### B. Autos Vertical: "The Engineering Edge"
*Psychology: Performance, Speed, and Technical Confidence.*

| Theme Key | Component Mechanics | Data Mapping (Laravel API) |
| :--- | :--- | :--- |
| `autos_electric` | **Energy Dashboard**: Visual battery/range graphics. | `property.variables['battery_kwh']` -> `EnergyRadial` |
| `autos_luxury` | **Low-Key Lighting UI**: Dark backgrounds with high-key product shots. | `theme_variables['--background']` set to #0a0a0a. |
| `autos_used` | **Price Comparison**: Visual bar showing "Market Average" vs "Our Price". | `property.price` vs `market_avg` -> `PriceBar` |

**Motion Principles**:
- **Entrance**: Horizontal slide-in for car specs to mimic "passing by".
- **Micro-interaction**: "Shimmer" effect on premium car badges.

---

### C. Events Vertical: "The Pulse of the Now"
*Psychology: Urgency, Social Hype, and Seamless Access.*

| Theme Key | Component Mechanics | Data Mapping (Laravel API) |
| :--- | :--- | :--- |
| `events_music` | **Audio Preview**: Small integrated wave-form player for artist tracks. | `property.variables['preview_url']` -> `AudioPlayer` |
| `events_festival` | **Dynamic Lineup**: Responsive grid of artist cards with filter-by-stage. | `property.categories` -> `FilterChips` |

**Motion Principles**:
- **Entrance**: "Pop" entrance with slight bounce for ticket buttons.
- **Micro-interaction**: Countdown timer digits flip with a physics-based animation.

---

### D. Unified Series: "The Universal Gateway"
*Psychology: Efficiency, Discovery, and Frictionless Browsing.*

**Design Strategy**:
The Unified themes prioritize **Information Architecture** over immersive visuals. They use a **Bento Box** layout system where every "category" has its own dedicated space on the home screen.

---

## 6. Data Orchestration (The "Liquid-to-React" Bridge)
Every theme uses a standard `ResolvedTheme` object, but maps it differently:
1. **The Variable Bridge**: `theme.variables` are injected into `:root` CSS variables.
2. **The Meta Bridge**: `property.variables` (EAV data from Laravel) are parsed locally within the theme to populate unique components (e.g., `JobType` vs `EngineSize`).
3. **The Layout Bridge**: `Layout.tsx` handles vertical-specific navigation (e.g., a "Post an Ad" button for Classifieds vs "Sell a Car" for Autos).

---

## 7. Structural Divergence & Layout Philosophy
To ensure that "Unique" means more than just a color change, every theme modifier follows a distinct structural logic:

| Modifier | Grid Architecture | Navigation Pattern | Focal Point |
| :--- | :--- | :--- | :--- |
| **Luxury** | **Asymmetric Flow**: Non-standard grids with large overlapping elements. | **Minimal/Hidden**: Hamburger or "Slide-out" to keep focus on imagery. | High-fidelity Video/Image. |
| **Modern** | **Bento/Card**: Clean, rounded-corner blocks (24px+) with glassmorphism. | **Floating Top Bar**: Persistent, transparent navigation. | Interactive Search/Stats. |
| **Minimal** | **Monolithic**: Single column or tight 2-column grids with high white space. | **Breadcrumb-First**: Focus on deep hierarchy navigation. | Typography & Content. |
| **Classic** | **Standard 3-Column**: Traditional sidebar + main feed + utility column. | **Fixed Sidebar**: Tab-based navigation for speed. | Listing Discovery. |
| **Interactive**| **Canvas/Fluid**: Scroll-triggered animations and horizontal sliding sections. | **Dynamic/Orbital**: Elements that move or rotate on hover. | Engagement/Gamification. |

### The "Zero-Template" Rule
Every `Page.tsx` and `Layout.tsx` will be written from scratch for each theme. We will avoid generic "wrapper" components. If two themes need a "Header," they will each have their own unique `Header.tsx` implementation with different HTML structures, ensuring that CSS collisions are impossible and visual uniqueness is guaranteed.
