<div class="col-12">
    <div class="home-empty-state bg-white border rounded-4 text-center p-4 p-md-5">
        <div class="home-empty-icon d-inline-flex align-items-center justify-content-center mb-3">
            <i class="bi {{ $icon ?? 'bi-stars' }}"></i>
        </div>
        <h3 class="h5 fw-800 text-dark mb-2">{{ $title ?? __('More listings are coming soon') }}</h3>
        <p class="text-muted mb-4 mx-auto">{{ $description ?? __('This section will fill in as approved public listings become available.') }}</p>
        @isset($route)
            <a href="{{ $route }}" class="btn btn-outline-primary rounded-2 fw-semibold px-4">
                {{ $label ?? __('Explore') }} <i class="bi bi-arrow-right ms-1"></i>
            </a>
        @endisset
    </div>
</div>
