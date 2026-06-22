@php
    $taxRate = 0.05;
    $taxes = round($booking->total_price * $taxRate, 2);
    $finalTotal = round($booking->total_price + $taxes, 2);
    $unitPrice = $booking->quantity > 0 ? $booking->total_price / $booking->quantity : $booking->total_price;
@endphp

<div class="pricing-list mb-4">
    <div class="d-flex justify-content-between mb-3">
        <span class="text-muted small fw-600">
            {{ $booking->ticketType->title }}
            ({{ $booking->quantity }} × {{ format_currency($unitPrice) }})
        </span>
        <span class="fw-800 text-dark small">{{ format_currency($booking->total_price) }}</span>
    </div>

    <div class="d-flex justify-content-between mb-3">
        <span class="text-muted small fw-600">{{ __('Taxes & Fees') }} ({{ $taxRate * 100 }}%)</span>
        <span class="fw-800 text-dark small">{{ format_currency($taxes) }}</span>
    </div>
</div>

<hr class="my-4 border-color-light">

<div class="p-4 rounded-4 text-center" style="background:rgba(248,246,243,.9);border:1.5px solid rgba(15,23,42,.08)">
    <p class="filter-label mb-1">{{ __('Total Amount Due') }}</p>
    <h2 class="price-text-large mb-0 line-height-1" style="color:var(--primary-color)">{{ format_currency($finalTotal) }}</h2>
    <span class="fw-semibold px-3 py-2 mt-3 d-inline-block rounded-2 small" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
        <i class="bi bi-shield-check me-1"></i>{{ __('Inclusive of taxes & fees') }}
    </span>
</div>
