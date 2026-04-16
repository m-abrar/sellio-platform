@extends('adminlte::page')

@section('title', 'Create User')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                     Create User
                </h1>
            </div>
        </div>
    </div>
@stop

@section('content')

@include('admin.alert')

<form action="{{ route('admin.users.store') }}" method="POST" enctype="multipart/form-data">
    @csrf

    <div class="row">
        <!-- Left Column (Main Form) -->
        <div class="col-md-8">
            <div class="card card-primary card-outline shadow-sm border-0">
                <div class="card-body">
                    <div class="form-group">
                        <label>Name</label>
                        <input type="text" name="name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" name="password_confirmation" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Roles</label>
                        <div>
                            @foreach($roles as $role)
                                <div class="form-check">
                                    <input type="checkbox" 
                                           name="roles[]" 
                                           value="{{ $role->id }}" 
                                           class="form-check-input" 
                                           id="role_{{ $role->id }}"
                                           @if(in_array($role->id, old('roles', []))) checked @endif>
                                    <label class="form-check-label" for="role_{{ $role->id }}">
                                        {{ $role->name }}
                                    </label>
                                </div>
                            @endforeach
                        </div>
                    </div>

                    <button type="submit" class="btn btn-success">Create User</button>
                </div>
            </div>
        </div>

        <!-- Right Column (Image Sidebar) -->
        <div class="col-md-4">
            @include('admin._partials._image-uploader', [
                'name' => \App\Models\User::PRIMARY_MEDIA,
                'label' => 'Avatar',
                'multiple' => false,
                'model' => \App\Models\User::class,
                'id' => null,
            ])
        </div>
    </div>
</form>

@stop


