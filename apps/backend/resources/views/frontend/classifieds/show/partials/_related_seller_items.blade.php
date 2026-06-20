<div class="row g-3">
    @forelse ($related_items->take(2) as $item)
        <div class="col-md-4 col-6">
            <a href="{{ route('classifieds.show', $item->slug) }}" class="text-decoration-none text-dark">
                <div class="card glass-surface related-listing-card h-100 transition-up shadow-sm border-0">
                    {{-- Using the primary_image_url accessor we discussed --}}
                    <img src="{{ $item->primary_image_url }}" class="card-img-top related-img object-fit-cover" alt="{{ $item->title }}" style="height: 140px;">
                    
                    <div class="card-body p-3">
                        <h6 class="card-title fw-bold small mb-1 text-truncate">{{ $item->title }}</h6>
                        
                        {{-- Using localized and formatted price from Model --}}
                        <p class="card-text fw-bold text-success mb-0 small">
                            {{ $item->price_formatted }}
                        </p>
                        
                        <div class="text-muted extra-small mt-1">
                            <i class="bi bi-geo-alt me-1"></i>{{ $item->location?->title ?? $item->city ?? __('Local') }}
                        </div>
                    </div>
                </div>
            </a>
        </div>
    @empty
        <div class="col-12 text-center py-4">
            <p class="text-muted small italic">{{ __('This seller has no other active listings.') }}</p>
        </div>
    @endforelse

    {{-- View All Link --}}
    @if ($related_items->count() > 2)
    <div class="col-md-4 col-6">
        <a href="{{ route('partner.profile', $seller) }}" class="card glass-surface related-listing-card h-100 text-center d-flex align-items-center justify-content-center text-decoration-none border-dashed">
            <span class="text-primary fw-semibold small p-3">
                <i class="bi bi-grid-3x3-gap-fill d-block mb-1 fs-5"></i>
                {{ __('View All Listings') }}<br/>
                <span class="opacity-75">{{ __('from Seller') }}</span>
            </span>
        </a>
    </div>
    @endif
</div>
