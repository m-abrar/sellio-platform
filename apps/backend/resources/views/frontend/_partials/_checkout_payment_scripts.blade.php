@php
    $stripePublishableKey = $stripePublishableKey ?? null;
    $formSelector = $formSelector ?? '[data-checkout-payment-form]';
    $cardholderFallback = $cardholderFallback ?? '';
    $billingEmail = $billingEmail ?? null;
    $billingPhone = $billingPhone ?? null;
@endphp

@if(filled($stripePublishableKey))
    @push($scriptsStack ?? 'scripts')
        <script src="https://js.stripe.com/v3/"></script>
        <script>
            (() => {
                const stripePublishableKey = @json($stripePublishableKey);
                const form = document.querySelector(@json($formSelector));
                if (!form) return;

                const submitButtons = form.querySelectorAll('[data-checkout-payment-submit]');
                const submitLabel = form.querySelector('[data-payment-submit-label]');
                const tokenInput = form.querySelector('[data-stripe-payment-token]');
                const cardElementContainer = form.querySelector('[data-stripe-card-element]');
                const cardErrors = form.querySelector('[data-stripe-card-errors]');
                const cardholderInput = form.querySelector('[data-checkout-cardholder]') || form.querySelector('[data-payment-input="name"]');

                const preview = {
                    number: document.querySelector('[data-payment-preview="number"]'),
                    name: document.querySelector('[data-payment-preview="name"]'),
                    expiry: document.querySelector('[data-payment-preview="expiry"]'),
                };

                let stripe = null;
                let cardElement = null;

                if (stripePublishableKey && window.Stripe && cardElementContainer && tokenInput) {
                    stripe = window.Stripe(stripePublishableKey);
                    const elements = stripe.elements();
                    cardElement = elements.create('card', {
                        hidePostalCode: true,
                        iconStyle: 'solid',
                        style: {
                            base: {
                                color: '#1C1917',
                                fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
                                fontSize: '16px',
                                fontWeight: '600',
                                '::placeholder': { color: '#9ca3af', fontWeight: '400' },
                            },
                            invalid: { color: '#dc3545' },
                        },
                    });

                    cardElement.mount(cardElementContainer);
                    cardElement.on('focus', () => cardElementContainer.classList.add('stripe-focused'));
                    cardElement.on('blur',  () => cardElementContainer.classList.remove('stripe-focused'));
                    cardElement.on('change', (event) => {
                        if (!cardErrors) return;
                        cardErrors.textContent = event.error ? event.error.message : '';
                        cardErrors.classList.toggle('d-none', !event.error);
                    });
                }

                const syncPreviewName = () => {
                    if (!preview.name || !cardholderInput) return;
                    const name = cardholderInput.value.trim();
                    preview.name.textContent = name !== '' ? name.toUpperCase() : @json(__('YOUR NAME'));
                };

                if (cardholderInput) {
                    cardholderInput.addEventListener('input', syncPreviewName);
                    syncPreviewName();
                }

                const setSubmitting = (isSubmitting) => {
                    submitButtons.forEach((button) => {
                        button.disabled = isSubmitting;
                        button.classList.toggle('is-loading', isSubmitting);
                    });

                    if (submitLabel) {
                        submitLabel.textContent = isSubmitting
                            ? @json(__('Processing payment...'))
                            : @json($submitLabelText ?? __('Complete Payment'));
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

                    const result = await stripe.createPaymentMethod({
                        type: 'card',
                        card: cardElement,
                        billing_details: {
                            name: cardholderInput?.value?.trim() || @json($cardholderFallback),
                            email: @json($billingEmail),
                            phone: @json($billingPhone),
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
@endif
