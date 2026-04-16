# Sellio SaaS Monorepo

Welcome to the Sellio SaaS platform, a scalable monorepo architecture designed for multi-tenant marketplaces.

## 📁 Repository Structure

- `apps/`
  - `backend/`: Laravel API
  - `dashboard/`: React admin panel
  - `mobile/`: Mobile application
  - `web/`: Next.js storefront
- `packages/`
  - `api-client/`: Unified Axios client for cross-app communication
  - `applications/`: Vertical-specific logic (Real Estate, Automotive, etc.)
  - `config/`: Shared constants and configuration
  - `types/`: Shared TypeScript interfaces and vertical definitions
  - `ui/`: Common UI components (shared across dashboard and web)
- `infrastructure/`: Deployment scripts and configurations

## 🚀 Getting Started

This project uses `pnpm` workspaces.

### 1. Installation
```bash
pnpm install
```

### 2. Development
Run all applications in development mode:
```bash
pnpm dev
```

### 3. Backend Setup
Navigate to `apps/core` and follow standard Laravel setup:
```bash
php artisan migrate
php artisan db:seed
```

## 🏗️ Modular Architecture

Sellio has transitioned from a fixed-theme approach to a dynamic **Application** architecture. Each vertical (Real Estate, Automotive, etc.) is defined as an `Application` in the database, allowing the storefront to dynamically adapt its logic and visuals based on the detected tenant.
