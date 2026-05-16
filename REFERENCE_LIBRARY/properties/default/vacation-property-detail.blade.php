@extends('frontend._layouts._app')

@section('title', $property->meta_title ?: ($property->title . ' in ' . $property->city))

@section('head_extra')
<meta name="description" content="{{ $property->meta_description ?: $property->description }}">
@endsection

@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" >
    
    {{-- 1. VR HEADER PARTIAL (Title, Price, Badges) --}}
    @include('frontend.themes.properties.default.show.partials.vr._header')

    <div class="row g-4 mt-2">
        <div class="col-lg-8">
            <div class="card glass-surface border-0 overflow-hidden mb-4">
                
                {{-- GALLERY --}}
                <div class="gallery-section">
                    @include('frontend.themes.properties.default.show.partials._gallery')
                </div>

                <div class="p-4 p-lg-5">
                    {{-- 2. CAPACITY & FEATURES --}}
                    @include('frontend.themes.properties.default.show.partials.vr._summary_features')

                    <hr class="my-5 opacity-10">

                    {{-- 3. DESCRIPTION --}}
                    <section id="about" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('About this getaway') }}</h4>
                        <div class="text-muted lh-lg">
                            @include('frontend.themes.properties.default.show.partials._description')
                        </div>
                    </section>

                    {{-- 4. AMENITIES --}}
                    @include('frontend.themes.properties.default.show.partials.vr._amenities')

                    {{-- 5. AVAILABILITY --}}
                    <section id="calendar" class="mt-5 pt-5 border-top border-color-light">
                        @include('frontend.themes.properties.default.show.partials.vr._availability_calendar')
                    </section>

                    {{-- 6. LOCAL GUIDE --}}
                    <section id="neighborhood" class="mt-5 pt-5 border-top border-color-light">
                        @include('frontend.themes.properties.default.show.partials.vr._local_guide')
                    </section>

                    {{-- 7. RULES & MAP --}}
                    <section id="rules" class="mt-5 pt-5 border-top border-color-light">
                        <div class="row g-4">
                            <div class="col-md-7">@include('frontend.themes.properties.default.show.partials.vr._rules')</div>
                            <div class="col-md-5">
                                <h6 class="fw-800 mb-3">{{ __('Location') }}</h6>
                                <div class="map-container-wrapper shadow-sm map-container-sm">
                                    @include('frontend.themes.properties.default.show.partials._map')
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {{-- 8. REVIEWS --}}
            @include('frontend.themes.properties.default.show.partials.vr._reviews')
        </div>

        {{-- SIDEBAR --}}
        <div class="col-lg-4">
            <div class="sticky-sidebar">
                @include('frontend.themes.properties.default.show.partials.vr._sidebar-booking')
                @include('frontend.themes.properties.default.show.partials.vr._sidebar-host')
            </div>
        </div>
    </div>
</div>
@endsection