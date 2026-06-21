@php
    $displayPrice = $product->on_sale && $product->sale_price > 0 ? $product->sale_price : $product->base_price;
    $comparePrice = $product->on_sale && $product->sale_price > 0 ? $product->base_price : null;
@endphp

<div class="product-detail-header mb-4">
    <div class="d-flex flex-wrap align-items-center gap-2 mb-2">
        @if($product->brand)
            <span class="badge bg-light-primary text-primary rounded-2 px-3 py-2 fw-semibold small">
                {{ $product->brand->title }}
            </span>
        @endif
        <span class="metric-label mb-0">{{ $product->category->title ?? __('General') }}</span>
    </div>

    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-start gap-3 mb-3">
        <h1 class="fw-800 display-6 mb-0 text-dark">{{ $product->title }}</h1>

        <div class="product-detail-header__price text-lg-end">
            <span class="metric-label d-block">{{ __('Price') }}</span>
            <div class="d-flex align-items-baseline gap-2 justify-content-lg-end">
                <span class="price-text-large text-primary-color">{{ format_currency($displayPrice) }}</span>
                @if($comparePrice)
                    <span class="text-muted text-decoration-line-through small">{{ format_currency($comparePrice) }}</span>
                @endif
            </div>
        </div>
    </div>

    <div class="product-detail-meta bg-white border rounded-4 p-3 p-md-4">
        <div class="d-flex flex-wrap align-items-center gap-3 gap-md-4 small">
            <span class="text-muted">
                <span class="fw-bold text-dark">{{ __('SKU') }}:</span> {{ $product->sku ?? __('N/A') }}
            </span>

            @if($product->manage_stock && $product->stock_quantity <= 0)
                <span class="text-danger fw-800"><i class="bi bi-x-circle-fill me-1"></i>{{ __('Out of Stock') }}</span>
            @else
                <span class="text-success fw-800"><i class="bi bi-check-circle-fill me-1"></i>{{ __('In Stock') }}</span>
            @endif

            @if($product->is_digital)
                <span class="text-primary fw-800"><i class="bi bi-cloud-download-fill me-1"></i>{{ __('Instant delivery') }}</span>
            @else
                <span class="text-muted"><i class="bi bi-truck me-1"></i>{{ __('Ships Worldwide') }}</span>
            @endif

            @if($product->manage_stock && $product->stock_quantity > 0 && $product->stock_quantity <= ($product->low_stock_threshold ?? 5))
                <span class="text-warning fw-bold">
                    <i class="bi bi-exclamation-triangle me-1"></i>{{ __('Only :count left!', ['count' => $product->stock_quantity]) }}
                </span>
            @endif
        </div>
    </div>
</div>
