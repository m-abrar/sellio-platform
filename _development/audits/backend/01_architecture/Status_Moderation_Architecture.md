# Status Moderation & UI Synchronization Architecture

This document outlines the centralized status moderation and UI badge synchronization system implemented across the Sellio administrative backend.

## 1. Core Architecture

The system is built around the `App\Traits\Models\HasStatusModeration` trait, which decouples model-level status logic from the view layer. This ensures that UI metadata (labels, colors, icons) is consistent across all marketplace verticals.

### 1.1 The Trait: `HasStatusModeration`

- **Location**: `app/Traits/Models/HasStatusModeration.php`
- **Key Method**: `getStatusMeta()`
- **Purpose**: Returns an array containing `label`, `color`, and `icon` based on the model's current state.

### 1.2 Unified UI Logic

The trait handles two primary status implementations:
1. **Boolean-based**: Uses `is_published` and `approved_at` (legacy/common marketplace entities).
2. **String-based**: Uses a `status` column (standardized for new/complex entities like Advertisements).

## 2. Integration Protocol

To integrate a new model into the "Executive Premium" status system:

### 2.1 Model Layer
1. Import the trait: `use App\Traits\Models\HasStatusModeration;`.
2. Use it in the class body.
3. (Optional) If the model has unique status strings, update the `match` expression in the trait.

### 2.2 View Layer (Registry Index)
Replace hardcoded `if/else` badge logic with the following pattern:

```blade
@php $status = $item->getStatusMeta(); @endphp
<span class="badge badge-{{ $status['color'] }}-light px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
    <i class="fas fa-{{ $status['icon'] }} mr-1"></i> {{ $status['label'] }}
</span>
```

### 2.3 View Layer (Forms/Edit)
The shared `admin/_partials/_form-actions.blade.php` automatically detects the presence of the trait and renders a status badge in the sidebar for any model instance.

## 3. Supported Verticals

The following models are currently synchronized:
- `Property`
- `Auto`
- `Event`
- `JobListing`
- `Service`
- `Classified`
- `Product`
- `Blog`
- `Advertisement`
- `Campaign`

## 4. Unified Marketplace View

The `ListingController` hydrates generic marketplace objects into their respective Eloquent models during union queries, allowing the `getStatusMeta()` API to work seamlessly even in the unified "All Listings" registry.

---
*Created: May 2026*
