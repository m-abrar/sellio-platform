{{-- 
    Expects: 
    $features -> A collection or array of feature objects/strings
--}}

<div class="row g-3">
    @forelse($features as $feature)
        <div class="col-md-6">
            <div class="d-flex align-items-center p-3 rounded-4 bg-white border h-100">
                <div class="feature-icon-wrapper me-3 d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" style="width: 35px; height: 35px;">
                    <i class="bi bi-check-lg text-primary fw-bold"></i>
                </div>
                <span class="text-dark fw-semibold small">{{ is_string($feature) ? $feature : $feature->title }}</span>
            </div>
        </div>
    @empty
        <div class="col-12">
            <p class="text-muted small italic">{{ __('No specific expertise listed for this service.') }}</p>
        </div>
    @endforelse
</div>
