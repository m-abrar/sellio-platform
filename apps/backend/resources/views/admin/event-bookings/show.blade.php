@extends('adminlte::page')

@section('title', __('Event Ticket') . ' #' . $booking->id . ' | Registry Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-ticket-alt mr-2 text-primary opacity-50"></i>
                    {{ __('Admission Registry') }} <small class="text-muted font-weight-bold opacity-75 text-monospace">#{{ $booking->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Managed ticketing registry for marketplace events and participant access.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.event-bookings.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-receipt mr-2"></i> Back to Ledger
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
            {{-- Admission Specifications --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h5 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1">
                            <i class="fas fa-id-card-alt mr-2 text-primary opacity-50"></i> {{ __('Admission Intelligence') }}
                        </h5>
                        @php
                            $statusMap = [
                                'pending' => 'badge-warning-light text-warning',
                                'confirmed' => 'badge-success-light text-success',
                                'cancelled' => 'badge-danger-light text-danger'
                            ];
                            $statusClass = $statusMap[$booking->status] ?? 'badge-info-light text-info';
                        @endphp
                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                            {{ $booking->status }}
                        </span>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="row mb-4 pb-4 border-bottom">
                            <div class="col-sm-7">
                                <label class="smallest font-weight-bold text-secondary text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Event Identity') }}</label>
                                <div class="d-flex align-items-center">
                                    <div class="icon-box-soft bg-primary-soft mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 54px; height: 54px; border-radius: 12px;">
                                        <i class="fas fa-microphone-alt text-primary"></i>
                                    </div>
                                    <div>
                                        <p class="h6 font-weight-bold text-dark mb-1">{{ $booking->event->title ?? __('N/A') }}</p>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i> {{ $booking->event->location->title ?? 'Location Pending' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-5 text-sm-right">
                                <label class="smallest font-weight-bold text-secondary text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Allocation Quantity') }}</label>
                                <div class="d-flex justify-content-end align-items-center">
                                    <span class="h4 font-weight-bold text-dark mb-0 mr-2 text-monospace">{{ $booking->quantity ?? 1 }}</span>
                                    <span class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1">{{ __('Reserved Units') }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-sm-6">
                                <label class="smallest font-weight-bold text-secondary text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Registry Timeline') }}</label>
                                <p class="text-dark font-weight-bold mb-0 smallest uppercase letter-spacing-1">
                                    <i class="far fa-calendar-check mr-2 text-primary opacity-50"></i> {{ $booking->created_at->format('M d, Y') }}
                                    <span class="text-muted ml-1 text-monospace">{{ $booking->created_at->format('H:i') }}</span>
                                </p>
                            </div>
                            <div class="col-sm-6 text-sm-right">
                                <label class="smallest font-weight-bold text-secondary text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Protocol Reference') }}</label>
                                <span class="badge badge-light border text-muted smallest px-3 py-2 rounded-pill font-weight-bold text-monospace shadow-xs">REG-{{ str_pad($booking->id, 6, '0', STR_PAD_LEFT) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Financial Ledger --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h5 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1">
                            <i class="fas fa-money-check-alt mr-2 text-primary opacity-50"></i> {{ __('Financial Reconciliation') }}
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-premium mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="pl-4 py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">{{ __('Payment Reference') }}</th>
                                        <th class="py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">{{ __('Protocol Method') }}</th>
                                        <th class="text-right pr-4 py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">{{ __('Settled Amount') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($booking->payments as $payment)
                                        <tr>
                                            <td class="pl-4 py-3 align-middle">
                                                <span class="font-weight-bold text-dark smallest uppercase letter-spacing-1 d-block mb-1">#TXN-{{ $payment->id }}</span>
                                                <small class="text-muted smallest font-weight-bold text-monospace">{{ $payment->created_at->format('M d, Y • H:i') }}</small>
                                            </td>
                                            <td class="align-middle">
                                                <span class="badge badge-light border text-muted smallest px-2 py-1 rounded font-weight-bold uppercase letter-spacing-1 shadow-xs">{{ $payment->payment_method }}</span>
                                            </td>
                                            <td class="text-right pr-4 align-middle font-weight-bold text-success h6 mb-0 text-monospace">${{ number_format($payment->amount, 2) }}</td>
                                        </tr>
                                    @empty
                                        <tr class="empty-state">
                                            <td colspan="3" class="text-center py-5">
                                                <div class="py-3">
                                                    <i class="fas fa-receipt fa-3x text-muted opacity-25 mb-3 d-block"></i>
                                                    <p class="text-muted smallest font-weight-bold text-uppercase letter-spacing-2 mb-0">{{ __('No financial reconciliation records found.') }}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    @endforelse
                                </tbody>
                                @if($booking->payments->count() > 0)
                                <tfoot class="bg-light">
                                    <tr>
                                        <th colspan="2" class="pl-4 py-4 text-uppercase smallest font-weight-bold letter-spacing-2 text-dark">{{ __('Aggregate Collection Total') }}</th>
                                        <th class="text-right pr-4 py-4 text-xl font-weight-bold text-success text-monospace">${{ number_format($booking->payments->sum('amount'), 2) }}</th>
                                    </tr>
                                </tfoot>
                                @endif
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Participant Profile --}}
            <div class="col-md-4">
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 text-center" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h5 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-user-shield mr-2 text-primary opacity-50"></i> {{ __('Principal Identity') }}
                        </h5>
                    </div>
                    <div class="card-body p-4">
                        <div class="mb-4 d-inline-block p-1 rounded-circle border shadow-sm bg-white">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($booking->user->name ?? 'Guest') }}&background=46a5ac&color=fff&bold=true" 
                                 class="rounded-circle" style="width: 84px; height: 84px; object-fit: cover;">
                        </div>
                        <h6 class="font-weight-bold text-dark mb-1 smallest uppercase letter-spacing-1">{{ $booking->user->name ?? __('Guest Attendee') }}</h6>
                        <p class="text-muted smallest font-weight-bold letter-spacing-1 text-monospace mb-4">{{ $booking->user->email ?? $booking->email }}</p>
                        
                        <div class="p-3 rounded-xl bg-light border shadow-xs mb-4">
                            <label class="smallest text-uppercase font-weight-bold text-secondary mb-2 d-block letter-spacing-1">{{ __('Registry Status') }}</label>
                            <span class="smallest font-weight-bold text-dark text-uppercase letter-spacing-1">
                                {{ $booking->user_id ? 'Synchronized platform account' : 'External direct registration' }}
                            </span>
                        </div>

                        <a href="{{ $booking->user_id ? route('admin.users.show', $booking->user_id) : '#' }}" 
                           class="btn btn-primary-soft rounded-pill btn-block font-weight-bold smallest py-2 letter-spacing-1 uppercase shadow-xs {{ !$booking->user_id ? 'disabled opacity-50' : '' }}">
                            <i class="fas fa-id-badge mr-2"></i> {{ __('Inspect Full Profile') }}
                        </a>
                    </div>
                </div>

                <div class="card card-premium shadow-premium border-0">
                    <div class="card-body p-4 d-flex align-items-center bg-white" style="border-radius: 24px;">
                        <div class="mr-3 icon-box-soft bg-primary-soft text-primary shadow-xs d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; border-radius: 12px;">
                            <i class="fas fa-fingerprint h5 mb-0"></i>
                        </div>
                        <div>
                            <h6 class="font-weight-bold text-dark smallest uppercase letter-spacing-1 mb-1">Audit Integrity</h6>
                            <p class="smallest text-muted mb-0 uppercase letter-spacing-1 opacity-75">Immutable system record.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('css')
<style>
    .text-monospace { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace !important; }
    .letter-spacing-2 { letter-spacing: 2px !important; }
    .bg-primary-soft { background: rgba(70, 165, 172, 0.1) !important; }
    .bg-info-light { background: rgba(23, 162, 184, 0.1) !important; }
    .rounded-xl { border-radius: 12px !important; }
</style>
@endsection
