<header class="page-title-section mb-4 mb-lg-5">
    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-4">
        
        {{-- Left: Breadcrumbs, Badges, Title --}}
        <div class="flex-grow-1">
            @include('frontend.themes.properties.default.show.partials._breadcrumbs')
            
            <div class="d-flex flex-wrap align-items-center gap-2 mt-3 mb-3">
                @if($property->is_featured)
                    <span class="badge bg-primary text-white px-3 py-2 rounded-pill fw-bold shadow-sm">
                        <i class="bi bi-patch-check-fill me-1"></i> {{ __('Featured') }}
                    </span>
                @endif

                <span class="badge badge-outline-theme px-3 py-2 rounded-pill fw-bold">
                    <i class="bi bi-house-door me-1"></i> {{ $property->category->title ?? __('Property') }}
                </span>

                <span class="badge badge-outline-dark px-3 py-2 rounded-pill fw-bold">
                    <i class="bi bi-tag me-1"></i> {{ $property->type->title ?? __('For Sale') }}
                </span>
                
                @if($property->is_new)
                    <span class="badge bg-success text-white px-3 py-2 rounded-pill fw-bold shadow-sm">
                        {{ __('New Listing') }}
                    </span>
                @endif
            </div>

            <h1 class="fw-800 text-dark display-5 mb-2 tracking-tight line-height-1">
                {{ $property->title }}
            </h1>
            
            <p class="text-muted fs-5 mb-0 d-flex align-items-center gap-2">
                <span class="icon-circle-theme">
                    <i class="bi bi-geo-alt-fill"></i>
                </span>
                {{ $property->address }}, {{ $property->city }}
            </p>
        </div>

        {{-- Right: Price Card --}}
        <div class="text-lg-end">
            <div class="glass-surface p-4 price-container shadow-deep position-relative overflow-hidden">
                <div class="price-glow-effect"></div>
                <div class="position-relative z-1">
                    <span class="metric-label text-uppercase d-block mb-1">
                        {{ __('Investment Amount') }}
                    </span>
                    <h2 class="fw-800 text-primary mb-3 display-6">{{ $property->price_formatted }}</h2>
                    
                    {{-- Mini-Stats Strip --}}
                    <div class="d-flex justify-content-lg-end gap-3 border-top pt-3 mt-2 border-color-light">
                        <div class="text-center">
                            <span class="d-block fw-bold text-dark small">{{ $property->number_of_bedrooms ?? 0 }}</span>
                            <span class="metric-label">🛏️ {{ __('Beds') }}</span>
                        </div>
                        <div class="vr opacity-10"></div>
                        <div class="text-center">
                            <span class="d-block fw-bold text-dark small">{{ $property->number_of_bathrooms ?? 0 }}</span>
                            <span class="metric-label">🛁 {{ __('Baths') }}</span>
                        </div>
                        <div class="vr opacity-10"></div>
                        <div class="text-center">
                            <span class="d-block fw-bold text-dark small">
                                {{ !empty($property->area_sq_ft) ? number_format($property->area_sq_ft) : ($property->area ?? '—') }}
                            </span>
                            <span class="metric-label">📐 {{ !empty($property->area_sq_ft) ? __('ft²') : __('Size') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>