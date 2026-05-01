@extends('adminlte::page')

@section('title', __('Booking Details') . ' #' . $booking->id)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-key mr-2 text-primary"></i>
                    {{ __('Reservation Protocol') }} <small class="text-muted font-weight-bold opacity-75">#{{ $booking->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Managed hospitality registry for property lodgings and guest stays.</p>
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
            {{-- Left Column: Core Data --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Lodging Specifications') }}
                        </h3>
                        <span class="badge {{ method_exists($booking, 'getStatusBadgeClass') ? $booking->getStatusBadgeClass() : 'badge-secondary-light text-secondary' }} px-3 py-2 rounded-pill font-weight-bold smallest text-uppercase">
                            {{ $booking->status }}
                        </span>
                    </div>
                    <div class="card-body p-4">
                        <div class="row mb-4 pb-4 border-bottom border-light">
                            <div class="col-sm-7">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">{{ __('Property Entity') }}</label>
                                <div class="d-flex align-items-center">
                                    <div class="icon-box-soft bg-primary-soft mr-3" style="width: 50px; height: 50px;">
                                        <i class="fas fa-building text-primary"></i>
                                    </div>
                                    <p class="h5 font-weight-bold text-dark mb-0">{{ $booking->property->title ?? __('N/A') }}</p>
                                </div>
                            </div>
                            <div class="col-sm-5 text-sm-right">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block">{{ __('Registry Timestamp') }}</label>
                                <p class="text-dark font-weight-600 mb-0"><i class="far fa-clock mr-1 text-muted"></i> {{ $booking->created_at->format('M d, Y • H:i') }}</p>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-md-6 border-right">
                                <h5 class="smallest text-uppercase font-weight-bold text-muted letter-spacing-1 mb-3">
                                    <i class="fas fa-calendar-alt mr-2 text-primary"></i> {{ __('Stay Architecture') }}
                                </h5>
                                <div class="p-3 rounded-xl bg-light">
                                    <table class="table table-sm table-borderless mb-0">
                                        <tr>
                                            <th class="smallest text-muted py-1" style="width: 40%">{{ __('Check-in') }}</th>
                                            <td class="small font-weight-bold py-1">{{ $booking->check_in_date->format('l, M d, Y') }}</td>
                                        </tr>
                                        <tr>
                                            <th class="smallest text-muted py-1">{{ __('Check-out') }}</th>
                                            <td class="small font-weight-bold py-1">{{ $booking->check_out_date->format('l, M d, Y') }}</td>
                                        </tr>
                                        <tr>
                                            <th class="smallest text-muted py-1">{{ __('Duration') }}</th>
                                            <td class="py-1">
                                                <span class="badge badge-primary-light text-primary px-3 py-1 rounded-pill font-weight-bold">
                                                    {{ $booking->check_in_date->diffInDays($booking->check_out_date) }} NIGHTS
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h5 class="smallest text-uppercase font-weight-bold text-muted letter-spacing-1 mb-3">
                                    <i class="fas fa-users mr-2 text-primary"></i> {{ __('Guest Logistics') }}
                                </h5>
                                <div class="d-flex align-items-center mb-3">
                                    <div class="avatar-xs bg-dark-soft text-dark rounded-pill mr-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                                        <i class="fas fa-user smallest"></i>
                                    </div>
                                    <span class="font-weight-bold text-dark">{{ $booking->full_name }}</span>
                                    <span class="badge badge-light border text-muted ml-2 smallest px-2">{{ $booking->guests }} GUESTS</span>
                                </div>
                                <p class="mb-1 text-muted small"><i class="fas fa-envelope fa-fw mr-2 opacity-50"></i> {{ $booking->email }}</p>
                                <p class="mb-1 text-muted small"><i class="fas fa-phone fa-fw mr-2 opacity-50"></i> {{ $booking->phone ?? __('N/A') }}</p>
                            </div>
                        </div>

                        @if($booking->message)
                            <div class="mt-4 p-4 rounded-xl border-0 shadow-xs" style="background: rgba(70, 165, 172, 0.05);">
                                <h6 class="smallest text-uppercase font-weight-bold text-primary mb-2">
                                    <i class="fas fa-comment-dots mr-2"></i> {{ __('Client Memo') }}
                                </h6>
                                <p class="mb-0 text-dark font-italic" style="line-height: 1.6;">"{{ $booking->message }}"</p>
                            </div>
                        @endif
                    </div>
                    <div class="card-footer bg-white border-top-0 px-4 py-3">
                        <a href="{{ route('admin.property-bookings.edit', $booking->id) }}" class="btn btn-outline-primary rounded-pill px-4 font-weight-bold smallest">
                            <i class="fas fa-edit mr-1"></i> {{ __('MODIFY RECORD') }}
                        </a>
                    </div>
                </div>

                {{-- Financial Details --}}
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-receipt mr-2 text-primary opacity-50"></i> {{ __('Fiscal Reconciliation') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <table class="table table-hover table-premium mb-0">
                            <thead class="thead-light">
                                <tr class="smallest text-uppercase font-weight-bold">
                                    <th class="pl-4 py-3 border-0">{{ __('Description') }}</th>
                                    <th class="text-right pr-4 py-3 border-0">{{ __('Amount') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @forelse($booking->transactionLines as $line)
                                    <tr>
                                        <td class="pl-4 py-3 text-dark font-weight-600">{{ $line->description }}</td>
                                        <td class="text-right pr-4 font-weight-bold text-dark">${{ number_format($line->amount, 2) }}</td>
                                    </tr>
                                @empty
                                    <tr>
                                        <td class="pl-4 py-3 text-dark font-weight-600">{{ __('Standard Lodging Rate') }}</td>
                                        <td class="text-right pr-4 font-weight-bold text-dark">${{ number_format($booking->total_price, 2) }}</td>
                                    </tr>
                                @endforelse
                            </tbody>
                            <tfoot class="bg-light">
                                <tr>
                                    <th class="pl-4 py-4 text-uppercase smallest font-weight-bold letter-spacing-1">{{ __('Final Collection Total') }}</th>
                                    <th class="text-right pr-4 py-4 text-xl font-weight-bold text-success">${{ number_format($booking->total_price, 2) }}</th>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {{-- Right Column: Side Cards --}}
            <div class="col-md-4">
                {{-- Customer Card --}}
                <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-user-circle mr-1 text-primary"></i> Account Link
                        </h3>
                    </div>
                    <div class="card-body text-center p-4">
                        @if($booking->user)
                            <div class="mb-3 d-inline-block p-1 rounded-circle border shadow-xs">
                                <img src="https://ui-avatars.com/api/?name={{ urlencode($booking->user->name) }}&background=46a5ac&color=fff" class="rounded-circle" style="width: 70px; height: 70px;">
                            </div>
                            <h5 class="font-weight-bold text-dark mb-1">{{ $booking->user->name }}</h5>
                            <p class="text-muted small mb-4 font-weight-600">{{ $booking->user->email }}</p>
                            <a href="{{ route('admin.users.show', $booking->user_id) }}" class="btn btn-primary-soft rounded-pill btn-block font-weight-bold smallest py-2">
                                <i class="fas fa-external-link-alt mr-1"></i> VIEW PROFILE
                            </a>
                        @else
                            <div class="text-muted py-3 text-center">
                                <div class="icon-box-soft bg-light mx-auto mb-3" style="width: 60px; height: 60px;">
                                    <i class="fas fa-user-slash text-muted h4 mb-0"></i>
                                </div>
                                <p class="font-weight-bold text-muted smallest text-uppercase letter-spacing-1 mb-0">{{ __('Guest Submission') }}</p>
                            </div>
                        @endif
                    </div>
                </div>

                {{-- Payment Status --}}
                @php
                    $totalPaid = $booking->payments->sum('amount');
                    $balance = $booking->total_price - $totalPaid;
                    $paymentPercent = $booking->total_price > 0 ? ($totalPaid / $booking->total_price) * 100 : 0;
                @endphp
                
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-wallet mr-1 text-primary"></i> Collection Progress
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1">{{ __('Paid Status') }}</span>
                            <span class="font-weight-bold text-dark">{{ round($paymentPercent) }}%</span>
                        </div>
                        <div class="progress progress-sm active mb-4 shadow-xs" style="height: 10px; border-radius: 10px;">
                            <div class="progress-bar bg-success progress-bar-striped progress-bar-animated" 
                                 role="progressbar" 
                                 style="width: {{ $paymentPercent }}%">
                            </div>
                        </div>
                        
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item px-0 py-2 border-0 d-flex justify-content-between align-items-center">
                                <span class="small font-weight-bold text-muted">{{ __('Received') }}</span>
                                <span class="text-success font-weight-bold h6 mb-0">${{ number_format($totalPaid, 2) }}</span>
                            </li>
                            <li class="list-group-item px-0 py-2 border-0 d-flex justify-content-between align-items-center">
                                <span class="small font-weight-bold text-muted">{{ __('Outstanding') }}</span>
                                <span class="{{ $balance > 0 ? 'text-danger' : 'text-success' }} font-weight-bold h6 mb-0">${{ number_format($balance, 2) }}</span>
                            </li>
                        </ul>

                        @if($balance > 0)
                            <div class="mt-4 p-3 bg-danger-soft rounded-xl text-center">
                                <p class="mb-0 smallest font-weight-bold text-danger text-uppercase letter-spacing-1">
                                    <i class="fas fa-exclamation-triangle mr-1"></i> AWAITING COLLECTION
                                </p>
                            </div>
                        @else
                            <div class="mt-4 p-3 bg-success-soft rounded-xl text-center">
                                <p class="mb-0 smallest font-weight-bold text-success text-uppercase letter-spacing-1">
                                    <i class="fas fa-check-double mr-1"></i> FULLY SETTLED
                                </p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
