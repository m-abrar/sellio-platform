@php
    $totalFormatted = format_currency($booking->total_price);
    $stripePublishableKey = $stripePublishableKey ?? null;
    $usesStripeElements = filled($stripePublishableKey);
@endphp

<section class="booking-payment-panel bg-white border">
    <div class="booking-payment-panel__header">
        <div class="booking-payment-panel__secure">
            <span class="booking-payment-panel__secure-icon" aria-hidden="true">
                <i class="bi bi-shield-lock-fill"></i>
            </span>
            <div>
                <p class="booking-payment-panel__eyebrow mb-0">{{ __('Secure checkout') }}</p>
                <h4 class="booking-payment-panel__title mb-0">{{ __('Payment Details') }}</h4>
            </div>
        </div>
        <div class="booking-payment-panel__brands" aria-hidden="true">
            <span class="booking-payment-brand booking-payment-brand--visa">VISA</span>
            <span class="booking-payment-brand booking-payment-brand--mc">MC</span>
            <span class="booking-payment-brand booking-payment-brand--amex">AMEX</span>
        </div>
    </div>

    <div class="booking-payment-card-preview" aria-hidden="true">
        <div class="booking-payment-card-preview__chip"></div>
        <p class="booking-payment-card-preview__number" data-payment-preview="number">•••• •••• •••• ••••</p>
        <div class="booking-payment-card-preview__footer">
            <div>
                <span class="booking-payment-card-preview__label">{{ __('Cardholder') }}</span>
                <p class="booking-payment-card-preview__value mb-0" data-payment-preview="name">{{ __('YOUR NAME') }}</p>
            </div>
            <div class="text-end">
                <span class="booking-payment-card-preview__label">{{ __('Expires') }}</span>
                <p class="booking-payment-card-preview__value mb-0" data-payment-preview="expiry">MM/YY</p>
            </div>
        </div>
    </div>

    <form
        action="{{ route('property.booking.processPayment', $booking) }}"
        method="POST"
        class="booking-payment-form"
        data-property-payment-form
        novalidate
    >
        @csrf
        <input type="hidden" name="payment_method" value="stripe">
        <input type="hidden" name="payment_token" value="" data-stripe-payment-token>

        <div class="booking-payment-form__demo">
            <i class="bi bi-info-circle me-2"></i>
            @if($usesStripeElements)
                {{ __('Stripe secure card entry is enabled for this booking checkout.') }}
            @else
                {{ __('Stripe sandbox mode: use card') }} <code>4242 4242 4242 4242</code>, {{ __('any future expiry, and any 3-digit CVC.') }}
            @endif
        </div>

        <div class="row g-3 g-md-4">
            @if($usesStripeElements)
                <div class="col-12">
                    <label for="name_on_card" class="filter-label mb-2">{{ __('Cardholder Name') }}</label>
                    <div class="input-group unified-input @error('name_on_card') is-invalid @enderror">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input
                            type="text"
                            id="name_on_card"
                            name="name_on_card"
                            class="form-control text-uppercase @error('name_on_card') is-invalid @enderror"
                            value="{{ old('name_on_card', $booking->full_name) }}"
                            placeholder="{{ __('JOHN DOE') }}"
                            autocomplete="cc-name"
                            data-payment-input="name"
                            required
                        >
                    </div>
                    @error('name_on_card')
                        <div class="invalid-feedback d-block">{{ $message }}</div>
                    @enderror
                </div>

                <div class="col-12">
                    <label for="stripe-card-element" class="filter-label mb-2">{{ __('Card Details') }}</label>
                    <div
                        id="stripe-card-element"
                        class="form-control unified-input py-3"
                        data-stripe-card-element
                    ></div>
                    <div class="invalid-feedback d-block d-none" data-stripe-card-errors></div>
                </div>
            @else
            <div class="col-12">
                <label for="card_number" class="filter-label mb-2">{{ __('Credit Card Number') }}</label>
                <div class="input-group unified-input @error('card_number') is-invalid @enderror">
                    <span class="input-group-text"><i class="bi bi-credit-card-2-front"></i></span>
                    <input
                        type="text"
                        id="card_number"
                        name="card_number"
                        class="form-control @error('card_number') is-invalid @enderror"
                        value="{{ old('card_number') }}"
                        placeholder="0000 0000 0000 0000"
                        inputmode="numeric"
                        autocomplete="cc-number"
                        maxlength="19"
                        data-payment-input="number"
                        required
                    >
                </div>
                @error('card_number')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>

            <div class="col-12">
                <label for="name_on_card" class="filter-label mb-2">{{ __('Cardholder Name') }}</label>
                <div class="input-group unified-input @error('name_on_card') is-invalid @enderror">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input
                        type="text"
                        id="name_on_card"
                        name="name_on_card"
                        class="form-control text-uppercase @error('name_on_card') is-invalid @enderror"
                        value="{{ old('name_on_card', $booking->full_name) }}"
                        placeholder="{{ __('JOHN DOE') }}"
                        autocomplete="cc-name"
                        data-payment-input="name"
                        required
                    >
                </div>
                @error('name_on_card')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>

            <div class="col-12 col-md-6">
                <label for="mm_yy" class="filter-label mb-2">{{ __('Expiry Date') }}</label>
                <div class="input-group unified-input @error('mm_yy') is-invalid @enderror">
                    <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                    <input
                        type="text"
                        id="mm_yy"
                        name="mm_yy"
                        class="form-control text-center @error('mm_yy') is-invalid @enderror"
                        value="{{ old('mm_yy') }}"
                        placeholder="{{ __('MM/YY') }}"
                        inputmode="numeric"
                        autocomplete="cc-exp"
                        maxlength="5"
                        data-payment-input="expiry"
                        required
                    >
                </div>
                <p class="booking-payment-form__hint mb-0">{{ __('Use a future date, e.g. 12/30') }}</p>
                @error('mm_yy')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>

            <div class="col-12 col-md-6">
                <label for="cvc" class="filter-label mb-2">
                    {{ __('Security Code') }}
                    <span class="text-muted fw-normal">({{ __('CVC') }})</span>
                </label>
                <div class="input-group unified-input @error('cvc') is-invalid @enderror">
                    <span class="input-group-text"><i class="bi bi-lock"></i></span>
                    <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        class="form-control text-center @error('cvc') is-invalid @enderror"
                        value="{{ old('cvc') }}"
                        placeholder="123"
                        inputmode="numeric"
                        autocomplete="cc-csc"
                        maxlength="4"
                        data-payment-input="cvc"
                        required
                    >
                </div>
                <p class="booking-payment-form__hint mb-0">{{ __('3 or 4 digits on the back of your card') }}</p>
                @error('cvc')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>
            @endif

            <div class="col-12">
                <div class="booking-payment-form__terms @error('termsCheck') is-invalid @enderror">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        name="termsCheck"
                        value="1"
                        id="termsCheck"
                        @checked(old('termsCheck'))
                        required
                    >
                    <label class="form-check-label" for="termsCheck">
                        {{ __('I authorize the charge of') }}
                        <strong style="color:var(--primary-color)">{{ $totalFormatted }}</strong>
                        {{ __('and agree to the') }}
                        <a href="#" style="color:var(--primary-color)">{{ __('House Rules') }}</a>.
                    </label>
                </div>
                @error('termsCheck')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>

            <div class="col-12">
                <button type="submit" class="btn btn-lg btn-primary w-100 py-3 booking-payment-form__submit">
                    <span data-payment-submit-label>{{ __('Complete Payment') }}</span>
                    <span class="booking-payment-form__submit-amount">{{ $totalFormatted }}</span>
                    <i class="bi bi-arrow-right-circle-fill ms-2"></i>
                </button>

                <ul class="booking-payment-trust list-unstyled mb-0">
                    <li><i class="bi bi-shield-check" style="color:var(--primary-color)"></i> {{ __('256-bit SSL encryption') }}</li>
                    <li><i class="bi bi-eye-slash" style="color:var(--primary-color)"></i> {{ __('Card details are not stored') }}</li>
                    <li><i class="bi bi-patch-check" style="color:var(--primary-color)"></i> {{ __('Instant booking confirmation') }}</li>
                </ul>
            </div>
        </div>
    </form>
