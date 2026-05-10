{{--
    Administrative Financial Module: Subscription Plan Configuration
    
    This view serves as the primary architect for the platform's 
    monetization tiers. It orchestrates the definition of pricing 
    structures, billing cycles, usage quotas, and feature entitlements, 
    ensuring a comprehensive and consistent subscription strategy across 
    the marketplace.
    
    @extends adminlte::page
    @context Financial Management
    @variables Plan $plan The plan model instance.
--}}
@extends('adminlte::page')

@section('title', ($plan->exists ? 'Edit' : 'Create') . ' Plan | Tier Architect')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-boxes mr-2 text-primary opacity-50"></i> 
                    {{ $plan->exists ? 'Modify Plan: ' . $plan->title : 'Add New Tier' }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ $plan->exists ? 'Update tier features, pricing structures, and usage quotas.' : 'Define a new subscription offering with distinct benefits and limitations.' }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <div class="d-flex justify-content-end align-items-center gap-12">
                    <a href="{{ route('admin.welcome') }}" class="btn-back shadow-sm">
                        <i class="fas fa-th-large"></i> Dashboard
                    </a>
                    <a href="{{ route('admin.plans.index') }}" class="btn-back shadow-sm">
                        <i class="fas fa-arrow-left"></i> Back to List
                    </a>
                </div>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form id="plan-form" 
          action="{{ $plan->exists ? route('admin.plans.update', $plan->id) : route('admin.plans.store') }}" 
          method="POST"
          enctype="multipart/form-data">
        @csrf
        @if($plan->exists) @method('PATCH') @endif

        <div class="row pb-5">
            {{-- Left Column --}}
            <div class="col-md-8">
                <div class="nav-pills-wrapper mb-4">
                    <ul class="nav nav-pills p-1 bg-white shadow-sm rounded-pill border w-fit" id="planTabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" id="details-tab" data-toggle="tab" href="#details" role="tab">
                                <i class="fas fa-info-circle mr-2"></i> Plan Details
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1" id="quotas-tab" data-toggle="tab" href="#quotas" role="tab">
                                <i class="fas fa-list-ol mr-2"></i> Quotas & Perks
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="tab-content" id="planTabContent">
                    <div class="tab-pane fade show active" id="details" role="tabpanel">
                        @include('admin.plans.partials.basic-info')
                        @include('admin.plans.partials.settings')
                    </div>

                    <div class="tab-pane fade" id="quotas" role="tabpanel">
                        @include('admin.plans.partials.quotas-features')
                    </div>
                </div>
            </div>

            {{-- Right Column --}}
            <div class="col-md-4">
                <div class="sticky-top top-20 z-10">
                    {{-- Action Card --}}
                    @include('admin._partials._form-actions', [
                        'model' => $plan,
                        'title' => 'PLAN TIER',
                        'back' => 'admin.plans.index'
                    ])

                    <div class="card card-premium shadow-premium mt-4 mb-4">
                        <div class="card-header bg-white border-0 py-3 px-4">
                            <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                                <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                            </h3>
                        </div>
                        <div class="card-body p-0">
                            @include('admin._partials._image-uploader', [
                                'name' => \App\Models\Plan::PRIMARY_MEDIA, 
                                'label' => 'Select Cover Image',
                                'multiple' => false,
                                'model' => 'plan',
                                'id' => $plan->id ?? null,
                                'noCard' => true,
                            ])
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>

    @if($plan->exists)
    {{-- Hidden Delete Form outside main form --}}
    <form id="delete-plan-form" action="{{ route('admin.plans.destroy', $plan->id) }}" method="POST" class="d-none">
        @csrf
        @method('DELETE')
    </form>
    @endif
</div>
@endsection
