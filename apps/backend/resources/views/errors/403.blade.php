@extends('frontend._layouts._app')

@section('title', __('Access Denied'))

@section('content')
<div class="error-page-wrap">
    <div class="error-card">
        <div class="error-icon-wrap">
            <div class="error-icon-box">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <span class="error-code">403</span>
        </div>

        <h1 class="error-title">{{ __('Access Denied') }}</h1>
        <p class="error-desc">
            {{ __("You don't have permission to view this page. This may be due to your account role or the site's visibility settings.") }}
        </p>

        <div class="error-actions">
            <a href="{{ url('/') }}" class="btn btn-primary btn-lg px-5 rounded-2">
                <i class="bi bi-house-fill me-2"></i>{{ __('Go to Homepage') }}
            </a>
            <a href="{{ route('login') }}" class="btn btn-outline-secondary btn-lg px-4 rounded-2">
                <i class="bi bi-person-fill me-2"></i>{{ __('Switch Account') }}
            </a>
        </div>

        <p class="error-ref mt-4">
            {{ __('Reference:') }}
            <code>#{{ strtoupper(bin2hex(random_bytes(4))) }}</code>
        </p>
    </div>
</div>

@endsection
