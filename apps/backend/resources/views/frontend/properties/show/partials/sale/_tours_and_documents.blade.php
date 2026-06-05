<div class="row g-3">
    <div class="col-md-4">
        @if($property->virtual_tour)
            <a href="{{ $property->virtual_tour }}" class="asset-btn d-flex align-items-center p-3 glass-surface text-decoration-none" target="_blank" rel="noopener">
                <div class="icon-circle-theme me-3"><i class="bi bi-camera-video"></i></div>
                <div>
                    <span class="d-block fw-bold text-dark small">{{ __('3D Virtual Tour') }}</span>
                    <span class="tiny text-primary text-uppercase fw-bold">{{ __('Launch VR') }}</span>
                </div>
            </a>
        @else
            <div class="asset-btn asset-btn--disabled d-flex align-items-center p-3 glass-surface" aria-disabled="true">
                <div class="icon-circle-theme me-3"><i class="bi bi-camera-video"></i></div>
                <div>
                    <span class="d-block fw-bold text-dark small">{{ __('3D Virtual Tour') }}</span>
                    <span class="tiny text-muted text-uppercase fw-bold">{{ __('Coming soon') }}</span>
                </div>
            </div>
        @endif
    </div>
    <div class="col-md-4">
        <div class="asset-btn asset-btn--disabled d-flex align-items-center p-3 glass-surface" aria-disabled="true">
            <div class="property-document-icon icon-circle-theme me-3"><i class="bi bi-file-earmark-pdf"></i></div>
            <div>
                <span class="d-block fw-bold text-dark small">{{ __('Property Brochure') }}</span>
                <span class="tiny text-muted text-uppercase fw-bold">{{ __('Request from agent') }}</span>
            </div>
        </div>
    </div>
</div>
