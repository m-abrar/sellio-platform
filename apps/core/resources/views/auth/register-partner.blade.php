@extends('frontend._layouts._guest')

@section('title', 'Register')

@section('content')
    <h2 class="h5 fw-bold text-center mb-4">Create Your Account</h2>

    {{-- Validation Errors --}}
    @if ($errors->any())
        <div class="alert alert-danger small mb-4">
            <ul class="mb-0">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('register') }}">
        @csrf

        {{-- Name --}}
        <div class="mb-3">
            <label for="name" class="form-label small fw-bold">Name</label>
            <input id="name" class="form-control" type="text" name="name" value="{{ old('name') }}" required autofocus />
        </div>

        {{-- Email Address --}}
        <div class="mb-3">
            <label for="email" class="form-label small fw-bold">Email</label>
            <input id="email" class="form-control" type="email" name="email" value="{{ old('email') }}" required />
        </div>

        {{-- Password --}}
        <div class="mb-3">
            <label for="password" class="form-label small fw-bold">Password</label>
            <input id="password" class="form-control" type="password" name="password" required autocomplete="new-password" />
        </div>

        {{-- Confirm Password --}}
        <div class="mb-4">
            <label for="password_confirmation" class="form-label small fw-bold">Confirm Password</label>
            <input id="password_confirmation" class="form-control" type="password" name="password_confirmation" required />
        </div>

        <div class="d-grid gap-2">
            <button class="btn btn-primary fw-bold py-2">
                Register
            </button>
        </div>

        <div class="text-center mt-3">
            <a class="small text-muted text-decoration-none" href="{{ route('login') }}">
                Already have an account? Sign In
            </a>
        </div>
    </form>
@endsection
