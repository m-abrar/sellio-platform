<div class="listing-card h-100 text-decoration-none text-dark d-flex flex-column transition-all shadow-hover rounded-4 position-relative">
        
        {{-- Link wrapper for the main content --}}
        <a href="{{ route('product.show', $product->slug) }}" class="text-decoration-none text-dark flex-grow-1 d-flex flex-column">
            
            <div class="img-container position-relative overflow-hidden rounded-top-4">
                <div class="listing-card-img aspect-ratio-1-1"> {{-- Products often look better in 1:1 square ratio --}}
                    <img src="{{ $product->primary_image_url }}" 
                         alt="{{ $product->title }}" 
                         class="transition-img w-100 h-100 object-fit-cover">
                </div>
                
                {{-- Status Badges: Featured or Digital logic --}}
                <div class="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1">
                    @if($product->is_featured)
                        <span class="badge bg-danger text-white rounded-2 px-2 py-1 fw-semibold">
                            {{ __('Featured') }}
                        </span>
                    @endif
                    
                    @if($product->is_digital)
                        <span class="badge bg-info text-white rounded-2 px-2 py-1 fw-semibold">
                            <i class="bi bi-download me-1"></i>{{ __('Digital') }}
                        </span>
                    @endif
                </div>

                {{-- Price Overlay: Handles sale_price and on_sale flags --}}
                <div class="position-absolute bottom-0 start-0 m-2">
                    <div class="price-overlay bg-dark bg-opacity-75 backdrop-blur text-white rounded-pill border border-white border-opacity-25 px-3 py-1 shadow-sm">
                        <span class="fw-800">
                            @if($product->on_sale && $product->sale_price > 0)
                                <span class="text-warning">${{ number_format($product->sale_price, 2) }}</span>
                                <small class="text-white text-decoration-line-through opacity-50 ms-1 fs-xs">
                                    ${{ number_format($product->base_price, 2) }}
                                </small>
                            @else
                                ${{ number_format($product->base_price, 2) }}
                            @endif
                        </span>
                    </div>
                </div>
            </div>

            <div class="card-body p-3 d-flex flex-column flex-grow-1">
                <div class="mb-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <span class="text-primary small fw-bold text-uppercase ls-sm">
                            {{ $product->category->title ?? __('Uncategorized') }}
                        </span>
                        @if($product->brand)
                             <span class="text-muted small">{{ $product->brand->title }}</span>
                        @endif
                    </div>
                    <h6 class="property-title fw-800 mb-1 text-dark text-truncate mt-1">
                        {{ $product->title }}
                    </h6>
                    @if($product->short_description)
                        <p class="small text-muted text-truncate mb-0">{{ $product->short_description }}</p>
                    @endif
                </div>

                {{-- Stock Status Logic --}}
                <div class="stock-status mt-auto">
                    @if($product->stock_quantity > 0 || !$product->manage_stock)
                        <span class="small text-success"><i class="bi bi-check-circle-fill me-1"></i>{{ __('In Stock') }}</span>
                    @else
                        <span class="small text-danger"><i class="bi bi-x-circle-fill me-1"></i>{{ __('Out of Stock') }}</span>
                    @endif
                </div>
            </div>
            </a> {{-- End of main link --}}
            

                
                {{-- Quick Add or View Options Logic --}}
                <div class="d-flex justify-content-between align-items-center pt-3 border-top mt-3 p-3 pt-0">
                    <span class="small text-muted">
                        <i class="bi bi-hash me-1"></i>{{ $product->sku ?? __('No SKU') }}
                    </span>
                    
                    @if($product->attributes_count > 0 || $product->addons_count > 0)
                        {{-- If product has options, don't allow direct add --}}
                        <a href="{{ route('product.show', $product->slug) }}" class="btn btn-outline-primary btn-sm rounded-2 fw-semibold fs-xs">
                            <i class="bi bi-eye me-1"></i>{{ __('Options') }}
                        </a>
                    @else
                        <form action="{{ route('cart.add', $product->id) }}" method="POST">
                            @csrf
                            <input type="hidden" name="quantity" value="1">
                            <button type="submit" class="btn btn-primary-light btn-sm rounded-2 fw-semibold fs-xs"
                                    {{ ($product->manage_stock && $product->stock_quantity <= 0) ? 'disabled' : '' }}>
                                <i class="bi bi-cart-plus me-1"></i>{{ __('Add') }}
                            </button>
                        </form>
                    @endif
                </div>
</div>
