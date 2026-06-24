@php
    $firstItem  = $cart->items->first();
    $product    = $firstItem?->product;
    $showContext = $showContext ?? true;
    $backUrl    = $backUrl ?? route('cart.index');
    $backLabel  = $backLabel ?? __('Back to cart');
@endphp

{{-- ── Step 2 dark hero strip ──────────────────────────────────────── --}}
<div class="booking-header mb-4 mb-lg-5">
    <div class="booking-hero">
        <div class="booking-hero__inner">

            <a href="{{ $backUrl }}" class="booking-hero__nav-link mb-3">
                <i class="bi bi-arrow-left-short fs-5"></i>{{ $backLabel }}
            </a>

            <div class="{{ ($product && $showContext) ? 'd-flex align-items-center gap-4 flex-wrap' : 'text-center' }}">

                @if($product && $showContext)
                    <img src="{{ $product->primary_image_url }}"
                         class="booking-hero__preview-img"
                         alt="{{ $product->title }}">
                @endif

                <div>
                    <p class="small fw-semibold text-uppercase mb-2"
                       style="letter-spacing:.08em;color:var(--primary-color)">
                        <i class="bi bi-bag-check me-1"></i>{{ __('Secure Checkout') }}
                    </p>
                    <h1 class="fw-800 tracking-tight mb-1"
                        style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.5rem);color:#fff;letter-spacing:-0.03em">
                        {{ __('Checkout') }}<span style="color:rgba(224,95,44,.8)"> &middot; {{ __('Step 2 of 3') }}</span>
                    </h1>
                    <p class="booking-hero__subtitle {{ (!$product || !$showContext) ? 'mx-auto' : '' }} mb-0">
                        {{ __('Review shipping details and complete payment to place your order.') }}
                    </p>
                </div>
            </div>

        </div>
    </div>
</div>
