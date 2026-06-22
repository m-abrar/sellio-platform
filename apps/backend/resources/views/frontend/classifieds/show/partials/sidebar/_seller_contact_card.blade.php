<div class="detail-sidebar-card mb-4 overflow-hidden">
    <div class="card-header border-0 p-4" style="background:var(--primary-color)">
        <h5 class="fw-800 mb-0 text-white"><i class="bi bi-person-circle me-2"></i>{{ __('Contact Seller') }}</h5>
    </div>
    <div class="p-4">
        <div class="d-flex align-items-center mb-3">
            <img src="{{ $seller->avatar_url ?? asset('images/fallbacks/default-avatar.png') }}"
                 alt="{{ $seller->name ?? __('Seller') }}"
                 class="rounded-circle me-3 object-fit-cover border border-2"
                 style="border-color:rgba(var(--primary-color-rgb),.2)!important"
                 width="60"
                 height="60">
            <div>
                <p class="fw-semibold mb-0 text-dark">{{ $seller->name ?? __('Private Seller') }}</p>
                <p class="text-muted small mb-0">{{ __('Member since :date', ['date' => $seller->created_at->format('F Y')]) }}</p>
            </div>
        </div>

        @php
            $avgRating = $seller->reviews()->avg('rating');
            $reviewCount = $seller->reviews()->count();
        @endphp

        @if ($reviewCount > 0)
            <div class="d-flex align-items-center mb-3">
                <span class="me-2" style="color:var(--primary-color)">
                    @for ($i = 1; $i <= 5; $i++)
                        <i class="bi bi-star{{ $i <= round($avgRating) ? '-fill' : '' }}"></i>
                    @endfor
                </span>
                <span class="small text-muted">({{ trans_choice('{1} :count review|[2,*] :count reviews', $reviewCount, ['count' => $reviewCount]) }})</span>
            </div>
        @else
            <p class="small text-muted mb-3"><i class="bi bi-info-circle me-1"></i>{{ __('No public reviews yet.') }}</p>
        @endif

        <div class="d-grid gap-2">
            @auth
                <a href="{{ route('conversation.start', $seller) }}" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-chat-dots me-2"></i>{{ __('Send message') }}<i class="bi bi-arrow-right ms-2"></i>
                </a>
            @else
                <a href="{{ route('login') }}" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-chat-dots me-2"></i>{{ __('Sign in to message') }}<i class="bi bi-arrow-right ms-2"></i>
                </a>
            @endauth

            <a href="{{ route('partner.profile', $seller) }}" class="btn btn-outline-secondary fw-semibold">
                {{ __('View profile') }}
            </a>
        </div>
    </div>
</div>
