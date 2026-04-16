@extends('frontend._layouts._app')

@section('title', 'Booking Confirmed | ' . $booking->event->title) 
@section('body_class', 'has-body-glow')

@section('content')
<main class="container-xl page-wrapper pb-5">
    <div class="row pt-4 g-4 justify-content-center">
        <div class="col-lg-10 col-xl-8">
            
            {{-- 1. Hero Confirmation Section --}}
            <div class="glass-surface p-5 text-center mb-5 border-0 shadow-lg position-relative overflow-hidden">
                {{-- Decorative background icon --}}
                <i class="bi bi-patch-check-fill position-absolute text-success opacity-10" style="font-size: 15rem; right: -2rem; top: -2rem;"></i>
                
                <div class="position-relative z-1">
                    <div class="success-icon-wrapper mb-4">
                        <i class="bi bi-check-lg display-1 text-success"></i>
                    </div>
                    <h1 class="fw-800 display-5 text-dark mb-3">Booking Confirmed!</h1>
                    <p class="lead text-muted mb-4 px-lg-5">
                        Success! **{{ $booking->user_name }}**, your spot at the event is secured. 
                        We've sent your digital tickets to **{{ $booking->user_email }}**.
                    </p>
                    
                    <div class="d-flex justify-content-center gap-3">
                        <a href="#" class="btn btn-primary-theme px-4 py-2 fw-bold shadow-sm">
                            <i class="bi bi-download me-2"></i> Download PDF
                        </a>
                        <button onclick="window.print()" class="btn btn-outline-secondary px-4 py-2 fw-bold">
                            <i class="bi bi-printer me-2"></i> Print Receipt
                        </button>
                    </div>
                </div>
            </div>

            <div class="row g-4">
                {{-- 2. Digital Receipt Column --}}
                <div class="col-md-7">
                    <div class="card glass-surface border-0 shadow-lg overflow-hidden">
                        <div class="p-4 bg-primary-light bg-opacity-50 border-bottom">
                            <h5 class="fw-bold mb-0 text-dark"><i class="bi bi-receipt me-2"></i>Booking Summary</h5>
                        </div>
                        <div class="p-4 p-lg-5">
                            <div class="booking-receipt">
                                <div class="receipt-row">
                                    <span class="label">Order ID</span>
                                    <span class="value">#{{ $booking->id }}</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="label">Event</span>
                                    <span class="value text-end">{{ $booking->event->title }}</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="label">Date</span>
                                    <span class="value">{{ $booking->occurrence->start_date_time->format('F jS, Y') }}</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="label">Time</span>
                                    <span class="value">{{ $booking->occurrence->start_date_time->format('h:i A') }}</span>
                                </div>
                                <div class="receipt-row">
                                    <span class="label">Ticket Type</span>
                                    <span class="value">{{ $booking->ticketType->title }} (x{{ $booking->quantity }})</span>
                                </div>
                                
                                <div class="receipt-total mt-4 pt-4 border-top border-dark border-opacity-10">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="h5 fw-bold mb-0 text-muted">Amount Paid</span>
                                        <span class="h3 fw-800 mb-0 text-primary-color">${{ number_format($booking->paid_amount, 2) }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-4 p-3 bg-light rounded-4 border border-dashed border-secondary border-opacity-25">
                                <div class="row small text-muted">
                                    <div class="col-6"><strong>Transaction ID:</strong><br>{{ $booking->transaction_id ?? 'N/A' }}</div>
                                    <div class="col-6 text-end"><strong>Method:</strong><br>{{ ucfirst($booking->payment_method ?? 'N/A') }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- 3. Next Steps Sidebar --}}
                <div class="col-md-5">
                    <div class="card glass-surface border-0 shadow-lg p-4">
                        <h5 class="fw-bold mb-4 text-dark">What's Next?</h5>
                        
                        <div class="d-flex gap-3 mb-4">
                            <div class="flex-shrink-0">
                                <span class="step-dot bg-primary-theme"></span>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Check Your Inbox</h6>
                                <p class="small text-muted mb-0">Your QR code ticket has been sent. Show this at the entrance.</p>
                            </div>
                        </div>

                        <div class="d-flex gap-3 mb-4">
                            <div class="flex-shrink-0">
                                <span class="step-dot bg-primary-theme"></span>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Add to Calendar</h6>
                                <p class="small text-muted mb-0">Don't forget the date! Save it to your Google or Outlook calendar.</p>
                            </div>
                        </div>

                        <div class="d-flex gap-3 mb-4">
                            <div class="flex-shrink-0">
                                <span class="step-dot bg-primary-theme"></span>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1">Manage Booking</h6>
                                <p class="small text-muted mb-0">Need to update info? Visit your <a href="{{ route('dashboard') }}" class="text-primary-color fw-bold">Dashboard</a>.</p>
                            </div>
                        </div>

                        <hr class="my-4">

                        <a href="{{ route('events.show', $booking->event->slug) }}" class="btn btn-outline-primary-theme w-100 fw-bold">
                            Return to Event Page
                        </a>
                    </div>
                    
                    {{-- Social Share --}}
                    <div class="mt-4 text-center">
                        <p class="small fw-bold text-muted mb-3">TELL YOUR FRIENDS</p>
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-light btn-sm rounded-circle shadow-sm"><i class="bi bi-facebook text-primary"></i></button>
                            <button class="btn btn-light btn-sm rounded-circle shadow-sm"><i class="bi bi-twitter-x text-dark"></i></button>
                            <button class="btn btn-light btn-sm rounded-circle shadow-sm"><i class="bi bi-linkedin text-info"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</main>
@endsection
