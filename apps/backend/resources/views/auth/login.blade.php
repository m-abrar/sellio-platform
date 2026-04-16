@extends('frontend._layouts._guest')

@section('title', page_content('auth.login.seo_title', __('Login')))
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Marketing & Brand Visuals --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);">
    
    <div class="position-absolute translate-middle" style="top: 20%; left: 20%; width: 500px; height: 500px; background: rgba(255,255,255,0.1); filter: blur(120px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1 text-center" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm">
            <i class="bi bi-rocket-takeoff text-white display-4"></i>
        </div>
        
        <h1 class="display-5 fw-800 mb-3">
            {!! page_content('auth.login.marketing_title', setting('site_name', config('app.name'))) !!}
        </h1>
        
        <p class="lead opacity-75 mb-5">
            {{ page_content('auth.login.marketing_desc', __('Access your personalized marketplace dashboard and manage your digital assets with ease.')) }}
        </p>

        <div class="row g-4 text-start mt-4">
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-shield-check fs-4"></i>
                    <span class="small fw-medium">{{ page_content('auth.login.feature_1', __('Secure Payments')) }}</span>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-lightning-charge fs-4"></i>
                    <span class="small fw-medium">{{ page_content('auth.login.feature_2', __('Fast Deployment')) }}</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Functional Login Form --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white py-5 position-relative">
    <div class="w-100 px-4 px-md-5" style="max-width: 520px;">
        
        <div class="mb-5">
            <div class="d-lg-none mb-4 text-center">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-3 mb-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! page_content('global.header.brand_text', setting('site_name', config('app.name'))) !!}</span>
                </div>
            </div>
            
            <h2 class="h3 fw-bold text-dark mb-2">{{ page_content('auth.login.form_heading', __('Sign In')) }}</h2>
            <p class="text-muted">{{ page_content('auth.login.form_subheading', __('Welcome back! Please enter your details.')) }}</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success border-0 shadow-sm small mb-4 py-3 rounded-4" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i> {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4" role="alert">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" class="mb-4">
            @csrf
            
            <div class="mb-3">
                <label for="email" class="form-label fw-semibold">{{ __('Email Address') }}</label>
                <input type="email" @class(['form-control bg-light border-0 px-4', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="{{ __('name@example.com') }}" required autofocus>
            </div>

            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="password" class="form-label fw-semibold mb-0">{{ __('Password') }}</label>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="small fw-bold text-decoration-none" style="color: var(--primary-color);">{{ __('Forgot password?') }}</a>
                    @endif
                </div>
                <input type="password" @class(['form-control bg-light border-0 px-4', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required autocomplete="current-password">
            </div>
            
            <div class="mb-4">
                <div class="form-check custom-check">
                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                    <label class="form-check-label small text-muted ms-1" for="remember">
                        {{ page_content('auth.login.remember_text', __('Keep me signed in for 30 days')) }}
                    </label>
                </div>
            </div>

            <div class="d-grid mb-4">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3 shadow-sm border-0">
                    {{ page_content('auth.login.submit_btn', __('Sign In to Dashboard')) }}
                </button>
            </div>

            {{-- Divider --}}
            <div class="position-relative mb-4">
                <hr class="text-muted opacity-25">
                <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted fw-medium text-uppercase" style="font-size: 0.65rem; letter-spacing: 1px;">
                    {{ __('Or continue with') }}
                </span>
            </div>

            {{-- Social Buttons Grid --}}
            <div class="row g-3 mb-4">
                {{-- Google Button --}}
                <div class="col-6">
                    <a href="{{ route('login.social', 'google') }}" 
                    class="btn btn-outline-light text-dark border shadow-sm w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 social-btn text-decoration-none">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google">
                        <span class="small">{{ __('Google') }}</span>
                    </a>
                </div>

                {{-- Facebook Button --}}
                <div class="col-6">
                    <a href="{{ route('login.social', 'facebook') }}" 
                    class="btn btn-outline-light text-dark border shadow-sm w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 social-btn text-decoration-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1877F2" class="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                        </svg>
                        <span class="small">{{ __('Facebook') }}</span>
                    </a>
                </div>
            </div>
        </form>

        <div class="text-center">
            <p class="mb-0 small text-muted">
                {{ page_content('auth.login.footer_text', __("Don't have an account yet?")) }} 
                <a href="{{ route('register') }}" class="fw-bold text-decoration-none ms-1" style="color: var(--primary-color);">
                    {{ __('Create an account') }}
                </a>
            </p>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-4 text-center d-none d-lg-block">
        <span class="text-muted small">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. {{ __('All rights reserved.') }}</span>
    </div>
</div>

@endsection

@push('styles')
<style>
    .fw-800 { font-weight: 800; }
    
    .social-btn {
        transition: all 0.2s ease;
        background-color: #ffffff;
    }

    .social-btn:hover {
        background-color: #f8f9fa !important;
        border-color: #d1d5db !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
    }

    @media (min-width: 992px) {
        .col-lg-6 { transition: all 0.5s ease-in-out; }
    }
</style>
@endpush
