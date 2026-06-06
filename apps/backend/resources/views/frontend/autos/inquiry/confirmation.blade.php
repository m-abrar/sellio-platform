@extends('frontend._layouts._app')

@section('title', __('Inquiry Confirmation') . ' | ' . $auto->make . ' ' . $auto->model)
@section('body_class', 'has-body-glow')

@php
    $isContacted = $inquiry->status === 'contacted' || $inquiry->status === 'resolved';
    $statusText = $isContacted ? __('Dealer Contacted!') : __('Request Sent');
    $statusColorClass = $isContacted ? 'text-success' : 'text-warning';
@endphp

@section('content')
<x-frontend.page-shell variant="auto-inquiry">
    @include('frontend._partials._alerts')

    @include('frontend._partials._checkout_success_hero', [
        'eyebrow' => $isContacted ? __('Response received') : __('Request delivered'),
        'title' => $statusText,
        'message' => $isContacted
            ? __('Thank you, :name! The dealer has responded about the :vehicle. Check your messages or email for the confirmed appointment.', ['name' => $inquiry->full_name, 'vehicle' => $auto->year . ' ' . $auto->make . ' ' . $auto->model])
            : __('Thank you, :name! Your test drive request for the :vehicle was sent to the dealer.', ['name' => $inquiry->full_name, 'vehicle' => $auto->year . ' ' . $auto->make . ' ' . $auto->model]),
        'icon' => $isContacted ? 'bi-person-check-fill' : 'bi-send-check-fill',
        'tone' => $isContacted ? 'success' : 'pending',
        'reference' => $inquiry->id,
        'referenceLabel' => __('Inquiry ID'),
    ])

    <div class="row justify-content-center pb-5 booking-layout">
        <div class="col-xl-11 col-lg-12">
            <div class="glass-surface p-0 overflow-hidden border-0 shadow-deep">
                <div class="row g-0">
                    <div class="col-md-6 d-flex flex-column justify-content-center text-center p-4 p-lg-5 border-end border-color-light bg-white bg-opacity-50">
                        <div class="d-grid gap-3 px-lg-4">
                            <a href="{{ route('dashboard.user.bookings.index') }}" class="btn btn-lg btn-primary-theme py-3 fw-800 rounded-pill shadow-deep">
                                {{ __('View My Inquiries') }} <i class="bi bi-chat-right-dots ms-2"></i>
                            </a>

                            <a href="{{ route('autos.show', $auto->slug) }}" class="btn btn-link text-decoration-none text-muted small fw-800">
                                <i class="bi bi-arrow-left me-1"></i>{{ __('Return to Listing') }}
                            </a>
                        </div>
                    </div>

                    <div class="col-md-6 p-4 p-lg-5">
                        <span class="metric-label mb-4">{{ __('Vehicle & Schedule') }}</span>

                        <div class="booking-receipt">
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Vehicle') }}</span>
                                <span class="fw-800 text-dark text-end">{{ $auto->year }} {{ $auto->make }} {{ $auto->model }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Preferred Date') }}</span>
                                <span class="fw-800 text-dark">{{ \Carbon\Carbon::parse($inquiry->preferred_date)->format('D, M j, Y') }}</span>
                            </div>
                            <div class="receipt-row border-bottom border-color-light py-3">
                                <span class="text-muted fw-600 small">{{ __('Time Slot') }}</span>
                                <span class="fw-800 text-dark">{{ $inquiry->preferred_time }}</span>
                            </div>
                            <div class="receipt-row py-3">
                                <span class="text-muted fw-600 small">{{ __('Contact') }}</span>
                                <span class="fw-800 text-dark">{{ $inquiry->email }}</span>
                            </div>
                        </div>

                        @if ($auto->user)
                            <div class="mt-5 p-4 rounded-4 bg-primary-light border border-primary-light">
                                <div class="d-flex align-items-center gap-3">
                                    <img src="{{ $auto->user->avatar_url }}"
                                         class="rounded-circle shadow-sm border border-white object-fit-cover" width="45" height="45" alt="">
                                    <div>
                                        <h6 class="fw-800 mb-0 text-dark">{{ __('Listed by Dealer') }}</h6>
                                        <p class="small text-muted mb-0">{{ $auto->user->name }}</p>
                                    </div>
                                </div>
                                <a href="{{ route('conversation.start', $auto->user) }}" class="btn btn-white btn-sm fw-800 shadow-sm w-100 mt-3 border rounded-pill py-2">
                                    {{ __('Message Dealer') }}
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
