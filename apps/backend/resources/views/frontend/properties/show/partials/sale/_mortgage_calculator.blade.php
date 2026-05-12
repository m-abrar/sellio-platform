{{-- Mortgage Calculator Card --}}
<div class="card glass-surface p-4 mb-4">
    <h4 class="fw-bold mb-3"><i class="bi bi-currency-dollar me-2 text-primary-color"></i>{{ __('Mortgage Estimate') }}</h4>
    <form>
        <div class="mb-3"><label class="form-label small fw-semibold">{{ __('Down Payment') }}</label><input type="number" class="form-control" value="125000" placeholder="{{ __('Down Payment') }}"></div>
        <div class="mb-3"><label class="form-label small fw-semibold">{{ __('Interest Rate (%)') }}</label><input type="number" class="form-control" step="0.01" value="6.5" placeholder="{{ __('Interest Rate') }}"></div>
        <div class="mb-4">
            <label class="form-label small fw-semibold">{{ __('Term (Years)') }}</label>
            <select class="form-select"><option value="15">{{ __('15 Years') }}</option><option selected value="30">{{ __('30 Years') }}</option></select>
        </div>
        <div class="text-center p-3 rounded bg-light-primary border-primary-light">
            <p class="small text-muted mb-1">{{ __('Estimated Monthly Payment') }}</p>
            <h3 class="fw-bold mb-0 text-primary-color">{{ setting('currency_symbol', '$') }}3,150<span class="small fw-normal">/{{ __('mo') }}</span></h3>
        </div>
        <small class="d-block text-center text-muted mt-2">{{ __('Taxes/Insurance not included.') }}</small>
    </form>
</div>
