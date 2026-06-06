@extends('frontend._layouts._app')

@php
    $usesStripeElements = filled($stripePublishableKey ?? null);
    $total = $cart->calculateTotal();
@endphp

@section('title', __('Checkout') . ' | ' . __('Step 2 of 3'))
@section('body_class', 'has-body-glow frontend-page--checkout')

@if($usesStripeElements)
    @push('scripts')
        <script src="https://js.stripe.com/v3/"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const form = document.querySelector('[data-product-checkout-form]');
                const tokenInput = document.querySelector('[data-stripe-payment-token]');
                const cardElementContainer = document.querySelector('[data-stripe-card-element]');
                const errorContainer = document.querySelector('[data-stripe-card-errors]');
                const submitButton = document.querySelector('[data-product-payment-submit]');
                const stripe = window.Stripe(@json($stripePublishableKey));
                const elements = stripe.elements();
                const card = elements.create('card', {
                    hidePostalCode: true,
                    style: {
                        base: {
                            color: '#111827',
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '16px'
                        }
                    }
                });

                card.mount(cardElementContainer);

                card.on('change', function (event) {
                    errorContainer.textContent = event.error ? event.error.message : '';
                });

                form.addEventListener('submit', async function (event) {
                    event.preventDefault();
                    submitButton.disabled = true;
                    errorContainer.textContent = '';

                    const { paymentMethod, error } = await stripe.createPaymentMethod({
                        type: 'card',
                        card: card,
                        billing_details: {
                            name: form.querySelector('[name="shipping_name"]').value || undefined
                        }
                    });

                    if (error) {
                        errorContainer.textContent = error.message || @json(__('Unable to verify card details.'));
                        submitButton.disabled = false;
                        return;
                    }

                    tokenInput.value = paymentMethod.id;
                    form.submit();
                });
            });
        </script>
    @endpush
@endif

