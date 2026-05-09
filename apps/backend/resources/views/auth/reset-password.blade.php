{{--
    Platform Authentication: Password Reset Finalization
    
    This view provides the final step in the account recovery 
    protocol. It mandates the establishment of new, high-security 
    credentials by validating recovery tokens and enforcing 
    military-grade encryption standards.
    
    @extends frontend._layouts._guest
    @context Guest Recovery Suite
--}}
@extends('frontend._layouts._guest')

@section('title', __('Reset Password'))

@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Executive Marketing Hero --}}
<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    <div class="auth-glow auth-glow-tl"></div>
    
    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-premium border border-white border-opacity-10">
                <i class="bi bi-shield-check text-primary display-4"></i>
            </div>
        </div>
        
        <h1 class="display-4 fw-800 mb-4 lh-sm">
            {!! __('New <span class="text-gradient">Credentials</span> Protocol') !!}
        </h1>
        
        <p class="lead opacity-80 mb-5 fs-5 fw-medium">
            {{ __('Finalize your account recovery by establishing a high-security password. Your data integrity is our core priority.') }}
        </p>

        <div class="vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-shield-lock fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Military-Grade Encryption') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Your credentials never leave our secure layer.') }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Platform Intelligence v2.4.0</p>
    </div>
</div>

{{-- Right Side: Functional Password Reset Form --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ __('Reset Password') }}</h2>
            <p class="text-muted fw-medium">{{ __('Complete the verification to secure your access.') }}</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-premium small mb-4 py-3 rounded-xl">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('password.store') }}">
            @csrf
            <input type="hidden" name="token" value="{{ $request->route('token') }}">

            <div class="mb-4">
                <label for="email" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('EMAIL ADDRESS') }}</label>
                <div class="form-icon-group">
                    <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email', $request->email) }}" required autofocus>
                    <i class="bi bi-envelope input-icon"></i>
                </div>
            </div>

            <div class="mb-4">
                <label for="password" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('NEW PASSWORD') }}</label>
                <div class="form-icon-group">
                    <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required autocomplete="new-password">
                    <i class="bi bi-shield-lock input-icon"></i>
                    <i class="bi bi-eye password-toggle"></i>
                </div>
            </div>

            <div class="mb-5">
                <label for="password_confirmation" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('CONFIRM PASSWORD') }}</label>
                <div class="form-icon-group">
                    <input type="password" class="form-control rounded-pill" id="password_confirmation" name="password_confirmation" placeholder="••••••••" required>
                    <i class="bi bi-shield-check input-icon"></i>
                    <i class="bi bi-eye password-toggle"></i>
                </div>
            </div>

            <div class="d-grid gap-3">
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6">
                    {{ __('Finalize Password Reset') }}
                </button>
                
                <a href="{{ route('login') }}" class="btn btn-light btn-lg py-3 fs-6 text-muted border-0 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-arrow-left"></i>
                    {{ __('Back to Login') }}
                </a>
            </div>
        </form>
    </div>
</div>

@endsection

@push('styles')
{{-- Page specific styles (if any) --}}
@endpush
