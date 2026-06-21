@extends('frontend._layouts._app')

@section('title', __('Booking Confirmed'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="event-booking">
    @include('frontend.events.booking._partials._booking-header', [
        'event' => $booking->event,
        'showContext' => false,
        'showTitle' => false,
        'backUrl' => route('events.show', $booking->event->slug),
        'backLabel' => __('Back to event'),
    ])

    @include('frontend._partials._checkout_success_hero', [
        'eyebrow' => __('You are going!'),
        'title' => __('Booking Confirmed!'),
        'message' => __('Congratulations, :name! Your tickets for :event are secured. We sent your confirmation to :email.', [
            'name' => $booking->user_name,
            'event' => $booking->event->title,
            'email' => $booking->user_email,
        ]),
        'icon' => 'bi-ticket-perforated-fill',
        'tone' => 'success',
        'reference' => $booking->id,
        'referenceLabel' => __('Order ID'),
    ])

    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-11 col-lg-12">
            <div class="bg-white border rounded-4 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-4 p-lg-5 border-end border-color-light bg-white bg-opacity-50">
                        <div class="d-flex flex-wrap justify-content-center gap-3 px-lg-3">
                            <button type="button" onclick="window.print()" class="btn btn-outline-secondary rounded-2 px-4 py-2 fw-bold">
                                <i class="bi bi-printer me-2"></i>{{ __('Print Receipt') }}
                            </button>
                            <a href="{{ route('dashboard') }}" class="btn btn-primary rounded-2 px-4 py-2 fw-800">
                                <i class="bi bi-grid me-2"></i>{{ __('Go to Dashboard') }}
                            </a>
                        </div>
                    </div>

                    <div class="col-md-6 p-4 p-lg-5">
                        <span class="metric-label mb-4">{{ __('Ticket Receipt') }}</span>

                        <div class="pricing-list mb-4">
                            <div class="d-flex justify-content-between mb-3">
                                <span class="text-muted small fw-600">{{ __('Date') }}</span>
                                <span class="fw-800 text-dark small">{{ $booking->occurrence->start_date_time->format('M j, Y · h:i A') }}</span>
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

                        @if(filled($booking->transaction_id) || filled($booking->payment_method))
                            <div class="p-3 bg-light rounded-4 border border-dashed border-secondary border-opacity-25 small text-muted">
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
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
