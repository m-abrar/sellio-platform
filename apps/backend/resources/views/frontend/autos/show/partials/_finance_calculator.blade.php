{{-- Detailed Financing Calculator Card --}}
@php
    $price = $auto->base_price;
    // Default assumptions for a good starting estimate
    $defaultDownPayment = 5000;
    $defaultTerm = 72; // months
    $defaultApr = 5.5; // percent
@endphp

<div class="card bg-white border p-4 mb-4">
    <h4 class="fw-bold mb-3"><i class="bi bi-calculator me-2 text-primary"></i>{{ __('Finance Calculator') }}</h4>
    <form id="auto-finance-calc">
        <input type="hidden" id="auto-price" value="{{ $price }}">
        
        <div class="mb-3">
            <label for="down-payment" class="form-label small fw-semibold">{{ __('Down Payment (:symbol)', ['symbol' => setting('currency_symbol', '$')]) }}</label>
            <input type="number" id="down-payment" name="down_payment" class="form-control" 
                   value="{{ $defaultDownPayment }}" min="0" max="{{ $price }}" step="500" placeholder="{{ __('Down Payment') }}">
        </div>
        <div class="mb-3">
            <label for="loan-term" class="form-label small fw-semibold">{{ __('Loan Term (Months)') }}</label>
            <select id="loan-term" name="loan_term" class="form-select">
                <option value="48">{{ __('48 Months') }}</option>
                <option value="60">{{ __('60 Months') }}</option>
                <option selected value="72">{{ __('72 Months') }}</option>
                <option value="84">{{ __('84 Months') }}</option>
            </select>
        </div>
        <div class="mb-4">
            <label for="apr-rate" class="form-label small fw-semibold">{{ __('Estimated APR (%)') }}</label>
            <input type="number" id="apr-rate" name="apr_rate" class="form-control" step="0.1" value="{{ $defaultApr }}" placeholder="{{ __('APR') }}">
        </div>

        {{-- Estimated Payment Result (Will be updated via JavaScript) --}}
        <div class="text-center p-3 rounded bg-primary-light border-primary-light">
            <p class="small text-muted mb-1">{{ __('Estimated Monthly Payment') }}</p>
            <h3 class="fw-bold mb-0 text-primary" id="monthly-payment-result">{{ setting('currency_symbol', '$') }}789<span class="small fw-normal">/{{ __('mo') }}</span></h3>
        </div>
        <small class="d-block text-center text-muted mt-2">{{ __('Excludes taxes and fees. Subject to credit approval.') }}</small>
    </form>
</div>
{{-- Requires JavaScript for real-time calculation --}}
