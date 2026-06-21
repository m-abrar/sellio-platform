<div class="classified-detail-header mb-4">
    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
        <span class="badge bg-light-primary text-primary rounded-2 px-3 py-2 fw-semibold small">
            {{ $classified->category?->title ?? __('General') }}
        </span>
        @if ($classified->is_featured)
            <span class="badge bg-danger text-white rounded-2 px-3 py-2 fw-semibold small">
                <i class="bi bi-patch-check-fill me-1"></i>{{ __('Featured') }}
            </span>
        @endif
    </div>

    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-3">
        <h1 class="fw-800 display-6 mb-0 text-dark">{{ $classified->title }}</h1>

        <div class="classified-detail-header__price text-lg-end">
            <span class="metric-label d-block">{{ __('Price') }}</span>
            <span class="price-text-large text-primary">{{ $classified->price_formatted }}</span>
        </div>
    </div>

    <div class="product-detail-meta bg-white border rounded-4 p-3 p-md-4">
        <div class="d-flex flex-wrap align-items-center gap-3 gap-md-4 small">
            <span class="text-muted">
                <i class="bi bi-clock me-1"></i>{{ __('Posted :time', ['time' => $classified->created_at->diffForHumans()]) }}
            </span>

            @if ($classified->is_for_rent)
                <span class="text-warning fw-800"><i class="bi bi-house-door me-1"></i>{{ __('For Rent') }}</span>
            @elseif ($classified->is_for_sale)
                <span class="text-success fw-800"><i class="bi bi-tag me-1"></i>{{ __('For Sale') }}</span>
            @endif

            @if($classified->location || $classified->city)
                <span class="text-muted">
                    <i class="bi bi-geo-alt me-1"></i>
                    {{ $classified->location?->title ?? $classified->city }}
                </span>
            @endif

            <span class="text-muted">
                <i class="bi bi-eye me-1"></i>
                {{ trans_choice('{0} No Views|{1} 1 View|[2,*] :count Views', $classified->views_count ?? 0) }}
            </span>
        </div>
    </div>
</div>
