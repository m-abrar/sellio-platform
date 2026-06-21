<header class="page-title-section mb-4">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4">

        <div class="flex-grow-1">
            <div class="mb-2">
                @include('frontend.properties.show.partials._breadcrumbs')
            </div>

            <h1 class="fw-800 text-dark display-5 mb-2 tracking-tight">
                {{ $property->title }}
            </h1>

            <div class="d-flex flex-wrap align-items-center gap-3">
                @if ($property->reviews->isNotEmpty())
                    @php
                        $averageRating = number_format($property->reviews->avg('rating'), 1);
                        $reviewCount = $property->reviews->count();
                    @endphp
                    <div class="d-flex align-items-center bg-dark text-white px-3 py-1 rounded-2">
                        <i class="bi bi-star-fill text-warning me-2 small"></i>
                        <span class="fw-semibold me-1">{{ $averageRating }}</span>
                        <span class="opacity-50 small">({{ $reviewCount }} {{ __('reviews') }})</span>
                    </div>
                @endif

                <p class="text-muted mb-0 d-flex align-items-center gap-2">
                    <i class="bi bi-geo-alt lc-geo-icon"></i>
                    {{ $property->address ?? $property->city }}
                </p>

                @if($property->is_featured)
                    <span class="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1 rounded-2 fw-semibold">
                        <i class="bi bi-award me-1"></i>{{ __('Guest favourite') }}
                    </span>
                @endif
            </div>
        </div>

        <div class="text-lg-end flex-shrink-0">
            <div class="d-inline-block text-start text-lg-end">
                <span class="text-muted small text-uppercase fw-semibold tracking-wider d-block mb-1">
                    {{ __('Starting from') }}
                </span>
                <div class="d-flex align-items-baseline justify-content-lg-end gap-1">
                    <h2 class="fw-800 text-primary mb-0 display-6">
                        {{ format_currency($property->price_per_night, 0) }}
                    </h2>
                    <span class="text-muted fs-5">/{{ __('night') }}</span>
                </div>

                <div class="mt-3 d-flex gap-2 justify-content-lg-end">
                    <button type="button" class="btn btn-sm border fw-semibold px-3 rounded-2">
                        <i class="bi bi-share me-1"></i>{{ __('Share') }}
                    </button>
                    <button type="button" class="btn btn-sm border fw-semibold px-3 rounded-2">
                        <i class="bi bi-heart me-1"></i>{{ __('Save') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</header>
