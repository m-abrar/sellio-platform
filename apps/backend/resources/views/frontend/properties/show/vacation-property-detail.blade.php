@extends('frontend._layouts._app')

@section('title', $property->meta_title ?: ($property->title . ' ' . __('in') . ' ' . $property->city))

@section('head_extra')
<meta name="description" content="{{ $property->meta_description ?: $property->description }}">
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="property-rental">
    <x-slot:breadcrumbs>
        @include('frontend.properties.show.partials.vr._header')
    </x-slot:breadcrumbs>

    <x-slot:main>
        <div class="detail-main-card border-0 overflow-hidden mb-4">
            <div class="gallery-section">
                @include('frontend.properties.show.partials._gallery')
            </div>

            <div class="p-4 p-lg-5">
                @include('frontend.properties.show.partials.vr._summary_features')

                <hr class="my-5 opacity-10">

                <section id="about" class="mb-5">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('About this getaway') }}</h4>
                    <div class="text-muted lh-lg">
                        @include('frontend.properties.show.partials._description')
                    </div>
                </section>

                @include('frontend.properties.show.partials.vr._amenities')

                <section id="seasonal-rates" class="mt-5 pt-5 border-top border-color-light">
                    @include('frontend.properties.show.partials.vr._seasonal_prices')
                </section>

                <section id="calendar" class="mt-5 pt-5 border-top border-color-light">
                    @include('frontend.properties.show.partials.vr._availability_calendar')
                </section>

                <section id="neighborhood" class="mt-5 pt-5 border-top border-color-light">
                    @include('frontend.properties.show.partials.vr._local_guide')
                </section>

                <section id="livability" class="mt-5 pt-5 border-top border-color-light property-scores-panel property-scores-panel--expanded">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Livability & Accessibility') }}</h4>
                    @include('frontend.properties.show.partials.sale._scores', ['hideHeading' => true])
                </section>

                <section id="rules" class="mt-5 pt-5 border-top border-color-light">
                    <div class="row g-4">
                        <div class="col-md-7">@include('frontend.properties.show.partials.vr._rules')</div>
                        <div class="col-md-5">
                            <h6 class="fw-800 mb-3">{{ __('Location') }}</h6>
                            <div class="map-container-wrapper shadow-sm map-container-sm">
                                @include('frontend.properties.show.partials._map')
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>

        @include('frontend.properties.show.partials.vr._reviews')
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.properties.show.partials.vr._sidebar-booking')
        @include('frontend.properties.show.partials.vr._sidebar-host')
    </x-slot:sidebar>
</x-frontend.detail-shell>

@include('frontend.properties.show.partials.vr._sticky_footer_cta')
@endsection
