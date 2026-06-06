<div class="fixed-bottom d-lg-none py-2 bg-glass-surface-dark border-top z-30" id="sticky-booking-bar">
    <div class="container d-flex justify-content-between align-items-center">
        <div>
            <span class="h5 fw-bold text-white mb-0 d-block">
                @if($event->is_paid)
                    {{ format_currency($event->sale_price ?? $event->base_price) }}
                    <span class="small fw-normal text-muted">{{ __('starting price') }}</span>
                @else
                    {{ __('FREE') }} <span class="small fw-normal text-muted">{{ __('entry') }}</span>
                @endif
            </span>
            <span class="small text-warning fw-semibold">
                <i class="bi bi-ticket-fill me-1"></i>
                {{ $tickets_left > 0 ? $tickets_left . ' ' . __('Tickets Left') : __('Tickets Available') }}
            </span>
        </div>
        <a href="#ticket-sidebar" class="btn btn-primary-theme fw-bold rounded-pill px-4">
            <i class="bi bi-cart-fill me-2"></i>{{ __('Buy Now') }}
        </a>
    </div>
</div>
