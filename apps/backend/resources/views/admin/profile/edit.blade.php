@extends('adminlte::page')

@section('title', 'Account Intelligence | Personal Settings')

@section('content_header')
    <div class="container-fluid">
        <div class="row mb-4 align-items-end">
            <div class="col-sm-6">
                <h1 class="m-0 text-dark font-weight-bold">
                    <i class="fas fa-user-shield mr-2 text-primary"></i> 
                    My Master Profile
                </h1>
                <p class="text-muted mt-2 small text-uppercase letter-spacing-1 mb-0">Identity and credential management for your administrative account.</p>
            </div>
            <div class="col-sm-6 text-right">
                <button type="submit" form="profileUpdateForm" class="btn btn-primary btn-sm rounded-pill px-4 font-weight-bold shadow-lg">
                    <i class="fas fa-save mr-1"></i> SAVE PROFILE
                </button>
                <ol class="breadcrumb float-sm-right bg-transparent p-0 mt-3 small">
                    <li class="breadcrumb-item"><a href="{{ route('admin.welcome') }}">Dashboard</a></li>
                    <li class="breadcrumb-item active">Account Settings</li>
                </ol>
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
                <div class="card border-0 shadow-premium overflow-hidden" style="border-radius: 24px;">
                    <div class="card-header bg-white py-4 px-4 border-0">
                        <h3 class="card-title font-weight-bold text-dark mb-0">
                            <i class="fas fa-id-card mr-2 text-primary opacity-50"></i> Personal Identification
                        </h3>
                    </div>
                    <div class="card-body p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label>Display Name</label>
                                    <input type="text" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
                                    @error('name') <span class="text-danger smallest font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group mb-4">
                                    <label>Master Email</label>
                                    <input type="email" name="email" class="form-control" value="{{ old('email', $user->email) }}" required>
                                    @error('email') <span class="text-danger smallest font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                </div>
                            </div>
                        </div>

                        <hr class="my-4 opacity-5">

                        <div class="p-4 rounded-xl" style="background: var(--primary-soft); border: 1px solid var(--primary-glow);">
                            <h5 class="text-primary font-weight-bold mb-4 smallest text-uppercase letter-spacing-1">
                                <i class="fas fa-key mr-2"></i> SECURITY CREDENTIALS
                            </h5>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label>New Secret Key</label>
                                        <input type="password" name="password" class="form-control" placeholder="••••••••">
                                        <small class="text-muted mt-2 d-block font-italic">Retain existing by leaving this field empty.</small>
                                        @error('password') <span class="text-danger smallest font-weight-bold mt-1 d-block">{{ $message }}</span> @enderror
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group mb-0">
                                        <label>Confirm Key</label>
                                        <input type="password" name="password_confirmation" class="form-control" placeholder="••••••••">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Sidebar Column --}}
            <div class="col-md-4">
                {{-- Account Metadata --}}
                <div class="card border-0 shadow-sm mb-4 overflow-hidden" style="border-radius: 20px;">
                    <div class="card-header bg-dark py-3 px-4" style="border-bottom: 4px solid var(--primary) !important;">
                        <h3 class="card-title text-white mb-0 font-weight-bold small text-uppercase letter-spacing-1">
                            Registry Status
                        </h3>
                    </div>
                    <div class="card-body bg-white py-4">
                        <div class="mb-4">
                            <label class="d-block smallest font-weight-bold text-muted mb-2 text-uppercase letter-spacing-1">Authority Level</label>
                            <span class="badge badge-primary-light text-primary px-3 py-2 font-weight-bold rounded-pill" style="font-size: 0.7rem;">
                                <i class="fas fa-crown mr-1"></i> {{ strtoupper($user->roles->first()->name ?? 'MASTER ADMIN') }}
                            </span>
                        </div>

                        <div class="mb-0 pt-3 border-top">
                            <label class="d-block smallest font-weight-bold text-muted mb-1 text-uppercase letter-spacing-1">Account Lifecycle</label>
                            <span class="d-block font-weight-bold text-dark mb-1">{{ $user->created_at->format('M d, Y') }}</span>
                            <small class="text-muted font-weight-bold italic">{{ $user->created_at->diffForHumans() }}</small>
                        </div>
                    </div>
                </div>

                {{-- Visual Identity --}}
                <div class="card border-0 shadow-sm mb-4" style="border-radius: 20px;">
                    <div class="card-header bg-white border-0 py-3 px-4">
                        <h3 class="card-title font-weight-bold text-dark mb-0 small text-uppercase letter-spacing-1">Avatar Interface</h3>
                    </div>
                    <div class="card-body p-0">
                        @include('admin._partials._image-uploader', [
                            'name' => \App\Models\User::PRIMARY_MEDIA,
                            'label' => 'Select Profile Photo',
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
