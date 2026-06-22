@if ($auto->features->isNotEmpty())
    <div class="amenities-grid">
        @foreach ($auto->features as $feature)
            <div class="amenity-chip">
                <i class="bi bi-check2-circle amenity-chip__icon" aria-hidden="true"></i>
                <span class="amenity-chip__label">{{ $feature->title }}</span>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted small">{{ __('Standard equipment included. Contact dealer for full options list.') }}</p>
@endif
