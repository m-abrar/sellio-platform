<div class="col">
    <a href="{{ route('classifieds.show', $classified->slug) }}" class="listing-card glass-surface h-100 text-decoration-none text-dark d-flex flex-column transition-all shadow-hover rounded-4">
        
        <div class="img-container position-relative overflow-hidden rounded-top-4">
            <div class="listing-card-img aspect-ratio-4-3">
                <img src="{{ $classified->primary_image_url }}" alt="{{ $classified->title }}" class="transition-img w-100 h-100 object-fit-cover">
            </div>
            
            {{-- Status Badge Logic: Uses is_featured trigger --}}
            <div class="position-absolute top-0 end-0 m-2">
                @if($classified->is_featured)
                    <span class="badge bg-danger text-white rounded-pill px-2 py-1 shadow-sm fw-800 border border-white border-opacity-25">
                        {{ __('FEATURED') }}
                    </span>
                @else
                    <span class="badge bg-dark bg-opacity-50 text-white rounded-pill px-2 py-1 shadow-sm fw-800 border border-white border-opacity-10 backdrop-blur">
                        {{ $classified->type->title ?? __('AD') }}
                    </span>
                @endif
            </div>

            {{-- Price Overlay Logic: Corrected to use base_price and sale_price --}}
            <div class="position-absolute bottom-0 start-0 m-2">
                <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 px-3 py-1 shadow-sm">
                    <span class="fw-800">
                        @if(is_numeric($classified->sale_price) && $classified->sale_price > 0 && $classified->sale_price < $classified->base_price)
                            <span class="text-warning">{{ setting('currency_symbol', '$') }}{{ number_format($classified->sale_price) }}</span>
                        @else
                            {{ setting('currency_symbol', '$') }}{{ is_numeric($classified->base_price) ? number_format($classified->base_price) : '0' }}
                        @endif
                    </span>
                </div>
            </div>
        </div>

        <div class="card-body p-3 d-flex flex-column flex-grow-1">
            <div class="mb-2">
                <span class="text-primary small fw-bold text-uppercase" style="letter-spacing: 0.5px;">{{ $classified->category?->title ?? __('General') }}</span>
                <h6 class="property-title fw-800 mb-1 text-dark text-truncate mt-1">
                    {{ $classified->title }}
                </h6>
            </div>

            {{-- Location Logic Fixed --}}
            <div class="property-location text-muted small mt-auto">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>{{ $classified->location->title ?? __('Local Area') }}
            </div>
            
            <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-3">
                <span class="small text-muted"><i class="bi bi-clock me-1"></i>{{ $classified->created_at->diffForHumans(null, true) }}</span>
                <span class="btn btn-primary-light btn-sm rounded-pill fw-bold" style="font-size: 0.7rem;">{{ __('View Details') }}</span>
            </div>
        </div>
    </a>
</div>