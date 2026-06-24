@extends('frontend._layouts._app')

@section('title', $service->title . ' - ' . __('Book Now'))
@section('og_image', $service->primary_image_url)
@section('og_description', Str::limit(strip_tags($service->description), 160))
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

    <x-slot:gallery>
        @include('frontend.services.show.partials._gallery_carousel', ['service' => $service])
    </x-slot:gallery>

    <x-slot:main>
        <div class="detail-main-card border-0 overflow-hidden mb-5">
            <div class="p-4 p-lg-5">

                @include('frontend.services.show.partials._listing_header', [
                    'title'   => $service->title,
                    'rating'  => number_format($service->average_rating, 1),
                    'reviews' => $service->reviews->count(),
                ])

                <p class="text-muted lead mt-3">{{ $service->tagline ?? Str::limit(strip_tags($service->description), 160) }}</p>

                <div class="service-details-content mt-4">

                    <section id="pricing" class="mb-5">
                        @include('frontend.services.show.partials._service_list_bookable', ['service' => $service])
                    </section>

                    <section id="overview" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Service Details') }}
                        </h4>
                        <div class="listing-description text-muted lh-lg">
                            {!! nl2br(e($service->description)) !!}
                        </div>
                    </section>

                    <section id="availability" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-clock me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Availability & Hours') }}
                        </h4>
                        @include('frontend.services.show.partials._operating_hours', ['service' => $service])
                    </section>

                    <section id="location" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-pin-map-fill me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Service Location') }}
                        </h4>
                        @include('frontend.services.show.partials._location_map', ['service' => $service])
                    </section>

                    <section id="reviews" class="pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-chat-square-quote me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Customer Reviews') }}
                        </h4>
                        @include('frontend.services.show.partials._reviews_section', [
                            'rating'      => number_format($service->average_rating, 1),
                            'reviewCount' => $service->reviews->count(),
                            'reviews'     => $service->reviews,
                        ])
                    </section>
                </div>
            </div>
        </div>

        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
                <i class="bi bi-grid-3x3-gap-fill me-2" style="color:var(--primary-color)"></i>{{ __('Similar Services') }}
            </h4>
            @include('frontend.services.show.partials._related_services', ['relatedServices' => $relatedServices ?? collect()])
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.services.show.partials.sidebar._booking_sidebar', ['service' => $service])

        <div class="card detail-sidebar-card mt-4 p-3 d-flex flex-row align-items-center gap-3" style="border-left:3px solid var(--primary-color)">
            <div class="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                 style="width:42px;height:42px;background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                <i class="bi bi-shield-check fs-4"></i>
            </div>
            <div>
                <h6 class="mb-0 fw-bold">{{ __('Purchase Protection') }}</h6>
                <p class="text-muted tiny mb-0">{{ __('Secure payments & verified pros') }}</p>
            </div>
        </div>
    </x-slot:sidebar>
</x-frontend.detail-shell>
@endsection
