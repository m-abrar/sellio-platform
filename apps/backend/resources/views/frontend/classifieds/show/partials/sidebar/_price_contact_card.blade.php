<div class="card detail-sidebar-card mb-4 overflow-hidden" id="classified-contact-widget">
    <div class="card-header border-0 p-4" style="background:var(--primary-color)">
        <h4 class="fw-800 mb-1 text-white">
            <i class="bi bi-tag-fill me-2"></i>{{ $classified->price_formatted }}
        </h4>
        <p class="small mb-0" style="color:rgba(255,255,255,.7)">{{ __('Contact the seller to arrange a viewing or make an offer.') }}</p>
    </div>

    <div class="card-body p-4">
        @if($classified->is_for_rent)
            <p class="small text-muted mb-4">
                <i class="bi bi-house-door me-1" style="color:var(--primary-color)"></i>{{ __('Listed for rent — ask seller about deposit and terms.') }}
            </p>
        @endif

        <div class="booking-widget-trust mb-4">
            <span><i class="bi bi-shield-check" style="color:var(--primary-color)"></i>{{ __('Secure messaging') }}</span>
            <span><i class="bi bi-eye-slash" style="color:var(--primary-color)"></i>{{ __('Info protected') }}</span>
            <span><i class="bi bi-geo-alt" style="color:var(--primary-color)"></i>{{ __('Local pickup') }}</span>
            <span><i class="bi bi-person-check" style="color:var(--primary-color)"></i>{{ __('Verified seller') }}</span>
        </div>

        <div class="d-grid gap-2">
            @auth
                <a href="{{ route('conversation.start', $classified->user) }}" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Send Message') }}<i class="bi bi-arrow-right ms-2"></i>
                </a>
            @else
                <a href="{{ route('login') }}" class="btn btn-primary btn-header-cta">
                    <i class="bi bi-chat-dots-fill me-2"></i>{{ __('Sign in to message') }}<i class="bi bi-arrow-right ms-2"></i>
                </a>
            @endauth
        </div>

        <p class="text-center small text-muted mt-3 mb-0">{{ __('You will not be charged for messaging.') }}</p>
    </div>
</div>
