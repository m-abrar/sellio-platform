<div class="property-key-facts d-flex flex-wrap border border-color-light rounded-3 overflow-hidden bg-white">
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <span class="d-block fw-800 text-dark fs-5">{{ $property->booking_guest_capacity ?? $property->maximum_guests ?? 1 }}</span>
        <span class="small text-muted">{{ __('Sleeps') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_bedrooms ?? 0 }}</span>
        <span class="small text-muted">{{ __('Bedrooms') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_bathrooms ?? 0 }}</span>
        <span class="small text-muted">{{ __('Bathrooms') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <span class="d-block fw-800 text-dark fs-5">{{ $property->minimum_rental_days ?? 1 }}</span>
        <span class="small text-muted">{{ __('Min. Nights') }}</span>
    </div>
</div>
