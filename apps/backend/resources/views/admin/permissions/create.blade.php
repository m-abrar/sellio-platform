@extends('adminlte::page')

@section('title', 'Create Permission')

@section('content_header')
    <div class="container-fluid">
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
        <div class="col-md-6">
            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <form action="{{ route('admin.permissions.store') }}" method="POST">
                        @csrf
                        <div class="form-group">
                            <label class="font-weight-bold">Permission Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. property-delete" required>
                            <small class="form-text text-muted mt-2">
                                <i class="fas fa-info-circle mr-1"></i> 
                                Use lowercase and hyphens. Recommended format: <strong>module-action</strong>
                            </small>
                        </div>
                        
                        <hr>
                        
                        <button type="submit" class="btn btn-success px-4 font-weight-bold shadow-sm">
                            <i class="fas fa-plus-circle mr-1"></i> Create Permission
                        </button>
                    </form>
                </div>
            </div>
        </div>

        {{-- Helper Card --}}
        <div class="col-md-6">
            <div class="card bg-light border-0 shadow-sm">
                <div class="card-body">
                    <h5 class="font-weight-bold text-primary"><i class="fas fa-lightbulb mr-2"></i>Quick Tip</h5>
                    <p class="small text-muted">
                        Permissions are the atomic building blocks of your security. Once created, you can assign them to 
                        <strong>Roles</strong> in the Role Management section.
                    </p>
                    <ul class="small text-muted pl-3">
                        <li><strong>property-list:</strong> View the list</li>
                        <li><strong>property-create:</strong> Add new items</li>
                        <li><strong>property-edit:</strong> Update details</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</div>
@stop
