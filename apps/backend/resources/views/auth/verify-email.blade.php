@extends('frontend._layouts._guest')

@section('title', __('Verify Your Email'))
@section('body_class', 'has-body-glow auth-page')

@section('content')
@include('auth._partials._marketing_panel', [
    'icon'      => 'bi-envelope-check',
    'glowClass' => 'auth-glow-tl',
    'titleHtml' => __('Check Your <span class="text-gradient">Inbox</span>'),
    'description' => __('We sent a verification link to your email address. Click it to activate your account.'),
    'features'  => [
        ['icon' => 'bi-lightning-charge', 'title' => __('Quick delivery'), 'text' => __('Most emails arrive within a minute.')],
        ['icon' => 'bi-shield-check',     'title' => __('Secure link'),    'text' => __('Links expire automatically for your safety.')],
    ],
])

@include('auth._partials._form_card_start', [
    'heading'    => __('Verify Your Email'),
    'subheading' => __('Click the link in the email we sent you to activate your account.'),
])

<div class="alert alert-info border-0 shadow-sm small mb-4 py-3 rounded-4 d-flex align-items-start gap-3">
    <i class="bi bi-envelope-check fs-4 text-info flex-shrink-0 mt-1"></i>
    <div class="fw-medium">
        {{ __("We've sent a verification link to your email. Please check your inbox and click the link to continue.") }}
    </div>
</div>

@if (session('status') == 'verification-link-sent')
    <div class="alert alert-success border-0 shadow-sm small mb-4 py-3 rounded-4 d-flex align-items-center gap-3">
        <i class="bi bi-check-circle-fill fs-5 text-success flex-shrink-0"></i>
        <div class="fw-bold">{{ __('A new verification link has been sent to your email.') }}</div>
    </div>
@endif

<div class="vstack gap-3 mt-2">
    <form method="POST" action="{{ route('verification.send') }}" class="d-grid">
        @csrf
        <button type="submit" class="btn btn-primary btn-lg py-3 d-flex align-items-center justify-content-center gap-2">
            <i class="bi bi-send-check"></i>
            {{ __('Resend Verification Email') }}
        </button>
    </form>

    <form method="POST" action="{{ route('logout') }}" class="text-center">
        @csrf
        <p class="small text-muted fw-medium mb-0">
            {{ __('Using a different account?') }}
            <button type="submit" class="btn btn-link p-0 small fw-bold text-decoration-none ms-1 text-primary">
                {{ __('Log Out') }}
            </button>
        </p>
    </form>
</div>

@include('auth._partials._form_card_end')
@endsection
