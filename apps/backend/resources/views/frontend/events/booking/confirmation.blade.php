@extends('frontend._layouts._app')

@section('title', __('Booking Confirmed'))
@section('body_class', 'has-body-glow')

@php $dashboardUrl = setting('url_user') ?: url('/'); @endphp

@section('content')
<x-frontend.page-shell variant="event-booking">

    {{-- ── Confirmation hero strip (full-width dark) ───────────────── --}}
    <div class="booking-hero">
        <div class="booking-hero__inner text-center">

            <a href="{{ route('events.show', $booking->event->slug) }}" class="booking-hero__nav-link mb-4 d-inline-flex">
                <i class="bi bi-arrow-left-short fs-5"></i>{{ __('Back to event') }}
            </a>

            <div class="booking-hero__confirm-icon booking-hero__confirm-icon--success mb-3 mx-auto">
                <i class="bi bi-ticket-perforated-fill"></i>
            </div>

            <p class="small fw-semibold text-uppercase mb-2" style="letter-spacing:.08em;color:#4ade80">
                {{ __('You are going!') }}
            </p>

            <h1 class="fw-800 tracking-tight mb-2"
                style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.75rem);color:#fff;letter-spacing:-0.03em">
                {{ __('Booking Confirmed!') }}
            </h1>

            <p class="booking-hero__subtitle mx-auto">
                {{ __('Congratulations, :name! Your tickets for :event are secured. We sent your confirmation to :email.', [
                    'name'  => $booking->user_name,
                    'event' => $booking->event->title,
                    'email' => $booking->user_email,
                ]) }}
            </p>

            <div class="booking-confirmation-ref d-inline-flex align-items-center gap-2 mt-4">
                <i class="bi bi-hash"></i>
                <span>{{ __('Order ID') }}: <strong>#{{ $booking->id }}</strong></span>
            </div>

        </div>
    </div>

    {{-- ── Stepper at step 3 ───────────────────────────────────────── --}}
    <div class="mt-4 mt-lg-5">
        @include('frontend.events.booking._partials._booking-stepper', [
            'step'        => 3,
            'confirmIcon' => 'bi-check-lg',
        ])
    </div>

    {{-- ── Receipt card ────────────────────────────────────────────── --}}
    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-10 col-lg-11">
            <div class="bg-white border rounded-4 overflow-hidden">
                <div class="row g-0">

                    {{-- Left: Ticket receipt ────────────────────────── --}}
                    <div class="col-md-7 p-4 p-lg-5 border-end border-color-light">

                        <div class="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom border-color-light">
                            <img src="{{ $booking->event->primary_image_url }}"
                                 class="rounded-3 shadow-sm object-fit-cover flex-shrink-0"
                                 width="64" height="64" alt="{{ $booking->event->title }}">
                            <div class="min-w-0">
                                <span class="metric-label d-block mb-1">{{ __('Reserved Event') }}</span>
                                <h6 class="fw-800 text-dark mb-0 text-truncate">{{ $booking->event->title }}</h6>
                                <p class="small text-muted mb-0">
                                    <i class="bi bi-calendar-event me-1" style="color:var(--primary-color)"></i>
                                    {{ $booking->occurrence->start_date_time->format('M j, Y · h:i A') }}
                                </p>
                            </div>
                        </div>

                        <span class="metric-label d-block mb-3">{{ __('Ticket Receipt') }}</span>

                        <div class="pricing-list mb-4">
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Date') }}</span>
                                <span class="fw-800 text-dark small">{{ $booking->occurrence->start_date_time->format('D, M j, Y') }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Time') }}</span>
                                <span class="fw-800 text-dark small">{{ $booking->occurrence->start_date_time->format('g:i A') }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Ticket') }}</span>
                                <span class="fw-800 text-dark small">{{ $booking->ticketType->title }} (×{{ $booking->quantity }})</span>
                            </div>
                        </div>

                        <div class="receipt-total pt-4 border-top border-2 border-color-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-800 text-muted text-uppercase small tracking-wider">{{ __('Amount Paid') }}</span>
                                <h2 class="fw-800 mb-0" style="color:var(--primary-color)">
                                    {{ format_currency($booking->paid_amount ?? $booking->total_price) }}
                                </h2>
                            </div>
                        </div>

                        @if(filled($booking->transaction_id) || filled($booking->payment_method))
                            <div class="mt-4 p-3 rounded-3 small text-muted" style="background:rgba(248,246,243,.8);border:1.5px solid rgba(15,23,42,.07)">
                                <div class="row g-2">
                                    @if(filled($booking->transaction_id))
                                        <div class="col-12 col-md-6">
                                            <strong>{{ __('Transaction ID') }}:</strong><br>
                                            {{ $booking->transaction_id }}
                                        </div>
                                    @endif
                                    @if(filled($booking->payment_method))
                                        <div class="col-12 col-md-6 {{ filled($booking->transaction_id) ? 'text-md-end' : '' }}">
                                            <strong>{{ __('Method') }}:</strong><br>
                                            {{ ucfirst($booking->payment_method) }}
                                        </div>
                                    @endif
                                </div>
                            </div>
                        @endif
                    </div>

                    {{-- Right: Actions ──────────────────────────────── --}}
                    <div class="col-md-5 p-4 p-lg-5 d-flex flex-column">

                        <span class="metric-label d-block mb-4">{{ __('Next Steps') }}</span>

                        <div class="d-grid gap-3 mb-auto">
                            <a href="{{ $dashboardUrl }}" class="btn btn-primary btn-header-cta py-3">
                                <i class="bi bi-grid me-2"></i>{{ __('My Dashboard') }}<i class="bi bi-arrow-right ms-2"></i>
                            </a>
                            <button type="button" onclick="window.print()" class="btn btn-outline-secondary fw-semibold py-2">
                                <i class="bi bi-printer me-2"></i>{{ __('Print Receipt') }}
                            </button>
                        </div>

                        <div class="mt-5 p-4 rounded-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.12)">
                            <p class="small fw-semibold text-dark mb-1">
                                <i class="bi bi-envelope me-1" style="color:var(--primary-color)"></i>
                                {{ __('Confirmation sent') }}
                            </p>
                            <p class="small text-muted mb-0">
                                {{ __('Your tickets were emailed to') }}
                                <strong class="text-dark">{{ $booking->user_email }}</strong>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</x-frontend.page-shell>
@endsection
