# Sellio Platform - Independent Applications

## 📂 Project Structure
Sellio is a collection of **standalone applications**, each managed independently for maximum flexibility and clear separation of concerns (React for Dashboard, Next.js for Storefront).

```text
/apps
  ├── /backend      # Laravel 12 Engine (API, Admin Dashboard, Auth)
  ├── /web          # Next.js Storefront (Dynamic Vertical Engine)
  ├── /dashboard    # React/Vite Merchant Portal
  └── /mobile       # Mobile Application (Standalone)
/_lab               # Development resources and backups
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
