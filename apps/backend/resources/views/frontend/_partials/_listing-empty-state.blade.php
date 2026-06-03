@php
    $icon = $icon ?? 'bi-search';
    $title = $title ?? __('No Results Found');
    $description = $description ?? __('Try adjusting your filters to find what you are looking for.');
    $route = $route ?? url()->current();
    $label = $label ?? __('Reset All Filters');
@endphp

<div class="col-12 text-center py-5">
    <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
        <i class="bi {{ $icon }} display-1 text-muted opacity-25 mb-3"></i>
        <h4 class="fw-bold text-dark">{{ $title }}</h4>
        <p class="text-muted mb-4">{{ $description }}</p>
        <a href="{{ $route }}" class="btn btn-primary rounded-pill px-4">
            <i class="bi bi-arrow-clockwise me-2"></i>{{ $label }}
        </a>
    </div>
</div>
