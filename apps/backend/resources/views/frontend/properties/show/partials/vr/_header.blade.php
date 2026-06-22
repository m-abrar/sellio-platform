<header class="property-title-block mb-4">
    <h1 class="display-5 text-dark mb-2 tracking-tight lh-sm">
        {{ $property->title }}
    </h1>

    <div class="d-flex flex-wrap align-items-center gap-3 mb-3">
        @if ($property->reviews->isNotEmpty())
            @php
                $averageRating = number_format($property->reviews->avg('rating'), 1);
                $reviewCount = $property->reviews->count();
            @endphp
            <span class="d-flex align-items-center gap-1 fw-semibold small">
                <i class="bi bi-star-fill text-warning" style="font-size:.75rem"></i>
                {{ $averageRating }}
                <span class="text-muted fw-normal">({{ $reviewCount }} {{ __('reviews') }})</span>
            </span>
            <span class="text-muted opacity-50">·</span>
        @endif

        <span class="text-muted small d-flex align-items-center gap-1">
            <i class="bi bi-geo-alt-fill text-muted small"></i>
            {{ $property->address ?? $property->city }}
        </span>

        @if($property->is_featured)
            <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-2 fw-semibold">
                <i class="bi bi-award me-1"></i>{{ __('Guest favourite') }}
            </span>
        @endif

        <div class="d-flex gap-2 ms-auto">
            <button type="button" class="btn btn-sm border fw-semibold px-3 rounded-2">
                <i class="bi bi-share me-1"></i>{{ __('Share') }}
            </button>
            <button type="button" class="btn btn-sm border fw-semibold px-3 rounded-2">
                <i class="bi bi-heart me-1"></i>{{ __('Save') }}
            </button>
        </div>
    </div>

    <div class="d-flex align-items-baseline gap-2">
        <h2 class="fw-800 text-primary mb-0 display-6">
            {{ format_currency($property->price_per_night, 0) }}
        </h2>
        <span class="text-muted fs-5">/{{ __('night') }}</span>
        <span class="text-muted small">{{ __('starting from') }}</span>
    </div>
</header>
