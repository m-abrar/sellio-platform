@extends('frontend._layouts._guest')

@section('title', page_content('auth.register.seo_title', __('Create Account')))
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Marketing & Value Proposition --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);">
    
    <div class="position-absolute translate-middle" style="bottom: 10%; right: 10%; width: 400px; height: 400px; background: rgba(255,255,255,0.15); filter: blur(100px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1 text-center" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm">
            <i class="bi bi-person-plus text-white display-4"></i>
        </div>
        
        <h1 class="display-5 fw-800 mb-3">
            {!! page_content('auth.register.marketing_title', __('Join the Marketplace')) !!}
        </h1>
        
        <p class="lead opacity-75 mb-5">
            {!! page_content('auth.register.marketing_desc', __('Create an account to start buying, selling, and managing your digital assets on our secure platform.')) !!}
        </p>

        <div class="row g-4 text-start mt-4">
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-check-circle-fill text-white fs-5"></i>
                    <span class="small fw-medium">{!! page_content('auth.register.feature_1', __('Free Account')) !!}</span>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-check-circle-fill text-white fs-5"></i>
                    <span class="small fw-medium">{!! page_content('auth.register.feature_2', __('Instant Access')) !!}</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Registration Form --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white py-5 position-relative">
    <div class="w-100 px-4 px-md-5" style="max-width: 520px;">
        
        <div class="mb-4">
            <div class="d-lg-none mb-4 text-center">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-3 mb-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{!! page_content('global.header.brand_text', setting('site_name', config('app.name'))) !!}</span>
                </div>
            </div>
            
            <h2 class="h3 fw-bold text-dark mb-1">{!! page_content('auth.register.form_heading', __('Create Your Account')) !!}</h2>
            <p class="text-muted">{!! page_content('auth.register.form_subheading', __('Start your journey with us today.')) !!}</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4" role="alert">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('register') }}" class="mb-4">
            @csrf

            <div class="mb-3">
                <label for="name" class="form-label fw-semibold">{{ __('Full Name') }}</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3 text-muted"><i class="bi bi-person"></i></span>
                    <input type="text" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('name')]) id="name" name="name" value="{{ old('name') }}" placeholder="{{ __('Jane Doe') }}" required autofocus autocomplete="name">
                </div>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label fw-semibold">{{ __('Email Address') }}</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3 text-muted"><i class="bi bi-envelope"></i></span>
                    <input type="email" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="{{ __('name@example.com') }}" required autocomplete="email">
                </div>
            </div>

            <div class="row g-3 mb-4">
                <div class="col-md-6">
                    <label for="password" class="form-label fw-semibold">{{ __('Password') }}</label>
                    <input type="password" @class(['form-control bg-light border-0 px-4', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required autocomplete="new-password">
                </div>
                <div class="col-md-6">
                    <label for="password_confirmation" class="form-label fw-semibold">{{ __('Confirm') }}</label>
                    <input type="password" class="form-control bg-light border-0 px-4" id="password_confirmation" name="password_confirmation" placeholder="••••••••" required>
                </div>
                <div class="col-12">
                    <p class="text-muted small mb-0">
                        <i class="bi bi-info-circle me-1"></i> {!! page_content('auth.register.password_hint', __('Must be at least 8 characters.')) !!}
                    </p>
                </div>
            </div>
            
            {{-- Submit and Social Actions --}}
            <div class="d-grid gap-3">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3">
                    {!! page_content('auth.register.submit_btn', __('Create Account')) !!}
                </button>
                
                <div class="position-relative my-2 text-center">
                    <hr class="text-muted opacity-25">
                    <span class="position-absolute top-50 start-50 translate-middle bg-white px-3 small text-muted fw-medium text-uppercase" style="font-size: 0.7rem; letter-spacing: 1px;">
                        {{ __('Or sign up with') }}
                    </span>
                </div>

                {{-- Social Grid --}}
                <div class="row g-3">
                    <div class="col-6">
                        <a href="{{ route('login.social', 'google') }}" class="btn btn-outline-light text-dark border shadow-sm w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 social-btn">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google">
                            <span class="small">{{ __('Google') }}</span>
                        </a>
                    </div>
                    <div class="col-6">
                        <a href="{{ route('login.social', 'facebook') }}" class="btn btn-outline-light text-dark border shadow-sm w-100 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 social-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#1877F2" class="bi bi-facebook" viewBox="0 0 16 16">
                                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"/>
                            </svg>
                            <span class="small">{{ __('Facebook') }}</span>
                        </a>
                    </div>
                </div>
            </div>
        </form>

        <div class="text-center">
            <p class="mb-0 small text-muted">
                {!! page_content('auth.register.login_prompt', __('Already have an account?')) !!} 
                <a href="{{ route('login') }}" class="fw-bold text-decoration-none ms-1" style="color: var(--primary-color);">
                    {{ __('Log In') }}
                </a>
            </p>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-4 text-center d-none d-lg-block">
        <span class="text-muted small">
            {!! page_content('auth.register.terms_prefix', __('By signing up, you agree to our')) !!} 
            <a href="#" class="text-decoration-none fw-medium text-dark">{!! page_content('auth.register.terms_link', __('Terms of Service')) !!}</a>
        </span>
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

    .input-group-text {
        border-top-left-radius: 12px !important;
        border-bottom-left-radius: 12px !important;
    }

    @media (min-width: 992px) {
        .col-lg-6 { transition: all 0.5s ease-in-out; }
    }
</style>
@endpush
