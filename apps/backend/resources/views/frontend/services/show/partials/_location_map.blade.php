{{-- 
    Expects: 
    $service -> The service model instance
    $isAddressOnly -> Boolean (true if no physical office)
    $isOffice -> Boolean (true if office-based consultation)
--}}

<div class="mt-5">
    <div class="d-flex align-items-start mb-4">
        <div class="icon-box-sm bg-primary-light text-primary me-3 mt-1">
            <i class="bi bi-geo-alt-fill"></i>
        </div>
        <div>
            @if (!($isAddressOnly ?? false) && $service?->address)
                <p class="text-dark fw-semibold mb-1">{{ $service->address }}</p>
                <p class="text-muted small mb-0">
                    {{ $service->city ?? '' }}{{ $service->state ? ', '.$service->state : '' }} {{ $service->zip_code ?? '' }}
                </p>
            @else
                <p class="text-dark fw-semibold mb-1">{{ __('Mobile / Remote Service') }}</p>
                <p class="text-muted small mb-0">{{ __('Available in') }} {{ $service->city ?? __('Specified Areas') }}</p>
            @endif
        </div>
    </div>

    {{-- Styled Map Placeholder --}}
    <div class="map-wrapper position-relative mb-4">
        <div class="map-container bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-4 border"
             style="height: 250px; background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%) !important;">
            
            <div class="position-absolute w-100 h-100 opacity-25" style="background-image: radial-gradient(#adb5bd 1px, transparent 1px); background-size: 20px 20px;"></div>
            
            <div class="text-center z-1">
                <div class="bg-white rounded-circle shadow-sm d-inline-flex align-items-center justify-content-center mb-2" style="width: 60px; height: 60px;">
                    <i class="bi bi-map text-primary fs-3"></i>
                </div>
                <p class="text-muted small fw-bold tracking-wider text-uppercase mb-0">{{ __('Interactive Map Loading...') }}</p>
            </div>
        </div>
        
        @if (!($isAddressOnly ?? false) && $service?->address)
            <a href="https://www.google.com/maps/search/?api=1&query={{ urlencode($service->address . ' ' . $service->city) }}" 
               target="_blank" 
               class="btn btn-outline-secondary btn-sm position-absolute bottom-0 end-0 m-3 rounded-2 px-3 fw-semibold">
               <i class="bi bi-fullscreen me-1"></i> {{ __('Expand') }}
            </a>
        @endif
    </div>

    <div class="d-flex align-items-center gap-3">
        @if (!($isAddressOnly ?? false) && $service?->address)
            <a href="https://www.google.com/maps/dir/?api=1&destination={{ urlencode($service->address . ' ' . $service->city) }}" 
               target="_blank" 
               class="btn btn-outline-secondary fw-semibold rounded-2 px-4">
               <i class="bi bi-cursor-fill me-2"></i>{{ __('Get Directions') }}
            </a>
        @endif

        @if (($isOffice ?? false) && ($service->phone ?? $service->user?->phone))
            <a href="tel:{{ $service->phone ?? $service->user->phone }}" class="btn btn-link text-primary text-decoration-none fw-bold small p-0">
                <i class="bi bi-telephone me-2"></i>{{ __('Call for Appointment') }}
            </a>
        @endif
    </div>
</div>
