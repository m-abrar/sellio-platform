{{--
    Administrative Identity Management: Profile Edit
    
    This view facilitates the modification of the authenticated administrator's 
    personal credentials, visual identity (avatar), and security keys.
    It integrates asynchronous media uploading and high-fidelity form actions.
    
    @extends adminlte::page
    @context Authenticated User Settings
    @variables User $user The currently authenticated User model instance.
--}}
@extends('adminlte::page')

@section('title', __('Account Settings') . ' | ' . __('Personal Settings'))

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 d-flex align-items-center">
                <div class="avatar-wrapper mr-4 position-relative group cursor-pointer">
                    <div class="avatar-glow position-absolute"></div>
                    <div class="position-relative overflow-hidden rounded-circle shadow-premium border-4-fff icon-box-100 z-1">
                        <img src="{{ $user->getFirstMediaUrl(\App\Models\User::PRIMARY_MEDIA) ?: asset('images/fallbacks/avatar.jpg') }}" 
                             alt="Avatar" 
                             class="w-100 h-100 transition-all duration-300 group-hover:scale-110 object-fit-cover">
                        <div class="avatar-overlay position-absolute d-flex align-items-center justify-content-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                            <i class="fas fa-camera text-white fa-lg"></i>
                        </div>
                    </div>
                    <div class="status-indicator bg-success position-absolute shadow-sm status-indicator-dot"></div>
                </div>
                <div>
                    <h1 class="m-0 text-dark font-weight-bold letter-spacing-tight">
                        {{ __('Welcome, :name', ['name' => explode(' ', $user->name)[0]]) }}
                    </h1>
                    <p class="text-muted mt-1 small uppercase font-weight-bold letter-spacing-2 mb-0 opacity-75">
                        <i class="fas fa-shield-alt mr-1 text-primary"></i> 
                        {{ __('Active') }}
                    </p>
                </div>
            </div>
            <div class="col-sm-4 text-right">
                @include('admin._partials._back-button')
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid pb-5">
    @include('admin.alert')

    <form action="{{ route('admin.profile.update') }}" 
          method="POST" 
          enctype="multipart/form-data" 
          id="profileUpdateForm">
        @csrf
        @method('PUT')

        <div class="row">
            {{-- Primary Data Column --}}
            <div class="col-md-8">
                <div class="card border-0 shadow-premium overflow-hidden mb-4 rounded-24">
                    <div class="card-header bg-white py-4 px-4 border-0">
                        <h3 class="card-title-main">
                            <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> {{ __('Profile Credentials') }}
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="uppercase small font-weight-bold text-muted mb-2 letter-spacing-1">{{ __('Display Name') }}</label>
                                    <input type="text" name="name" class="form-control form-control-premium" value="{{ old('name', $user->name) }}" required>
                                    @error('name') <span class="text-danger small font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="uppercase small font-weight-bold text-muted mb-2 letter-spacing-1">{{ __('Primary Email Address') }}</label>
                                    <input type="email" name="email" class="form-control form-control-premium" value="{{ old('email', $user->email) }}" required>
                                    @error('email') <span class="text-danger small font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl mt-2 bg-light-80 border-dashed">
                            <h5 class="card-title-main mb-4 font-0-85">
                                <i class="fas fa-lock-open mr-2 text-warning"></i> {{ __('Access Security Update') }}
                            </h5>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label class="uppercase small font-weight-bold text-muted mb-2 letter-spacing-1">{{ __('New Secret Password') }}</label>
                                        <input type="password" name="password" class="form-control form-control-premium" placeholder="{{ __('••••••••') }}">
                                        <small class="text-muted mt-2 d-block font-italic opacity-75">{{ __('Leave empty to keep current access keys.') }}</small>
                                        @error('password') <span class="text-danger small font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label class="uppercase small font-weight-bold text-muted mb-2 letter-spacing-1">{{ __('Confirm New Password') }}</label>
                                        <input type="password" name="password_confirmation" class="form-control form-control-premium" placeholder="{{ __('••••••••') }}">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                {{-- Standardized Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $user,
                    'title' => 'MY PROFILE',
                    'back' => 'admin.welcome'
                ])

                {{-- Account Metadata --}}
                <div class="card border-0 shadow-premium mt-4 mb-4 overflow-hidden rounded-20">
                    <div class="card-header bg-white py-3 px-4 border-0">
                        <h3 class="card-title-side">
                             <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> {{ __('View Details') }}
                        </h3>
                    </div>
                    <div class="card-body bg-white py-4 px-4">
                        <div class="mb-4">
                            <label class="d-block small font-weight-bold text-muted mb-2 uppercase letter-spacing-1">{{ __('Assigned Authority') }}</label>
                            <span class="badge badge-primary-light text-primary px-3 py-2 font-weight-bold rounded-pill smallest-0-7">
                                <i class="fas fa-crown mr-1"></i> {{ strtoupper($user->roles->first()->name ?? __('MASTER ADMIN')) }}
                            </span>
                        </div>

                        <div class="mb-0 pt-3 border-top">
                            <label class="d-block small font-weight-bold text-muted mb-1 uppercase letter-spacing-1">{{ __('Account Lifespan') }}</label>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <span class="font-weight-bold text-dark small">{{ $user->created_at->format('M d, Y') }}</span>
                                <span class="badge badge-light border small px-2 py-1">{{ $user->created_at->diffForHumans() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Visual Identity --}}
                <div class="card border-0 shadow-premium mb-4 overflow-hidden rounded-20">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title-side">{{ __('Update Avatar') }}</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\User::PRIMARY_MEDIA,
                            'label' => __('Upload New Identity Image'),
                            'multiple' => false,
                            'model' => 'user',
                            'record' => $user,
                            'noCard' => true
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop
