@extends('frontend._layouts._app')

@section('title', 'Checkout | ' . $event->title) 
@section('icon_class', 'bi-shield-lock') 
@section('active_page', 'events') 
@section('body_class', 'has-body-glow')

@section('content')
<x-frontend.page-shell variant="event-booking" narrow>

        <header class="row mb-3 mb-lg-5"> 
            <div class="col-12">
                <div class="d-flex flex-column flex-lg-row justify-content-between align-items-center text-center text-lg-start gap-3">
                    <div class="header-group">

            <div class="d-flex align-items-center">
                <div class="bg-primary-theme text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 45px; height: 45px;">
                    <i class="bi bi-cart-check fs-4"></i>
                </div>
                <div>
                    <h2 class="fw-800 mb-0">Secure Checkout</h2>
                    <p class="text-muted mb-0 small text-uppercase tracking-wider fw-bold">Step 2 of 2: Finalize Your Booking</p>
                </div>
            </div>





                    </div>
                        <div class="results-count">
                            <span class="badge bg-white text-dark border shadow-sm px-3 py-2 rounded-pill">
                                <i class="bi bi-check-circle-fill text-primary me-1"></i>
                                {{ __('Beautiful placeholder text') }}
                            </span>
                        </div>
                </div>
            </div>
        </header>


    <div class="row pt-4 g-4 justify-content-center">
        <div class="col-12">
            


            


            <div class="row g-4">
                
                {{-- 2. Checkout Form Column (8/12) --}}
                <div class="col-lg-8">
                    @include('frontend._partials._alerts')

                    {{-- Attendee Information --}}
                    <div class="card glass-surface border-0 p-4 p-lg-5 mb-4">
                        <div class="d-flex align-items-center mb-4">
                            <span class="badge bg-primary-light text-primary-color rounded-pill me-2">1</span>
                            <h4 class="fw-bold mb-0 text-dark">Attendee Information</h4>
                        </div>
                        
                            @include('frontend.events.booking._partials._attendee_form', ['booking' => $booking])
                    </div>

                    {{-- Payment Details --}}
                    <div class="card glass-surface border-0 p-4 p-lg-5">
                        <div class="d-flex align-items-center mb-4">
                            <span class="badge bg-primary-light text-primary-color rounded-pill me-2">2</span>
                            <h4 class="fw-bold mb-0 text-dark">Payment Method</h4>
                        </div>
                        
                        {{-- Payment Logic (Partial for Stripe/PayPal/Local) --}}
                        @include('frontend.events.booking._partials._payment_options', ['booking' => $booking])
                    </div>

                    <div class="mt-4 d-flex align-items-center text-muted small px-2">
                        <i class="bi bi-shield-fill-check text-success fs-4 me-2"></i>
                        <span>Your transaction is protected by 256-bit SSL encryption. We never store your full card details.</span>
                    </div>
                </div>

                {{-- 3. Order Summary Column (4/12) --}}
                <div class="col-lg-4">
                    <div class="ticket-sidebar">
                        <div class="card glass-surface border-0 overflow-hidden">
                            <div class="p-4 border-bottom bg-primary-light bg-opacity-50">
                                <h5 class="fw-bold mb-0 text-dark">Order Summary</h5>
                            </div>
                            
                            <div class="p-4">
                                {{-- Mini Event Info --}}
                                <div class="d-flex gap-3 mb-4">
                                    <img src="{{ $event->primary_image_url }}" class="rounded-3 shadow-sm" style="width: 70px; height: 70px; object-fit: cover;">
                                    <div>
                                        <h6 class="fw-bold mb-1 text-dark">{{ Str::limit($event->title, 40) }}</h6>
                                        <span class="smaller text-muted d-block">
                                            <i class="bi bi-calendar-event me-1"></i> {{ $event->start_date_time->format('M j, Y') }}
                                        </span>
                                    </div>
                                </div>

                                {{-- Summary Partial (The Receipt Style) --}}
                                @include('frontend.events.booking._partials._order_summary', ['booking' => $booking])
                                
                                <div class="mt-4 border-top pt-3">
                                    <div class="form-check small">
                                        <input class="form-check-input" type="checkbox" id="termsCheck" required>
                                        <label class="form-check-label text-muted" for="termsCheck">
                                            I agree to the <a href="#" class="text-primary-color fw-bold">Terms & Conditions</a> and <a href="#" class="text-primary-color fw-bold">Refund Policy</a>.
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {{-- Trust Badges --}}
                        <div class="mt-3 text-center opacity-75">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" height="25" class="grayscale mx-2" alt="Stripe">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" height="20" class="grayscale mx-2" alt="PayPal">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection

@section('head_extra')

@stack('payment_scripts')
@endsection
