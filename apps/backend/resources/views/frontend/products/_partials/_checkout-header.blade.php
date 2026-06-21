@php
    $firstItem = $cart->items->first();
    $product = $firstItem?->product;
    $showContext = $showContext ?? true;
    $backUrl = $backUrl ?? route('cart.index');
    $backLabel = $backLabel ?? __('Back to cart');
@endphp

<div class="booking-header page-title-section mb-4 mb-lg-5">
    @if($product && $showContext)
        <div class="booking-header__context bg-white border mb-4">
            <div class="booking-header__property">
                <img src="{{ $product->primary_image_url }}"
                     class="booking-header__thumb"
                     alt="{{ $product->title }}">

                <div class="booking-header__property-copy">
                    <span class="metric-label">{{ __('Your Order') }}</span>
                    <h2 class="booking-header__property-title">{{ $product->title }}</h2>
                    <p class="booking-header__property-meta mb-0">
                        {{ trans_choice(':count item in cart|:count items in cart', $cart->items->count(), ['count' => $cart->items->count()]) }}
                    </p>
                </div>
            </div>

            <a href="{{ $backUrl }}" class="booking-header__back">
                <i class="bi bi-arrow-left"></i>
                <span>{{ $backLabel }}</span>
            </a>
        </div>
    @elseif($backUrl)
        <div class="mb-4">
            <a href="{{ $backUrl }}" class="booking-header__back booking-header__back--inline">
                <i class="bi bi-arrow-left"></i>
                <span>{{ $backLabel }}</span>
            </a>
        </div>
    @endif

    <div class="text-center">
        <span class="metric-label mx-auto">{{ __('Commerce') }}</span>
        <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
            {{ __('Secure Checkout') }}<span class="text-primary">: {{ __('Step 2 of 3') }}</span>
        </h1>
        <p class="booking-header__subtitle text-muted mb-0 fs-6 mx-auto">
            {{ __('Review shipping details and complete payment to place your order.') }}
        </p>
    </div>
</div>
