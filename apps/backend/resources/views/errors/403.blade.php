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
            <a href="{{ url('/') }}" class="btn btn-primary-theme btn-lg px-5 rounded-pill">
                <i class="fas fa-home me-2"></i>{{ __('Go to Homepage') }}
            </a>
            <a href="{{ route('login') }}" class="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                <i class="fas fa-user me-2"></i>{{ __('Switch Account') }}
            </a>
        </div>

        <p class="error-ref mt-4">
            {{ __('Reference:') }}
            <code>#{{ strtoupper(bin2hex(random_bytes(4))) }}</code>
        </p>
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
.error-ref {
    font-size: .8rem;
    color: var(--color-text-muted);
}
.error-ref code {
    background: rgba(var(--primary-color-rgb), .07);
    color: var(--color-primary);
    padding: .15rem .5rem;
    border-radius: .4rem;
    font-size: .8rem;
}
</style>
@endsection
