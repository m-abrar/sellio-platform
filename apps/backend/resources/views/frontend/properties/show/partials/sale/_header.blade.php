<header class="property-title-block mb-4">
    <h1 class="display-5 text-dark mb-2 tracking-tight lh-sm">
        {{ $property->title }}
    </h1>

    <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
        @if($property->is_featured)
            <span class="fw-semibold px-3 py-1 rounded-2 small" style="background:var(--primary-color);color:#fff">
                <i class="bi bi-patch-check-fill me-1"></i>{{ __('Featured') }}
            </span>
        @endif

        <span class="badge badge-outline-theme px-3 py-1 rounded-2 fw-semibold">
            <i class="bi bi-house-door me-1"></i>{{ $property->category->title ?? __('Property') }}
        </span>

        <span class="badge badge-outline-dark px-3 py-1 rounded-2 fw-semibold">
            <i class="bi bi-tag me-1"></i>{{ $property->type->title ?? __('Property') }}
        </span>

        @if($property->is_new)
            <span class="fw-semibold px-3 py-1 rounded-2 small" style="background:var(--primary-color);color:#fff">
                {{ __('New listing') }}
            </span>
        @endif
    </div>

    <p class="text-muted mb-3 d-flex align-items-center gap-2">
        <i class="bi bi-geo-alt-fill text-muted small"></i>
        {{ collect([$property->address, $property->city])->filter()->join(', ') }}
    </p>

    <div class="d-flex align-items-baseline gap-2">
        <h2 class="fw-800 mb-0 display-6" style="color:var(--primary-color)">{{ $property->price_formatted ?? __('Price on request') }}</h2>
        <span class="text-muted small fw-semibold">{{ __('Asking Price') }}</span>
    </div>
</header>
