@php
    $delay = ($iteration ?? 1) * 100;
    $areaLabel = __('AREA');
    $areaValue = __('N/A');

    if (! is_null($property->area_sq_ft)) {
        $areaLabel = __('SQFT');
        $areaValue = number_format($property->area_sq_ft);
    } elseif (! is_null($property->area_sq_m)) {
        $areaLabel = __('SQM');
        $areaValue = number_format($property->area_sq_m);
    }
@endphp

<a href="{{ route('properties.show', $property->slug) }}"
   class="listing-card property-listing-card h-100 text-decoration-none text-dark d-flex flex-column hover-lift"
   data-aos="fade-up"
   data-aos-delay="{{ $delay }}">
    <div class="img-container property-listing-card__media position-relative overflow-hidden">
        <div class="listing-card-img h-100">
            <img src="{{ $property->primary_image_url }}"
                 alt="{{ $property->title }} {{ __('in') }} {{ $property->location?->title ?? '' }}"
                 class="transition-img w-100 h-100 object-fit-cover"
                 loading="lazy">
        </div>

        <span class="badge property-status-badge position-absolute top-0 end-0 rounded-2 fw-semibold {{ $property->status_color }}">
            {{ __($property->status_label) }}
        </span>

        <div class="position-absolute bottom-0 start-0 m-3">
            <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 shadow-sm">
                <span class="price-text-sm fw-800">
                    {{ $property->price_formatted_k ?? __('Price on request') }}
                </span>
            </div>
        </div>
    </div>

    <div class="card-body property-listing-card__body p-3 d-flex flex-column flex-grow-1">
        <h6 class="property-title fw-800 mb-1">
            {{ $property->title }}
        </h6>

        <div class="property-location text-muted mb-3 text-truncate small">
            <i class="bi bi-geo-alt-fill lc-geo-icon me-1"></i>
            {{ $property->location->title ?? __('Location Private') }}
        </div>

        <div class="property-listing-card__metrics row g-0 pt-3 border-top mt-auto">
            <div class="col-4 text-center border-end">
                <span class="metric-label d-block text-muted">{{ __('BEDS') }}</span>
                <span class="metric-value fw-800 text-primary">{{ $property->number_of_bedrooms ?? '0' }}</span>
            </div>
            <div class="col-4 text-center border-end">
                <span class="metric-label d-block text-muted">{{ __('BATHS') }}</span>
                <span class="metric-value fw-800 text-primary">{{ $property->number_of_bathrooms ?? '0' }}</span>
            </div>
            <div class="col-4 text-center">
                <span class="metric-label d-block text-muted">{{ $areaLabel }}</span>
                <span class="metric-value fw-800 text-primary">{{ $areaValue }}</span>
            </div>
        </div>
    </div>
</a>
