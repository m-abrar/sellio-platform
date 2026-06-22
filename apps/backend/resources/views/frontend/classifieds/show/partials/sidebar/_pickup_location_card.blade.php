<div class="detail-sidebar-card mb-4 overflow-hidden">
    <div class="card-header border-0 p-4" style="background:var(--primary-color)">
        <h5 class="fw-800 mb-0 text-white"><i class="bi bi-pin-map-fill me-2"></i>{{ __('Pickup Location') }}</h5>
    </div>
    <div class="p-4">
        <p class="fw-semibold text-dark mb-1">{{ $classified->city }}, {{ $classified->state ?? $classified->country }}</p>
        <p class="text-muted small mb-3">
            {{ $classified->address ?? __('Contact seller for exact address') }}
        </p>

        @if ($classified->latitude && $classified->longitude)
            <div id="map-placeholder"></div>
            <p class="small text-end mt-2 text-muted">{{ __('Coordinates provided by seller') }}</p>
        @else
            <div class="p-3 rounded-3 small" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15);border-left:4px solid var(--primary-color)">
                <i class="bi bi-info-circle me-2" style="color:var(--primary-color)"></i>
                {{ __('Location not precise. Contact seller for details.') }}
            </div>
        @endif
    </div>
</div>
