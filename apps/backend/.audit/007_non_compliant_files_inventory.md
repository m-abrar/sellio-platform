# 🛡️ Inventory: Non-Compliant Administrative Views (CSP Audit)

> [!IMPORTANT]
> **Total Files with CSP Violations**: 122
> **Total Files Scanned (Target)**: 197
> **Objective**: Decouple all inline logic and styles to achieve 100% security compliance for CodeCanyon distribution.

---

## 📂 Dashboard & Shared Partials
| File Path | Issue Type |
| :--- | :--- |
| `resources\views\admin\dashboard\dashboard.blade.php` | Inline JS (window.dashboardData) |
| `resources\views\admin\dashboard\ecommerce.blade.php` | Inline JS (window.dashboardData) |
| `resources\views\admin\dashboard\partials\_content_ecosystem.blade.php` | Inline Styles |
| `resources\views\admin\dashboard\partials\_growth_metrics.blade.php` | Inline Styles |
| `resources\views\admin\dashboard\partials\_KPIs.blade.php` | Inline Styles |
| `resources\views\admin\dashboard\partials\_master_calendar.blade.php` | Inline JS |
| `resources\views\admin\dashboard\partials\_strategic_planning.blade.php` | Inline Styles |
| `resources\views\admin\dashboard\partials\_system_status.blade.php` | Inline Styles (Icons/Badges) |
| `resources\views\admin\dashboard\partials\ecommerce\_financial_performance.blade.php` | Inline JS |
| `resources\views\admin\dashboard\partials\ecommerce\_growth_metrics.blade.php` | Inline Styles |
| `resources\views\admin\dashboard\partials\ecommerce\_KPIs.blade.php` | Inline Styles |
| `resources\views\admin\dashboard\partials\ecommerce\_master_calendar.blade.php` | Inline JS |
| `resources\views\admin\dashboard\partials\ecommerce\_strategic_planning.blade.php` | Inline Styles |

---

## 📂 Financial & Subscription Modules
| File Path | Issue Type |
| :--- | :--- |
| `resources\views\admin\transactions\index.blade.php` | `onclick` handler (confirm) |
| `resources\views\admin\withdrawals\form.blade.php` | Inline JS logic |
| `resources\views\admin\withdrawals\index.blade.php` | Inline JS logic |
| `resources\views\admin\payments\form.blade.php` | Inline JS logic |
| `resources\views\admin\payments\index.blade.php` | Inline JS logic |
| `resources\views\admin\payment-gateways\form.blade.php` | Inline Styles |
| `resources\views\admin\payment-gateways\index.blade.php` | Inline JS logic |
| `resources\views\admin\subscriptions\form.blade.php` | Inline Styles & JS |
| `resources\views\admin\subscriptions\index.blade.php` | Inline JS (DataTable) |
| `resources\views\admin\subscription-quotas\form.blade.php` | Inline Styles & JS |
| `resources\views\admin\subscription-quotas\index.blade.php` | Inline JS logic |
| `resources\views\admin\plans\index.blade.php` | Inline JS logic |

---

## 📂 Registry Index Views (DataTable Logic)
| File Path | Issue Type |
| :--- | :--- |
| `resources\views\admin\products\index.blade.php` | Inline JS |
| `resources\views\admin\properties\index.blade.php` | Inline JS |
| `resources\views\admin\autos\index.blade.php` | Inline JS |
| `resources\views\admin\jobs\index.blade.php` | Inline JS |
| `resources\views\admin\events\index.blade.php` | Inline JS |
| `resources\views\admin\services\index.blade.php` | Inline JS |
| `resources\views\admin\classifieds\index.blade.php` | Inline JS |
| `resources\views\admin\bookings\index.blade.php` | Inline JS |
| `resources\views\admin\amenities\index.blade.php` | Inline JS |
| `resources\views\admin\brands\index.blade.php` | Inline JS |
| `resources\views\admin\categories\index.blade.php` | Inline JS |
| `resources\views\admin\features\index.blade.php` | Inline JS |
| `resources\views\admin\locations\index.blade.php` | Inline JS |
| `resources\views\admin\tags\index.blade.php` | Inline JS |
| `resources\views\admin\types\index.blade.php` | Inline JS |

---

## 📂 Operational Show & Form Views
| File Path | Issue Type |
| :--- | :--- |
| `resources\views\admin\product-orders\create.blade.php` | Inline Styles (Borders/Widths) |
| `resources\views\admin\product-orders\show.blade.php` | Legacy Inline Print Logic |
| `resources\views\admin\tickets\index.blade.php` | Inline JS logic |
| `resources\views\admin\job-applications\show.blade.php` | Inline Print Styles |
| `resources\views\admin\service-quotes\show.blade.php` | Inline Styles |
| `resources\views\admin\classified-inquiries\show.blade.php` | Inline Styles |
| `resources\views\admin\email-templates\edit.blade.php` | Inline JS logic |
| `resources\views\admin\newsletter-subscribers\index.blade.php` | Inline JS logic |
| `resources\views\admin\notifications\index.blade.php` | Inline Styles |
| `resources\views\admin\menu\edit.blade.php` | Inline Styles & JS |
| `resources\views\admin\menu\index.blade.php` | Inline JS logic |

---

## 📂 Settings Explorer (Infrastructure)
| File Path | Issue Type |
| :--- | :--- |
| `resources\views\admin\settings\partials\apis.blade.php` | Inline Styles |
| `resources\views\admin\settings\partials\contact.blade.php` | Inline Styles |
| `resources\views\admin\settings\partials\general.blade.php` | Inline Styles |
| `resources\views\admin\settings\partials\modules.blade.php` | Inline Styles |
| `resources\views\admin\settings\partials\pages.blade.php` | Inline Styles |
| `resources\views\admin\settings\partials\seo.blade.php` | Inline Styles |
| `resources\views\admin\settings\partials\social.blade.php` | Inline Styles |
| `resources\views\admin\themes\index.blade.php` | Inline JS logic |

---

## 🛠️ Global Remediation Protocol
1. **JavaScript**: Extract all logic from `<script>` tags to `public/admin-assets/pages/`.
2. **CSS**: Extract all `<style>` blocks and `style="..."` attributes to `public/admin-assets/admin-custom.css`.
3. **Event Listeners**: Replace `onclick/onchange` with delegated listeners in `global.js`.
