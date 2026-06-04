@extends('frontend._layouts._app')

@section('title', __('Booking Confirmation') . ' | ' . __('Step 3 of 3'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="property-booking">
    @php
        $confirmationSubtitle = null;

        if (session('success') || session('warning') || session('error')) {
            $alertClass = session('error') ? 'alert-danger' : (session('warning') ? 'alert-warning' : 'bg-primary-light text-primary-color border-primary-light');
            $confirmationSubtitle = '<div class="d-flex justify-content-center"><div class="alert ' . e($alertClass) . ' px-4 py-2 rounded-pill small fw-800">' . e(session('success') ?? session('warning') ?? session('error')) . '</div></div>';
        } elseif (! $isPaid) {
            $confirmationSubtitle = '<p class="text-muted mb-0 fs-6 mx-auto" style="max-width: 600px;">' . e(__('Your reservation is registered, but not yet secured.')) . '</p>';
        } else {
            $confirmationSubtitle = '<p class="text-muted mb-0 fs-6 mx-auto" style="max-width: 600px;">' . e(__('Pack your bags! Your trip is officially on the calendar.')) . '</p>';
        }
    @endphp

    @include('frontend.properties.booking._partials._booking-header', [
        'eyebrow' => __('Vacation Booking'),
        'title' => __('Booking Confirmation'),
        'step' => 3,
        'subtitleHtml' => $confirmationSubtitle,
    ])

    @include('frontend.properties.booking._partials._booking-stepper', [
        'step' => 3,
        'confirmIcon' => $isPaid ? 'bi-star-fill' : 'bi-hourglass-split',
        'confirmLabelClass' => $statusColorClass,
    ])

    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-11 col-lg-12">
            <div class="glass-surface p-0 overflow-hidden border-0 shadow-deep">
                <div class="row g-0">

                    {{-- Left Column: Status & Primary Actions --}}
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-4 p-lg-5 border-end border-color-light bg-white bg-opacity-50">
                        <div class="mb-4">
                            <i class="bi {{ $statusIcon }} {{ $statusColorClass }}" style="font-size: 5rem; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.05));"></i>
                        </div>

                        <h2 class="fw-800 {{ $statusColorClass }} mb-3 tracking-tight">{{ $statusText }}</h2>

                        <p class="text-dark px-lg-4 mb-2 fs-5">
                            {{ $isPaid ? __('Congratulations,') : __('Almost there,') }} <strong>{{ $booking->full_name }}</strong>!
                        </p>
                        <p class="small text-muted mb-4 uppercase tracking-widest fw-700">
                            {{ __('Booking ID') }}: <span class="text-dark">#{{ $booking->id }}</span>
                        </p>

                        <div class="d-grid gap-3 px-lg-4 mt-2">
                            @if ($isPaid)
                                <a href="{{ $buyerBookingsUrl }}" class="btn btn-lg btn-primary-theme py-3 fw-800 rounded-pill shadow-deep">
                                    {{ __('View My Itinerary') }} <i class="bi bi-calendar3 ms-2"></i>
                                </a>
                            @else
                                <a href="{{ route('property.booking.payment', ['property' => $property->slug, 'booking' => $booking->id]) }}" class="btn btn-lg btn-warning py-3 fw-800 rounded-pill shadow-deep">
                                    {{ __('Complete Payment') }} — {{ format_currency($booking->total_price) }} <i class="bi bi-credit-card ms-2"></i>
                                </a>
                            @endif

                            <a href="{{ $buyerBookingsUrl }}" class="btn btn-link text-decoration-none text-muted small fw-800 uppercase tracking-wider">
                                <i class="bi bi-arrow-left me-2"></i>{{ __('Back to Dashboard') }}
                            </a>
                        </div>
                    </div>

                    {{-- Right Column: Reservation Summary --}}
                    <div class="col-md-6 p-4 p-lg-5">
                        <span class="metric-label mb-4">{{ __('Stay Summary') }}</span>

                        <div class="booking-receipt">
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Property') }}</span>
                                <span class="fw-800 text-dark text-end">{{ $property->title }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Check-in') }}</span>
                                <span class="fw-800 text-dark">{{ $booking->check_in_date->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Check-out') }}</span>
                                <span class="fw-800 text-dark">{{ $booking->check_out_date->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Duration') }}</span>
                                <span class="fw-800 text-dark">{{ $nights }} {{ Str::plural(__('Night'), $nights) }}</span>
                            </div>
                            <div class="receipt-row py-3 mb-2">
                                <span class="text-muted fw-600 small">{{ __('Guests') }}</span>
                                <span class="fw-800 text-dark">{{ $booking->guests }} {{ Str::plural(__('Guest'), $booking->guests) }}</span>
                            </div>

                            <div class="receipt-total pt-4 border-top border-2 border-color-light">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-800 text-muted uppercase small tracking-wider">{{ __('Total Paid') }}</span>
                                    <h2 class="fw-800 {{ $statusColorClass }} mb-0">{{ format_currency($booking->total_price) }}</h2>
                                </div>
                            </div>
                        </div>

                        {{-- Host Assistance --}}
                        <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                            <div class="d-flex align-items-center gap-3">
                                <div class="host-avatar bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 48px; height: 48px; border: 2px solid white;">
                                    <i class="bi bi-person-fill text-primary-color fs-4"></i>
                                </div>
                                <div class="text-start">
                                    <h6 class="fw-800 mb-0 text-dark">{{ __('Need help?') }}</h6>
                                    <p class="small text-muted mb-0">{{ __('Message your host,') }} {{ $property->host_name ?? $property->user->name }}</p>
                                </div>
                            </div>
                            <a href="{{ route('conversation.start', ['user' => $property->user]) }}" class="btn btn-white btn-sm fw-800 shadow-sm w-100 mt-3 border rounded-pill py-2">
                                {{ __('Contact Host') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
