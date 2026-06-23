@extends('frontend._layouts._app')

@section('title', $service->title . ' - ' . __('Get a Quote'))
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="service-quotable">
    <x-slot:breadcrumbs>
        @include('frontend.services.show.partials._breadcrumbs', [
            'pageTitle'    => $service->title,
            'categoryName' => $service->category?->title ?? 'Services',
            'categorySlug' => $service->category?->slug ?? null,
        ])
    </x-slot:breadcrumbs>

    <x-slot:gallery>
        @include('frontend.services.show.partials._gallery_carousel', ['service' => $service])
    </x-slot:gallery>

    <x-slot:main>
        <div class="detail-main-card border-0 overflow-hidden mb-5">
            <div class="p-4 p-lg-5">

                @include('frontend.services.show.partials._listing_header', [
                    'title'   => $service->title,
                    'rating'  => number_format($service->rating_average, 1),
                    'reviews' => $service->reviews->count(),
                ])

                <p class="text-muted lead mt-3">{{ $service->tagline ?? __('Request a tailored proposal for your specific project requirements.') }}</p>

                <div class="service-details-content mt-4">

                    <section id="overview" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-info-circle me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('About this Service') }}
                        </h4>
                        <div class="listing-description text-muted lh-lg">
                            {!! nl2br(e($service->description)) !!}
                        </div>
                    </section>

                    @if($service->features->count() > 0)
                    <section id="features" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-stars me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Included Features') }}
                        </h4>
                        <div class="amenities-grid">
                            @foreach($service->features as $feature)
                                <div class="amenity-chip">
                                    <i class="bi bi-check2-circle amenity-chip__icon" aria-hidden="true"></i>
                                    <span class="amenity-chip__label">{{ $feature->title }}@if($feature->pivot->value): {{ $feature->pivot->value }}@endif</span>
                                </div>
                            @endforeach
                        </div>
                    </section>
                    @endif

                    <section id="capabilities" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-list-columns-reverse me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Service Scope & Capabilities') }}
                        </h4>
                        @include('frontend.services.show.partials._service_list_quotable', ['service' => $service])
                    </section>

                    <section id="hours" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-clock me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Operating Hours') }}
                        </h4>
                        @include('frontend.services.show.partials._operating_hours', ['service' => $service])
                    </section>

                    <section id="logistics" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-diagram-3 me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Logistics & Service Area') }}
                        </h4>
                        @include('frontend.services.show.partials._quick_specs', [
                            'service'    => $service,
                            'contract'   => $service->min_contract_months,
                            'experience' => $service->years_experience,
                        ])
                    </section>

                    <section id="location" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-pin-map-fill me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Location & Directions') }}
                        </h4>
                        @include('frontend.services.show.partials._location_map', ['service' => $service])
                    </section>

                    <section id="reviews" class="pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-chat-square-quote me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Client Feedback') }}
                        </h4>
                        @include('frontend.services.show.partials._reviews_section', [
                            'rating'      => number_format($service->rating_average, 1),
                            'reviewCount' => $service->reviews->count(),
                            'reviews'     => $service->reviews,
                        ])
                    </section>
                </div>
            </div>
        </div>

        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
                <i class="bi bi-grid-3x3-gap-fill me-2" style="color:var(--primary-color)"></i>{{ __('Explore Similar Providers') }}
            </h4>
            @include('frontend.services.show.partials._related_services')
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
            @if($service->is_subscription)
                <div class="badge-premium-info">
                    <i class="bi bi-arrow-repeat me-1"></i>{{ __('Subscription') }}
                </div>
            @endif
            @if($service->max_client_slots)
                @php $isLow = $service->max_client_slots < 5; @endphp
                <div class="badge-premium-warning {{ $isLow ? 'animate-pulse' : '' }}">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    {{ $isLow ? __('Only :count Slots Left', ['count' => $service->max_client_slots]) : __('Limited Availability') }}
                </div>
            @endif
        </div>

        @include('frontend.services.show.partials.sidebar._quote_sidebar', ['service' => $service])

        <div class="card detail-sidebar-card mt-4 overflow-hidden">
            <div class="p-4">
                <div class="d-flex align-items-start mb-3">
                    <div class="me-3 d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                         style="width:38px;height:38px;background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                        <i class="bi bi-clock-history"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold">{{ __('Fast Turnaround') }}</h6>
                        <p class="text-muted tiny mb-0">{{ __('Quotes typically sent within 24h') }}</p>
                    </div>
                </div>
                <div class="d-flex align-items-start">
                    <div class="me-3 d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                         style="width:38px;height:38px;background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                        <i class="bi bi-file-earmark-pdf"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold">{{ __('Detailed Proposals') }}</h6>
                        <p class="text-muted tiny mb-0">{{ __('Line-item transparency included') }}</p>
                    </div>
                </div>
            </div>

            @if($service->user?->phone)
                <div class="p-3 border-top border-color-light text-center" style="background:rgba(248,246,243,.7)">
                    <span class="small text-muted d-block mb-1">{{ __('Prefer to talk first?') }}</span>
                    <a href="tel:{{ $service->user->phone }}" class="fw-800 text-decoration-none" style="color:var(--primary-color)">
                        <i class="bi bi-telephone-fill me-1"></i>{{ $service->user->phone }}
                    </a>
                </div>
            @endif
        </div>

        @if($service->licenses_certs)
            <div class="mt-4">
                <h6 class="text-uppercase small fw-800 text-muted mb-3" style="letter-spacing:.06em">
                    <i class="bi bi-shield-check me-2" style="color:var(--primary-color)"></i>{{ __('Verified Credentials') }}
                </h6>
                <div class="p-3 rounded-3 d-flex align-items-center" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                    <i class="bi bi-patch-check-fill fs-4 me-3 flex-shrink-0" style="color:var(--primary-color)"></i>
                    <span class="text-dark fw-semibold small">{{ $service->licenses_certs }}</span>
                </div>
            </div>
        @endif
    </x-slot:sidebar>
</x-frontend.detail-shell>
@endsection
