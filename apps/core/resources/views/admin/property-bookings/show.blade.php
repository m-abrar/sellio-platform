@extends('adminlte::page')

@section('title', __('Booking Details') . ' #' . $booking->id)

@section('content_header')
    <div class="d-flex justify-content-between">
        <h1>{{ __('Booking Details') }} <small class="text-muted">#{{ $booking->id }}</small></h1>
        <a href="{{ route('admin.bookings.index') }}" class="btn btn-default btn-sm">
            <i class="fas fa-arrow-left"></i> {{ __('Back to Unified List') }}
        </a>
    </div>
@stop

@section('content')
    @include('admin.alert')

    <div class="row">
        {{-- Left Column: Core Data --}}
        <div class="col-md-8">
            <div class="card card-outline card-primary">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-info-circle"></i> {{ __('General Information') }}</h3>
                    <div class="card-tools">
                        {{-- Uses HasBookingAttributes Trait method if available, else standard badge --}}
                        <span class="badge {{ method_exists($booking, 'getStatusBadgeClass') ? $booking->getStatusBadgeClass() : 'badge-secondary' }} px-3 py-2">
                            {{ Str::upper($booking->status) }}
                        </span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-sm-6">
                            <label class="text-muted mb-0">{{ __('Property') }}</label>
                            <p class="lead"><strong>{{ $booking->property->title ?? __('N/A') }}</strong></p>
                        </div>
                        <div class="col-sm-6 text-sm-right">
                            <label class="text-muted mb-0">{{ __('Booking Date') }}</label>
                            <p>{{ $booking->created_at->format('M d, Y H:i') }}</p>
                        </div>
                    </div>

                    <hr class="mt-0">

                    <div class="row mt-4">
                        <div class="col-md-6 border-right">
                            <h5><i class="fas fa-calendar-alt text-primary"></i> {{ __('Stay Period') }}</h5>
                            <table class="table table-sm table-borderless">
                                <tr>
                                    <th style="width: 40%">{{ __('Check-in') }}:</th>
                                    {{-- Uses casted Carbon instance from model --}}
                                    <td>{{ $booking->check_in_date->format('l, M d, Y') }}</td>
                                </tr>
                                <tr>
                                    <th>{{ __('Check-out') }}:</th>
                                    <td>{{ $booking->check_out_date->format('l, M d, Y') }}</td>
                                </tr>
                                <tr>
                                    <th>{{ __('Nights') }}:</th>
                                    <td>{{ $booking->check_in_date->diffInDays($booking->check_out_date) }}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="col-md-6">
                            <h5><i class="fas fa-users text-primary"></i> {{ __('Guest Details') }}</h5>
                            <p class="mb-1"><strong>{{ $booking->full_name }}</strong> <span class="badge badge-light">G: {{ $booking->guests }}</span></p>
                            <p class="mb-1 text-muted"><i class="fas fa-envelope fa-fw"></i> {{ $booking->email }}</p>
                            <p class="mb-1 text-muted"><i class="fas fa-phone fa-fw"></i> {{ $booking->phone ?? __('N/A') }}</p>
                        </div>
                    </div>

                    @if($booking->message)
                        <div class="mt-4 p-3 bg-light border rounded shadow-sm">
                            <h6 class="text-primary"><i class="fas fa-comment-dots"></i> {{ __('Customer Message') }}:</h6>
                            <p class="mb-0"><em>"{{ $booking->message }}"</em></p>
                        </div>
                    @endif
                </div>
                <div class="card-footer bg-white">
                    <a href="{{ route('admin.property-bookings.edit', $booking->id) }}" class="btn btn-outline-primary">
                        <i class="fas fa-edit"></i> {{ __('Modify Record') }}
                    </a>
                </div>
            </div>

            {{-- Financial Details --}}
            <div class="card card-outline card-secondary">
                <div class="card-header">
                    <h3 class="card-title"><i class="fas fa-receipt"></i> {{ __('Financial Breakdown') }}</h3>
                </div>
                <div class="card-body p-0">
                    <table class="table table-hover mb-0">
                        <thead class="thead-light">
                            <tr>
                                <th>{{ __('Description') }}</th>
                                <th class="text-right">{{ __('Amount') }}</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($booking->transactionLines as $line)
                                <tr>
                                    <td>{{ $line->description }}</td>
                                    <td class="text-right font-weight-bold">{{ number_format($line->amount, 2) }}</td>
                                </tr>
                            @empty
                                <tr>
                                    <td>{{ __('Standard Lodging Rate') }}</td>
                                    <td class="text-right font-weight-bold">{{ number_format($booking->total_price, 2) }}</td>
                                </tr>
                            @endforelse
                        </tbody>
                        <tfoot class="bg-light">
                            <tr>
                                <th class="text-uppercase">{{ __('Total Price') }}</th>
                                <th class="text-right text-lg text-primary">{{ number_format($booking->total_price, 2) }}</th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>

        {{-- Right Column: Side Cards --}}
        <div class="col-md-4">
            {{-- Customer Card --}}
            <div class="card card-info card-outline">
                <div class="card-header">
                    <h3 class="card-title">{{ __('Account Link') }}</h3>
                </div>
                <div class="card-body text-center">
                    @if($booking->user)
                        <img src="https://ui-avatars.com/api/?name={{ urlencode($booking->user->name) }}&background=17a2b8&color=fff" class="img-circle elevation-2 mb-3" style="width: 70px;">
                        <h5>{{ $booking->user->name }}</h5>
                        <p class="text-muted small">{{ $booking->user->email }}</p>
                        <a href="{{ route('admin.users.show', $booking->user_id) }}" class="btn btn-info btn-sm btn-block">
                            <i class="fas fa-external-link-alt"></i> {{ __('User Profile') }}
                        </a>
                    @else
                        <div class="text-muted py-3 text-center">
                            <i class="fas fa-user-slash fa-3x mb-2 text-gray"></i>
                            <p>{{ __('Guest / Unregistered User') }}</p>
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
            
            <div class="card card-outline {{ $balance <= 0 ? 'card-success' : 'card-warning' }}">
                <div class="card-header">
                    <h3 class="card-title">{{ __('Payment Progress') }}</h3>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-2">
                        <span>{{ __('Collection') }}</span>
                        <span class="font-weight-bold">{{ round($paymentPercent) }}%</span>
                    </div>
                    <div class="progress progress-sm active mb-3">
                        <div class="progress-bar bg-{{ $balance <= 0 ? 'success' : 'warning' }} progress-bar-striped" 
                             role="progressbar" 
                             aria-valuenow="{{ $paymentPercent }}" 
                             aria-valuemin="0" 
                             aria-valuemax="100" 
                             style="width: {{ $paymentPercent }}%">
                        </div>
                    </div>
                    
                    <ul class="list-group list-group-unbordered">
                        <li class="list-group-item">
                            <b>{{ __('Paid') }}</b> <span class="float-right text-success">{{ number_format($totalPaid, 2) }}</span>
                        </li>
                        <li class="list-group-item border-bottom-0">
                            <b>{{ __('Balance') }}</b> <span class="float-right {{ $balance > 0 ? 'text-danger' : 'text-success' }} font-weight-bold">{{ number_format($balance, 2) }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
@stop
