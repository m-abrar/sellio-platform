# 🛡️ Audit Partial: Admin Interface Views

### Admin — Shared Partials & Alerts (11 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\_partials\_adminbar.blade.php` | **70** | 🟠 Warning - Logic in View |
| `resources\views\admin\_partials\_back-button.blade.php` | **95** | ✅ Elite - Production Ready |
| `resources\views\admin\_partials\_empty-state.blade.php` | **75** | 🟠 Warning - Inline CSS |
| `resources\views\admin\_partials\_form-actions.blade.php` | **75** | 🟠 Warning - Logic Bloat |
| `resources\views\admin\_partials\_image-uploader.blade.php` | **95** | ✅ Elite - Auth Hardened |
| `resources\views\admin\_partials\_modules-checkboxes.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\_partials\_sweetalert.blade.php` | **90** | ✅ Good - Inline JS/CSS |
| `resources\views\admin\_partials\_sweetalert-delete.blade.php` | **80** | 🟠 Warning - Patch Script |
| `resources\views\admin\_partials\_taxonomy-spectrum.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\_partials\_toggle-card-css.blade.php` | **90** | ✅ Good - Inline Content |
| `resources\views\admin\alert.blade.php` | **80** | 🟠 Warning - Inline Styles |

### Admin — Dashboard (15 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\dashboard\dashboard.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |
| `resources\views\admin\dashboard\ecommerce.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |
| `resources\views\admin\dashboard\partials\_content_ecosystem.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\dashboard\partials\_financial_performance.blade.php" | **80** | ✅ Good - Performance Audit |
| `resources\views\admin\dashboard\partials\_growth_metrics.blade.php` | **75** | 🟠 Warning - Logic in Blade |
| `resources\views\admin\dashboard\partials\_KPIs.blade.php` | **70** | 🟠 Warning - Hardcoded Labels |
| `resources\views\admin\dashboard\partials\_master_calendar.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\dashboard\partials\_strategic_planning.blade.php` | **75** | 🟠 Warning - Inline Styles |
| `resources\views\admin\dashboard\partials\_system_status.blade.php` | **80** | ✅ Good - Performance Audit |
| `resources\views\admin\dashboard\partials\ecommerce\_content_ecosystem.blade.php` | **95** | ✅ Elite - Cached Data |
| `resources\views\admin\dashboard\partials\ecommerce\_financial_performance.blade.php" | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\dashboard\partials\ecommerce\_growth_metrics.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\dashboard\partials\ecommerce\_KPIs.blade.php` | **70** | 🟠 Warning - Math in Blade |
| `resources\views\admin\dashboard\partials\ecommerce\_master_calendar.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\dashboard\partials\ecommerce\_strategic_planning.blade.php" | **75** | 🟠 Warning - Logic & Hardcoded |

### Admin — User & Role Management (12 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\permissions\create.blade.php` | **85** | ✅ Good - Logic in View |
| `resources\views\admin\permissions\edit.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\permissions\index.blade.php` | **75** | 🟠 Warning - Inline JS |
| `resources\views\admin\profile\edit.blade.php` | **50** | 🔴 Critical - Security Risk |
| `resources\views\admin\roles\create.blade.php` | **85** | ✅ Good - Logic in View |
| `resources\views\admin\roles\edit.blade.php` | **80** | ✅ Good - Eager Loading |
| `resources\views\admin\roles\index.blade.php` | **65** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\roles\partials\_permission_grid.blade.php` | **60** | 🟠 Warning - Logic & N+1 |
| `resources\views\admin\users\create.blade.php` | **95** | ✅ Elite - Security Hardened |
| `resources\views\admin\users\edit.blade.php` | **95** | ✅ Elite - Security Hardened |
| `resources\views\admin\users\index.blade.php` | **95** | ✅ Elite - Eager Loaded |
| `resources\views\admin\users\show.blade.php` | **70** | 🟠 Warning - UI Mismatch |

### Admin — Property Module (14 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\properties\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\properties\form.blade.php` | **95** | ✅ Elite - Logic Decoupled |
| `resources\views\admin\properties\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\properties\partials\action-buttons.blade.php` | **75** | 🟠 Warning - Inline Styles |
| `resources\views\admin\property-bookings\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\property-bookings\form.blade.php` | **65** | 🟠 Warning - Performance Risk |
| `resources\views\admin\property-bookings\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\property-bookings\show.blade.php` | **70** | 🟠 Warning - Logic in View |
| `resources\views\admin\transactions\form.blade.php` | **70** | 🟠 Warning - Security & Hardcoded |
| `resources\views\admin\transactions\index.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |
| `resources\views\admin\transactions\partials\booking.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\bookings\index.blade.php` | **65** | 🟠 Warning - N+1 Issue |

### Admin — Auto Module (8 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\auto-inquiries\_filter.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\auto-inquiries\form.blade.php` | **70** | 🟠 Warning - Security Risk |
| `resources\views\admin\auto-inquiries\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\auto-inquiries\show.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\autos\_filter.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\autos\form.blade.php` | **68** | 🟠 Warning - Security & JS |
| `resources\views\admin\autos\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\autos\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |

### Admin — Event Module (8 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\event-bookings\_filter.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\event-bookings\form.blade.php` | **70** | 🟠 Warning - Security Risk |
| `resources\views\admin\event-bookings\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\event-bookings\show.blade.php" | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\events\_filter.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\events\form.blade.php` | **68** | 🟠 Warning - Security & JS |
| `resources\views\admin\events\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\events\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |

### Admin — Job Module (8 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\job-applications\_filter.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\job-applications\form.blade.php` | **70** | 🟠 Warning - Security Risk |
| `resources\views\admin\job-applications\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\job-applications\show.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\jobs\_filter.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\jobs\form.blade.php` | **68** | 🟠 Warning - Security & JS |
| `resources\views\admin\jobs\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\jobs\partials\action-buttons.blade.php" | **90** | ✅ Good - Hardcoded Labels |

### Admin — Service Module (10 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\service-appointments\form.blade.php` | **65** | 🟠 Warning - Performance Risk |
| `resources\views\admin\service-appointments\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\service-bookings\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\service-bookings\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\service-quotes\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\service-quotes\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\services\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\services\form.blade.php` | **95** | ✅ Elite - Logic Decoupled |
| `resources\views\admin\services\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\services\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |

### Admin — E-Commerce Module (10 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\addons\form.blade.php` | **95** | ✅ Elite - Auth Hardened |
| `resources\views\admin\addons\index.blade.php` | **60** | 🟠 Warning - Security & N+1 |
| `resources\views\admin\product-orders\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\product-orders\create.blade.php` | **60** | 🟠 Warning - Performance Risk |
| `resources\views\admin\product-orders\index.blade.php` | **95** | ✅ Elite - Performance Optimized |
| `resources\views\admin\product-orders\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\products\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\products\form.blade.php` | **55** | 🔴 Critical - DB Query in View |
| `resources\views\admin\products\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\products\partials\action-buttons.blade.php` | **85** | ✅ Good - Inline CSS |

