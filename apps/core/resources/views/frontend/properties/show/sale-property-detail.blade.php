@extends('frontend._layouts._app')

@section('title', $property->meta_title ?: ($property->title . ' for Sale in ' . $property?->city)) 

@section('head_extra')
<meta name="description" content="{{ $property->meta_description ?: $property->description }}">
@endsection

@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5">
    
    {{-- 1. HEADER PARTIAL --}}
    @include('frontend.properties.show.partials.sale._header')

    @include('frontend._partials._alerts')

    <div class="row g-4">
        {{-- MAIN COLUMN --}}
        <div class="col-lg-8">
            <div class="card glass-surface border-0 overflow-hidden mb-5">
                
                {{-- GALLERY --}}
                <div class="gallery-section border-bottom border-color-light">
                    @include('frontend.properties.show.partials._gallery')
                </div>

                <div class="p-4 p-lg-5">
                    {{-- KEY FEATURES GRID --}}
                    @include('frontend.properties.show.partials.sale._summary_features')

                    <div class="property-details-content mt-5">
                        {{-- DESCRIPTION --}}
                        <section id="description" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('The Space') }}</h4>
                            <div class="text-muted lh-lg fs-6">
                                @include('frontend.properties.show.partials._description')
                            </div>
                        </section>

                        {{-- AMENITIES --}}
                        <section id="amenities" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Amenities') }}</h4>
                            @include('frontend.properties.show.partials.sale._amenities')
                        </section>

                        <hr class="my-5 border-color-light">

                        {{-- LOCATION OVERVIEW & MAP --}}
                        <section id="location" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Location Overview') }}</h4>
                            <div class="mb-4">
                                @include('frontend.properties.show.partials._map')
                            </div>
                            <div class="mb-4">
                                @include('frontend.properties.show.partials.sale._policies')
                            </div>
                        </section>

                        {{-- NEIGHBOURHOOD & SCORES --}}
                        <section id="neighbourhood" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Local Neighbourhood & Lifestyle') }}</h4>
                            <div class="row g-3">
                                <div class="col-md-6">
                                    @include('frontend.properties.show.partials.sale._neighborhood')
                                </div>
                                <div class="col-md-6">
                                    
                                    @include('frontend.properties.show.partials.sale._scores')
                                </div>
                            </div>
                        </section>

                        {{-- TOURS & DOCUMENTS --}}
                        <section id="tours" class="pt-4 border-top border-color-light">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Digital Assets & Tours') }}</h4>
                            @include('frontend.properties.show.partials.sale._tours_and_documents')
                        </section>
                    </div>
                </div>
            </div>

            {{-- RELATED SECTION --}}
            <div class="related-wrapper pb-5">
                 @include('frontend.properties.show.partials._related')
            </div>
        </div>

        {{-- SIDEBAR --}}
        <div class="col-lg-4">
            <aside class="sticky-sidebar">
                <div class="mb-4">
                    @include('frontend.properties.show.partials.sale._contact_form_sidebar')
                </div>
                
                <div class="mb-4">
                    @include('frontend.properties.show.partials.sale._contact_agent_sidebar')
                </div>
            </aside>
        </div>
    </div>
</div>
@endsection
