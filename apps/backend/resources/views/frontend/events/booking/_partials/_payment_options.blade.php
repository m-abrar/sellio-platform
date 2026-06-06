@php
    $stripePublishableKey = $stripePublishableKey ?? null;
    $taxRate = 0.05;
    $finalTotal = round($booking->total_price * (1 + $taxRate), 2);
    $totalFormatted = format_currency($finalTotal);
@endphp

<form id="payment-form"
      method="POST"
      action="{{ route('events.tickets.booking.processPayment', ['event' => $booking->event->slug, 'booking' => $booking->id]) }}"
      class="booking-payment-form"
      data-checkout-payment-form
      data-event-payment-form
      novalidate>
    @csrf

    <input type="hidden" name="booking_id" value="{{ $booking->id }}">
    <input type="hidden" name="payment_method" value="stripe">
    <input type="hidden" name="payment_token" value="" data-stripe-payment-token>

    @include('frontend._partials._checkout_payment_panel', [
        'stripePublishableKey' => $stripePublishableKey,
        'totalFormatted' => $totalFormatted,
        'cardholderName' => old('cardholder_name', $booking->user_name),
        'cardholderFieldName' => 'cardholder_name',
        'submitLabel' => __('Complete Order & Pay'),
        'showTerms' => true,
        'termsLabel' => __('I authorize the charge of') . ' <strong class="text-primary-color">' . e($totalFormatted) . '</strong> ' . __('and agree to the') . ' <a href="#" class="text-primary-color">' . __('Terms & Conditions') . '</a> ' . __('and') . ' <a href="#" class="text-primary-color">' . __('Refund Policy') . '</a>.',
        'demoMessage' => filled($stripePublishableKey)
            ? __('Stripe secure card entry is enabled for this ticket checkout.')
            : null,
    ])
</form>

@include('frontend._partials._checkout_payment_scripts', [
    'stripePublishableKey' => $stripePublishableKey,
    'formSelector' => '[data-event-payment-form]',
    'cardholderFallback' => $booking->user_name,
    'billingEmail' => $booking->user_email,
    'billingPhone' => $booking->user_phone,
    'submitLabelText' => __('Complete Order & Pay'),
    'scriptsStack' => 'payment_scripts',
])
