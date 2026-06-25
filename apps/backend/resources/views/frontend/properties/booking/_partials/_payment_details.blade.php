@php
    $totalFormatted    = format_currency($booking->total_price);
    $checkoutGateways ??= [];
    $stripeKey = collect($checkoutGateways)->firstWhere('slug', 'stripe')['config']['publishable_key'] ?? null;
@endphp

<form
    action="{{ route('property.booking.processPayment', $booking) }}"
    method="POST"
    enctype="multipart/form-data"
    class="booking-payment-form"
    data-property-payment-form
    novalidate
>
    @csrf

    @include('frontend._partials._gateway_selector', [
        'checkoutGateways'    => $checkoutGateways,
        'totalFormatted'      => $totalFormatted,
        'cardholderName'      => old('name_on_card', $booking->full_name),
        'cardholderFieldName' => 'name_on_card',
        'submitLabel'         => __('Complete Payment'),
        'showTerms'           => true,
        'scriptsStack'        => 'scripts',
    ])
</form>

@push('scripts')
@if(filled($stripeKey))
<script src="https://js.stripe.com/v3/"></script>
@endif
<script>
(() => {
    const form = document.querySelector('[data-property-payment-form]');
    if (!form) return;

    const stripeKey            = @json($stripeKey);
    const tokenInput           = form.querySelector('[data-stripe-payment-token]');
    const cardElementContainer = form.querySelector('[data-stripe-card-element]');
    const cardErrors           = form.querySelector('[data-stripe-card-errors]');
    const submitButton         = form.querySelector('.booking-payment-form__submit');
    const submitLabel          = form.querySelector('[data-payment-submit-label]');
    const nameInput            = form.querySelector('[data-payment-input="name"]');

    const preview = {
        name: document.querySelector('[data-payment-preview="name"]'),
    };

    let stripe = null, cardElement = null;

    if (stripeKey && window.Stripe && cardElementContainer) {
        stripe = window.Stripe(stripeKey);
        const elements = stripe.elements();
        cardElement = elements.create('card', {
            hidePostalCode: true,
            style: {
                base: {
                    color: '#111827',
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                    fontSize: '16px',
                    '::placeholder': { color: '#9ca3af' },
                },
                invalid: { color: '#dc3545' },
            },
        });
        cardElement.mount(cardElementContainer);
        cardElement.on('change', (event) => {
            if (!cardErrors) return;
            cardErrors.textContent = event.error ? event.error.message : '';
            cardErrors.classList.toggle('d-none', !event.error);
        });
    }

    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (preview.name) {
                const val = nameInput.value.trim();
                preview.name.textContent = val !== '' ? val.toUpperCase() : @json(__('YOUR NAME'));
            }
        });
    }

    const setSubmitting = (isSubmitting) => {
        if (!submitButton) return;
        submitButton.disabled = isSubmitting;
        submitButton.classList.toggle('is-loading', isSubmitting);
        if (submitLabel) {
            submitLabel.textContent = isSubmitting
                ? @json(__('Processing payment...'))
                : @json(__('Complete Payment'));
        }
    };

    form.addEventListener('submit', async (event) => {
        const paymentMethod = form.querySelector('[data-gateway-method]')?.value ?? 'stripe';
        if (paymentMethod !== 'stripe') return;

        if (!stripe || !cardElement || !tokenInput) {
            setSubmitting(true);
            return;
        }

        event.preventDefault();
        setSubmitting(true);

        if (cardErrors) {
            cardErrors.textContent = '';
            cardErrors.classList.add('d-none');
        }

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: nameInput?.value?.trim() || @json($booking->full_name),
                email: @json($booking->email),
                phone: @json($booking->phone ?? ''),
            },
        });

        if (result.error) {
            if (cardErrors) {
                cardErrors.textContent = result.error.message;
                cardErrors.classList.remove('d-none');
            }
            setSubmitting(false);
            return;
        }

        tokenInput.value = result.paymentMethod.id;
        form.submit();
    });
})();
</script>
@endpush
