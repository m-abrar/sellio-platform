<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ get_layout_direction() }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <meta name="description" content="{{ strip_tags($__env->yieldContent('meta_description', config('app.name'))) }}">
    <title>@yield('title', __('Welcome')) | {{ $siteName ?? config('app.name') }}</title>

    <link rel="canonical" href="{{ url()->current() }}">
    
    <link rel="icon" type="image/x-icon" href="{{ $siteFavicon }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="stylesheet" href="{{ asset('frontend/css/style.css') }}">
    
    @auth
        @can('manage-pages')
            @vite(['resources/css/admin-bar.css', 'resources/css/editable-ui.css'])
        @endcan
    @endauth

    @yield('head_extra')
    @stack('styles')
</head>

<body class="no-js antialiased has-body-glow @yield('body_class')">

    @auth
        @can('manage-pages')
            @include('admin._partials._adminbar')
        @endcan
    @endauth

    <header class="main-header border-bottom bg-white sticky-top" role="banner">
        {{-- Look how clean this is now --}}
        @includeIf('frontend._partials._header')
    </header>
    
    <main id="main-content" class="min-vh-100" role="main">
        @yield('hero')
        <div class="container-xl">
            @yield('content')
        </div>
    </main>
    
    <footer class="main-footer bg-dark footer-section" role="contentinfo">
        @includeIf('frontend._partials._footer')
    </footer>

    @stack('modals')
    @stack('scripts')
</body>
</html>
