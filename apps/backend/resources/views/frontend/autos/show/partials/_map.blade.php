<div class="map-wrapper rounded-4 overflow-hidden border border-color-light shadow-sm bg-white">
    {{-- Google Maps Embed logic --}}
    @php
        $latitude = $auto->latitude ?? '40.7128'; 
        $longitude = $auto->longitude ?? '-74.0060';
        $locationQuery = !empty($auto->address) ? urlencode($auto->address . ' ' . $auto->city) : $latitude . ',' . $longitude;
    @endphp

    <div class="ratio ratio-21x9">
        <iframe 
            width="100%" 
            height="100%" 
            class="border-0" style="filter: grayscale(0.2) contrast(1.1);" 
            allowfullscreen="" 
            loading="lazy" 
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps/embed/v1/place?key={{ config('services.google_maps.key') }}&q={{ $locationQuery }}">
        </iframe>
    </div>

    {{-- Map Footer: Dealer Address Bar --}}
    <div class="p-3 bg-glass-light border-top border-color-light">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div class="d-flex align-items-start">
                <div class="icon-circle-theme me-3" style="width: 40px; height: 40px; min-width: 40px;">
                    <i class="bi bi-geo-alt-fill text-primary-color"></i>
                </div>
                <div>
                    <h6 class="fw-800 text-dark mb-0">{{ $auto->user->name ?? __('Premium Dealership') }}</h6>
                    <p class="text-muted small mb-0">{{ $auto->address }}, {{ $auto->city }}, {{ $auto->state }}</p>
                </div>
            </div>
            
            <div class="d-flex gap-2">
                <a href="https://www.google.com/maps/dir/?api=1&destination={{ $locationQuery }}" 
                   target="_blank" 
                   class="btn btn-white btn-sm border px-3 rounded-pill fw-bold">
                    <i class="bi bi-signpost-2 me-1"></i> {{ __('Get Directions') }}
                </a>
            </div>
        </div>
    </div>
</div>
