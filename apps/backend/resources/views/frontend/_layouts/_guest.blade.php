<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', __('Login')) | {{ setting('site_name', config('app.name')) }}</title>
    
    {{-- Favicons --}}
    <link rel="icon" type="image/x-icon" href="{{ asset('storage/' . setting('site_favicon')) }}"> 
    <link rel="apple-touch-icon" href="{{ asset('storage/' . setting('site_favicon')) }}">
    
    @include('frontend._partials._guest_assets')
    <link rel="stylesheet" href="{{ asset('frontend/css/auth.css') }}">
    
    @stack('styles')
</head>
<body class="@yield('body_class', 'has-body-glow')">

    <main class="auth-wrapper overflow-hidden">
        <div class="container-fluid p-0">
            <div class="row g-0 min-vh-100">
                @yield('content')
            </div>
        </div>
    </main>

    <script src="{{ asset('frontend/js/auth.js') }}"></script>
    @stack('scripts')
</body>
</html>
