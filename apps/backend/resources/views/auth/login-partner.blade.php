@extends('frontend._layouts._guest')

@section('title', 'Partner Gateway | Login')
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Executive Partner Marketing --}}
<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    <div class="auth-glow auth-glow-tl"></div>
    <div class="auth-glow auth-glow-br"></div>
    
    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-premium border border-white border-opacity-10">
                <i class="bi bi-person-workspace text-primary display-4"></i>
            </div>
        </div>
        
        <h1 class="display-4 fw-800 mb-4 lh-sm">
            Partner <span class="text-gradient">Ecosystem</span> Gateway
        </h1>
        
        <p class="lead opacity-80 mb-5 fs-5 fw-medium">
            Access your high-performance merchant suite to manage global distribution, track real-time analytics, and scale your business.
        </p>

        <div class="vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-graph-up-arrow fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Real-time Pulse') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Track every metric with zero latency.') }}</p>
                </div>
            </div>
            
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-wallet2 fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ __('Unified Revenue') }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Streamlined payouts across all channels.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Merchant Portal v2.4.0</p>
    </div>
</div>

{{-- Right Side: High-Fidelity Login Card --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ __('Partner Sign In') }}</h2>
            <p class="text-muted fw-medium text-uppercase divider-badge">{{ __('Authorized Merchant Access Only') }}</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success d-flex align-items-center gap-3">
                <i class="bi bi-check-circle-fill fs-5"></i>
                <div>{{ session('status') }}</div>
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0 ps-3 small fw-medium">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" class="mb-4">
            @csrf
            
            <div class="mb-4">
                <label for="email" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('MERCHANT EMAIL') }}</label>
                <div class="form-icon-group">
                    <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="partner@sellio.com" required autofocus>
                    <i class="bi bi-envelope input-icon"></i>
                </div>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <label for="password" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('SECRET CREDENTIAL') }}</label>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="small fw-bold text-decoration-none text-gradient">{{ __('Forgot Credentials?') }}</a>
                    @endif
                </div>
                <div class="form-icon-group">
                    <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required autocomplete="current-password">
                    <i class="bi bi-shield-lock input-icon"></i>
                </div>
            </div>
            
            <div class="mb-5">
                <div class="form-check custom-check d-flex align-items-center gap-3 py-1">
                    <input class="form-check-input flex-shrink-0 custom-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                    <label class="form-check-label small text-muted fw-bold mb-0 custom-check-label" for="remember">
                        {{ __('Remember this workstation') }}
                    </label>
                </div>
            </div>

            <div class="d-grid mb-5">
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6">
                    {{ __('ENTER ECOSYSTEM') }}
                </button>
            </div>
        </form>

        <div class="text-center">
            <p class="mb-0 small text-muted fw-bold">
                {{ __("New to the partner network?") }} 
                <a href="{{ route('register') }}" class="fw-bold text-decoration-none ms-1 text-gradient">
                    {{ __('Apply for Merchant Account') }}
                </a>
            </p>
        </div>
    </div>
</div>

@endsection

@push('styles')
@endpush
