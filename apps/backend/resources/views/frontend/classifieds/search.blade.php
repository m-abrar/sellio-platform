@extends('frontend._layouts._app')

@section('title', page_content('classifieds.search.meta_title', __('Community Classifieds & Marketplace')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
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

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            <div class="row g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse ($classifieds as $classified)
                    <div class="col">
                        @include('frontend.classifieds._partials._card', ['classified' => $classified])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-search display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Ads Found') }}</h4>
                            <p class="text-muted">{{ __('Try broadening your search or changing categories.') }}</p>
                            <a href="{{ route(Route::currentRouteName()) }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('Reset All Filters') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
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
</div>
@endsection
