@php
    $checkoutGateways  ??= [];
    $stripeGateway     = collect($checkoutGateways)->firstWhere('slug', 'stripe');
    $manualGateway     = collect($checkoutGateways)->firstWhere('slug', 'manual');
    $stripeKey         = $stripeGateway['config']['publishable_key'] ?? null;
    $usesStripeElem    = filled($stripeKey);
    $hasMany           = count($checkoutGateways) > 1;
    $defaultSlug       = $checkoutGateways[0]['slug'] ?? 'stripe';
    $activeSlug        = old('payment_method', $defaultSlug);
    $totalFormatted    ??= '';
    $cardholderName    ??= auth()->user()->name ?? '';
    $cardholderFieldName ??= 'name_on_card';
    $submitLabel       ??= __('Complete Payment');
    $showTerms         ??= true;
    $termsLabel        ??= null;
    $formActionBase    ??= null;
    $scriptsStack      ??= 'scripts';
    $canSubmit         = $usesStripeElem || $manualGateway;
@endphp

<style>
.gateway-tabs{display:flex;gap:12px;flex-wrap:wrap;padding:16px 0 20px}
.gateway-tab{display:inline-flex;align-items:center;gap:9px;padding:10px 18px;border:2px solid rgba(var(--primary-color-rgb),.2);border-radius:10px;cursor:pointer;font-weight:600;font-size:.8125rem;color:#6b7280;background:#fff;user-select:none;transition:border-color .15s,background .15s,color .15s}
.gateway-tab--active{border-color:var(--primary-color);background:rgba(var(--primary-color-rgb),.06);color:var(--primary-color)}
.gateway-tab i{font-size:.95rem}
</style>

<section class="booking-payment-panel bg-white border" data-gateway-selector>
    {{-- Header --}}
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
        @if($stripeGateway)
        <div class="booking-payment-panel__brands js-stripe-brands" aria-hidden="true"
             @style(['display:none' => $activeSlug !== 'stripe'])>
            <span class="booking-payment-brand booking-payment-brand--visa">VISA</span>
            <span class="booking-payment-brand booking-payment-brand--mc">MC</span>
            <span class="booking-payment-brand booking-payment-brand--amex">AMEX</span>
        </div>
        @endif
    </div>

    {{-- Gateway tabs (only when multiple active gateways) --}}
    @if($hasMany)
    <div class="gateway-tabs" role="tablist">
        @foreach($checkoutGateways as $gw)
        <label class="gateway-tab {{ $gw['slug'] === $activeSlug ? 'gateway-tab--active' : '' }}"
               data-gateway-tab="{{ $gw['slug'] }}" role="tab"
               aria-selected="{{ $gw['slug'] === $activeSlug ? 'true' : 'false' }}">
            <input type="radio" name="_gateway_tab" value="{{ $gw['slug'] }}"
                   class="visually-hidden" {{ $gw['slug'] === $activeSlug ? 'checked' : '' }}>
            @if($gw['slug'] === 'stripe')
                <i class="bi bi-credit-card-2-front"></i>
            @elseif($gw['slug'] === 'manual')
                <i class="bi bi-building-check"></i>
            @elseif($gw['slug'] === 'paypal')
                <i class="bi bi-paypal"></i>
            @else
                <i class="bi bi-globe2"></i>
            @endif
            {{ $gw['title'] }}
        </label>
        @endforeach
    </div>
    @endif

    {{-- Card preview (Stripe only) --}}
    @if($stripeGateway)
    <div class="booking-payment-card-preview js-stripe-section" aria-hidden="true"
         @style(['display:none' => $activeSlug !== 'stripe'])>
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
    @endif

    {{-- Hidden inputs managed by this selector --}}
    <input type="hidden" name="payment_method" value="{{ $activeSlug }}" data-gateway-method>
    <input type="hidden" name="payment_token"  value="" data-stripe-payment-token>

    <div class="row g-3 g-md-4">

        {{-- ── Stripe tab content ── --}}
        @if($stripeGateway)
        <div class="col-12 js-gateway-content" data-gateway-content="stripe"
             @style(['display:none' => $activeSlug !== 'stripe'])>
            <div class="booking-payment-form__demo">
                <i class="bi bi-info-circle me-2"></i>
                @if($usesStripeElem)
                    {{ __('Stripe secure card entry is enabled for this checkout.') }}
                @else
                    {{ __('Stripe sandbox mode: use card') }} <code>4242 4242 4242 4242</code>, {{ __('any future expiry, and any 3-digit CVC.') }}
                @endif
            </div>

            @if($usesStripeElem)
            <div class="row g-3 g-md-4 mt-0">
                <div class="col-12">
                    <label for="{{ $cardholderFieldName }}" class="filter-label mb-2">{{ __('Cardholder Name') }}</label>
                    <div class="input-group unified-input">
                        <span class="input-group-text"><i class="bi bi-person"></i></span>
                        <input type="text"
                               id="{{ $cardholderFieldName }}"
                               name="{{ $cardholderFieldName }}"
                               class="form-control text-uppercase"
                               value="{{ old($cardholderFieldName, $cardholderName) }}"
                               placeholder="{{ __('JOHN DOE') }}"
                               autocomplete="cc-name"
                               data-payment-input="name"
                               data-checkout-cardholder>
                    </div>
                </div>
                <div class="col-12">
                    <label for="checkout-stripe-card-element" class="filter-label mb-2">{{ __('Card Details') }}</label>
                    <div id="checkout-stripe-card-element"
                         class="form-control unified-input py-3"
                         data-stripe-card-element></div>
                    <div class="invalid-feedback d-block d-none" data-stripe-card-errors role="alert"></div>
                </div>
            </div>
            @else
            <div class="p-3 rounded-3 small mt-2"
                 style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15);border-left:4px solid var(--primary-color)">
                <i class="bi bi-exclamation-circle me-2" style="color:var(--primary-color)"></i>
                {{ __('Stripe must be configured in admin payment settings before checkout can collect payment.') }}
            </div>
            @endif
        </div>
        @endif

        {{-- ── Manual / Bank Transfer tab content ── --}}
        @if($manualGateway)
        @php
            $bankDetails  = $manualGateway['config']['bank_details']  ?? [];
            $instructions = $manualGateway['config']['instructions'] ?? '';
        @endphp
        <div class="col-12 js-gateway-content" data-gateway-content="manual"
             @style(['display:none' => $activeSlug !== 'manual'])>

            <div class="gateway-bank-details rounded-3 p-4 mb-3"
                 style="background:rgba(var(--primary-color-rgb),.04);border:1.5px solid rgba(var(--primary-color-rgb),.15)">
                <h6 class="fw-700 text-dark mb-3">
                    <i class="bi bi-building me-2" style="color:var(--primary-color)"></i>{{ __('Bank Transfer Details') }}
                </h6>
                <dl class="row mb-0 small">
                    @foreach($bankDetails as $key => $value)
                        @if($value)
                        <dt class="col-sm-5 text-muted fw-600 mb-1 text-capitalize">{{ str_replace('_', ' ', $key) }}</dt>
                        <dd class="col-sm-7 fw-700 text-dark mb-1 font-monospace">{{ $value }}</dd>
                        @endif
                    @endforeach
                </dl>
                @if($instructions)
                <div class="alert alert-light border mt-3 mb-0 small fw-500">
                    <i class="bi bi-info-circle me-1" style="color:var(--primary-color)"></i>{{ $instructions }}
                </div>
                @endif
            </div>

            <div>
                <label for="proof_file" class="filter-label mb-2">
                    {{ __('Upload Payment Receipt') }} <span class="text-danger">*</span>
                </label>
                <div class="input-group unified-input">
                    <span class="input-group-text"><i class="bi bi-paperclip"></i></span>
                    <input type="file" id="proof_file" name="proof_file"
                           class="form-control @error('proof_file') is-invalid @enderror"
                           accept=".jpg,.jpeg,.png,.pdf">
                </div>
                <p class="small text-muted mt-1 mb-0">{{ __('Accepted: JPG, PNG, PDF · Max 5 MB') }}</p>
                @error('proof_file')
                    <div class="invalid-feedback d-block">{{ $message }}</div>
                @enderror
            </div>
        </div>
        @endif

        {{-- ── Terms ── --}}
        @if($showTerms)
        <div class="col-12">
            <div class="booking-payment-form__terms">
                <input class="form-check-input" type="checkbox" name="termsCheck"
                       value="1" id="checkoutTermsCheck" required>
                <label class="form-check-label" for="checkoutTermsCheck">
                    @if($termsLabel)
                        {!! $termsLabel !!}
                    @else
                        {{ __('I authorize the charge of') }}
                        <strong style="color:var(--primary-color)">{{ $totalFormatted }}</strong>
                        {{ __('and agree to the') }}
                        <a href="#" style="color:var(--primary-color)">{{ __('Terms & Conditions') }}</a>.
                    @endif
                </label>
            </div>
        </div>
        @endif

        {{-- ── Submit ── --}}
        <div class="col-12">
            <button type="submit"
                    class="btn btn-lg btn-primary w-100 py-3 booking-payment-form__submit"
                    data-checkout-payment-submit
                    @disabled(!$canSubmit)>
                <span data-payment-submit-label>{{ $submitLabel }}</span>
                <span class="booking-payment-form__submit-amount">{{ $totalFormatted }}</span>
                <i class="bi bi-arrow-right-circle-fill ms-2"></i>
            </button>

            <ul class="booking-payment-trust list-unstyled mb-0">
                <li><i class="bi bi-shield-check" style="color:var(--primary-color)"></i> {{ __('256-bit SSL encryption') }}</li>
                <li><i class="bi bi-eye-slash"    style="color:var(--primary-color)"></i> {{ __('Card details are not stored') }}</li>
                <li><i class="bi bi-patch-check"  style="color:var(--primary-color)"></i> {{ __('Instant order confirmation') }}</li>
            </ul>
        </div>
    </div>
