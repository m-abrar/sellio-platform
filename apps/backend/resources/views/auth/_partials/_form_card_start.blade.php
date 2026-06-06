@php
    $heading = $heading ?? '';
    $subheading = $subheading ?? '';
@endphp

<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center py-5 px-3">
    <div class="auth-card glass-surface border-0 shadow-deep">
        <div class="text-center mb-4 mb-md-5">
            <div class="d-lg-none mb-4">
                @if(setting('site_logo'))
                    <img src="{{ asset('storage/' . setting('site_logo')) }}" alt="{{ setting('site_name', config('app.name')) }}" class="auth-mobile-logo">
                @else
                    <div class="d-inline-flex align-items-center gap-2 text-primary-color fw-bolder fs-2">
                        <i class="bi bi-shop"></i>
                        <span>{{ setting('site_name', config('app.name')) }}</span>
                    </div>
                @endif
            </div>

            <span class="metric-label d-block mb-2">{{ __('Account') }}</span>
            <h2 class="fw-800 text-dark mb-2 fs-2">{{ $heading }}</h2>
            @if($subheading)
                <p class="text-muted fw-medium mb-0">{{ $subheading }}</p>
            @endif
        </div>

        @if (session('status'))
            <div class="alert alert-success border-0 shadow-sm small mb-4 py-3 rounded-4 d-flex align-items-center gap-3">
                <i class="bi bi-check-circle-fill fs-5 text-success"></i>
                <div>{{ session('status') }}</div>
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif
