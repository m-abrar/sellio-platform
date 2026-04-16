<div class="col">
    <a href="{{ route('autos.show', $auto->slug) }}" class="listing-card glass-surface h-100 text-decoration-none text-dark d-flex flex-column transition-all shadow-hover rounded-4">
        
        {{-- Media Container --}}
        <div class="img-container position-relative overflow-hidden rounded-top-4">
            <div class="listing-card-img aspect-ratio-16-9">
                <img src="{{ $auto->primary_image_url }}" 
                     alt="{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}" 
                     class="transition-img w-100 h-100 object-fit-cover" 
                     loading="lazy">
            </div>
            
            {{-- Badges - Restored Desktop Sizes, Smaller on Mobile --}}
            <div class="position-absolute top-0 end-0 m-2 m-md-3 d-flex flex-column gap-1">
                @if(is_numeric($auto->sale_price) && $auto->sale_price > 0 && $auto->sale_price < $auto->base_price)
                    <span class="badge bg-danger text-white rounded-pill px-2 px-md-3 py-1 py-md-2 shadow-sm fw-800 border border-white border-opacity-25 auto-badge">
                        {{ __('SALE') }}
                    </span>
                @elseif($auto->is_featured)
                    <span class="badge bg-warning text-dark rounded-pill px-2 px-md-3 py-1 py-md-2 shadow-sm fw-800 border border-dark border-opacity-10 auto-badge">
                        {{ __('FEATURED') }}
                    </span>
                @endif

                @if(isset($auto->engine_type) && strtolower($auto->engine_type) === 'electric')
                    <span class="badge bg-info text-white rounded-pill px-2 px-md-3 py-1 py-md-2 shadow-sm fw-800 auto-badge">
                        <i class="bi bi-lightning-fill me-1"></i>EV
                    </span>
                @endif
            </div>

            {{-- Price Overlay - Restored Desktop Boldness --}}
            <div class="position-absolute bottom-0 start-0 m-2 m-md-3">
                <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 px-2 px-md-3 py-1 py-md-2 shadow-sm">
                    <span class="fw-800 price-font">
                        @if($auto->sale_price > 0 && $auto->sale_price < $auto->base_price)
                            <span class="text-warning">${{ number_format($auto->sale_price) }}</span>
                        @else
                            ${{ number_format($auto->base_price) }}
                        @endif
                    </span>
                </div>
            </div>
        </div>

        {{-- Content Body - Responsive Padding --}}
        <div class="card-body p-2 p-md-3 d-flex flex-column flex-grow-1">
            <div class="mb-2 mb-md-3">
                <h6 class="property-title fw-800 mb-1 text-dark text-truncate">
                    {{ $auto->year }} {{ $auto->make }} {{ $auto->model }}
                </h6>
                <div class="property-location text-muted d-flex align-items-center text-truncate small">
                    <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                    {{ $auto->location->title ?? __('Global') }}
                </div>
            </div>
            
            {{-- Metrics Row - Uses 'metric-label' to match CSS variables --}}
            <div class="row g-0 pt-2 pt-md-3 border-top mt-auto align-items-center">
                <div class="col-4 text-center border-end">
                    <span class="metric-label">{{ __('MILEAGE') }}</span>
                    <span class="metric-value fw-800">{{ $auto->mileage_formatted ?? 'N/A' }}</span>
                </div>
                <div class="col-4 text-center border-end px-1">
                    <span class="metric-label">{{ __('GEAR') }}</span>
                    <span class="metric-value fw-800 text-truncate px-1 d-block">{{ $auto->transmission ?? 'N/A' }}</span>
                </div>
                <div class="col-4 text-center">
                    <span class="metric-label">{{ __('FUEL') }}</span>
                    <span class="metric-value fw-800">{{ ucfirst($auto->engine_type) ?? 'Gas' }}</span>
                </div>
            </div>
        </div>
    </a>
</div>
