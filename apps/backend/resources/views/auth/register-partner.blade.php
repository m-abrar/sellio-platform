@extends('frontend._layouts._guest')

@section('title', page_content('auth.partner_register.seo_title', __('Become a Partner')))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon'      => 'bi-rocket-takeoff',
    'glowClass' => 'auth-glow-tr',
    'titleHtml' => page_content('auth.partner_register.marketing_title', __('Grow with the <span class="text-gradient">Marketplace</span>')),
    'description' => page_content('auth.partner_register.marketing_desc', __('Create a partner account to start listing your products, services, or properties to thousands of buyers.')),
    'features'  => [
        ['icon' => 'bi-person-badge',   'title' => __('Create your profile'),    'text' => __('Set up your seller identity in minutes.')],
        ['icon' => 'bi-patch-check',    'title' => __('Get verified'),           'text' => __('Verified partners earn more buyer trust.')],
        ['icon' => 'bi-lightning-charge','title' => __('Start selling'),         'text' => __('Go live and reach buyers immediately.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading'    => page_content('auth.partner_register.form_heading', __('Become a Partner')),
    'subheading' => page_content('auth.partner_register.form_subheading', __('Fill in your details to create your seller account.')),
])

<form method="POST" action="{{ route('register') }}" class="auth-form">
    @csrf

    <div class="mb-4">
        <label for="name" class="filter-label mb-2">{{ __('Full Name') }}</label>
        <div class="form-icon-group">
            <input type="text" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('name')]) id="name" name="name" value="{{ old('name') }}" placeholder="{{ __('Your name') }}" required autofocus autocomplete="name">
            <i class="bi bi-person input-icon"></i>
        </div>
    </div>

    <div class="mb-4">
        <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
        <div class="form-icon-group">
            <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="{{ __('you@example.com') }}" required autocomplete="email">
            <i class="bi bi-envelope input-icon"></i>
        </div>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-6">
            <label for="password" class="filter-label mb-2">{{ __('Password') }}</label>
            <div class="form-icon-group">
                <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="{{ __('••••••••') }}" required autocomplete="new-password">
                <i class="bi bi-shield-lock input-icon"></i>
                <i class="bi bi-eye password-toggle"></i>
            </div>
        </div>
        <div class="col-md-6">
            <label for="password_confirmation" class="filter-label mb-2">{{ __('Confirm Password') }}</label>
            <div class="form-icon-group">
                <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password_confirmation')]) id="password_confirmation" name="password_confirmation" placeholder="{{ __('••••••••') }}" required autocomplete="new-password">
                <i class="bi bi-shield-check input-icon"></i>
                <i class="bi bi-eye password-toggle"></i>
            </div>
        </div>
        <div class="col-12">
            <p class="text-muted small mb-0 fw-semibold">
                <i class="bi bi-info-circle me-1 text-primary-color"></i>
                {{ __('Minimum 8 characters required.') }}
            </p>
        </div>
    </div>

    <div class="d-grid mb-4">
        <button type="submit" class="btn btn-primary-theme btn-lg py-3 fw-800">
            {!! page_content('auth.partner_register.submit_btn', __('Create Partner Account')) !!}
        </button>
    </div>

    @include('auth._partials._social_login')
</form>

<div class="text-center mt-4">
    <p class="mb-0 small text-muted fw-bold">
        {{ __('Already have an account?') }}
        <a href="{{ route('login') }}" class="fw-bold text-decoration-none ms-1 text-primary-color">
            {{ __('Sign In') }}
        </a>
    </p>
</div>

@include('auth._partials._form_card_end')
@endsection
