@extends('frontend._layouts._app')

@section('title', __('Page Not Found'))

@section('content')
<div class="error-page-wrap">
    <div class="error-card">
        <div class="error-icon-wrap">
            <div class="error-icon-box">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span class="error-code">404</span>
        </div>

        <h1 class="error-title">{{ __('Page Not Found') }}</h1>
        <p class="error-desc">
            {{ __("The page you're looking for doesn't exist or has been moved. Double-check the URL or head back home.") }}
        </p>

        <div class="error-actions">
            <a href="{{ url('/') }}" class="btn btn-primary btn-lg px-5 rounded-2">
                <i class="bi bi-house-fill me-2"></i>{{ __('Go to Homepage') }}
            </a>
            <a href="javascript:history.back()" class="btn btn-outline-secondary btn-lg px-4 rounded-2">
                {{ __('Go Back') }}
            </a>
        </div>
    </div>
</div>

@endsection