</section>

@if($hasMany)
@push($scriptsStack)
<script>
(() => {
    const selector = document.querySelector('[data-gateway-selector]');
    if (!selector) return;

    const methodInput  = document.querySelector('[data-gateway-method]');
    const stripeItems  = selector.querySelectorAll('.js-stripe-section');
    const tabs         = selector.querySelectorAll('[data-gateway-tab]');
    const radios       = selector.querySelectorAll('input[name="_gateway_tab"]');
    const formActionBase = @json($formActionBase);

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            const slug = radio.value;

            if (methodInput) methodInput.value = slug;

            tabs.forEach(tab => tab.classList.toggle('gateway-tab--active', tab.dataset.gatewayTab === slug));
            tabs.forEach(tab => tab.setAttribute('aria-selected', tab.dataset.gatewayTab === slug ? 'true' : 'false'));

            selector.querySelectorAll('[data-gateway-content]').forEach(el => {
                el.style.display = el.dataset.gatewayContent === slug ? '' : 'none';
            });

            stripeItems.forEach(el => { el.style.display = slug === 'stripe' ? '' : 'none'; });

            if (formActionBase) {
                const form = selector.closest('form');
                if (form) form.action = formActionBase.replace('__SLUG__', slug);
            }

            // Ensure submit button is enabled for manual (no JS card validation needed)
            if (slug === 'manual') {
                document.querySelectorAll('[data-checkout-payment-submit]').forEach(btn => {
                    btn.disabled = false;
                });
            }
        });
    });
})();
</script>
@endpush
@endif
