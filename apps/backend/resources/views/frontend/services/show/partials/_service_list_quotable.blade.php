<div class="list-group list-group-flush rounded-4 border overflow-hidden shadow-sm mb-4">
    @forelse($service->packages->sortBy('sort_order') as $package)
        <div class="list-group-item d-flex justify-content-between align-items-center bg-white py-3 px-4 {{ $package->is_popular ? 'bg-light-glow' : '' }}">
            <div class="me-3">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="fw-bold text-dark mb-0">{{ $package->title }}</h6>
                    @if($package->is_popular)
                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle tiny fw-bold uppercase px-2">
                            {{ __('Best Value') }}
                        </span>
                    @endif
                </div>
                <p class="mb-0 small text-muted pe-md-4">{{ $package->description }}</p>
                
                @if($package->features)
                    <div class="mt-2 d-flex flex-wrap gap-2">
                        @foreach(array_slice($package->features, 0, 3) as $feature)
                            <span class="tiny text-muted"><i class="bi bi-check2 text-success me-1"></i>{{ $feature }}</span>
                        @endforeach
                    </div>
                @endif
            </div>
            
            <div class="text-end flex-shrink-0">
                <div class="mb-2">
                    <span class="d-block text-muted tiny fw-bold text-uppercase">{{ __('Starts at') }}</span>
                    <span class="fw-900 text-primary fs-5">${{ number_format($package->price, 0) }}</span>
                    <small class="text-muted">/{{ $package->billing_period }}</small>
                </div>
                <a href="#quote-form" class="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">
                    {{ __('Request Quote') }}
                </a>
            </div>
        </div>
    @empty
        <div class="list-group-item text-center py-5 text-muted">
            <i class="bi bi-clipboard-x fs-2 d-block mb-2 opacity-50"></i>
            {{ __('No predefined packages. Request a custom quote below.') }}
        </div>
    @endforelse
</div>
