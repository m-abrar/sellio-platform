@extends('frontend._layouts._app')

@section('title', $service->title)
@section('og_image', $service->primary_image_url)
@section('og_description', Str::limit(strip_tags($service->description), 160))
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="service-consultation">
    <x-slot:breadcrumbs>
        @include('frontend.services.show.partials._breadcrumbs', [
            'pageTitle'    => $service->title,
            'categoryName' => $service->category->title ?? 'Services',
            'categorySlug' => $service->category->slug ?? null,
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

                <div class="service-details-content mt-4">

                    <section id="overview" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Service Overview') }}
                        </h4>
                        <div class="listing-description text-muted lh-lg">
                            {!! nl2br(e($service->description)) !!}
                        </div>
                    </section>

                    <section id="availability" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-clock me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Availability') }}
                        </h4>
                        @include('frontend.services.show.partials._operating_hours', ['service' => $service, 'isConsult' => true])
                    </section>

                    <section id="expertise" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-mortarboard me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Our Expertise') }}
                        </h4>
                        @include('frontend.services.show.partials._simple_feature_list', ['features' => $service->features->take(6)])
                    </section>

                    <section id="location" class="mb-5 pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-pin-map-fill me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Office Location') }}
                        </h4>
                        @include('frontend.services.show.partials._location_map', ['service' => $service, 'isOffice' => true])
                    </section>

                    <section id="reviews" class="pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">
                            <i class="bi bi-chat-square-quote me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Client Experiences') }}
                        </h4>
                        @include('frontend.services.show.partials._reviews_section')
                    </section>
                </div>
            </div>
        </div>

        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
                <i class="bi bi-bookmark-heart-fill me-2" style="color:var(--primary-color)"></i>{{ __('You Might Also Like') }}
            </h4>
            @include('frontend.services.show.partials._related_services')
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.services.show.partials.sidebar._consultation_sidebar')

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
