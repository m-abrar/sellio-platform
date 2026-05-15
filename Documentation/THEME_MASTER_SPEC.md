# Sellio Theme Master Specification: The Final Locked Blueprint

This document serves as the **immutable architectural and design standard** for the Sellio storefront theme engine. Every theme implementation must adhere strictly to the protocols defined herein.

---

## 1. The Prime Directives

### A. Absolute Independence (Siloed Architecture)
Every theme folder is a "Sovereign Island."
- **Zero Shared Components**: No imports are allowed between themes.
- **Zero Shared Styles**: Every theme must define its own CSS or local styles.
- **Side-Effect Immunity**: Changes to one theme must never impact another.

### B. The "Zero-Template" Rule
Generic "wrappers" are banned.
- Every `Header.tsx`, `Footer.tsx`, and `Card.tsx` must be written from scratch for each theme.
- HTML structures must be unique to prevent visual "sameness."
- CSS class names should be prefixed with the theme key (e.g., `.luxury-hero`) to prevent collision.

---

## 2. Global Design DNA

### Visual Standards
- **Depth**: Use multi-layered shadows (`0 20px 40px rgba(0,0,0,0.1)`) to create a "Premium Float" effect.
- **Surface**: High use of **Glassmorphism** (backdrop-filter: blur(12px)) for overlays.
- **Borders**: Hairline borders (0.5px - 1px) using semi-transparent colors for a sophisticated feel.

### Motion Principles
- **Orchestration**: Elements must not appear at once. Use staggered delays (50ms intervals).
- **Physics**: All transitions must use `cubic-bezier(0.4, 0, 0.2, 1)` for a "natural/weighted" feel.

---

## 3. Structural Divergence Matrix

| Modifier | Grid Architecture | Navigation Pattern | Focal Point |
| :--- | :--- | :--- | :--- |
| **Luxury** | **Asymmetric Flow**: Non-standard grids with overlapping elements. | **Minimalist**: Slide-out or hidden "Orb" menus. | High-res Art/Video |
| **Modern** | **Bento/Card**: Clean, rounded blocks (24px+) with glassmorphism. | **Floating Sticky**: Persistent transparent top-bar. | Dynamic Search/Stats |
| **Minimal** | **Monolithic**: Single-column focus with ultra-white space. | **Breadcrumb-Centric**: Focused on deep navigation. | Typography/Content |
| **Classic** | **3-Column Standard**: Sidebar + Feed + Utility column. | **Fixed Sidebar**: Direct tab-based access. | Discovery Speed |
| **Interactive**| **Fluid Canvas**: Horizontal scrolling and canvas-based sections. | **Orbital**: Elements that rotate/move on hover. | Gamification/Hype |

---

## 4. Vertical Deep Dives & Psychology

### A. Properties Vertical: "The Emotional Estate"
*Psychology: Trust, Aspiration, and Clarity.*
- **Components**: `ParallaxGallery`, `InteractiveMapMarker`, `SpecIconGrid`.
- **Data Mapping**: Maps `EAV metadata` (sqft, bedrooms) to custom-designed vector icons.

### B. Autos Vertical: "The Engineering Edge"
*Psychology: Performance, Speed, and Technical Confidence.*
- **Components**: `EnergyRadial` (for EVs), `SpecComparisonBar`, `ShimmerBadges`.
- **Data Mapping**: Maps `car_specs` to "Dash-style" gauges.

### C. Events Vertical: "The Pulse of the Now"
*Psychology: Urgency, Social Hype, and Seamless Access.*
- **Components**: `TicketTierSelector`, `PhysicsCountdown`, `LiveLineupGrid`.
- **Data Mapping**: Maps `event_date` to real-time tick-based countdowns.

---

## 5. Detailed Catalog of 50 Themes (Abbreviated Sample)
*(Full catalog logic follows the theme_key map in ThemeSeeder)*

| Theme Key | Modifier | Structural Goal |
| :--- | :--- | :--- |
| `properties_luxury` | Luxury | Asymmetric gallery with gold-leaf parallax. |
| `autos_electric` | Interactive | High-tech HUD dashboard with real-time range radials. |
| `events_music` | Modern | Bento-style artist cards with integrated wave-form previews. |
| `unifieds_minimal` | Minimal | Text-only search with monolithic whitespace feed. |
| ... | ... | (Repeated for all 50 keys based on matrix above) |

---

## 6. Implementation Architecture

### Folder Blueprint (Example: `themes/properties/luxury`)
```text
src/themes/properties/luxury/
├── index.ts          (Entry point)
├── Page.tsx          (Unique Home Logic)
├── Layout.tsx        (Unique Nav/Footer)
├── styles.css        (Theme-Specific Variables)
├── components/       (LOCAL ONLY - NO SHARED IMPORTS)
│   ├── LuxuryHero.tsx
│   ├── PropertyGrid.tsx
│   └── ContactDrawer.tsx
└── lib/              (Theme-specific helper logic)
```

