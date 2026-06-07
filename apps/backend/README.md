# Sellio - Ultimate Marketplace Engine (Laravel)

![Sellio Banner](https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg)

Sellio is a high-performance, multi-vertical marketplace platform built on the cutting-edge **Laravel 12.x** framework. Designed for scalability and extreme premium aesthetics, Sellio enables entrepreneurs to launch a comprehensive marketplace featuring Properties, Automotive, Recruitment, Services, Events, and Retail products within minutes.

---

## 💎 Premium Features

- **Multi-Vertical Architecture**: Specialized modules for Real Estate, Cars, Jobs, Services, Events, and E-commerce.
- **Executive Design System**: A high-fidelity, "Executive Premium" administrative interface with dark mode and glassmorphism.
- **Advanced Taxonomy**: Sophisticated category and location mapping with intelligent data fallback mechanisms.
- **Polymorphic Search**: A unified global search protocol capable of auditing assets across all marketplace verticals.
- **Financial Intelligence**: Integrated ledger system for tracking payments, commissions, and withdrawals.
- **RBAC Security**: Role-Based Access Control for Administrators, Partners, and Customers.

---

## 🛠 Technical Specifications

| Component | Technology |
| :--- | :--- |
| **Framework** | Laravel 12.x |
| **PHP Version** | 8.2+ |
| **Database** | MySQL 8.0+ / PostgreSQL / SQLite |
| **Admin UI** | AdminLTE 3 (Customized) |
| **Design Tokens** | CSS Variable Driven Architecture |
| **API Architecture** | RESTful JSON API (OpenAPI 3.0) |

---

## 🚀 Quick Start (Installation)

### 1. Prerequisites
- PHP 8.2 or higher
- Composer
- Node.js & NPM
- MySQL / PostgreSQL

### 2. Deployment Protocol
```bash
# Clone the repository
git clone https://github.com/m-abrar/sellio-platform.git

# Enter the backend directory
cd apps/backend

# Install dependencies
composer install
npm install

# Initialize environment
cp .env.example .env
php artisan key:generate

# Execute migrations and seed database
php artisan migrate:fresh --seed
```

### 3. Launch
```bash
php artisan serve
npm run dev
```

Access the admin panel at `/admin` and the storefront at `/`.

### 4. Demo credentials (after `migrate:fresh --seed`)

These accounts are created by `DatabaseSeeder` for **local development and demos only**. Change or remove them before production.

| Role | Email | Password | Login URL |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sellio-platform.test` | `admin123` | `/admin` |
| **Partner** | `partner@sellio-platform.test` | `partner123` | `/dashboard/partner` |
| **Buyer** | `buyer@sellio-platform.test` | `buyer123` | `/dashboard/user` |

Additional seeded users use `user1@sellio-platform.test` … `user20@sellio-platform.test` with password `password`.

**Web installer:** If you used `/install/`, the **admin** account is the one you created on the final step (it may replace user ID 1). Partner and buyer demo accounts above still exist if you ran the demo seeding step.

### 5. Post-install security (production)

Before going live, complete this checklist:

1. **Remove the installer** — Delete or rename `public/install/` after setup. The app blocks re-entry when `installed.lock` exists, and the installer disables browser error output once that lock is present.
2. **Environment** — Set `APP_ENV=production`, `APP_DEBUG=false`, `INSTALLER_DEBUG=false`, and a strong `APP_KEY` in `.env`.
3. **Rotate demo passwords** — If you imported demo data, change all seeded user passwords or remove demo accounts.
4. **Storage** — Run `php artisan storage:link` so uploaded media is publicly reachable.
5. **Optimize** — Run `php artisan config:cache`, `route:cache`, and `view:cache` on production.
6. **Queue & scheduler** — Configure a queue worker for `QUEUE_CONNECTION` and add the Laravel scheduler to cron (`* * * * * php artisan schedule:run`).
7. **Permissions** — Ensure `storage/` and `bootstrap/cache/` are writable by the web server.
8. **CMS content** — Admin-editable page content (`page_content()`) allows limited inline HTML (e.g. hero highlights). Values are sanitized on save; only trusted admin accounts should edit storefront copy.
9. **Page builder** — GrapesJS visual builder routes require the **super-admin** role; saved HTML/CSS is sanitized before persistence and on storefront render.
10. **Demo assets** — Theme preview images use bundled `/themes/...` WebP paths (copy from storefront build into `public/themes/`). Listing seed photos live in `database/seeders/images/` — include only media you may redistribute. See `_development/audits/backend/00_strategic/DEMO_IMAGE_AUDIT_2026-06-07.md`.

### 6. Admin E2E tests

**PHPUnit (in-memory SQLite, isolated per test):**

```bash
cd apps/backend
php artisan test tests/Feature/Admin/
```

**Playwright (uses `.env.testing` + MySQL database `sellio_testing`):**

```bash
cd apps/backend
php scripts/create-testing-db.php   # first-time: creates sellio_testing schema
npm run test:browser                # admin E2E (48 specs; auth setup runs automatically)
```

`.env.testing` uses `SESSION_DRIVER=cookie` so browser login CSRF tokens persist. After editing routes, run `php artisan route:clear` if tests hit stale cached controllers.

Dev/demo data uses `php artisan migrate:fresh --seed` (`DatabaseSeeder`). Browser tests use `AdminTestSeeder` on the separate `sellio_testing` schema so `Browser *` rows do not pollute your dev database.

**Installer smoke test (uses isolated MySQL database `sellio_install_test`; restores `.env` and `installed.lock` afterward):**

```bash
cd apps/backend
npm run test:browser:installer:setup   # drop/recreate sellio_install_test, remove installed.lock
npm run test:browser:installer         # Playwright walkthrough of /install/
```

Backups are written to `.env.bak` and `installed.lock.bak` on first run. The test skips the Composer POST step when `vendor/` already exists (web SAPI autoload regen is slow locally).

---

## 📄 Documentation & Support

Detailed technical guides, API specifications, and troubleshooting protocols can be found in the `docs/` directory:

- [System Architecture](docs/Status_Moderation_Architecture.md)
- [API Reference (OpenAPI)](docs/openapi.yaml)
- [System Health Audit](docs/final_quality_audit.md)

For further inquiries, please refer to the CodeCanyon support page.

---

## ⚖️ License

Sellio is proprietary software. All rights reserved. Please refer to the `LICENSE` file for terms of use.
