@extends('frontend._layouts._guest')

@section('title', page_content('auth.register.seo_title', __('Create Account')))
@section('body_class', 'auth-page')

@section('content')

{{-- ── Left: dark marketing panel ──────────────────────────────────── --}}
<div class="col-lg-5 d-none d-lg-flex auth-split-marketing dark-brand-panel">

    <div class="auth-marketing-content d-flex flex-column h-100 w-100">

        {{-- Logo --}}
        <div class="mb-auto pb-5">
            <a href="{{ url('/') }}" class="d-flex align-items-center gap-2 text-decoration-none mb-5">
                @if(filled(setting('site_logo')))
                    <img src="{{ Storage::url(setting('site_logo')) }}"
                         alt="{{ setting('site_name', config('app.name')) }}"
                         class="auth-panel-logo">
                @endif
                <span class="auth-panel-wordmark">{{ setting('site_name', config('app.name')) }}</span>
            </a>

            <h2 class="fw-800 lh-sm mb-3" style="font-size:clamp(1.9rem,3vw,2.6rem);color:#fff">
                {{ __('Start selling') }}<br>
                <span class="text-gradient">{{ __('in minutes.') }}</span>
            </h2>
            <p class="lead mb-0" style="max-width:380px">
                {{ __('One free account gives you access to eight verticals — list properties, vehicles, services, jobs and more from a single dashboard.') }}
            </p>
        </div>

        {{-- Feature list --}}
        <div class="d-flex flex-column gap-4 mb-auto">
            @foreach([
                ['icon' => 'bi-rocket-takeoff-fill', 'title' => 'Free to Start',        'sub' => 'No credit card required to create a listing'],
                ['icon' => 'bi-grid-3x3-gap-fill',   'title' => '8 Verticals',          'sub' => 'Properties, vehicles, jobs, services & more'],
                ['icon' => 'bi-bar-chart-line-fill',  'title' => 'Real-Time Analytics', 'sub' => 'Views, inquiries, and revenue in one report'],
            ] as $feat)
            <div class="d-flex align-items-start gap-3">
                <div class="icon-box-soft flex-shrink-0">
                    <i class="bi {{ $feat['icon'] }} fs-5"></i>
                </div>
                <div>
                    <h5 class="fw-700 mb-0">{{ __($feat['title']) }}</h5>
                    <p class="mb-0 small opacity-60">{{ __($feat['sub']) }}</p>
                </div>
            </div>
            @endforeach
        </div>

        {{-- Footer --}}
        <div class="mt-5 pt-4" style="border-top:1px solid rgba(255,255,255,.1)">
            <p class="auth-footer-copyright mb-0">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}</p>
        </div>

    </div>
</div>

