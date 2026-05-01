@extends('adminlte::page')

@section('title', __('Event Ticket') . ' #' . $booking->id)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary"></i>
                    {{ __('Event Admission Registry') }} <small class="text-muted font-weight-bold opacity-75">#{{ $booking->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Managed ticketing registry for marketplace events and participant access.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.bookings.index') }}" class="btn btn-default shadow-sm rounded-pill px-4 font-weight-bold smallest">
                        <i class="fas fa-arrow-left mr-1"></i> BACK TO REGISTRY
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            {{-- Left Column: Ticket Details --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-id-card-alt mr-2 text-primary opacity-50"></i> {{ __('Admission Specifications') }}
                        </h3>
                        <span class="badge {{ $booking->getStatusBadgeClass() }} px-3 py-2 rounded-pill font-weight-bold smallest text-uppercase">
                            {{ $booking->status }}
                        </span>
                    </div>
                    <div class="card-body p-4">
                        <div class="row mb-4">
                            <div class="col-sm-7">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">{{ __('Event Identity') }}</label>
                                <div class="d-flex align-items-center">
                                    <div class="icon-box-soft bg-warning-soft mr-3" style="width: 50px; height: 50px;">
                                        <i class="fas fa-microphone-alt text-warning"></i>
                                    </div>
                                    <p class="h5 font-weight-bold text-dark mb-0">{{ $booking->event->title ?? __('N/A') }}</p>
                                </div>
                            </div>
                            <div class="col-sm-5 text-sm-right">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">{{ __('Allocation') }}</label>
                                <div class="d-flex justify-content-end align-items-center">
                                    <span class="h4 font-weight-bold text-dark mb-0 mr-2">{{ $booking->quantity ?? 1 }}</span>
                                    <span class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1">{{ __('Reserved Tickets') }}</span>
                                </div>
                            </div>
                        </div>
                        <hr class="border-light">
                        <div class="row mt-4">
                            <div class="col-sm-6">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">{{ __('Event Schedule') }}</label>
                                <p class="text-dark font-weight-600 mb-0"><i class="far fa-calendar-check mr-2 text-primary"></i> {{ $booking->event->start_date ?? __('N/A') }}</p>
                            </div>
                            <div class="col-sm-6 text-sm-right">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">{{ __('Transaction ID') }}</label>
                                <span class="badge badge-light border text-muted smallest px-3 py-2 rounded-pill font-weight-bold">#{{ $booking->id }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Payments Card --}}
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-money-check-alt mr-2 text-primary opacity-50"></i> {{ __('Financial Ledger') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover table-premium mb-0">
                            <thead class="thead-light">
                                <tr class="smallest text-uppercase font-weight-bold">
                                    <th class="pl-4 py-3 border-0">{{ __('Payment Ref') }}</th>
                                    <th class="py-3 border-0">{{ __('Method') }}</th>
                                    <th class="text-right pr-4 py-3 border-0">{{ __('Amount') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($booking->payments as $payment)
                                    <tr>
                                        <td class="pl-4 py-3 align-middle">
                                            <span class="font-weight-bold text-dark smallest">#{{ $payment->id }}</span>
                                            <small class="d-block text-muted">{{ $payment->created_at->format('M d, Y') }}</small>
                                        </td>
                                        <td class="align-middle">
                                            <span class="badge badge-light border text-muted smallest px-2 font-weight-bold">{{ strtoupper($payment->payment_method) }}</span>
                                        </td>
                                        <td class="text-right pr-4 align-middle font-weight-bold text-success">${{ number_format($payment->amount, 2) }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td colspan="3" class="text-center py-5">
                                            <div class="py-3">
                                                <i class="fas fa-receipt fa-2x text-light mb-2"></i>
                                                <p class="text-muted smallest font-weight-bold text-uppercase mb-0">{{ __('No financial records found.') }}</p>
                                            </div>
                                        </td>
                                    </tr>
                                @endforelse
                            </tbody>
                            @if($booking->payments->count() > 0)
                            <tfoot class="bg-light">
                                <tr>
                                    <th colspan="2" class="pl-4 py-4 text-uppercase smallest font-weight-bold letter-spacing-1">{{ __('Total Collection') }}</th>
                                    <th class="text-right pr-4 py-4 text-xl font-weight-bold text-dark">${{ number_format($booking->payments->sum('amount'), 2) }}</th>
                                </tr>
                            </tfoot>
                            @endif
                        </table>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                {{-- Attendee Profile --}}
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-user-check mr-1 text-primary"></i> Participant Profile
                        </h3>
                    </div>
                    <div class="card-body text-center p-4">
                        <div class="mb-3 d-inline-block p-1 rounded-circle border shadow-xs">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($booking->user->name ?? 'Guest') }}&background=f39c12&color=fff" class="rounded-circle" style="width: 80px; height: 80px;">
                        </div>
                        <h5 class="font-weight-bold text-dark mb-1">{{ $booking->user->name ?? __('Guest Attendee') }}</h5>
                        <p class="text-muted small mb-4 font-weight-600">{{ $booking->user->email ?? $booking->email }}</p>
                        
                        <div class="p-3 rounded-xl bg-light mb-4">
                            <label class="smallest text-uppercase font-weight-bold text-muted mb-1 d-block">{{ __('Guest Status') }}</label>
                            <span class="smallest font-weight-bold text-dark text-uppercase letter-spacing-1">
                                {{ $booking->user_id ? 'REGISTERED ACCOUNT' : 'DIRECT REGISTRATION' }}
                            </span>
                        </div>

                        <a href="{{ $booking->user_id ? route('admin.users.show', $booking->user_id) : '#' }}" class="btn btn-primary-soft rounded-pill btn-block font-weight-bold smallest py-2 {{ !$booking->user_id ? 'disabled' : '' }}">
                            <i class="fas fa-external-link-alt mr-1"></i> {{ __('VIEW FULL PROFILE') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
