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

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    @if(!empty($themeStyleCSS))
        <link rel="stylesheet" href="{{ asset($themeStyleCSS) }}">
    @endif
    
    @auth
        @can('manage-pages')
            @vite(['resources/css/admin-bar.css', 'resources/css/editable-ui.css'])
        @endcan
    @endauth

    @yield('head_extra')
    @stack('styles')
</head>

<body class="no-js antialiased @yield('body_class')">

    @auth
        @can('manage-pages')
            @include('dashboard.admin._partials._adminbar')
        @endcan
    @endauth

    <header class="main-header border-bottom bg-white sticky-top" role="banner">
        {{-- Look how clean this is now --}}
        @includeIf('active_theme::_partials._nav')
    </header>
    
    <main id="main-content" class="min-vh-100" role="main">
        @yield('hero')
        <div class="container-xl">
            @yield('content')
        </div>
    </main>
    
    <footer class="main-footer bg-dark footer-section" role="contentinfo">
        @includeIf('active_theme::_partials._footer')
    </footer>

    @stack('modals')
    @stack('scripts')
</body>
</html>