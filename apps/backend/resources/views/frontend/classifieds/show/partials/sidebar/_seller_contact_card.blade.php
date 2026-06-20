<div class="glass-surface border-0 rounded-4 shadow-sm p-4 mb-4">
    <span class="metric-label d-block mb-2">{{ __('Seller') }}</span>
    <h5 class="fw-800 text-dark mb-3">
        <i class="bi bi-person-circle text-primary-color me-2"></i>{{ __('Contact Seller') }}
    </h5>

    <div class="d-flex align-items-center mb-3">
        <img src="{{ $seller->avatar_url ?? asset('images/fallbacks/default-avatar.png') }}"
             alt="{{ $seller->name ?? __('Seller') }}"
             class="rounded-circle me-3 object-fit-cover"
             width="60"
             height="60">
        <div>
            <p class="fw-800 mb-0 text-dark">{{ $seller->name ?? __('Private Seller') }}</p>
            <p class="text-muted small mb-0">{{ __('Member since :date', ['date' => $seller->created_at->format('F Y')]) }}</p>
        </div>
    </div>

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
            <span class="small text-muted">({{ trans_choice('{1} :count review|[2,*] :count reviews', $reviewCount, ['count' => $reviewCount]) }})</span>
        </div>
    @else
        <p class="small text-muted mb-3"><i class="bi bi-info-circle me-1"></i>{{ __('No public reviews yet.') }}</p>
    @endif

    @auth
        <a href="{{ route('conversation.start', $seller) }}" class="btn btn-primary-theme w-100 rounded-pill fw-800 mb-2">
            <i class="bi bi-chat-dots me-2"></i>{{ __('Send Message') }}
        </a>
    @else
        <a href="{{ route('login') }}" class="btn btn-primary-theme w-100 rounded-pill fw-800 mb-2">
            <i class="bi bi-chat-dots me-2"></i>{{ __('Sign in to Message') }}
        </a>
    @endauth

    <a href="{{ route('partner.profile', $seller) }}" class="btn btn-outline-primary-theme w-100 rounded-pill fw-bold">
        {{ __('View Profile') }}
    </a>
</div>
