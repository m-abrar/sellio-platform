@extends('adminlte::page')

@section('title', 'Edit Permission')

@section('content_header')
    <div class="container-fluid">
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
        <div class="col-md-6">
            <div class="card shadow-sm border-0">
                <div class="card-body">
                    <form action="{{ route('admin.permissions.update', $permission->id) }}" method="POST">
                        @csrf 
                        @method('PUT')
                        <div class="form-group">
                            <label class="font-weight-bold">Permission Name</label>
                            <input type="text" name="name" class="form-control" value="{{ $permission->name }}" required>
                            <small class="text-danger mt-2 d-block">
                                <i class="fas fa-exclamation-triangle mr-1"></i> 
                                Changing this name may disconnect it from existing roles.
                            </small>
                        </div>
                        
                        <hr>

                        <button type="submit" class="btn btn-primary px-4 font-weight-bold shadow-sm">
                            <i class="fas fa-save mr-1"></i> Update Permission
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@stop
