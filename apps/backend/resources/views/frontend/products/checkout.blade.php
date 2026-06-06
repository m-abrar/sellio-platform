@extends('frontend._layouts._app')

@php
    $usesStripeElements = filled($stripePublishableKey ?? null);
    $total = $cart->calculateTotal();
@endphp

@section('title', __('Checkout'))
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
    <div class="page-title-section mb-4 mb-lg-5">
        <span class="metric-label">{{ __('Commerce') }}</span>
        <h1 class="fw-800 mb-0 tracking-tight text-dark display-6">{{ __('Checkout') }}</h1>
    </div>

    <div class="row g-4">
        <div class="col-lg-7">
            <form method="POST" action="{{ route('checkout.process', 'stripe') }}" class="glass-surface rounded-4 border-0 p-4" data-product-checkout-form>
                @csrf
                <input type="hidden" name="payment_method" value="stripe">
                <input type="hidden" name="payment_token" value="" data-stripe-payment-token>

                <h5 class="fw-bold mb-3">{{ __('Shipping Details') }}</h5>

                <div class="row g-3">
                    <div class="col-12">
                        <label class="form-label">{{ __('Full Name') }}</label>
                        <input type="text" name="shipping_name" value="{{ old('shipping_name', auth()->user()->name) }}" class="form-control" required>
                    </div>
                    <div class="col-12">
                        <label class="form-label">{{ __('Address') }}</label>
                        <input type="text" name="shipping_address" value="{{ old('shipping_address') }}" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">{{ __('City') }}</label>
                        <input type="text" name="shipping_city" value="{{ old('shipping_city') }}" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">{{ __('State') }}</label>
                        <input type="text" name="shipping_state" value="{{ old('shipping_state') }}" class="form-control">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">{{ __('ZIP') }}</label>
                        <input type="text" name="shipping_zip" value="{{ old('shipping_zip') }}" class="form-control" required>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">{{ __('Country') }}</label>
                        <input type="text" name="shipping_country" value="{{ old('shipping_country', 'United States') }}" class="form-control" required>
                    </div>
                </div>

                <hr class="my-4">

                <h5 class="fw-bold mb-3">{{ __('Payment') }}</h5>
                <div class="border rounded-3 p-3 mb-3">
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

                <button type="submit" class="btn btn-primary-theme w-100 rounded-pill py-3 fw-800" data-product-payment-submit @disabled(!$usesStripeElements)>
                    {{ __('Pay') }} ${{ number_format($total, 2) }}
                </button>
            </form>
        </div>

        <div class="col-lg-5">
            <div class="glass-surface rounded-4 border-0 p-4 sticky-top" style="top:calc(var(--frontend-header-offset) + 1rem)">
                <h5 class="fw-bold mb-3">{{ __('Order Summary') }}</h5>

                @foreach($cart->items as $item)
                    <div class="d-flex align-items-center gap-3 py-3 border-bottom">
                        <img src="{{ $item->product->primary_image_url }}" width="56" height="56" class="rounded-3" alt="" style="object-fit:cover">
                        <div class="flex-grow-1 min-w-0">
                            <div class="fw-bold text-truncate">{{ $item->product->title }}</div>
                            <div class="small text-muted">{{ __('Qty') }} {{ $item->quantity }}</div>
                        </div>
                        <div class="fw-bold">${{ number_format($item->total_price, 2) }}</div>
                    </div>
                @endforeach

                <div class="d-flex justify-content-between align-items-center pt-3">
                    <span class="text-muted">{{ __('Subtotal') }}</span>
                    <span class="fw-bold">${{ number_format($total, 2) }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mt-2">
                    <span class="text-muted">{{ __('Shipping') }}</span>
                    <span class="fw-bold">{{ __('Calculated as free for now') }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold">{{ __('Total') }}</span>
                    <span class="fw-800 fs-4">${{ number_format($total, 2) }}</span>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
