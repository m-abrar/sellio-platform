@extends('adminlte::page')

@section('title', __('Event Ticket') . ' #' . $booking->id)

@section('content_header')
    <div class="d-flex justify-content-between">
        <h1>{{ __('Event Booking') }} <small class="text-muted">#{{ $booking->id }}</small></h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to List') }}
        </a>
    </div>
@stop

@section('content')
    <div class="row">
        <div class="col-md-8">
            {{-- Ticket Details --}}
            <div class="card card-outline card-warning">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-ticket-alt"></i> {{ __('Ticket Information') }}</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="text-muted">{{ __('Event Name') }}</label>
                            <h4>{{ $booking->event->title ?? __('N/A') }}</h4>
                        </div>
                        <div class="col-sm-6 text-sm-right">
                            <label class="text-muted">{{ __('Quantity') }}</label>
                            <h4>{{ $booking->quantity ?? 1 }} {{ __('Tickets') }}</h4>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="text-muted">{{ __('Event Date') }}</label>
                            <p><i class="fas fa-calendar"></i> {{ $booking->event->start_date ?? __('N/A') }}</p>
                        </div>
                        <div class="col-sm-6 text-sm-right">
                            <label class="text-muted">{{ __('Booking Status') }}</label>
                            <div>
                                <span class="badge {{ $booking->getStatusBadgeClass() }}">
                                    {{ Str::upper($booking->status) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Payments Card --}}
            <div class="card card-outline card-secondary">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-money-check-alt"></i> {{ __('Payment History') }}</h3>
                </div>
                <div class="card-body p-0">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>{{ __('Ref') }}</th>
                                <th>{{ __('Method') }}</th>
                                <th class="text-right">{{ __('Amount') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($booking->payments as $payment)
                                <tr>
                                    <td>#{{ $payment->id }}</td>
                                    <td>{{ Str::title($payment->payment_method) }}</td>
                                    <td class="text-right font-weight-bold">{{ number_format($payment->amount, 2) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="3" class="text-center text-muted">{{ __('No payments recorded.') }}</td>
                                </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            {{-- Attendee Profile --}}
            <div class="card card-outline card-primary">
                <div class="card-header text-center">
                    <h3 class="card-title">{{ __('Attendee') }}</h3>
                </div>
                <div class="card-body text-center">
                    <img src="https://ui-avatars.com/api/?name={{ urlencode($booking->user->name ?? 'Guest') }}&background=f39c12&color=fff" class="img-circle elevation-2 mb-3" style="width: 80px;">
                    <h5>{{ $booking->user->name ?? __('Guest Attendee') }}</h5>
                    <p class="text-muted small">{{ $booking->user->email ?? $booking->email }}</p>
                    <a href="{{ $booking->user_id ? route('admin.users.show', $booking->user_id) : '#' }}" class="btn btn-primary btn-sm btn-block {{ !$booking->user_id ? 'disabled' : '' }}">
                        {{ __('View Profile') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop
