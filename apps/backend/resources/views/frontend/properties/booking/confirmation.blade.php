@extends('frontend._layouts._app')

@section('title', __('Booking Confirmation'))
@section('body_class', 'has-body-glow')

@php
    $backUrl   = $isPaid
        ? route('properties.show', $property->slug)
        : route('property.booking.payment', ['property' => $property->slug, 'booking' => $booking->id]);
    $backLabel = $isPaid ? __('Back to property') : __('Back to payment');
@endphp

@section('content')
<x-frontend.page-shell variant="property-booking">

    {{-- ── Confirmation hero strip (full-width dark) ───────────────── --}}
    <div class="booking-hero">
        <div class="booking-hero__inner text-center">

            <a href="{{ $backUrl }}" class="booking-hero__nav-link mb-4 d-inline-flex">
                <i class="bi bi-arrow-left-short fs-5"></i>{{ $backLabel }}
            </a>

            <div class="booking-hero__confirm-icon booking-hero__confirm-icon--{{ $isPaid ? 'success' : 'pending' }} mb-3 mx-auto">
                <i class="bi {{ $isPaid ? 'bi-check-circle-fill' : 'bi-hourglass-split' }}"></i>
            </div>

            <p class="small fw-semibold text-uppercase mb-2"
               style="letter-spacing:.08em;color:{{ $isPaid ? '#4ade80' : '#fbbf24' }}">
                {{ $isPaid ? __('Booking Confirmed') : __('Pending Payment') }}
            </p>

            <h1 class="fw-800 tracking-tight mb-2"
                style="font-family:var(--font-heading);font-size:clamp(1.75rem,3.5vw,2.75rem);color:#fff;letter-spacing:-0.03em">
                {{ $statusText }}
            </h1>

            <p class="booking-hero__subtitle mx-auto">
                {{ $isPaid
                    ? __('Pack your bags, :name! Your trip to :property is on the calendar.', ['name' => $booking->full_name, 'property' => $property->title])
                    : __('Your reservation is saved, :name. Complete payment to secure these dates.', ['name' => $booking->full_name])
                }}
            </p>

            <div class="booking-confirmation-ref d-inline-flex align-items-center gap-2 mt-4">
                <i class="bi bi-hash"></i>
                <span>{{ __('Booking ID') }}: <strong>#{{ $booking->id }}</strong></span>
            </div>

        </div>
    </div>

    {{-- ── Stepper at step 3 ───────────────────────────────────────── --}}
    <div class="mt-4 mt-lg-5">
        @include('frontend.properties.booking._partials._booking-stepper', [
            'step'             => 3,
            'confirmIcon'      => $isPaid ? 'bi-check-lg' : 'bi-hourglass-split',
            'confirmLabelClass'=> 'stepper-label-active',
        ])
    </div>

    {{-- ── Receipt card ────────────────────────────────────────────── --}}
    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-10 col-lg-11">
            <div class="bg-white border rounded-4 overflow-hidden">
                <div class="row g-0">

                    {{-- Left: Stay summary ──────────────────────────── --}}
                    <div class="col-md-7 p-4 p-lg-5 border-end border-color-light">

                        <div class="d-flex align-items-center gap-3 mb-4 pb-4 border-bottom border-color-light">
                            <img src="{{ $property->primary_image_url }}"
                                 class="rounded-3 shadow-sm object-fit-cover flex-shrink-0"
                                 width="64" height="64" alt="{{ $property->title }}">
                            <div class="min-w-0">
                                <span class="metric-label d-block mb-1">{{ __('Reserved Property') }}</span>
                                <h6 class="fw-800 text-dark mb-0 text-truncate">{{ $property->title }}</h6>
                                <p class="small text-muted mb-0">
                                    <i class="bi bi-geo-alt-fill me-1" style="color:var(--primary-color)"></i>
                                    {{ $property->location->title ?? $property->city ?? '' }}
                                </p>
                            </div>
                        </div>

                        <span class="metric-label d-block mb-3">{{ __('Stay Summary') }}</span>

                        <div class="booking-receipt">
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
                            <div class="receipt-row py-3">
                                <span class="text-muted fw-600 small">{{ __('Guests') }}</span>
                                <span class="fw-800 text-dark">{{ $booking->guests }} {{ Str::plural(__('Guest'), $booking->guests) }}</span>
                            </div>
                        </div>

                        <div class="receipt-total pt-4 border-top border-2 border-color-light">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-800 text-muted text-uppercase small tracking-wider">
                                    {{ $isPaid ? __('Total Paid') : __('Total Due') }}
                                </span>
                                <h2 class="fw-800 mb-0" style="color:var(--primary-color)">
                                    {{ format_currency($booking->total_price) }}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {{-- Right: Actions + Contact host ───────────────── --}}
                    <div class="col-md-5 p-4 p-lg-5 d-flex flex-column">

                        <span class="metric-label d-block mb-4">{{ __('Next Steps') }}</span>

                        <div class="d-grid gap-3 mb-auto">
                            @if($isPaid)
                                <a href="{{ $buyerBookingsUrl }}" class="btn btn-primary btn-header-cta py-3">
                                    <i class="bi bi-calendar3 me-2"></i>{{ __('View My Itinerary') }}<i class="bi bi-arrow-right ms-2"></i>
                                </a>
                            @else
                                <a href="{{ route('property.booking.payment', ['property' => $property->slug, 'booking' => $booking->id]) }}"
                                   class="btn btn-primary btn-header-cta py-3">
                                    <i class="bi bi-credit-card me-2"></i>{{ __('Complete Payment') }} — {{ format_currency($booking->total_price) }}<i class="bi bi-arrow-right ms-2"></i>
                                </a>
                            @endif
                            <a href="{{ route('dashboard') }}" class="btn btn-outline-secondary fw-semibold py-2">
                                <i class="bi bi-grid me-2"></i>{{ __('My Dashboard') }}
                            </a>
                        </div>

                        <div class="mt-5 p-4 rounded-4" style="background:rgba(var(--primary-color-rgb),.05);border:1.5px solid rgba(var(--primary-color-rgb),.12)">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <img src="{{ $property->user->avatar_url ?? 'https://ui-avatars.com/api/?name='.urlencode($property->user->name).'&background=E05F2C&color=fff&size=48&bold=true' }}"
                                     class="rounded-circle shadow-sm object-fit-cover flex-shrink-0"
                                     width="44" height="44" alt="{{ $property->user->name }}">
                                <div>
                                    <h6 class="fw-800 mb-0 text-dark">{{ __('Your Host') }}</h6>
                                    <p class="small text-muted mb-0">{{ $property->host_name ?? $property->user->name }}</p>
                                </div>
                            </div>
                            <a href="{{ route('conversation.start', ['user' => $property->user->username]) }}"
                               class="btn btn-outline-secondary btn-sm fw-semibold w-100 rounded-2 py-2">
                                <i class="bi bi-chat-dots me-1"></i>{{ __('Contact Host') }}
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>

</x-frontend.page-shell>
@endsection
