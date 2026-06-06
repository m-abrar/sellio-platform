@extends('frontend._layouts._app')

@section('title', __('Booking Confirmed') . ' | ' . __('Step 3 of 3'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="event-booking">
    @include('frontend.events.booking._partials._booking-header', [
        'eyebrow' => __('Booking Confirmation'),
        'title' => __('Event Booking'),
        'step' => 3,
        'subtitle' => __('Your tickets are secured. A confirmation email has been sent to your inbox.'),
        'event' => $booking->event,
        'backUrl' => route('events.show', $booking->event->slug),
        'backLabel' => __('Back to event'),
    ])

    @include('frontend.events.booking._partials._booking-stepper', [
        'step' => 3,
        'confirmIcon' => 'bi-star-fill',
        'confirmLabelClass' => 'text-success',
    ])

    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-11 col-lg-12">
            <div class="glass-surface p-0 overflow-hidden border-0 shadow-deep">
                <div class="row g-0">
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-4 p-lg-5 border-end border-color-light bg-white bg-opacity-50">
                        <div class="mb-4">
                            <i class="booking-confirmation-status-icon bi bi-patch-check-fill text-success"></i>
                        </div>

                        <h2 class="fw-800 text-success mb-3 tracking-tight">{{ __('Booking Confirmed!') }}</h2>

                        <p class="text-dark px-lg-4 mb-2 fs-5">
                            {{ __('Congratulations,') }} <strong>{{ $booking->user_name }}</strong>!
                            {{ __('Your spot at the event is secured.') }}
                        </p>
                        <p class="text-muted mb-4">
                            {{ __('We sent your digital tickets to') }} <strong>{{ $booking->user_email }}</strong>.
                        </p>

                        <div class="d-flex flex-wrap justify-content-center gap-3">
                            <button onclick="window.print()" class="btn btn-outline-primary-theme rounded-pill px-4 py-2 fw-bold">
                                <i class="bi bi-printer me-2"></i>{{ __('Print Receipt') }}
                            </button>
                            <a href="{{ route('dashboard') }}" class="btn btn-primary-theme rounded-pill px-4 py-2 fw-bold">
                                <i class="bi bi-grid me-2"></i>{{ __('Go to Dashboard') }}
                            </a>
                        </div>
                    </div>

                    <div class="col-md-6 p-4 p-lg-5">
                        <h5 class="fw-800 mb-4 text-dark">
                            <i class="bi bi-receipt text-primary-color me-2"></i>{{ __('Booking Summary') }}
                        </h5>

                        <div class="pricing-list mb-4">
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Order ID') }}</span>
                                <span class="fw-800 text-dark small">#{{ $booking->id }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Event') }}</span>
                                <span class="fw-800 text-dark small text-end">{{ $booking->event->title }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Date') }}</span>
                                <span class="fw-800 text-dark small">{{ $booking->occurrence->start_date_time->format('M j, Y') }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Ticket') }}</span>
                                <span class="fw-800 text-dark small">{{ $booking->ticketType->title }} (×{{ $booking->quantity }})</span>
                            </div>
                        </div>

                        <div class="bg-white bg-opacity-50 p-4 rounded-4 text-center border border-primary-light backdrop-blur mb-4">
                            <p class="filter-label mb-1">{{ __('Amount Paid') }}</p>
                            <h2 class="price-text-large mb-0 line-height-1 text-primary-color">
                                {{ format_currency($booking->paid_amount ?? $booking->total_price) }}
                            </h2>
                        </div>

                        <div class="p-3 bg-light rounded-4 border border-dashed border-secondary border-opacity-25 small text-muted">
                            <div class="row g-2">
                                <div class="col-6">
                                    <strong>{{ __('Transaction ID') }}:</strong><br>
                                    {{ $booking->transaction_id ?? __('N/A') }}
                                </div>
                                <div class="col-6 text-md-end">
                                    <strong>{{ __('Method') }}:</strong><br>
                                    {{ ucfirst($booking->payment_method ?? __('N/A')) }}
                                </div>
                            </div>
                        </div>

                        <a href="{{ route('events.show', $booking->event->slug) }}" class="btn btn-outline-primary-theme w-100 fw-bold rounded-pill mt-4">
                            {{ __('Return to Event Page') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
