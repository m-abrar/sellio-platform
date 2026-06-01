@extends('frontend._layouts._app')
@section('title', page_content('properties.search.meta_title', __('Premium Real Estate Listings')))
@section('body_class', 'has-body-glow')
@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false }">
    
    @include('frontend._partials._page-heading', [
        'titleKey' => 'properties.search.heading',
        'titleDefault' => __('Properties'),
        'subtitleKey' => 'properties.search.sub_heading',
        'subtitleDefault' => __('Explore premium real estate listings.'),
        'total' => $properties->total(),
        'icon' => 'bi-houses-fill',
        'desktopLabel' => __('Listings Available'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Filters')])
            @include('frontend.properties._partials._sidebar_filter')
        @endcomponent

        {{-- Listings Column --}}
        <div class="col-12 col-lg-9">
            <div class="row g-3 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse($properties as $property)
                    <div class="col">
                        @include('frontend.properties._partials._card', ['property' => $property])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="bg-white rounded-4 shadow-sm p-5 border">
                            <i class="bi bi-house-exclamation display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Results Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters to find what you are looking for.') }}</p>
                            <a href="{{ route('properties.index') }}" class="btn btn-primary rounded-pill px-4">{{ __('Reset All Filters') }}</a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
            @if($properties->hasPages())
                {{ $properties->appends(request()->query())->links('frontend._partials._pagination') }}
            @endif
        </div>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'active' => request()->anyFilled(['category', 'max_price', 'location', 'bedrooms', 'bathrooms', 'amenities', 'features']),
    ])
</div>
@endsection

@push('scripts')
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            flatpickr("#check_in, #check_out", {
                altInput: true,
                altFormat: "F j, Y",
                dateFormat: "Y-m-d",
            });
        });
    </script>
@endpush
