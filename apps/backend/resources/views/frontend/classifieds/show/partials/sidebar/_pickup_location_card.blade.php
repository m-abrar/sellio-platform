<div class="card detail-sidebar-card mb-4 overflow-hidden">
    <div class="card-header border-0 p-4" style="background:var(--primary-color)">
        <h4 class="fw-800 mb-0 text-white"><i class="bi bi-pin-map-fill me-2"></i>{{ __('Pickup Location') }}</h4>
    </div>
    <div class="p-4">
        <div class="d-flex align-items-start gap-3 mb-3">
            <div class="rounded-2 flex-shrink-0 d-flex align-items-center justify-content-center mt-1" style="width:36px;height:36px;background:rgba(var(--primary-color-rgb),.08)">
                <i class="bi bi-geo-alt-fill" style="color:var(--primary-color)"></i>
            </div>
            <div>
                <p class="fw-semibold text-dark mb-0">{{ $classified->city }}{{ $classified->state ? ', '.$classified->state : '' }}{{ $classified->country ? ', '.$classified->country : '' }}</p>
                <p class="text-muted small mb-0">{{ $classified->address ?? __('Contact seller for exact address') }}</p>
            </div>
        </div>

        @if ($classified->latitude && $classified->longitude)
            <div id="map-placeholder" class="rounded-3 overflow-hidden" style="height:160px;background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.07)"></div>
            <p class="small mt-2 mb-0 text-muted text-end">
                <i class="bi bi-info-circle me-1"></i>{{ __('Coordinates provided by seller') }}
            </p>
        @else
            <div class="p-3 rounded-3 small" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15);border-left:4px solid var(--primary-color)">
                <i class="bi bi-info-circle me-2" style="color:var(--primary-color)"></i>
                {{ __('Exact location shared after contact.') }}
            </div>
        @endif
    </div>
</div>
