@extends('frontend._layouts._app')

{{-- Use product data for title and category name --}}
@section('title', $product->title . ' - ' . ($product->category->title ?? __('Product'))) 
@section('body_class', 'has-body-glow bg-light')

@section('content')
<div class="page-content-wrapper py-3 py-lg-4">
    
    {{-- 1. NAVIGATION HEADER (Breadcrumbs) --}}
    @include('frontend.themes.products.default.show.partials._breadcrumbs', [
        'pageTitle' => $product->title,
        'categoryName' => $product->category->title ?? __('Shop'),
        'categorySlug' => $product->category->slug ?? null,
    ])

    <div class="row g-4 mt-1">
        {{-- MAIN COLUMN (8/12) --}}
        <div class="col-lg-8">
            <div class="card glass-surface border-0 overflow-hidden mb-5 shadow-lg">
                
                {{-- 2. IMAGE GALLERY --}}
                <div class="gallery-section border-bottom border-color-light position-relative">
                    {{-- Status Ribbon --}}
                    <div class="position-absolute top-0 start-0 m-3 z-2 d-flex gap-2">
                        @if($product->on_sale)
                            <span class="badge bg-danger text-white shadow-sm border border-white border-opacity-25 px-3 py-2 rounded-pill fw-bold small">
                                <i class="bi bi-percent me-1"></i> {{ __('SALE') }}
                            </span>
                        @endif
                        @if($product->is_digital)
                            <span class="badge bg-info text-white shadow-sm border border-white border-opacity-25 px-3 py-2 rounded-pill fw-bold small">
                                <i class="bi bi-cloud-download me-1"></i> {{ __('DIGITAL') }}
                            </span>
                        @endif
                    </div>
                    @include('frontend.themes.products.default.show.partials._product_gallery') 
                </div>

                <div class="p-4 p-lg-5">
                    
                    {{-- 3. PRODUCT HEADER (Title, Price, SKU) --}}
                    @include('frontend.themes.products.default.show.partials._product_header', [
                        'product' => $product
                    ])

                    <hr class="opacity-10 my-4">

                    {{-- 4. DESCRIPTION & SPECS --}}
                    <div class="product-details-content">
                        <section id="listing-description" class="mb-5">
                            <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Product Description') }}</h4>
                            <div class="listing-description">
                                {!! $product->description !!}
                            </div>
                        </section>

                        {{-- Technical Specifications (From attributes table) --}}
                        @if($product->attributes->where('is_variation', false)->count() > 0)
                            <section id="item-specs" class="mb-5">
                                <h4 class="fw-800 text-dark mb-4 section-title">{{ __('Specifications') }}</h4>
                                @include('frontend.themes.products.default.show.partials._product_specs_table')
                            </section>
                        @endif
                    </div>
                </div>
            </div>
            
            {{-- 5. RELATED PRODUCTS --}}
            <div class="related-wrapper pb-5">
                <h4 class="fw-800 text-dark mb-4 section-title">
                    <i class="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
                    {{ __('Related Products') }}
                </h4>
                @include('frontend.themes.products.default.show.partials._related_products')
            </div>
        </div>

        {{-- SIDEBAR COLUMN (4/12) --}}
        <div class="col-lg-4">
            <aside class="sticky-sidebar">
                
                {{-- 6. PURCHASE CARD (Replaces Contact Card) --}}
                <div class="card glass-surface border-0 rounded-4 shadow-sm mb-4 overflow-hidden" 
                     x-data="productPriceCalculator({
                        basePrice: {{ $product->on_sale ? $product->sale_price : $product->base_price }},
                        productId: {{ $product->id }}
                     })">
                    
                    <div class="p-4">
                        <h6 class="fw-800 text-uppercase mb-3 small" style="letter-spacing: 1px;">{{ __('Configure & Buy') }}</h6>
                        
                        <form action="{{ route('cart.add', $product->id) }}" method="POST" id="purchase-form">
                            @csrf
                            
                            {{-- Variations (Sizes, Colors, etc) --}}
                            @include('frontend.themes.products.default.show.partials.sidebar._variations')

                            {{-- Addons (Warranty, Gift Wrap, etc) --}}
                            @include('frontend.themes.products.default.show.partials.sidebar._addons')

                            {{-- Quantity Selector --}}
                            <div class="mb-4 mt-3">
                                <label class="filter-label mb-2 small fw-bold">{{ __('Quantity') }}</label>
                                <div class="input-group unified-input rounded-3 overflow-hidden">
                                    <button class="btn btn-light border-0 px-3" type="button" @click="quantity > 1 ? quantity-- : null">-</button>
                                    <input type="number" name="quantity" x-model="quantity" class="form-control border-0 text-center bg-transparent shadow-none" readonly>
                                    <button class="btn btn-light border-0 px-3" type="button" @click="quantity < {{ $product->stock_quantity ?? 99 }} ? quantity++ : null">+</button>
                                </div>
                            </div>

                            {{-- Price Breakdown (Dynamic) --}}
                            <div class="bg-light p-3 rounded-3 mb-4 border border-white">
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="small text-muted">{{ __('Unit Price') }}</span>
                                    <span class="small fw-bold" x-text="formatCurrency(currentPrice)"></span>
                                </div>
                                <div class="d-flex justify-content-between border-top pt-2 mt-2">
                                    <span class="fw-bold">{{ __('Total') }}</span>
                                    <span class="fw-800 text-primary h5 mb-0" x-text="formatCurrency(totalPrice)"></span>
                                </div>
                            </div>

                            {{-- Submit Button --}}
                            <button type="submit" 
                                    class="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-800 border-0"
                                    @if($product->manage_stock && $product->stock_quantity <= 0) disabled @endif>
                                <i class="bi bi-cart-plus me-2"></i>
                                {{ ($product->manage_stock && $product->stock_quantity <= 0) ? __('Out of Stock') : __('Add to Cart') }}
                            </button>
                        </form>
                    </div>
                </div>
                
                {{-- 7. BRAND / SELLER INFO --}}
                @if($product->brand || $product->user)
                <div class="card glass-surface border-0 rounded-4 shadow-sm mb-4 p-4">
                     <div class="d-flex align-items-center">
                        <div class="avatar-container me-3">
                            <img src="{{ $product->brand->logo_url ?? $product->user->avatar_url }}" class="rounded-circle object-fit-cover" width="50" height="50">
                        </div>
                        <div>
                            <h6 class="mb-0 fw-bold">{{ $product->brand->title ?? $product->user->name }}</h6>
                            <span class="small text-muted">{{ __('Official Merchant') }}</span>
                        </div>
                     </div>
                </div>
                @endif

                {{-- Shipping & Policy Card --}}
                <div class="p-4 rounded-4 border border-primary border-opacity-10 bg-primary bg-opacity-5">
                    <h6 class="fw-bold text-dark"><i class="bi bi-truck me-2"></i>{{ __('Shipping Info') }}</h6>
                    <ul class="small text-muted mb-0 ps-3">
                        @if($product->is_digital)
                            <li>{{ __('Instant Digital Delivery') }}</li>
                        @else
                            <li>{{ __('Standard shipping: 3-5 business days') }}</li>
                        @endif
                        <li>{{ __('Secure Payment Processing') }}</li>
                        <li>{{ __('Buyer Protection Guaranteed') }}</li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>
</div>
@endsection

{{-- Include extra assets --}}
@include('frontend.themes.products.default.show.partials._styles_extra')
@include('frontend.themes.products.default.show.partials._scripts_extra')