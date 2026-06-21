@if ($property->amenities->isNotEmpty())
    <div class="d-flex flex-wrap gap-2">
        @foreach($property->amenities as $amenity)
            <div class="amenity-chip d-flex align-items-center gap-1 px-3 py-2">
                <i class="{{ $amenity->icon ?? 'bi bi-check2-circle' }} text-primary me-2"></i>
                <span class="small fw-600 text-dark">{{ $amenity->title }}</span>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted">{{ __('No specific amenities listed.') }}</p>
@endif
