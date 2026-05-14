{{--
    Administrative Financial Module: Subscription Resource Orchestration
    
    This view serves as the primary interface for managing active 
    subscription resource quotas. It orchestrates the allocation of 
    usage limits, entitlement overrides, and real-time usage tracking 
    for specific user subscriptions, ensuring precise administrative 
    control over platform resource utilization.
    
    @extends adminlte::page
    @context Financial Management
    @variables SubscriptionQuota $subscriptionQuota The quota model instance.
--}}
@extends('adminlte::page')

@section('title', ($subscriptionQuota->exists ? __('Edit Subscription Quotas') : __('Add Subscription Quotas')) . ' | ' . __('Resource Architect'))

@section('content_header')
    <h1>{{ $subscriptionQuota->exists ? __('Edit Subscription Quotas') : __('Add Subscription') }}</h1>
@stop

@section('content')

@include('admin.alert')

<div class="row pb-5">

    <!-- Left Column (Main Form) -->
    <div class="col-md-8">
        <div class="position-sticky">

            <form id="subscriptionQuota-form" 
                action="{{ $subscriptionQuota->exists ? route('admin.subscription-quotas.update', $subscriptionQuota->id) : route('admin.subscription-quotas.store') }}" 
                method="POST">
                @csrf
                @if($subscriptionQuota->exists) @method('PATCH') @endif

                <!-- Tabs Navigation -->
                <ul class="nav nav-pills mb-3 p-1 bg-white shadow-sm rounded-pill w-fit-content" id="subscriptionTabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" id="details-tab" data-toggle="tab" href="#details" role="tab">
                            <i class="fas fa-info-circle mr-1"></i> {{ __('Usage Details') }}
                        </a>
                    </li>
                </ul>

                <!-- Tabs Content -->
                <div class="tab-content" id="subscriptionTabContent">

                    <!-- Details Tab -->
                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        @include('admin.subscription-quotas.partials.details')
                    </div>

                </div>

            </form>

        </div>
    </div>

    <!-- Right Column -->
    <div class="col-md-4">
        <div class="position-sticky">

            @include('admin.subscription-quotas.partials.action-buttons')

        </div>
    </div>

</div>

@endsection

@push('js')
<script src="{{ asset('admin-assets/pages/registry-index.js') }}"></script>
@endpush

@push('css')
@include('admin._partials._toggle-card-css')
@endpush
