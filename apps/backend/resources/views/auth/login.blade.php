@extends('frontend._layouts._guest')

@section('title', page_content('auth.login.seo_title', __('Login')))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon' => 'bi-bag-heart',
    'glowClass' => 'auth-glow-tl',
    'titleHtml' => page_content('auth.login.marketing_title', __('Discover Your <span class="text-gradient">Marketplace</span>')),
    'description' => page_content('auth.login.marketing_desc', __('Sign in to track orders, manage bookings, and pick up where you left off.')),
    'features' => [
        ['icon' => 'bi-shield-check', 'title' => page_content('auth.login.feature_1_title', __('Secure checkout')), 'text' => __('Protected payments and verified sellers.')],
        ['icon' => 'bi-lightning-charge', 'title' => page_content('auth.login.feature_2_title', __('One account everywhere')), 'text' => __('Properties, products, events, and more in one place.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading' => page_content('auth.login.form_heading', __('Welcome Back')),
    'subheading' => page_content('auth.login.form_subheading', __('Sign in to continue shopping and managing your activity.')),
])

<form method="POST" action="{{ route('login') }}" class="auth-form">
    @csrf

    <div class="mb-4">
        <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
        <div class="form-icon-group">
            <input type="email" @class(['form-control', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="{{ __('you@example.com') }}" required autofocus>
            <i class="bi bi-envelope input-icon"></i>
        </div>
    </div>

    <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label for="password" class="filter-label mb-0">{{ __('Password') }}</label>
            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="small fw-bold text-decoration-none text-primary">{{ __('Forgot password?') }}</a>
            @endif
        </div>
        <div class="form-icon-group">
            <input type="password" @class(['form-control', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="{{ __('••••••••') }}" required autocomplete="current-password">
            <i class="bi bi-shield-lock input-icon"></i>
            <i class="bi bi-eye password-toggle"></i>
        </div>
    </div>

    <div class="mb-4">
        <div class="form-check custom-check d-flex align-items-center gap-3 py-1">
            <input class="form-check-input flex-shrink-0 custom-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
            <label class="form-check-label small text-muted fw-bold mb-0 custom-check-label" for="remember">
                {{ page_content('auth.login.remember_text', __('Keep me signed in')) }}
            </label>
        </div>
    </div>

    <div class="d-grid mb-4">
        <button type="submit" class="btn btn-primary btn-lg py-3">
            {{ page_content('auth.login.submit_btn', __('Sign In')) }}
        </button>
    </div>

    @include('auth._partials._social_login')
</form>

<div class="text-center mt-4">
    <p class="mb-0 small text-muted fw-bold">
        {{ page_content('auth.login.footer_text', __("Don't have an account?")) }}
        <a href="{{ route('register') }}" class="fw-bold text-decoration-none ms-1 text-primary">
            {{ __('Create account') }}
        </a>
    </p>
</div>

@include('auth._partials._form_card_end')
@endsection
