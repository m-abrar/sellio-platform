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

<style>
.error-page-wrap {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 1rem;
}
.error-card {
    max-width: 30rem;
    width: 100%;
    text-align: center;
}
.error-icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.75rem;
}
.error-icon-box {
    width: 5rem;
    height: 5rem;
    background: rgba(var(--primary-color-rgb), .08);
    border: 1.5px solid rgba(var(--primary-color-rgb), .16);
    border-radius: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    flex-shrink: 0;
}
.error-code {
    font-size: 4.5rem;
    font-weight: 900;
    line-height: 1;
    color: var(--color-primary);
    font-family: var(--font-family-heading, inherit);
    letter-spacing: -2px;
}
.error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: .75rem;
}
.error-desc {
    color: var(--color-text-muted);
    font-size: 1rem;
    line-height: 1.65;
    margin-bottom: 2rem;
}
.error-actions {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
    justify-content: center;
}
</style>
@endsection
