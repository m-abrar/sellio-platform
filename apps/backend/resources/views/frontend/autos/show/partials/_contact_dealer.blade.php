@php
    $dealer = $auto->user;
    $dealerName = $dealer->name ?? 'AutoMax Pro';
    $dealerPhone = $dealer->phone ?? '(555) 987-6543';
    $dealerLogo = $dealer->logo_url ?? "https://ui-avatars.com/api/?name=" . urlencode($dealerName) . "&background=E05F2C&color=fff&size=80&font-size=0.45&bold=true";
    $dealerReviews = $dealer?->reviews ?? collect();
    $dealerRating = $dealerReviews->avg('rating') ?: 0;
    $dealerReviewCount = $dealerReviews->count();
@endphp

<div class="card detail-sidebar-card p-4 mt-4">
    <h4 class="fw-800 mb-3">{{ __('Meet the Dealer,') }} {{ $dealerName }}</h4>

    <div class="text-center mb-3 border-bottom pb-3" style="border-color:rgba(15,23,42,.07)!important">
        <img src="{{ $dealerLogo }}"
             class="host-profile-avatar rounded-circle mb-2 shadow-sm"
             alt="{{ __('Dealer: :name', ['name' => $dealerName]) }}"
             width="80" height="80">

        <h5 class="mb-0 fw-semibold text-dark">{{ $dealerName }}</h5>
        <p class="small text-muted mb-2">
            <i class="bi bi-geo-alt-fill me-1" style="color:var(--primary-color)"></i>{{ $auto->city ?? __('Local') }} {{ __('Dealership') }}
        </p>

        @if($dealerReviewCount > 0)
            <div class="d-flex justify-content-center gap-4 mt-1 small fw-semibold">
                <span class="text-muted">
                    <i class="bi bi-star-fill me-1" style="color:var(--primary-color)"></i>
                    {{ number_format($dealerRating, 1) }} ({{ trans_choice(':count review|:count reviews', $dealerReviewCount, ['count' => $dealerReviewCount]) }})
                </span>
            </div>
        @endif
    </div>

    <div class="d-grid gap-2">
        @auth
            <a href="{{ route('conversation.start', $dealer) }}" class="btn btn-primary btn-header-cta">
                <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Send message') }}<i class="bi bi-arrow-right ms-2"></i>
            </a>
        @else
            <a href="{{ route('login') }}" class="btn btn-primary btn-header-cta">
                <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Sign in to message') }}<i class="bi bi-arrow-right ms-2"></i>
            </a>
        @endauth

        <a href="tel:{{ $dealerPhone }}" class="btn btn-outline-secondary fw-semibold">
            <i class="bi bi-telephone-fill me-2"></i>{{ __('Call :phone', ['phone' => $dealerPhone]) }}
        </a>
    </div>

    <div class="text-center small text-muted mt-3">
        <p class="mb-0 fw-semibold text-dark">{{ __('Sales Hours') }}</p>
        <p class="mb-1">{{ $dealer->hours ?? __('Mon-Sat: 9 AM – 6 PM') }}</p>
    </div>

    <p class="text-center small text-muted mt-2 mb-0">{{ __('We protect your personal information.') }}</p>
</div>
