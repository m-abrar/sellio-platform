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
