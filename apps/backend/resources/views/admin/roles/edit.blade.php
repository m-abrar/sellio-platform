{{--
    Administrative Security: Authority Editor (Role Modification)
    
    This view enables the adjustment of existing administrative roles. 
    It facilitates the real-time synchronization of permission mappings and 
    provides statistics on the security impact across the platform.
    
    @extends adminlte::page
    @context RBAC (Role Based Access Control) Management
    @variables Role $role The Spatie Role model instance being modified.
--}}
@extends('adminlte::page')

@section('title', __('Authority Editor') . ' | ' . __('Modify Role Spectrum'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-tag mr-2 text-primary"></i> 
                    {{ __('Modify Role Spectrum') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    {{ __('Adjusting authority identifiers and granular permissions for :name.', ['name' => strtoupper($role->name)]) }}
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.roles.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to Registry') }}
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ route('admin.roles.update', $role->id) }}" method="POST" id="roleUpdateForm">
        @csrf 
        @method('PUT')
        <div class="row">
            <div class="col-md-8">
                @include('admin.roles.partials._permission_grid', ['currentRole' => $role])
            </div>

            <div class="col-md-4">
                {{-- Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $role,
                    'title' => 'ROLE',
                    'back' => 'admin.roles.index'
                ])

                <div class="card border-0 shadow-premium mt-4 rounded-20">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">{{ __('Authority Identity') }}</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label>{{ __('Role Alias') }}</label>
                            <input type="text" name="name" class="form-control" value="{{ $role->name }}" required>
                            <small class="text-muted d-block mt-2 font-italic">{{ __('Renaming this role will propagate through all assigned user accounts instantly.') }}</small>
                        </div>
                        
                        <div class="p-3 bg-light rounded-xl border">
                            <h6 class="font-weight-bold text-dark smallest uppercase mb-2">{{ __('Security Statistics') }}</h6>
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="text-muted small">{{ __('Active Permissions:') }}</span>
                                <span class="badge badge-primary-light text-primary font-weight-bold">{{ $role->permissions->count() }}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-muted small">{{ __('Impacted Users:') }}</span>
                                <span class="badge badge-secondary-soft text-secondary font-weight-bold">{{ __('LIVE SYNC') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop

@push('js')
<script src="{{ asset('admin-assets/pages/roles-form.js') }}"></script>
@endpush
