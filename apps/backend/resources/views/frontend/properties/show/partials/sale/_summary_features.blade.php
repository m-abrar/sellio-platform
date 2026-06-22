<div class="property-key-facts d-flex flex-wrap border border-color-light rounded-3 overflow-hidden bg-white">
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-door-open key-fact-icon"></i>
        <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_bedrooms ?? 0 }}</span>
        <span class="small text-muted">{{ __('Bedrooms') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-droplet-half key-fact-icon"></i>
        <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_bathrooms ?? 0 }}</span>
        <span class="small text-muted">{{ __('Bathrooms') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-arrows-angle-expand key-fact-icon"></i>
        <span class="d-block fw-800 text-dark fs-5">{{ $property->area_formatted }}</span>
        <span class="small text-muted">{{ __('Total Area') }}</span>
    </div>
    @if($property->number_of_parking_spots > 0)
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-car-front key-fact-icon"></i>
        <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_parking_spots }}</span>
        <span class="small text-muted">{{ __('Parking') }}</span>
    </div>
    @endif
    @if($property->year_built)
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-calendar3 key-fact-icon"></i>
        <span class="d-block fw-800 text-dark fs-5">{{ $property->year_built }}</span>
        <span class="small text-muted">{{ __('Built') }}</span>
    </div>
    @endif
</div>