@section('content')
<x-frontend.page-shell variant="checkout">
    <div class="booking-header page-title-section mb-4 mb-lg-5">
        <div class="text-center">
            <span class="metric-label mx-auto">{{ __('Commerce') }}</span>
            <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
                {{ __('Secure Checkout') }}<span class="text-primary-color">: {{ __('Step 2 of 3') }}</span>
            </h1>
            <p class="booking-header__subtitle text-muted mb-0 fs-6 mx-auto">
                {{ __('Enter shipping details and complete payment to place your order.') }}
            </p>
        </div>
    </div>

    @include('frontend.products._partials._checkout-stepper', ['step' => 2])

    <div class="row g-4 booking-layout">
        <div class="col-lg-7 booking-layout__main">
            <form method="POST" action="{{ route('checkout.process', 'stripe') }}" class="glass-surface rounded-4 border-0 p-4 p-md-5" data-product-checkout-form>
                @csrf
                <input type="hidden" name="payment_method" value="stripe">
                <input type="hidden" name="payment_token" value="" data-stripe-payment-token>

                <h4 class="fw-800 tracking-tight mb-4 text-dark">
                    <i class="bi bi-truck text-primary-color me-2"></i>{{ __('Shipping Details') }}
                </h4>

                <div class="row g-3 g-md-4">
                    <div class="col-12">
                        <label class="filter-label mb-2">{{ __('Full Name') }}</label>
                        <div class="input-group unified-input">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input type="text" name="shipping_name" value="{{ old('shipping_name', auth()->user()->name) }}" class="form-control" required>
                        </div>
                    </div>
                    <div class="col-12">
                        <label class="filter-label mb-2">{{ __('Address') }}</label>
                        <div class="input-group unified-input">
                            <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                            <input type="text" name="shipping_address" value="{{ old('shipping_address') }}" class="form-control" required>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="filter-label mb-2">{{ __('City') }}</label>
                        <input type="text" name="shipping_city" value="{{ old('shipping_city') }}" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="filter-label mb-2">{{ __('State') }}</label>
                        <input type="text" name="shipping_state" value="{{ old('shipping_state') }}" class="form-control">
                    </div>
                    <div class="col-md-6">
                        <label class="filter-label mb-2">{{ __('ZIP') }}</label>
                        <input type="text" name="shipping_zip" value="{{ old('shipping_zip') }}" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="filter-label mb-2">{{ __('Country') }}</label>
                        <input type="text" name="shipping_country" value="{{ old('shipping_country', 'United States') }}" class="form-control" required>
                    </div>
                </div>

                <hr class="my-4 border-color-light">

                <h4 class="fw-800 tracking-tight mb-4 text-dark">
                    <i class="bi bi-credit-card-2-front text-primary-color me-2"></i>{{ __('Payment') }}
                </h4>

                <div class="booking-payment-form__demo mb-4">
                    <i class="bi bi-info-circle me-2"></i>
                    @if($usesStripeElements)
                        {{ __('Stripe secure card entry is enabled for this order checkout.') }}
                    @else
                        {{ __('Stripe must be configured in admin payment settings before product checkout can collect payment.') }}
                    @endif
                </div>

                <div class="border rounded-4 p-4 mb-3 bg-white">
                    <div class="d-flex align-items-center justify-content-between gap-3 mb-3">
                        <div>
                            <div class="fw-bold">{{ __('Credit Card') }}</div>
                            <div class="small text-muted">{{ __('Processed securely by Stripe.') }}</div>
                        </div>
                        <span class="badge bg-primary">{{ __('Stripe') }}</span>
                    </div>

                    @if($usesStripeElements)
                        <div class="form-control py-3" data-stripe-card-element></div>
                        <div class="text-danger small mt-2" data-stripe-card-errors role="alert"></div>
                    @else
                        <div class="alert alert-warning mb-0">{{ __('Stripe must be configured in admin payment settings before product checkout can collect payment.') }}</div>
                    @endif
                </div>

                <button type="submit" class="btn btn-primary-theme w-100 rounded-pill py-3 fw-800 shadow-deep" data-product-payment-submit @disabled(!$usesStripeElements)>
                    <i class="bi bi-lock-fill me-2"></i>{{ __('Pay') }} {{ format_currency($total) }}
                </button>
            </form>
        </div>

        <div class="col-lg-5 booking-layout__aside">
            <aside class="sticky-sidebar">
                <div class="glass-surface rounded-4 border-0 p-4 p-md-5 shadow-deep position-relative overflow-hidden">
                    <div class="price-glow-effect"></div>

                    <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Order Summary') }}</h4>

                    @foreach($cart->items as $item)
                        <div class="d-flex align-items-center gap-3 py-3 @if(!$loop->last) border-bottom border-color-light @endif">
                            <img src="{{ $item->product->primary_image_url }}" width="56" height="56" class="rounded-3" alt="" style="object-fit:cover">
                            <div class="flex-grow-1 min-w-0">
                                <div class="fw-bold text-truncate">{{ $item->product->title }}</div>
                                <div class="small text-muted">{{ __('Qty') }} {{ $item->quantity }}</div>
                            </div>
                            <div class="fw-bold">{{ format_currency($item->total_price) }}</div>
                        </div>
                    @endforeach

                    <div class="pricing-list mt-4 mb-4">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Subtotal') }}</span>
                            <span class="fw-800 text-dark small">{{ format_currency($total) }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Shipping') }}</span>
                            <span class="fw-800 text-dark small">{{ __('Free') }}</span>
                        </div>
                    </div>

                    <div class="bg-white bg-opacity-50 p-4 rounded-4 text-center border border-primary-light backdrop-blur">
                        <p class="filter-label mb-1">{{ __('Total') }}</p>
                        <h2 class="price-text-large mb-0 line-height-1 text-primary-color">{{ format_currency($total) }}</h2>
                    </div>

                    <a href="{{ route('cart.index') }}" class="btn btn-outline-primary-theme w-100 rounded-pill mt-4 fw-bold">
                        <i class="bi bi-arrow-left me-1"></i>{{ __('Back to Cart') }}
                    </a>
                </div>
            </aside>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
