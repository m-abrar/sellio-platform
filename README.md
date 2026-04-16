# Sellio SaaS Monorepo

Welcome to the Sellio SaaS platform, a scalable monorepo architecture designed for multi-tenant marketplaces.

## 📁 Repository Structure

- `apps/`
  - `core/`: Laravel backend (API, Admin Dashboard).
  - `partner-panel/`: React/Vite dashboard for marketplace partners.
  - `storefront/`: Next.js dynamic runtime engine for customer-facing shops.
- `packages/`
  - `types/`: Shared TypeScript interfaces and vertical definitions.
  - `api-client/`: Unified Axios client for cross-app communication.
  - `config/`: Shared constants and configuration.
  - `ui/`: Common UI components (shared across partner-panel and storefront).
- `infrastructure/`: Deployment scripts and configurations.

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
