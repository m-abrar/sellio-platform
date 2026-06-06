@php
    $eyebrow = $eyebrow ?? __('Success');
    $title = $title ?? __('Confirmed!');
    $message = $message ?? null;
    $icon = $icon ?? 'bi-patch-check-fill';
    $tone = $tone ?? 'success';
    $reference = $reference ?? null;
    $referenceLabel = $referenceLabel ?? __('Reference');
@endphp

<div class="checkout-success-hero glass-surface border-0 shadow-deep overflow-hidden mb-4 mb-lg-5">
    <div class="checkout-success-hero__glow checkout-success-hero__glow--{{ $tone }}"></div>

    <div class="checkout-success-hero__content text-center p-4 p-md-5">
        <div class="checkout-success-hero__icon-wrap checkout-success-hero__icon-wrap--{{ $tone }} mb-4">
            <i class="bi {{ $icon }}"></i>
        </div>

        <span class="metric-label d-block mb-2">{{ $eyebrow }}</span>
        <h1 class="fw-800 display-6 text-dark mb-3 tracking-tight">{{ $title }}</h1>

        @if($message)
            <p class="checkout-success-hero__message text-muted fs-5 mb-0 mx-auto">{{ $message }}</p>
        @endif

        @if(filled($reference) && $reference !== 'N/A')
            <p class="small text-muted mt-4 mb-0">
                {{ $referenceLabel }}: <strong class="text-dark">#{{ $reference }}</strong>
            </p>
        @endif
    </div>
</div>
