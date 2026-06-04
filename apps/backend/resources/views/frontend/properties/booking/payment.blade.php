@extends('frontend._layouts._app')

@section('title', __('Payment') . ' | ' . __('Step 2 of 3'))
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="property-booking">
    @include('frontend.properties.booking._partials._booking-header', [
        'eyebrow' => __('Finalize Reservation'),
        'title' => __('Secure Payment'),
        'step' => 2,
        'subtitle' => __('Please review your booking summary and provide your payment details below.'),
    ])

    @include('frontend.properties.booking._partials._booking-stepper', ['step' => 2])

    <div class="row g-4 booking-layout">
        <div class="col-lg-7 booking-layout__main">
            {{-- Review Details Card --}}
            <div class="glass-surface p-4 p-md-5 mb-4 border-0">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-800 tracking-tight text-dark mb-0">
                        <i class="bi bi-file-earmark-text text-primary-color me-2"></i>{{ __('Review Booking') }}
                    </h4>
                    <a href="{{ route('property.booking.checkout', [$property->slug, 'start_date' => $booking->check_in_date->toDateString(), 'end_date' => $booking->check_out_date->toDateString(), 'guests' => $booking->guests]) }}"
                       class="btn btn-sm btn-outline-primary-theme rounded-pill px-3 fw-bold">
                        <i class="bi bi-pencil-square me-1"></i>{{ __('Edit') }}
                    </a>
                </div>

                <div class="row g-4 text-start">
                    <div class="col-md-6">
                        <span class="metric-label">{{ __('Stay Period') }}</span>
                        <p class="fw-800 mb-0 text-dark fs-5">
                            {{ $booking->check_in_date->format('M j') }} — {{ $booking->check_out_date->format('M j, Y') }}
                        </p>
                        <p class="small text-muted mb-0">{{ $nights }} {{ __('Nights') }} | {{ $booking->guests }} {{ __('Guests') }}</p>
                    </div>
                    <div class="col-md-6 border-start-md ps-md-4 border-color-light">
                        <span class="metric-label">{{ __('Primary Contact') }}</span>
                        <p class="fw-800 mb-0 text-dark text-truncate">{{ $booking->full_name }}</p>
                        <p class="small text-muted mb-0">{{ $booking->email }}</p>
                    </div>

                    @if($addonLines->isNotEmpty())
                    <div class="col-12 pt-4 border-top border-color-light">
                        <span class="metric-label mb-2 d-block">{{ __('Selected Premium Add-ons') }}</span>
                        <div class="d-flex flex-wrap gap-2">
                            @foreach($addonLines as $line)
                                <span class="badge bg-light-primary text-primary-color border-0 px-3 py-2 rounded-pill fw-600">
                                    <i class="bi bi-plus-circle-fill me-1 opacity-50"></i>{{ str_replace('Add-on: ', '', $line->description) }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                    @endif
                </div>
            </div>

            {{-- Payment Form Card --}}
            @include('frontend.properties.booking._partials._payment_details', ['booking' => $booking])
        </div>

        {{-- Right Column: Summary --}}
        <div class="col-lg-5 booking-layout__aside">
            <aside class="sticky-sidebar">
                <div class="glass-surface p-4 p-md-5 border-0 shadow-deep position-relative overflow-hidden">
                    <div class="price-glow-effect"></div>

                    <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Price Breakdown') }}</h4>

                    <div class="pricing-list mb-4">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Base Rental') }} ({{ $nights }} {{ __('nights') }})</span>
                            <span class="fw-800 text-dark small">{{ format_currency($booking->base_rental_amount) }}</span>
                        </div>

                        @if($booking->addons_total_price > 0)
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Experience Add-ons') }}</span>
                            <span class="fw-800 text-primary-color small">+ {{ format_currency($booking->addons_total_price) }}</span>
                        </div>
                        @endif

                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Taxes & Service Fees') }}</span>
                            <span class="fw-800 text-dark small">+ {{ format_currency($booking->fees_and_taxes_amount) }}</span>
                        </div>
                    </div>

                    <hr class="my-4 border-color-light">

                    <div class="bg-white bg-opacity-50 p-4 rounded-4 text-center border border-primary-light backdrop-blur">
                        <p class="filter-label mb-1">{{ __('Total Amount Due') }}</p>
                        <h2 class="price-text-large mb-0 line-height-1 text-primary-color">{{ format_currency($booking->total_price) }}</h2>
                        <span class="badge bg-light-primary text-primary-color mt-3 rounded-pill px-3 py-2">
                            <i class="bi bi-shield-check me-1"></i> {{ __('Inclusive of all taxes') }}
                        </span>
                    </div>

                    <div class="mt-4">
                        <div class="p-3 bg-light-primary rounded-4 border border-primary-light text-center">
                            <p class="small text-muted mb-0">
                                <i class="bi bi-info-circle me-1 text-primary-color"></i> {{ __('Cancellations are free up to 48h before arrival.') }}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