{{-- ── Right: form panel ────────────────────────────────────────────── --}}
<div class="col-lg-7 d-flex flex-column min-vh-100">

    {{-- Top bar (mobile logo + back link) --}}
    <header class="auth-solo-topbar d-flex align-items-center justify-content-between px-4 px-md-5">
        <a href="{{ url('/') }}" class="d-flex align-items-center gap-2 text-decoration-none">
            @if(filled(setting('site_logo')))
                <img src="{{ Storage::url(setting('site_logo')) }}"
                     alt="{{ setting('site_name', config('app.name')) }}"
                     class="auth-mobile-logo">
            @else
                <span class="fw-bolder fs-5 text-dark" style="font-family:var(--font-heading)">
                    {{ setting('site_name', config('app.name')) }}
                </span>
            @endif
        </a>
        <a href="{{ url('/') }}" class="small fw-semibold text-muted text-decoration-none d-flex align-items-center gap-1">
            <i class="bi bi-arrow-left"></i>&nbsp;{{ __('Back to site') }}
        </a>
    </header>

    {{-- Form --}}
    <div class="flex-grow-1 d-flex align-items-center justify-content-center py-5 px-4 px-md-5">
        <div style="width:100%;max-width:480px">

            @if (session('status'))
                <div class="alert alert-success border-0 small mb-4 py-3 rounded-4 d-flex align-items-center gap-3">
                    <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                    <div>{{ session('status') }}</div>
                </div>
            @endif

            @if ($errors->any())
                <div class="alert alert-danger border-0 small mb-4 py-3 rounded-4">
                    <ul class="mb-0 ps-3">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <div class="mb-5">
                <p class="small fw-semibold text-uppercase mb-3" style="letter-spacing:.08em;color:var(--primary-color)">{{ __('Account') }}</p>
                <h1 class="mb-3 lh-sm" style="font-size:clamp(1.9rem,4vw,2.6rem);font-family:var(--font-heading)">
                    {{ page_content('auth.register.form_heading', __('Create Account')) }}
                </h1>
                <p class="text-muted fw-medium mb-0">{{ page_content('auth.register.form_subheading', __('Start with your name, email, and a secure password.')) }}</p>
            </div>

            <form method="POST" action="{{ route('register') }}" class="auth-form">
                @csrf

                <div class="mb-4">
                    <label for="name" class="filter-label mb-2">{{ __('Full Name') }}</label>
                    <div class="form-icon-group">
                        <input type="text"
                               @class(['form-control', 'is-invalid' => $errors->has('name')])
                               id="name" name="name"
                               value="{{ old('name') }}"
                               placeholder="{{ __('John Doe') }}"
                               required autofocus autocomplete="name">
                        <i class="bi bi-person input-icon"></i>
                    </div>
                </div>

                <div class="mb-4">
                    <label for="email" class="filter-label mb-2">{{ __('Email Address') }}</label>
                    <div class="form-icon-group">
                        <input type="email"
                               @class(['form-control', 'is-invalid' => $errors->has('email')])
                               id="email" name="email"
                               value="{{ old('email') }}"
                               placeholder="{{ __('you@example.com') }}"
                               required autocomplete="email">
                        <i class="bi bi-envelope input-icon"></i>
                    </div>
                </div>

                <div class="row g-3 mb-4">
                    <div class="col-md-6">
                        <label for="password" class="filter-label mb-2">{{ __('Password') }}</label>
                        <div class="form-icon-group">
                            <input type="password"
                                   @class(['form-control', 'is-invalid' => $errors->has('password')])
                                   id="password" name="password"
                                   placeholder="{{ __('••••••••') }}"
                                   required autocomplete="new-password">
                            <i class="bi bi-shield-lock input-icon"></i>
                            <i class="bi bi-eye password-toggle"></i>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="password_confirmation" class="filter-label mb-2">{{ __('Confirm') }}</label>
                        <div class="form-icon-group">
                            <input type="password"
                                   @class(['form-control', 'is-invalid' => $errors->has('password_confirmation')])
                                   id="password_confirmation" name="password_confirmation"
                                   placeholder="{{ __('••••••••') }}"
                                   required autocomplete="new-password">
                            <i class="bi bi-shield-check input-icon"></i>
                            <i class="bi bi-eye password-toggle"></i>
                        </div>
                    </div>
                    <div class="col-12">
                        <p class="text-muted mb-0 fw-semibold" style="font-size:.75rem">
                            <i class="bi bi-info-circle me-1 text-primary"></i>
                            {!! page_content('auth.register.password_hint', __('Minimum 8 characters required.')) !!}
                        </p>
                    </div>
                </div>

                <div class="d-grid mb-2">
                    <button type="submit" class="btn btn-primary btn-lg py-3">
                        {!! page_content('auth.register.submit_btn', __('Create Account')) !!}
                    </button>
                </div>

                @include('auth._partials._social_login')
            </form>

            <div class="text-center mt-4">
                <p class="mb-0 small text-muted fw-bold">
                    {!! page_content('auth.register.login_prompt', __('Already have an account?')) !!}
                    <a href="{{ route('login') }}" class="fw-bold text-decoration-none ms-1 text-primary">{{ __('Sign In') }}</a>
                </p>
            </div>

        </div>
    </div>

    <div class="text-center pb-5 pt-2">
        <p class="auth-footer-copyright mb-0">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}</p>
    </div>

</div>

@endsection
