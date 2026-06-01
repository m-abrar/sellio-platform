@extends('frontend._layouts._app')

@section('title', page_content('products.search.meta_title', __('Shop Products')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false, loading: false }">
    
    @include('frontend._partials._page-heading', [
        'titleKey' => 'products.search.heading',
        'titleDefault' => __('Product Catalog'),
        'subtitleKey' => 'products.search.sub_heading',
        'subtitleDefault' => __('Browse our latest collection of premium products.'),
        'total' => $products->total(),
        'icon' => 'bi-box-seam-fill',
        'desktopLabel' => __('Products Found'),
    ])

    <div class="row g-4">
        @component('frontend._partials._filter-shell', ['title' => __('Filter Products')])
            @include('frontend.products._partials._sidebar', [
                'categories' => $categories,
                'brands'     => $brands,
                'maxPrice'   => $maxAllowedPrice
            ])
        @endcomponent

        {{-- Products Column --}}
        <main class="col-12 col-lg-9">
            {{-- Toolbar: Sorting & View Switcher --}}
            <div class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded-3 border shadow-sm">
                <div class="d-flex align-items-center">
                    <label class="me-2 text-muted small d-none d-md-block text-nowrap">{{ __('Sort By:') }}</label>
                    <select class="form-select form-select-sm border-0 bg-light rounded-pill px-3" 
                            aria-label="{{ __('Sort products') }}"
                            onchange="window.location.href = this.value" >
                        <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'latest']) }}" @selected(request('sort_by') == 'latest')>{{ __('Newest') }}</option>
                        <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'price_low']) }}" @selected(request('sort_by') == 'price_low')>{{ __('Price: Low to High') }}</option>
                        <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'price_high']) }}" @selected(request('sort_by') == 'price_high')>{{ __('Price: High to Low') }}</option>
                        <option value="{{ request()->fullUrlWithQuery(['sort_by' => 'rating']) }}" @selected(request('sort_by') == 'rating')>{{ __('Top Rated') }}</option>
                    </select>
                </div>
                
                <div class="view-modes d-none d-md-flex gap-2">
                    <button class="btn btn-sm btn-light rounded-circle @if(request('view') != 'list') active @endif"><i class="bi bi-grid-3x3-gap"></i></button>
                    <button class="btn btn-sm btn-light rounded-circle @if(request('view') == 'list') active @endif"><i class="bi bi-list-task"></i></button>
                </div>
            </div>

            <div class="row g-2 g-md-3 g-lg-4 row-cols-2 row-cols-md-2 row-cols-xl-3">
                @forelse ($products as $product)
                    <div class="col">
                        @include('frontend.products._partials._card', ['product' => $product])
                    </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <div class="glass-surface rounded-4 shadow-sm p-5 border bg-white">
                            <i class="bi bi-cart-x display-1 text-muted opacity-25 mb-3"></i>
                            <h4 class="fw-bold">{{ __('No Products Found') }}</h4>
                            <p class="text-muted">{{ __('Try adjusting your filters or search terms.') }}</p>
                            <a href="{{ url()->current() }}" class="btn btn-primary rounded-pill px-4 shadow-sm">
                                <i class="bi bi-arrow-clockwise me-2"></i>{{ __('Reset Search') }}
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
            @if($products->hasPages())
                <div class="mt-5 d-flex justify-content-center" role="navigation" aria-label="Pagination">
                    {{ $products->appends(request()->query())->links('frontend._partials._pagination') }}
                </div>
            @endif
        </main>
    </div>

    @include('frontend._partials._mobile-filter-button', [
        'activeCount' => $activeFilterCount,
    ])
</div>
@endsection
