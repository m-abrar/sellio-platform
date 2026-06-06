<div class="d-flex justify-content-between align-items-start mb-2 pt-1">
    <div class="flex-grow-1 me-3">
        {{-- Brand & Category Line --}}
        <div class="d-flex align-items-center gap-2 mb-1">
            @if($product->brand)
                <span class="badge bg-light text-primary border fw-bold text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    {{ $product->brand->title }}
                </span>
            @endif
            <span class="text-muted small text-uppercase fw-bold" style="font-size: 0.75rem; letter-spacing: 1px;">
                {{ $product->category->title ?? __('General') }}
            </span>
        </div>
        <h1 class="fw-800 display-6 mb-0 text-dark">{{ $product->title }}</h1>
    </div>

    {{-- E-commerce Price Display --}}
    <div class="text-end">
        @if($product->on_sale && $product->sale_price > 0)
            <div class="d-flex flex-column align-items-end">
                <span class="badge bg-danger text-white fw-800 p-2 fs-4 shadow-sm">
                    ${{ number_format($product->sale_price, 2) }}
                </span>
                <span class="text-muted text-decoration-line-through small mt-1">
                    ${{ number_format($product->base_price, 2) }}
                </span>
            </div>
        @else
            <span class="badge bg-primary text-white fw-800 p-2 fs-4 shadow-sm">
                ${{ number_format($product->base_price, 2) }}
            </span>
        @endif
    </div>
</div>

{{-- Product Metadata & Action Buttons --}}
<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    <div class="d-flex align-items-center gap-3">
        <p class="mb-0 small text-muted">
            <span class="fw-bold text-dark">{{ __('SKU:') }}</span> {{ $product->sku ?? 'N/A' }}
        </p>
        <div class="vr opacity-25" style="height: 15px;"></div>
        <p class="mb-0 small text-muted">
            {{ __('Added') }} {{ $product->created_at->diffForHumans() }}
        </p>
    </div>
    
    {{-- Product Actions --}}
    <div class="d-flex gap-2">
        <button class="btn btn-sm btn-glass border-color-light text-dark shadow-sm" title="{{ __('Add to Wishlist') }}">
            <i class="bi bi-heart me-1 text-danger"></i>{{ __('Save') }}
        </button>
        <button class="btn btn-sm btn-glass border-color-light text-dark shadow-sm" title="{{ __('Share Product') }}">
            <i class="bi bi-share me-1 text-primary"></i>{{ __('Share') }}
        </button>
    </div>
</div>

{{-- Inventory & Shipping Stats --}}
<div class="d-flex align-items-center mb-4 small flex-wrap gap-4 py-3 px-4 glass-surface rounded-4 border-color-light">
    {{-- Availability Logic --}}
    @if($product->manage_stock && $product->stock_quantity <= 0)
        <span class="text-danger fw-800"><i class="bi bi-x-circle-fill me-2"></i>{{ __('Out of Stock') }}</span>
    @else
        <span class="text-success fw-800"><i class="bi bi-check-circle-fill me-2"></i>{{ __('In Stock') }}</span>
    @endif

    {{-- Digital vs Physical Logic --}}
    @if ($product->is_digital)
        <span class="text-info fw-800"><i class="bi bi-cloud-download-fill me-2"></i>{{ __('Instant Delivery') }}</span>
    @else
        <span class="text-muted"><i class="bi bi-truck me-2"></i>{{ __('Ships Worldwide') }}</span>
    @endif
    
    {{-- Stock Levels (Optional Visibility) --}}
    @if($product->manage_stock && $product->stock_quantity > 0 && $product->stock_quantity <= ($product->low_stock_threshold ?? 5))
        <span class="text-warning fw-bold animate-pulse">
            <i class="bi bi-exclamation-triangle me-1"></i> {{ __('Only :count left!', ['count' => $product->stock_quantity]) }}
        </span>
    @endif

    {{-- External Demo/Video link if exists --}}
    @if($product->video)
        <a href="{{ $product->video }}" target="_blank" class="text-primary text-decoration-none fw-bold ms-lg-auto">
            <i class="bi bi-play-circle-fill me-1"></i>{{ __('Watch Video') }}
        </a>
    @endif
</div>