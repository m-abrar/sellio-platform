<a href="{{ route('properties.show', $property->slug) }}"
   class="listing-card h-100 text-decoration-none text-dark d-flex flex-column hover-lift rounded-4 overflow-hidden">

        {{-- Media --}}
        <div class="img-container position-relative overflow-hidden rounded-top-4" style="aspect-ratio: 4/3;">
            <div class="listing-card-img h-100">
                <img src="{{ $property->primary_image_url }}"
                     alt="{{ $property->title }}"
                     class="transition-img w-100 h-100 object-fit-cover"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='{{ asset('images/fallbacks/default-card.svg') }}';">
            </div>

            <span class="badge property-status-badge position-absolute top-0 end-0 m-3 rounded-2 fw-600 {{ $property->status_color }}">
                {{ __($property->status_label) }}
            </span>

            <div class="position-absolute bottom-0 start-0 m-3">
                <div class="price-overlay text-white px-3 py-1">
                    <span class="price-text-sm fw-700">
                        {{ $property->price_formatted_k ?? __('Price on request') }}
                    </span>
                </div>
            </div>
        </div>

        {{-- Content --}}
        <div class="card-body p-3 d-flex flex-column flex-grow-1">
            <h6 class="property-title mb-1 text-dark">{{ $property->title }}</h6>

            <div class="property-location text-muted mb-3 text-truncate small">
                <i class="bi bi-geo-alt-fill me-1 lc-geo-icon"></i>
                {{ $property->location->title ?? __('Location Private') }}
            </div>

            <div class="row g-0 pt-3 border-top mt-auto">
                <div class="col-4 text-center border-end">
                    <div class="metric-label">{{ __('Beds') }}</div>
                    <div class="metric-value text-primary">{{ $property->number_of_bedrooms ?? '0' }}</div>
                </div>
                <div class="col-4 text-center border-end">
                    <div class="metric-label">{{ __('Baths') }}</div>
                    <div class="metric-value text-primary">{{ $property->number_of_bathrooms ?? '0' }}</div>
                </div>
                <div class="col-4 text-center">
                    <div class="metric-label">{{ !is_null($property->area_sq_m) ? __('SQM') : __('SQFT') }}</div>
                    <div class="metric-value text-primary">
                        {{ number_format($property->area_sq_ft ?? $property->area_sq_m ?? 0) }}
                    </div>
                </div>
            </div>
        </div>
</a>
