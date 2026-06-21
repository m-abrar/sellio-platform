@extends('frontend._layouts._app')

@section('title', __('Booking Confirmation'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="property-booking">
    @include('frontend.properties.booking._partials._booking-header', [
        'property' => $property,
        'showContext' => false,
        'showTitle' => false,
        'backUrl' => $isPaid ? route('properties.show', $property->slug) : route('property.booking.payment', ['property' => $property->slug, 'booking' => $booking->id]),
        'backLabel' => $isPaid ? __('Back to property') : __('Back to payment'),
    ])

    @include('frontend._partials._alerts')

    @include('frontend._partials._checkout_success_hero', [
        'eyebrow' => $isPaid ? __('All Set') : __('Almost There'),
        'title' => $statusText,
        'message' => $isPaid
            ? __('Pack your bags, :name! Your trip to :property is on the calendar.', ['name' => $booking->full_name, 'property' => $property->title])
            : __('Your reservation is saved, :name. Complete payment to secure these dates.', ['name' => $booking->full_name]),
        'icon' => $isPaid ? 'bi-balloon-heart-fill' : 'bi-hourglass-split',
        'tone' => $isPaid ? 'success' : 'pending',
        'reference' => $booking->id,
        'referenceLabel' => __('Booking ID'),
    ])

    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-11 col-lg-12">
            <div class="bg-white border rounded-4 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-4 p-lg-5 border-end border-color-light bg-white bg-opacity-50">
                        <div class="d-grid gap-3 px-lg-4">
                            @if ($isPaid)
                                <a href="{{ $buyerBookingsUrl }}" class="btn btn-lg btn-primary py-3">
                                    {{ __('View My Itinerary') }} <i class="bi bi-calendar3 ms-2"></i>
                                </a>
                            @else
                                <a href="{{ route('property.booking.payment', ['property' => $property->slug, 'booking' => $booking->id]) }}" class="btn btn-lg btn-warning py-3">
                                    {{ __('Complete Payment') }} &mdash; {{ format_currency($booking->total_price) }} <i class="bi bi-credit-card ms-2"></i>
                                </a>
                            @endif

                            <a href="{{ $buyerBookingsUrl }}" class="btn btn-link text-decoration-none text-muted small fw-800 uppercase tracking-wider">
                                <i class="bi bi-arrow-left me-2"></i>{{ __('Back to Dashboard') }}
                            </a>
                        </div>
                    </div>

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
                                    <span class="fw-800 text-muted uppercase small tracking-wider">{{ $isPaid ? __('Total Paid') : __('Total Due') }}</span>
                                    <h2 class="fw-800 {{ $statusColorClass }} mb-0">{{ format_currency($booking->total_price) }}</h2>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                            <div class="d-flex align-items-center gap-3">
                                <div class="booking-help-avatar host-avatar bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm">
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
