@php
    $stripePublishableKey = $stripePublishableKey ?? null;
    $usesStripeElements = filled($stripePublishableKey);
    $taxRate = 0.05;
    $finalTotal = round($booking->total_price * (1 + $taxRate), 2);
@endphp

<form id="payment-form" method="POST" action="{{ route('events.tickets.booking.processPayment', ['event' => $booking->event->slug, 'booking' => $booking->id]) }}" class="booking-payment-form" data-event-payment-form>
    @csrf

    <input type="hidden" name="booking_id" value="{{ $booking->id }}">
    <input type="hidden" name="payment_method" value="stripe">
    <input type="hidden" name="payment_token" value="" data-stripe-payment-token>

    <div class="booking-payment-form__demo mb-4">
        <i class="bi bi-info-circle me-2"></i>
        @if($usesStripeElements)
            {{ __('Stripe secure card entry is enabled for this ticket checkout.') }}
        @else
            {{ __('Stripe must be configured in admin payment settings before event ticket payment can be collected.') }}
        @endif
    </div>

    <div class="form-check border rounded-4 p-3 mb-3 bg-white">
        <input class="form-check-input" type="radio" id="payment_stripe" value="stripe" checked required>
        <label class="form-check-label fw-bold" for="payment_stripe">
            {{ __('Credit Card (Stripe)') }}
        </label>
        <div class="small text-muted mt-1">
            {{ __('Pay securely using Visa, MasterCard, or American Express.') }}
        </div>
    </div>

    <div class="form-check border rounded-4 p-3 mb-4 opacity-75 bg-white">
        <input class="form-check-input" type="radio" id="payment_paypal" value="paypal" disabled>
        <label class="form-check-label fw-bold" for="payment_paypal">
            PayPal <span class="badge bg-light text-muted border ms-1">{{ __('Coming soon') }}</span>
        </label>
    </div>

    <div class="booking-payment-panel__fields border rounded-4 p-4 bg-white">
        @if($usesStripeElements)
            <label for="event-cardholder-name" class="filter-label mb-2">{{ __('Cardholder Name') }}</label>
            <div class="input-group unified-input mb-3">
                <span class="input-group-text"><i class="bi bi-person"></i></span>
                <input
                    id="event-cardholder-name"
                    type="text"
                    class="form-control"
                    value="{{ old('cardholder_name', $booking->user_name) }}"
                    placeholder="{{ __('Name on card') }}"
                    data-event-cardholder-name
                    autocomplete="cc-name"
                >
            </div>

            <label for="event-stripe-card-element" class="filter-label mb-2">{{ __('Card Details') }}</label>
            <div
                id="event-stripe-card-element"
                class="form-control py-3 bg-white"
                data-stripe-card-element
            ></div>
            <div class="invalid-feedback d-block d-none" data-stripe-card-errors role="alert"></div>
        @else
            <p class="text-muted small mb-0">{{ __('Stripe card fields will appear here after the gateway publishable key is configured.') }}</p>
        @endif
    </div>

    <button type="submit" class="btn btn-lg btn-primary-theme w-100 py-3 rounded-pill fw-800 shadow-deep mt-4" data-event-payment-submit @disabled(!$usesStripeElements)>
        <i class="bi bi-lock-fill me-2"></i>{{ __('Complete Order & Pay') }} {{ format_currency($finalTotal) }}
    </button>
</form>

@push('payment_scripts')
@if($usesStripeElements)
<script src="https://js.stripe.com/v3/"></script>
@endif
<script>
    document.addEventListener('DOMContentLoaded', async function () {
        const stripePublishableKey = @json($stripePublishableKey);
        const form = document.querySelector('[data-event-payment-form]');
        const cardElementContainer = document.querySelector('[data-stripe-card-element]');
        const tokenInput = document.querySelector('[data-stripe-payment-token]');
        const cardErrors = document.querySelector('[data-stripe-card-errors]');
        const cardholderName = document.querySelector('[data-event-cardholder-name]');
        const submitButton = document.querySelector('[data-event-payment-submit]');

        if (!stripePublishableKey || !form || !window.Stripe || !cardElementContainer || !tokenInput) {
            return;
        }

        const stripe = window.Stripe(stripePublishableKey);
        const elements = stripe.elements();
        const cardElement = elements.create('card', {
            hidePostalCode: true,
            style: {
                base: {
                    color: '#111827',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#9ca3af',
                    },
                },
                invalid: {
                    color: '#dc3545',
                },
            },
        });

        cardElement.mount(cardElementContainer);
        cardElement.on('change', (event) => {
            if (!cardErrors) return;

            cardErrors.textContent = event.error ? event.error.message : '';
            cardErrors.classList.toggle('d-none', !event.error);
        });

        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            if (submitButton) {
                submitButton.disabled = true;
            }

            if (cardErrors) {
                cardErrors.textContent = '';
                cardErrors.classList.add('d-none');
            }

            const result = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
                billing_details: {
                    name: cardholderName?.value || @json($booking->user_name),
                    email: @json($booking->user_email),
                    phone: @json($booking->user_phone),
                },
            });

            if (result.error) {
                if (cardErrors) {
                    cardErrors.textContent = result.error.message;
                    cardErrors.classList.remove('d-none');
                }

                if (submitButton) {
                    submitButton.disabled = false;
                }

                return;
            }

            tokenInput.value = result.paymentMethod.id;
            form.submit();
        });
    });
</script>
@endpush
