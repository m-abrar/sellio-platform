@extends('adminlte::page')

@section('title', 'Edit Permission')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-edit mr-2 text-primary"></i>Edit Permission
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.permissions.index') }}" class="btn btn-default btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back
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
            <div class="card border-0 shadow-premium" style="border-radius: 24px;">
                <div class="card-header bg-white py-4 px-4 border-0">
                    <h3 class="card-title font-weight-bold text-dark mb-0">
                        <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> Permission Identifier
                    </h3>
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('admin.permissions.update', $permission->id) }}" method="POST" id="permissionForm">
                        @csrf 
                        @method('PUT')
                        <div class="form-group mb-0">
                            <label class="font-weight-bold text-muted small uppercase">Protocol Name</label>
                            <input type="text" name="name" class="form-control form-control-lg" value="{{ $permission->name }}" required placeholder="e.g. users-create">
                            <div class="p-3 bg-warning-soft rounded-xl border border-warning-soft mt-4">
                                <h6 class="font-weight-bold text-warning smallest uppercase mb-2">Security Warning</h6>
                                <p class="text-muted mb-0 small">
                                    Changing this identifier may disconnect it from existing roles and application gate checks. Use with extreme caution.
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
