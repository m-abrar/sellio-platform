@extends('frontend._layouts._app')

@section('title', __('Page Expired'))

@section('content')
<div class="error-page-wrap">
    <div class="error-card">
        <div class="error-icon-wrap">
            <div class="error-icon-box">
                <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <span class="error-code">419</span>
        </div>

        <h1 class="error-title">{{ __('Page Expired') }}</h1>
        <p class="error-desc">
            {{ __('Your session token has expired. This usually happens after a long period of inactivity. Please go back and try again.') }}
        </p>

        <div class="error-actions">
            <a href="javascript:history.back()" class="btn btn-primary-theme btn-lg px-5 rounded-pill">
                <i class="fas fa-redo me-2"></i>{{ __('Go Back & Retry') }}
            </a>
            <a href="{{ url('/') }}" class="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                {{ __('Homepage') }}
            </a>
        </div>
    </div>
</div>

@endsection
