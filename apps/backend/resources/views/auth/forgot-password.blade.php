@extends('frontend._layouts._guest')

@section('title', __('Forgot Password'))

@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Marketing & Recovery Visuals (Consistent with the Brand) --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);">
    
    <div class="position-absolute translate-middle" style="top: 20%; left: 20%; width: 500px; height: 500px; background: rgba(255,255,255,0.1); filter: blur(120px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1 text-center" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm">
            <i class="bi bi-key-fill text-white display-4"></i>
        </div>
        
        <h1 class="display-5 fw-800 mb-3">
            {{ __('Account Recovery') }}
        </h1>
        
        <p class="lead opacity-75 mb-5">
            {{ __('Don’t worry! It happens to the best of us. Simply enter your email and we’ll help you get back to your dashboard in no time.') }}
        </p>

        <div class="row g-4 text-start mt-4">
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-lightning-charge fs-4"></i>
                    <span class="small fw-medium">{{ __('Instant Reset Link') }}</span>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-shield-lock fs-4"></i>
                    <span class="small fw-medium">{{ __('Secure Recovery') }}</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Functional Reset Link Request --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white py-5 position-relative">
    <div class="w-100 px-4 px-md-5" style="max-width: 520px;">
        
        {{-- Mobile Logo --}}
        <div class="mb-5">
            <div class="d-lg-none mb-4 text-center">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-3 mb-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            
            <h2 class="h3 fw-bold text-dark mb-2">{{ __('Forgot Your Password?') }}</h2>
            <p class="text-muted">{{ __('No problem. We\'ll email you a link to reset it.') }}</p>
        </div>

        {{-- Session Status (Success message after sending email) --}}
        @if (session('status'))
            <div @class(['alert alert-success border-0 shadow-sm small mb-4 py-3 rounded-4 d-flex align-items-center gap-3']) role="alert">
                <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                <div>{{ session('status') }}</div>
            </div>
        @endif

        {{-- Validation Errors --}}
        @if ($errors->any())
            <div @class(['alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4']) role="alert">
                <ul class="mb-0 ps-3">
                    @forelse ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @empty
                        <li>{{ __('Something went wrong.') }}</li>
                    @endforelse
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            {{-- Email Address Input --}}
            <div class="mb-4">
                <label for="email" class="form-label fw-semibold small text-dark">{{ __('Email Address') }}</label>
                <div class="position-relative">
                    <input id="email" 
                           @class(['form-control bg-light border-0 px-4', 'is-invalid' => $errors->has('email')]) 
                           type="email" 
                           name="email" 
                           value="{{ old('email') }}" 
                           placeholder="{{ __('name@example.com') }}" 
                           required 
                           autofocus />
                    <i class="bi bi-envelope position-absolute top-50 end-0 translate-middle-y me-3 text-muted"></i>
                </div>
            </div>

            <div class="d-grid gap-3">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3 shadow-sm border-0 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-send-check-fill"></i>
                    {{ __('Email Password Reset Link') }}
                </button>
                
                <a href="{{ route('login') }}" class="btn btn-light btn-lg fw-bold text-muted border-0 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-arrow-left"></i>
                    {{ __('Back to Login') }}
                </a>
            </div>
        </form>

        {{-- Mobile Footer --}}
        <div class="mt-5 pt-4 text-center d-lg-none">
            <span class="text-muted small">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}.</span>
        </div>
    </div>

    {{-- Desktop Footer --}}
    <div class="position-absolute bottom-0 start-0 w-100 p-4 text-center d-none d-lg-block">
        <span class="text-muted small">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. {{ __('All rights reserved.') }}</span>
    </div>
</div>

@endsection

@push('styles')
<style>
    .fw-800 { font-weight: 800; }
    
    .form-control {
        min-height: 52px;
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .form-control:focus {
        background-color: #fff !important;
        box-shadow: 0 0 0 4px hsla(var(--primary-hue), 75%, 60%, 0.1);
        border-color: var(--primary-color);
    }

    .btn-lg {
        min-height: 58px;
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .btn-primary:hover {
        transform: translateY(-1px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
</style>
@endpush
