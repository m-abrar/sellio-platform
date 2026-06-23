<div class="card detail-sidebar-card mb-4 overflow-hidden" id="classified-contact-widget">

    {{-- Section-warm hero: matches property booking widget pattern --}}
    <div class="p-4" style="background:#F4F0EC;border-bottom:1.5px solid rgba(15,23,42,.07)">
        <p class="small fw-semibold text-uppercase mb-1" style="letter-spacing:.06em;color:var(--primary-color)">
            {{ $classified->is_for_rent ? __('Monthly Rent') : __('Asking Price') }}
        </p>
        <h3 class="fw-800 text-dark mb-0" style="font-family:var(--font-heading);font-size:1.9rem;letter-spacing:-.03em">
            {{ $classified->price_formatted }}
        </h3>
        @if($classified->is_for_rent)
            <p class="small text-muted mt-2 mb-0">{{ __('Ask seller about deposit and terms.') }}</p>
        @endif
    </div>

    <div class="p-4">
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
