@extends('adminlte::page')

@section('title', 'Authority Editor | Modify Role Spectrum')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-tag mr-2 text-primary"></i> 
                    Modify Role Spectrum
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">
                    Adjusting authority identifiers and granular permissions for <span class="text-primary font-weight-bold">{{ strtoupper($role->name) }}</span>.
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

    <form action="{{ route('admin.roles.update', $role->id) }}" method="POST" id="roleUpdateForm">
        @csrf 
        @method('PUT')
        <div class="row">
            <div class="col-md-4">
                <div class="card border-0 shadow-premium mb-4" style="border-radius: 20px;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Authority Identity</h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="form-group mb-4">
                            <label>Role Alias</label>
                            <input type="text" name="name" class="form-control" value="{{ $role->name }}" required>
                            <small class="text-muted d-block mt-2 font-italic">Renaming this role will propagate through all assigned user accounts instantly.</small>
                        </div>
                        
                        <div class="p-3 bg-dark-soft rounded-xl border">
                            <h6 class="font-weight-bold text-dark smallest uppercase mb-2">Security Statistics</h6>
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="text-muted small">Active Permissions:</span>
                                <span class="badge badge-primary-light text-primary font-weight-bold">{{ $role->permissions->count() }}</span>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="text-muted small">Impacted Users:</span>
                                <span class="badge badge-secondary-soft text-secondary font-weight-bold">LIVE SYNC</span>
                            </div>
                        </div>
                    </div>
                </div>

                <a href="{{ route('admin.roles.index') }}" class="btn btn-default btn-block rounded-pill font-weight-bold py-2 shadow-xs border">
                    <i class="fas fa-arrow-left mr-1"></i> BACK TO REGISTRY
                </a>
            </div>

            <div class="col-md-8">
                @include('admin.roles.partials._permission_grid', ['currentRole' => $role])
            </div>
        </div>
    </form>
</div>
@stop
