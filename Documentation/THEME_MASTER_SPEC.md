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

---

## 6. Implementation Architecture

### Folder Blueprint (Example: `themes/properties/luxury`)
```text
src/themes/properties/luxury/
├── components/          <-- MANDATORY
│   ├── index.ts         <-- Exports all local components
│   ├── Header.tsx       
│   ├── Footer.tsx       
│   └── [CardName].tsx   
├── Layout.tsx           
├── Page.tsx             
├── index.ts             
└── styles.css           
```

### The "Silo" Import Rule
**Forbidden**: `import { Button } from "@/components/shared/Button"`
**Mandated**: `import { Button } from "./components/Button"` (The button must be custom-styled for this theme).

---

## 7. Interactivity & Client Component Protocol

To ensure 100% compatibility with Next.js Server Components while maintaining high-fidelity interactivity:

1.  **Directive Mandate**: Any theme file (Page or Component) containing event handlers (`onClick`, `onSubmit`, `onChange`) MUST include the `'use client';` directive at the very first line.
2.  **Serialization Safety**: Never pass functions or complex class instances as props from a Server Component (`page.tsx`) to a theme. Themes must handle their own internal state.
3.  **Form Defaults**: All forms within themes should use `e.preventDefault()` to avoid full-page reloads.

---

## 8. Theme Generation Protocol (The Developer Prompt)

When implementing any of the 50 themes, follow this **Golden Prompt**:

> **Context**: You are building the `[THEME_KEY]` theme for the Sellio platform.
> 
> **Architectural Constraints**:
> 1.  **Isolation**: Create all buttons, cards, and navs locally in `./components/`.
> 2.  **Layout**: Apply the `[GRID_STYLE]` from the Matrix.
> 3.  **Interactivity**: Use `'use client';` if handlers are present.
> 4.  **Reference Alignment**: Read the `BLUEPRINT_INSTRUCTIONS.md` and review screenshots in the root `REFERENCE_LIBRARY` for this vertical/archetype before implementation.
> 
> **Implementation Steps**:
> -   **Step 1 (Layout.tsx)**: Build a unique Header/Footer.
> -   **Step 2 (styles.css)**: Define local CSS variables and scoped classes.
> -   **Step 3 (Page.tsx)**: Implement the high-fidelity vertical-specific experience.

---

## 9. Vertical Component Divergence (Deep Dive)

| Modifier | HTML/CSS Strategy | Key Visual Element | Micro-Interaction |
| :--- | :--- | :--- | :--- |
| **Luxury** | Overlay-style. | Gold-leaf border (1px) | Image scale 1.1 + Fade-in |
| **Modern** | Stacked-style. | Large radii (32px) | Lift + Glow |
| **Minimal** | Text-first. | Hairline borders (0.5px) | Opacity shift |

---

## 10. Advanced Interaction & Physics Spec
- **Hover Scale**: 1.02 (Luxury) / 1.05 (Modern)
- **Blur Values**: 12px (Modern) / 20px (Luxury)
- **Transitions**: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 11. Real-World Implementation Tracker (v1.0)

| Theme Key | Vertical | Completion | Spec Compliance | Key Aesthetic |
| :--- | :--- | :--- | :--- | :--- |
| `autos_classic` | Autos | 100% | **Elite** | Burgundy/Gold Premium |
| `autos_electric` | Autos | 100% | **Elite** | Futurist HUD |
| `autos_luxury` | Autos | 100% | **Elite** | Velvet Wheels Dark/Gold |
| `autos_modern` | Autos | 100% | **Elite** | Sleek Black/White |
| `autos_used` | Autos | 100% | **Elite** | Trustworthy Blue/Orange |
| `services_corporate` | Services | 100% | **Elite** | Corporate Professional |
| `services_creative` | Services | 100% | **Elite** | Bold Portfolio |
| `services_local` | Services | 100% | **Elite** | Local Community |
| `services_marketplace`| Services | 100% | **Elite** | Bio-Centric Grid |
| `services_health` | Services | 100% | **Elite** | Wellness Serenity |
| `properties_modern` | Properties | 100% | **Elite** | Architectural Sage |
| `events_music` | Events | 100% | **Elite** | Vibrant Poster |
| `unifieds_default` | Unified | 100% | High | Glassmorphic Bento |
| `unifieds_mega` | Unified | 100% | **Elite** | High-Density Bento |
| `ecommerce_default` | Ecommerce | 100% | High | Refined Retail |
| `ecommerce_fashion` | Ecommerce | 100% | **Elite** | Editorial Lookbook |
| `jobs_startup` | Jobs | 100% | **Elite** | Energetic Venture |
| `classifieds_premium` | Classifieds | 100% | **Elite** | Elite Curated |
| `ecommerce_electronics` | Ecommerce | 100% | **Elite** | Futurist Cyber/Tech |
| `ecommerce_luxury` | Ecommerce | 100% | **Elite** | High-Fidelity Gold/Slate |

---

### Final Implementation Checklist:
- [x] Folder created at `src/themes/[vertical]/[key]/`
- [x] `index.ts` exports both `default` (Page) and `Layout`.
- [x] `styles.css` is imported only within this theme's Layout.
- [x] Components siloed in `./components/` with an `index.ts` exporter.
- [x] `'use client';` directive added if interactivity is present.
- [ ] Metadata is correctly resolved via `getActiveTheme()`.
- [ ] Interactive elements have theme-prefixed classes.

---

## 12. The "Reference-to-Implementation" Protocol

When building or refining a theme, the **REFERENCE_LIBRARY** at the root of the workspace must be used as the primary design and architectural source of truth.

### Workflow:
1.  **Analyze Guidelines**: Read the `BLUEPRINT_INSTRUCTIONS.md` within the relevant folder in the `REFERENCE_LIBRARY`. These contain the original design prompts, color palettes, and layout rules.
2.  **Review Visuals**: Examine the screenshots (`*.png`) and HTML demos to understand the high-fidelity visual expectations and spatial relationships.
3.  **Inspect Heritage Code**: Reference the legacy `.blade.php` and `.css` files. These are not working files but provide the structural "DNA" and design nuances that must be translated into modern Next.js/React components.
4.  **Consolidate & Elevate**: Merge the architectural silo requirements of this Spec with the visual guidelines from the library to create a "Fully Premium" Envato-level storefront theme.

Every Next.js theme implementation must be an **"Elite" evolution** of its reference counterpart, maintaining the design spirit while utilizing modern component patterns.
