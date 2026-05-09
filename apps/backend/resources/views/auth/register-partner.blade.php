{{--
    Platform Authentication: Partner Onboarding Interface
    
    This view facilitates the registration and onboarding of new 
    merchant entities. It integrates a multi-step conceptual 
    onboarding flow with high-fidelity branding and secure 
    credential establishment.
    
    @extends frontend._layouts._guest
    @context Partner Onboarding Suite
--}}
@extends('frontend._layouts._guest')

@section('title', 'Partner Onboarding | Merchant Registration')
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Executive Partner Onboarding --}}
<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    <div class="auth-glow auth-glow-tl"></div>
    <div class="auth-glow auth-glow-tr"></div>
    
    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-premium border border-white border-opacity-10">
                <i class="bi bi-rocket-takeoff text-primary display-4"></i>
            </div>
        </div>
        
        <h1 class="display-4 fw-800 mb-4 lh-sm">
            Join the <span class="text-gradient">Master</span> Partner Network
        </h1>
        
        <div class="onboarding-steps vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <span class="fw-bold">01</span>
                </div>
                <div>
                    <h6 class="fw-bold mb-1">{{ __('Create Identity') }}</h6>
                    <p class="small opacity-60 mb-0">{{ __('Setup your merchant profile and secure your credentials.') }}</p>
                </div>
            </div>
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <span class="fw-bold">02</span>
                </div>
                <div>
                    <h6 class="fw-bold mb-1">{{ __('Business Verification') }}</h6>
                    <p class="small opacity-60 mb-0">{{ __('Submit your store details for rapid catalog activation.') }}</p>
                </div>
            </div>
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <span class="fw-bold">03</span>
                </div>
                <div>
                    <h6 class="fw-bold mb-1">{{ __('Start Scaling') }}</h6>
                    <p class="small opacity-60 mb-0">{{ __('Leverage our global traffic and advanced checkout system.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Partner Onboarding v2.4.0</p>
    </div>
</div>

{{-- Right Side: High-Fidelity Registration Card --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ __('Merchant Onboarding') }}</h2>
            <p class="text-muted fw-medium text-uppercase divider-badge">{{ __('Start your global trade journey today') }}</p>
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

        <form method="POST" action="{{ route('register') }}" class="mb-4">
            @csrf
            
            <div class="mb-4">
                <label for="name" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('FULL LEGAL NAME') }}</label>
                <div class="form-icon-group">
                    <input type="text" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('name')]) id="name" name="name" value="{{ old('name') }}" placeholder="Alexander Pierce" required autofocus>
                    <i class="bi bi-person input-icon"></i>
                </div>
            </div>

            <div class="mb-4">
                <label for="email" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('WORK EMAIL ADDRESS') }}</label>
                <div class="form-icon-group">
                    <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="alex@company.com" required>
                    <i class="bi bi-envelope input-icon"></i>
                </div>
            </div>

            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label for="password" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('SECURITY KEY') }}</label>
                    <div class="form-icon-group">
                        <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required>
                        <i class="bi bi-shield-lock input-icon"></i>
                        <i class="bi bi-eye password-toggle"></i>
                    </div>
                </div>
                <div class="col-md-6">
                    <label for="password_confirmation" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('CONFIRM KEY') }}</label>
                    <div class="form-icon-group">
                        <input type="password" class="form-control rounded-pill" id="password_confirmation" name="password_confirmation" placeholder="••••••••" required>
                        <i class="bi bi-shield-check input-icon"></i>
                        <i class="bi bi-eye password-toggle"></i>
                    </div>
                </div>
            </div>
            
            <div class="mb-5">
                <div class="form-check custom-check d-flex align-items-start gap-3 py-1">
                    <input class="form-check-input flex-shrink-0 custom-check-input" type="checkbox" name="terms" id="terms" required>
                    <label class="form-check-label small text-muted fw-bold mb-0 custom-check-label" for="terms">
                        I agree to the <a href="#" class="text-gradient fw-bold text-decoration-none">Master Service Agreement</a> and Privacy Policy.
                    </label>
                </div>
            </div>

            <div class="d-grid mb-5">
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6">
                    {{ __('INITIALIZE ONBOARDING') }}
                </button>
            </div>
        </form>

        <div class="text-center">
            <p class="mb-0 small text-muted fw-bold">
                {{ __("Already part of the ecosystem?") }} 
                <a href="{{ route('login') }}" class="fw-bold text-decoration-none ms-1 text-gradient">
                    {{ __('Partner Sign In') }}
                </a>
            </p>
        </div>
    </div>
</div>

@endsection

@push('styles')
@endpush
