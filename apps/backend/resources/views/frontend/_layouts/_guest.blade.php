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
    
    {{-- Core Assets --}}
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    {{-- Dynamic Theme Fonts --}}
    @if(isset($activeTheme) && $activeTheme->variables)
        @php
            $fonts = [];
            foreach (['--font-family-base', '--font-family-heading'] as $key) {
                if (isset($activeTheme->variables[$key])) {
                    if (preg_match("/'([^']+)'/", $activeTheme->variables[$key], $matches)) {
                        $fonts[] = str_replace(' ', '+', $matches[1]) . ':wght@400;500;600;700;800';
                    }
                }
            }
            $fontQuery = implode('&family=', array_unique($fonts));
        @endphp
        @if($fontQuery)
            <link href="https://fonts.googleapis.com/css2?family={{ $fontQuery }}&display=swap" rel="stylesheet">
        @endif
    @endif

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    
    {{-- Theme CSS --}}
    <link rel="stylesheet" href="{{ asset('frontend/css/style.css') }}">
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
