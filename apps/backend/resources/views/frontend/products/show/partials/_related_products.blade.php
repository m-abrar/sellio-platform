<div class="row g-3">
    @forelse ($related_products->take(2) as $item)
        <div class="col-md-4 col-6">
            <a href="{{ route('product.show', $item->slug) }}" class="text-decoration-none text-dark">
                <div class="card bg-white border related-listing-card h-100 border-0 shadow-sm transition-all shadow-hover">
                    <div class="aspect-ratio-1-1 overflow-hidden rounded-top">
                        <img src="{{ $item->primary_image_url }}"
                             class="card-img-top related-img w-100 h-100 object-fit-cover"
                             alt="{{ $item->title }}">
                    </div>

                    <div class="card-body p-3">
                        <span class="text-primary x-small fw-bold text-uppercase d-block mb-1 tiny">
                            {{ $item->brand->title ?? ($item->category->title ?? __('Product')) }}
                        </span>

                        <h6 class="card-title fw-bold small mb-1 text-truncate">{{ $item->title }}</h6>

                        <p class="card-text fw-800 text-dark mb-0">
                            @if($item->on_sale && $item->sale_price > 0)
                                <span class="text-danger">{{ format_currency($item->sale_price) }}</span>
                                <small class="text-muted text-decoration-line-through fw-normal ms-1 fs-xs">
                                    {{ format_currency($item->base_price) }}
                                </small>
                            @else
                                {{ format_currency($item->base_price) }}
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

    @if ($related_products->count() > 2 && $product->brand_id)
        <div class="col-md-4 col-6 d-none d-md-block">
            <a href="{{ route('products.index', ['brand' => $product->brand_id]) }}"
               class="card bg-white border related-listing-card h-100 text-center d-flex align-items-center justify-content-center text-decoration-none border-0 shadow-sm shadow-hover">
                <span class="text-primary fw-bold small p-3">
                    <i class="bi bi-shop d-block mb-2 fs-4"></i>
                    {{ __('View Store') }}<br/>
                    <small class="text-muted fw-normal">{{ __('More from this brand') }}</small>
                </span>
            </a>
        </div>
    @endif
</div>
