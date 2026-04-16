@extends('frontend._layouts._app')

@section('title', 'Visit Confirmation | ' . $property->title) 
@section('body_class', 'has-body-glow')

@php
    // Visit-specific status logic
    $isConfirmed = $visit->status === 'confirmed';
    $statusText = $isConfirmed ? 'Visit Confirmed!' : 'Request Received';
    $statusColorClass = $isConfirmed ? 'text-success' : 'text-warning';
    $statusIcon = $isConfirmed ? 'bi-check-circle-fill' : 'bi-clock-history'; 
@endphp

@section('content')
<main class="container-xl page-wrapper">
    <div class="row pt-4 g-4">
        <div class="col-12 text-center">
            <h1 class="fw-bold display-6 mb-2">Property Visit</h1>
            
            <div class="d-flex justify-content-center mb-4">
                @if (session('success') || session('warning') || session('error'))
                    <div class="alert {{ session('error') ? 'alert-danger' : (session('warning') ? 'alert-warning' : 'bg-primary-light text-primary-color border-primary-light') }} px-4 py-2 rounded-pill small fw-bold">
                        {{ session('success') ?? session('warning') ?? session('error') }}
                    </div>
                @else
                    <p class="lead text-muted">
                        {{ $isConfirmed ? 'Your appointment is set!' : 'We’ve sent your request to the agent for review.' }}
                    </p>
                @endif
            </div>
        </div>
    </div>

    {{-- Visit Stepper --}}
    <div class="stepper mx-auto mb-5" style="max-width: 600px;">
        <div class="step done">
            <div class="step-icon"><i class="bi bi-check-lg"></i></div>
            <div class="step-label text-success">Preferences</div>
        </div>
        <div class="step {{ $isConfirmed ? 'done' : 'active' }}">
            <div class="step-icon">
                <i class="bi {{ $isConfirmed ? 'bi-calendar-check-fill' : 'bi-hourglass-split' }}"></i>
            </div>
            <div class="step-label fw-semibold {{ $statusColorClass }}">Confirmation</div>
        </div>
    </div>

    <div class="row justify-content-center pb-5">
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
                                Thank you, <strong>{{ $visit->full_name }}</strong>!
                            </p>
                            <p class="text-muted small mb-4">
                                @if($isConfirmed)
                                    Your visit is confirmed. A calendar invite has been sent to your email.
                                @else
                                    The agent will review your requested time and reach out shortly to finalize the schedule.
                                @endif
                            </p>
                        </div>

                        <div class="d-grid gap-3 px-lg-4 mt-2">
                            <a href="{{ route('dashboard.user.bookings.index') }}" class="btn btn-lg btn-primary-theme py-3 fw-bold">
                                View Scheduled Visits <i class="bi bi-calendar2-event ms-2"></i>
                            </a>
                            
                            <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-link text-decoration-none text-muted small fw-semibold">
                                <i class="bi bi-arrow-left"></i> Return to Property
                            </a>
                        </div>
                    </div>

                    {{-- Right Column: Visit Details --}}
                    <div class="col-md-6 p-5">
                        <h5 class="fw-bold mb-4 text-primary-color text-uppercase tracking-wider small">Visit Schedule</h5>
                        
                        <div class="booking-receipt">
                            <div class="receipt-row">
                                <span class="label">Property</span>
                                <span class="value text-end">{{ $property->title }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">Requested Date</span>
                                <span class="value">{{ $visit->scheduled_at->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">Time Slot</span>
                                <span class="value">{{ $visit->scheduled_at->format('h:i A') }}</span>
                            </div>
                            <div class="receipt-row align-items-start">
                                <span class="label">Your Notes</span>
                                <span class="value text-end small fw-normal text-muted" style="max-width: 60%; line-height: 1.4;">
                                    {{ $visit->notes ?? 'No special requests' }}
                                </span>
                            </div>

                            <div class="receipt-total pt-4 border-top mt-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-muted">Request ID</span>
                                    <span class="fw-800 text-dark">#{{ $visit->id }}</span>
                                </div>
                            </div>
                        </div>
                        
                        {{-- Agent Assistance --}}
                        @if ($property->agent_name || $property->user)
                        <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                            <div class="d-flex align-items-center gap-3">
                                <div class="host-avatar bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style="width: 45px; height: 45px;">
                                    <i class="bi bi-headset text-primary-color fs-4"></i>
                                </div>
                                <div>
                                    <h6 class="fw-bold mb-0">Assigned Agent</h6>
                                    <p class="small text-muted mb-0">{{ $property->agent_name ?? $property->user->name }}</p>
                                </div>
                            </div>
                            <a href="{{ route('conversation.start', ['user' => $property->user]) }}" class="btn btn-white btn-sm fw-bold shadow-sm w-100 mt-3 border">
                                Message Agent
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
