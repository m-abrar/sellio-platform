@extends('frontend._layouts._app')

@php
    $taxRate = 0.05;
    $finalTotal = round($booking->total_price * (1 + $taxRate), 2);
@endphp

@section('title', __('Secure Checkout') . ' | ' . __('Step 2 of 3'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="event-booking">
    @include('frontend.events.booking._partials._booking-header', [
        'eyebrow' => __('Finalize Reservation'),
        'title' => __('Secure Payment'),
        'step' => 2,
        'subtitle' => __('Review your tickets, confirm attendee details, and complete payment below.'),
        'event' => $event,
        'showContext' => false,
        'backUrl' => route('events.show', $event->slug),
        'backLabel' => __('Back to event'),
    ])

    @include('frontend.events.booking._partials._booking-stepper', ['step' => 2])

    <div class="row g-4 booking-layout">
        <div class="col-lg-7 booking-layout__main">
            <div class="bg-white border rounded-4 p-4 p-md-5 mb-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-800 tracking-tight text-dark mb-0">
                        <i class="bi bi-file-earmark-text me-2" style="color:var(--primary-color)"></i>{{ __('Review Booking') }}
                    </h4>
                    <span class="fw-semibold px-3 py-2 rounded-2 small" style="background:rgba(var(--primary-color-rgb),.1);color:var(--primary-color)">
                        {{ $booking->quantity }} {{ __('ticket') }}{{ $booking->quantity > 1 ? 's' : '' }}
                    </span>
                </div>

                <div class="row g-4 text-start">
                    <div class="col-md-6">
                        <span class="metric-label">{{ __('Event Date') }}</span>
                        <p class="fw-800 mb-0 text-dark fs-5">
                            {{ $booking->occurrence->start_date_time->format('M j, Y') }}
                        </p>
                        <p class="small text-muted mb-0">{{ $booking->occurrence->start_date_time->format('h:i A') }}</p>
                    </div>
                    <div class="col-md-6 border-start-md ps-md-4 border-color-light">
                        <span class="metric-label">{{ __('Ticket Type') }}</span>
                        <p class="fw-800 mb-0 text-dark">{{ $booking->ticketType->title }}</p>
                        <p class="small text-muted mb-0">{{ __('Quantity') }}: {{ $booking->quantity }}</p>
                    </div>
                    <div class="col-12 pt-3 border-top border-color-light">
                        <span class="metric-label">{{ __('Primary Contact') }}</span>
                        <p class="fw-800 mb-0 text-dark">{{ $booking->user_name }}</p>
                        <p class="small text-muted mb-0">{{ $booking->user_email }}</p>
                    </div>
                </div>
            </div>

            <div class="bg-white border rounded-4 p-4 p-md-5 mb-4">
                <h4 class="fw-800 tracking-tight mb-4 text-dark">
                    <i class="bi bi-person-vcard me-2" style="color:var(--primary-color)"></i>{{ __('Attendee Details') }}
                </h4>

                @include('frontend.events.booking._partials._attendee_form', ['booking' => $booking])
            </div>

            @include('frontend.events.booking._partials._payment_options', [
                'booking' => $booking,
                'stripePublishableKey' => $stripePublishableKey ?? null,
            ])
        </div>

        <div class="col-lg-5 booking-layout__aside">
            <aside class="sticky-sidebar">
                <div class="bg-white border rounded-4 p-4 p-md-5 position-relative overflow-hidden">
                    <div class="price-glow-effect"></div>

                    <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Price Breakdown') }}</h4>

                    <div class="d-flex align-items-center mb-4 border-bottom border-color-light pb-4">
                        <img src="{{ $event->primary_image_url }}" class="booking-summary-thumb rounded-4 me-3 shadow-sm" alt="{{ $event->title }}">
                        <div class="overflow-hidden">
                            <span class="metric-label">{{ __('Reserved Event') }}</span>
                            <h6 class="fw-800 mb-0 text-truncate text-dark">{{ $event->title }}</h6>
                            <p class="small text-muted mb-0">
                                <i class="bi bi-calendar-event me-1" style="color:var(--primary-color)"></i>
                                {{ $booking->occurrence->start_date_time->format('M j, Y · h:i A') }}
                            </p>
                        </div>
                    </div>

                    @include('frontend.events.booking._partials._order_summary', ['booking' => $booking])

                    <div class="mt-4 p-3 rounded-4 text-center" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.12)">
                        <p class="small text-muted mb-0">
                            <i class="bi bi-info-circle me-1" style="color:var(--primary-color)"></i>
                            {{ __('Your digital tickets will be emailed immediately after payment.') }}
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</x-frontend.page-shell>
@endsection

@push('scripts')
@stack('payment_scripts')
@endpush
