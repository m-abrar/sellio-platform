<div class="service-header-container pt-4">
    {{-- 1. Status & Pricing Row (Full Width) --}}
    <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
        {{-- Integrated Pricing Badge --}}
        <div class="price-badge-premium d-flex align-items-center shadow-sm me-2">
            <span class="price-amount px-3 py-2 fw-800">
                @if($service->sale_price)
                    ${{ number_format($service->sale_price) }}
                @elseif($service->base_price)
                    ${{ number_format($service->base_price) }}
                @else
                    {{ __('By Quote') }}
                @endif
            </span>
            <span class="price-label px-2 py-2 small fw-bold text-uppercase tracking-tighter">
                {{ $service->is_subscription ? __('Monthly') : __('Deposit') }}
            </span>
        </div>

        @if($service->is_featured)
            <span class="badge bg-dark text-white px-3 py-2 rounded-pill fw-bold small">
                <i class="bi bi-star-fill text-warning me-1"></i> {{ __('Featured') }}
            </span>
        @endif
        
        <span class="badge bg-primary-light text-primary-color px-3 py-2 rounded-pill fw-bold small">
            <i class="bi bi-award-fill me-1"></i> {{ __('Level') }}: {{ $service->expertise_level }}
        </span>

        @if($service->is_project_based)
            <span class="badge bg-info-light text-info px-3 py-2 rounded-pill fw-bold small">
                <i class="bi bi-briefcase-fill me-1"></i> {{ __('Project') }}
            </span>
        @endif
    </div>

    {{-- 2. Full-Width Title & Global Actions --}}
    <div class="row align-items-start g-0">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <h1 class="fw-800 display-5 mb-0 text-dark tracking-tight pe-md-4">
                    {{ $service->title }}
                </h1>
                
                {{-- Action Buttons --}}
                <div class="d-flex gap-2 flex-shrink-0 mt-1">
                    <button class="btn btn-icon-glass shadow-sm" title="{{ __('Save') }}"><i class="bi bi-heart"></i></button>
                    <button class="btn btn-icon-glass shadow-sm" title="{{ __('Share') }}"><i class="bi bi-share"></i></button>
                </div>
            </div>

            <p class="text-muted fs-5 fw-500 mb-0">
                <i class="bi bi-geo-alt text-primary me-1"></i> 
                {{ $service->city }}, {{ $service->state }} 
                @if($service->service_radius)
                    <span class="text-muted ms-2 small opacity-75">({{ __('Servicing within') }} {{ $service->service_radius }}km)</span>
                @endif
            </p>
        </div>
    </div>
</div>