@extends('frontend._layouts._app')

@section('title', page_content('classifieds.search.meta_title', __('Community Classifieds & Marketplace')))
@section('body_class', 'has-body-glow bg-light frontend-page--listing')

@section('content')
<x-frontend.listing-shell variant="classifieds" x-data="{ isFilterOpen: false }">
    @include('frontend._partials._page-heading', [
        'titleKey' => 'classifieds.search.heading',
        'titleDefault' => __('Marketplace'),
        'subtitleKey' => 'classifieds.search.sub_heading',
        'subtitleDefault' => __('Find great deals in your local community.'),
        'total' => $classifieds->total(),
        'icon' => 'bi-tags-fill',
        'desktopLabel' => __('Ads Available'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Refine Search')])
            @include('frontend.classifieds._partials._sidebar')
        @endcomponent

        <div class="col-12 col-lg-9">
            <div class="row g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse ($classifieds as $classified)
                    <div class="col">
                        @include('frontend.classifieds._partials._card', ['classified' => $classified])
                    </div>
                @empty
                    @include('frontend._partials._listing-empty-state', [
                        'icon' => 'bi-search',
                        'title' => __('No Ads Found'),
                        'description' => __('Try broadening your search or changing categories.'),
                        'route' => route(Route::currentRouteName()),
                    ])
                @endforelse
            </div>

            @if($classifieds->hasPages())
                <div class="mt-5 d-flex justify-content-center">
                    {{ $classifieds->links('frontend._partials._pagination') }}
                </div>
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['q', 'category', 'price_min', 'price_max']),
    ])
</x-frontend.listing-shell>
@endsection
