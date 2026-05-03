@extends('adminlte::page')

@section('title', 'Create Permission')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-key mr-2 text-success"></i>Create Permission
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.permissions.index') }}" class="btn btn-default btn-sm shadow-sm">
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
            <div class="card border-0 shadow-premium" style="border-radius: 24px;">
                <div class="card-header bg-white py-4 px-4 border-0">
                    <h3 class="card-title font-weight-bold text-dark mb-0">
                        <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> Define Protocol
                    </h3>
                </div>
                <div class="card-body p-4">
                    <form action="{{ route('admin.permissions.store') }}" method="POST" id="permissionForm">
                        @csrf
                        <div class="form-group mb-0">
                            <label class="font-weight-bold text-muted small uppercase">Unique Permission Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control form-control-lg" placeholder="e.g. property-delete" required>
                            <div class="p-3 bg-light rounded-xl border mt-4">
                                <h6 class="font-weight-bold text-dark smallest uppercase mb-2">Naming Convention</h6>
                                <p class="text-muted mb-0 small">
                                    Use lowercase and hyphens. Recommended format: <strong>module-action</strong> (e.g., <code class="text-primary">listings-approve</code>).
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="card bg-primary-soft border-0 shadow-sm mt-4" style="border-radius: 20px;">
                <div class="card-body p-4">
                    <h5 class="font-weight-bold text-primary smallest uppercase mb-3"><i class="fas fa-lightbulb mr-2"></i>Security Blueprint Architecture</h5>
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
                'model' => $permission ?? (new \App\Models\Permission()),
                'title' => 'PERMISSION',
                'back' => 'admin.permissions.index'
            ])
        </div>
    </div>
</div>
@stop
