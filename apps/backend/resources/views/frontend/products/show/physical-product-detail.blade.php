@extends('frontend._layouts._app')

@section('title', $product->title . ' - ' . ($product->category->title ?? __('Product')))
@section('og_image', $product->primary_image_url)
@section('og_description', Str::limit(strip_tags($product->description), 160))
@section('body_class', 'has-body-glow bg-light frontend-page--detail')

@section('content')
<x-frontend.detail-shell variant="product">
    <x-slot:breadcrumbs>
        @include('frontend.products.show.partials._breadcrumbs', [
            'pageTitle'    => $product->title,
            'categoryName' => $product->category->title ?? __('Shop'),
            'categorySlug' => $product->category->slug ?? null,
        ])
    </x-slot:breadcrumbs>

    <x-slot:main>
        <div x-data="productPriceCalculator({
            basePrice: {{ $product->on_sale ? $product->sale_price : $product->base_price }},
            priceUrl: '{{ route('products.calculate-dynamic-price', $product) }}'
        })">

            {{-- ── HERO: Gallery (left) + Purchase (right) ─────────────── --}}
            <div class="row g-4 g-xl-5 mb-5 align-items-start">

                {{-- Gallery column --}}
                <div class="col-lg-6">
                    <div class="position-relative">
                        <div class="position-absolute top-0 start-0 m-3 z-2 d-flex gap-2">
                            @if($product->on_sale)
                                @php
                                    $discountPct = ($product->sale_price > 0 && $product->base_price > $product->sale_price)
                                        ? round((1 - $product->sale_price / $product->base_price) * 100)
                                        : null;
                                @endphp
                                <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:var(--primary-color);color:#fff">
                                    @if($discountPct)
                                        -{{ $discountPct }}%
                                    @else
                                        <i class="bi bi-tag me-1"></i>{{ __('Sale') }}
                                    @endif
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
                </div>

                {{-- Purchase column --}}
                <div class="col-lg-6">
                    <div class="ps-lg-2">

                        @include('frontend.products.show.partials._product_header', ['product' => $product])

                        <form action="{{ route('cart.add', $product->id) }}" method="POST" id="purchase-form" class="mt-4">
                            @csrf

                            @include('frontend.products.show.partials.sidebar._variations')
                            @include('frontend.products.show.partials.sidebar._addons', ['addons' => $addons])

                            <div class="mb-4 mt-3">
                                <label class="filter-label mb-2">{{ __('Quantity') }}</label>
                                <div class="input-group unified-input rounded-3 overflow-hidden" style="max-width:180px">
                                    <button class="btn btn-light border-0 px-3" type="button" @click="quantity > 1 ? quantity-- : null">−</button>
                                    <input type="number" name="quantity" x-model="quantity" class="form-control border-0 text-center bg-transparent shadow-none" readonly>
                                    <button class="btn btn-light border-0 px-3" type="button" @click="quantity < {{ $product->stock_quantity ?? 99 }} ? quantity++ : null">+</button>
                                </div>
                            </div>

                            <div class="p-3 rounded-3 mb-4" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.08)">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="small text-muted fw-600">{{ __('Unit price') }}</span>
                                    <span class="small fw-800" x-text="formatCurrency(currentPrice)"></span>
                                </div>
                                <hr class="my-2 border-color-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">{{ __('Total') }}</span>
                                    <span class="fw-800 fs-5 mb-0" style="color:var(--primary-color)" x-text="formatCurrency(totalPrice)"></span>
                                </div>
                            </div>

                            <button type="submit"
                                    id="main-add-to-cart"
                                    class="btn btn-primary btn-header-cta w-100 mb-3"
                                    @if($product->manage_stock && $product->stock_quantity <= 0) disabled @endif>
                                <i class="bi bi-cart-plus me-2"></i>
                                {{ ($product->manage_stock && $product->stock_quantity <= 0) ? __('Out of stock') : __('Add to cart') }}<i class="bi bi-arrow-right ms-2"></i>
                            </button>
                        </form>

                        {{-- Merchant strip --}}
                        @if($product->brand || $product->user)
                            @php $merchantName = $product->brand?->title ?? $product->user?->name; @endphp
                            <div class="d-flex align-items-center gap-3 p-3 rounded-3 mt-2 mb-3"
                                 style="background:rgba(248,246,243,.7);border:1.5px solid rgba(15,23,42,.06)">
                                <img src="{{ $product->brand?->logo_url ?? $product->user?->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($merchantName).'&background=E05F2C&color=fff&size=60' }}"
                                     class="rounded-circle flex-shrink-0 shadow-sm object-fit-cover"
                                     width="44" height="44" alt="{{ $merchantName }}">
                                <div class="min-w-0 flex-grow-1">
                                    <div class="fw-semibold text-dark small text-truncate">{{ $merchantName }}</div>
                                    <div class="small text-muted" style="font-size:.7rem">
                                        <i class="bi bi-patch-check-fill me-1" style="color:var(--primary-color)"></i>{{ __('Official Merchant') }}
                                    </div>
                                </div>
                                @if($product->user)
                                    <a href="{{ route('partner.profile', $product->user) }}" class="btn btn-sm btn-outline-secondary fw-semibold flex-shrink-0">
                                        {{ __('Store') }} <i class="bi bi-arrow-right ms-1"></i>
                                    </a>
                                @endif
                            </div>
                        @endif

                        {{-- Trust row --}}
                        <div class="d-flex flex-wrap gap-3 small text-muted">
                            <span><i class="bi bi-shield-check me-1" style="color:var(--primary-color)"></i>{{ __('Buyer Protection') }}</span>
                            @if($product->is_digital)
                                <span><i class="bi bi-cloud-download me-1" style="color:var(--primary-color)"></i>{{ __('Instant delivery') }}</span>
                            @else
                                <span><i class="bi bi-truck me-1" style="color:var(--primary-color)"></i>{{ __('3–5 day shipping') }}</span>
                            @endif
                            <span><i class="bi bi-lock me-1" style="color:var(--primary-color)"></i>{{ __('Secure checkout') }}</span>
                        </div>

                    </div>
                </div>
            </div>

            {{-- ── CONTENT TABS ──────────────────────────────────── --}}
            <div class="detail-main-card border-0 overflow-hidden mb-5">

                {{-- Tab nav --}}
                <div class="border-bottom px-4 px-lg-5 pt-2">
                    <ul class="nav product-content-tabs" id="productContentTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="product-content-tab active" id="tab-description"
                                    data-bs-toggle="tab" data-bs-target="#pane-description"
                                    type="button" role="tab">
                                {{ __('Description') }}
                            </button>
                        </li>
                        @if(($attributes ?? collect())->flatten()->where('is_variation', false)->count() > 0)
                            <li class="nav-item" role="presentation">
                                <button class="product-content-tab" id="tab-specs"
                                        data-bs-toggle="tab" data-bs-target="#pane-specs"
                                        type="button" role="tab">
                                    {{ __('Specifications') }}
                                </button>
                            </li>
                        @endif
                        <li class="nav-item" role="presentation">
                            <button class="product-content-tab" id="tab-reviews"
                                    data-bs-toggle="tab" data-bs-target="#pane-reviews"
                                    type="button" role="tab">
                                {{ __('Reviews') }}
                                @if(($product->reviews_count ?? 0) > 0)
                                    <span class="badge ms-1 rounded-pill fw-semibold"
                                          style="background:var(--primary-color);font-size:.65rem">
                                        {{ $product->reviews_count }}
                                    </span>
                                @endif
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="product-content-tab" id="tab-shipping"
                                    data-bs-toggle="tab" data-bs-target="#pane-shipping"
                                    type="button" role="tab">
                                {{ __('Shipping & Returns') }}
                            </button>
                        </li>
                    </ul>
                </div>

                {{-- Tab panes --}}
                <div class="tab-content p-4 p-lg-5">

                    {{-- Description --}}
                    <div class="tab-pane fade show active" id="pane-description" role="tabpanel">
                        <div class="listing-description text-muted lh-lg">
                            {!! sanitize_rich_html($product->description) !!}
                        </div>
                    </div>

                    {{-- Specifications --}}
                    @if(($attributes ?? collect())->flatten()->where('is_variation', false)->count() > 0)
                        <div class="tab-pane fade" id="pane-specs" role="tabpanel">
                            @include('frontend.products.show.partials._product_specs_table')
                        </div>
                    @endif

                    {{-- Reviews --}}
                    <div class="tab-pane fade" id="pane-reviews" role="tabpanel">
                        @include('frontend.products.show.partials._reviews_tab')
                    </div>

                    {{-- Shipping & Returns --}}
                    <div class="tab-pane fade" id="pane-shipping" role="tabpanel">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <div class="d-flex gap-3 mb-4">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="d-flex align-items-center justify-content-center rounded-2"
                                             style="width:40px;height:40px;background:rgba(var(--primary-color-rgb),.08)">
                                            <i class="bi bi-truck" style="color:var(--primary-color)"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 class="fw-800 text-dark mb-1">{{ __('Shipping') }}</h6>
                                        <p class="small text-muted mb-0 lh-lg">
                                            {{ __('Standard delivery 3–5 business days. Express options available at checkout. Free shipping on orders above the threshold.') }}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex gap-3 mb-4">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="d-flex align-items-center justify-content-center rounded-2"
                                             style="width:40px;height:40px;background:rgba(var(--primary-color-rgb),.08)">
                                            <i class="bi bi-globe" style="color:var(--primary-color)"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 class="fw-800 text-dark mb-1">{{ __('International orders') }}</h6>
                                        <p class="small text-muted mb-0 lh-lg">
                                            {{ __('We ship worldwide. Delivery times and customs duties vary by destination. Check at checkout for your region.') }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="d-flex gap-3 mb-4">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="d-flex align-items-center justify-content-center rounded-2"
                                             style="width:40px;height:40px;background:rgba(var(--primary-color-rgb),.08)">
                                            <i class="bi bi-arrow-counterclockwise" style="color:var(--primary-color)"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 class="fw-800 text-dark mb-1">{{ __('Returns') }}</h6>
                                        <p class="small text-muted mb-0 lh-lg">
                                            {{ __('30-day hassle-free returns on most items. Items must be unused and in original packaging. Digital products are non-refundable.') }}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex gap-3">
                                    <div class="flex-shrink-0 mt-1">
                                        <div class="d-flex align-items-center justify-content-center rounded-2"
                                             style="width:40px;height:40px;background:rgba(var(--primary-color-rgb),.08)">
                                            <i class="bi bi-headset" style="color:var(--primary-color)"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <h6 class="fw-800 text-dark mb-1">{{ __('Need help?') }}</h6>
                                        <p class="small text-muted mb-1 lh-lg">
                                            {{ __('Contact our support team for any shipping or return queries.') }}
                                        </p>
                                        <a href="{{ route('contact') }}" class="btn btn-sm btn-outline-secondary fw-semibold">
                                            {{ __('Get support') }} <i class="bi bi-arrow-right ms-1"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {{-- ── STICKY FLOATING BAR ──────────────────────────────────── --}}
            <div id="product-sticky-bar"
                 class="fixed-bottom bg-white border-top shadow d-none"
                 style="z-index:1050;padding:.75rem 0">
                <div class="container-xl d-flex align-items-center gap-3">
                    <div class="min-w-0 flex-grow-1 d-none d-md-block">
                        <div class="fw-800 text-dark text-truncate" style="font-family:var(--font-heading);font-size:.95rem">{{ $product->title }}</div>
                        <div class="small text-muted">
                            {{ __('Total:') }}
                            <span class="fw-800" style="color:var(--primary-color)" x-text="formatCurrency(totalPrice)"></span>
                        </div>
                    </div>
                    <span class="fw-800 fs-5 d-md-none flex-shrink-0" style="color:var(--primary-color)" x-text="formatCurrency(totalPrice)"></span>
                    <button type="submit" form="purchase-form"
                            class="btn btn-primary btn-header-cta ms-auto flex-shrink-0"
                            @if($product->manage_stock && $product->stock_quantity <= 0) disabled @endif>
                        <i class="bi bi-cart-plus me-2"></i>{{ __('Add to cart') }}<i class="bi bi-arrow-right ms-2"></i>
                    </button>
                </div>
            </div>

        </div>{{-- /x-data --}}
    </x-slot:main>

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

@push('scripts')
<script>
(function () {
    var mainBtn   = document.getElementById('main-add-to-cart');
    var stickyBar = document.getElementById('product-sticky-bar');
    if (!mainBtn || !stickyBar) return;
    var observer = new IntersectionObserver(function (entries) {
        stickyBar.classList.toggle('d-none', entries[0].isIntersecting);
    }, { threshold: 0 });
    observer.observe(mainBtn);
})();
</script>
@endpush
