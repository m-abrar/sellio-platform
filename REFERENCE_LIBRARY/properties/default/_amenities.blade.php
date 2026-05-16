@if ($property->amenities->isNotEmpty())
    <div class="d-flex flex-wrap gap-2">
        @foreach($property->amenities as $amenity)
            <div class="amenity-chip d-flex align-items-center bg-white border rounded-pill px-3 py-2 shadow-sm">
                <i class="{{ $amenity->icon ?? 'bi bi-check2-circle' }} text-primary me-2"></i>
                <span class="small fw-600 text-dark">{{ $amenity->title }}</span>
            </div>
        @endforeach
    </div>
@else
    <p class="text-muted">No specific amenities listed.</p>
@endif