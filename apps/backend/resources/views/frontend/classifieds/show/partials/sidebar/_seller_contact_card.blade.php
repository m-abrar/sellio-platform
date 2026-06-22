@php
    $sellerName    = $seller->name ?? __('Private Seller');
    $sellerAvatar  = $seller->avatar_url
        ?? 'https://ui-avatars.com/api/?name=' . urlencode($sellerName) . '&background=E05F2C&color=fff&size=80&font-size=0.45';
    $avgRating     = $seller->reviews()->avg('rating') ?? 0;
    $reviewCount   = $seller->reviews()->count() ?? 0;
    $listingCount  = (int) ($seller->active_classifieds_count ?? $seller->classifieds()->count() ?? 0);
    $sellerSince   = $seller->created_at?->format('Y') ?? now()->format('Y');
    $sellerBio     = Str::limit($seller->bio ?? '', 140);
@endphp

<div class="card detail-sidebar-card p-4 mb-4">
    <h4 class="fw-800 mb-3">{{ __('Meet the Seller,') }} {{ $sellerName }}</h4>

    <div class="text-center mb-3 border-bottom pb-3" style="border-color:rgba(15,23,42,.07)!important">
        <img src="{{ $sellerAvatar }}"
             class="host-profile-avatar rounded-circle mb-2 shadow-sm"
             alt="{{ $sellerName }}"
             width="80" height="80">

        <h5 class="mb-0 fw-semibold text-dark">{{ $sellerName }}</h5>

        @if($seller?->is_verified)
            <span class="fw-semibold mt-1 d-inline-block rounded-2 px-2 py-1 small" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                <i class="bi bi-patch-check-fill me-1"></i>{{ __('Verified Seller') }}
            </span>
        @else
            <p class="small text-muted mb-0 mt-1">{{ __('Member since :year', ['year' => $sellerSince]) }}</p>
        @endif

        <div class="d-flex justify-content-center gap-4 mt-3 small fw-semibold">
            @if($reviewCount > 0)
                <span class="text-muted">
                    <i class="bi bi-star-fill me-1" style="color:var(--primary-color)"></i>
                    {{ number_format($avgRating, 1) }} ({{ $reviewCount }})
                </span>
            @endif
            @if($listingCount > 0)
                <span class="text-muted">
                    <i class="bi bi-bag me-1" style="color:var(--primary-color)"></i>
                    {{ trans_choice(':count listing|:count listings', $listingCount, ['count' => $listingCount]) }}
                </span>
            @endif
        </div>
    </div>

    @if(filled($sellerBio))
        <div class="mb-4">
            <h6 class="fw-semibold mb-2" style="color:var(--primary-color)">{{ __('About :name', ['name' => $sellerName]) }}</h6>
            <p class="small text-muted mb-0">{{ $sellerBio }}</p>
        </div>
    @endif

    <div class="d-grid">
        <a href="{{ route('partner.profile', $seller) }}" class="btn btn-outline-secondary fw-semibold">
            <i class="bi bi-person-badge me-2"></i>{{ __('View profile') }}
        </a>
    </div>

    <p class="text-center small text-muted mt-3 mb-0">{{ __('We protect your personal information.') }}</p>
</div>
