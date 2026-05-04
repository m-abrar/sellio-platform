@extends('adminlte::page')

@section('title', 'Edit Permission')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary"></i>Edit Permission
                </h1>
                <p class="text-muted small mb-0 mt-1 uppercase letter-spacing-1">Refine security identifiers and protocol mapping.</p>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.permissions.index') }}" class="btn-back shadow-sm">
                    <i class="fas fa-arrow-left"></i> Back to Ledger
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
            <div class="card card-premium">
                <div class="card-header border-0 bg-white py-4 px-4">
                    <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">
                        <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> Permission Identifier
                    </h3>
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('admin.permissions.update', $permission->id) }}" method="POST" id="permissionForm">
                        @csrf 
                        @method('PUT')
                        <div class="form-group mb-0">
                            <label class="small font-weight-bold text-secondary mb-2 text-uppercase" style="letter-spacing: 0.5px;">Protocol Name</label>
                            <input type="text" name="name" class="form-control form-control-lg shadow-xs" value="{{ $permission->name }}" required placeholder="e.g. users-create">
                            
                            <div class="p-4 bg-warning-soft mt-4" style="border-radius: 20px; border: 1px solid rgba(234, 179, 8, 0.2);">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="fas fa-exclamation-triangle text-warning mr-2"></i>
                                    <h6 class="font-weight-bold text-warning smallest uppercase mb-0 letter-spacing-1">Security Warning</h6>
                                </div>
                                <p class="text-muted mb-0 small font-weight-500">
                                    Modifying this unique identifier will break existing <strong>@@can</strong> gate checks and role bindings across the platform. Proceed only if you intend to re-bind the entire security architecture.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-md-4">
            {{-- Action Card --}}
            @include('admin._partials._form-actions', [
                'model' => $permission,
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
