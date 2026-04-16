<div class="row g-3">
    
    @forelse ($related_products->take(2) as $item)
        <div class="col-md-4 col-6">
            <a href="{{ route('products.show', $item->slug) }}" class="text-decoration-none text-dark">
                <div class="card glass-surface related-listing-card h-100 border-0 shadow-sm transition-all shadow-hover">
                    {{-- Product Image with Aspect Ratio --}}
                    <div class="aspect-ratio-1-1 overflow-hidden rounded-top">
                        <img src="{{ $item->main_image_url ?? asset('images/placeholder-product.png') }}" 
                             class="card-img-top related-img w-100 h-100 object-fit-cover" 
                             alt="{{ $item->title }}">
                    </div>

                    <div class="card-body p-3">
                        {{-- Category or Brand Badge --}}
                        <span class="text-primary-color x-small fw-bold text-uppercase d-block mb-1" style="font-size: 0.65rem;">
                            {{ $item->brand->title ?? ($item->category->title ?? __('Product')) }}
                        </span>
                        
                        <h6 class="card-title fw-bold small mb-1 text-truncate">{{ $item->title }}</h6>
                        
                        {{-- Price Logic --}}
                        <p class="card-text fw-800 text-dark mb-0">
                            @if($item->on_sale && $item->sale_price > 0)
                                <span class="text-danger">${{ number_format($item->sale_price, 2) }}</span>
                                <small class="text-muted text-decoration-line-through fw-normal ms-1" style="font-size: 0.7rem;">
                                    ${{ number_format($item->base_price, 2) }}
                                </small>
                            @else
                                ${{ number_format($item->base_price, 2) }}
                            @endif
                        </p>
                    </div>
                </div>
            </a>
        </div>
    @empty
        <div class="col-12 text-center py-4">
            <i class="bi bi-box-seam text-muted display-6 d-block mb-2"></i>
            <p class="text-muted small">{{ __('No related products found.') }}</p>
        </div>
    @endforelse

    {{-- View All Link (Merchant/Brand Shop) --}}
    @if ($related_products->count() > 2)
    <div class="col-md-4 col-6 d-none d-md-block">
        {{-- Links to the brand search or merchant store --}}
        <a href="{{ route('products.index', ['brand_id' => $product->brand_id]) }}" 
           class="card glass-surface related-listing-card h-100 text-center d-flex align-items-center justify-content-center text-decoration-none border-0 shadow-sm shadow-hover">
            <span class="text-primary-color fw-bold small p-3">
                <i class="bi bi-shop d-block mb-2 fs-4"></i>
                {{ __('View Store') }}<br/>
                <small class="text-muted fw-normal">{{ __('More from this brand') }}</small>
            </span>
        </a>
    </div>
    @endif
    
</div>
