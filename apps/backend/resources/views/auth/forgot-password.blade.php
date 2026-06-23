@extends('frontend._layouts._guest')

@section('title', __('Forgot Password'))
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
        <a href="{{ route('login') }}" class="small fw-semibold text-muted text-decoration-none d-flex align-items-center gap-1">
            <i class="bi bi-arrow-left"></i>&nbsp;{{ __('Back to Login') }}
        </a>
    </header>

    <div class="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-3">
        <div style="width:100%;max-width:440px">

            @if ($errors->any())
                <div class="alert alert-danger border-0 small mb-4 py-3 rounded-4">
                    <ul class="mb-0 ps-3">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if (session('status'))
                <div class="alert alert-success border-0 small mb-4 py-3 rounded-4 d-flex align-items-center gap-3">
                    <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                    <div>{{ session('status') }}</div>
                </div>
            @endif

            <div class="mb-5">
                <p class="small fw-semibold text-uppercase mb-3" style="letter-spacing:.08em;color:var(--primary-color)">{{ __('Account') }}</p>
                <h1 class="mb-3 lh-sm" style="font-size:clamp(1.9rem,4vw,2.6rem)">{{ __('Forgot Password?') }}</h1>
                <p class="text-muted fw-medium mb-0 fs-5">{{ __('Enter your email and we\'ll send a recovery link straight to your inbox.') }}</p>
            </div>

            <form method="POST" action="{{ route('password.email') }}" class="auth-form">
                @csrf

                <div class="mb-4">
                    <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
                    <div class="form-icon-group">
                        <input id="email"
                               @class(['form-control', 'is-invalid' => $errors->has('email')])
                               type="email" name="email"
                               value="{{ old('email') }}"
                               placeholder="{{ __('you@example.com') }}"
                               required autofocus>
                        <i class="bi bi-envelope input-icon"></i>
                    </div>
                </div>

                <div class="d-grid">
                    <button type="submit" class="btn btn-primary btn-lg py-3">
                        {{ __('Send Recovery Link') }}
                    </button>
                </div>
            </form>

        </div>
    </div>

    <div class="text-center pb-5 pt-2">
        <p class="auth-footer-copyright mb-0">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}</p>
    </div>

</div>

@endsection
