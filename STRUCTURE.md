# Sellio Platform - Monorepo Architecture

## 📂 Repository Structure
Sellio is managed as a **pnpm monorepo**, ensuring tight synchronization between the backend API and various frontend clients.

```text
/apps
  ├── /backend      # Laravel 12 Engine (API, Admin Dashboard, Auth)
  ├── /web          # Next.js Storefront (Dynamic Vertical Engine)
  ├── /dashboard    # Next.js Merchant/User Portal
  └── /mobile       # React Native Application
/packages
  ├── /api-client   # Shared TypeScript API definitions
  └── /ui           # Shared React Component Library
```

## 🎨 Theme & Vertical Management
Unlike traditional applications where each theme might be a separate app, Sellio uses a **Single-App Dynamic Engine** for its storefront (`apps/web`).

### 1. The Storefront Engine (`apps/web`)
- A single Next.js instance serves all domains and business verticals.
- It identifies the active **Vertical** (e.g., Real Estate, Auto) and **Theme Variables** (colors, fonts) via an API call to the backend.
- UI layouts are organized in `components/verticals/` and are rendered conditionally based on the theme key.

### 2. The Backend Registry (`apps/backend`)
- The `themes` table acts as the source of truth for all storefront configurations.
- Each entry defines:
  - **Vertical**: The business category (e.g., `ecommerce`, `properties`).
  - **Theme Key**: The specific visual layout (e.g., `modern`, `classic`).
  - **Variables**: CSS custom properties (hex codes, font names).
  - **Config**: Toggleable features (e.g., `show_map`, `enable_filters`).

### 3. Scaling to 100+ Themes
To add a new vertical (like "Shop/Ecommerce"), we simply:
1. Register the new vertical in the backend `ThemeSeeder`.
2. Map the niche-specific colors and metadata.
3. The Storefront automatically picks up the new configuration and applies the appropriate vertical components.
