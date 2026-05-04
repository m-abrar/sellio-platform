@extends('adminlte::page')

@section('title', __('Service Appointment') . ' #' . $appointment->id . ' | Service Intelligence')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary opacity-50"></i> {{ __('Appointment Protocol') }}
                    <small class="text-muted font-weight-bold opacity-75 text-monospace">#{{ $appointment->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Operational manifest for scheduled service fulfillment and technician dispatch.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.service-bookings.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-calendar-check mr-2"></i> Back to Ledger
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            {{-- Service Intelligence --}}
            <div class="col-md-8">
                <div class="card card-premium shadow-sm border-0 overflow-hidden mb-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Fulfillment Intelligence') }}
                        </h3>
                        @php
                            $statusMap = [
                                'pending' => 'badge-warning-light text-warning',
                                'confirmed' => 'badge-success-light text-success',
                                'cancelled' => 'badge-danger-light text-danger',
                                'completed' => 'badge-primary-light text-primary'
                            ];
                            $statusClass = $statusMap[$appointment->status] ?? 'badge-info-light text-info';
                        @endphp
                        <span class="badge {{ $statusClass }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                            {{ $appointment->status }}
                        </span>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="row mb-4 pb-4 border-bottom">
                            <div class="col-sm-6">
                                <label class="smallest font-weight-bold text-secondary text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Provisioned Service') }}</label>
                                <div class="d-flex align-items-center">
                                    <div class="icon-box-soft bg-primary-soft mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; border-radius: 12px;">
                                        <i class="fas fa-toolbox text-primary"></i>
                                    </div>
                                    <div>
                                        <p class="h6 font-weight-bold text-dark mb-1">{{ $appointment->service->title ?? __('N/A') }}</p>
                                        <span class="text-muted smallest font-weight-bold uppercase letter-spacing-1">ID Protocol: #{{ $appointment->service_id ?? '0' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 text-sm-right">
                                <label class="smallest font-weight-bold text-secondary text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Fulfillment window') }}</label>
                                <div class="h6 font-weight-bold text-dark mb-1 uppercase letter-spacing-1">
                                    <i class="far fa-calendar-alt mr-2 text-primary opacity-50"></i>
                                    {{ $appointment->scheduled_at ? $appointment->scheduled_at->format('l, M d, Y') : __('Temporal Range TBD') }}
                                </div>
                                <div class="text-primary font-weight-bold smallest uppercase letter-spacing-1">
                                    <i class="far fa-clock mr-2"></i>
                                    {{ $appointment->scheduled_at ? $appointment->scheduled_at->format('H:i A') : '00:00 UTC' }}
                                </div>
                            </div>
                        </div>

                        <div class="bg-light p-4 rounded-xl border shadow-xs mb-4" style="border-left: 4px solid var(--primary) !important;">
                            <h6 class="font-weight-bold text-dark mb-3 smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-signature mr-2 text-primary opacity-50"></i>{{ __('Client Manifest Directives') }}
                            </h6>
                            <div class="text-dark small" style="line-height: 1.6; font-style: italic;">
                                "{{ $appointment->notes ?? __('No specific operational instructions were synchronized for this dispatch request.') }}"
                            </div>
                        </div>

                        <div class="row align-items-center pt-3">
                            <div class="col-sm-6">
                                <div class="d-flex align-items-center">
                                    <div class="icon-box-soft bg-success-soft text-success mr-3 shadow-xs d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; border-radius: 12px;">
                                        <i class="fas fa-file-invoice-dollar h5 mb-0"></i>
                                    </div>
                                    <div>
                                        <label class="smallest font-weight-bold text-secondary text-uppercase mb-1 d-block letter-spacing-1">{{ __('Estimated Revenue') }}</label>
                                        <div class="h5 font-weight-bold text-success mb-0 text-monospace">${{ number_format($appointment->price, 2) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 text-sm-right">
                                <div class="smallest text-secondary text-uppercase font-weight-bold mb-1 letter-spacing-1">{{ __('Audit Verification') }}</div>
                                <div class="smallest font-weight-bold text-dark uppercase letter-spacing-1">
                                    <i class="far fa-check-circle mr-1 text-success opacity-75"></i> 
                                    {{ $appointment->viewed_at ? $appointment->viewed_at->format('M d, Y • H:i') : __('Registry Awaiting Inspection') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Stakeholder Profile --}}
            <div class="col-md-4">
                <div class="card card-premium shadow-sm border-0 overflow-hidden mb-4 text-center">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark smallest text-uppercase letter-spacing-1 mb-0">
                            <i class="fas fa-user-shield mr-2 text-primary opacity-50"></i> {{ __('Principal Identity') }}
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="position-relative d-inline-block mb-4 p-1 rounded-circle border shadow-sm bg-white">
                            <img class="rounded-circle"
                                 src="https://ui-avatars.com/api/?name={{ urlencode($appointment->user->name) }}&background=46a5ac&color=fff&bold=true"
                                 style="width: 84px; height: 84px; object-fit: cover;"
                                 alt="Principal">
                            <div class="bg-success position-absolute border border-white" style="width: 16px; height: 16px; border-radius: 50%; bottom: 4px; right: 4px; border-width: 3px !important;"></div>
                        </div>
                        
                        <h6 class="font-weight-bold text-dark mb-1 smallest uppercase letter-spacing-1">{{ $appointment->user->name }}</h6>
                        <p class="text-muted smallest font-weight-bold letter-spacing-1 text-monospace mb-4">{{ $appointment->user->email }}</p>

                        <div class="bg-light p-3 rounded-xl border shadow-xs mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="smallest font-weight-bold text-secondary uppercase letter-spacing-1">{{ __('Communications') }}</span>
                                <span class="smallest font-weight-bold text-dark text-monospace">{{ $appointment->user->phone ?? __('N/A') }}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-0 pb-0">
                                <span class="smallest font-weight-bold text-secondary uppercase letter-spacing-1">{{ __('Lifecycle Origin') }}</span>
                                <span class="smallest font-weight-bold text-dark uppercase letter-spacing-1">{{ $appointment->user->created_at->format('M Y') }}</span>
                            </div>
                        </div>

                        <a href="{{ route('admin.users.show', $appointment->user_id) }}" class="btn btn-primary-soft rounded-pill btn-block py-2 font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                            <i class="fas fa-id-badge mr-2"></i> {{ __('Inspect Full Profile') }}
                        </a>
                    </div>
                </div>

                <div class="card card-premium shadow-sm border-0">
                    <div class="card-body p-4 d-flex align-items-center bg-white" style="border-radius: 12px;">
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
    .bg-primary-soft { background: rgba(70, 165, 172, 0.1) !important; }
    .bg-success-soft { background: rgba(34, 197, 94, 0.1) !important; }
    .bg-info-light { background: rgba(23, 162, 184, 0.1) !important; }
    .rounded-xl { border-radius: 12px !important; }
</style>
@endsection
