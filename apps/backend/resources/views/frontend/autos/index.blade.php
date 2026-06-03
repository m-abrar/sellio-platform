@extends('frontend._layouts._app')

@section('title', @$category->title ? $category->title . ' Vehicles for Sale' : __('Browse All Vehicle Listings'))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="autos" x-data="{ isFilterOpen: false }">
    @include('frontend._partials._page-heading', [
        'titleHtml' => @$category->title ?: page_content('autos.search.heading', __('Certified Pre-Owned Vehicles')),
        'subtitleHtml' => @$category->title ? __('Browse our inventory of quality ') . strtolower($category->title) : page_content('autos.search.sub_heading', __('Explore premium cars, trucks, and SUVs with verified history.')),
        'total' => $autos->total(),
        'icon' => 'bi-check-circle-fill',
        'desktopLabel' => __('Vehicles Available'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Filters')])
            @include('frontend.autos._filter_sidebar')
        @endcomponent

        <div class="col-12 col-lg-9">
            <div class="row g-3 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse($autos as $auto)
                    <div class="col">
                        @include('frontend.autos._auto_card', ['auto' => $auto])
                    </div>
                @empty
                    @include('frontend._partials._listing-empty-state', [
                        'icon' => 'bi-car-front',
                        'title' => __('No Vehicles Found'),
                        'route' => route('autos.index'),
                    ])
                @endforelse
            </div>

            @if($autos->hasPages())
                {{ $autos->links('frontend._partials._pagination') }}
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['brand', 'model', 'price_min', 'price_max', 'year']),
    ])
</x-frontend.listing-shell>
@endsection
