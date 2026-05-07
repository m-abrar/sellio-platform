{{--
    Administrative Automotive: Lead Operational Intelligence
    
    This view provides a comprehensive 360-degree visualization of a 
    specific vehicle purchase inquiry. It aggregates vehicle interest 
    parameters, lead narratives, and verified contact credentials, 
    facilitating direct engagement through integrated communication 
    quick-links.
    
    @extends adminlte::page
    @context Automotive Lead Management
    @variables AutoInquiry $inquiry The inquiry model instance.
--}}
@extends('adminlte::page')

@section('title', __('Auto Inquiry') . ' #' . $inquiry->id)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-car mr-2 text-danger"></i> {{ __('Vehicle Inquiry Details') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">High-intent lead manifest for automotive procurement.</p>
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
            {{-- Vehicle & Inquiry Details --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 letter-spacing-1">
                            <i class="fas fa-search mr-2 text-danger opacity-50"></i> {{ __('Vehicle Interest Intelligence') }}
                        </h3>
                        <span class="badge {{ $inquiry->getStatusBadgeClass() }} px-3 py-2 rounded-pill font-weight-bold smallest">
                            {{ Str::upper($inquiry->status) }}
                        </span>
                    </div>
                    <div class="card-body p-4">
                        <div class="row mb-4">
                            <div class="col-sm-7">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Interested Vehicle') }}</label>
                                <p class="h4 font-weight-bold text-danger mb-0">{{ $inquiry->auto->title ?? __('N/A') }}</p>
                                <small class="text-muted">ID: #{{ $inquiry->auto_id ?? '0' }}</small>
                            </div>
                            <div class="col-sm-5 text-sm-right">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Inquiry Received') }}</label>
                                <div class="h5 font-weight-bold text-dark mb-1">
                                    <i class="far fa-calendar-alt mr-1 text-danger"></i>
                                    {{ $inquiry->created_at->format('M d, Y') }}
                                </div>
                                <div class="text-danger font-weight-bold small">
                                    <i class="far fa-clock mr-1"></i>
                                    {{ $inquiry->created_at->format('H:i A') }}
                                </div>
                            </div>
                        </div>

                        <div class="bg-light p-4 rounded-xl border mb-0">
                            <h6 class="font-weight-bold text-dark mb-3 smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-comment-alt mr-2 text-muted"></i>{{ __('Lead Narrative') }}
                            </h6>
                            <div class="text-muted italic leading-relaxed font-italic">
                                @if($inquiry->message)
                                    "{{ $inquiry->message }}"
                                @else
                                    <em class="text-muted">{{ __('No specific message provided by the potential buyer.') }}</em>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Operational Intelligence --}}
                <div class="card border-0 shadow-premium rounded-20">
                    <div class="card-body p-4 d-flex align-items-center">
                        <div class="mr-3 icon-circle bg-danger-soft text-danger shadow-xs icon-box-md">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div>
                            <h6 class="font-weight-bold text-dark mb-0">Lead Integrity Verification</h6>
                            <p class="smallest text-muted mb-0">Automated lead scoring: High Intent. Verified contact credentials indexed.</p>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Lead Contact Sidebar --}}
            <div class="col-md-4">
                <div class="card border-0 shadow-premium overflow-hidden mb-4 rounded-20">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h3 class="card-title font-weight-bold text-dark text-uppercase smallest mb-0 letter-spacing-1">
                            <i class="fas fa-user-tag mr-2 text-danger opacity-50"></i> {{ __('Lead Information') }}
                        </h3>
                    </div>
                    <div class="card-body p-4 text-center">
                        <div class="position-relative d-inline-block mb-4">
                            <img src="https://ui-avatars.com/api/?name={{ urlencode($inquiry->full_name ?? 'Lead') }}&background=dc3545&color=fff"
                                 class="rounded-circle shadow-sm border border-white border-4 icon-box-lg"
                                 alt="Avatar">
                            <div class="bg-success position-absolute" style="width: 18px; height: 18px; border-radius: 50%; bottom: 5px; right: 5px; border: 3px solid #fff;"></div>
                        </div>
                        
                        <h4 class="font-weight-bold text-dark mb-1">{{ $inquiry->full_name }}</h4>
                        <p class="text-muted small mb-4">{{ $inquiry->email }}</p>

                        <div class="bg-light p-3 rounded-xl border mb-4">
                            <div class="d-flex justify-content-between mb-2 border-bottom pb-2">
                                <span class="smallest font-weight-bold text-muted uppercase">{{ __('Lead Contact') }}</span>
                                <span class="smallest font-weight-bold text-dark">{{ $inquiry->phone ?? __('N/A') }}</span>
                            </div>
                            <div class="d-flex justify-content-between pt-2">
                                <span class="smallest font-weight-bold text-muted uppercase">{{ __('Registry Date') }}</span>
                                <span class="smallest font-weight-bold text-dark">{{ $inquiry->created_at->format('M Y') }}</span>
                            </div>
                        </div>

                        @if($inquiry->user_id)
                            <a href="{{ route('admin.users.show', $inquiry->user_id) }}" class="btn btn-danger btn-block rounded-pill py-2 font-weight-bold smallest uppercase letter-spacing-1">
                                <i class="fas fa-user-shield mr-1"></i> {{ __('Inspect Identity Profile') }}
                            </a>
                        @else
                            <button class="btn btn-light btn-block rounded-pill py-2 font-weight-bold smallest uppercase letter-spacing-1 disabled">
                                <i class="fas fa-user-secret mr-1"></i> {{ __('Anonymous Lead') }}
                            </button>
                        @endif
                    </div>
                </div>

                {{-- Action QuickLinks --}}
                <div class="card border-0 shadow-premium overflow-hidden rounded-20">
                    <div class="card-body p-0">
                        <a href="mailto:{{ $inquiry->email }}" class="btn btn-block btn-white border-0 py-3 font-weight-bold smallest text-uppercase text-danger">
                            <i class="fas fa-envelope mr-2"></i> {{ __('Transmit Email') }}
                        </a>
                        <div class="border-top"></div>
                        @if($inquiry->phone)
                            <a href="tel:{{ $inquiry->phone }}" class="btn btn-block btn-white border-0 py-3 font-weight-bold smallest text-uppercase text-success">
                                <i class="fas fa-phone mr-2"></i> {{ __('Initiate Call') }}
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
<style>
    .btn-white { background: #fff !important; color: #334155; }
    .btn-white:hover { background: #f8fafc !important; }
</style>
@endpush
