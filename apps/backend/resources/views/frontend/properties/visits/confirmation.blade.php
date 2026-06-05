@extends('frontend._layouts._app')

@section('title', __('Visit Confirmation') . ' | ' . $property->title)
@section('body_class', 'has-body-glow')

@php
    $isConfirmed = $visit->status === 'confirmed';
    $statusText = $isConfirmed ? __('Visit Confirmed!') : __('Request Received');
    $statusColorClass = $isConfirmed ? 'text-success' : 'text-warning';
    $statusIcon = $isConfirmed ? 'bi-check-circle-fill' : 'bi-clock-history';
@endphp

@section('content')
<main class="container-xl page-wrapper">
    <div class="row pt-4 g-4">
        <div class="col-12 text-center">
            <h1 class="fw-bold display-6 mb-2">{{ __('Property Visit') }}</h1>

            <p class="lead text-muted mb-4">
                {{ $isConfirmed ? __('Your appointment is set!') : __('We have sent your request to the agent for review.') }}
            </p>

            @include('frontend._partials._alerts')
        </div>
    </div>

    <ol class="stepper stepper--compact mx-auto mb-5" aria-label="{{ __('Visit request progress') }}">
        <li class="step done">
            <div class="step-icon"><i class="bi bi-check-lg"></i></div>
            <div class="step-label text-success">{{ __('Preferences') }}</div>
        </li>
        <li class="step {{ $isConfirmed ? 'done' : 'active' }}" @unless($isConfirmed) aria-current="step" @endunless>
            <div class="step-icon">
                <i class="bi {{ $isConfirmed ? 'bi-calendar-check-fill' : 'bi-hourglass-split' }}"></i>
            </div>
            <div class="step-label fw-semibold {{ $statusColorClass }}">{{ __('Confirmation') }}</div>
        </li>
    </ol>

    <div class="row justify-content-center pb-5">
        <div class="col-lg-10">
            <div class="glass-surface p-0 overflow-hidden border-0 shadow-lg">
                <div class="row g-0">
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-5 border-end bg-white bg-opacity-50">
                        <div class="mb-4">
                            <i class="visit-confirmation-status-icon bi {{ $statusIcon }} {{ $statusColorClass }}"></i>
                        </div>

                        <h2 class="fw-800 {{ $statusColorClass }} mb-3">{{ $statusText }}</h2>

                        <div class="px-lg-4">
                            <p class="text-dark mb-2">
                                {{ __('Thank you,') }} <strong>{{ $visit->full_name }}</strong>!
                            </p>
                            <p class="text-muted small mb-4">
                                @if($isConfirmed)
                                    {{ __('Your visit is confirmed. A calendar invite has been sent to your email.') }}
                                @else
                                    {{ __('The agent will review your requested time and reach out shortly to finalize the schedule.') }}
                                @endif
                            </p>
                        </div>

                        <div class="d-grid gap-3 px-lg-4 mt-2">
                            <a href="{{ route('dashboard.user.bookings.index') }}" class="btn btn-lg btn-primary-theme py-3 fw-bold">
                                {{ __('View Scheduled Visits') }} <i class="bi bi-calendar2-event ms-2"></i>
                            </a>

                            <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-link text-decoration-none text-muted small fw-semibold">
                                <i class="bi bi-arrow-left"></i> {{ __('Return to Property') }}
                            </a>
                        </div>
                    </div>

                    <div class="col-md-6 p-5">
                        <h5 class="fw-bold mb-4 text-primary-color text-uppercase tracking-wider small">{{ __('Visit Schedule') }}</h5>

                        <div class="booking-receipt">
                            <div class="receipt-row">
                                <span class="label">{{ __('Property') }}</span>
                                <span class="value text-end">{{ $property->title }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">{{ __('Requested Date') }}</span>
                                <span class="value">{{ $visit->scheduled_at->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row">
                                <span class="label">{{ __('Time Slot') }}</span>
                                <span class="value">{{ $visit->scheduled_at->format('h:i A') }}</span>
                            </div>
                            <div class="receipt-row align-items-start">
                                <span class="label">{{ __('Your Notes') }}</span>
                                <span class="visit-notes-value value text-end small fw-normal text-muted">
                                    {{ $visit->notes ?? __('No special requests') }}
                                </span>
                            </div>

                            <div class="receipt-total pt-4 border-top mt-3">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-muted">{{ __('Request ID') }}</span>
                                    <span class="fw-800 text-dark">#{{ $visit->id }}</span>
                                </div>
                            </div>
                        </div>

                        @if ($property->agent_name || $property->user)
                            <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="visit-agent-avatar host-avatar bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                                        <i class="bi bi-headset text-primary-color fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 class="fw-bold mb-0">{{ __('Assigned Agent') }}</h6>
                                        <p class="small text-muted mb-0">{{ $property->agent_name ?? $property->user->name }}</p>
                                    </div>
                                </div>
                                <a href="{{ route('conversation.start', ['user' => $property->user]) }}" class="btn btn-white btn-sm fw-bold shadow-sm w-100 mt-3 border">
                                    {{ __('Message Agent') }}
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
