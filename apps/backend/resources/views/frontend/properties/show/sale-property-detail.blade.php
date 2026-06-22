@extends('frontend._layouts._app')

@section('title', $property->meta_title ?: ($property->title . ' ' . __('for Sale in') . ' ' . $property?->city))

@section('head_extra')
<meta name="description" content="{{ $property->meta_description ?: $property->description }}">
@endsection

@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="property-sale">
    <x-slot:breadcrumbs>
        @include('frontend.properties.show.partials._breadcrumbs')
    </x-slot:breadcrumbs>

    <x-slot:gallery>
        @include('frontend.properties.show.partials._gallery')
    </x-slot:gallery>

    <x-slot:main>
        @include('frontend.properties.show.partials.sale._header')

        @include('frontend.properties.show.partials.sale._summary_features')

        <div class="detail-main-card border-0 overflow-hidden mt-4 mb-5">
            <div class="p-4 p-lg-5">
                <div class="property-details-content">
                    <section id="description" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('The Space') }}</h4>
                        <div class="text-muted lh-lg fs-6">
                            @include('frontend.properties.show.partials._description')
                        </div>
                    </section>

                    <section id="amenities" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Amenities') }}</h4>
                        @include('frontend.properties.show.partials.sale._amenities')
                    </section>

                    <hr class="my-5 border-color-light">

                    <section id="location" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Location') }}</h4>
                        @include('frontend.properties.show.partials._map')
                    </section>

                    <section id="neighbourhood" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Local Neighbourhood & Lifestyle') }}</h4>
                        <div class="row g-3">
                            <div class="col-md-6">
                                @include('frontend.properties.show.partials.sale._neighborhood')
                            </div>
                            <div class="col-md-6">
                                @include('frontend.properties.show.partials.sale._scores')
                            </div>
                        </div>
                    </section>

                    <section id="tours" class="pt-4 border-top border-color-light mb-5">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Virtual Tours & Documents') }}</h4>
                        @include('frontend.properties.show.partials.sale._tours_and_documents')
                    </section>

                    <section id="disclosures" class="pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title">{{ __('Property Details & Disclosures') }}</h4>
                        @include('frontend.properties.show.partials.sale._policies')
                    </section>
                </div>
            </div>
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.properties.show.partials.sale._contact_form_sidebar')
        @include('frontend.properties.show.partials.sale._contact_agent_sidebar')
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            @include('frontend.properties.show.partials._related')
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection
