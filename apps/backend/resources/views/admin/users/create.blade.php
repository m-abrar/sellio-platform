{{--
    Administrative Identity Management: Create Member
    
    This view enables the initialization of new platform accounts. 
    It handles credential definition, security role mapping, and 
    visual identity (avatar) attachment through an integrated 
    asynchronous uploader.
    
    @extends adminlte::page
    @context User Administration
    @variables Collection $roles List of available Spatie Roles for assignment.
--}}
@extends('adminlte::page')

@section('title', 'Create User')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-plus mr-2 text-primary"></i> {{ __('Create New User') }}
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">{{ __('Define credentials and assign initial security roles for a new platform member.') }}</p>
            </div>
            <div class="col-sm-4 text-right">
                <a href="{{ route('admin.users.index') }}" class="btn btn-back shadow-sm">
                    <i class="fas fa-arrow-left mr-1"></i> {{ __('Back to List') }}
                </a>
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
                <div class="card border-0 shadow-premium overflow-hidden rounded-24">
                    <div class="card-header bg-white py-4 px-4 border-0">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> {{ __('Authentication & Identity') }}
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label>{{ __('Display Name') }}</label>
                                    <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name') }}" required placeholder="e.g. John Doe">
                                    @error('name') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label>{{ __('Primary Email') }}</label>
                                    <input type="email" name="email" class="form-control @error('email') is-invalid @enderror" value="{{ old('email') }}" required placeholder="john@example.com">
                                    @error('email') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="bg-light p-4 rounded-xl border mb-4">
                            <h6 class="font-weight-bold text-dark mb-3 smallest text-uppercase letter-spacing-1">{{ __('Security Credentials') }}</h6>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label>{{ __('Secret Key') }}</label>
                                        <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" required placeholder="••••••••">
                                        @error('password') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label>{{ __('Repeat Key') }}</label>
                                        <input type="password" name="password_confirmation" class="form-control" required placeholder="••••••••">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="form-group mb-0">
                            <label class="mb-3">{{ __('Security Role Assignment') }}</label>
                            <div class="row">
                                @foreach($roles as $role)
                                    <div class="col-md-4 mb-2">
                                        <div class="custom-control custom-checkbox premium-checkbox p-3 rounded-lg border">
                                            <input type="checkbox" 
                                                   name="roles[]" 
                                                   value="{{ $role->id }}" 
                                                   class="custom-control-input" 
                                                   id="role_{{ $role->id }}"
                                                   @if(in_array($role->id, old('roles', []))) checked @endif>
                                            <label class="custom-control-label font-weight-bold text-dark pl-2" for="role_{{ $role->id }}">
                                                {{ strtoupper($role->name) }}
                                            </label>
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        </div>
                    </div>
                </div>
        </div>

        <!-- Right Column (Sidebar) -->
        <div class="col-md-4">
            {{-- Action Card --}}
            @include('admin._partials._form-actions', [
                'model' => $user ?? (new \App\Models\User()),
                'title' => 'USER',
                'back' => 'admin.users.index'
            ])

            <div class="card border-0 shadow-premium mt-4 mb-4 rounded-20 overflow-hidden">
                <div class="card-header bg-white border-0 py-3 px-4">
                    <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">
                        <i class="fas fa-camera mr-2 text-primary opacity-50"></i> Visual Identity
                    </h3>
                </div>
                <div class="card-body p-0">
                    @include('admin._partials._image-uploader', [
                        'name' => \App\Models\User::PRIMARY_MEDIA,
                        'label' => __('Upload Avatar'),
                        'multiple' => false,
                        'model' => 'user',
                        'id' => null,
                        'noCard' => true,
                    ])
                </div>
            </div>

            <div class="bg-primary-soft p-4 rounded-xl border border-primary-soft shadow-xs">
                <h6 class="font-weight-bold text-primary mb-2 text-uppercase smallest letter-spacing-1">{{ __('Integrity Note') }}</h6>
                <p class="text-muted small mb-0">
                    {{ __('Ensure the email address is verified before granting administrative roles to new users.') }}
                </p>
            </div>
        </div>
    </div>
</form>

@stop


