# Sellio Platform - Architectural Review

**Date:** April 29, 2026  
**Status:** Initial Review & Refactor Proposal

---

## 1. Summary of Current Architecture

The project is currently a **Backend-Centric Monolith** within a pseudo-monorepo structure. While it uses an `apps/` folder, the vast majority of logic and UI is contained within the Laravel application.

*   **Primary Core:** `apps/backend` (Laravel 12) serves as the API provider, Admin Dashboard, authentication provider, and the Storefront engine.
*   **Storefront Strategy:** Currently uses Blade templates in `resources/views/frontend`. This is a server-side rendered (SSR) approach.
*   **Monorepo Health:** No workspace management (e.g., pnpm/Turborepo) or shared package layer is currently implemented.
*   **Physical State:** The "Expected Architecture" (Next.js themes, React Seller Panel, Mobile apps) is documented but not yet physically implemented in the codebase.

---

## 2. Strengths

*   ✅ **Organized Backend Routing:** Dedicated route files for `admin`, `api`, and `auth` provide a clear separation of concerns at the routing level.
*   ✅ **Dynamic Variable Engine:** The use of a database-driven `themes` table for configuration (colors, fonts) is a scalable approach for multi-vertical support.
*   ✅ **Audit Infrastructure:** The presence of `_lab/audit-scripts` demonstrates a proactive approach to security and code quality.

---

## 3. Problems & Risks

*   ❌ **Tight Coupling:** The storefront is locked into Laravel Blade. This prevents the independent scaling of frontends and makes multi-theme development cumbersome.
*   ❌ **Deployment Rigidity:** Independent deployment of the storefront vs. the backend is currently impossible.
*   ❌ **Scalability Bottleneck:** Managing numerous themes within a single Laravel project will lead to significant codebase bloat.
*   ⚠️ **Architecture Drift:** Documentation (`STRUCTURE.md`) does not accurately reflect the current physical state of the repository.
*   🚫 **Missing Shared Layer:** No mechanism exists to share TypeScript types, API clients, or UI components between future independent applications.

---

## 4. Recommended Structure

A modern **Turborepo/pnpm Workspace** architecture is recommended to support independent scaling:

```text
/
├── apps/
│   ├── api/              # (Formerly apps/backend) Laravel 12 API-only
│   ├── seller-panel/     # React/Vite application
│   ├── mobile/           # Standalone Mobile projects
│   └── themes/           # Independent Next.js applications
│       ├── fashion/      # Next.js App 1
│       ├── electronics/  # Next.js App 2
│       └── grocery/      # Next.js App 3
├── packages/             # Shared layer
│   ├── api-client/       # Shared Fetch/Axios client
│   ├── types/            # Shared TypeScript interfaces
│   └── ui-components/    # Shared Design System components
├── pnpm-workspace.yaml   # Workspace management
├── turbo.json            # Build pipeline management
└── package.json          # Root scripts
```

---

## 5. Migration Plan

### Phase 1: Workspace Foundation
1.  **Initialize Workspace:** Add `pnpm-workspace.yaml` and `turbo.json` at the root.
2.  **API Standardization:** Rename `apps/backend` to `apps/api` to clarify its role as a service provider.
3.  **Shared Package Initialization:** Create `packages/types` and `packages/api-client` to house common logic.

### Phase 2: Storefront Decoupling
1.  **API Hardening:** Expose all storefront data (products, theme variables) via JSON API endpoints.
2.  **Next.js Implementation:** Create the first Next.js theme in `apps/themes/default`.
3.  **Blade Deprecation:** Gradually move logic from Blade to Next.js components, eventually removing the `frontend` views from Laravel.

### Phase 3: Scaling & Optimization
1.  **Theme Boilerplate:** Create a standardized template for spinning up new niche-specific themes.
2.  **Shared UI Library:** Extract common UI elements into `packages/ui-components`.
3.  **CI/CD Optimization:** Configure independent deployment pipelines for each application in the `apps/` directory.
