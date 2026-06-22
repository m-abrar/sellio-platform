<p class="text-muted lh-lg">{!! nl2br(e($classified->description)) !!}</p>

<h4 class="fw-800 mt-5 mb-3 text-dark detail-section-title"><i class="bi bi-list-check me-2" style="color:var(--primary-color);font-size:.85em" aria-hidden="true"></i>{{ __('Key Details') }}</h4>
<div style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07);border-radius:14px;overflow:hidden" class="mb-4">

    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style="border-color:rgba(15,23,42,.06)!important">
        <span class="fw-semibold small text-dark">{{ __('Condition') }}</span>
        <div class="d-flex align-items-center gap-2">
            <span class="fw-semibold small px-2 py-1 rounded-2" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                {{ $classified->condition_label }}
            </span>
            <span class="text-muted small">({{ $classified->item_condition }}/10)</span>
        </div>
    </div>

    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style="border-color:rgba(15,23,42,.06)!important">
        <span class="fw-semibold small text-dark">{{ __('Category') }}</span>
        <span class="small text-muted">{{ $classified->category->title ?? __('N/A') }}</span>
    </div>

    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style="border-color:rgba(15,23,42,.06)!important">
        <span class="fw-semibold small text-dark">{{ __('Brand') }}</span>
        <span class="small text-muted">{{ $classified->brand->title ?? __('Not Specified') }}</span>
    </div>

    @if ($classified->item_year_age)
    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style="border-color:rgba(15,23,42,.06)!important">
        <span class="fw-semibold small text-dark">{{ __('Year/Age') }}</span>
        <span class="small text-muted">{{ trans_choice('{1} :count year old|[2,*] :count years old', $classified->item_year_age) }}</span>
    </div>
    @endif

    @if ($classified->item_quantity > 1)
    <div class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style="border-color:rgba(15,23,42,.06)!important">
        <span class="fw-semibold small text-dark">{{ __('Quantity') }}</span>
        <span class="small text-muted">{{ $classified->item_quantity }} {{ __('available') }}</span>
    </div>
    @endif

    <div class="d-flex justify-content-between align-items-center px-4 py-3">
        <span class="fw-semibold small text-dark">{{ __('Shipping') }}</span>
        <span class="small text-muted">{{ $classified->is_shipping ? __('Available (Inquire for details)') : __('Local Pickup Only') }}</span>
    </div>
</div>

{{-- Safety Tip --}}
<div class="p-4 rounded-3 small mt-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.15);border-left:4px solid var(--primary-color)">
    <i class="bi bi-shield-lock-fill me-2" style="color:var(--primary-color)"></i>
    <strong>{{ __('Safety Tip') }}:</strong>
    {{ __('Always meet in a public location and inspect the item before finalizing the purchase.') }}
</div>
