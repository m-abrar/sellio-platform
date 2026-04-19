# Sellio Platform - Independent Applications

## 📂 Project Structure
Sellio is a collection of **standalone applications**, each managed independently for maximum flexibility (React for Dashboard, Blade for Storefront).

```text
/apps
  ├── /backend      # Laravel 12 Engine (API, Admin Dashboard, Frontend, Auth)
  ├── /dashboard    # React/Vite Merchant Portal
  └── /mobile       # Mobile Application (Standalone)
/_lab               # Development resources and backups
```

## 🎨 Theme & Vertical Management
Sellio uses a **Blade-based Dynamic Engine** hosted within the backend for its storefront.

### 1. The Storefront Engine (Laravel Frontend)
- The Laravel application in `apps/backend` serves all domains and business verticals via Blade components.
- It identifies the active **Vertical** and **Theme Variables** directly from the database.
- UI layouts are organized in `resources/views/frontend/` and are rendered conditionally.

### 2. The Backend Registry (`apps/backend`)
- The `themes` table acts as the source of truth for all storefront configurations.
- Each entry defines:
  - **Vertical**: The business category (e.g., `ecommerce`, `properties`).
  - **Theme Key**: The specific visual layout (e.g., `modern`, `classic`).
  - **Variables**: CSS custom properties (hex codes, font names).
  - **Config**: Toggleable features (e.g., `show_map`, `enable_filters`).

### 3. Scaling to 100+ Themes
To add a new vertical:
1. Register the new vertical in the backend `ThemeSeeder`.
2. Map the niche-specific colors and metadata.
3. The Blade-based Storefront automatically picks up the new configuration.
