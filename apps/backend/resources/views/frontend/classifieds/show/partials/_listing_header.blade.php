<div class="classified-detail-header mb-4">
    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
        <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color)">
            {{ $classified->category?->title ?? __('General') }}
        </span>
        @if ($classified->is_featured)
            <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:var(--primary-color);color:#fff">
                <i class="bi bi-patch-check-fill me-1"></i>{{ __('Featured') }}
            </span>
        @endif
    </div>

    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-3">
        <h1 class="fw-800 display-6 mb-0 text-dark">{{ $classified->title }}</h1>

        <div class="classified-detail-header__price text-lg-end">
            <span class="metric-label d-block">{{ __('Price') }}</span>
            <span class="price-text-large" style="color:var(--primary-color)">{{ $classified->price_formatted }}</span>
        </div>
    </div>

    <div class="product-detail-meta p-3 p-md-4 rounded-4" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
        <div class="d-flex flex-wrap align-items-center gap-3 gap-md-4 small">
            <span class="text-muted">
                <i class="bi bi-clock me-1"></i>{{ __('Posted :time', ['time' => $classified->created_at->diffForHumans()]) }}
            </span>

            @if ($classified->is_for_rent)
                <span class="fw-800" style="color:var(--primary-color)"><i class="bi bi-house-door me-1"></i>{{ __('For Rent') }}</span>
            @elseif ($classified->is_for_sale)
                <span class="fw-800" style="color:var(--primary-color)"><i class="bi bi-tag me-1"></i>{{ __('For Sale') }}</span>
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
