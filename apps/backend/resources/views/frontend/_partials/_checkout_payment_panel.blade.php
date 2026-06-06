@php
    $stripePublishableKey = $stripePublishableKey ?? null;
    $usesStripeElements = filled($stripePublishableKey);
    $totalFormatted = $totalFormatted ?? format_currency(0);
    $cardholderName = $cardholderName ?? (auth()->user()->name ?? '');
    $cardholderFieldName = $cardholderFieldName ?? 'name_on_card';
    $submitLabel = $submitLabel ?? __('Complete Payment');
    $showTerms = $showTerms ?? true;
    $termsLabel = $termsLabel ?? null;
    $demoMessage = $demoMessage ?? null;
@endphp

<section class="booking-payment-panel glass-surface border-0 shadow-deep">
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

    <div class="booking-payment-form__demo">
        <i class="bi bi-info-circle me-2"></i>
        @if($demoMessage)
            {{ $demoMessage }}
        @elseif($usesStripeElements)
            {{ __('Stripe secure card entry is enabled for this checkout.') }}
        @else
            {{ __('Stripe sandbox mode: use card') }} <code>4242 4242 4242 4242</code>, {{ __('any future expiry, and any 3-digit CVC.') }}
        @endif
    </div>

    <div class="row g-3 g-md-4">
        @if($usesStripeElements)
            <div class="col-12">
                <label for="{{ $cardholderFieldName }}" class="filter-label mb-2">{{ __('Cardholder Name') }}</label>
                <div class="input-group unified-input">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <input
                        type="text"
                        id="{{ $cardholderFieldName }}"
                        name="{{ $cardholderFieldName }}"
                        class="form-control text-uppercase"
                        value="{{ old($cardholderFieldName, $cardholderName) }}"
                        placeholder="{{ __('JOHN DOE') }}"
                        autocomplete="cc-name"
                        data-payment-input="name"
                        data-checkout-cardholder
                    >
                </div>
            </div>

            <div class="col-12">
                <label for="checkout-stripe-card-element" class="filter-label mb-2">{{ __('Card Details') }}</label>
                <div
                    id="checkout-stripe-card-element"
                    class="form-control unified-input py-3"
                    data-stripe-card-element
                ></div>
                <div class="invalid-feedback d-block d-none" data-stripe-card-errors role="alert"></div>
            </div>
        @else
            <div class="col-12">
                <div class="alert alert-warning mb-0">
                    {{ __('Stripe must be configured in admin payment settings before checkout can collect payment.') }}
                </div>
            </div>
        @endif

        @if($showTerms)
            <div class="col-12">
                <div class="booking-payment-form__terms">
                    <input class="form-check-input" type="checkbox" name="termsCheck" value="1" id="checkoutTermsCheck" required>
                    <label class="form-check-label" for="checkoutTermsCheck">
                        @if($termsLabel)
                            {!! $termsLabel !!}
                        @else
                            {{ __('I authorize the charge of') }}
                            <strong class="text-primary-color">{{ $totalFormatted }}</strong>
                            {{ __('and agree to the') }}
                            <a href="#" class="text-primary-color">{{ __('Terms & Conditions') }}</a>.
                        @endif
                    </label>
                </div>
            </div>
        @endif

        <div class="col-12">
            <button type="submit" class="btn btn-lg btn-primary-theme w-100 py-3 fw-800 rounded-pill shadow-deep booking-payment-form__submit" data-checkout-payment-submit @disabled(!$usesStripeElements)>
                <span data-payment-submit-label>{{ $submitLabel }}</span>
                <span class="booking-payment-form__submit-amount">{{ $totalFormatted }}</span>
                <i class="bi bi-arrow-right-circle-fill ms-2"></i>
            </button>

            <ul class="booking-payment-trust list-unstyled mb-0">
                <li><i class="bi bi-shield-check text-success"></i> {{ __('256-bit SSL encryption') }}</li>
                <li><i class="bi bi-eye-slash text-primary-color"></i> {{ __('Card details are not stored') }}</li>
                <li><i class="bi bi-patch-check text-primary-color"></i> {{ __('Instant order confirmation') }}</li>
            </ul>
        </div>
    </div>
</section>
