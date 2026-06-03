@extends('frontend._layouts._app')

@section('title', page_content('services.search.meta_title', __('Professional Services & Solutions')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="services" x-data="{ isFilterOpen: false }">
    @include('frontend._partials._page-heading', [
        'titleKey' => 'services.search.heading',
        'titleDefault' => __('Professional Services'),
        'subtitleKey' => 'services.search.sub_heading',
        'subtitleDefault' => __('Expert consultation and technical solutions.'),
        'total' => $services->total(),
        'icon' => 'bi-gear-fill',
        'desktopLabel' => __('Services Available'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Refine Search')])
            @include('frontend.services._partials._sidebar_filter')
        @endcomponent

        <div class="col-12 col-lg-9">
            <div class="row g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-2">
                @forelse($services as $service)
                    <div class="col">
                        @include('frontend.services._partials._card', ['service' => $service])
                    </div>
                @empty
                    @include('frontend._partials._listing-empty-state', [
                        'icon' => 'bi-search',
                        'title' => __('No Services Found'),
                        'route' => route('services.index'),
                    ])
                @endforelse
            </div>

            @if($services->hasPages())
                <div class="mt-5 d-flex justify-content-center">
                    {{ $services->links('frontend._partials._pagination') }}
                </div>
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['category', 'expertise', 'location']),
    ])
</x-frontend.listing-shell>
@endsection
