@extends('frontend._layouts._app')

@section('title', $property->meta_title ?: ($property->title . ' ' . __('in') . ' ' . $property->city))

@section('head_extra')
<meta name="description" content="{{ $property->meta_description ?: $property->description }}">
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="property-rental">
    <x-slot:breadcrumbs>
        @include('frontend.properties.show.partials._breadcrumbs')
    </x-slot:breadcrumbs>

    <x-slot:gallery>
        @include('frontend.properties.show.partials._gallery')
    </x-slot:gallery>

    <x-slot:main>
        @include('frontend.properties.show.partials.vr._header')

        @include('frontend.properties.show.partials.vr._summary_features')

        <div class="detail-main-card border-0 overflow-hidden mt-4 mb-4">
            <div class="p-4 p-lg-5">
                <section id="about" class="mb-5">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('About this getaway') }}</h4>
                    <div class="text-muted lh-lg">
                        @include('frontend.properties.show.partials._description')
                    </div>
                </section>

                @include('frontend.properties.show.partials.vr._amenities')

                <section id="location" class="mt-5 pt-5 border-top border-color-light">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Location') }}</h4>
                    @include('frontend.properties.show.partials._map')
                </section>

                <section id="rates" class="mt-5 pt-5 border-top border-color-light">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Rates & Availability') }}</h4>
                    @include('frontend.properties.show.partials.vr._seasonal_prices')
                    <div class="mt-5 pt-4 border-top border-color-light">
                        @include('frontend.properties.show.partials.vr._availability_calendar')
                    </div>
                </section>

                <section id="neighbourhood" class="mt-5 pt-5 border-top border-color-light">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Neighbourhood & Livability') }}</h4>
                    @include('frontend.properties.show.partials.vr._local_guide')
                    <div class="mt-5 pt-4 border-top border-color-light property-scores-panel property-scores-panel--expanded">
                        @include('frontend.properties.show.partials.sale._scores', ['hideHeading' => true])
                    </div>
                </section>

                <section id="rules" class="mt-5 pt-5 border-top border-color-light">
                    @include('frontend.properties.show.partials.vr._rules')
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
