@extends('frontend._layouts._guest')

@section('title', __('Verify Your Email'))
@section('body_class', 'auth-page auth-solo')

@section('content')

<div class="col-12 d-flex flex-column min-vh-100">

    <header class="auth-solo-topbar d-flex align-items-center justify-content-between px-4 px-md-5">
        <a href="{{ url('/') }}" class="d-flex align-items-center gap-2 text-decoration-none">
            @if(filled(setting('site_logo')))
                <img src="{{ Storage::url(setting('site_logo')) }}"
                     alt="{{ setting('site_name', config('app.name')) }}"
                     class="auth-mobile-logo">
            @else
                <span class="fw-bolder fs-5 text-dark" style="letter-spacing:-.03em;font-family:var(--font-heading)">
                    {{ setting('site_name', config('app.name')) }}
                </span>
            @endif
        </a>
    </header>

    <div class="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
        <div style="width:100%;max-width:440px">

            <div class="mb-5">
                <div class="mb-4 d-inline-flex align-items-center justify-content-center rounded-3"
                     style="width:64px;height:64px;background:rgba(var(--primary-color-rgb),.1)">
                    <i class="bi bi-envelope-check fs-3" style="color:var(--primary-color)"></i>
                </div>
                <p class="small fw-semibold text-uppercase mb-3" style="letter-spacing:.08em;color:var(--primary-color)">{{ __('Almost There') }}</p>
                <h1 class="mb-3 lh-sm" style="font-size:clamp(1.9rem,4vw,2.6rem)">{{ __('Check Your Inbox') }}</h1>
                <p class="text-muted fw-medium mb-0 fs-5">{{ __("We've sent a verification link to your email. Click it to activate your account.") }}</p>
            </div>

            @if (session('status') == 'verification-link-sent')
                <div class="alert alert-success border-0 small mb-4 py-3 rounded-4 d-flex align-items-center gap-3">
                    <i class="bi bi-check-circle-fill fs-5 text-success flex-shrink-0"></i>
                    <div class="fw-bold">{{ __('A new verification link has been sent to your email.') }}</div>
                </div>
            @endif

            <form method="POST" action="{{ route('verification.send') }}" class="d-grid mb-4">
                @csrf
                <button type="submit" class="btn btn-primary btn-lg py-3">
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
    </div>

    <div class="text-center pb-5 pt-2">
        <p class="auth-footer-copyright mb-0">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}</p>
    </div>

</div>

@endsection
