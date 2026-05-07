{{--
    Administrative Real Estate: Booking Operational Intelligence
    
    This view provides a comprehensive 360-degree visualization of a 
    specific property reservation. It aggregates stay specifications, 
    guest logistics, fiscal reconciliation (transaction lines), and 
    real-time collection metrics (paid vs outstanding balance) into a 
    unified administrative oversight profile.
    
    @extends adminlte::page
    @context Property Operational Administration
    @variables PropertyBooking $booking The property booking model instance.
--}}
@extends('adminlte::page')

@section('title', __('Booking Details') . ' #' . $booking->id . ' | Real Estate Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-key mr-2 text-primary opacity-50"></i>
                    {{ __('Reservation Protocol') }} <small class="text-muted font-weight-bold opacity-75 text-monospace">#{{ $booking->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Managed hospitality registry for property lodgings and guest stays.</p>
            </div>
            <div class="col-sm-6 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.property-bookings.edit', $booking->id) }}" class="btn btn-primary rounded-pill px-4 py-2 font-weight-bold shadow-premium smallest uppercase letter-spacing-1">
                        <i class="fas fa-edit mr-2"></i> Modify Record
                    </a>
                    <a href="{{ route('admin.property-bookings.index') }}" class="btn-back shadow-sm">
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
            {{-- Intelligence Column --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-sm mb-4 border-0 overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex justify-content-between align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Lodging Specifications') }}
                        </h3>
                        @php
                            $statusMap = ['confirmed' => 'badge-success-light text-success', 'pending' => 'badge-warning-light text-warning', 'cancelled' => 'badge-danger-light text-danger'];
                            $statusClass = $statusMap[$booking->status] ?? 'badge-secondary-light text-secondary';
                        @endphp
                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest text-uppercase letter-spacing-1 shadow-xs">
                            {{ $booking->status }}
                        </span>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="row mb-4 pb-4 border-bottom">
                            <div class="col-sm-7">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block letter-spacing-1">{{ __('Property Entity') }}</label>
                                <div class="d-flex align-items-center">
                                    <div class="icon-box-soft bg-primary-soft mr-3 shadow-xs d-flex align-items-center justify-content-center icon-box-md">
                                        <i class="fas fa-building text-primary"></i>
                                    </div>
                                    <div>
                                        <p class="h6 font-weight-bold text-dark mb-1">{{ $booking->property->title ?? __('N/A') }}</p>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">
                                            <i class="fas fa-map-marker-alt mr-1 text-danger opacity-50"></i> {{ $booking->property->location->title ?? 'Location Pending' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-5 text-sm-right">
                                <label class="smallest text-uppercase font-weight-bold text-muted mb-2 d-block letter-spacing-1">{{ __('Registry Timestamp') }}</label>
                                <p class="text-dark font-weight-bold mb-0 smallest uppercase letter-spacing-1">
                                    <i class="far fa-clock mr-1 text-primary opacity-50"></i> {{ $booking->created_at->format('M d, Y') }} 
                                    <span class="text-muted ml-1 text-monospace">{{ $booking->created_at->format('H:i') }}</span>
                                </p>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div class="col-md-6 border-right">
                                <h5 class="smallest text-uppercase font-weight-bold text-dark letter-spacing-1 mb-4">
                                    <i class="fas fa-calendar-alt mr-2 text-primary opacity-50"></i> {{ __('Stay Architecture') }}
                                </h5>
                                <div class="p-3 rounded-xl bg-light border shadow-xs">
                                    <table class="table table-sm table-borderless mb-0">
                                        <tr>
                                            <th class="smallest text-muted py-2 letter-spacing-1 uppercase" style="width: 40%">{{ __('Arrival') }}</th>
                                            <td class="smallest font-weight-bold text-dark py-2 letter-spacing-1 uppercase">{{ $booking->check_in_date->format('l, M d, Y') }}</td>
                                        </tr>
                                        <tr>
                                            <th class="smallest text-muted py-2 letter-spacing-1 uppercase">{{ __('Departure') }}</th>
                                            <td class="smallest font-weight-bold text-dark py-2 letter-spacing-1 uppercase">{{ $booking->check_out_date->format('l, M d, Y') }}</td>
                                        </tr>
                                        <tr>
                                            <th class="smallest text-muted py-2 letter-spacing-1 uppercase">{{ __('Duration') }}</th>
                                            <td class="py-2">
                                                <span class="badge badge-primary-light text-primary px-3 py-1 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                                    {{ $booking->check_in_date->diffInDays($booking->check_out_date) }} Nights
                                                </span>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                            <div class="col-md-6 pl-md-4">
                                <h5 class="smallest text-uppercase font-weight-bold text-dark letter-spacing-1 mb-4">
                                    <i class="fas fa-users mr-2 text-primary opacity-50"></i> {{ __('Guest Logistics') }}
                                </h5>
                                <div class="d-flex align-items-center mb-3">
                                    <div class="icon-box-soft bg-dark-soft text-dark mr-3 shadow-xs d-flex align-items-center justify-content-center icon-box-sm">
                                        <i class="fas fa-user-tie smallest"></i>
                                    </div>
                                    <div>
                                        <span class="font-weight-bold text-dark smallest uppercase letter-spacing-1 d-block mb-1">{{ $booking->full_name }}</span>
                                        <span class="badge badge-light border text-muted smallest px-2 py-1 rounded-pill uppercase letter-spacing-1">{{ $booking->guests }} GUESTS</span>
                                    </div>
                                </div>
                                <div class="ml-1">
                                    <p class="mb-2 text-muted smallest font-weight-bold letter-spacing-1 text-monospace"><i class="fas fa-envelope fa-fw mr-2 text-primary opacity-50"></i> {{ $booking->email }}</p>
                                    <p class="mb-0 text-muted smallest font-weight-bold letter-spacing-1 text-monospace"><i class="fas fa-phone fa-fw mr-2 text-primary opacity-50"></i> {{ $booking->phone ?? __('N/A') }}</p>
                                </div>
                            </div>
                        </div>

                        @if($booking->message)
                            <div class="mt-4 p-4 rounded-xl border-0 shadow-xs premium-note-block">
                                <h6 class="smallest text-uppercase font-weight-bold text-primary mb-3 letter-spacing-1">
                                    <i class="fas fa-comment-dots mr-2"></i> {{ __('Client Special Directives') }}
                                </h6>
                                <p class="mb-0 text-dark font-italic small leading-relaxed">"{{ $booking->message }}"</p>
                            </div>
                        @endif
                    </div>
                </div>

                {{-- Financial Ledger --}}
                <div class="card card-premium shadow-sm border-0 overflow-hidden">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                            <i class="fas fa-receipt mr-2 text-primary opacity-50"></i> {{ __('Fiscal Reconciliation') }}
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover table-premium mb-0">
                                <thead class="thead-light">
                                    <tr>
                                        <th class="pl-4 py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">{{ __('Service Description') }}</th>
                                        <th class="text-right pr-4 py-3 smallest text-uppercase font-weight-bold letter-spacing-1 text-secondary border-0">{{ __('Settlement Amount') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($booking->transactionLines as $line)
                                        <tr>
                                            <td class="pl-4 py-3 text-dark font-weight-bold smallest uppercase letter-spacing-1">{{ $line->description }}</td>
                                            <td class="text-right pr-4 font-weight-bold text-dark h6 mb-0">${{ number_format($line->amount, 2) }}</td>
                                        </tr>
                                    @empty
                                        <tr>
                                            <td class="pl-4 py-4 text-dark font-weight-bold smallest uppercase letter-spacing-1">
                                                <i class="fas fa-bed mr-2 text-primary opacity-50"></i> Standard Lodging Rate
                                            </td>
                                            <td class="text-right pr-4 font-weight-bold text-dark h6 mb-0">${{ number_format($booking->total_price, 2) }}</td>
                                        </tr>
                                    @endforelse
                                </tbody>
                                <tfoot class="bg-light">
                                    <tr>
                                        <th class="pl-4 py-4 text-uppercase smallest font-weight-bold letter-spacing-2 text-dark">{{ __('Aggregate Revenue Protocol') }}</th>
                                        <th class="text-right pr-4 py-4 text-xl font-weight-bold text-success">${{ number_format($booking->total_price, 2) }}</th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Oversight Column --}}
            <div class="col-md-4">
                {{-- Account Integrity --}}
                <div class="card card-premium shadow-sm mb-4 border-0 overflow-hidden text-center">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-user-shield mr-2 text-primary opacity-50"></i> Principal Integrity
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        @if($booking->user)
                            <div class="mb-4 d-inline-block p-1 rounded-circle border shadow-sm bg-white">
                                <img src="https://ui-avatars.com/api/?name={{ urlencode($booking->user->name) }}&background=46a5ac&color=fff&bold=true" class="rounded-circle icon-box-lg">
                            </div>
                            <h6 class="font-weight-bold text-dark mb-1 smallest uppercase letter-spacing-1">{{ $booking->user->name }}</h6>
                            <p class="text-muted smallest font-weight-bold letter-spacing-1 text-monospace mb-4">{{ $booking->user->email }}</p>
                            <a href="{{ route('admin.users.show', $booking->user_id) }}" class="btn btn-primary-soft rounded-pill btn-block font-weight-bold smallest py-2 letter-spacing-1 uppercase shadow-xs">
                                <i class="fas fa-external-link-alt mr-2"></i> Inspect Profile
                            </a>
                        @else
                            <div class="text-muted py-4 text-center">
                                <div class="icon-box-soft bg-light mx-auto mb-3 shadow-xs d-flex align-items-center justify-content-center icon-box-lg">
                                    <i class="fas fa-user-slash text-muted h4 mb-0"></i>
                                </div>
                                <p class="font-weight-bold text-muted smallest text-uppercase letter-spacing-2 mb-0">{{ __('External Guest submission') }}</p>
                                <p class="smallest text-muted mt-2 opacity-75">No synchronized platform account found.</p>
                            </div>
                        @endif
                    </div>
                </div>

                {{-- Collection Intelligence --}}
                @php
                    $totalPaid = $booking->payments->sum('amount');
                    $balance = $booking->total_price - $totalPaid;
                    $paymentPercent = $booking->total_price > 0 ? ($totalPaid / $booking->total_price) * 100 : 0;
                @endphp
                
                <div class="card card-premium shadow-sm border-0 overflow-hidden">
                    <div class="card-header border-0 bg-white py-3 px-4 border-bottom">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-wallet mr-2 text-primary opacity-50"></i> Collection Status
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1">{{ __('Paid Capital') }}</span>
                            <span class="font-weight-bold text-dark smallest uppercase letter-spacing-1">{{ round($paymentPercent) }}%</span>
                        </div>
                        <div class="progress progress-sm mb-4 shadow-xs progress-premium">
                            <div class="progress-bar bg-success rounded-pill" role="progressbar" style="width: {{ $paymentPercent }}%;"></div>
                        </div>
                        
                        <div class="p-3 rounded-xl bg-light border shadow-xs">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <span class="smallest font-weight-bold text-secondary uppercase letter-spacing-1">{{ __('Settle Capital') }}</span>
                                <span class="text-success font-weight-bold smallest uppercase letter-spacing-1 text-monospace">${{ number_format($totalPaid, 2) }}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-0 pb-0">
                                <span class="smallest font-weight-bold text-secondary uppercase letter-spacing-1">{{ __('Outstanding') }}</span>
                                <span class="{{ $balance > 0 ? 'text-danger' : 'text-success' }} font-weight-bold smallest uppercase letter-spacing-1 text-monospace">${{ number_format($balance, 2) }}</span>
                            </div>
                        </div>

                        @if($balance > 0)
                            <div class="mt-4 p-3 bg-danger-soft rounded-xl text-center border-danger-soft">
                                <p class="mb-0 smallest font-weight-bold text-danger text-uppercase letter-spacing-2">
                                    <i class="fas fa-exclamation-circle mr-2"></i> Collection Pending
                                </p>
                            </div>
                        @else
                            <div class="mt-4 p-3 bg-success-soft rounded-xl text-center border-success-soft">
                                <p class="mb-0 smallest font-weight-bold text-success text-uppercase letter-spacing-2">
                                    <i class="fas fa-check-double mr-2"></i> Revenue Secured
                                </p>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@section('css')
<style>
    /* View-specific print overrides can stay, but general layout goes to style.css */
</style>
@endsection
