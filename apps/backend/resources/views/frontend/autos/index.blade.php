@extends('frontend._layouts._app')

@section('title', @$category->title ? $category->title . ' Vehicles for Sale' : __('Browse All Vehicle Listings'))
@section('body_class', 'has-body-glow bg-light') {{-- Added bg-light for consistency --}}

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
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

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            <div class="row g-3 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse($autos as $auto)
                    <div class="col">
                        @include('frontend.autos._auto_card', ['auto' => $auto])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-car-front display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Vehicles Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters to find what you are looking for.') }}</p>
                            <a href="{{ route('autos.index') }}" class="btn btn-primary rounded-pill px-4">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('Reset All Filters') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>
            {{-- Pagination --}}
            @if($autos->hasPages())
                {{ $autos->links('frontend._partials._pagination') }}
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['brand', 'model', 'price_min', 'price_max', 'year']),
    ])
</div>
@endsection

@push('scripts')
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
@endpush
