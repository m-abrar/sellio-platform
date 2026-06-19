@extends('frontend._layouts._guest')

@section('title', __('Confirm Password'))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon'      => 'bi-shield-lock-fill',
    'glowClass' => 'auth-glow-tl',
    'titleHtml' => __('Secure <span class="text-gradient">Area</span>'),
    'description' => __('For your protection, please confirm your password before accessing this section.'),
    'features'  => [
        ['icon' => 'bi-lock',         'title' => __('Protected'),  'text' => __('Sensitive settings require re-authentication.')],
        ['icon' => 'bi-shield-check', 'title' => __('Encrypted'),  'text' => __('Your credentials are never stored in plain text.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading'    => __('Confirm Your Password'),
    'subheading' => __('Please enter your password to continue to this secure area.'),
])

<form method="POST" action="{{ route('password.confirm') }}" class="auth-form">
    @csrf

    <div class="mb-4">
        <label for="password" class="filter-label mb-2">{{ __('Password') }}</label>
        <div class="form-icon-group">
            <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="{{ __('••••••••') }}" required autofocus autocomplete="current-password">
            <i class="bi bi-shield-lock input-icon"></i>
            <i class="bi bi-eye password-toggle"></i>
        </div>
    </div>

    <div class="d-grid gap-3">
        <button type="submit" class="btn btn-primary-theme btn-lg py-3 fw-800 d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-check-circle-fill"></i>
            {{ __('Confirm & Continue') }}
        </button>

        <a href="{{ route('login') }}" class="btn btn-outline-primary-theme btn-lg py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-arrow-left"></i>
            {{ __('Back to Login') }}
        </a>
    </div>
</form>

@include('auth._partials._form_card_end')
@endsection
