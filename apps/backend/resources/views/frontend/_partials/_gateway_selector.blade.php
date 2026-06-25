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

/* ── Proof-file upload zone ── */
.proof-upload{position:relative}
.proof-upload__input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.proof-upload__zone{border:2px dashed rgba(var(--primary-color-rgb),.25);border-radius:14px;padding:28px 20px;text-align:center;cursor:pointer;transition:border-color .2s,background .2s,box-shadow .2s;background:rgba(var(--primary-color-rgb),.02);user-select:none}
.proof-upload__zone:hover,.proof-upload__zone--over{border-color:var(--primary-color);background:rgba(var(--primary-color-rgb),.05);box-shadow:0 0 0 4px rgba(var(--primary-color-rgb),.07)}
.proof-upload__icon{font-size:2rem;color:var(--primary-color);opacity:.55;margin-bottom:10px;display:block;transition:transform .25s,opacity .25s}
.proof-upload__zone:hover .proof-upload__icon,.proof-upload__zone--over .proof-upload__icon{transform:translateY(-4px);opacity:.9}
.proof-upload__label-main{display:block;font-weight:700;font-size:.875rem;color:#1f2937}
.proof-upload__label-sub{display:block;font-size:.8125rem;color:#9ca3af;margin-top:3px}
.proof-upload__label-link{color:var(--primary-color);font-weight:600;text-decoration:underline}
.proof-upload__hint{margin-top:10px;font-size:.7rem;color:#d1d5db;font-weight:600;letter-spacing:.04em;text-transform:uppercase}
.proof-upload__preview{border:1.5px solid rgba(var(--primary-color-rgb),.2);border-radius:14px;padding:14px 16px;background:rgba(var(--primary-color-rgb),.03);display:flex;align-items:center;gap:14px}
.proof-upload__thumb{width:58px;height:58px;border-radius:10px;overflow:hidden;background:#f3f4f6;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1px solid rgba(0,0,0,.06)}
.proof-upload__thumb img{width:100%;height:100%;object-fit:cover;display:block}
.proof-upload__thumb-pdf{font-size:1.75rem;color:#ef4444;line-height:1}
.proof-upload__meta{flex:1;min-width:0}
.proof-upload__filename{display:block;font-weight:700;font-size:.8125rem;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.proof-upload__filesize{display:block;font-size:.74rem;color:#9ca3af;margin-top:2px}
.proof-upload__success{display:inline-flex;align-items:center;gap:5px;font-size:.74rem;font-weight:600;color:#16a34a;margin-top:4px}
.proof-upload__remove{background:none;border:none;padding:6px;cursor:pointer;color:#d1d5db;font-size:1.1rem;flex-shrink:0;line-height:1;border-radius:50%;transition:color .15s,background .15s}
.proof-upload__remove:hover{color:#ef4444;background:rgba(239,68,68,.08)}
.proof-upload__error{color:#ef4444;font-size:.8125rem;font-weight:500;margin-top:6px;display:flex;align-items:center;gap:5px}
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

            {{-- ── Premium file-upload drop zone ── --}}
            <div class="proof-upload" data-proof-upload>

                {{-- Hidden real input --}}
                <input type="file"
                       id="proof_file"
                       name="proof_file"
                       class="proof-upload__input @error('proof_file') is-invalid @enderror"
                       accept=".jpg,.jpeg,.png,.pdf"
                       data-proof-input>

                {{-- Drop zone (visible when no file chosen) --}}
                <div class="proof-upload__zone" data-proof-zone role="button" tabindex="0"
                     aria-label="{{ __('Upload payment receipt') }}">
                    <span class="proof-upload__icon"><i class="bi bi-cloud-arrow-up-fill"></i></span>
                    <span class="proof-upload__label-main">{{ __('Drop your receipt here') }}</span>
                    <span class="proof-upload__label-sub">
                        {{ __('or') }} <span class="proof-upload__label-link">{{ __('click to browse') }}</span>
                    </span>
                    <span class="proof-upload__hint">JPG · PNG · PDF &nbsp;·&nbsp; max 5 MB</span>
                </div>

                {{-- Preview (visible after file chosen) --}}
                <div class="proof-upload__preview" data-proof-preview style="display:none">
                    <div class="proof-upload__thumb">
                        <img src="" alt="" data-proof-img style="display:none">
                        <span class="proof-upload__thumb-pdf" data-proof-pdf style="display:none">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                        </span>
                    </div>
                    <div class="proof-upload__meta">
                        <span class="proof-upload__filename" data-proof-name></span>
                        <span class="proof-upload__filesize" data-proof-size></span>
                        <span class="proof-upload__success">
                            <i class="bi bi-check-circle-fill"></i> {{ __('Ready to submit') }}
                        </span>
                    </div>
                    <button type="button" class="proof-upload__remove" data-proof-remove
                            aria-label="{{ __('Remove file') }}">
                        <i class="bi bi-x-circle-fill"></i>
                    </button>
                </div>

                @error('proof_file')
                    <div class="proof-upload__error">
                        <i class="bi bi-exclamation-circle-fill"></i> {{ $message }}
                    </div>
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

@push($scriptsStack)
<script>
(() => {
    const upload = document.querySelector('[data-proof-upload]');
    if (!upload) return;

    const input   = upload.querySelector('[data-proof-input]');
    const zone    = upload.querySelector('[data-proof-zone]');
    const preview = upload.querySelector('[data-proof-preview]');
    const img     = upload.querySelector('[data-proof-img]');
    const pdfIcon = upload.querySelector('[data-proof-pdf]');
    const nameEl  = upload.querySelector('[data-proof-name]');
    const sizeEl  = upload.querySelector('[data-proof-size]');
    const removeBtn = upload.querySelector('[data-proof-remove]');

    const fmtSize = b => b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

    const show = file => {
        nameEl.textContent = file.name;
        sizeEl.textContent = fmtSize(file.size);
        if (file.type.startsWith('image/')) {
            const r = new FileReader();
            r.onload = e => { img.src = e.target.result; img.style.display = ''; pdfIcon.style.display = 'none'; };
            r.readAsDataURL(file);
        } else {
            img.style.display = 'none'; pdfIcon.style.display = '';
        }
        zone.style.display = 'none';
        preview.style.display = '';
    };

    const clear = () => {
        input.value = '';
        img.src = '';
        zone.style.display = '';
        preview.style.display = 'none';
    };

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    input.addEventListener('change', () => { if (input.files[0]) show(input.files[0]); });
    removeBtn.addEventListener('click', clear);

    zone.addEventListener('dragover',  e => { e.preventDefault(); zone.classList.add('proof-upload__zone--over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('proof-upload__zone--over'));
    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('proof-upload__zone--over');
        const file = e.dataTransfer.files[0];
        if (!file) return;
        const allowed = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowed.includes(file.type)) return;
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        show(file);
    });

    // Intercept form submit: show error on zone if manual tab is active but no file chosen
    const form = upload.closest('form');
    if (form) {
        form.addEventListener('submit', e => {
            const methodInput = form.querySelector('[data-gateway-method]');
            const isManual = (methodInput ? methodInput.value : '') === 'manual';
            if (!isManual || input.files.length > 0) return;

            e.preventDefault();
            zone.style.display = '';
            preview.style.display = 'none';
            zone.style.borderColor = '#ef4444';
            zone.style.background  = 'rgba(239,68,68,.04)';
            zone.style.boxShadow   = '0 0 0 4px rgba(239,68,68,.1)';
            zone.scrollIntoView({ behavior: 'smooth', block: 'center' });

            zone.addEventListener('click', () => {
                zone.style.borderColor = '';
                zone.style.background  = '';
                zone.style.boxShadow   = '';
            }, { once: true });
        });
    }
})();
</script>
@endpush

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
