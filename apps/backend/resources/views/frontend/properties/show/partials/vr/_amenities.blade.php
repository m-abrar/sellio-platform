<section id="amenities" class="mt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h4 class="fw-800 text-dark mb-0 section-title">{{ __('What this home offers') }}</h4>
    </div>

    @if ($property->amenities->isNotEmpty())
        <div class="row g-4">
            @foreach($property->amenities as $amenity)
                <div class="col-md-6">
                    <div class="d-flex align-items-center py-2 border-bottom border-color-light">
                        <div class="amenity-icon-sm icon-circle-theme me-3">
                            <i class="{{ $amenity->icon ?? 'bi bi-check2-circle' }}"></i>
                        </div>
                        <span class="text-dark fw-medium">{{ $amenity->title }}</span>
                    </div>
                </div>
            @endforeach
        </div>
    @endif
</section>
