@extends('frontend._layouts._app')

@section('title', page_content('services.search.meta_title', __('Professional Services & Solutions')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
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

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            {{-- UPDATED: row-cols-2 ensures two items per row across most screen sizes --}}
            <div class="row g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-2"> 
                @forelse($services as $service)
                    <div class="col">
                        @include('frontend.services._partials._card', ['service' => $service])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-search display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Services Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters to find what you are looking for.') }}</p>
                            <a href="{{ route('services.index') }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('Reset All Filters') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
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
</div>
@endsection
