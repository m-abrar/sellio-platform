<div class="card glass-surface p-0 border-0 shadow-lg overflow-hidden">
    {{-- Gallery Integration --}}
    @include('frontend.autos.show.partials._gallery')

    <div class="p-4 p-lg-5">
        {{-- Header: Title and Price --}}
        <div class="row align-items-center mb-4">
            <div class="col-md-8">
                <span class="badge bg-primary-light text-primary-color mb-2 px-3 py-2 rounded-pill fw-bold">
                    <i class="bi bi-tag-fill me-1"></i> {{ __('For Sale') }}
                </span>
                <h1 class="fw-800 display-5 mb-1 text-dark">{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}</h1>
                <p class="text-muted fs-5 mb-0">
                    <i class="bi bi-geo-alt-fill me-1"></i> {{ $auto->city }}, {{ $auto->state }}
                </p>
            </div>
            <div class="col-md-4 text-md-end mt-3 mt-md-0">
                @if ($auto->sale_price < $auto->base_price && $auto->sale_price > 0)
                    <h3 class="text-danger fw-800 mb-0">${{ number_format($auto->sale_price) }}</h3>
                    <del class="text-muted small">${{ number_format($auto->base_price) }}</del>
                @else
                    <h2 class="price-tag-lg bg-primary-theme text-white mb-0 d-inline-block">
                        ${{ number_format($auto->base_price) }}
                    </h2>
                @endif
            </div>
        </div>

        {{-- Quick Highlights --}}
        <div class="d-flex flex-wrap gap-2 mb-4">
            <div class="feature-tag"><i class="bi bi-speedometer2 text-primary-color me-2"></i>{{ $auto->mileage_formatted }}</div>
            <div class="feature-tag"><i class="bi bi-fuel-pump text-primary-color me-2"></i>{{ ucfirst($auto->engine_type) }}</div>
            <div class="feature-tag"><i class="bi bi-gear-wide-connected text-primary-color me-2"></i>{{ ucfirst($auto->transmission) }}</div>
            <div class="feature-tag"><i class="bi bi-palette text-primary-color me-2"></i>{{ $auto->exterior_color }}</div>
        </div>

        <hr class="opacity-10 my-4">

        {{-- Dealer Description --}}
        <h4 class="fw-bold mb-3 text-dark">{{ __('Dealer Comments') }}</h4>
        <div class="listing-description">
            {!! nl2br(e($auto->description)) !!}
        </div>

        {{-- Tech Specs Table --}}
        <h4 class="fw-bold mt-5 mb-4 text-dark"><i class="bi bi-info-circle-fill me-2 text-primary-color"></i>{{ __('Technical Specifications') }}</h4>
        <div class="row g-0">
            <div class="col-12">
                <table class="table table-borderless spec-table mb-0">
                    <tbody>
                        <tr>
                            <th>{{ __('Condition') }}</th><td>{{ $auto->condition_rating }}/10</td>
                            <th>{{ __('Drivetrain') }}</th><td>{{ $auto->drivetrain ?? __('N/A') }}</td>
                        </tr>
                        <tr>
                            <th>{{ __('Fuel Economy') }}</th><td>{{ $auto->fuel_economy ?? __('N/A') }}</td>
                            <th>{{ __('VIN') }}</th><td class="small font-monospace">{{ $auto->vin_number ?? __('Request via Dealer') }}</td>
                        </tr>
                        <tr>
                            <th>{{ __('Warranty') }}</th><td>{{ $auto->warranty_months ? $auto->warranty_months . ' ' . __('Months') : __('As-Is') }}</td>
                            <th>{{ __('Stock #') }}</th><td>{{ $auto->stock_quantity ?? '1' }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {{-- Certification Badges --}}
        <div class="row g-3 mt-4">
            <div class="col-md-4 text-center">
                <div class="p-3 bg-light rounded-4 border border-white h-100">
                    <i class="bi bi-shield-check text-success fs-2 mb-2 d-block"></i>
                    <span class="fw-bold small d-block">{{ __('Quality Verified') }}</span>
                    <span class="text-muted smaller">{{ __('150-Point Inspection') }}</span>
                </div>
            </div>
            <div class="col-md-4 text-center">
                <div class="p-3 bg-light rounded-4 border border-white h-100">
                    <i class="bi bi-file-earmark-medical text-primary-color fs-2 mb-2 d-block"></i>
                    <span class="fw-bold small d-block">{{ __('CARFAX Report') }}</span>
                    <a href="#" class="text-primary-color smaller text-decoration-none">{{ __('View History') }}</a>
                </div>
            </div>
            <div class="col-md-4 text-center">
                <div class="p-3 bg-light rounded-4 border border-white h-100">
                    <i class="bi bi-award text-warning fs-2 mb-2 d-block"></i>
                    <span class="fw-bold small d-block">{{ __('Dealer Rating') }}</span>
                    <span class="text-muted smaller">{{ number_format(($auto->user?->reviews ?? collect())->avg('rating') ?: 0, 1) }}{{ __('/5.0 stars') }}</span>
                </div>
            </div>
        </div>

        {{-- Features Grid --}}
        <h4 class="fw-bold mt-5 mb-3 text-dark"><i class="bi bi-list-check me-2 text-primary-color"></i>{{ __('Key Options & Features') }}</h4>
        <div class="row g-3">
            @forelse ($auto->features->take(12) as $feature)
                <div class="col-md-4 col-6">
                    <div class="small text-dark fw-500">
                        <i class="bi bi-check2-circle me-2 text-primary-color"></i>{{ $feature->title }}
                    </div>
                </div>
            @empty
                <div class="col-12 text-muted">{{ __('Standard equipment for this model.') }}</div>
            @endforelse
        </div>

        {{-- Map --}}
        <h4 class="fw-bold mt-5 mb-4 text-dark"><i class="bi bi-pin-map-fill me-2 text-primary-color"></i>{{ __('Find this Vehicle') }}</h4>
        <div class="ratio ratio-21x9 rounded-4 overflow-hidden border shadow-sm">
            <iframe
                src="https://maps.google.com/maps?q={{ $auto->latitude }},{{ $auto->longitude }}&z=15&output=embed" class="border-0" allowfullscreen="" loading="lazy"></iframe>
        </div>
        <div class="mt-3 p-3 bg-primary-light rounded-3">
            <p class="small text-dark mb-0 fw-500">
                <i class="bi bi-building me-2"></i>{{ $auto->user->name ?? 'Premium Motors' }}
                <span class="mx-2 text-muted">|</span>
                <i class="bi bi-geo-alt me-1"></i>{{ $auto->address }}, {{ $auto->city }}
            </p>
        </div>
    </div>
</div>
