@php
    $isOnSale = $auto->on_sale ?? false;
    $isFeatured = $auto->is_featured ?? false;
    $fuelBadgeLabel = $auto->fuel_badge_label ?? null;
@endphp

<a href="{{ route('autos.show', $auto->slug) }}"
   class="listing-card h-100 text-decoration-none text-dark d-flex flex-column hover-lift rounded-4">

        {{-- Media --}}
        <div class="img-container position-relative overflow-hidden rounded-top-4" style="aspect-ratio: 16/9;">
            <div class="listing-card-img h-100">
                <img src="{{ $auto->primary_image_url }}"
                     alt="{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}"
                     class="transition-img w-100 h-100 object-fit-cover"
                     loading="lazy"
                     onerror="this.onerror=null;this.src='{{ asset('images/fallbacks/default-card.svg') }}';">
            </div>

            {{-- Badges --}}
            <div class="position-absolute top-0 end-0 m-2 m-md-3 d-flex flex-column gap-2">
                @if($isOnSale)
                    <span class="badge bg-danger text-white rounded-2 px-2 px-md-3 py-1 shadow-sm">{{ __('Sale') }}</span>
                @elseif($isFeatured)
                    <span class="badge bg-warning text-dark rounded-2 px-2 px-md-3 py-1 shadow-sm">{{ __('Featured') }}</span>
                @endif
                @if($fuelBadgeLabel)
                    <span class="badge bg-info text-white rounded-2 px-2 px-md-3 py-1 shadow-sm">
                        <i class="bi bi-lightning-fill me-1"></i>{{ __($fuelBadgeLabel) }}
                    </span>
                @endif
            </div>

            {{-- Price Overlay --}}
            <div class="position-absolute bottom-0 start-0 m-2 m-md-3">
                <div class="price-overlay text-white px-2 px-md-3 py-1">
                    <span class="fw-700 price-font">
                        @if($isOnSale)
                            <span class="text-warning">{{ $auto->sale_price_formatted ?? $auto->price_formatted ?? __('Price on request') }}</span>
                            <small class="text-white text-decoration-line-through opacity-50 ms-1 fs-xs">{{ $auto->base_price_formatted ?? null }}</small>
                        @else
                            {{ $auto->base_price_formatted ?? $auto->price_formatted ?? __('Price on request') }}
                        @endif
                    </span>
                </div>
            </div>
        </div>

        {{-- Content --}}
        <div class="card-body p-3 d-flex flex-column flex-grow-1">
            <div class="mb-2">
                <h6 class="property-title mb-1 text-dark">
                    {{ $auto->year }} {{ $auto->make }} {{ $auto->model }}
                </h6>
                <div class="property-location text-muted d-flex align-items-center text-truncate small">
                    <i class="bi bi-geo-alt-fill me-1 lc-geo-icon"></i>
                    {{ $auto->location->title ?? __('Global') }}
                </div>
            </div>

            {{-- Metrics --}}
            <div class="row g-0 pt-3 border-top mt-auto align-items-center">
                <div class="col-4 text-center border-end">
                    <span class="metric-label d-block">{{ __('Mileage') }}</span>
                    <span class="metric-value text-primary d-block">{{ $auto->mileage_formatted ?? __('N/A') }}</span>
                </div>
                <div class="col-4 text-center border-end px-1">
                    <span class="metric-label d-block">{{ __('Gear') }}</span>
                    <span class="metric-value text-primary text-truncate d-block">{{ $auto->transmission ?? __('N/A') }}</span>
                </div>
                <div class="col-4 text-center">
                    <span class="metric-label d-block">{{ __('Fuel') }}</span>
                    <span class="metric-value text-primary d-block">{{ ucfirst($auto->engine_type ?? __('Gas')) }}</span>
                </div>
            </div>
        </div>
</a>
