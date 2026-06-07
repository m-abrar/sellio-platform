{{--
    Administrative Identity Management: User Insights
    
    This view provides a comprehensive 360-degree visualization of a specific 
    platform member. It aggregates personal credentials, authentication 
    metrics, security status, and core performance KPIs (listings, 
    applications, reviews) into a unified intelligence profile.
    
    @extends adminlte::page
    @context User Administration
    @variables User $user The User model instance being audited.
--}}
@extends('adminlte::page')

@section('title', __('User Profile') . ': ' . $user->name)

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-shield mr-2 text-primary"></i>{{ __('User Profile') }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.users.index') }}" class="btn btn-default btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Users') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    <div class="row">
        {{-- Left Column: Identity Card --}}
        <div class="col-md-3">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-body box-profile">
                    <div class="text-center mb-3">
                        <img class="profile-user-img img-fluid img-circle border-primary shadow-sm icon-box-100 object-fit-cover"
                             src="{{ $user->avatar_url }}"
                             alt="User profile picture">
                    </div>

                    <h3 class="profile-username text-center font-weight-bold">{{ $user->name }}</h3>
                    <p class="text-muted text-center small text-uppercase font-weight-bold mb-3">
                        {{ $user->roles->pluck('name')->map(fn($n) => Str::title($n))->implode(', ') }}
                    </p>

                    <div class="text-center mb-4">
                        @if($user->email_verified_at)
                            <span class="badge badge-success-light px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs"><i class="fas fa-check-circle mr-1"></i> {{ __('Verified') }}</span>
                        @else
                            <span class="badge badge-warning-light px-4 py-2 rounded-pill font-weight-bold smallest uppercase letter-spacing-1 shadow-xs"><i class="fas fa-clock mr-1"></i> {{ __('Pending Verification') }}</span>
                        @endif
                    </div>

                    <a href="{{ route('admin.users.edit', $user->id) }}" class="btn btn-primary btn-block shadow-sm">
                        <i class="fas fa-edit mr-1"></i> <b>{{ __('Modify Account') }}</b>
                    </a>
                </div>
            </div>

            {{-- Contact Info Card --}}
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white border-bottom py-3">
                    <h3 class="card-title font-weight-bold small text-uppercase text-muted">{{ __('Personal Details') }}</h3>
                </div>
                <div class="card-body">
                    <div class="mb-3">
                        <label class="text-muted small d-block mb-0">{{ __('Email Address') }}</label>
                        <span class="font-weight-600">{{ $user->email }}</span>
                    </div>
                    <div class="mb-3">
                        <label class="text-muted small d-block mb-0">{{ __('Phone Number') }}</label>
                        <span class="font-weight-600">{{ $user->phone ?? __('Not provided') }}</span>
                    </div>
                    <div class="mb-0">
                        <label class="text-muted small d-block mb-0">{{ __('Member Since') }}</label>
                        <span class="font-weight-600">{{ $user->created_at->format('d M, Y') }}</span>
                    </div>
                </div>
            </div>
        </div>

        {{-- Right Column: Activity & Stats --}}
        <div class="col-md-9">
            {{-- Quick Stats Row --}}
            <div class="row">
                <div class="col-lg-4 col-6">
                    <div class="small-box bg-white shadow-sm border rounded-lg">
                        <div class="inner">
                            <h3>{{ $user->properties_count }}</h3>
                            <p class="text-muted">{{ __('Properties Listed') }}</p>
                        </div>
                        <div class="icon text-primary"><i class="fas fa-home"></i></div>
                    </div>
                </div>
                <div class="col-lg-4 col-6">
                    <div class="small-box bg-white shadow-sm border rounded-lg">
                        <div class="inner">
                            <h3>{{ $user->job_applications_count }}</h3>
                            <p class="text-muted">{{ __('Active Applications') }}</p>
                        </div>
                        <div class="icon text-success"><i class="fas fa-file-signature"></i></div>
                    </div>
                </div>
                <div class="col-lg-4 col-12">
                    <div class="small-box bg-white shadow-sm border rounded-lg">
                        <div class="inner">
                            <h3>{{ $user->reviews_count ?? 0 }}</h3>
                            <p class="text-muted">{{ __('User Feedback') }}</p>
                        </div>
                        <div class="icon text-warning"><i class="fas fa-star"></i></div>
                    </div>
                </div>
            </div>

            {{-- Tabs Card --}}
            <div class="card shadow-sm border-0">
                <div class="card-header p-2 bg-white border-bottom">
                    <ul class="nav nav-pills">
                        <li class="nav-item"><a class="nav-link active font-weight-bold" href="#overview" data-toggle="tab">{{ __('Account Insights') }}</a></li>
                        <li class="nav-item"><a class="nav-link font-weight-bold" href="#properties" data-toggle="tab">{{ __('Property Feed') }}</a></li>
                    </ul>
                </div>
                <div class="card-body">
                    <div class="tab-content">
                        <div class="active tab-pane" id="overview">
                            <h5 class="font-weight-bold text-dark mb-4">{{ __('Security & System') }}</h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span>{{ __('Two-Factor Authentication') }}</span>
                                            <span class="badge badge-pill badge-secondary">{{ __('Disabled') }}</span>
                                        </li>
                                        <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                                            <span>{{ __('Last Login IP') }}</span>
                                            <span class="text-monospace small">192.168.1.1</span>
                                        </li>
                                    </ul>
                                </div>
                                <div class="col-md-6">
                                    {{-- Optional: Show account notes or internal admin tags --}}
                                    <div class="p-3 bg-light rounded border border-dashed">
                                        <label class="text-muted small">{{ __('Admin Notes') }}</label>
                                        <p class="small italic text-secondary mb-0">{{ __('No internal notes for this user yet.') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane" id="properties">
                            {{-- Placeholder for a dynamic list of properties --}}
                            <p class="text-center py-4 text-muted">
                                <i class="fas fa-layer-group fa-2x mb-2 d-block opacity-25"></i>
                                {{ __('Feature to view user-specific properties coming soon.') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@stop
