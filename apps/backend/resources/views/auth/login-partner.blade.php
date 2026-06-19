@extends('frontend._layouts._guest')

@section('title', page_content('auth.partner_login.seo_title', __('Partner Sign In')))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon'      => 'bi-person-workspace',
    'glowClass' => 'auth-glow-tl',
    'titleHtml' => page_content('auth.partner_login.marketing_title', __('Partner <span class="text-gradient">Dashboard</span>')),
    'description' => page_content('auth.partner_login.marketing_desc', __('Sign in to manage your listings, track performance, and grow your business on the platform.')),
    'features'  => [
        ['icon' => 'bi-graph-up-arrow', 'title' => __('Live analytics'),    'text' => __('Track revenue and engagement in real time.')],
        ['icon' => 'bi-wallet2',        'title' => __('Unified payouts'),   'text' => __('All your earnings in one place.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading'    => page_content('auth.partner_login.form_heading', __('Partner Sign In')),
    'subheading' => page_content('auth.partner_login.form_subheading', __('Access your seller dashboard to manage listings and orders.')),
])

<form method="POST" action="{{ route('login') }}" class="auth-form">
    @csrf

    <div class="mb-4">
        <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
        <div class="form-icon-group">
            <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="{{ __('you@example.com') }}" required autofocus>
            <i class="bi bi-envelope input-icon"></i>
        </div>
    </div>

    <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <label for="password" class="filter-label mb-0">{{ __('Password') }}</label>
            @if (Route::has('password.request'))
                <a href="{{ route('password.request') }}" class="small fw-bold text-decoration-none text-primary-color">{{ __('Forgot password?') }}</a>
            @endif
        </div>
        <div class="form-icon-group">
            <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="{{ __('••••••••') }}" required autocomplete="current-password">
            <i class="bi bi-shield-lock input-icon"></i>
            <i class="bi bi-eye password-toggle"></i>
        </div>
    </div>

    <div class="mb-4">
        <div class="form-check custom-check d-flex align-items-center gap-3 py-1">
            <input class="form-check-input flex-shrink-0 custom-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
            <label class="form-check-label small text-muted fw-bold mb-0 custom-check-label" for="remember">
                {{ __('Keep me signed in') }}
            </label>
        </div>
    </div>

    <div class="d-grid mb-4">
        <button type="submit" class="btn btn-primary-theme btn-lg py-3 fw-800">
            {{ page_content('auth.partner_login.submit_btn', __('Sign In')) }}
        </button>
    </div>

    @include('auth._partials._social_login')
</form>

<div class="text-center mt-4">
    <p class="mb-0 small text-muted fw-bold">
        {{ __("Don't have a partner account?") }}
        <a href="{{ route('register') }}" class="fw-bold text-decoration-none ms-1 text-primary-color">
            {{ __('Apply now') }}
        </a>
    </p>
</div>

@include('auth._partials._form_card_end')
@endsection
