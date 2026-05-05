@extends('frontend._layouts._guest')

@section('title', __('Forgot Password'))

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
            {!! __('Account <span class="text-gradient">Recovery</span> Hub') !!}
        </h1>
        
        <p class="lead opacity-80 mb-5 fs-5 fw-medium">
            {{ __('Securely regain access to your business environment. We use advanced verification to protect your ecosystem.') }}
        </p>

        <div class="vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-lightning fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Instant Link') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Get back to work in seconds.') }}</p>
                </div>
            </div>
            
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-shield-check fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Encrypted Reset') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Your security is our top priority.') }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Platform Intelligence v2.4.0</p>
    </div>
</div>

{{-- Right Side: Functional Reset Link Request --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ __('Lost Access?') }}</h2>
            <p class="text-muted fw-medium">{{ __('Enter your email to receive a secure recovery link.') }}</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success border-0 shadow-premium small mb-4 py-3 rounded-xl d-flex align-items-center gap-3">
                <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                <div>{{ session('status') }}</div>
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-premium small mb-4 py-3 rounded-xl">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('password.email') }}">
            @csrf

            <div class="mb-5">
                <label for="email" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('EMAIL ADDRESS') }}</label>
                <div class="form-icon-group">
                    <input id="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) type="email" name="email" value="{{ old('email') }}" placeholder="name@company.com" required autofocus />
                    <i class="bi bi-envelope input-icon"></i>
                </div>
            </div>

            <div class="d-grid gap-3">
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6 d-flex align-items-center justify-content-center gap-2">
                    <i class="bi bi-send-check"></i>
                    {{ __('Send Recovery Link') }}
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
