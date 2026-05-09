{{--
    Platform Authentication: Identity Verification Protocol
    
    This view enforces a secure verification layer before 
    accessing sensitive account modifications. It mandates 
    credential re-authentication to ensure data integrity 
    within the marketplace environment.
    
    @extends frontend._layouts._guest
    @context Security Verification Suite
--}}
@extends('frontend._layouts._guest')

@section('title', __('Confirm Password'))
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Executive Security Marketing --}}
<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    <div class="auth-glow auth-glow-tl"></div>
    <div class="auth-glow auth-glow-br"></div>
    
    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-premium border border-white border-opacity-10">
                <i class="bi bi-shield-lock-fill text-primary display-4"></i>
            </div>
        </div>
        
        <h1 class="display-4 fw-800 mb-4 lh-sm">
            {!! __('Secure <span class="text-gradient">Access</span> Protocol') !!}
        </h1>
        
        <p class="lead opacity-80 mb-5 fs-5 fw-medium">
            {{ __('For your protection, please verify your identity before accessing this sensitive area of your marketplace dashboard.') }}
        </p>

        <div class="vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-fingerprint fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Identity Verified') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Multi-layer biometric security standards.') }}</p>
                </div>
            </div>
            
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-incognito fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Encrypted Session') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('End-to-end credential shielding.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Security Layer v2.4.0</p>
    </div>
</div>

{{-- Right Side: High-Fidelity Confirmation Card --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ __('Confirm Access') }}</h2>
            <p class="text-muted fw-medium text-uppercase divider-badge">{{ __('Identity Verification Required') }}</p>
        </div>

        <div class="alert alert-info d-flex align-items-start gap-3">
            <i class="bi bi-info-circle-fill fs-5 mt-1"></i>
            <div class="fw-medium">
                {{ __('This is a secure area. Please confirm your password before continuing to sensitive settings.') }}
            </div>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0 ps-3 small fw-medium">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('password.confirm') }}" class="mb-4">
            @csrf
            
            <div class="mb-5">
                <label for="password" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('PASSWORD') }}</label>
                <div class="form-icon-group">
                    <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required autofocus>
                    <i class="bi bi-shield-lock input-icon"></i>
                    <i class="bi bi-eye password-toggle"></i>
                </div>
            </div>

            <div class="d-grid mb-4">
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-check-circle-fill"></i>
                    {{ __('Confirm Identity') }}
                </button>
            </div>
        </form>

        <div class="text-center">
            <a href="{{ route('login') }}" class="small fw-bold text-decoration-none text-gradient">
                <i class="bi bi-arrow-left me-1"></i> {{ __('Back to Safety') }}
            </a>
        </div>
    </div>
</div>

@endsection

@push('styles')
@endpush
