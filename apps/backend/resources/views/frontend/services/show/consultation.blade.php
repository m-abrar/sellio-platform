@extends('frontend._layouts._app')

@section('title', $service->title) 
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="service-consultation">
    <x-slot:breadcrumbs>
        @include('frontend.services.show.partials._breadcrumbs', [
            'pageTitle' => $service->title,
            'categoryName' => $service->category->title ?? 'Services',
            'categorySlug' => $service->category->slug ?? null,
        ])
    </x-slot:breadcrumbs>

    <x-slot:main>
            <div class="detail-main-card border-0 overflow-hidden mb-5">
                
                {{-- 2. HEADER IMAGE / GALLERY --}}
                <div class="gallery-section border-bottom border-color-light position-relative">
                    {{-- Category Badge Overlay --}}
                    <div class="position-absolute top-0 start-0 m-3 z-2">
                        <span class="badge bg-white text-primary border px-3 py-2 rounded-2 fw-semibold small">
                            <i class="bi {{ $service->category->icon ?? 'bi-patch-check-fill' }} me-1"></i>
                            {{ $service->category->title ?? __('Service') }}
                        </span>
                    </div>
                    @include('frontend.services.show.partials._gallery_carousel', ['service' => $service]) 
                </div>

                <div class="p-4 p-lg-5">
                    
                    {{-- 3. SERVICE IDENTITY --}}
                    


                    {{-- Title & Rating (Common Header) --}}
                            @include('frontend.services.show.partials._listing_header', [
                                'title' => $service->title, 
                                'rating' => number_format($service->average_rating, 1), 
                                'reviews' => $service->reviews->count()
                            ])

                    <hr class="opacity-10 my-4">

                    {{-- 4. SERVICE CONTENT --}}
                    <div class="service-details-content">
                        {{-- DESCRIPTION --}}
                        <section id="overview" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Service Overview') }}</h4>
                            <div class="listing-description">
                                {!! nl2br(e($service->description)) !!}
                            </div>
                        </section>

                        {{-- OPERATING HOURS --}}
                        <section id="availability" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Availability') }}</h4>
                            @include('frontend.services.show.partials._operating_hours', ['service' => $service, 'isConsult' => true])
                        </section>

                        {{-- EXPERTISE / FEATURES --}}
                        <section id="expertise" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Our Expertise') }}</h4>
                            @include('frontend.services.show.partials._simple_feature_list', ['features' => $service->features->take(6)])
                        </section>

                        {{-- MAP --}}
                        <section id="location" class="mb-5 pt-4 border-top border-color-light">
                             <h4 class="fw-800 text-dark mb-4">{{ __('Office Location') }}</h4>
                             @include('frontend.services.show.partials._location_map', ['service' => $service, 'isOffice' => true])
                        </section>

                        {{-- REVIEWS --}}
                        <section id="reviews" class="pt-4 border-top border-color-light">
                             <h4 class="fw-800 text-dark mb-4">{{ __('Client Experiences') }}</h4>
                             @include('frontend.services.show.partials._reviews_section')
                        </section>
                    </div>
                </div>
            </div>

            {{-- RELATED --}}
            <div class="related-wrapper pb-5">
                <h3 class="fw-800 mt-5 mb-4"><i class="bi bi-bookmark-heart-fill me-2 text-primary"></i>{{ __('You might also like') }}</h3>
                 @include('frontend.services.show.partials._related_services')
            </div>
    </x-slot:main>

    <x-slot:sidebar>
                {{-- Main Booking/Consultation Card --}}
                @include('frontend.services.show.partials.sidebar._consultation_sidebar')
                
                {{-- Verification Badge --}}
                <div class="card detail-sidebar-card mt-4 p-3 d-flex flex-row align-items-center gap-3" style="border-left:3px solid var(--primary-color)">
                    <div class="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                         style="width:42px;height:42px;background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                        <i class="bi bi-shield-check fs-4"></i>
                    </div>
                    <div>
                        <h6 class="mb-0 fw-bold">{{ __('Verified Professional') }}</h6>
                        <p class="text-muted tiny mb-0">{{ __('Background checked & certified') }}</p>
                    </div>
                </div>
    </x-slot:sidebar>
</x-frontend.detail-shell>
@endsection
