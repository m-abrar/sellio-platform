@extends('frontend._layouts._app')

@section('title', $auto->meta_title ?: ($auto->year . ' ' . $auto->make . ' ' . $auto->model . ' ' . __('for Sale in') . ' ' . $auto->city)) 

@section('body_class', 'has-body-glow bg-light')

@section('content')
<x-frontend.detail-shell variant="auto">
    <x-slot:breadcrumbs>
        @include('frontend.autos.show.partials._header')
    </x-slot:breadcrumbs>

    <x-slot:main>
        <div class="card glass-surface border-0 overflow-hidden mb-5 shadow-lg">
            <div class="gallery-section border-bottom border-color-light">
                @include('frontend.autos.show.partials._gallery')
            </div>

            <div class="p-4 p-lg-5">
                <div class="row align-items-start mb-4">
                    <div class="col-md-8">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-primary-light text-primary-color px-3 py-2 rounded-pill fw-bold small">
                                <i class="bi bi-tag-fill me-1"></i> {{ __('For Sale') }}
                            </span>
                            @if($auto->is_featured)
                                <span class="badge bg-dark text-white px-3 py-2 rounded-pill fw-bold small">
                                    <i class="bi bi-star-fill text-warning me-1"></i> {{ __('Featured') }}
                                </span>
                            @endif
                        </div>
                        <h1 class="fw-800 display-5 mb-1 text-dark">{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}</h1>
                        <p class="text-muted fs-5 mb-0">
                            <i class="bi bi-geo-alt-fill text-primary me-1"></i> {{ $auto->city }}, {{ $auto->state }}
                        </p>
                    </div>
                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                        @if ($auto->sale_price < $auto->base_price && $auto->sale_price > 0)
                            <h2 class="text-danger fw-800 mb-0">{{ setting('currency_symbol', '$') }}{{ number_format($auto->sale_price) }}</h2>
                            <del class="text-muted small">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price) }}</del>
                        @else
                            <div class="price-tag-lg shadow-sm">
                                {{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price) }}
                            </div>
                        @endif
                        <p class="text-muted small mt-2 mb-0 fw-bold">{{ __('Excl. Taxes & Licensing') }}</p>
                    </div>
                </div>

                <hr class="opacity-10 my-4">

                @include('frontend.autos.show.partials._quick_specs')

                <div class="property-details-content mt-5">
                    <section id="description" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Dealer Comments') }}</h4>
                        <div class="listing-description">
                            @include('frontend.autos.show.partials._description')
                        </div>
                    </section>

                    <section id="specifications" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Technical Specifications') }}</h4>
                        @include('frontend.autos.show.partials._specifications_table')
                    </section>

                    <section id="features" class="mb-5">
                        <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Key Options & Features') }}</h4>
                        @include('frontend.autos.show.partials._features')
                    </section>

                    <section id="location" class="pt-4 border-top border-color-light">
                        <h4 class="fw-800 text-dark mb-4">{{ __('Find this Vehicle') }}</h4>
                        @include('frontend.autos.show.partials._map')
                    </section>
                </div>
            </div>
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        @include('frontend.autos.show.partials._sidebar')
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            @include('frontend.autos.show.partials._related_autos')
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection

@section('head_extra')
<meta name="description" content="{{ $auto->meta_description ?: Str::limit($auto->description, 160) }}">
@endsection