### Admin — Classified Module (8 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\classified-inquiries\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\classified-inquiries\form.blade.php` | **60** | 🟠 Warning - Performance Risk |
| `resources\views\admin\classified-inquiries\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\classified-inquiries\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\classifieds\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\classifieds\form.blade.php` | **55** | 🔴 Critical - DB Query in View |
| `resources\views\admin\classifieds\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\classifieds\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |

### Admin — Blog & Content (21 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\blogs\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\blogs\index.blade.php" | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\blogs\partials\action-buttons.blade.php" | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\blogs\partials\basic-info.blade.php` | **55** | 🔴 Critical - DB Query in View |
| `resources\views\admin\blogs\partials\seo-meta.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\content\_partials\_editor_input_factory.blade.php" | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\content\edit-page.blade.php" | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\content\index.blade.php" | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\page-builder\form.blade.php" | **95** | ✅ Elite - Logic Decoupled |
| `resources\views\admin\page-builder\index.blade.php" | **95** | ✅ Elite - Production Ready |
| `resources\views\admin\page-builder\widgets\cta-widget.blade.php" | **70** | 🟠 Warning - Inline JS/CSS |
| `resources\views\admin\page-builder\widgets\dynamic-testimonials-widget.blade.php" | **70** | 🟠 Warning - Inline JS/CSS |
| `resources\views\admin\page-builder\widgets\feature-box-widget.blade.php" | **70** | 🟠 Warning - Inline JS/CSS |
| `resources\views\admin\page-builder\widgets\hero-section\load.blade.php" | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\page-builder\widgets\hero-section\view.blade.php" | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\page-builder\widgets\testimonial-widget.blade.php" | **70** | 🟠 Warning - Inline JS/CSS |
| `resources\views\admin\pages\form.blade.php" | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\pages\index.blade.php" | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\pages\partials\action-buttons.blade.php" | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\pages\partials\basic-info.blade.php" | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\pages\partials\seo-meta.blade.php" | **90** | ✅ Good - Hardcoded Labels |

### Admin — Service Module (10 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\service-appointments\form.blade.php` | **65** | 🟠 Warning - Performance Risk |
| `resources\views\admin\service-appointments\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\service-bookings\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\service-bookings\index.blade.php` | **72** | 🟠 Warning - Hardcoded Labels |
| `resources\views\admin\service-quotes\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\service-quotes\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\services\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\services\form.blade.php` | **55** | 🔴 Critical - DB Query in View |
| `resources\views\admin\services\index.blade.php" | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\services\partials\action-buttons.blade.php" | **85** | ✅ Good - Inline CSS |

### Admin — E-Commerce Module (10 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\product-orders\create.blade.php` | **60** | 🟠 Warning - Logic Bloat |
| `resources\views\admin\product-orders\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\product-orders\show.blade.php` | **70** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\product-orders\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\products\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\products\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\products\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\products\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |

