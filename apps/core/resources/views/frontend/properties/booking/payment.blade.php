@extends('frontend._layouts._app')

@section('title', __('Payment') . ' | ' . __('Step 2 of 3')) 
@section('body_class', 'has-body-glow')

@php
    $nights = $booking->duration_nights;
    $totalPrice = $booking->formatted_total;
    
    // Financial Breakdown
    $rentalFee = number_format($booking->base_rental_amount, 2);
    $addOnsFee = number_format($booking->addons_total_price, 2); 
    $fees      = number_format($booking->fees_and_taxes_amount, 2);

    // Filter Add-on lines for display
    $addonLines = $booking->transactionLines()
        ->where('description', 'LIKE', 'Add-on:%')
        ->get();
@endphp

@section('content')
<div class="page-content-wrapper py-4 py-lg-5">
    {{-- 1. Header Section --}}
    <div class="page-title-section mb-4 mb-lg-5 text-center">
        <span class="metric-label mx-auto">{{ __('Finalize Reservation') }}</span>
        <h1 class="fw-800 mb-2 tracking-tight text-dark display-6">
            {{ __('Secure Payment') }}: <span class="text-primary-color">{{ __('Step 2 of 3') }}</span>
        </h1>
        <p class="text-muted mb-0 fs-6 mx-auto" style="max-width: 600px;">
            {{ __('Please review your booking summary and provide your payment details below.') }}
        </p>
    </div>

    {{-- 2. Stepper --}}
    <div class="stepper mx-auto mb-5" style="max-width: 750px;">
        <div class="step done">
            <div class="step-icon">
                <i class="bi bi-check-lg text-white"></i>
            </div>
            <div class="step-label fw-bold text-success uppercase tracking-wider small">{{ __('Details') }}</div>
        </div>
        <div class="step active">
            <div class="step-icon shadow-sm">2</div>
            <div class="step-label fw-800 text-primary-color uppercase tracking-wider small">{{ __('Payment') }}</div>
        </div>
        <div class="step">
            <div class="step-icon">3</div>
            <div class="step-label fw-bold text-muted uppercase tracking-wider small">{{ __('Confirm') }}</div>
        </div>
    </div>

    <div class="row g-4">
        @include('frontend._partials._alerts')
        
        <div class="col-lg-7">
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
            <div class="glass-surface p-4 p-md-5 border-0 shadow-deep">
                <div class="alert bg-primary-light border-0 mb-5 d-flex align-items-center">
                    <div class="spinner-grow spinner-grow-sm text-primary-color me-3" role="status"></div>
                    <span class="small fw-800 text-primary-color uppercase tracking-wider">
                        {{ __('Secure Checkout: Finalize your reservation') }}
                    </span>
                </div>

                <h4 class="fw-800 tracking-tight text-dark mb-4">
                    <i class="bi bi-shield-lock-fill text-primary-color me-2"></i>{{ __('Payment Details') }}
                </h4>

                <form action="{{ route('property.booking.processPayment', $booking) }}" method="POST">
                    @csrf 
                    <div class="row g-4">
                        {{-- 11.2 Unified Container for Card Number --}}
                        <div class="col-12 text-start">
                            <label for="card_number" class="filter-label mb-2">{{ __('Credit Card Number') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text">
                                    <i class="bi bi-credit-card-2-front"></i>
                                </span>
                                <input type="text" id="card_number" name="card_number" class="form-control" placeholder="0000 0000 0000 0000" required>
                            </div>
                        </div>

                        {{-- Unified Holder Name --}}
                        <div class="col-md-6 text-start">
                            <label for="name_on_card" class="filter-label mb-2">{{ __('Cardholder Name') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-person"></i></span>
                                <input type="text" id="name_on_card" name="name_on_card" class="form-control" placeholder="JOHN DOE" required style="text-transform: uppercase;">
                            </div>
                        </div>

                        {{-- Expiry --}}
                        <div class="col-6 col-md-3 text-start">
                            <label for="mm_yy" class="filter-label mb-2">{{ __('Expiry') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-calendar-event"></i></span>
                                <input type="text" id="mm_yy" name="mm_yy" class="form-control text-center" placeholder="MM/YY" required>
                            </div>
                        </div>

                        {{-- CVC --}}
                        <div class="col-6 col-md-3 text-start">
                            <label for="cvc" class="filter-label mb-2">{{ __('CVC') }}</label>
                            <div class="input-group unified-input">
                                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                                <input type="text" id="cvc" name="cvc" class="form-control text-center" placeholder="123" required>
                            </div>
                        </div>

                        <div class="col-12 mt-4 text-start">
                            <div class="form-check p-3 bg-light-primary border border-primary-light rounded-4 d-flex align-items-start">
                                <input class="form-check-input ms-0 me-3 mt-1" type="checkbox" name="termsCheck" value="1" id="termsCheck" required>
                                <label class="form-check-label small text-dark fw-600" for="termsCheck">
                                    {{ __('I authorize the charge of') }} <span class="text-primary-color">${{ $totalPrice }}</span> {{ __('and agree to the') }} 
                                    <a href="#" class="text-primary-color text-decoration-underline">{{ __('House Rules') }}</a>.
                                </label>
                            </div>
                        </div>

                        <div class="col-12 d-grid mt-4">
                            <button type="submit" class="btn btn-lg btn-primary-theme py-3 fw-800 rounded-pill shadow-deep">
                                {{ __('Complete Payment') }} — ${{ $totalPrice }}
                            </button>
                            
                            <div class="d-flex justify-content-center align-items-center gap-3 mt-4">
                                <span class="small text-muted fw-600 border-end pe-3 border-color-light">
                                    <i class="bi bi-lock-fill text-success me-1"></i>256-bit Encryption
                                </span>
                                <div class="payment-logos d-flex gap-2 opacity-50" style="filter: grayscale(1);">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" height="10" alt="Visa">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" height="12" alt="Mastercard">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="12" alt="Paypal">
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        {{-- Right Column: Summary --}}
        <div class="col-lg-5">
            <aside class="sticky-sidebar">
                <div class="glass-surface p-4 p-md-5 border-0 shadow-deep position-relative overflow-hidden">
                    <div class="price-glow-effect"></div>
                    
                    <h4 class="fw-800 tracking-tight mb-4 text-dark">{{ __('Price Breakdown') }}</h4>
                    
                    <div class="pricing-list mb-4">
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Base Rental') }} ({{ $nights }} {{ __('nights') }})</span>
                            <span class="fw-800 text-dark small">${{ $rentalFee }}</span>
                        </div>
                        
                        @if($addOnsFee > 0)
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Experience Add-ons') }}</span>
                            <span class="fw-800 text-primary-color small">+ ${{ $addOnsFee }}</span>
                        </div>
                        @endif

                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted small fw-600">{{ __('Taxes & Service Fees') }}</span>
                            <span class="fw-800 text-dark small">+ ${{ $fees }}</span>
                        </div>
                    </div>

                    <hr class="my-4 border-color-light">

                    <div class="bg-white bg-opacity-50 p-4 rounded-4 text-center border border-primary-light backdrop-blur">
                        <p class="filter-label mb-1">{{ __('Total Amount Due') }}</p>
                        <h2 class="price-text-large mb-0 line-height-1 text-primary-color">${{ $totalPrice }}</h2>
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
</div>
@endsection
