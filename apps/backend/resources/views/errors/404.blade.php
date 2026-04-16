@extends('frontend._layouts._app')

@section('title', 'Page Not Found')

@section('content')
<div class="d-flex align-items-center justify-content-center" style="min-height: 60vh;">
    <div class="text-center py-5">
        <h1 class="display-1 fw-bold" style="color: var(--color-primary); font-family: var(--font-family-heading);">404</h1>
        <h2 class="h3 fw-light mb-4" style="color: var(--color-text);">Page Not Found</h2>
        <p class="lead text-muted mb-4">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="{{ url('/') }}" class="btn btn-primary btn-lg">
            <i class="fas fa-home me-2"></i> Go to Homepage
        </a>
    </div>
</div>
@endsection
