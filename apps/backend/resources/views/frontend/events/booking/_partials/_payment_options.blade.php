@php
    $taxRate       = 0.05;
    $finalTotal    = round($booking->total_price * (1 + $taxRate), 2);
    $totalFormatted = format_currency($finalTotal);
    $checkoutGateways ??= [];
    $stripeKey = collect($checkoutGateways)->firstWhere('slug', 'stripe')['config']['publishable_key'] ?? null;
@endphp

<form id="payment-form"
      method="POST"
      action="{{ route('events.tickets.booking.processPayment', ['event' => $booking->event->slug, 'booking' => $booking->id]) }}"
      enctype="multipart/form-data"
      class="booking-payment-form"
      data-checkout-payment-form
      data-event-payment-form
      novalidate>
    @csrf

    <input type="hidden" name="booking_id" value="{{ $booking->id }}">

    @include('frontend._partials._gateway_selector', [
        'checkoutGateways'    => $checkoutGateways,
        'totalFormatted'      => $totalFormatted,
        'cardholderName'      => old('cardholder_name', $booking->user_name),
        'cardholderFieldName' => 'cardholder_name',
        'submitLabel'         => __('Complete Order & Pay'),
        'showTerms'           => true,
        'termsLabel'          => __('I authorize the charge of') . ' <strong style="color:var(--primary-color)">' . e($totalFormatted) . '</strong> ' . __('and agree to the') . ' <a href="#" style="color:var(--primary-color)">' . __('Terms & Conditions') . '</a> ' . __('and') . ' <a href="#" style="color:var(--primary-color)">' . __('Refund Policy') . '</a>.',
        'scriptsStack'        => 'payment_scripts',
    ])
</form>

@include('frontend._partials._checkout_payment_scripts', [
    'stripePublishableKey' => $stripeKey,
    'formSelector'         => '[data-event-payment-form]',
    'cardholderFallback'   => $booking->user_name,
    'billingEmail'         => $booking->user_email,
    'billingPhone'         => $booking->user_phone,
    'submitLabelText'      => __('Complete Order & Pay'),
    'scriptsStack'         => 'payment_scripts',
])
