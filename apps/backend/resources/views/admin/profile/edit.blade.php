@extends('adminlte::page')

@section('title', 'Edit My Profile')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-2">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-circle mr-2 text-primary"></i> Account Settings
                </h1>
            </div>
            <div class="col-sm-6">
                <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">My Profile</li>
                </ol>
            </div>
        </div>
    </div>
@stop

@section('content')
<div class="container-fluid">
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
                <div class="card card-primary card-outline shadow-sm border-0">
                    <div class="card-header border-0 bg-white py-3">
                        <h3 class="card-title font-weight-bold text-dark">Personal Information</h3>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="name" class="font-weight-600">Full Name <span class="text-danger">*</span></label>
                                    <input type="text" name="name" id="name" 
                                           class="form-control form-control-border @error('name') is-invalid @enderror" 
                                           value="{{ old('name', $user->name) }}" required>
                                    @error('name') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="email" class="font-weight-600">Email Address <span class="text-danger">*</span></label>
                                    <input type="email" name="email" id="email" 
                                           class="form-control form-control-border @error('email') is-invalid @enderror" 
                                           value="{{ old('email', $user->email) }}" required>
                                    @error('email') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <hr class="my-4 opacity-5">

                        <h5 class="text-muted font-weight-bold mb-3" style="font-size: 0.9rem; letter-spacing: 0.5px;">
                            <i class="fas fa-shield-alt mr-1"></i> SECURITY UPDATE
                        </h5>

                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="password" class="font-weight-600">New Password</label>
                                    <input type="password" name="password" id="password" 
                                           class="form-control form-control-border @error('password') is-invalid @enderror" 
                                           placeholder="••••••••">
                                    <small class="text-muted italic">Leave blank to keep current password</small>
                                    @error('password') <span class="invalid-feedback">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label for="password_confirmation" class="font-weight-600">Confirm New Password</label>
                                    <input type="password" name="password_confirmation" id="password_confirmation" 
                                           class="form-control form-control-border" 
                                           placeholder="••••••••">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- High Contrast Sidebar --}}
            <div class="col-md-4">
                {{-- Save Changes Card --}}
                <div class="card shadow-sm border-0 overflow-hidden sticky-top" style="top: 20px;">
                    <div class="card-header bg-dark d-flex align-items-center py-3" style="border-bottom: 3px solid var(--primary) !important;">
                        <h3 class="card-title text-white mb-0 font-weight-bold">
                            <i class="fas fa-user-shield mr-2 text-primary"></i> Account Status
                        </h3>
                    </div>
                    
                    <div class="card-body bg-white py-4">
                        <div class="mb-4">
                            <label class="d-block font-weight-bold text-dark mb-1">Role Assignment</label>
                            <span class="badge badge-indigo-soft border border-indigo text-indigo px-3 py-1 uppercase text-xs font-weight-bold">
                                {{ $user->roles->first()->name ?? 'Administrator' }}
                            </span>
                        </div>

                        <div class="mb-4 pb-3 border-bottom">
                            <span class="d-block font-weight-bold text-dark">Member Since</span>
                            <small class="text-muted">{{ $user->created_at->format('M d, Y') }} ({{ $user->created_at->diffForHumans() }})</small>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block btn-lg btn-flat shadow-sm font-weight-bold py-3 text-uppercase" style="letter-spacing: 1px;">
                            <i class="fas fa-save mr-2"></i> Save Profile
                        </button>
                    </div>
                </div>

                {{-- Avatar Upload Card --}}
                <div class="card shadow-sm mt-4 border-0">
                    <div class="card-header bg-white border-bottom">
                        <h3 class="card-title font-weight-600 text-muted small text-uppercase">
                            <i class="fas fa-camera mr-1 text-primary"></i> Profile Avatar
                        </h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\User::PRIMARY_MEDIA,
                            'label' => 'Select Photo',
                            'multiple' => false,
                            'model' => \App\Models\User::class,
                            'id' => $user->id ?? null,
                        ])
                    </div>
                </div>
            </div>
        </div>
    </form>
</div>
@stop

@section('css')
<style>
    .form-control-border { border-top: 0; border-left: 0; border-right: 0; border-radius: 0; padding-left: 0; }
    .shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important; }
    .font-weight-600 { font-weight: 600 !important; }
    .badge-indigo-soft { background-color: #f5f3ff; color: #5b21b6; border-color: #ddd6fe !important; }
    .italic { font-style: italic; }
    .uppercase { text-transform: uppercase; }
</style>
@stop
