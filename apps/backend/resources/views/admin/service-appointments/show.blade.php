@extends('adminlte::page')

@section('title', __('Service Appointment') . ' #' . $appointment->id)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-concierge-bell mr-2 text-primary"></i> {{ __('Appointment Details') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Operational manifest for scheduled service fulfillment.</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.bookings.index') }}" class="btn btn-back shadow-sm rounded-pill px-4">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO REGISTRY
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            {{-- Left Side: Appointment & Service Info --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Service Intelligence') }}
                        </h3>
                        <span class="badge {{ $appointment->getStatusBadgeClass() }} px-3 py-2 rounded-pill font-weight-bold smallest">
                            {{ Str::upper($appointment->status) }}
                        </span>
                    </div>
                    <div class="card-body p-4">
                        <div class="row mb-4">
                            <div class="col-sm-6">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Provisioned Service') }}</label>
                                <p class="h4 font-weight-bold text-dark mb-0">{{ $appointment->service->title ?? __('N/A') }}</p>
                                <small class="text-muted">ID: #{{ $appointment->service_id ?? '0' }}</small>
                            </div>
                            <div class="col-sm-6 text-sm-right">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Fulfillment Window') }}</label>
                                <div class="h5 font-weight-bold text-dark mb-1">
                                    <i class="far fa-calendar-alt mr-1 text-primary"></i>
                                    {{ $appointment->scheduled_at ? $appointment->scheduled_at->format('l, M d, Y') : __('TBD') }}
                                </div>
                                <div class="text-primary font-weight-bold small">
                                    <i class="far fa-clock mr-1"></i>
                                    {{ $appointment->scheduled_at ? $appointment->scheduled_at->format('H:i A') : '' }}
                                </div>
                            </div>
                        </div>

                        <div class="bg-light p-4 rounded-xl border mb-4">
                            <h6 class="font-weight-bold text-dark mb-3 smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-sticky-note mr-2 text-muted"></i>{{ __('Operational Notes') }}
                            </h6>
                            <div class="text-muted" style="line-height: 1.6;">
                                {{ $appointment->notes ?? __('No additional specific instructions provided for this appointment.') }}
                            </div>
                        </div>

                        <div class="row align-items-center pt-3 border-top">
                            <div class="col-sm-6">
                                <div class="d-flex align-items-center">
                                    <div class="icon-circle bg-success-soft text-success mr-3" style="width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                                        <i class="fas fa-dollar-sign"></i>
                                    </div>
                                    <div>
                                        <label class="smallest font-weight-bold text-muted text-uppercase mb-0">{{ __('Service Quote') }}</label>
                                        <div class="h4 font-weight-bold text-success mb-0">{{ number_format($appointment->price, 2) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-6 text-sm-right">
                                <div class="smallest text-muted text-uppercase font-weight-bold mb-1">{{ __('Audit Timestamp') }}</div>
                                <div class="small font-weight-bold text-dark">
                                    <i class="far fa-eye mr-1 opacity-50"></i> 
                                    {{ $appointment->viewed_at ? $appointment->viewed_at->format('M d, Y @ H:i') : __('Awaiting Verification') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Right Side: Customer Info --}}
            <div class="col-md-4">
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 20px;">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0" style="letter-spacing: 1px;">
                            <i class="fas fa-user-circle mr-2 text-primary opacity-50"></i> {{ __('Stakeholder Profile') }}
                        </h3>
                    </div>
                    <div class="card-body p-4 text-center">
                        <div class="position-relative d-inline-block mb-4">
                            <img class="rounded-circle shadow-sm border border-white border-4"
                                 src="https://ui-avatars.com/api/?name={{ urlencode($appointment->user->name) }}&background=46a5ac&color=fff"
                                 style="width: 100px; height: 100px; object-fit: cover;"
                                 alt="Avatar">
                            <div class="bg-success position-absolute" style="width: 18px; height: 18px; border-radius: 50%; bottom: 5px; right: 5px; border: 3px solid #fff;"></div>
                        </div>
                        
                        <h4 class="font-weight-bold text-dark mb-1">{{ $appointment->user->name }}</h4>
                        <p class="text-muted small mb-4">{{ $appointment->user->email }}</p>

                        <div class="bg-light p-3 rounded-xl border mb-4">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="smallest font-weight-bold text-muted uppercase">{{ __('Contact') }}</span>
                                <span class="smallest font-weight-bold text-dark">{{ $appointment->user->phone ?? __('N/A') }}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="smallest font-weight-bold text-muted uppercase">{{ __('Tenure') }}</span>
                                <span class="smallest font-weight-bold text-dark">{{ $appointment->user->created_at->format('M Y') }}</span>
                            </div>
                        </div>

                        <a href="{{ route('admin.users.show', $appointment->user_id) }}" class="btn btn-primary btn-block rounded-pill py-2 font-weight-bold smallest uppercase letter-spacing-1">
                            <i class="fas fa-external-link-alt mr-1"></i> {{ __('Examine Full Profile') }}
                        </a>
                    </div>
                </div>

                <div class="card border-0 shadow-premium" style="border-radius: 20px;">
                    <div class="card-body p-4 d-flex align-items-center">
                        <div class="mr-3 icon-circle bg-primary-soft text-primary shadow-xs" style="width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <h6 class="font-weight-bold text-dark mb-0">Record Integrity</h6>
                            <p class="smallest text-muted mb-0">This entry is immutable and audited via system logs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    .rounded-xl { border-radius: 16px !important; }
    .bg-success-soft { background-color: rgba(34, 197, 94, 0.12) !important; }
</style>
@endpush
