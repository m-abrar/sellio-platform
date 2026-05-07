{{--
    Administrative Security: Authority Architect (Role Creation)
    
    This view facilitates the definition of new administrative roles. 
    It enables the simultaneous mapping of permission sets to the new role 
    identity, establishing a high-fidelity security blueprint for platform users.
    
    @extends adminlte::page
    @context RBAC (Role Based Access Control) Management
--}}
@extends('adminlte::page')

@section('title', 'Authority Architect | Define New Role')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-plus-circle mr-2 text-primary opacity-50"></i> 
                    Architect New Role
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Define a new authority level and map its initial permission spectrum.
                </p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.roles.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Registry
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ route('admin.roles.store') }}" method="POST" id="roleCreateForm">
        @csrf
        <div class="row">
            <div class="col-md-8">
                @include('admin.roles.partials._permission_grid', ['currentRole' => null])
            </div>
            
            <div class="col-md-4">
                {{-- Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $role ?? (new \Spatie\Permission\Models\Role()),
                    'title' => 'ROLE',
                    'back' => 'admin.roles.index'
                ])

                <div class="card card-premium shadow-premium overflow-hidden border-0 mt-4">
                    <div class="card-header border-0 bg-white py-4 px-4 d-flex align-items-center">
                        <h3 class="card-title font-weight-bold text-dark mb-0 text-uppercase letter-spacing-1 font-1-1">
                            <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> Identity Blueprint
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label>Role Identifier</label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. Content Moderator" required>
                            <small class="text-muted d-block mt-2 font-italic">This unique name will identify the role across the security layer.</small>
                        </div>
                        
                        <div class="p-3 bg-primary-soft rounded-xl border border-primary-soft">
                            <h6 class="font-weight-bold text-primary text-uppercase mb-2 letter-spacing-1 font-0-85"><i class="fas fa-shield-alt mr-2 opacity-75"></i>Protocol Note</h6>
                            <p class="text-muted mb-0 small font-weight-600">
                                Once created, this role can be assigned to multiple users. Changes to the permission grid will affect all users instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop

@section('css')
@include('admin._partials._toggle-card-css')
@stop
