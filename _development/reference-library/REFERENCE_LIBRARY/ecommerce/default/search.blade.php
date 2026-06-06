@extends('frontend._layouts._app')

@section('title', page_content('products.search.meta_title', __('Shop Products')))
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-4 py-lg-5" x-data="{ isFilterOpen: false, loading: false }">
    
    {{-- Page Heading Section --}}
    <div class="page-title-section my-3 mb-lg-5">
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-end gap-3 text-center text-md-start">
            
            <div class="title-content">
                <h1 class="fw-800 mb-2 display-6 text-dark tracking-tight">
                    @editable('products.search.heading', __('Product Catalog'))
                </h1>
                <p class="text-muted mb-0 fs-6 fs-md-5 mx-auto mx-md-0 sub-heading">
                    @editable('products.search.sub_heading', __('Browse our latest collection of premium products.'))
                </p>
            </div>

            @if($products->total() > 0)
                <div class="results-count">
                    <span class="badge bg-white text-primary border shadow-sm px-4 py-2 rounded-pill fs-6 fw-bold">
                        <i class="bi bi-box-seam-fill me-1 text-primary"></i>
                        <span class="d-inline-block">
                            {{ number_format($products->total()) }} 
                            <span class="d-none d-sm-inline">{{ __('Products Found') }}</span>
                            <span class="d-inline d-sm-none">{{ __('Results') }}</span>
                        </span>
                    </span>
                </div>
            @endif
        </div>
    </div>

    <div class="row g-4">
        {{-- Sidebar Column --}}
        <aside class="col-12 col-lg-3">
            <div class="offcanvas-lg offcanvas-start rounded-4 border-0 shadow-lg" tabindex="-1" id="filterSidebar" aria-labelledby="filterSidebarLabel">
                <div class="offcanvas-header bg-white d-lg-none border-bottom">
                    <h5 class="offcanvas-title fw-bold" id="filterSidebarLabel">{{ __('Filter Products') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#filterSidebar"></button>
                </div>
                <div class="offcanvas-body p-0">
                    {{-- Passing variables from ProductService --}}
                    @include('frontend.themes.products.default._partials._sidebar', [
                        'categories' => $categories,
                        'brands'     => $brands,
                        'maxPrice'   => $maxAllowedPrice
                    ])
                </div>
            </div>
        </aside>

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
                        @include('frontend.themes.products.default._partials._card', ['product' => $product])
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
                    {{ $products->appends(request()->query())->links('frontend.themes.products.default._partials._pagination') }}
                </div>
            @endif
        </main>
    </div>

    {{-- Mobile Floating Filter Button --}}
    <div class="d-lg-none position-fixed bottom-0 start-50 translate-middle-x mb-4 z-3">
        <button class="btn btn-dark rounded-pill px-4 py-2 shadow-lg fw-bold d-flex align-items-center border-white border-2 backdrop-blur" 
                data-bs-toggle="offcanvas" 
                data-bs-target="#filterSidebar">
            <i class="bi bi-sliders2 me-2"></i> 
            {{ __('Filters') }}
            @if($activeFilterCount > 0)
                <span class="ms-2 badge rounded-pill bg-primary">{{ $activeFilterCount }}</span>
            @endif
        </button>
    </div>
</div>
@endsection