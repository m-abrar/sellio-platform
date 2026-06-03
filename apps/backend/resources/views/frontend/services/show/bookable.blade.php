@extends('frontend._layouts._app')

@section('title', $service->title . ' - ' . __('Book Now')) 
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="service-bookable">
    <x-slot:breadcrumbs>
        @include('frontend.services.show.partials._breadcrumbs', [
            'pageTitle'    => $service->title,
            'categoryName' => $service->category?->title,
            'categorySlug' => $service->category?->slug,
        ])
    </x-slot:breadcrumbs>

    <x-slot:main>
            <div class="card glass-surface border-0 overflow-hidden mb-5">
                
                {{-- 2. HEADER IMAGE / GALLERY --}}
                <div class="gallery-section border-bottom border-color-light position-relative">
                    {{-- Category Badge Overlay --}}
                    <div class="position-absolute top-0 start-0 m-3 z-2">
                        <span class="badge bg-white text-primary shadow-sm border px-3 py-2 rounded-pill fw-bold small">
                            <i class="bi {{ $service->category->icon ?? 'bi-bag-check-fill' }} me-1"></i> 
                            {{ strtoupper($service->category->title ?? __('Bookable')) }}
                        </span>
                    </div>
                    @include('frontend.services.show.partials._gallery_carousel', ['service' => $service]) 
                </div>

                <div class="p-4 p-lg-5">
                    
                    {{-- 3. SERVICE IDENTITY --}}
                    @include('frontend.services.show.partials._listing_header', [
                        'title' => $service->title, 
                        'rating' => number_format($service->average_rating, 1), 
                        'reviews' => $service->reviews->count()
                    ])

                    <p class="text-muted lead mt-3">{{ $service->tagline ?? Str::limit(strip_tags($service->description), 160) }}</p>

                    <hr class="opacity-10 my-4">

                    {{-- 4. SERVICE CONTENT --}}
                    <div class="service-details-content">
                        
                        {{-- PACKAGES & PRICING (Primary Action for Bookable) --}}
                        <section id="pricing" class="mb-5">
                            @include('frontend.services.show.partials._service_list_bookable', ['service' => $service])
                        </section>

                        {{-- OVERVIEW / DESCRIPTION --}}
                        <section id="overview" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Service Details') }}</h4>
                            <div class="listing-description">
                                {!! nl2br(e($service->description)) !!}
                            </div>
                        </section>

                        {{-- OPERATING HOURS --}}
                        <section id="availability" class="mb-5 pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Availability & Hours') }}</h4>
                            @include('frontend.services.show.partials._operating_hours', ['service' => $service])
                        </section>

                        {{-- LOCATION --}}
                        <section id="location" class="mb-5 pt-4 border-top border-color-light">
                             <h4 class="fw-800 text-dark mb-4">{{ __('Service Location') }}</h4>
                             @include('frontend.services.show.partials._location_map', ['service' => $service])
                        </section>

                        {{-- REVIEWS --}}
                        <section id="reviews" class="pt-4 border-top border-color-light">
                             <h4 class="fw-800 text-dark mb-4">{{ __('Customer Reviews') }}</h4>
                             @include('frontend.services.show.partials._reviews_section', [
                                'rating' => number_format($service->average_rating, 1), 
                                'reviewCount' => $service->reviews->count(),
                                'reviews' => $service->reviews
                             ])
                        </section>
                    </div>
                </div>
            </div>

            {{-- RELATED SERVICES --}}
            <div class="related-wrapper pb-5">
                <h3 class="fw-800 mt-5 mb-4">
                    <i class="bi bi-grid-fill me-2 text-primary-color"></i>{{ __('Similar Services') }}
                </h3>
                @include('frontend.services.show.partials._related_services', ['relatedServices' => $relatedServices ?? collect()])
            </div>
    </x-slot:main>

    <x-slot:sidebar>
                {{-- Booking specific sidebar (Calculators/Date Pickers) --}}
                @include('frontend.services.show.partials.sidebar._booking_sidebar', ['service' => $service])
                
                {{-- Trust / Verification Badge --}}
                <div class="mt-4 p-3 rounded-4 bg-white border border-color-light d-flex align-items-center shadow-sm">
                    <div class="icon-box bg-primary bg-opacity-10 text-primary rounded-circle me-3 d-flex align-items-center justify-content-center icon-size-45">
                        <i class="bi bi-shield-check fs-4"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold">{{ __('Purchase Protection') }}</h6>
                        <p class="text-muted tiny mb-0">{{ __('Secure payments & verified pros') }}</p>
                    </div>
                </div>

                {{-- Quick Contact Widget --}}
                <div class="mt-3 p-4 rounded-4 bg-dark text-white shadow-sm">
                    <h6 class="fw-bold mb-2">{{ __('Need Help?') }}</h6>
                    <p class="small opacity-75 mb-3">{{ __('Have questions about this service before booking?') }}</p>
                    <button class="btn btn-outline-light btn-sm w-100 rounded-pill">{{ __('Message Provider') }}</button>
                </div>
    </x-slot:sidebar>
</x-frontend.detail-shell>
@endsection
