<a href="{{ route('autos.show', $auto->slug) }}" class="listing-card h-100 text-decoration-none text-dark d-flex flex-column transition-all shadow-hover rounded-4">
        
        {{-- Media Container --}}
        <div class="img-container position-relative overflow-hidden rounded-top-4">
            <div class="listing-card-img aspect-ratio-16-9">
                <img src="{{ $auto->primary_image_url }}" 
                     alt="{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}" 
                     class="transition-img w-100 h-100 object-fit-cover" 
                     loading="lazy">
            </div>
            
            {{-- Left badges --}}
            @if($auto->is_featured)
                <div class="position-absolute top-0 start-0 m-2 m-md-3">
                    <span class="badge rounded-2 px-2 px-md-3 py-1 py-md-2 fw-semibold auto-badge"
                          style="background:linear-gradient(135deg,#f59e0b,#f97316);color:#fff;">
                        <i class="bi bi-star-fill me-1"></i>{{ __('Featured') }}
                    </span>
                </div>
            @endif

            {{-- Right badges --}}
            <div class="position-absolute top-0 end-0 m-2 m-md-3 d-flex flex-column gap-1">
                @if($auto->on_sale)
                    <span class="badge bg-danger text-white rounded-2 px-2 px-md-3 py-1 py-md-2 fw-semibold auto-badge">
                        {{ __('Sale') }}
                    </span>
                @endif

                @if($auto->fuel_badge_label)
                    <span class="badge bg-info text-white rounded-2 px-2 px-md-3 py-1 py-md-2 fw-semibold auto-badge">
                        <i class="bi bi-lightning-fill me-1"></i>{{ __($auto->fuel_badge_label) }}
                    </span>
                @endif
            </div>

            {{-- Price Overlay - Restored Desktop Boldness --}}
            <div class="position-absolute bottom-0 start-0 m-2 m-md-3">
                <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 px-2 px-md-3 py-1 py-md-2 shadow-sm">
                    <span class="fw-800 price-font">
                        @if($auto->on_sale)
                            <span class="text-warning">{{ $auto->sale_price_formatted }}</span>
                        @else
                            {{ $auto->base_price_formatted ?? __('Price on request') }}
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
                    <i class="bi bi-geo-alt-fill lc-geo-icon me-1"></i>
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
