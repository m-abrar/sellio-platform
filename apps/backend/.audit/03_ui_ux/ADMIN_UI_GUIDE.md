# Admin UI Guide

This document describes the UI patterns and components used in the Sellio admin panel.

## Table of Contents

- [Pagination](#pagination)
- [Search Filters](#search-filters)
- [SweetAlert Dialogs](#sweetalert-dialogs)
- [Extending Components](#extending-components)

---

## Pagination

All admin list views use **15 items per page** with Bootstrap-4 styled pagination.

### Implementation Pattern

```blade
@if($collection->hasPages())
    <div class="card-footer bg-white border-0 py-3">
        <div class="float-right">
            {{ $collection->appends(request()->query())->links('pagination::bootstrap-4') }}
        </div>
    </div>
@endif
```

### Modules Using This Pattern

- Products (15 per page)
- Properties (15 per page)
- Services (15 per page)
- Classifieds (15 per page)
- Jobs (15 per page)
- Events
- Autos
- Locations, Categories, Types, Amenities, Features, Tags, Brands
- Bookings (various types)

---

## Search Filters

Each module includes a filter card with module-specific search criteria.

### Implementation Pattern

```blade
<div class="card card-outline card-secondary shadow-sm mb-4">
    <div class="card-body py-4">
        <form action="{{ route('admin.module.index') }}" method="GET">
            <div class="row align-items-end">
                <div class="col-md-3">
                    <label class="small text-muted font-weight-bold uppercase letter-spacing-1">Field Label</label>
                    <div class="input-group shadow-xs">
                        <div class="input-group-prepend">
                            <span class="input-group-text bg-white border-right-0">
                                <i class="fas fa-search text-muted text-xs"></i>
                            </span>
                        </div>
                        <input type="text" name="field" class="form-control border-left-0" 
                               placeholder="Filter by..." value="{{ request('field') }}">
                    </div>
                </div>
                <!-- Additional filters -->
                <div class="col-md-2 d-flex align-items-end" style="gap: 10px;">
                    <button type="submit" class="btn btn-primary flex-fill font-weight-bold shadow-xs">
                        <i class="fas fa-filter mr-1"></i> APPLY
                    </button>
                    <a href="{{ route('admin.module.index') }}" class="btn btn-default font-weight-bold shadow-xs">
                        <i class="fas fa-undo"></i>
                    </a>
                </div>
            </div>
        </form>
    </div>
</div>
```

### Best Practices

- Use `select2` for dropdown filters
- Preserve query params with `$collection->appends(request()->query())`
- Always include reset button to clear filters
- Use consistent field naming (`name="field"` matches controller `request('field')`)

---

## SweetAlert Dialogs

Delete confirmations use **SweetAlert2** for consistent, styled confirmations.

### Configuration

SweetAlert2 is globally enabled in `config/adminlte.php`:

```php
'Sweetalert2' => [
    'active' => true,
    'files' => [
        [
            'type' => 'js',
            'asset' => false,
            'location' => '//cdn.jsdelivr.net/npm/sweetalert2@11',
        ],
    ],
],
```

### Usage Pattern

Include the partial in your blade template:

```blade
@include('admin._partials._sweetalert-delete')
```

The partial automatically converts native `confirm()` dialogs to SweetAlert2.

### HTML Structure Required

```blade
<form action="{{ route('admin.module.destroy', $item->id) }}" method="POST" class="d-inline">
    @csrf
    @method('DELETE')
    <button type="submit" class="btn btn-default btn-sm text-danger"
            data-toggle="tooltip" title="Delete"
            onclick="return confirm('Are you sure you want to delete this item?')">
        <i class="fas fa-trash-alt"></i>
    </button>
</form>
```

### Modules Using SweetAlert

- Products
- Properties
- Services
- Classifieds
- Jobs
- Events
- Autos
- Bookings

---

## Extending Components

### Adding to a New Module

1. Create index blade: `resources/views/admin/{module}/index.blade.php`
2. Add filter card with form
3. Add data table with proper classes
4. Add pagination footer
5. Include SweetAlert partial before `@endsection`
6. Add controller pagination: `Model::paginate(15)`

### UI Classes Reference

| Class | Purpose |
|-------|---------|
| `card-outline card-secondary shadow-sm` | Filter card container |
| `card-primary card-outline shadow-sm` | Data table container |
| `table table-hover table-premium` | Data table |
| `table-img-preview shadow-xs` | Thumbnail cells |
| `btn-group-premium shadow-sm` | Action buttons |
| `shadow-xs` | Subtle element shadows |
| `float-right` | Pagination alignment |

### Null-Safe Property Access

Always use null-safe access for optional relationships:

```blade
{{ $model?->relationship?->property }}
```

---

## Related Files

- `config/adminlte.php` - Plugin configuration
- `resources/views/admin/_partials/_sweetalert-delete.blade.php` - Delete handler
- `resources/views/admin/_partials/_sweetalert.blade.php` - General alerts
- `resources/views/pagination/bootstrap-4.blade.php` - Pagination template