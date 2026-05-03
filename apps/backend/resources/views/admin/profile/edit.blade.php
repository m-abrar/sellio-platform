@extends('adminlte::page')

@section('title', 'Account Intelligence | Personal Settings')

@section('content_header')
    <div class="container-fluid pt-4">
        <div class="row mb-4 align-items-center">
            <div class="col-sm-8 d-flex align-items-center">
                <div class="avatar-wrapper mr-4 position-relative group cursor-pointer">
                    <div class="avatar-glow position-absolute" style="top: -5px; left: -5px; right: -5px; bottom: -5px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); border-radius: 50%; opacity: 0.15; filter: blur(8px);"></div>
                    <div class="position-relative overflow-hidden rounded-circle shadow-lg border-white border-4" style="width: 100px; height: 100px; z-index: 1;">
                        <img src="{{ $user->getFirstMediaUrl(\App\Models\User::PRIMARY_MEDIA) ?: asset('images/fallbacks/avatar.jpg') }}" 
                             alt="Avatar" 
                             class="w-100 h-100 transition-all duration-300 group-hover:scale-110 group-hover:brightness-75" 
                             style="object-fit: cover;">
                        <div class="avatar-overlay position-absolute d-flex align-items-center justify-content-center transition-all duration-300 opacity-0 group-hover:opacity-100" 
                             style="top:0; left:0; right:0; bottom:0; background: rgba(0,0,0,0.3);">
                            <i class="fas fa-camera text-white fa-lg"></i>
                        </div>
                    </div>
                    <div class="status-indicator bg-success position-absolute shadow-sm" style="width: 18px; height: 18px; border-radius: 50%; bottom: 8px; right: 8px; border: 3px solid #fff; z-index: 2;"></div>
                </div>
                <div>
                    <h1 class="m-0 text-dark font-weight-bold">
                        Welcome, {{ explode(' ', $user->name)[0] }}
                    </h1>
                    <p class="text-muted mt-1 small text-uppercase letter-spacing-1 mb-0">
                        <i class="fas fa-shield-alt mr-1 text-primary"></i> 
                        Managing Master Identity & Security Protocol
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
                <div class="card border-0 shadow-premium overflow-hidden mb-4" style="border-radius: 24px;">
                    <div class="card-header bg-white py-4 px-4 border-0">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-fingerprint mr-2 text-primary opacity-50"></i> Profile Credentials
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="text-uppercase smallest font-weight-bold text-muted mb-2">Display Name</label>
                                    <input type="text" name="name" class="form-control form-control-premium" value="{{ old('name', $user->name) }}" required>
                                    @error('name') <span class="text-danger smallest font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label class="text-uppercase smallest font-weight-bold text-muted mb-2">Primary Email Address</label>
                                    <input type="email" name="email" class="form-control form-control-premium" value="{{ old('email', $user->email) }}" required>
                                    @error('email') <span class="text-danger smallest font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <div class="p-4 rounded-xl mt-2" style="background: rgba(248, 250, 252, 0.8); border: 1px dashed var(--border-color);">
                            <h5 class="text-dark font-weight-bold mb-4 smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-lock-open mr-2 text-warning"></i> Access Security Update
                            </h5>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label class="text-uppercase smallest font-weight-bold text-muted mb-2">New Secret Password</label>
                                        <input type="password" name="password" class="form-control form-control-premium" placeholder="••••••••">
                                        <small class="text-muted mt-2 d-block font-italic opacity-75">Leave empty to keep current access keys.</small>
                                        @error('password') <span class="text-danger smallest font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label class="text-uppercase smallest font-weight-bold text-muted mb-2">Confirm New Password</label>
                                        <input type="password" name="password_confirmation" class="form-control form-control-premium" placeholder="••••••••">
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
                {{-- Standardized Action Card --}}
                @include('admin._partials._form-actions', [
                    'model' => $user,
                    'title' => 'MY PROFILE',
                    'back' => 'admin.welcome'
                ])

                {{-- Account Metadata --}}
                <div class="card border-0 shadow-premium mt-4 mb-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header bg-white py-3 px-4 border-0">
                        <h3 class="card-title text-dark mb-0 font-weight-bold smallest text-uppercase letter-spacing-1">
                             <i class="fas fa-info-circle mr-2 text-primary opacity-50"></i> Registry Details
                        </h3>
                    </div>
                    <div class="card-body bg-white py-4 px-4">
                        <div class="mb-4">
                            <label class="d-block smallest font-weight-bold text-muted mb-2 text-uppercase letter-spacing-1">Assigned Authority</label>
                            <span class="badge badge-primary-light text-primary px-3 py-2 font-weight-bold rounded-pill" style="font-size: 0.7rem;">
                                <i class="fas fa-crown mr-1"></i> {{ strtoupper($user->roles->first()->name ?? 'MASTER ADMIN') }}
                            </span>
                        </div>

                        <div class="mb-0 pt-3 border-top">
                            <label class="d-block smallest font-weight-bold text-muted mb-1 text-uppercase letter-spacing-1">Account Lifespan</label>
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <span class="font-weight-bold text-dark small">{{ $user->created_at->format('M d, Y') }}</span>
                                <span class="badge badge-light border smallest">{{ $user->created_at->diffForHumans() }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {{-- Visual Identity --}}
                <div class="card border-0 shadow-premium mb-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 smallest text-uppercase letter-spacing-1">Update Avatar</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\User::PRIMARY_MEDIA,
                            'label' => 'Upload New Identity Image',
                            'multiple' => false,
                            'model' => \App\Models\User::class,
                            'id' => $user->id ?? null,
                            'noCard' => true
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop

@push('css')
<style>
    .avatar-wrapper:hover img { transform: scale(1.1); filter: brightness(0.75); }
    .avatar-wrapper .avatar-overlay { opacity: 0; transition: all 0.3s ease; }
    .avatar-wrapper:hover .avatar-overlay { opacity: 1; }
    .transition-all { transition: all 0.3s ease !important; }
</style>
@endpush
