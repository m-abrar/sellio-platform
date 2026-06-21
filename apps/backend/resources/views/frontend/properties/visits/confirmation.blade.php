@extends('frontend._layouts._app')

@section('title', __('Visit Confirmation') . ' | ' . $property->title)
@section('body_class', 'has-body-glow')

@php
    $isConfirmed = $visit->status === 'confirmed';
    $statusText = $isConfirmed ? __('Visit Confirmed!') : __('Request Received');
    $statusColorClass = $isConfirmed ? 'text-success' : 'text-warning';
@endphp

@section('content')
<x-frontend.page-shell variant="property-visit">
    @include('frontend._partials._alerts')

    @include('frontend._partials._checkout_success_hero', [
        'eyebrow' => $isConfirmed ? __('See you soon') : __('Request sent'),
        'title' => $statusText,
        'message' => $isConfirmed
            ? __('Thank you, :name! Your visit to :property is confirmed. A calendar invite has been sent to your email.', ['name' => $visit->full_name, 'property' => $property->title])
            : __('Thank you, :name! The agent will review your requested time for :property and reach out shortly.', ['name' => $visit->full_name, 'property' => $property->title]),
        'icon' => $isConfirmed ? 'bi-calendar-check-fill' : 'bi-clock-history',
        'tone' => $isConfirmed ? 'success' : 'pending',
        'reference' => $visit->id,
        'referenceLabel' => __('Request ID'),
    ])

    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-11 col-lg-12">
            <div class="bg-white border rounded-4 overflow-hidden">
                <div class="row g-0">
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-4 p-lg-5 border-end border-color-light bg-white bg-opacity-50">
                        <div class="d-grid gap-3 px-lg-4">
                            <a href="{{ route('dashboard.user.bookings.index') }}" class="btn btn-lg btn-primary py-3">
                                {{ __('View Scheduled Visits') }} <i class="bi bi-calendar2-event ms-2"></i>
                            </a>

                            <a href="{{ route('properties.show', $property->slug) }}" class="btn btn-link text-decoration-none text-muted small fw-800">
                                <i class="bi bi-arrow-left me-1"></i>{{ __('Return to Property') }}
                            </a>
                        </div>
                    </div>

                    <div class="col-md-6 p-4 p-lg-5">
                        <span class="metric-label mb-4">{{ __('Visit Schedule') }}</span>

                        <div class="booking-receipt">
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Property') }}</span>
                                <span class="fw-800 text-dark text-end">{{ $property->title }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Requested Date') }}</span>
                                <span class="fw-800 text-dark">{{ $visit->scheduled_at->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Time Slot') }}</span>
                                <span class="fw-800 text-dark">{{ $visit->scheduled_at->format('h:i A') }}</span>
                            </div>
                            <div class="receipt-row py-3 align-items-start">
                                <span class="text-muted fw-600 small">{{ __('Your Notes') }}</span>
                                <span class="visit-notes-value fw-800 text-dark text-end small">
                                    {{ $visit->notes ?? __('No special requests') }}
                                </span>
                            </div>
                        </div>

                        @if ($property->agent_name || $property->user)
                            <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                                <div class="d-flex align-items-center gap-3">
                                    <div class="visit-agent-avatar host-avatar bg-white rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                                        <i class="bi bi-headset text-primary fs-4"></i>
                                    </div>
                                    <div>
                                        <h6 class="fw-800 mb-0 text-dark">{{ __('Assigned Agent') }}</h6>
                                        <p class="small text-muted mb-0">{{ $property->agent_name ?? $property->user->name }}</p>
                                    </div>
                                </div>
                                <a href="{{ route('conversation.start', ['user' => $property->user]) }}" class="btn btn-outline-secondary btn-sm fw-semibold w-100 mt-3 rounded-2 py-2">
                                    {{ __('Message Agent') }}
                                </a>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-frontend.page-shell>
@endsection