### The "Silo" Import Rule
**Forbidden**: `import { Button } from "@/components/shared/Button"`
**Mandated**: `import { Button } from "./components/Button"` (The button must be custom-styled for this theme).

---

**This plan is now LOCKED. No deviations are permitted without structural review.**

---

## 7. Theme Generation Protocol (The Developer Prompt)

When implementing or generating any of the 50 themes, follow this **Golden Prompt**:

> **Context**: You are building the `[THEME_KEY]` theme for the Sellio platform. It belongs to the `[VERTICAL]` vertical and uses the `[MODIFIER]` style.
> 
> **Architectural Constraints**:
> 1.  **Isolation**: DO NOT import components from other themes. Create all buttons, cards, and navs locally in `./components/`.
> 2.  **Layout**: Apply the `[GRID_STYLE]` from the Structural Divergence Matrix.
> 3.  **Typography**: Use `[HEADING_FONT]` for headers and `[BASE_FONT]` for body.
> 4.  **Data**: Map `theme.variables` to CSS variables and use `property.variables` to drive vertical-specific UI (e.g., `sqft` for properties).
> 
> **Implementation Steps**:
> -   **Step 1 (Layout.tsx)**: Build a unique Header/Footer that matches the `[NAV_PATTERN]`. Ensure the logo and primary buttons use theme-specific styling.
> -   **Step 2 (styles.css)**: Define local CSS variables for primary/secondary colors and font families.
> -   **Step 3 (Page.tsx)**: Implement the `[HERO_STRATEGY]`. Create a high-density listing grid using the theme's local `ListingCard`.
> -   **Step 4 (Interactions)**: Apply `[MOTION_PRINCIPLE]` (e.g., Lift/Fade or Horizontal Slide) to all entering elements.
> 
> **Success Criteria**:
> - The theme is 100% self-contained (Zero cross-imports).
> - The visuals are structurally distinct from other modifiers (e.g., Luxury vs Modern).
> - The performance is optimized (Zero unused CSS/JS).
> - The UI feels "Premium" with depth, glassmorphism, and smooth physics.

### Final Implementation Checklist:
- [ ] Folder created at `src/themes/[vertical]/[key]/`
- [ ] `index.ts` exports both `default` (Page) and `Layout`.
- [ ] `styles.css` is imported only within this theme's Layout.
- [ ] Components are located in `./components/` and have unique HTML structures.
- [ ] Metadata is correctly resolved via `getActiveTheme()`.
- [ ] Interactive elements have theme-prefixed classes.

---

## 8. Vertical Component Divergence (Deep Dive)

To ensure total visual uniqueness, we must vary the internal architecture of shared *concepts* (like a Property Card) based on the theme's modifier.

### Example: The "Property Card" Divergence

| Modifier | HTML/CSS Strategy | Key Visual Element | Micro-Interaction |
| :--- | :--- | :--- | :--- |
| **Luxury** | Overlay-style. Text floats over the image with a glassmorphism backdrop. | Gold-leaf border (1px) | Image expands slowly (scale 1.1) on hover while text fades in. |
| **Modern** | Stacked-style. Image on top, info in a clean white bento-box below. | Large corner radii (32px) | Card "lifts" with a soft, deep shadow and a primary-color glow. |
| **Minimal** | Text-first. Image is small/square on the left, info on the right. | Hairline borders (0.5px) | Subtle opacity shift (0.8 to 1.0) on hover. |
| **Classic** | Grid-style. Dense info with multiple icons (Beds, Baths, Sqft) visible. | Badges for "Status" | Border color changes to primary color on hover. |

---

## 9. Vertical-Specific Color & Font Logic

### A. The "Vibe" Matrix
We don't just pick colors; we pick "market-fit" palettes:

1.  **Autos**:
    *   *Classic*: "Dealer Red" (#D32F2F) + Charcoal. Focus on urgency.
    *   *Electric*: "Cyber Teal" (#00E5FF) + Dark Navy. Focus on future/tech.
2.  **Properties**:
    *   *Urban*: "Concrete Gray" (#718096) + Safety Orange (#ED8936). Focus on city life.
    *   *Vacation*: "Ocean Blue" (#3182CE) + Sandy Beige (#F6E05E). Focus on relaxation.
3.  **Jobs**:
    *   *Tech*: "Code Blue" (#2B6CB0) + Terminal Green. Focus on skills.
    *   *Blue-Collar*: "Safety Yellow" (#D69E2E) + Work Navy. Focus on stability.

---

## 10. Advanced Interaction & Physics Spec
Every theme must feel "Fluid." Apply these specific values to the local `framer-motion` or CSS transitions:

- **Hover Scale**:
    - *Luxury/Minimal*: 1.02 (Subtle)
    - *Modern/Interactive*: 1.05 (Assertive)
- **Parallax Intensity**:
    - *Properties Showcase*: 30px scroll-offset.
    - *Events Festival*: 50px scroll-offset for "floating" lineup elements.
- **Blur Values**:
    - *Modern Glass*: 12px blur, 0.1 opacity.
    - *Luxury Glass*: 20px blur, 0.05 opacity (much more subtle/misty).
