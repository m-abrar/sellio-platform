{{--
    Administrative Security: Define New Permission
    
    This view facilitates the creation of unique security permissions using the 
    Spatie Permission architecture. It enforces atomic access control by 
    defining specific action-based protocols (e.g., 'listings-approve').
    
    @extends adminlte::page
    @context Security / Permissions Management
--}}
@extends('adminlte::page')

@section('title', 'Create Permission')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-key mr-2 text-primary opacity-50"></i>{{ __('Create Permission') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Define a new security atomic unit for access control.</p>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.permissions.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to List
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <div class="row">
        <div class="col-md-8">
            <div class="card card-premium shadow-premium overflow-hidden border-0">
                <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                    <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1 text-lg">
                        <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> Define Protocol
                    </h3>
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('admin.permissions.store') }}" method="POST" id="permissionForm">
                        @csrf
                        <div class="form-group mb-0">
                            <label class="font-weight-bold text-secondary smallest uppercase mb-2">Unique Permission Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control shadow-xs" placeholder="e.g. property-delete" required>
                            <div class="p-4 bg-light rounded-xl border mt-4">
                                <h6 class="font-weight-bold text-primary text-uppercase mb-2 letter-spacing-1 text-0-95"><i class="fas fa-info-circle mr-2 opacity-75"></i>Naming Convention</h6>
                                <p class="text-muted mb-0 small font-weight-500">
                                    Use lowercase and hyphens. Recommended format: <strong>module-action</strong> (e.g., <code class="text-primary font-weight-bold">listings-approve</code>).
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card bg-primary-soft border-0 shadow-sm mt-4 rounded-xl">
                <div class="card-body p-4">
                    <h5 class="font-weight-bold text-primary text-uppercase mb-3 letter-spacing-1 text-0-95"><i class="fas fa-lightbulb mr-2"></i>Security Blueprint Architecture</h5>
                    <p class="small text-muted mb-3">
                        Permissions are the atomic building blocks of your security. Once created, you can assign them to 
                        <strong>Roles</strong> in the Role Management section.
                    </p>
                    <div class="row">
                        <div class="col-md-4">
                            <code class="d-block mb-2 p-2 bg-white rounded border small text-center text-primary">module-list</code>
                        </div>
                        <div class="col-md-4">
                            <code class="d-block mb-2 p-2 bg-white rounded border small text-center text-primary">module-create</code>
                        </div>
                        <div class="col-md-4">
                            <code class="d-block mb-2 p-2 bg-white rounded border small text-center text-primary">module-edit</code>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="col-md-4">
            {{-- Action Card --}}
            @include('admin._partials._form-actions', [
                'model' => $permission ?? (new \Spatie\Permission\Models\Permission()),
                'title' => 'PERMISSION',
                'back' => 'admin.permissions.index'
            ])
        </div>
    </div>
</div>
@stop

@section('css')
@include('admin._partials._toggle-card-css')
@stop
