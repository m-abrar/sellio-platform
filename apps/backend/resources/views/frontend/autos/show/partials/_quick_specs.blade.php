<div class="property-key-facts d-flex flex-wrap rounded-3 overflow-hidden mb-4" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-speedometer2 key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">
            {{ $auto->mileage_formatted ?? number_format($auto->mileage) . ' ' . ($auto->mileage_unit ?? 'mi') }}
        </span>
        <span class="small text-muted">{{ __('Mileage') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-fuel-pump key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">
            {{ ucfirst($auto->engine_type ?? $auto->fuel_type ?? 'N/A') }}
        </span>
        <span class="small text-muted">{{ __('Fuel Type') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3 border-end border-color-light">
        <i class="bi bi-gear-wide-connected key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">
            {{ ucfirst($auto->transmission ?? 'N/A') }}
        </span>
        <span class="small text-muted">{{ __('Transmission') }}</span>
    </div>
    <div class="key-fact-item flex-fill text-center px-4 py-3">
        <i class="bi bi-palette key-fact-icon"></i>
        <span class="d-block fw-800 text-dark" style="font-size:.9rem">
            {{ $auto->exterior_color ?? 'N/A' }}
        </span>
        <span class="small text-muted">{{ __('Colour') }}</span>
    </div>
</div>
