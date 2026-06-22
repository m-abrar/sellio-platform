<div class="row g-3">
    @forelse ($related_items->take(2) as $item)
        <div class="col-md-4 col-6">
            <a href="{{ route('classifieds.show', $item->slug) }}" class="text-decoration-none text-dark">
                <div class="related-listing-card h-100 rounded-4 overflow-hidden transition-up" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                    <img src="{{ $item->primary_image_url }}" class="w-100 object-fit-cover" alt="{{ $item->title }}" style="height:140px">
                    <div class="p-3">
                        <h6 class="fw-800 small mb-1 text-truncate text-dark">{{ $item->title }}</h6>
                        <p class="fw-800 mb-0 small" style="color:var(--primary-color)">{{ $item->price_formatted }}</p>
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
        <a href="{{ route('partner.profile', $seller) }}" class="related-listing-card h-100 rounded-4 text-center d-flex align-items-center justify-content-center text-decoration-none transition-up" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px dashed rgba(var(--primary-color-rgb),.25);min-height:190px">
            <span class="fw-semibold small p-3" style="color:var(--primary-color)">
                <i class="bi bi-grid-3x3-gap-fill d-block mb-2 fs-4"></i>
                {{ __('View All Listings') }}<br>
                <span class="opacity-75">{{ __('from Seller') }}</span>
            </span>
        </a>
    </div>
    @endif
</div>
