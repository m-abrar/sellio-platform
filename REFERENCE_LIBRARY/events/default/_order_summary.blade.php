{{-- The booking object should have its relationships loaded (event, occurrence, ticketType) --}}

<div class="mb-4">
    <h5 class="text-primary-color">
        {{ $booking->ticketType->title }} (x{{ $booking->quantity }})
    </h5>
    <p class="text-muted small mb-1">
        Date: **{{ $booking->occurrence->start_date_time->format('F jS, Y') }}**
    </p>
    <p class="text-muted small mb-0">
        Time: **{{ $booking->occurrence->start_date_time->format('h:i A') }}**
    </p>
</div>

<div class="row small g-2 border-top pt-3">
    <div class="col-8">Ticket Price ({{ $booking->quantity }} x ${{ number_format($booking->total_price / $booking->quantity, 2) }})</div>
    <div class="col-4 text-end">${{ number_format($booking->total_price, 2) }}</div>
    
    {{-- Example: Add placeholder for Tax/Fees --}}
    @php
        $taxRate = 0.05; // 5% tax example
        $taxes = $booking->total_price * $taxRate;
        $finalTotal = $booking->total_price + $taxes;
    @endphp

    <div class="col-8 border-top pt-2">Taxes & Fees ({{ $taxRate * 100 }}%)</div>
    <div class="col-4 text-end border-top pt-2">${{ number_format($taxes, 2) }}</div>
</div>

<div class="row mt-3 p-3 bg-primary-light rounded">
    <div class="col-6 fw-bold fs-5">Total Due</div>
    <div class="col-6 fw-bold fs-5 text-end text-success">${{ number_format($finalTotal, 2) }}</div>
</div>

{{-- Store the final total for the payment form to use --}}
<input type="hidden" name="final_total_amount" value="{{ $finalTotal }}">