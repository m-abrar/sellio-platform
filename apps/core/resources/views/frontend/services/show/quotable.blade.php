@extends('frontend._layouts._app')

@section('title', $service->title . ' - Get a Quote') 
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-3 py-lg-4">
    
    {{-- 1. NAVIGATION HEADER --}}
    @include('frontend.services.show.partials._breadcrumbs', [
        'pageTitle' => $service->title,
        'categoryName' => $service->category?->title ?? 'Services',
        'categorySlug' => $service->category->slug ?? null,
    ])

    <div class="row g-4 mt-1">
        @include('frontend._partials._alerts')

        {{-- MAIN COLUMN (8/12) --}}
        <div class="col-lg-8">
            <div class="card glass-surface border-0 overflow-hidden mb-5">
                
                {{-- 2. HEADER IMAGE / GALLERY --}}
                <div class="gallery-section border-bottom border-color-light position-relative">
                    <div class="position-absolute top-0 start-0 m-3 z-2">
                        <span class="badge bg-white text-primary shadow-sm border px-3 py-2 rounded-pill fw-bold small">
                            <i class="{{ $service->category->icon ?? 'bi-chat-left-dots-fill' }} text-primary me-1"></i> 
                            {{ strtoupper($service->category?->title ?? __('Custom Quote')) }}
                        </span>
                    </div>
                    @include('frontend.services.show.partials._gallery_carousel', ['service' => $service]) 
                </div>

                <div class="p-4 p-lg-5">
                    
                    {{-- 3. SERVICE IDENTITY --}}
                    @include('frontend.services.show.partials._listing_header', [
                        'title' => $service->title, 
                        'rating' => number_format($service->rating_average, 1), 
                        'reviews' => $service->reviews->count()
                    ])

                    <p class="text-muted lead mt-3">{{ $service->tagline ?? __('Request a tailored proposal for your specific project requirements.') }}</p>

                    <hr class="opacity-10 my-4">

                    {{-- 4. SERVICE CONTENT --}}
                    <div class="service-details-content">
                        
                        {{-- DETAILED DESCRIPTION --}}
                        <section id="overview" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('About this Service') }}</h4>
                            <div class="listing-description">
                                {!! nl2br(e($service->description)) !!}
                            </div>
                        </section>

                        {{-- POLYMORPHIC FEATURES --}}
                        @if($service->features->count() > 0)
                        <section id="features" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4">{{ __('Included Features') }}</h4>
                            <div class="row g-3">
                                @foreach($service->features as $feature)
                                    <div class="col-md-6">
                                        <div class="d-flex align-items-center">
                                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                                            <span class="text-muted">{{ $feature->title }}</span>
                                            @if($feature->pivot->value)
                                                <strong class="ms-1">: {{ $feature->pivot->value }}</strong>
                                            @endif
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </section>
                        @endif

                        {{-- QUOTABLE SERVICES / CAPABILITIES --}}
                        <section id="capabilities" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Service Scope & Capabilities') }}</h4>
                            @include('frontend.services.show.partials._service_list_quotable', ['service' => $service])
                        </section>

                        <section id="specs" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Operating Hours') }}</h4>
                            @include('frontend.services.show.partials._operating_hours', [
                                'service' => $service
                            ])
                        </section>

                        <section id="specs" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Logistics & Service Area') }}</h4>
                            @include('frontend.services.show.partials._quick_specs', [
                                'service' => $service,
                                // Passing these explicitly to ensure alignment with Model Attributes
                                'contract' => $service->min_contract_months,
                                'experience' => $service->years_experience, 
                            ])
                        </section>

                        {{-- LOCATION --}}
                        <section id="location" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Location & Directions') }}</h4>
                             @include('frontend.services.show.partials._location_map', ['service' => $service])
                        </section>

                        {{-- REVIEWS --}}
                        <section id="reviews" class="pt-4 border-top border-color-light">
                             <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Client Feedback') }}</h4>
                             @include('frontend.services.show.partials._reviews_section', [
                                'rating' => number_format($service->rating_average, 1), 
                                'reviewCount' => $service->reviews->count(),
                                'reviews' => $service->reviews
                             ])
                        </section>
                    </div>
                </div>
            </div>

            {{-- RELATED --}}
            <div class="related-wrapper pb-5">
                <h3 class="fw-800 mt-5 mb-4">{{ __('Explore Similar Providers') }}</h3>
                @include('frontend.services.show.partials._related_services')
            </div>
        </div>

        {{-- SIDEBAR COLUMN (4/12) --}}
        <div class="col-lg-4">
            <aside class="sticky-sidebar">
                
                {{-- 1. URGENCY & TYPE BADGES (Visual Anchors) --}}
                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                    @if($service->is_subscription)
                        <div class="badge-premium-info">
                            <i class="bi bi-arrow-repeat me-1"></i>{{ __('Subscription') }}
                        </div>
                    @endif
                    
                    @if($service->max_client_slots)
                        @php
                            // Logic: Check if it's "Low Availability"
                            $isLowAvailability = $service->max_client_slots < 5;
                        @endphp
                        <div class="badge-premium-warning {{ $isLowAvailability ? 'animate-pulse' : '' }}">
                            <i class="bi bi-exclamation-triangle me-1"></i>
                            {{ $isLowAvailability ? __('Only :count Slots Left', ['count' => $service->max_client_slots]) : __('Limited Availability') }}
                        </div>
                    @endif
                </div>

                {{-- 2. PRIMARY ACTION: Quote Request Form --}}
                @include('frontend.services.show.partials.sidebar._quote_sidebar', ['service' => $service])
                
                {{-- 3. TRUST STACK (Fast Turnaround & Transparency) --}}
                <div class="card glass-surface border-0 shadow-sm mt-4 overflow-hidden">
                    <div class="p-4 bg-white">
                        <div class="d-flex align-items-start mb-3">
                            <div class="icon-circle bg-primary-subtle text-primary me-3">
                                <i class="bi bi-clock-history"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">{{ __('Fast Turnaround') }}</h6>
                                <p class="text-muted tiny mb-0">{{ __('Quotes typically sent within 24h') }}</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-start">
                            <div class="icon-circle bg-primary-subtle text-primary me-3">
                                <i class="bi bi-file-earmark-pdf"></i>
                            </div>
                            <div>
                                <h6 class="mb-0 fw-bold">{{ __('Detailed Proposals') }}</h6>
                                <p class="text-muted tiny mb-0">{{ __('Line-item transparency included') }}</p>
                            </div>
                        </div>
                    </div>

                    {{-- 4. DIRECT CONTACT (Integrated into the Trust Stack) --}}
                    @if($service->user?->phone)
                        <div class="p-3 bg-light border-top border-color-light text-center">
                            <span class="small text-muted d-block mb-1">{{ __('Prefer to talk first?') }}</span>
                            <a href="tel:{{ $service->user->phone ?? '#' }}" class="fw-800 text-primary text-decoration-none">
                                <i class="bi bi-telephone-fill me-1"></i> {{ $service->user->phone }}
                            </a>
                        </div>
                    @endif
                </div>

                {{-- 5. CERTIFICATIONS (Moved to Sidebar for Authority) --}}
                @if($service->licenses_certs)
                    <div class="mt-4">
                        <h6 class="text-uppercase small fw-800 text-muted tracking-wider mb-3">
                            <i class="bi bi-shield-check me-2"></i>{{ __('Verified Credentials') }}
                        </h6>
                        <div class="p-3 rounded-4 border border-dashed border-color-light d-flex align-items-center bg-white shadow-sm">
                            <i class="bi bi-patch-check-fill text-primary fs-4 me-3"></i>
                            <span class="text-dark fw-semibold small">{{ $service->licenses_certs }}</span>
                        </div>
                    </div>
                @endif

            </aside>
        </div>

    </div>
</div>
@endsection
