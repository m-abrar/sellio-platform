@extends('frontend._layouts._app')

@php
    $checkoutGateways   ??= [];
    $stripeKey           = collect($checkoutGateways)->firstWhere('slug', 'stripe')['config']['publishable_key'] ?? null;
    $usesStripeElements  = filled($stripeKey);
    $firstGatewaySlug    = $checkoutGateways[0]['slug'] ?? 'stripe';
    $canSubmit           = $usesStripeElements || collect($checkoutGateways)->firstWhere('slug', 'manual');
    $total               = $cart->calculateTotal();
    $totalFormatted      = format_currency($total);
    $firstItem           = $cart->items->first();
@endphp

@section('title', __('Checkout') . ' | ' . __('Step 2 of 3'))
@section('body_class', 'has-body-glow frontend-page--checkout')

@section('content')
<x-frontend.page-shell variant="checkout">
    @include('frontend.products._partials._checkout-header', [
        'cart' => $cart,
        'showContext' => false,
    ])
    @include('frontend.products._partials._checkout-stepper', ['step' => 2])

    <form method="POST"
          action="{{ route('checkout.process', $firstGatewaySlug) }}"
          enctype="multipart/form-data"
          class="booking-payment-form"
          data-checkout-payment-form
          data-product-checkout-form
          novalidate>
        @csrf

        <div class="row g-4 booking-layout">
            <div class="col-lg-7 booking-layout__main">
                <div class="bg-white border rounded-4 p-4 p-md-5 mb-4">
                    <h4 class="fw-800 tracking-tight mb-4 text-dark">
                        <i class="bi bi-truck me-2" style="color:var(--primary-color)"></i>{{ __('Shipping Details') }}
                    </h4>

                    <div class="row g-3 g-md-4">
                        <div class="col-12">
                            <label for="shipping_name" class="filter-label mb-2">{{ __('Full Name') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-person"></i></span>
                                <input type="text" id="shipping_name" name="shipping_name" value="{{ old('shipping_name', auth()->user()->name) }}" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-12">
                            <label for="shipping_address" class="filter-label mb-2">{{ __('Address') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                                <input type="text" id="shipping_address" name="shipping_address" value="{{ old('shipping_address') }}" class="form-control" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <label for="shipping_city" class="filter-label mb-2">{{ __('City') }}</label>
                            <input type="text" id="shipping_city" name="shipping_city" value="{{ old('shipping_city') }}" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label for="shipping_state" class="filter-label mb-2">{{ __('State') }}</label>
                            <input type="text" id="shipping_state" name="shipping_state" value="{{ old('shipping_state') }}" class="form-control">
                        </div>
                        <div class="col-md-6">
                            <label for="shipping_zip" class="filter-label mb-2">{{ __('ZIP') }}</label>
                            <input type="text" id="shipping_zip" name="shipping_zip" value="{{ old('shipping_zip') }}" class="form-control" required>
                        </div>
                        <div class="col-md-6">
                            <label for="shipping_country" class="filter-label mb-2">{{ __('Country') }}</label>
                            <input type="text" id="shipping_country" name="shipping_country" value="{{ old('shipping_country', 'United States') }}" class="form-control" required>
                        </div>
                    </div>
                </div>

                @include('frontend._partials._gateway_selector', [
                    'checkoutGateways'    => $checkoutGateways,
                    'totalFormatted'      => $totalFormatted,
                    'cardholderName'      => old('shipping_name', auth()->user()->name),
                    'submitLabel'         => __('Complete Payment'),
                    'formActionBase'      => route('checkout.process', '__SLUG__'),
                ])
            </div>

            <div class="col-lg-5 booking-layout__aside">
                <aside class="sticky-sidebar">
                    <div class="bg-white border rounded-4 p-4 p-md-5 position-relative overflow-hidden">
                        <div class="price-glow-effect"></div>

                        <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Order Summary') }}</h4>

                        @if($firstItem)
                            <div class="d-flex align-items-center mb-4 border-bottom border-color-light pb-4">
                                <img src="{{ $firstItem->product->primary_image_url }}" class="booking-summary-thumb rounded-4 me-3 shadow-sm" alt="{{ $firstItem->product->title }}">
                                <div class="overflow-hidden">
                                    <span class="metric-label">{{ __('Primary Item') }}</span>
                                    <h6 class="fw-800 mb-0 text-truncate text-dark">{{ $firstItem->product->title }}</h6>
                                    <p class="small text-muted mb-0">{{ __('Qty') }} {{ $firstItem->quantity }}</p>
                                </div>
                            </div>
                        @endif

                        <div class="pricing-list mb-4">
                            @foreach($cart->items as $item)
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-muted small fw-600 text-truncate pe-3">{{ $item->product->title }} (×{{ $item->quantity }})</span>
                                    <span class="fw-800 text-dark small">{{ format_currency($item->total_price) }}</span>
                                </div>
                            @endforeach

                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Shipping') }}</span>
                                <span class="fw-800 text-dark small">{{ __('Free') }}</span>
                            </div>
                        </div>

                        <hr class="my-4 border-color-light">

                        <div class="p-4 rounded-4 text-center mb-4" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.08)">
                            <p class="filter-label mb-1">{{ __('Total Amount Due') }}</p>
                            <h2 class="price-text-large mb-0 line-height-1" style="color:var(--primary-color)">{{ $totalFormatted }}</h2>
                            <span class="fw-semibold px-3 py-2 mt-3 d-inline-block rounded-2 small" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                                <i class="bi bi-shield-check me-1"></i>{{ __('Secure checkout') }}
                            </span>
                        </div>

                        <a href="{{ route('cart.index') }}" class="btn btn-outline-secondary w-100 fw-semibold">
                            <i class="bi bi-arrow-left me-1"></i>{{ __('Back to Cart') }}
                        </a>
                    </div>
                </aside>
            </div>
        </div>

        <div class="booking-mobile-summary d-lg-none">
            <div>
                <span class="booking-mobile-summary__label">{{ __('Total Due') }}</span>
                <strong>{{ $totalFormatted }}</strong>
            </div>
            <button type="submit" class="btn btn-primary px-4" data-checkout-payment-submit @disabled(!$canSubmit)>
                {{ __('Pay') }} <i class="bi bi-arrow-right-short ms-1"></i>
            </button>
        </div>
    </form>
</x-frontend.page-shell>
@endsection

@include('frontend._partials._checkout_payment_scripts', [
    'stripePublishableKey' => $stripeKey,
    'formSelector'         => '[data-checkout-payment-form]',
    'cardholderFallback'   => auth()->user()->name ?? '',
    'submitLabelText'      => __('Complete Payment'),
])
