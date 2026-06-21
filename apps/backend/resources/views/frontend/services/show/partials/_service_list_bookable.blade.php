<h4 class="fw-800 text-dark mt-5 mb-4 tracking-tight">{{ __('Available Packages') }}</h4>

<div class="bookable-grid d-flex flex-column gap-3 mb-5">
    @forelse($service->packages->sortBy('sort_order') as $package)
        <div class="package-selection-card bg-white border border-color-light p-3 p-md-4 transition-all {{ $package->is_popular ? 'is-popular-glow' : '' }}">
            <div class="row align-items-center g-3">
                
                {{-- 1. Info Section --}}
                <div class="col-md-7 col-lg-8">
                    <div class="d-flex align-items-center flex-wrap gap-2 mb-2">
                        <h5 class="fw-800 text-dark mb-0">{{ $package->name }}</h5>
                        @if($package->is_popular)
                            <span class="badge bg-primary text-white rounded-2 px-3 py-1 small fw-semibold">
                                <i class="bi bi-fire me-1"></i> {{ __('Most Popular') }}
                            </span>
                        @endif
                    </div>
                    
                    <p class="text-muted mb-3 small pe-lg-5">{{ $package->description }}</p>
                    
                    {{-- Feature Tags --}}
                    @if(!empty($package->features))
                        <div class="d-flex flex-wrap gap-2">
                            @foreach(array_slice($package->features, 0, 4) as $feature)
                                <span class="badge-feature">
                                    <i class="bi bi-check2 text-primary me-1"></i> {{ $feature }}
                                </span>
                            @endforeach
                        </div>
                    @endif
                </div>

                {{-- 2. Pricing & CTA Section --}}
                <div class="col-md-5 col-lg-4 text-md-end border-start-md border-color-light ps-md-4">
                    <div class="price-display mb-3">
                        <span class="d-block text-muted tiny fw-bold text-uppercase tracking-widest mb-1">
                            {{ $package->billing_period == 'one-time' ? __('Total Price') : __('Recurring Fee') }}
                        </span>
                        <div class="d-flex align-items-baseline justify-content-md-end gap-1">
                            <span class="h3 fw-900 text-dark mb-0">{{ $package->price_formatted }}</span>
                            @if($package->billing_period !== 'one-time')
                                <span class="text-muted small">/{{ $package->billing_period }}</span>
                            @endif
                        </div>
                    </div>

                    <a href="{{ route('services.show', ['service' => $service->slug, 'package' => $package->id]) }}" 
                       class="btn {{ $package->is_popular ? 'btn-primary' : 'btn-outline-dark' }} w-100 rounded-2 py-2 fw-semibold transition-all">
                        {{ __('Book Now') }}
                    </a>
                </div>

            </div>
        </div>
    @empty
        <div class="bg-white border p-5 text-center rounded-4">
            <i class="bi bi-calendar-x fs-1 text-muted opacity-25 d-block mb-3"></i>
            <p class="text-muted mb-0">{{ __('No specific packages available at this time.') }}</p>
        </div>
    @endforelse
</div>
