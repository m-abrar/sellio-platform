@extends('frontend._layouts._guest')

@section('title', __('Reset Password'))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon' => 'bi-shield-check',
    'glowClass' => 'auth-glow-tl',
    'titleHtml' => __('Choose a <span class="text-gradient">New Password</span>'),
    'description' => __('Set a strong password to finish recovering your account.'),
    'features' => [
        ['icon' => 'bi-shield-lock', 'title' => __('Encrypted storage'), 'text' => __('Your password is never stored in plain text.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading' => __('Reset Password'),
    'subheading' => __('Enter your new password below.'),
])

<form method="POST" action="{{ route('password.store') }}" class="auth-form">
    @csrf
    <input type="hidden" name="token" value="{{ $request->route('token') }}">

    <div class="mb-4">
        <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
        <div class="form-icon-group">
            <input type="email" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email', $request->email) }}" required autofocus>
            <i class="bi bi-envelope input-icon"></i>
        </div>
    </div>

    <div class="mb-4">
        <label for="password" class="filter-label mb-2">{{ __('New Password') }}</label>
        <div class="form-icon-group">
            <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="{{ __('••••••••') }}" required autocomplete="new-password">
            <i class="bi bi-shield-lock input-icon"></i>
            <i class="bi bi-eye password-toggle"></i>
        </div>
    </div>

    <div class="mb-4">
        <label for="password_confirmation" class="filter-label mb-2">{{ __('Confirm Password') }}</label>
        <div class="form-icon-group">
            <input type="password" @class(['form-control', 'rounded-pill', 'is-invalid' => $errors->has('password_confirmation')]) id="password_confirmation" name="password_confirmation" placeholder="{{ __('••••••••') }}" required autocomplete="new-password">
            <i class="bi bi-shield-check input-icon"></i>
            <i class="bi bi-eye password-toggle"></i>
        </div>
    </div>

    <div class="d-grid gap-3">
        <button type="submit" class="btn btn-primary-theme btn-lg py-3 fw-800">
            {{ __('Update Password') }}
        </button>

        <a href="{{ route('login') }}" class="btn btn-outline-primary-theme btn-lg py-3 fw-bold d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-arrow-left"></i>
            {{ __('Back to Login') }}
        </a>
    </div>
</form>

@include('auth._partials._form_card_end')
@endsection
