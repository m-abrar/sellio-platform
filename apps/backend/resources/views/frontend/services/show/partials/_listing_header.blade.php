<div class="service-header-container pt-4">
    <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
        <i class="bi {{ $service->category->icon ?? 'bi-tools' }} me-1"></i>{{ $service->category->title ?? __('Service') }}
    </p>

    <div class="d-flex justify-content-between align-items-start mb-2">
        <h1 class="display-5 text-dark mb-0 tracking-tight lh-sm pe-md-4">{{ $title }}</h1>
        <div class="d-flex gap-2 flex-shrink-0 mt-1">
            <button class="btn btn-sm border fw-semibold px-3 rounded-2" title="{{ __('Save') }}"><i class="bi bi-heart me-1"></i>{{ __('Save') }}</button>
            <button class="btn btn-sm border fw-semibold px-3 rounded-2" title="{{ __('Share') }}"><i class="bi bi-share me-1"></i>{{ __('Share') }}</button>
        </div>
    </div>

    <p class="text-muted mb-3 d-flex align-items-center gap-2">
        <i class="bi bi-geo-alt-fill lc-geo-icon small"></i>
        {{ $service->city }}, {{ $service->state }}
        @if($service->service_radius)
            <span class="ms-1 small opacity-75">({{ __('Servicing within :km km', ['km' => $service->service_radius]) }})</span>
        @endif
    </p>

    <div class="d-flex align-items-baseline gap-3 flex-wrap mb-2">
        @if($service->sale_price)
            <h2 class="fw-800 mb-0 display-6" style="color:var(--primary-color)">{{ setting('currency_symbol', '$') }}{{ number_format($service->sale_price) }}</h2>
            <del class="text-muted fs-5">{{ setting('currency_symbol', '$') }}{{ number_format($service->base_price) }}</del>
        @elseif($service->base_price)
            <h2 class="fw-800 mb-0 display-6" style="color:var(--primary-color)">{{ setting('currency_symbol', '$') }}{{ number_format($service->base_price) }}</h2>
        @else
            <span class="fw-semibold fs-5" style="color:var(--primary-color)">{{ __('By Quote') }}</span>
        @endif
        <span class="small fw-semibold text-muted">
            {{ $service->is_subscription ? __('/ month') : __('deposit') }}
        </span>
        @if($service->is_featured)
            <span class="fw-semibold px-2 py-1 rounded-2 small" style="background:rgba(15,23,42,.85);color:#fff">
                <i class="bi bi-star-fill me-1" style="color:var(--primary-color)"></i>{{ __('Featured') }}
            </span>
        @endif
    </div>

    @if($reviews > 0)
    <div class="d-flex align-items-center gap-2 small text-muted mt-1">
        <i class="bi bi-star-fill" style="color:var(--primary-color)"></i>
        <span class="fw-semibold text-dark">{{ $rating }}</span>
        <span>({{ trans_choice(':count review|:count reviews', $reviews, ['count' => $reviews]) }})</span>
    </div>
    @endif
</div>
