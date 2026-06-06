@extends('frontend._layouts._app')

@section('title', __('Secure Checkout') . ' | ' . __('Step 2 of 3'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="event-booking">
    @include('frontend.events.booking._partials._booking-header', [
        'eyebrow' => __('Secure Checkout'),
        'title' => __('Event Booking'),
        'step' => 2,
        'subtitle' => __('Review attendee details, confirm your tickets, and complete payment below.'),
        'event' => $event,
        'backUrl' => route('events.show', $event->slug),
        'backLabel' => __('Back to event'),
    ])

    @include('frontend.events.booking._partials._booking-stepper', ['step' => 2])

    <div class="row g-4 booking-layout">
        <div class="col-lg-7 booking-layout__main">
            <div class="glass-surface p-4 p-md-5 mb-4 border-0">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-800 tracking-tight text-dark mb-0">
                        <i class="bi bi-person-vcard text-primary-color me-2"></i>{{ __('Attendee Details') }}
                    </h4>
                    <span class="badge bg-light-primary text-primary-color rounded-pill px-3 py-2 fw-600">
                        {{ $booking->quantity }} {{ __('ticket') }}{{ $booking->quantity > 1 ? 's' : '' }}
                    </span>
                </div>

                @include('frontend.events.booking._partials._attendee_form', ['booking' => $booking])
            </div>

            <div class="glass-surface p-4 p-md-5 border-0">
                <h4 class="fw-800 tracking-tight mb-4 text-dark">
                    <i class="bi bi-credit-card-2-front text-primary-color me-2"></i>{{ __('Payment Method') }}
                </h4>

                @include('frontend.events.booking._partials._payment_options', [
                    'booking' => $booking,
                    'stripePublishableKey' => $stripePublishableKey ?? null,
                ])
            </div>

            <div class="mt-4 d-flex align-items-center text-muted small px-2">
                <i class="bi bi-shield-fill-check text-success fs-4 me-2"></i>
                <span>{{ __('Your transaction is protected by 256-bit SSL encryption. We never store your full card details.') }}</span>
            </div>
        </div>

        <div class="col-lg-5 booking-layout__aside">
            <aside class="sticky-sidebar">
                <div class="glass-surface p-4 p-md-5 border-0 shadow-deep position-relative overflow-hidden">
                    <div class="price-glow-effect"></div>

                    <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Order Summary') }}</h4>

                    <div class="d-flex gap-3 mb-4 pb-4 border-bottom border-color-light">
                        <img src="{{ $event->primary_image_url }}"
                             class="rounded-3 shadow-sm"
                             width="72"
                             height="72"
                             style="object-fit:cover"
                             alt="{{ $event->title }}">
                        <div class="min-w-0">
                            <h6 class="fw-bold mb-1 text-dark text-truncate">{{ $event->title }}</h6>
                            <span class="small text-muted d-block">
                                <i class="bi bi-calendar-event me-1"></i>
                                {{ $booking->occurrence->start_date_time->format('M j, Y · h:i A') }}
                            </span>
                        </div>
                    </div>

                    @include('frontend.events.booking._partials._order_summary', ['booking' => $booking])

                    <div class="mt-4 border-top pt-3">
                        <div class="form-check small">
                            <input class="form-check-input" type="checkbox" id="termsCheck" form="payment-form" required>
                            <label class="form-check-label text-muted" for="termsCheck">
                                {{ __('I agree to the') }}
                                <a href="#" class="text-primary-color fw-bold">{{ __('Terms & Conditions') }}</a>
                                {{ __('and') }}
                                <a href="#" class="text-primary-color fw-bold">{{ __('Refund Policy') }}</a>.
                            </label>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</x-frontend.page-shell>
@endsection

@section('head_extra')
@stack('payment_scripts')
@endsection
