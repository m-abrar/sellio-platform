{{--
    Administrative Services: Lead Details
    
    This view provides a comprehensive 360-degree visualization of a 
    specific service quote inquiry. It aggregates service scope 
    requirements, financial estimates (quoted price), customer identity 
    profiles, and audit trails to ensure transparent and efficient 
    lead evaluation and revenue tracking.
    
    @extends adminlte::page
    @context Service Quote Management
    @variables ServiceQuote $quote The quote model instance.
--}}
@extends('adminlte::page')

@section('title', __('Service Quote') . ' #' . $quote->id)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice mr-2 text-primary"></i> {{ __('Quote Manifest') }} <small class="text-muted ml-2">#{{ $quote->id }}</small>
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Review service scope, pricing estimates, and customer requirements for operational fulfillment.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.bookings.services') }}" class="btn btn-back shadow-sm rounded-pill px-4 py-2 font-weight-bold smallest uppercase letter-spacing-1">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to List') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content_header_breadcrumbs')
@stop

@section('content')
    <div class="container-fluid pb-5">
        @include('admin.alert')

        <div class="row">
            {{-- Left Column: Quote & Service Details --}}
            <div class="col-md-8">

                {{-- Quote Details Card --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center justify-content-between">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0 ls-1">
                            <i class="fas fa-tools mr-2 text-primary opacity-50"></i> {{ __('Service & Scope') }}
                        </h5>
                        <div class="card-tools">
                            @php
                                $statusMap = [
                                    'pending'  => 'badge-warning',
                                    'quoted'   => 'badge-info',
                                    'accepted' => 'badge-success',
                                    'rejected' => 'badge-danger',
                                ];
                                $statusClass = $statusMap[$quote->status] ?? 'badge-secondary';
                            @endphp
                            <span class="badge {{ $statusClass }}-light text-{{ str_replace('badge-', '', $statusClass) }} px-3 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs">
                                {{ strtoupper($quote->status) }}
                            </span>
                        </div>
                    </div>
                    <div class="card-body px-4 pb-4">
                        <div class="row mb-4">
                            <div class="col-sm-7">
                                <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-2 d-block">{{ __('Service Requested') }}</label>
                                <h4 class="text-primary font-weight-bold mb-1">
                                    {{ $quote->service->title ?? __('N/A') }}
                                </h4>
                                <span class="badge badge-light border text-muted smallest uppercase font-weight-bold px-2">ID: #{{ $quote->service_id }}</span>
                            </div>
                            <div class="col-sm-5 text-sm-right border-left pl-md-4">
                                <div class="mb-3">
                                    <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-1 d-block">{{ __('Submission Info') }}</label>
                                    <p class="font-weight-bold text-dark mb-0 smallest">{{ $quote->created_at->format('M d, Y @ H:i') }}</p>
                                </div>
                                @if($quote->requested_date)
                                    <div>
                                        <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-1 d-block">{{ __('Desired Start Date') }}</label>
                                        <span class="badge badge-primary-soft text-primary px-3 py-1 rounded-pill font-weight-bold smallest uppercase">{{ $quote->requested_date->format('M d, Y') }}</span>
                                    </div>
                                @endif
                            </div>
                        </div>

                        @if($quote->scope_size)
                            <div class="p-3 bg-light rounded-xl border mb-4 d-inline-flex align-items-center">
                                <i class="fas fa-ruler-combined mr-3 text-primary opacity-50"></i>
                                <div>
                                    <label class="smallest font-weight-bold text-muted text-uppercase letter-spacing-1 mb-0 d-block">{{ __('Project Scope') }}</label>
                                    <span class="font-weight-bold text-dark text-capitalize">{{ $quote->scope_size }}</span>
                                </div>
                            </div>
                        @endif

                        <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft mt-2">
                            <h6 class="font-weight-bold text-primary text-uppercase smallest letter-spacing-1 mb-3">
                                <i class="fas fa-comment-alt mr-2"></i> {{ __('Requirements & Details') }}
                            </h6>
                            <div class="text-dark font-weight-500 leading-1-8 fs-1-05 pre-wrap">
                                @if($quote->details)
                                    {!! nl2br(e($quote->details)) !!}
                                @else
                                    <em class="text-muted smallest uppercase letter-spacing-1">{{ __('No specific functional requirements provided.') }}</em>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Quoted Price Card --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0 ls-1">
                            <i class="fas fa-dollar-sign mr-2 text-primary opacity-50"></i> {{ __('Financial Estimate') }}
                        </h5>
                    </div>
                    <div class="card-body px-4 pb-4">
                        @if($quote->quoted_price)
                            <div class="text-center py-4 bg-success-soft rounded-xl border border-success-soft shadow-xs">
                                <p class="smallest font-weight-bold text-success text-uppercase letter-spacing-1 mb-2">{{ __('Current Quoted Price') }}</p>
                                <h2 class="text-success font-weight-bold mb-0 fs-3-5 ls-neg-2">
                                    ${{ number_format($quote->quoted_price, 2) }}
                                </h2>
                                <p class="text-muted smallest font-weight-bold uppercase mt-3 mb-0">
                                    <i class="fas fa-check-circle mr-1"></i> {{ __('Proposal transmitted to customer') }}
                                </p>
                            </div>
                        @else
                            <div class="text-center py-5 bg-light rounded-xl border border-dashed shadow-xs">
                                <div class="icon-circle bg-white text-muted mx-auto mb-3 shadow-xs icon-box-60 d-flex align-items-center justify-content-center rounded-circle">
                                    <i class="fas fa-hourglass-half fa-lg"></i>
                                </div>
                                <h6 class="font-weight-bold text-dark mb-1">{{ __('Awaiting Financial Proposal') }}</h6>
                                <p class="text-muted smallest uppercase letter-spacing-1 mb-0">{{ __('The service partner has not yet issued a formal quote.') }}</p>
                            </div>
                        @endif
                    </div>
                </div>

            </div>

            {{-- Right Sidebar: Customer Information --}}
            <div class="col-md-4">
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0 ls-1">
                            <i class="fas fa-user-tag mr-2 text-primary opacity-50"></i> {{ __('Client Identity') }}
                        </h5>
                    </div>
                    <div class="card-body px-4 pb-4 text-center">
                        @if($quote->user)
                            <div class="position-relative d-inline-block mb-3">
                                <img src="{{ $quote->user->avatar_url }}" 
                                     class="img-circle shadow-premium border-4-fff icon-box-90">
                            </div>
                            <h5 class="font-weight-bold text-dark mb-1">{{ $quote->user->name }}</h5>
                            <p class="text-muted smallest font-weight-bold uppercase letter-spacing-1 mb-4">{{ $quote->user->email }}</p>
                            
                            <div class="text-left mb-4">
                                <div class="px-3 py-2 bg-light rounded-xl border mb-2 d-flex justify-content-between align-items-center">
                                    <span class="smallest font-weight-bold text-muted uppercase">{{ __('Client ID') }}</span>
                                    <span class="smallest font-weight-bold text-dark text-monospace">#USER-{{ str_pad($quote->user_id, 4, '0', STR_PAD_LEFT) }}</span>
                                </div>
                                <div class="px-3 py-2 bg-light rounded-xl border d-flex justify-content-between align-items-center">
                                    <span class="smallest font-weight-bold text-muted uppercase">{{ __('Onboarded') }}</span>
                                    <span class="smallest font-weight-bold text-dark">{{ $quote->user->created_at->format('M Y') }}</span>
                                </div>
                            </div>
                            
                            <a href="{{ route('admin.users.show', $quote->user_id) }}" class="btn btn-white btn-block rounded-pill shadow-xs font-weight-bold smallest uppercase letter-spacing-1 py-2">
                                <i class="fas fa-external-link-alt mr-1 text-primary"></i> {{ __('View Deep Profile') }}
                            </a>
                        @else
                            <div class="text-center py-4 text-muted">
                                <i class="fas fa-user-slash fa-3x mb-3 d-block text-gray"></i>
                                <p class="smallest font-weight-bold uppercase letter-spacing-1">{{ __('Guest / Inactive Account') }}</p>
                            </div>
                        @endif
                    </div>
                </div>

                {{-- Meta Info Card --}}
                <div class="card card-premium shadow-premium border-0 overflow-hidden mb-4 rounded-24">
                    <div class="card-header border-0 bg-white py-4 px-4">
                        <h5 class="card-title font-weight-bold text-dark text-uppercase mb-0 ls-1">
                            <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('Audit & Meta') }}
                        </h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">{{ __('Service Tier') }}</span>
                            <span class="smallest font-weight-bold text-dark">{{ $quote->service_package_id ? '#' . $quote->service_package_id : __('Standard') }}</span>
                        </div>
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">{{ __('Review State') }}</span>
                            <span>
                                @if($quote->viewed_at)
                                    <span class="badge badge-success-light text-success px-2 py-1 rounded-pill smallest font-weight-bold">
                                        <i class="fas fa-check mr-1"></i> {{ $quote->viewed_at->diffForHumans() }}
                                    </span>
                                @else
                                    <span class="badge badge-warning-light text-warning px-2 py-1 rounded-pill smallest font-weight-bold">
                                        <i class="fas fa-clock mr-1"></i> {{ __('Awaiting Review') }}
                                    </span>
                                @endif
                            </span>
                        </div>
                        <div class="px-4 py-3 border-bottom d-flex justify-content-between align-items-center">
                            <span class="smallest font-weight-bold text-muted uppercase">{{ __('Last Pulse') }}</span>
                            <span class="smallest font-weight-bold text-dark">{{ $quote->updated_at->format('M d, Y') }}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0 py-4 px-4">
                        <form action="{{ route('admin.service-quotes.destroy', $quote->id) }}"
                              method="POST"
                              id="delete-quote-form">
                            @csrf
                            @method('DELETE')
                            <button type="button" class="btn btn-white btn-block rounded-pill border font-weight-bold smallest uppercase text-danger py-2" 
                                    onclick="confirmDelete('delete-quote-form', 'Purge Quote Request?', 'This will permanently remove the inquiry from the registry.', 'Purge')">
                                <i class="fas fa-trash-alt mr-1"></i> {{ __('Delete Record') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop

@push('css')
@include('admin._partials._toggle-card-css')
@endpush

@section('js')
@include('admin._partials._sweetalert')
@stop
