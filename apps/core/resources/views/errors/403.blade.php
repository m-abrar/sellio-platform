@extends('frontend._layouts._app')

@section('title', __('Access Denied'))

@section('content')
<div class="container py-5 mt-5">
    <div class="row justify-content-center">
        <div class="col-md-7 text-center">
            
            <div class="error-illustration mb-4">
                <div class="display-1 fw-bold text-danger animate__animated animate__shakeX">
                    <i class="fas fa-shield-alt"></i> 403
                </div>
            </div>

            <h1 class="h2 fw-bold text-dark mb-3">{{ __('Hold Up! Access Denied.') }}</h1>
            
            <p class="lead text-muted mb-5 px-md-5">
                {{ __("It looks like you don't have the permissions to access this page. This could be due to your current account role or the site's visibility settings.") }}
            </p>

            <div class="d-flex flex-wrap justify-content-center gap-3 mb-5">
                {{-- 1. Back to Home --}}
                <a href="{{ url('/') }}" class="btn btn-primary btn-lg px-4 shadow-sm" id="403-back-home">
                    <i class="fas fa-home me-2"></i> {{ __('Go to Home') }}
                </a>

                {{-- 2. Force Login Screen --}}
                <a href="{{ route('login') }}" class="btn btn-outline-dark btn-lg px-4" id="403-force-login">
                    <i class="fas fa-user-lock me-2"></i> {{ __('Switch Account') }}
                </a>

                {{-- 3. Emergency Logout --}}
                <a href="{{ url('/logout') }}" class="btn btn-danger btn-lg px-4 shadow-sm" id="403-force-logout">
                    <i class="fas fa-sign-out-alt me-2"></i> {{ __('Sign Out') }}
                </a>
            </div>

            <hr class="my-5 opacity-25">

            <div class="text-muted small">
                <p>{{ __('If you believe this is an error, please contact the site administrator.') }}</p>
                <div class="mt-2">
                    <span class="badge bg-light text-dark border p-2 px-3 shadow-xs">
                        <i class="fas fa-info-circle me-1 opacity-50"></i> {{ __('Reference ID:') }} #{{ strtoupper(bin2hex(random_bytes(4))) }}
                    </span>
                </div>
            </div>

        </div>
    </div>
</div>

<style>
    /* Premium aesthetics for the 403 page */
    .error-illustration i {
        font-size: 0.8em;
        vertical-align: middle;
        margin-right: -10px;
        opacity: 0.9;
    }
    
    .shadow-xs {
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    body {
        background-color: #f8fafc;
    }
    
    .btn-primary {
        background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        border: none;
    }
    
    .btn-primary:hover {
        background: linear-gradient(135deg, #4338ca 0%, #3730a3 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }

    .btn-lg {
        border-radius: 12px;
        padding: 0.8rem 1.5rem;
    }
</style>
@endsection
