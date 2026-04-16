<div class="fixed-bottom d-lg-none py-2 bg-glass-surface-dark border-top z-30" id="sticky-booking-bar">
    <div class="container d-flex justify-content-between align-items-center">
        <div>
            <span class="h5 fw-bold text-white mb-0 d-block">
                @if($event->is_paid)
                    ${{ number_format($event->sale_price ?? $event->base_price, 0) }} 
                    <span class="small fw-normal text-muted"> starting price</span>
                @else
                    FREE <span class="small fw-normal text-muted"> entry</span>
                @endif
            </span>
            <span class="small text-warning fw-semibold"><i class="bi bi-ticket-fill me-1"></i>
                {{ $tickets_left > 0 ? $tickets_left . ' Tickets Left' : 'Tickets Available' }}
            </span>
        </div>
        {{-- Button links to the anchor of the main ticket sidebar --}}
        <a href="#ticket-sidebar" class="btn btn-primary-theme fw-bold text-white"><i class="bi bi-cart-fill me-2"></i>Buy Now</a>
    </div>
</div>
