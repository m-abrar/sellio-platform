@extends('frontend._layouts._guest')

@section('title', __('Verify Email'))

@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Marketing & Brand Visuals (Consistent with Login) --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);">
    
    <div class="position-absolute translate-middle" style="top: 20%; left: 20%; width: 500px; height: 500px; background: rgba(255,255,255,0.1); filter: blur(120px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1 text-center" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm">
            <i class="bi bi-shield-lock text-white display-4"></i>
        </div>
        
        <h1 class="display-5 fw-800 mb-3">
            {{ __('Secure Your Account') }}
        </h1>
        
        <p class="lead opacity-75 mb-5">
            {{ __('Verify your email address to access the full potential of our digital marketplace and manage your assets securely.') }}
        </p>

        <div class="row g-4 text-start mt-4">
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-patch-check fs-4"></i>
                    <span class="small fw-medium">{{ __('Verified Access') }}</span>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-envelope-heart fs-4"></i>
                    <span class="small fw-medium">{{ __('Priority Support') }}</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Functional Verification Action --}}
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
            
            <h2 class="h3 fw-bold text-dark mb-2">{{ __('Email Verification') }}</h2>
            <p class="text-muted">{{ __('Welcome! Please confirm your email to continue.') }}</p>
        </div>

        {{-- Main Instruction Alert --}}
        <div @class(['alert alert-info border-0 shadow-premium small mb-4 py-3 rounded-xl d-flex align-items-start gap-3']) role="alert">
            <i class="bi bi-envelope-check-fill fs-4 text-info"></i>
            <div>
                {{ __('Thanks for signing up! Please check your email for a verification link. If you didn\'t receive it, you can request a new one below.') }}
            </div>
        </div>

        {{-- Session Status (Success message after resending the link) --}}
        @if (session('status') == 'verification-link-sent')
            <div @class(['alert alert-success border-0 shadow-premium small mb-4 py-3 rounded-xl']) role="alert">
                <i class="bi bi-check-circle-fill me-2"></i> 
                {{ __('A new verification link has been sent to the email address you provided during registration.') }}
            </div>
        @endif

        <div class="mt-4">
            {{-- Form to Resend Verification Email --}}
            <form method="POST" action="{{ route('verification.send') }}" class="d-grid mb-4">
                @csrf
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3 rounded-pill shadow-premium border-0 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-send-fill"></i>
                    {{ __('Resend Verification Email') }}
                </button>
            </form>

            {{-- Divider --}}
            <div class="position-relative mb-4">
                <hr class="text-muted opacity-25">
            </div>

            {{-- Form to Logout --}}
            <form method="POST" action="{{ route('logout') }}" class="text-center">
                @csrf
                <p class="small text-muted mb-0">
                    {{ __('Need to change accounts?') }}
                    <button type="submit" class="btn btn-link p-0 small fw-bold text-decoration-none ms-1" style="color: var(--primary);">
                        {{ __('Log Out of this Account') }}
                    </button>
                </p>
            </form>
        </div>

        {{-- Footer Copyright for Mobile/Right Side --}}
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
    
    .btn-lg {
        min-height: 58px;
        transition: all 0.3s ease;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-glow) !important;
    }

    @media (min-width: 992px) {
        .auth-wrapper .row {
            height: 100vh;
        }
    }
</style>
@endpush
