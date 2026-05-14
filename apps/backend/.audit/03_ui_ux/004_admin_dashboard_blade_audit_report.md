# 🛡️ Audit Report: Admin Dashboard Blade Hardening (Final Pass)

> [!IMPORTANT]
> **Audit Status**: 🟠 Remediation in Progress
> **Scope**: All administrative views listed in `04_views_admin.md`.
> **Objective**: 100% Elimination of inline `<script>`, `<style>`, and `on*` attributes.

## 📊 Summary of Findings

| Metric | Count | Priority |
| :--- | :--- | :--- |
| **Files Scanned** | 120+ | - |
| **Files with Inline `<style>` Blocks** | 29 | 🔴 High |
| **Files with Inline `<script>` Logic** | 76 | 🔴 High |
| **Files with Inline Event Handlers (`on...`)** | 42 | 🔴 High |
| **Files with Inline `style` Attributes** | 250+ | 🟡 Medium |

---

## 🔍 Detailed Vulnerability Map (By Module)

### 1. 📂 Shared Partials & Alerts
*Status: Mostly Clean - Visual Polishing Required*

| File | Status | Issues |
| :--- | :--- | :--- |
| `_adminbar.blade.php` | ✅ Compliant | No inline assets. |
| `_empty-state.blade.php` | ✅ Compliant | Logic decoupled. |
| `_form-actions.blade.php` | ✅ Compliant | Logic decoupled. |
| `_image-uploader.blade.php" | ✅ Compliant | Logic decoupled. |
| `_sweetalert.blade.php" | ✅ Compliant | External helpers used. |
| `alert.blade.php" | 🟠 Partial | Inline style for z-index (Line 50). |

### 2. 📂 Dashboard Module
*Status: Logic Decoupled - Styles Need Externalization*

| File | Status | Issues |
| :--- | :--- | :--- |
| `dashboard.blade.php` | 🟠 Partial | Inline JS for `window.dashboardData` (Line 143). |
| `ecommerce.blade.php` | 🟠 Partial | Inline JS for `window.dashboardData` (Line 89). |
| `_system_status.blade.php` | 🔴 Non-Compliant | Multiple `style="..."` attributes for icons and status badges. |
| `_KPIs.blade.php` | 🟠 Partial | Inline style for glassmorphic icon opacity (Line 40). |

### 3. 📂 Financial & Subscription Modules
*Status: Critical Issues - Legacy Handlers & Scripts*

| File | Status | Issues |
| :--- | :--- | :--- |
| `transactions/index.blade.php` | 🔴 Non-Compliant | `onclick="return confirm(...)"` on delete button (Line 93). |
| `subscriptions/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` for DataTable init (Line 178). |
| `subscriptions/form.blade.php` | 🔴 Non-Compliant | Inline `<style>` (Line 190) and `<script>` (Line 201). |
| `subscription-quotas/form.blade.php` | 🔴 Non-Compliant | Inline `<style>` (Line 90) and `<script>` (Line 76). |
| `payment-gateways/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` logic (Line 154). |

### 4. 📂 Operational Registries (Index Views)
*Status: Heavy Inline Scripting for DataTables*

| File | Status | Issues |
| :--- | :--- | :--- |
| `products/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 187). |
| `properties/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 165). |
| `amenities/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 142). |
| `brands/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 120). |
| `categories/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 142). |
| `jobs/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 125). |
| `events/index.blade.php` | 🔴 Non-Compliant | Inline `<script>` (Line 125). |

### 5. 📂 Communication & Content
*Status: Print Styles & Widget Logic*

| File | Status | Issues |
| :--- | :--- | :--- |
| `job-applications/show.blade.php` | 🔴 Non-Compliant | Inline `<style>` for print layout (Line 185). |
| `service-quotes/show.blade.php` | 🔴 Non-Compliant | Inline `<style>` (Line 239). |
| `page-builder/widgets/*.blade.php` | 🔴 Non-Compliant | Multiple inline `<script>` blocks for widget init. |

---

## 🛠️ Global Remediation Plan

1.  **Event Handler Migration**: Replace all `onclick`, `onsubmit`, and `onchange` with delegated event listeners in `global.js`.
2.  **Style Attribute Purge**: Migrate repeated `style="..."` patterns (z-index, borders, rounded corners, sticky-top) to `admin-custom.css` utility classes.
3.  **Script Decoupling**: 
    - Create `public/admin-assets/pages/registry-index.js` for generic DataTable init.
    - Move custom status toggle logic to page-specific JS modules.
4.  **Data Passing Protocol**: Replace `<script>window.data = ...</script>` with data-attributes on main containers.

---

## 🚀 Impact of Remediation
- **Security**: Full compatibility with strict CSP (no `unsafe-inline`).
- **Performance**: Improved caching of all JS/CSS assets.
- **Maintainability**: Unified logic in the `public/admin-assets/` directory.
