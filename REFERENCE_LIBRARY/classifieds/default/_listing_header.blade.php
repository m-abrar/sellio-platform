<div class="d-flex justify-content-between align-items-start mb-2 pt-3">
    {{-- Title with SEO consideration --}}
    <h1 class="fw-bold display-6 mb-0 text-dark">{{ $classified->title }}</h1>
    
    {{-- Price Tag using the Model Accessor --}}
    <span class="badge text-white fw-bold p-2 fs-5 bg-primary price-tag shadow-sm">
        {{ $classified->price_formatted }}
    </span>
</div>

{{-- Post Info & Action Buttons --}}
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <p class="lead text-muted mb-0 small">
        <span class="text-primary fw-bold">{{ $classified->category?->title ?? __('General') }}</span>
        <span class="mx-2 opacity-50">|</span>
        {{ __('Posted :time', ['time' => $classified->created_at->diffForHumans()]) }}
    </p>
    
    <div class="d-flex gap-2">
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" title="{{ __('Save to Watchlist') }}">
            <i class="bi bi-heart me-1"></i>{{ __('Save') }}
        </button>
        <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" title="{{ __('Share Listing') }}">
            <i class="bi bi-share me-1"></i>{{ __('Share') }}
        </button>
    </div>
</div>

{{-- Quick Stats (Status/Location/Views) --}}
<div class="d-flex align-items-center mb-4 small flex-wrap gap-3 border-bottom pb-4">
    @if ($classified->is_featured)
        <span class="text-danger fw-bold"><i class="bi bi-patch-check-fill me-1"></i> {{ __('Featured Ad') }}</span>
    @endif

    @if ($classified->is_for_rent)
        <span class="text-warning fw-bold"><i class="bi bi-house-door me-1"></i> {{ __('For Rent') }}</span>
    @elseif ($classified->is_for_sale)
        <span class="text-success fw-bold"><i class="bi bi-tag me-1"></i> {{ __('For Sale') }}</span>
    @endif
    
    @if($classified->location || $classified->city)
        <span class="text-muted">
            <i class="bi bi-geo-alt me-1"></i>
            {{ __('Location: :place', ['place' => $classified->location?->title ?? $classified->city]) }}
        </span>
    @endif

    <span class="text-muted">
        <i class="bi bi-eye me-1"></i> 
        {{ trans_choice('{0} No Views|{1} 1 View|[2,*] :count Views', $classified->views_count ?? 0) }}
    </span>
</div>