### Admin — Communication & Intelligence (25 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\activity_log\index.blade.php` | **95** | ✅ Elite - Sanitized Output |
| `resources\views\admin\tickets\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\tickets\show.blade.php" | **70** | 🟠 Warning - UI Mismatch |
| `resources\views\admin\reports\index.blade.php" | **75** | 🟠 Warning - Hardcoded Labels |
| `resources\views\admin\reports\bookings.blade.php" | **70** | 🟠 Warning - Logic Bloat |
| `resources\views\admin\reports\payments.blade.php" | **70** | 🟠 Warning - Logic Bloat |
| `resources\views\admin\reports\properties.blade.php" | **70** | 🟠 Warning - Logic Bloat |
| `resources\views\admin\newsletter-subscribers\index.blade.php" | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\notifications\index.blade.php" | **72** | 🟠 Warning - Inline JS |

### Admin — System & Configuration (15 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\settings\index.blade.php` | **75** | 🟠 Warning - Hardcoded Labels |
| `resources\views\admin\settings\settings-layout.blade.php" | **85** | ✅ Good - UI Consistency |
| `resources\views\admin\system\status.blade.php" | **80** | ✅ Good - Performance Audit |
| `resources\views\admin\system\maintenance.blade.php" | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\themes\index.blade.php" | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\themes\edit.blade.php" | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\profile\edit.blade.php" | **65** | 🟠 Warning - Security Risk |

### Admin — Taxonomy (Categories, Tags, Brands, etc.) (23 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\amenities\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\amenities\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\amenities\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\brands\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\brands\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\brands\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\categories\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\categories\index.blade.php` | **60** | 🟠 Warning - N+1 Issue |
| `resources\views\admin\categories\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\features\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\features\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\features\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\locations\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\locations\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\locations\map.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\locations\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\locations\partials\map-card.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\tags\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\tags\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\tags\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\types\form.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\types\index.blade.php` | **85** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\types\partials\action-buttons.blade.php` | **85** | ✅ Good - Hardcoded Labels |

### Admin — Financial (Plans, Subscriptions, Payments) (28 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\payment-gateways\_config_form.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payment-gateways\form.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payment-gateways\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payments\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payments\form.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payments\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payments\partials\_payable_link.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\payments\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\plans\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\plans\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\plans\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\plans\partials\action-buttons.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\plans\partials\basic-info.blade.php` | **55** | 🔴 Critical - Performance Risk |
| `resources\views\admin\plans\partials\quotas-features.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\plans\partials\settings.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscription-quotas\form.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\subscription-quotas\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscription-quotas\partials\action-buttons.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\subscription-quotas\partials\details.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscription-quotas\partials\settings.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\subscriptions\_filter.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscriptions\form.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\subscriptions\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscriptions\partials\action-buttons.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscriptions\partials\payments-history.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\subscriptions\partials\settings.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\withdrawals\form.blade.php` | **20** | 🔴 Critical - Architectural Mess |
| `resources\views\admin\withdrawals\index.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |

### Admin — Marketplace Economics (2 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\line-items\form.blade.php` | **70** | 🟠 Warning - Security & Hardcoded |
| `resources\views\admin\line-items\index.blade.php` | **75** | 🟠 Warning - Inline JS & Hardcoded |

