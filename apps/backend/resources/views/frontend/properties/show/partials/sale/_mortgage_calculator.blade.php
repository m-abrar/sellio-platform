{{-- Mortgage Calculator Card --}}
<div class="card glass-surface p-4 mb-4">
    <h4 class="fw-bold mb-3"><i class="bi bi-currency-dollar me-2 text-primary-color"></i>Mortgage Estimate</h4>
    <form>
        <div class="mb-3"><label class="form-label small fw-semibold">Down Payment</label><input type="number" class="form-control" value="125000" placeholder="Down Payment"></div>
        <div class="mb-3"><label class="form-label small fw-semibold">Interest Rate (%)</label><input type="number" class="form-control" step="0.01" value="6.5" placeholder="Interest Rate"></div>
        <div class="mb-4">
            <label class="form-label small fw-semibold">Term (Years)</label>
            <select class="form-select"><option value="15">15 Years</option><option selected value="30">30 Years</option></select>
        </div>
        <div class="text-center p-3 rounded bg-light-primary border-primary-light">
            <p class="small text-muted mb-1">Estimated Monthly Payment</p>
            <h3 class="fw-bold mb-0 text-primary-color">$3,150<span class="small fw-normal">/mo</span></h3>
        </div>
        <small class="d-block text-center text-muted mt-2">Taxes/Insurance not included.</small>
    </form>
</div>
