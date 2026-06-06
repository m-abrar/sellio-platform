@php
    /** * Stagger the AOS animations using the loop iteration
     */
    $delay = ($iteration ?? 1) * 100;
@endphp

<div class="col" data-aos="fade-up" data-aos-delay="{{ $delay }}">
    <a href="{{ route('autos.show', $auto->slug) }}" 
       class="listing-card glass-surface h-100 text-decoration-none text-dark d-flex flex-column hover-lift shadow-sm rounded-4">
        
        {{-- Media Container --}}
        <div class="img-container position-relative overflow-hidden rounded-top-4" style="aspect-ratio: 16/9;">
            <div class="listing-card-img h-100">
                <img src="{{ $auto->primary_image_url }}" 
                     alt="{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}" 
                     class="transition-img w-100 h-100 object-fit-cover" 
                     loading="lazy">
            </div>
            
            {{-- Badges --}}
            <div class="position-absolute top-0 end-0 m-2 m-md-3 d-flex flex-column gap-2">
                @if(is_numeric($auto->sale_price) && $auto->sale_price > 0 && $auto->sale_price < $auto->base_price)
                    <span class="badge bg-danger text-white rounded-pill px-2 px-md-3 py-1 py-md-2 shadow-sm fw-800 border border-white border-opacity-25">
                        {{ __('SALE') }}
                    </span>
                @elseif($auto->is_featured)
                    <span class="badge bg-warning text-dark rounded-pill px-2 px-md-3 py-1 py-md-2 shadow-sm fw-800 border border-dark border-opacity-10">
                        {{ __('FEATURED') }}
                    </span>
                @endif

                @if(isset($auto->engine_type) && strtolower($auto->engine_type) === 'electric')
                    <span class="badge bg-info text-white rounded-pill px-2 px-md-3 py-1 py-md-2 shadow-sm fw-800">
                        <i class="bi bi-lightning-fill me-1"></i>EV
                    </span>
                @endif
            </div>

            {{-- Price Overlay --}}
            <div class="position-absolute bottom-0 start-0 m-2 m-md-3">
                <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 px-2 px-md-3 py-1 py-md-2 shadow-sm">
                    <span class="fw-800 price-font">
                        @if($auto->sale_price > 0 && $auto->sale_price < $auto->base_price)
                            <span class="text-warning">${{ number_format($auto->sale_price) }}</span>
                            <small class="text-white text-decoration-line-through opacity-50 ms-1" style="font-size: 0.7rem;">${{ number_format($auto->base_price) }}</small>
                        @else
                            ${{ number_format($auto->base_price) }}
                        @endif
                    </span>
                </div>
            </div>
        </div>

        {{-- Content Body --}}
        <div class="card-body p-3 d-flex flex-column flex-grow-1">
            <div class="mb-2">
                <h6 class="property-title fw-800 mb-1 text-dark text-truncate">
                    {{ $auto->year }} {{ $auto->make }} {{ $auto->model }}
                </h6>
                <div class="property-location text-muted d-flex align-items-center text-truncate small">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                    {{ $auto->location->title ?? __('Global') }}
                </div>
            </div>
            
            {{-- Metrics Row --}}
            <div class="row g-0 pt-3 border-top mt-auto align-items-center">
                <div class="col-4 text-center border-end">
                    <span class="metric-label d-block opacity-75 small text-uppercase" style="font-size: 0.6rem;">{{ __('Mileage') }}</span>
                    <span class="metric-value fw-800 text-primary small">{{ $auto->mileage_formatted ?? 'N/A' }}</span>
                </div>
                <div class="col-4 text-center border-end px-1">
                    <span class="metric-label d-block opacity-75 small text-uppercase" style="font-size: 0.6rem;">{{ __('Gear') }}</span>
                    <span class="metric-value fw-800 text-primary text-truncate d-block small">{{ $auto->transmission ?? 'N/A' }}</span>
                </div>
                <div class="col-4 text-center">
                    <span class="metric-label d-block opacity-75 small text-uppercase" style="font-size: 0.6rem;">{{ __('Fuel') }}</span>
                    <span class="metric-value fw-800 text-primary small">{{ ucfirst($auto->engine_type ?? 'Gas') }}</span>
                </div>
            </div>
        </div>
    </a>
</div>