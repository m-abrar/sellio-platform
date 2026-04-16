@extends('frontend._layouts._app')

@section('title', 'Inquiry Confirmation | ' . $auto->make . ' ' . $auto->model) 
@section('body_class', 'has-body-glow')

@php
    // Determine status and set display variables
    $isContacted = $inquiry->status === 'contacted' || $inquiry->status === 'resolved';
    $statusText = $isContacted ? 'Dealer Contacted!' : 'Request Sent';
    $statusColorClass = $isContacted ? 'text-success' : 'text-warning';
    $statusIcon = $isContacted ? 'bi-patch-check-fill' : 'bi-send-check-fill'; 
@endphp

@section('content')
<main class="container-xl page-wrapper pb-5">
    <div class="row pt-4 g-4">
        <div class="col-12 text-center">
            <h1 class="fw-800 display-6 mb-2">Test Drive Request</h1>
            
            <div class="d-flex justify-content-center mb-4">
                @if (session('success') || session('warning') || session('error'))
                    <div class="alert {{ session('error') ? 'alert-danger' : (session('warning') ? 'alert-warning' : 'bg-primary-light text-primary-color border-primary-light') }} px-4 py-2 rounded-pill small fw-bold">
                        {{ session('success') ?? session('warning') ?? session('error') }}
                    </div>
                @else
                    <p class="lead text-muted">Review your inquiry details for the <strong>{{ $auto->year }} {{ $auto->make }}</strong> below.</p>
                @endif
            </div>
        </div>
    </div>

    {{-- Inquiry Stepper --}}
    <div class="stepper mx-auto mb-5" style="max-width: 600px;">
        <div class="step done">
            <div class="step-icon"><i class="bi bi-check-lg"></i></div>
            <div class="step-label text-success">Details</div>
        </div>
        <div class="step {{ $isContacted ? 'done' : 'active' }}">
            <div class="step-icon">
                <i class="bi {{ $isContacted ? 'bi-person-check-fill' : 'bi-hourglass-split' }}"></i>
            </div>
            <div class="step-label fw-semibold {{ $statusColorClass }}">Confirmation</div>
        </div>
    </div>

    <div class="row justify-content-center">
        <div class="col-lg-10">
            <div class="glass-surface p-0 overflow-hidden border-0 shadow-lg">
                <div class="row g-0">
                    
                    {{-- Left Column: Status & Primary Actions --}}
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-5 border-end bg-white bg-opacity-50">
                        <div class="mb-4">
                            <i class="bi {{ $statusIcon }} {{ $statusColorClass }}" style="font-size: 5rem; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));"></i>
                        </div>
                        
                        <h2 class="fw-800 {{ $statusColorClass }} mb-3">{{ $statusText }}</h2>
                        
                        <div class="px-lg-4">
                            <p class="text-dark mb-2">
                                Thank you, <strong>{{ $inquiry->full_name }}</strong>!
                            </p>
                            <p class="text-muted small mb-4">
                                @if($isContacted)
                                    The dealer has responded to your request. Please check your messages or email for the confirmed appointment time.
                                @else
                                    Your request has been successfully delivered to the dealer. They will review your preferred slot and reach out shortly.
                                @endif
                            </p>
                        </div>

                        <div class="d-grid gap-3 px-lg-4 mt-2">
                            <a href="{{ route('dashboard.user.bookings.index') }}" class="btn btn-lg btn-primary-theme py-3 fw-bold shadow-sm">
                                View My Inquiries <i class="bi bi-chat-right-dots ms-2"></i>
                            </a>
                            
                            <a href="{{ route('autos.show', $auto->slug) }}" class="btn btn-link text-decoration-none text-muted small fw-semibold">
                                <i class="bi bi-arrow-left"></i> Return to Listing
                            </a>
                        </div>
                    </div>

                    {{-- Right Column: Inquiry Details (Receipt Style) --}}
                    <div class="col-md-6 p-5">
                        <h5 class="fw-bold mb-4 text-primary-color text-uppercase tracking-wider small">Vehicle & Schedule</h5>
                        
                        <div class="booking-receipt">
                            <div class="receipt-row">
                                <span class="label">Vehicle</span>
                                <span class="value text-end">{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">Preferred Date</span>
                                <span class="value">{{ \Carbon\Carbon::parse($inquiry->preferred_date)->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">Time Slot</span>
                                <span class="value">{{ $inquiry->preferred_date }} {{ $inquiry->preferred_time }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">Contact</span>
                                <span class="value">{{ $inquiry->email }}</span>
                            </div>

                            <div class="receipt-total pt-4 border-top mt-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-muted">Inquiry ID</span>
                                    <span class="fw-800 text-dark">#{{ $inquiry->id }}</span>
                                </div>
                            </div>
                        </div>
                        
                        {{-- Dealer Profile Box --}}
                        @if ($auto->user)
                        <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                            <div class="d-flex align-items-center gap-3">
                                <img src="{{ $auto->user->avatar_url }}" 
                                     class="rounded-circle shadow-sm border border-white" width="45" height="45">
                                <div>
                                    <h6 class="fw-bold mb-0">Listed by Dealer</h6>
                                    <p class="small text-muted mb-0">{{ $auto->user->name }}</p>
                                </div>
                            </div>
                            <a href="{{ route('conversation.start', $auto->user->username) }}" class="btn btn-white btn-sm fw-bold shadow-sm w-100 mt-3 border">
                                Message Dealer
                            </a>
                        </div>
                        @endif
                    </div>

                </div>
            </div>
        </div>
    </div>
</main>
@endsection
