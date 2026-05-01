@extends('frontend._layouts._guest')

@section('title', 'Partner Gateway | Login')
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Marketing & Brand Visuals --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
    
    <div class="position-absolute translate-middle" style="top: 20%; left: 20%; width: 500px; height: 500px; background: rgba(70,165,172,0.1); filter: blur(120px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1 text-center" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm border border-white border-opacity-10">
            <i class="bi bi-person-workspace text-primary display-4"></i>
        </div>
        
        <h1 class="display-5 fw-bold mb-3" style="font-family: 'Outfit', sans-serif;">
            Partner <span class="text-primary">Ecosystem</span>
        </h1>
        
        <p class="lead opacity-75 mb-5">
            Access your vendor dashboard to manage listings, track earnings, and engage with the marketplace global audience.
        </p>

        <div class="row g-4 text-start mt-4">
            <div class="col-6">
                <div class="d-flex align-items-center gap-3">
                    <div class="icon-sm bg-white bg-opacity-10 rounded-3 p-2">
                        <i class="bi bi-graph-up-arrow text-primary"></i>
                    </div>
                    <span class="small fw-medium">Real-time Analytics</span>
                </div>
            </div>
            <div class="col-6">
                <div class="d-flex align-items-center gap-3">
                    <div class="icon-sm bg-white bg-opacity-10 rounded-3 p-2">
                        <i class="bi bi-wallet2 text-primary"></i>
                    </div>
                    <span class="small fw-medium">Unified Payouts</span>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Functional Login Form --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white py-5 position-relative">
    <div class="w-100 px-4 px-md-5" style="max-width: 520px;">
        
        <div class="mb-5">
            <div class="d-lg-none mb-4 text-center">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-3 mb-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{{ setting('site_name', config('app.name')) }}</span>
                </div>
            </div>
            
            <h2 class="h3 fw-bold text-dark mb-2">Partner Sign In</h2>
            <p class="text-muted small text-uppercase letter-spacing-1 font-weight-bold">Authorized Merchant Access Only</p>
        </div>

        @if (session('status'))
            <div class="alert alert-success border-0 shadow-sm small mb-4 py-3 rounded-4" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i> {{ session('status') }}
            </div>
        @endif

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4" role="alert">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('login') }}" class="mb-4">
            @csrf
            
            <div class="mb-4">
                <label for="email" class="form-label fw-bold text-muted small uppercase">Merchant ID / Email</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-envelope text-muted"></i></span>
                    <input type="email" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('email')]) id="email" name="email" value="{{ old('email') }}" placeholder="partner@sellio.com" required autofocus>
                </div>
            </div>

            <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <label for="password" class="form-label fw-bold text-muted small uppercase mb-0">Secret Credential</label>
                    @if (Route::has('password.request'))
                        <a href="{{ route('password.request') }}" class="small fw-bold text-decoration-none text-primary">{{ __('Forgot password?') }}</a>
                    @endif
                </div>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-lock text-muted"></i></span>
                    <input type="password" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('password')]) id="password" name="password" placeholder="••••••••" required autocomplete="current-password">
                </div>
            </div>
            
            <div class="mb-4">
                <div class="form-check custom-check">
                    <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                    <label class="form-check-label small text-muted ms-1" for="remember">
                        Remember this workstation for 30 days
                    </label>
                </div>
            </div>

            <div class="d-grid mb-4">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3 shadow-lg border-0 rounded-4 text-uppercase letter-spacing-1">
                    ENTER ECOSYSTEM
                </button>
            </div>
        </form>

        <div class="text-center pt-3 border-top">
            <p class="mb-0 small text-muted">
                {{ __("New to the partner network?") }} 
                <a href="{{ route('register') }}" class="fw-bold text-decoration-none ms-1 text-primary">
                    {{ __('Apply for Merchant Account') }}
                </a>
            </p>
        </div>
    </div>

    <div class="position-absolute bottom-0 start-0 w-100 p-4 text-center d-none d-lg-block">
        <span class="text-muted small">&copy; {{ date('Y') }} {{ setting('site_name', config('app.name')) }}. Secure Partner Portal.</span>
    </div>
</div>

@endsection

@push('styles')
<style>
    :root { --primary: #46a5ac; }
    .text-primary { color: var(--primary) !important; }
    .bg-primary { background-color: var(--primary) !important; }
    .btn-primary { background: linear-gradient(135deg, #46a5ac 0%, #3d8f95 100%) !important; }
    .letter-spacing-1 { letter-spacing: 1px; }
    .font-weight-bold { font-weight: 700; }
    .uppercase { text-transform: uppercase; }
    .icon-sm { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; }
</style>
@endpush
