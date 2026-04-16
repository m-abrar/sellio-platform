@extends('frontend._layouts._guest')

@section('title', __('Confirm Password'))

@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Marketing & Security Visuals --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);">
    
    <div class="position-absolute translate-middle" style="top: 20%; left: 20%; width: 500px; height: 500px; background: rgba(255,255,255,0.1); filter: blur(120px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1 text-center" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm">
            <i class="bi bi-shield-lock-fill text-white display-4"></i>
        </div>
        
        <h1 class="display-5 fw-800 mb-3">
            {{ __('Secure Access') }}
        </h1>
        
        <p class="lead opacity-75 mb-5">
            {{ __('For your protection, please verify your identity before accessing this sensitive area of your marketplace dashboard.') }}
        </p>

        <div class="row g-4 text-start mt-4">
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-fingerprint fs-4"></i>
                    <span class="small fw-medium">{{ __('Identity Verified') }}</span>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-incognito fs-4"></i>
                    <span class="small fw-medium">{{ __('Encrypted Session') }}</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Functional Confirmation Form --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white py-5 position-relative">
    <div class="w-100 px-4 px-md-5" style="max-width: 520px;">
        
        {{-- Brand Logo for Mobile --}}
        <div class="mb-5">
            <div class="d-lg-none mb-4 text-center">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-3 mb-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            
            <h2 class="h3 fw-bold text-dark mb-2">{{ __('Confirm Access') }}</h2>
            <p class="text-muted">{{ __('Please re-enter your password to continue.') }}</p>
        </div>

        {{-- Security Notice --}}
        <div @class(['alert alert-info border-0 shadow-sm small mb-4 py-3 rounded-4 d-flex align-items-center gap-3']) role="alert">
            <i class="bi bi-info-circle-fill fs-5 text-info"></i>
            <div>
                {{ __('This is a secure area of the application. Please confirm your password before continuing.') }}
            </div>
        </div>

        {{-- Validation Errors --}}
        @if ($errors->any())
            <div @class(['alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4']) role="alert">
                <ul class="mb-0 ps-3">
                    @forelse ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @empty
                        <li>{{ __('An unexpected error occurred.') }}</li>
                    @endforelse
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('password.confirm') }}" class="mb-4">
            @csrf

            {{-- Password Input --}}
            <div class="mb-4">
                <label for="passwordInput" class="form-label fw-semibold">{{ __('Password') }}</label>
                <div class="position-relative">
                    <input id="passwordInput" 
                           @class(['form-control bg-light border-0 px-4', 'is-invalid' => $errors->has('password')]) 
                           type="password" 
                           name="password" 
                           placeholder="••••••••" 
                           required 
                           autocomplete="current-password" 
                           autofocus />
                    <i class="bi bi-key position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
            </div>

            <div class="d-grid">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3 shadow-sm border-0 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-check-circle-fill"></i>
                    {{ __('Confirm Identity') }}
                </button>
            </div>
        </form>

        {{-- Footer Copyright for Mobile --}}
        <div class="mt-5 pt-4 text-center d-lg-none">
            <span class="text-muted small">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}.</span>
        </div>
    </div>

    {{-- Absolute positioned footer for Desktop --}}
    <div class="position-absolute bottom-0 start-0 w-100 p-4 text-center d-none d-lg-block">
        <span class="text-muted small">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. {{ __('All rights reserved.') }}</span>
    </div>
</div>

@endsection

@push('styles')
<style>
    .fw-800 { font-weight: 800; }
    
    /* Ensure the split screen layout works correctly within the layout's grid */
    @media (min-width: 992px) {
        .auth-wrapper .row {
            height: 100vh;
        }
    }

    /* Custom touch target optimization */
    .btn-lg {
        min-height: 58px;
    }

    .form-control {
        min-height: 52px;
        transition: all 0.2s ease-in-out;
    }
</style>
@endpush
