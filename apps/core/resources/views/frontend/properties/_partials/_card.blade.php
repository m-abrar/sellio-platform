@php
    /** * We use $iteration (passed from the @forelse loop) 
     * to stagger the AOS animations 
     */
    $delay = ($iteration ?? 1) * 100;

    $status = $property->is_rental ? 'RENTAL' : ($property->is_sale ? 'SALE' : 'NEW');
    $statusColor = match($status) {
        'SALE'   => 'bg-danger text-white',
        'RENTAL' => 'bg-warning text-dark',
        default  => 'bg-primary text-white'
    };
@endphp

<div class="col" data-aos="fade-up" data-aos-delay="{{ $delay }}">
    <a href="{{ route('properties.show', $property->slug) }}" class="listing-card glass-surface h-100 text-decoration-none text-dark d-flex flex-column hover-lift">
        
        {{-- Media Container --}}
        <div class="img-container position-relative overflow-hidden" style="aspect-ratio: 4/3;">
            <div class="listing-card-img h-100">
                <img src="{{ $property->primary_image_url }}" 
                     alt="{{ $property->title }} in {{ $property->location?->title ?? '' }}"
                     class="transition-img w-100 h-100 object-fit-cover"
                     loading="lazy">
            </div>
            
            <span class="badge property-status-badge position-absolute top-0 end-0 m-3 rounded-pill shadow-sm fw-800 {{ $property->status_color }}">
                {{ __($property->status_label) }}
            </span>

            <div class="position-absolute bottom-0 start-0 m-3">
                <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 px-3 py-1 shadow-sm">
                    <span class="price-text-sm fw-800">
                        @if($property->is_sale)
                            {{ setting('currency_symbol', '$') }}{{ number_format($property->sale_price ?? $property->base_price) }}
                        @else
                            {{ setting('currency_symbol', '$') }}{{ number_format($property->price_per_night) }}<small class="opacity-75">/{{ __('night') }}</small>
                        @endif
                    </span>
                </div>
            </div>
        </div>

        {{-- Content Body --}}
        <div class="card-body p-3 d-flex flex-column flex-grow-1">
            <h6 class="property-title fw-800 mb-1 text-truncate">
                {{ $property->title }}
            </h6>
            
            <div class="property-location text-muted mb-3 text-truncate small">
                <i class="bi bi-geo-alt-fill text-danger me-1"></i>
                {{ $property->location->title ?? __('Location Private') }}
            </div>

            <div class="row g-0 pt-3 border-top mt-auto">
                <div class="col-4 text-center border-end">
                    <span class="metric-label d-block text-muted smallest">{{ __('BEDS') }}</span>
                    <span class="metric-value fw-800 text-primary">{{ $property->number_of_bedrooms ?? '0' }}</span>
                </div>
                <div class="col-4 text-center border-end">
                    <span class="metric-label d-block text-muted smallest">{{ __('BATHS') }}</span>
                    <span class="metric-value fw-800 text-primary">{{ $property->number_of_bathrooms ?? '0' }}</span>
                </div>
                <div class="col-4 text-center">
                    @if(!is_null($property->area_sq_ft))
                        <span class="metric-label d-block text-muted small">{{ __('SQFT') }}</span>
                        <span class="metric-value fw-800 text-primary">{{ number_format($property->area_sq_ft) }}</span>
                    @elseif(!is_null($property->area_sq_m))
                        <span class="metric-label d-block text-muted small">{{ __('SQM') }}</span>
                        <span class="metric-value fw-800 text-primary">{{ number_format($property->area_sq_m) }}</span>
                    @else
                        <span class="metric-label d-block text-muted small">{{ __('AREA') }}</span>
                        <span class="metric-value fw-800 text-primary">N/A</span>
                    @endif
                </div>
            </div>
        </div>
    </a>
</div>
