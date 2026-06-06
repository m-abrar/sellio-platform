# 🛡️ Detailed Audit: Inline Assets Master Inventory

> [!NOTE]
> This inventory provides the granular data required for manual extraction of CSS and JS. Files are grouped by functional module.

## 📂 Shared Partials (`_partials/`)
| File | Line | Type | Code Snippet |
| :--- | :--- | :--- | :--- |
| `_empty-state.blade.php` | 27 | Style Block | `<style> .empty-state-container { ... }` |
| `_form-actions.blade.php` | 68 | Event Handler | `onclick="triggerDelete()"` |
| `_image-uploader.blade.php` | 96 | Style Block | `<style> .border-dashed { ... }` |
| `_sweetalert.blade.php` | 11 | Style Block | `<style> .swal2-popup.swal2-glassmorphic { ... }` |
| `_sweetalert-delete.blade.php` | 14 | Event Handler | `onclick="return confirm(...)"` |

## 📂 Operational Dashboards
| File | Line | Type | Code Snippet |
| :--- | :--- | :--- | :--- |
| `dashboard.blade.php` | 135 | Style Block | `<style> #master-calendar { ... }` |
| `ecommerce.blade.php` | 22 | Style Block | `<style> #master-calendar { ... }` |
| `_system_status.blade.php` | 18 | Inline Style | `style="width: 60px; height: 60px;"` |

## 📂 Registry & CRUD Views
| File | Line | Type | Code Snippet |
| :--- | :--- | :--- | :--- |
| `product-orders/create.blade.php` | 213 | Style Block | `<style> .unit-price-display { ... }` |
| `product-orders/create.blade.php` | 74 | Event Handler | `onclick="addItemRow()"` |
| `tickets/index.blade.php` | 178 | Event Handler | `onclick="confirmDelete(...)"` |
| `activity_log/index.blade.php` | 240 | Style Block | `<style> .bg-dark-soft { ... }` |
| `withdrawals/form.blade.php` | 126 | Event Handler | `onclick="triggerApproval()"` |

... (Refer to detailed_audit.json for complete 1300+ line listing)