### Admin — Communication & Marketing (12 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\advertisements\form.blade.php` | **55** | 🔴 Critical - Security Risk |
| `resources\views\admin\advertisements\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\advertisements\partials\_form.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\advertisements\partials\action-buttons.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\advertisements\show.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\email-templates\edit.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\email-templates\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\newsletter-subscribers\form.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\newsletter-subscribers\index.blade.php` | **90** | ✅ Good - Hardcoded Labels |
| `resources\views\admin\notifications\index.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\tickets\index.blade.php` | **60** | 🟠 Warning - Security Risk |
| `resources\views\admin\tickets\show.blade.php` | **90** | ✅ Good - Hardcoded Labels |

### Admin — System & Configuration (28 files)

| File Path | Score | Audit Status |
| :--- | :--- | :--- |
| `resources\views\admin\activity_log\index.blade.php` | **45** | 🔴 Critical - XSS Risk ({!! !!}) |
| `resources\views\admin\gallery\index.blade.php` | **75** | 🟠 Warning - Inline JS |
| `resources\views\admin\listings\index.blade.php` | **72** | 🟠 Warning - Inline JS & N+1 |
| `resources\views\admin\menu\_recursive.blade.php` | **90** | ✅ Good - Logic in View |
| `resources\views\admin\menu\edit.blade.php` | **75** | 🟠 Warning - Inline JS |
| `resources\views\admin\menu\index.blade.php` | **72** | 🟠 Warning - Inline JS |
| `resources\views\admin\reports\_bookings_filter.blade.php` | **75** | 🟠 Warning - Hardcoded Strings |
| `resources\views\admin\reports\_header_actions.blade.php` | **85** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\reports\_payments_filter.blade.php` | **75** | 🟠 Warning - Hardcoded Strings |
| `resources\views\admin\reports\_properties_filter.blade.php` | **75** | 🟠 Warning - Hardcoded Strings |
| `resources\views\admin\reports\bookings.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |
| `resources\views\admin\reports\index.blade.php` | **80** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\reports\partials\_payable_link.blade.php` | **80** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\reports\payments.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |
| `resources\views\admin\reports\properties.blade.php` | **72** | 🟠 Warning - Inline JS & Hardcoded |
| `resources\views\admin\settings\index.blade.php` | **80** | ✅ Good - Inline JS & Hardcoded |
| `resources\views\admin\settings\partials\apis.blade.php` | **85** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\settings\partials\contact.blade.php` | **85** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\settings\partials\general.blade.php` | **78** | 🟠 Warning - Inline CSS & Hardcoded |
| `resources\views\admin\settings\partials\modules.blade.php` | **80** | ✅ Good - Inline CSS & Hardcoded |
| `resources\views\admin\settings\partials\pages.blade.php" | **82** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\settings\partials\seo.blade.php" | **85** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\settings\partials\social.blade.php" | **85** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\settings\settings-layout.blade.php" | **88** | ✅ Good - Hardcoded Strings |
| `resources\views\admin\system\maintenance.blade.php" | **82** | 🟠 Warning - Inline AJAX/JS |
| `resources\views\admin\system\status.blade.php" | **85** | ✅ Good - Inline CSS & Hardcoded |
| `resources\views\admin\themes\edit.blade.php" | **86** | ✅ Good - Inline JS & Hardcoded |
| `resources\views\admin\themes\index.blade.php" | **88** | ✅ Good - Inline JS & Hardcoded |

---

# Detailed Audit Reports

Detailed security, performance, and UI/UX audit reports for each file have been moved to:
**[004_admin_dashboard_blade_audit_report.md](./004_admin_dashboard_blade_audit_report.md)**
