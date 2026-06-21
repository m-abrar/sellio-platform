@extends('frontend._layouts._guest')

@section('title', page_content('auth.register.seo_title', __('Create Account')))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon' => 'bi-person-plus',
    'glowClass' => 'auth-glow-tr',
    'titleHtml' => page_content('auth.register.marketing_title', __('Join the <span class="text-gradient">Marketplace</span>')),
    'description' => page_content('auth.register.marketing_desc', __('Create an account to save favorites, checkout faster, and manage bookings.')),
    'features' => [
        ['icon' => 'bi-graph-up-arrow', 'title' => __('For buyers & sellers'), 'text' => __('One account works across the entire platform.')],
        ['icon' => 'bi-globe', 'title' => __('Global listings'), 'text' => __('Browse properties, products, events, and services.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading' => page_content('auth.register.form_heading', __('Create Account')),
    'subheading' => page_content('auth.register.form_subheading', __('Start with your name, email, and a secure password.')),
])

<form method="POST" action="{{ route('register') }}" class="auth-form">
    @csrf

    <div class="mb-4">
        <label for="name" class="filter-label mb-2">{{ __('Full Name') }}</label>
        <div class="form-icon-group">
            <input type="text" @class(['form-control', 'is-invalid' => $errors->has('name')]) id="name" name="name" value="{{ old('name') }}" placeholder="{{ __('John Doe') }}" required autofocus autocomplete="name">
            <i class="bi bi-person input-icon"></i>
        </div>
    </div>

    <div class="mb-4">
        <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
        <div class="form-icon-group">
            <input type="email" @class(['form-control', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="{{ __('you@example.com') }}" required autocomplete="email">
            <i class="bi bi-envelope input-icon"></i>
        </div>
    </div>

    <div class="row g-3 mb-4">
        <div class="col-md-6">
            <label for="password" class="filter-label mb-2">{{ __('Password') }}</label>
            <div class="form-icon-group">
                <input type="password" @class(['form-control', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="{{ __('••••••••') }}" required autocomplete="new-password">
                <i class="bi bi-shield-lock input-icon"></i>
                <i class="bi bi-eye password-toggle"></i>
            </div>
        </div>
        <div class="col-md-6">
            <label for="password_confirmation" class="filter-label mb-2">{{ __('Confirm Password') }}</label>
            <div class="form-icon-group">
                <input type="password" @class(['form-control', 'is-invalid' => $errors->has('password_confirmation')]) id="password_confirmation" name="password_confirmation" placeholder="{{ __('••••••••') }}" required autocomplete="new-password">
                <i class="bi bi-shield-check input-icon"></i>
                <i class="bi bi-eye password-toggle"></i>
            </div>
        </div>
        <div class="col-12">
            <p class="text-muted smallest mb-0 fw-semibold">
                <i class="bi bi-info-circle me-1 text-primary"></i>
                {!! page_content('auth.register.password_hint', __('Minimum 8 characters required.')) !!}
            </p>
        </div>
    </div>

    <div class="d-grid mb-4">
        <button type="submit" class="btn btn-primary btn-lg py-3">
            {!! page_content('auth.register.submit_btn', __('Create Account')) !!}
        </button>
    </div>

    @include('auth._partials._social_login')
</form>

<div class="text-center mt-4">
    <p class="mb-0 small text-muted fw-bold">
        {!! page_content('auth.register.login_prompt', __('Already have an account?')) !!}
        <a href="{{ route('login') }}" class="fw-bold text-decoration-none ms-1 text-primary">
            {{ __('Sign In') }}
        </a>
    </p>
</div>

@include('auth._partials._form_card_end')
@endsection

@push('styles')
<style>.smallest { font-size: 0.75rem; }</style>
@endpush
