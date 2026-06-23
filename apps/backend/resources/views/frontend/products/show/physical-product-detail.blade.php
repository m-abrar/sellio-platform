@extends('frontend._layouts._app')

@section('title', $product->title . ' - ' . ($product->category->title ?? __('Product')))
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="product">
    <x-slot:breadcrumbs>
        @include('frontend.products.show.partials._breadcrumbs', [
            'pageTitle' => $product->title,
            'categoryName' => $product->category->title ?? __('Shop'),
            'categorySlug' => $product->category->slug ?? null,
        ])
    </x-slot:breadcrumbs>

    <x-slot:gallery>
        <div class="position-relative">
            <div class="position-absolute top-0 start-0 m-3 z-2 d-flex gap-2">
                @if($product->on_sale)
                    <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:var(--primary-color);color:#fff">
                        <i class="bi bi-percent me-1"></i>{{ __('Sale') }}
                    </span>
                @endif
                @if($product->is_digital)
                    <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:var(--primary-color);color:#fff">
                        <i class="bi bi-cloud-download me-1"></i>{{ __('Digital') }}
                    </span>
                @endif
            </div>
            @include('frontend.products.show.partials._product_gallery')
        </div>
    </x-slot:gallery>

    <x-slot:main>
        <div class="detail-main-card border-0 overflow-hidden mb-5">
            <div class="p-4 p-lg-5">
                @include('frontend.products.show.partials._product_header', ['product' => $product])

                <section id="listing-description" class="mb-5">
                    <h4 class="fw-800 text-dark mb-4 detail-section-title"><i class="bi bi-body-text me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Product Description') }}</h4>
                    <div class="listing-description text-muted lh-lg">
                        {!! sanitize_rich_html($product->description) !!}
                    </div>
                </section>

                @if(($attributes ?? collect())->flatten()->where('is_variation', false)->count() > 0)
                    <section id="item-specs" class="mb-0">
                        <h4 class="fw-800 text-dark mb-4 detail-section-title"><i class="bi bi-list-check me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Specifications') }}</h4>
                        @include('frontend.products.show.partials._product_specs_table')
                    </section>
                @endif
            </div>
        </div>
    </x-slot:main>

    <x-slot:sidebar>
        <div class="detail-sidebar-card overflow-hidden sticky-sidebar"
             x-data="productPriceCalculator({
                basePrice: {{ $product->on_sale ? $product->sale_price : $product->base_price }},
                priceUrl: '{{ route('products.calculate-dynamic-price', $product) }}'
             })">
            <div class="p-4" style="background:#F4F0EC;border-bottom:1.5px solid rgba(15,23,42,.07)">
                <p class="small fw-semibold text-uppercase mb-1" style="letter-spacing:.06em;color:var(--primary-color)">
                    <i class="bi bi-cart-fill me-1"></i>{{ __('Purchase') }}
                </p>
                <h4 class="fw-800 text-dark mb-0" style="font-family:var(--font-heading)">{{ __('Configure & Buy') }}</h4>
            </div>
            <div class="p-4">
                <form action="{{ route('cart.add', $product->id) }}" method="POST" id="purchase-form">
                    @csrf

                    @include('frontend.products.show.partials.sidebar._variations')
                    @include('frontend.products.show.partials.sidebar._addons', ['addons' => $addons])

                    <div class="mb-4 mt-3">
                        <label class="filter-label mb-2">{{ __('Quantity') }}</label>
                        <div class="input-group unified-input rounded-3 overflow-hidden">
                            <button class="btn btn-light border-0 px-3" type="button" @click="quantity > 1 ? quantity-- : null">-</button>
                            <input type="number" name="quantity" x-model="quantity" class="form-control border-0 text-center bg-transparent shadow-none" readonly>
                            <button class="btn btn-light border-0 px-3" type="button" @click="quantity < {{ $product->stock_quantity ?? 99 }} ? quantity++ : null">+</button>
                        </div>
                    </div>

                    <div class="p-4 rounded-4 mb-4" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.08)">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="small text-muted fw-600">{{ __('Unit Price') }}</span>
                            <span class="small fw-800" x-text="formatCurrency(currentPrice)"></span>
                        </div>
                        <hr class="my-3 border-color-light">
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold">{{ __('Total') }}</span>
                            <span class="fw-800 fs-4 mb-0" style="color:var(--primary-color)" x-text="formatCurrency(totalPrice)"></span>
                        </div>
                    </div>

                    <button type="submit"
                            class="btn btn-primary btn-header-cta w-100"
                            @if($product->manage_stock && $product->stock_quantity <= 0) disabled @endif>
                        <i class="bi bi-cart-plus me-2"></i>
                        {{ ($product->manage_stock && $product->stock_quantity <= 0) ? __('Out of stock') : __('Add to cart') }}<i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </form>
            </div>
        </div>

        @if($product->brand || $product->user)
        @php $merchantName = $product->brand?->title ?? $product->user?->name; @endphp
            <div class="detail-sidebar-card p-4 mt-4">
                <h4 class="fw-800 mb-3">{{ __('Sold by') }} {{ $merchantName }}</h4>
                <div class="text-center mb-3 border-bottom pb-3" style="border-color:rgba(15,23,42,.07)!important">
                    <img src="{{ $product->brand?->logo_url ?? $product->user?->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($merchantName).'&background=E05F2C&color=fff&size=80' }}"
                         class="host-profile-avatar rounded-circle mb-2 shadow-sm"
                         width="80" height="80" alt="{{ $merchantName }}">
                    <h5 class="mb-0 fw-semibold text-dark">{{ $merchantName }}</h5>
                    <span class="small fw-semibold mt-1 d-inline-block rounded-2 px-2 py-1" style="background:rgba(var(--primary-color-rgb),.08);color:var(--primary-color)">
                        <i class="bi bi-patch-check-fill me-1"></i>{{ __('Official Merchant') }}
                    </span>
                </div>
                @if($product->user)
                <div class="d-grid">
                    <a href="{{ route('partner.profile', $product->user) }}" class="btn btn-outline-secondary fw-semibold">
                        <i class="bi bi-shop me-2"></i>{{ __('View store') }}
                    </a>
                </div>
                <p class="text-center small text-muted mt-3 mb-0">{{ __('We protect your personal information.') }}</p>
                @endif
            </div>
        @endif

        <div class="detail-sidebar-card p-4 mt-4">
            <h6 class="fw-800 text-dark mb-3"><i class="bi bi-truck me-2" style="color:var(--primary-color)"></i>{{ __('Shipping info') }}</h6>
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
    </x-slot:sidebar>

    <x-slot:related>
        <div class="related-wrapper pb-5">
            <h4 class="fw-800 text-dark mb-4 detail-section-title">
                <i class="bi bi-grid-3x3-gap-fill me-2" style="color:var(--primary-color)"></i>
                {{ __('Related Products') }}
            </h4>
            @include('frontend.products.show.partials._related_products')
        </div>
    </x-slot:related>
</x-frontend.detail-shell>
@endsection

@include('frontend.products.show.partials._styles_extra')
@include('frontend.products.show.partials._scripts_extra')
