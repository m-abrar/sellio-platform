@extends('adminlte::page')

@section('title', 'Edit Role: ' . $role->name)

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-tag mr-2 text-primary"></i>Edit Role: {{ $role->name }}
                </h1>
            </div>
            <div class="col-sm-6 text-right">
                <a href="{{ route('admin.roles.index') }}" class="btn btn-default btn-sm shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> Back
                </a>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
    @include('admin.alert')

    <form action="{{ route('admin.roles.update', $role->id) }}" method="POST">
        @csrf @method('PUT')
        <div class="row">
            <div class="col-md-4">
                <div class="card shadow-sm border-0">
                    <div class="card-body">
                        <div class="form-group">
                            <label>Role Name</label>
                            <input type="text" name="name" class="form-control" value="{{ $role->name }}" required>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block shadow-sm font-weight-bold">
                            <i class="fas fa-save mr-1"></i> Update Role
                        </button>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                @include('admin.roles.partials._permission_grid', ['currentRole' => $role])
            </div>
        </div>
    </form>
</div>
@stop
