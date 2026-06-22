@if ($property->amenities->isNotEmpty())
    <div class="amenities-grid">
        @foreach($property->amenities as $amenity)
            <div class="amenity-chip">
                <i class="{{ $amenity->icon ?? 'bi bi-check2-circle' }} amenity-chip__icon" aria-hidden="true"></i>
                <span class="amenity-chip__label">{{ $amenity->title }}</span>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted">{{ __('No specific amenities listed.') }}</p>
@endif
