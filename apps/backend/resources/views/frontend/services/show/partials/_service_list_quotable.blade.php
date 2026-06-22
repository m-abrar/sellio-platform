<div class="mb-4" style="border:1.5px solid rgba(15,23,42,.08);border-radius:16px;overflow:hidden">
    @forelse($service->packages->sortBy('sort_order') as $package)
        <div class="d-flex justify-content-between align-items-center py-3 px-4 {{ $loop->last ? '' : 'border-bottom' }}"
             style="{{ $package->is_popular ? 'background:rgba(var(--primary-color-rgb),.04);border-left:3px solid var(--primary-color)' : 'background:rgba(248,246,243,.6)' }}">
            <div class="me-3">
                <div class="d-flex align-items-center gap-2 mb-1">
                    <h6 class="fw-bold text-dark mb-0">{{ $package->title }}</h6>
                    @if($package->is_popular)
                        <span class="fw-semibold px-2 py-1 rounded-2 tiny" style="background:rgba(var(--primary-color-rgb),.12);color:var(--primary-color)">
                            {{ __('Best Value') }}
                        </span>
                    @endif
                </div>
                <p class="mb-0 small text-muted pe-md-4">{{ $package->description }}</p>

                @if($package->features)
                    <div class="mt-2 d-flex flex-wrap gap-2">
                        @foreach(array_slice($package->features, 0, 3) as $feature)
                            <span class="tiny text-muted"><i class="bi bi-check2 me-1" style="color:var(--primary-color)"></i>{{ $feature }}</span>
                        @endforeach
                    </div>
                @endif
            </div>

            <div class="text-end flex-shrink-0">
                <div class="mb-2">
                    <span class="d-block text-muted tiny fw-bold text-uppercase">{{ __('Starts at') }}</span>
                    <span class="fw-900 fs-5" style="color:var(--primary-color)">${{ number_format($package->price, 0) }}</span>
                    <small class="text-muted">/{{ $package->billing_period }}</small>
                </div>
                <a href="#quote-form" class="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-semibold">
                    {{ __('Request Quote') }}
                </a>
            </div>
        </div>
    @empty
        <div class="text-center py-5 text-muted">
            <i class="bi bi-clipboard-x fs-2 d-block mb-2 opacity-50"></i>
            {{ __('No predefined packages. Request a custom quote below.') }}
        </div>
    @endforelse
</div>
