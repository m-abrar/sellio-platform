<div class="features-container">
    @if ($auto->features->isNotEmpty())
        <div class="row g-3">
            @foreach ($auto->features as $feature)
                <div class="col-6 col-md-4">
                    <div class="feature-pill d-flex align-items-center p-2 px-3 rounded-3 bg-light border border-color-light transition-all h-100">
                        <div class="icon-check-wrapper me-2 d-flex align-items-center justify-content-center bg-white rounded-circle shadow-sm" 
                             style="min-width: 24px; height: 24px; border: 1px solid var(--primary-light);">
                            <i class="bi bi-check2 text-primary" style="font-size: 0.85rem; stroke-width: 2;"></i>
                        </div>
                        <span class="text-dark fw-600 small">{{ $feature->title }}</span>
                    </div>
                </div>
            @endforeach
        </div>
    @else
        <div class="p-4 rounded-4 bg-light border border-dashed border-color-light text-center">
            <div class="opacity-50">
                <i class="bi bi-list-stars fs-2 mb-2 d-block"></i>
                <p class="small mb-0">{{ __('Standard equipment included. Contact dealer for full options list.') }}</p>
            </div>
        </div>
    @endif
</div>
