@extends('adminlte::page')

@section('title', 'Create Role')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-plus-circle mr-2 text-success"></i>Create New Role
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.roles.index') }}" class="btn btn-default btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back to Roles
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ route('admin.roles.store') }}" method="POST">
        @csrf
        <div class="row">
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <div class="form-group">
                            <label>Role Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control" placeholder="e.g. Moderator" required>
                        </div>
                        <button type="submit" class="btn btn-success btn-block shadow-sm font-weight-bold">
                            <i class="fas fa-check mr-1"></i> Save Role
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                @include('admin.roles.partials._permission_grid', ['currentRole' => null])
            </div>
        </div>
    </form>
</div>
@stop
