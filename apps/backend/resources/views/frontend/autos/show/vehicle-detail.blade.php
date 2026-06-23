@extends('frontend._layouts._app')

@section('title', $auto->meta_title ?: ($auto->year . ' ' . $auto->make . ' ' . $auto->model . ' ' . __('for Sale in') . ' ' . $auto->city))

@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="auto">
    <x-slot:breadcrumbs>
        @include('frontend.autos.show.partials._breadcrumbs')
    </x-slot:breadcrumbs>

    <x-slot:gallery>
        @include('frontend.autos.show.partials._gallery')
    </x-slot:gallery>

    <x-slot:main>
        {{-- Editorial title block --}}
        <header class="property-title-block mb-4">
            <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
                <i class="bi bi-car-front me-1"></i>{{ $auto->category->title ?? __('For Sale') }}
                @if($auto->is_featured)
                    &nbsp;·&nbsp;<i class="bi bi-patch-check-fill me-1"></i>{{ __('Featured') }}
                @endif
            </p>
            <h1 class="display-5 text-dark mb-2 tracking-tight lh-sm">{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}</h1>
            <p class="text-muted mb-3 d-flex align-items-center gap-2">
                <i class="bi bi-geo-alt-fill text-muted small"></i>
                {{ collect([$auto->city, $auto->state])->filter()->join(', ') }}
            </p>
            @if ($auto->sale_price < $auto->base_price && $auto->sale_price > 0)
                <div class="d-flex align-items-baseline gap-2">
                    <h2 class="fw-800 mb-0 display-6" style="color:var(--primary-color)">{{ setting('currency_symbol', '$') }}{{ number_format($auto->sale_price) }}</h2>
                    <del class="text-muted fs-5">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price) }}</del>
                </div>
            @else
                <div class="d-flex align-items-baseline gap-2">
                    <h2 class="fw-800 mb-0 display-6" style="color:var(--primary-color)">{{ setting('currency_symbol', '$') }}{{ number_format($auto->base_price) }}</h2>
                    <span class="text-muted small fw-semibold">{{ __('Asking Price') }}</span>
                </div>
            @endif
            <p class="text-muted small fw-semibold mt-1 mb-0">{{ __('Excl. taxes & licensing') }}</p>
        </header>

        {{-- Key specs bar --}}
        @include('frontend.autos.show.partials._quick_specs')

        {{-- Content sections --}}
        <div class="detail-main-card border-0 overflow-hidden mb-5">
            <div class="p-4 p-lg-5">
                <section id="description" class="mb-5">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">
                        <i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Dealer Comments') }}
                    </h4>
                    <div class="listing-description text-muted lh-lg">
                        @include('frontend.autos.show.partials._description')
                    </div>
                </section>

                <section id="specifications" class="mb-5 pt-4 border-top border-color-light">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">
                        <i class="bi bi-list-columns-reverse me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Technical Specifications') }}
                    </h4>
                    @include('frontend.autos.show.partials._specifications_table')
                </section>

                <section id="features" class="mb-5 pt-4 border-top border-color-light">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">
                        <i class="bi bi-grid-3x3-gap me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Key Options & Features') }}
                    </h4>
                    @include('frontend.autos.show.partials._features')
                </section>

                <section id="location" class="pt-4 border-top border-color-light">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title">
                        <i class="bi bi-pin-map-fill me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Find this Vehicle') }}
                    </h4>
                    @include('frontend.autos.show.partials._map')
                </section>
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
