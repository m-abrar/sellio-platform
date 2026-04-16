<div class="key-features-grid">
    <div class="row g-3">
        {{-- Bed --}}
        <div class="col-6 col-md-4">
            <div class="feature-card p-3 rounded-4 bg-light border d-flex align-items-center gap-3">
                <div class="icon-box bg-white text-primary shadow-sm rounded-3 p-2">
                    <i class="fa-solid fa-bed fs-4"></i>
                </div>
                <div>
                    <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_bedrooms ?? '0' }}</span>
                    <span class="text-muted small">{{ __('Bedrooms') }}</span>
                </div>
            </div>
        </div>

        {{-- Bath --}}
        <div class="col-6 col-md-4">
            <div class="feature-card p-3 rounded-4 bg-light border d-flex align-items-center gap-3">
                <div class="icon-box bg-white text-primary shadow-sm rounded-3 p-2">
                    <i class="fa-solid fa-bath fs-4"></i>
                </div>
                <div>
                    <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_bathrooms ?? '0' }}</span>
                    <span class="text-muted small">{{ __('Bathrooms') }}</span>
                </div>
            </div>
        </div>

        {{-- Area --}}
        <div class="col-6 col-md-4">
            <div class="feature-card p-3 rounded-4 bg-light border d-flex align-items-center gap-3">
                <div class="icon-box bg-white text-primary shadow-sm rounded-3 p-2">
                    <i class="bi bi-rulers fs-4"></i>
                </div>
                <div>
                    <span class="d-block fw-800 text-dark fs-5">{{ $property->area_formatted }}</span>
                    <span class="text-muted small">{{ __('Total Area') }}</span>
                </div>
            </div>
        </div>

        {{-- Parking --}}
        @if($property->number_of_parking_spots > 0)
        <div class="col-6 col-md-4">
            <div class="feature-card p-3 rounded-4 bg-light border d-flex align-items-center gap-3">
                <div class="icon-box bg-white text-primary shadow-sm rounded-3 p-2">
                    <i class="bi bi-car-front fs-4"></i>
                </div>
                <div>
                    <span class="d-block fw-800 text-dark fs-5">{{ $property->number_of_parking_spots }}</span>
                    <span class="text-muted small">{{ __('Parking') }}</span>
                </div>
            </div>
        </div>
        @endif

        {{-- Built Year --}}
        @if($property->year_built)
        <div class="col-6 col-md-4">
            <div class="feature-card p-3 rounded-4 bg-light border d-flex align-items-center gap-3">
                <div class="icon-box bg-white text-primary shadow-sm rounded-3 p-2">
                    <i class="bi bi-calendar3 fs-4"></i>
                </div>
                <div>
                    <span class="d-block fw-800 text-dark fs-5">{{ $property->year_built }}</span>
                    <span class="text-muted small">{{ __('Year Built') }}</span>
                </div>
            </div>
        </div>
        @endif
    </div>
</div>
