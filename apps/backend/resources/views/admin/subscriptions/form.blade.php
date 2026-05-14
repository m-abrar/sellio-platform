{{--
    Administrative Financial Module: Subscription Enrollment Configuration
    
    This view serves as the primary interface for managing active user 
    subscriptions. It orchestrates user account linkage, service tier 
    assignment (plans), temporal parameters (start/end dates), and 
    lifecycle status management, ensuring precise administrative 
    oversight of the platform's recurring revenue memberships.
    
    @extends adminlte::page
    @context Financial Management
    @variables Subscription $subscription The subscription model instance.
    @variables Collection $users Available customer accounts.
    @variables Collection $plans Available service tiers.
--}}
@extends('adminlte::page')

@section('title', ($subscription->exists ? __('Edit') : __('Add')) . ' ' . __('Subscription') . ' | ' . __('Enrollment Architect'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-file-invoice-dollar mr-2 text-primary opacity-50"></i> 
                    {{ $subscription->exists ? __('Modify Enrollment') : __('Initialize Subscription') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $subscription->exists ? __('Update membership parameters, access durations, and service tiers.') : __('Enroll a new user into a service tier with specific access permissions.') }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center" style="gap: 12px;">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> {{ __('Dashboard') }}
                    </a>
                    <a href="{{ route('admin.subscriptions.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-arrow-left"></i> {{ __('Back to List') }}
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="subscription-form" 
          action="{{ $subscription->exists ? route('admin.subscriptions.update', $subscription->id) : route('admin.subscriptions.store') }}" 
          method="POST">
        @csrf
        @if($subscription->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column --}}
            <div class="col-md-8">
                <div class="nav-pills-wrapper mb-4">
                    <ul class="nav nav-pills p-1 bg-white shadow-sm rounded-pill border nav-pills-premium" id="subscriptionTabs" role="tablist" style="width: fit-content;">
                        <li class="nav-item">
                            <a class="nav-link active px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" id="details-tab" data-toggle="tab" href="#details" role="tab">
                                <i class="fas fa-info-circle mr-2"></i> {{ __('Enrollment Info') }}
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" id="settings-tab" data-toggle="tab" href="#settings" role="tab">
                                <i class="fas fa-cogs mr-2"></i> {{ __('Configuration') }}
                            </a>
                        </li>
                        @if($subscription->exists)
                        <li class="nav-item">
                            <a class="nav-link px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" id="payments-tab" data-toggle="tab" href="#payments" role="tab">
                                <i class="fas fa-history mr-2"></i> {{ __('Revenue Log') }}
                            </a>
                        </li>
                        @endif
                    </ul>
                </div>

                <div class="tab-content" id="subscriptionTabContent">
                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        <div class="card card-premium mb-4">
                            <div class="card-header bg-white border-0 py-4 px-4">
                                <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                                    <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> {{ __('Subscription Parameters') }}
                                </h3>
                            </div>
                            <div class="card-body p-4">
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-4">
                                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;" id="user-select-label" data-placeholder="{{ __('Select an account...') }}">{{ __('Customer Account') }} <span class="text-danger">*</span></label>
                                            <div class="input-group border rounded p-1 shadow-xs bg-white">
                                                <div class="input-group-prepend border-0">
                                                    <span class="input-group-text bg-white border-0"><i class="fas fa-user text-primary"></i></span>
                                                </div>
                                                <select name="user_id" class="form-control border-0 select2" required>
                                                    @foreach($users as $user)
                                                        <option value="{{ $user->id }}" {{ old('user_id', $subscription->user_id ?? '') == $user->id ? 'selected' : '' }}>
                                                            {{ $user->name }} ({{ $user->email }})
                                                        </option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-4">
                                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Service Tier') }} <span class="text-danger">*</span></label>
                                            <div class="input-group border rounded p-1 shadow-xs bg-white">
                                                <div class="input-group-prepend border-0">
                                                    <span class="input-group-text bg-white border-0"><i class="fas fa-layer-group text-primary"></i></span>
                                                </div>
                                                <select name="plan_id" class="form-control border-0" required>
                                                    @foreach($plans as $plan)
                                                        <option value="{{ $plan->id }}" {{ old('plan_id', $subscription->plan_id ?? '') == $plan->id ? 'selected' : '' }}>
                                                            {{ $plan->title }} ({{ strtoupper(__($plan->billing_cycle ?? 'Tier')) }})
                                                        </option>
                                                    @endforeach
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group mb-4">
                                    <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Reference Label') }} <span class="text-danger">*</span></label>
                                    <div class="input-group border rounded p-1 shadow-xs bg-white">
                                        <div class="input-group-prepend border-0">
                                            <span class="input-group-text bg-white border-0"><i class="fas fa-tag text-primary"></i></span>
                                        </div>
                                        <input type="text" name="title" class="form-control border-0" placeholder="{{ __('e.g. main') }}" value="{{ old('title', $subscription->title ?? 'main') }}" required>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group mb-0">
                                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Activation Date') }} <span class="text-danger">*</span></label>
                                            <div class="input-group border rounded p-1 shadow-xs bg-white">
                                                <div class="input-group-prepend border-0">
                                                    <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-check text-success"></i></span>
                                                </div>
                                                <input type="datetime-local" name="starts_at" class="form-control border-0" value="{{ old('starts_at', $subscription->exists && $subscription->starts_at ? $subscription->starts_at->format('Y-m-d\TH:i') : now()->format('Y-m-d\TH:i')) }}" required>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group mb-0">
                                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">{{ __('Expiration Date (Optional)') }}</label>
                                            <div class="input-group border rounded p-1 shadow-xs bg-white">
                                                <div class="input-group-prepend border-0">
                                                    <span class="input-group-text bg-white border-0"><i class="fas fa-calendar-times text-danger"></i></span>
                                                </div>
                                                <input type="datetime-local" name="ends_at" class="form-control border-0" value="{{ old('ends_at', $subscription->exists && $subscription->ends_at ? $subscription->ends_at->format('Y-m-d\TH:i') : '') }}">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="tab-pane fade" id="settings" role="tabpanel">
                        @include('admin.subscriptions.partials.settings')
                    </div>

                    @if($subscription->exists)
                    <div class="tab-pane fade" id="payments" role="tabpanel">
                         @include('admin.subscriptions.partials.payments-history')
                    </div>
                    @endif
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top-20" style="z-index: 10;">
                    @include('admin.subscriptions.partials.action-buttons')
                </div>
            </div>
        </div>
    </form>
</div>
@endsection

@section('css')
@include('admin._partials._toggle-card-css')
@endsection

@section('js')
<script src="{{ asset('admin-assets/pages/subscriptions-form.js') }}"></script>
@endsection
