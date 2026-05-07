{{--
    Platform Authentication: Email Verification Gateway
    
    This view facilitates the activation of account capabilities 
    by validating the authenticity of the registered communication 
    node. It ensures that every entity in the marketplace 
    network is authenticated and verified.
    
    @extends frontend._layouts._guest
    @context Security Verification Suite
--}}
@extends('frontend._layouts._guest')

@section('title', __('Verify Email'))

@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Executive Marketing Hero --}}
<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    <div class="auth-glow auth-glow-tl"></div>
    
    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-premium border border-white border-opacity-10">
                <i class="bi bi-shield-lock text-primary display-4"></i>
            </div>
        </div>
        
        <h1 class="display-4 fw-800 mb-4 lh-sm">
            {!! __('Account <span class="text-gradient">Verification</span> Layer') !!}
        </h1>
        
        <p class="lead opacity-80 mb-5 fs-5 fw-medium">
            {{ __('Verify your credentials to activate your full marketplace capabilities. We ensure the integrity of every node in our network.') }}
        </p>

        <div class="vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-patch-check fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Identity Security') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Protecting your business footprint.') }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Platform Intelligence v2.4.0</p>
    </div>
</div>

{{-- Right Side: Functional Verification Action --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ __('Email Verification') }}</h2>
            <p class="text-muted fw-medium">{{ __('Confirm your identity to proceed.') }}</p>
        </div>

        <div class="alert alert-info border-0 shadow-premium small mb-4 py-3 rounded-xl d-flex align-items-start gap-3">
            <i class="bi bi-envelope-check fs-4 text-info"></i>
            <div class="fw-medium">
                {{ __('Almost there! We\'ve sent a verification link to your email. Please click it to activate your account.') }}
            </div>
        </div>

        @if (session('status') == 'verification-link-sent')
            <div class="alert alert-success border-0 shadow-premium small mb-4 py-3 rounded-xl d-flex align-items-center gap-3">
                <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                <div class="fw-bold">{{ __('A new verification link has been dispatched to your inbox.') }}</div>
            </div>
        @endif

        <div class="mt-5 vstack gap-4">
            <form method="POST" action="{{ route('verification.send') }}" class="d-grid">
                @csrf
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-send-check"></i>
                    {{ __('Resend Activation Email') }}
                </button>
            </form>

            <div class="position-relative">
                <hr class="text-muted opacity-25">
            </div>

            <form method="POST" action="{{ route('logout') }}" class="text-center">
                @csrf
                <p class="small text-muted fw-medium mb-0">
                    {{ __('Using a different account?') }}
                    <button type="submit" class="btn btn-link p-0 small fw-bold text-decoration-none ms-1 text-primary">
                        {{ __('Log Out') }}
                    </button>
                </p>
            </form>
        </div>
    </div>
</div>

@endsection

@push('styles')
@endpush
