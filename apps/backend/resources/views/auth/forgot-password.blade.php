@extends('frontend._layouts._guest')

@section('title', __('Forgot Password'))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon' => 'bi-shield-lock',
    'glowClass' => 'auth-glow-tl',
    'titleHtml' => __('Reset Your <span class="text-gradient">Password</span>'),
    'description' => __('We will email you a secure link to choose a new password and get back into your account.'),
    'features' => [
        ['icon' => 'bi-lightning', 'title' => __('Fast recovery'), 'text' => __('Most reset links arrive within a minute.')],
        ['icon' => 'bi-shield-check', 'title' => __('Secure process'), 'text' => __('Links expire automatically for your safety.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading' => __('Forgot Password?'),
    'subheading' => __('Enter your email and we will send a recovery link.'),
])

<form method="POST" action="{{ route('password.email') }}" class="auth-form">
    @csrf

    <div class="mb-4">
        <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
        <div class="form-icon-group">
            <input id="email" @class(['form-control', 'is-invalid' => $errors->has('email')]) type="email" name="email" value="{{ old('email') }}" placeholder="{{ __('you@example.com') }}" required autofocus />
            <i class="bi bi-envelope input-icon"></i>
        </div>
    </div>

    <div class="d-grid gap-3">
        <button type="submit" class="btn btn-primary btn-lg py-3 d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-send-check"></i>
            {{ __('Send Recovery Link') }}
        </button>

        <a href="{{ route('login') }}" class="btn btn-outline-secondary btn-lg py-3 fw-semibold d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-arrow-left"></i>
            {{ __('Back to Login') }}
        </a>
    </div>
</form>

@include('auth._partials._form_card_end')
@endsection
