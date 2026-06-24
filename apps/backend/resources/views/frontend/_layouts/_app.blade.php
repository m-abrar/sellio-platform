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

    {{-- Open Graph --}}
    @php
        $_ogTitle = $__env->yieldContent('og_title') ?: strip_tags($__env->yieldContent('title', $siteName ?? config('app.name')));
        $_ogDesc  = $__env->yieldContent('og_description') ?: strip_tags($__env->yieldContent('meta_description', ''));
        $_ogImage = $__env->yieldContent('og_image') ?: asset('images/app-logo.webp');
        $_ogType  = $__env->yieldContent('og_type') ?: 'website';
    @endphp
    <meta property="og:type"        content="{{ $_ogType }}">
    <meta property="og:url"         content="{{ url()->current() }}">
    <meta property="og:title"       content="{{ $_ogTitle }}">
    <meta property="og:description" content="{{ $_ogDesc }}">
    <meta property="og:image"       content="{{ $_ogImage }}">
    <meta property="og:site_name"   content="{{ $siteName ?? config('app.name') }}">
    <meta name="twitter:card"        content="summary_large_image">
    <meta name="twitter:title"       content="{{ $_ogTitle }}">
    <meta name="twitter:description" content="{{ $_ogDesc }}">
    <meta name="twitter:image"       content="{{ $_ogImage }}">
    
    <link rel="icon" type="image/x-icon" href="{{ $siteFavicon }}">
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

<body @class(array_merge(
    explode(' ', 'no-js antialiased frontend-site ' . trim($__env->yieldContent('body_class') ?: 'has-body-glow bg-light')),
    auth()->check() && auth()->user()->can('manage-pages') ? ['has-admin-bar'] : []
))>

    @auth
        @can('manage-pages')
            @include('admin._partials._adminbar')
        @endcan
    @endauth

    <header @class([
        'main-header',
        'main-header--home border-0 bg-transparent position-absolute top-0 start-0 w-100' => request()->routeIs('index', 'home'),
        'border-bottom bg-white sticky-top' => ! request()->routeIs('index', 'home'),
    ]) role="banner">
        @includeIf('frontend._partials._header')
    </header>
    
    <main id="main-content" class="frontend-main min-vh-100" role="main">
        @yield('hero')
        @yield('content')
    </main>
    
    <footer class="main-footer footer-section" role="contentinfo">
        @includeIf('frontend._partials._footer')
    </footer>

    @stack('modals')
    @stack('scripts')
    <script>
    (function(){
        var nav = document.querySelector('[data-navbar-scroll]');
        if (!nav) return;
        function tick(){ nav.classList.toggle('scrolled', window.scrollY > 60); }
        window.addEventListener('scroll', tick, { passive: true });
        tick();
    })();
    </script>
</body>
</html>
