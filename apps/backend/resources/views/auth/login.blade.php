{{--
    Platform Authentication: Multi-Tenant Login Gateway
    
    This view provides the authoritative entry point for the 
    marketplace ecosystem. It integrates high-fidelity marketing 
    hero sections with a secure, credentialed access interface. 
    It supports multi-tenancy and social authentication protocols.
    
    @extends frontend._layouts._guest
    @context Guest Authentication Suite
--}}
@extends('frontend._layouts._guest')

@section('title', page_content('auth.login.seo_title', __('Login')))
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Executive Marketing Hero --}}
<div class="col-lg-6 d-none d-lg-flex auth-split-marketing text-white">
    {{-- Decorative Glows --}}
    <div class="auth-glow auth-glow-tl"></div>
    <div class="auth-glow auth-glow-br"></div>
    
    <div class="auth-marketing-content">
        <div class="mb-5 d-inline-block">
            <div class="p-3 rounded-xl bg-white bg-opacity-10 backdrop-blur-md shadow-premium border border-white border-opacity-10">
                <i class="bi bi-rocket-takeoff text-primary display-4"></i>
            </div>
        </div>
        
        <h1 class="display-4 fw-800 mb-4 lh-sm">
            {!! page_content('auth.login.marketing_title', __('Master Your <span class="text-gradient">Marketplace</span> Ecosystem')) !!}
        </h1>
        
        <p class="lead opacity-80 mb-5 fs-5 fw-medium">
            {{ page_content('auth.login.marketing_desc', __('Access your high-performance dashboard to manage assets, track growth, and optimize operations in real-time.')) }}
        </p>

        <div class="vstack gap-4 mt-2">
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-shield-check fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ page_content('auth.login.feature_1_title', __('Enterprise Security')) }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Bank-grade encryption for all transactions.') }}</p>
                </div>
            </div>
            
            <div class="d-flex align-items-center gap-4">
                <div class="icon-box-soft bg-white bg-opacity-10 rounded-circle flex-shrink-0">
                    <i class="bi bi-lightning-charge fs-4"></i>
                </div>
                <div>
                    <h5 class="mb-0 fw-bold">{{ page_content('auth.login.feature_2_title', __('Real-time Analytics')) }}</h5>
                    <p class="small opacity-60 mb-0">{{ __('Instant insights into your business pulse.') }}</p>
                </div>
            </div>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-5 pb-5">
        <p class="auth-footer-copyright mb-0 text-white opacity-50">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Platform Intelligence v2.4.0</p>
    </div>
</div>

{{-- Right Side: High-Fidelity Login Card --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card">
        {{-- Brand Mobile Logo --}}
        <div class="text-center mb-5">
            <div class="d-lg-none mb-4">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! setting('site_name', config('app.name')) !!}</span>
                </div>
            </div>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ page_content('auth.login.form_heading', __('Welcome Back')) }}</h2>
            <p class="text-muted fw-medium">{{ page_content('auth.login.form_subheading', __('Please enter your credentials to sign in.')) }}</p>
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

        <form method="POST" action="{{ route('login') }}" class="mb-4">
            @csrf
            
            <div class="mb-4">
                <label for="email" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('EMAIL ADDRESS') }}</label>
                <div class="form-icon-group">
                    <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="name@company.com" required autofocus>
                    <i class="bi bi-envelope input-icon"></i>
                </div>
            </div>

            <div class="mb-4">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <label for="password" class="form-label fw-bold small text-dark opacity-75 ms-1">{{ __('PASSWORD') }}</label>
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
                        {{ page_content('auth.login.remember_text', __('Keep me signed in for 30 days')) }}
                    </label>
                </div>
            </div>

            <div class="d-grid mb-5">
                <button type="submit" class="btn btn-primary btn-lg py-3 fs-6">
                    {{ page_content('auth.login.submit_btn', __('Sign In to Command Center')) }}
                </button>
            </div>

            {{-- Divider --}}
            <div class="position-relative my-5">
                <hr class="text-muted opacity-25">
                <span class="position-absolute top-50 start-50 translate-middle px-3 py-1 bg-white border rounded-pill shadow-sm small text-muted fw-bold text-uppercase divider-badge">
                    {{ __('Secure Social Gateway') }}
                </span>
            </div>

            {{-- Social Buttons --}}
            <div class="row g-3">
                <div class="col-6">
                    <a href="{{ route('login.social', 'google') }}" 
                    class="btn btn-outline-light text-dark border shadow-sm w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 social-btn text-decoration-none">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google">
                        <span class="small">{{ __('Google') }}</span>
                    </a>
                </div>
                <div class="col-6">
                    <a href="{{ route('login.social', 'facebook') }}" 
                    class="btn btn-outline-light text-dark border shadow-sm w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2 social-btn text-decoration-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1877F2" class="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                        </svg>
                        <span class="small">{{ __('Facebook') }}</span>
                    </a>
                </div>
            </div>
        </form>

        <div class="text-center">
            <p class="mb-0 small text-muted fw-bold">
                {{ page_content('auth.login.footer_text', __("New to the platform?")) }} 
                <a href="{{ route('register') }}" class="fw-bold text-decoration-none ms-1 text-gradient">
                    {{ __('Create a business account') }}
                </a>
            </p>
        </div>
    </div>
</div>

@endsection

@push('scripts')
@endpush