</section>

@push('scripts')
@if($usesStripeElements)
<script src="https://js.stripe.com/v3/"></script>
@endif
<script>
(() => {
    const form = document.querySelector('[data-property-payment-form]');
    if (!form) return;
    const submitButton = form.querySelector('.booking-payment-form__submit');
    const submitLabel = form.querySelector('[data-payment-submit-label]');
    const stripePublishableKey = @json($stripePublishableKey);
    const tokenInput = form.querySelector('[data-stripe-payment-token]');
    const cardElementContainer = form.querySelector('[data-stripe-card-element]');
    const cardErrors = form.querySelector('[data-stripe-card-errors]');
    let stripe = null;
    let cardElement = null;

    const preview = {
        number: document.querySelector('[data-payment-preview="number"]'),
        name: document.querySelector('[data-payment-preview="name"]'),
        expiry: document.querySelector('[data-payment-preview="expiry"]'),
    };

    const inputs = {
        number: form.querySelector('[data-payment-input="number"]'),
        name: form.querySelector('[data-payment-input="name"]'),
        expiry: form.querySelector('[data-payment-input="expiry"]'),
    };

    if (stripePublishableKey && window.Stripe && cardElementContainer) {
        stripe = window.Stripe(stripePublishableKey);
        const elements = stripe.elements();
        cardElement = elements.create('card', {
            hidePostalCode: true,
            style: {
                base: {
                    color: '#111827',
                    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
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
    }

    const formatCardNumber = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 16);
        return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        const digits = value.replace(/\D/g, '').slice(0, 4);
        if (digits.length <= 2) return digits;
        return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    };

    const maskPreviewNumber = (value) => {
        const digits = value.replace(/\D/g, '');
        if (!digits.length) return '•••• •••• •••• ••••';

        const padded = `${digits}${'•'.repeat(16)}`.slice(0, 16);
        return padded.replace(/(.{4})/g, '$1 ').trim();
    };

    const syncPreview = () => {
        if (preview.number && inputs.number) {
            preview.number.textContent = maskPreviewNumber(inputs.number.value);
        }

        if (preview.name && inputs.name) {
            const name = inputs.name.value.trim();
            preview.name.textContent = name !== '' ? name.toUpperCase() : @json(__('YOUR NAME'));
        }

        if (preview.expiry && inputs.expiry) {
            preview.expiry.textContent = inputs.expiry.value.trim() !== '' ? inputs.expiry.value : 'MM/YY';
        }
    };

    if (inputs.number) {
        inputs.number.addEventListener('input', () => {
            inputs.number.value = formatCardNumber(inputs.number.value);
            syncPreview();
        });
    }

    if (inputs.name) {
        inputs.name.addEventListener('input', syncPreview);
    }

    if (inputs.expiry) {
        inputs.expiry.addEventListener('input', () => {
            inputs.expiry.value = formatExpiry(inputs.expiry.value);
            syncPreview();
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

        const cardholderName = inputs.name ? inputs.name.value.trim() : '';
        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
                name: cardholderName || @json($booking->full_name),
                email: @json($booking->email),
                phone: @json($booking->phone),
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

    syncPreview();
})();
</script>
@endpush
