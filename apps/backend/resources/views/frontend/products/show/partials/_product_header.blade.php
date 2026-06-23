@php
    $displayPrice = $product->on_sale && $product->sale_price > 0 ? $product->sale_price : $product->base_price;
    $comparePrice = $product->on_sale && $product->sale_price > 0 ? $product->base_price : null;
@endphp

<div class="product-detail-header mb-4">
    <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:var(--primary-color)">
        <i class="bi bi-tag me-1"></i>{{ $product->category->title ?? __('Product') }}
        @if($product->brand)
            &nbsp;·&nbsp;{{ $product->brand->title }}
        @endif
    </p>

    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-3">
        <h1 class="display-6 text-dark mb-0 tracking-tight lh-sm">{{ $product->title }}</h1>

        <div class="product-detail-header__price text-lg-end flex-shrink-0">
            <div class="d-flex align-items-baseline gap-2 justify-content-lg-end">
                <span class="price-text-large" style="color:var(--primary-color)">{{ format_currency($displayPrice) }}</span>
                @if($comparePrice)
                    <span class="text-muted text-decoration-line-through small">{{ format_currency($comparePrice) }}</span>
                @endif
            </div>
        </div>
    </div>

    <div class="product-detail-meta p-3 p-md-4 rounded-3" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
        <div class="d-flex flex-wrap align-items-center gap-3 gap-md-4 small">
            <span class="text-muted">
                <span class="fw-bold text-dark">{{ __('SKU') }}:</span> {{ $product->sku ?? __('N/A') }}
            </span>

            @if($product->manage_stock && $product->stock_quantity <= 0)
                <span class="fw-800" style="color:var(--primary-color)"><i class="bi bi-x-circle-fill me-1"></i>{{ __('Out of Stock') }}</span>
            @else
                <span class="fw-800" style="color:var(--primary-color)"><i class="bi bi-check-circle-fill me-1"></i>{{ __('In Stock') }}</span>
            @endif

            @if($product->is_digital)
                <span class="fw-800" style="color:var(--primary-color)"><i class="bi bi-cloud-download-fill me-1"></i>{{ __('Instant delivery') }}</span>
            @else
                <span class="text-muted"><i class="bi bi-truck me-1"></i>{{ __('Ships Worldwide') }}</span>
            @endif

            @if($product->manage_stock && $product->stock_quantity > 0 && $product->stock_quantity <= ($product->low_stock_threshold ?? 5))
                <span class="fw-bold" style="color:var(--primary-color)">
                    <i class="bi bi-exclamation-triangle me-1"></i>{{ __('Only :count left!', ['count' => $product->stock_quantity]) }}
                </span>
            @endif
        </div>
    </div>
</div>
