@extends('frontend._layouts._app')

@section('title', $property->meta_title ?: ($property->title . ' ' . __('in') . ' ' . $property->city))

@section('head_extra')
<meta name="description" content="{{ $property->meta_description ?: $property->description }}">
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="property">
    <x-slot:breadcrumbs>
        @include('frontend.properties.show.partials.sale._header')
    </x-slot:breadcrumbs>

    <x-slot:main>
        <div class="card glass-surface border-0 overflow-hidden mb-5">
            <div class="gallery-section border-bottom border-color-light">
                @include('frontend.properties.show.partials._gallery')
            </div>

            <div class="p-4 p-lg-5">
                @include('frontend.properties.show.partials.sale._summary_features')

                <div class="property-details-content mt-5">
                    <section id="description" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Property Details') }}</h4>
                        <div class="text-muted lh-lg fs-6">
                            @include('frontend.properties.show.partials._description')
                        </div>
                    </section>

                    <section id="amenities" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Amenities') }}</h4>
                        @include('frontend.properties.show.partials.sale._amenities')
                    </section>

                    <section id="location" class="pt-4 border-top border-color-light mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Location Overview') }}</h4>
                        @include('frontend.properties.show.partials._map')
                    </section>

                    <section id="livability" class="pt-4 border-top border-color-light property-scores-panel property-scores-panel--expanded">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Livability & Accessibility') }}</h4>
                        @include('frontend.properties.show.partials.sale._scores', ['hideHeading' => true])
                    </section>
                </div>
            </div>
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.properties.show.partials.sale._contact_agent_sidebar')
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            @include('frontend.properties.show.partials._related')
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection
