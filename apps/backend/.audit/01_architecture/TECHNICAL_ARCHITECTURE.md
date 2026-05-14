# 🏗️ Sellio: Technical Architecture Manual

This document provides a deep-dive into the underlying architecture of the Sellio Marketplace platform. It is designed for developers, technical reviewers, and CodeCanyon auditors.

---

## 💎 1. Core Architectural Principles

Sellio is built on **Laravel 11/12** and follows a **Service-Oriented Architecture (SOA)** to ensure scalability across its 8+ marketplace verticals.

### Key Design Patterns:
*   **Decoupled Logic**: Business logic is abstracted into `App\Services`, keeping Controllers lean and focused on request/response handling.
*   **Polymorphic Flexibility**: Common features (Images, Analytics, Reviews, Tags) are implemented using Polymorphic Relationships, allowing them to be attached to any vertical (e.g., a "Property" or an "Auto").
*   **Trait-Driven Behavior**: Shared functionalities are encapsulated in modular Traits located in `app/Traits`.

---

## 🧬 2. Model Architecture & Traits

The platform uses a standardized set of Traits to ensure consistent behavior across all marketplace models.

### `HasImageAccess`
*   **Purpose**: Provides a unified interface for the Spatie Media Library.
*   **Features**: Automatic thumbnail generation, placeholder fallback logic, and gallery management.
*   **Used In**: `Product`, `Property`, `Auto`, `Service`, `User`, `Category`.

### `HasAnalytics`
*   **Purpose**: Tracks high-performance view counts and interaction metrics.
*   **Implementation**: Utilizes an atomic incrementing system to handle high-traffic environments without database locks.

### `ManagesApproval`
*   **Purpose**: Handles the "Review -> Approved/Rejected" lifecycle for listings.
*   **Features**: Stores timestamps for approval and IDs of the approving administrator.

---

## 🔒 3. Security & Access Control (RBAC)

Sellio implements a rigorous Role-Based Access Control system powered by `spatie/laravel-permission`.

### Guard Logic:
*   **Web Guard**: Standard session-based access for the Admin Dashboard and User Profiles.
*   **Sanctum Guard**: Token-based access for the API layer and future Mobile Apps.

### Privilege Escalation (Super Admin):
A global Gate interceptor in `AppServiceProvider` ensures that users with the `super-admin` role bypass granular permission checks, preventing administrative lockouts.

---

## 💰 4. Financial Infrastructure

The platform integrates a robust wallet and payment system.

*   **Wallet System**: Powered by `bavix/laravel-wallet`, providing atomic transaction handling for buyers and vendors.
*   **Gateway Manager**: A centralized `GatewayManager` service orchestrates payments across multiple providers (Stripe, PayPal) while maintaining a consistent DTO-based response format.

---

## 📑 5. Database & Seeding Strategy

Sellio uses a **Multi-Stage Seeding Process** to ensure environment consistency:
1.  **Foundation**: Creates base roles, permissions, and settings.
2.  **Marketplace Verticals**: Populates specific modules (Real Estate, Autos).
3.  **Late-Stage Assignment**: The `UserRoleAssignmentSeeder` runs last to synchronize RBAC for all generated users.

---

## 🌐 6. API & Extensibility

*   **REST API**: Built with Laravel Sanctum, providing a secure bridge for the Flutter Mobile Apps.
*   **Documentation**: Automated via **Scramble**, ensuring the OpenAPI/Swagger registry is always in sync with the latest codebase.

---
*Document Version: 1.0.0 | Last Updated: May 2026*
