<div class="card glass-surface p-4">
    <h5 class="fw-bold mb-3"><i class="bi bi-pin-map-fill me-2"></i>{{ __('Pickup Location') }}</h5>
    <p class="mb-0 fw-semibold">{{ $classified->city }}, {{ $classified->state ?? $classified->country }}</p>
    <p class="text-muted small mb-3">
        {{ $classified->address ?? __('Contact seller for exact address') }}
    </p>

    {{-- Map Placeholder (using dynamic coordinates) --}}
    @if ($classified->latitude && $classified->longitude)
        <div id="map-placeholder">

        </div>
        <p class="small text-end mt-2">{{ __('Coordinates provided by seller') }}</p>
    @else
        <div class="alert alert-warning small">{{ __('Location not precise. Contact seller for details.') }}</div>
    @endif
</div>
