@extends('frontend._layouts._guest')

@section('title', 'Partner Onboarding | Merchant Registration')
@section('body_class', 'has-body-glow')

@section('content')

{{-- Left Side: Value Proposition --}}
<div class="col-lg-6 d-none d-lg-flex flex-column align-items-center justify-content-center position-relative p-5 text-white overflow-hidden" 
     style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);">
    
    <div class="position-absolute translate-middle" style="bottom: 20%; right: 20%; width: 500px; height: 500px; background: rgba(70,165,172,0.1); filter: blur(120px); border-radius: 50%;"></div>
    
    <div class="position-relative z-1" style="max-width: 480px;">
        <div class="mb-4 d-inline-block p-3 bg-white bg-opacity-10 rounded-4 shadow-sm border border-white border-opacity-10">
            <i class="bi bi-rocket-takeoff text-primary display-4"></i>
        </div>
        
        <h1 class="display-5 fw-bold mb-4" style="font-family: 'Outfit', sans-serif;">
            Join the <span class="text-primary">Master</span> Network
        </h1>
        
        <div class="onboarding-steps">
            <div class="d-flex gap-3 mb-4">
                <div class="step-num text-primary fw-bold fs-4">01</div>
                <div>
                    <h6 class="fw-bold mb-1">Create Identity</h6>
                    <p class="small opacity-75">Setup your merchant profile and secure your credentials.</p>
                </div>
            </div>
            <div class="d-flex gap-3 mb-4">
                <div class="step-num text-primary fw-bold fs-4">02</div>
                <div>
                    <h6 class="fw-bold mb-1">Business Verification</h6>
                    <p class="small opacity-75">Submit your store details for rapid catalog activation.</p>
                </div>
            </div>
            <div class="d-flex gap-3">
                <div class="step-num text-primary fw-bold fs-4">03</div>
                <div>
                    <h6 class="fw-bold mb-1">Start Scaling</h6>
                    <p class="small opacity-75">Leverage our global traffic and advanced checkout system.</p>
                </div>
            </div>
        </div>
    </div>
</div>

{{-- Right Side: Registration Form --}}
<div class="col-12 col-lg-6 d-flex align-items-center justify-content-center bg-white py-5 position-relative">
    <div class="w-100 px-4 px-md-5" style="max-width: 520px;">
        
        <div class="mb-5">
            <div class="d-lg-none mb-4 text-center">
                <div class="d-inline-flex align-items-center gap-2 text-primary fw-bolder fs-3 mb-2">
                    <i class="bi bi-rocket-takeoff"></i>
                    <span>{{ setting('site_name', config('app.name')) }}</span>
                </div>
            </div>
            
            <h2 class="h3 fw-bold text-dark mb-2">Merchant Onboarding</h2>
            <p class="text-muted small text-uppercase letter-spacing-1 font-weight-bold">Start your global trade journey today</p>
        </div>

        @if ($errors->any())
            <div class="alert alert-danger border-0 shadow-sm small mb-4 py-3 rounded-4" role="alert">
                <ul class="mb-0 ps-3">
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <form method="POST" action="{{ route('register') }}" class="mb-4">
            @csrf
            
            <div class="mb-3">
                <label for="name" class="form-label fw-bold text-muted small uppercase">Full Legal Name</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-person text-muted"></i></span>
                    <input type="text" name="name" id="name" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('name')]) value="{{ old('name') }}" required placeholder="e.g. Alexander Pierce" autofocus>
                </div>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label fw-bold text-muted small uppercase">Work Email Address</label>
                <div class="input-group">
                    <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-envelope text-muted"></i></span>
                    <input type="email" name="email" id="email" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('email')]) value="{{ old('email') }}" required placeholder="alex@company.com">
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="password" class="form-label fw-bold text-muted small uppercase">Security Key</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-lock text-muted"></i></span>
                        <input type="password" name="password" id="password" @class(['form-control bg-light border-0 px-3', 'is-invalid' => $errors->has('password')]) required placeholder="••••••••">
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <label for="password_confirmation" class="form-label fw-bold text-muted small uppercase">Confirm Key</label>
                    <div class="input-group">
                        <span class="input-group-text bg-light border-0 px-3"><i class="bi bi-shield-lock text-muted"></i></span>
                        <input type="password" name="password_confirmation" id="password_confirmation" class="form-control bg-light border-0 px-3" required placeholder="••••••••">
                    </div>
                </div>
            </div>
            
            <div class="mb-4 pt-2">
                <div class="form-check custom-check">
                    <input class="form-check-input" type="checkbox" name="terms" id="terms" required>
                    <label class="form-check-label small text-muted ms-1" for="terms">
                        I agree to the <a href="#" class="text-primary text-decoration-none fw-bold">Master Service Agreement</a> and Privacy Policy.
                    </label>
                </div>
            </div>

            <div class="d-grid mb-4">
                <button type="submit" class="btn btn-primary btn-lg fw-bold py-3 shadow-lg border-0 rounded-4 text-uppercase letter-spacing-1">
                    INITIALIZE ONBOARDING
                </button>
            </div>
        </form>

        <div class="text-center pt-3 border-top">
            <p class="mb-0 small text-muted">
                {{ __("Already part of the ecosystem?") }} 
                <a href="{{ route('login') }}" class="fw-bold text-decoration-none ms-1 text-primary">
                    {{ __('Partner Sign In') }}
                </a>
            </p>
        </div>
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
    .step-num { width: 30px; }
</style>
@endpush
