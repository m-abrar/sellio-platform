@extends('frontend._layouts._guest')

@section('title', 'Login')

@section('content')
    <h2 class="h5 fw-bold text-center mb-4">Sign in to your Account</h2>
    
    {{-- Session Status/Errors (Use standard HTML for better Bootstrap integration) --}}
    @if (session('status'))
        <div class="alert alert-success small mb-4" role="alert">{{ session('status') }}</div>
    @endif
    @if ($errors->any())
        <div class="alert alert-danger small mb-4">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('login') }}">
        @csrf

        {{-- Email Address --}}
        <div class="mb-3">
            <label for="email" class="form-label small fw-bold">Email</label>
            <input id="email" class="form-control" type="email" name="email" value="{{ old('email') }}" required autofocus />
        </div>

        {{-- Password --}}
        <div class="mb-3">
            <label for="password" class="form-label small fw-bold">Password</label>
            <input id="password" class="form-control" type="password" name="password" required autocomplete="current-password" />
        </div>

        {{-- Remember Me & Forgot Password --}}
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="form-check">
                <input id="remember_me" type="checkbox" class="form-check-input" name="remember">
                <label for="remember_me" class="form-check-label small">Remember me</label>
            </div>
            
            @if (Route::has('password.request'))
                <a class="small text-muted text-decoration-none" href="{{ route('password.request') }}">
                    Forgot your password?
                </a>
            @endif
        </div>

        <div class="d-grid gap-2">
            <button class="btn btn-primary fw-bold py-2">
                Log in
            </button>
            <a href="{{ route('register') }}" class="btn btn-outline-secondary py-2">
                Need an account? Register
            </a>
        </div>
    </form>
@endsection
