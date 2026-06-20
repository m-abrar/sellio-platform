<div class="listing-card glass-surface h-100 d-flex flex-column transition-all hover-up rounded-4 border-0 shadow-sm overflow-hidden">
    
    <div class="position-relative" style="height: 160px; overflow: hidden;">
        <img src="{{ $service->primary_image_url }}" 
             class="w-100 h-100 object-fit-cover transition-img" alt="{{ $service->title }}">
        
        <div class="position-absolute top-0 end-0 p-3 d-flex flex-column gap-2 align-items-end" style="z-index: 5;">
            @if ($service->is_featured)
                <span class="badge bg-warning text-dark fw-800 shadow-sm rounded-2">
                    <i class="bi bi-star-fill me-1"></i>{{ __('FEATURED') }}
                </span>
            @endif

            <span class="badge bg-white text-primary fw-700 shadow-sm rounded-2">
                @if ($service->is_project_based)
                    <i class="bi bi-briefcase me-1"></i>{{ __('Project-Based') }}
                @elseif ($service->is_subscription)
                    <i class="bi bi-arrow-repeat me-1"></i>{{ __('Subscription') }}
                @else
                    <i class="bi bi-hourglass me-1"></i>{{ __('Consultation') }}
                @endif
            </span>
        </div>
    </div>

    <div class="card-body p-4">
        <div class="d-flex align-items-center mb-3">
            <div class="service-icon-box p-2 rounded-3 me-3 bg-light text-primary border shadow-sm">
                <i class="{{ $service->category->icon ?? 'bi-gear' }} fs-4"></i>
            </div>
            <div>
                <h6 class="text-primary fw-700 mb-0 small">{{ $service->category->title ?? __('Professional Service') }}</h6>
                <h5 class="fw-800 text-dark mb-0">{{ $service->title }}</h5>
            </div>
        </div>

        <p class="text-muted small mb-4">
            {{ Str::limit(strip_tags($service->description), 140) }}
        </p>

        <div class="row g-0 pt-3 border-top mt-auto">
            <div class="col-6 border-end">
                <span class="metric-label text-uppercase text-muted d-block tiny">{{ __('Starting At') }}</span>
                <span class="metric-value fw-800 text-success fs-5">
                    @if ($service->sale_price)
                        ${{ number_format($service->sale_price, 0) }}
                    @elseif ($service->base_price)
                        ${{ number_format($service->base_price, 0) }}
                    @else
                        {{ __('Quote') }}
                    @endif
                </span>
            </div>
            <div class="col-6 text-end">
                <span class="metric-label text-uppercase text-muted d-block tiny">{{ __('Location') }}</span>
                <span class="metric-value fw-800 text-dark">
                    @if($service->location_id)
                        <i class="bi bi-geo-alt me-1 text-primary"></i>{{ $service->location->title ?? __('Local') }}
                    @else
                        <i class="bi bi-globe me-1 text-primary"></i>{{ __('Remote') }}
                    @endif
                </span>
            </div>
        </div>
    </div>

    <a href="{{ route('services.show', $service->slug) }}" class="stretched-link"></a>
</div>
