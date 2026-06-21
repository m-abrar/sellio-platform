<div class="card detail-sidebar-card p-4 mb-4">
    <h5 class="fw-semibold mb-3"><i class="bi bi-person-circle me-2 text-primary"></i>{{ __('Seller details') }}</h5>

    <div class="d-flex align-items-center mb-3">
        <img src="{{ $seller->avatar_url ?? asset('images/default-avatar.png') }}"
             alt="{{ $seller->title ?? 'Seller' }} Avatar"
             class="rounded-circle object-fit-cover me-3"
             style="width: 60px; height: 60px;">
        <div>
            <p class="fw-semibold mb-0">{{ $seller->title ?? 'Private Seller' }}</p>
            <p class="text-muted small mb-0">{{ __('Member since') }} {{ $seller->created_at->format('F Y') }}</p>
        </div>
    </div>

    <hr class="mt-0">

    @php
        $avgRating = $seller->reviews()->avg('rating');
        $reviewCount = $seller->reviews()->count();
    @endphp

    @if ($reviewCount > 0)
        <div class="d-flex align-items-center mb-3">
            <span class="text-warning me-2">
                @for ($i = 1; $i <= 5; $i++)
                    <i class="bi bi-star{{ $i <= round($avgRating) ? '-fill' : '' }}"></i>
                @endfor
            </span>
            <span class="small text-muted">({{ $reviewCount }} {{ __('reviews') }})</span>
        </div>
    @else
        <p class="small text-muted mb-3"><i class="bi bi-info-circle me-1"></i> {{ __('No public reviews yet.') }}</p>
    @endif

    <div class="d-grid gap-2">
        <a href="{{ route('conversation.start', $seller) }}" class="btn btn-primary btn-header-cta">
            <i class="bi bi-chat-dots me-2"></i>{{ __('Send message') }}<i class="bi bi-arrow-right ms-2"></i>
        </a>
        <a href="{{ route('partner.profile', $seller) }}" class="btn btn-sm btn-outline-secondary fw-semibold">
            {{ __('View profile') }}
        </a>
    </div>
</div>
